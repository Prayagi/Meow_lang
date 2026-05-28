import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { MEOW_TUTOR_SYSTEM_PROMPT } from '../../../../lib/ai/systemPrompt.js';

/**
 * API route: POST /api/ai/explain
 * 
 * Accepts code execution results (output, errors, AST) and uses Groq/Llama 3
 * to generate an AI explanation with a helpful tutor persona.
 * 
 * Request body:
 * {
 *   code: string,          // The source code that was executed
 *   output: string[],      // Array of output lines
 *   errors: object[],      // Array of error objects with type, message, line, column
 *   ast: object            // Abstract Syntax Tree (optional)
 * }
 * 
 * Response:
 * {
 *   explanation: string    // The AI-generated explanation
 * }
 */

export async function POST(request) {
  try {
    const { code, output, errors, ast } = await request.json();

    // Validate required fields
    if (!code) {
      return Response.json(
        { error: 'Missing required field: code' },
        { status: 400 }
      );
    }

    // Only run the AI when there is at least one error provided.
    if (!errors || errors.length === 0) {
      return Response.json({ error: 'No errors provided to explain.' }, { status: 400 });
    }

    // Use only the structured error (first one) and include any codeContext attached by the runner.
    const errorToExplain = errors[0];
    const userPayload = {
      error: errorToExplain,
      codeContext: errorToExplain.codeContext || null,
    };

    // Call Groq API using the AI SDK with a strict system prompt and the structured payload.
    const explanation = await generateText({
      model: groq('llama-3.1-8b-instant'),
      system: MEOW_TUTOR_SYSTEM_PROMPT,
      prompt: JSON.stringify(userPayload),
      temperature: 0.0,
      maxTokens: 400,
    });

    // Format the response to ensure proper line breaks
    const formattedExplanation = formatTutorResponse(explanation.text);

    return Response.json({
      explanation: formattedExplanation,
    });
  } catch (error) {
    console.error('AI Tutor API Error:', error);

    // Handle missing API key
    if (error.message?.includes('401') || error.message?.includes('API key')) {
      return Response.json(
        {
          error: 'API key not configured. Please add GROQ_API_KEY to your .env.local file.',
        },
        { status: 500 }
      );
    }

    return Response.json(
      { error: 'Failed to generate explanation: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * Formats the AI tutor response to ensure proper line breaks between sections
 */
function formatTutorResponse(response) {
  // If response already has good line breaks, keep them
  if (response.includes('\n\n')) {
    return response;
  }

  // Look for the 3 section keywords and add line breaks before them
  let formatted = response;

  // Add line breaks before "How to fix it?" and "Correct code:"
  formatted = formatted.replace(/\s+(How to fix it\?)/gi, '\n\nHow to fix it?');
  formatted = formatted.replace(/\s+(Correct code:)/gi, '\n\nCorrect code:');

  return formatted.trim();
}

/**
 * Builds a human-readable execution context string for the AI to analyze
 */
function buildExecutionContext(code, output, errors, ast) {
  let context = `Analyze this Meow language code:\n\n`;

  context += `Code:\n${code}\n\n`;

  if (errors && errors.length > 0) {
    context += `Errors:\n`;
    errors.forEach((err, index) => {
      context += `${index + 1}. ${err.type}: ${err.message}\n`;
      if (err.line !== undefined) {
        context += `   (Line ${err.line}${err.column !== undefined ? `, Column ${err.column}` : ''})\n`;
      }
    });
    
    // Special hint for the most common error
    const errorMessage = errors.map(e => e.message).join(' ');
    if (errorMessage.includes("Expected 'paw'")) {
      context += `\nIMPORTANT: This error means the code needs to be wrapped in paw { }\n`;
      context += `EVERY Meow program MUST have this structure:\n`;
      context += `paw {\n  [user code goes here]\n}\n`;
    }
    
    context += `\nExplain the error and show the fixed code.\n`;
  } else if (output && output.length > 0) {
    context += `Output: ${output.join(', ')}\n`;
    context += `The code executed successfully! Celebrate this success.\n`;
  } else {
    context += `The code executed with no output or errors.\n`;
  }

  return context;
}
