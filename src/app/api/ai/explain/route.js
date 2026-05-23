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

    // Build the prompt context from execution results
    const executionContext = buildExecutionContext(code, output, errors, ast);

    // Call Groq API using the AI SDK
    const explanation = await generateText({
      model: groq('llama-3.1-8b-instant'),
      system: MEOW_TUTOR_SYSTEM_PROMPT,
      prompt: executionContext,
      temperature: 0.7,
      maxTokens: 500,
    });

    return Response.json({
      explanation: explanation.text,
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
 * Builds a human-readable execution context string for the AI to analyze
 */
function buildExecutionContext(code, output, errors, ast) {
  let context = `Analyze this Meow language code execution:\n\n`;

  context += `**Code:**\n\`\`\`meow\n${code}\n\`\`\`\n\n`;

  if (errors && errors.length > 0) {
    context += `**Errors Occurred:**\n`;
    errors.forEach((err, index) => {
      context += `${index + 1}. [${err.type}] ${err.message}`;
      if (err.line !== undefined) {
        context += ` (Line ${err.line}${err.column !== undefined ? `, Column ${err.column}` : ''})`;
      }
      context += `\n`;
    });
    context += `\nPlease explain what went wrong and how to fix it.\n`;
  } else if (output && output.length > 0) {
    context += `**Output:**\n`;
    output.forEach((line) => {
      context += `${line}\n`;
    });
    context += `\nPlease explain what this code did and why the output is correct.\n`;
  } else {
    context += `The code executed successfully with no output or errors.\n`;
  }

  return context;
}
