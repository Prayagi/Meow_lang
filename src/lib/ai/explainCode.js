import MEOW_TUTOR_SYSTEM_PROMPT from './systemPrompt.js';

/**
 * Build the messages payload to send to an LLM. This module intentionally
 * does NOT call any external API — it only prepares the structured prompt
 * so the caller can decide when to send it (e.g. on user request).
 *
 * Input: a structured error object as produced by `MeowError.toErrorObject()`
 * and an optional codeContext (array of {line,text}).
 */
export function buildExplainMessages(errorObject) {
  if (!errorObject) return null;

  const userPayload = {
    instruction: 'Explain only the provided structured error. Do not infer or guess fixes. Use the codeContext to show corrected snippet if trivial.',
    error: errorObject,
  };

  return [
    { role: 'system', content: MEOW_TUTOR_SYSTEM_PROMPT },
    { role: 'user', content: JSON.stringify(userPayload) },
  ];
}

export default buildExplainMessages;
