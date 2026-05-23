'use client';

import { useState } from 'react';
import CodeEditor from '../../../components/editor/CodeEditor';
import RunButton from '../../../components/editor/RunButton';
import OutputPanel from '../../../components/editor/OutputPanel';
import ErrorPanel from '../../../components/editor/ErrorPanel';
import { runMeowCode } from '../../../engine/meowRunner';

export default function PlaygroundPage({ params }) {
  const [code, setCode] = useState('// Write some Meow code here...\n\n');
  const [result, setResult] = useState(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState('');

  const callAITutor = async (execResult) => {
    setIsLoadingAI(true);
    setAiError('');
    setAiExplanation('');
    
    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          output: execResult.output || [],
          errors: execResult.errors || [],
          ast: execResult.ast,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get explanation');
      }

      const data = await response.json();
      setAiExplanation(data.explanation);
    } catch (error) {
      console.error('AI Tutor Error:', error);
      setAiError(error.message || 'Failed to get AI explanation. Make sure your GROQ_API_KEY is set in .env.local');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleRun = async () => {
    const execResult = runMeowCode(code);
    setResult(execResult);
    
    // Call AI tutor after execution
    await callAITutor(execResult);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#1E1E2E', color: '#CDD6F4', padding: '2rem' }}>
      <h1 style={{ color: '#F38BA8', marginBottom: '1rem' }}>Meow Playground</h1>
      
      <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
        {/* Left Side: Editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <CodeEditor value={code} onChange={setCode} />
          <RunButton onClick={handleRun} />
        </div>

        {/* Right Side: Output, Errors & AI Explanation */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
          <h3>Output Console</h3>
          <OutputPanel output={result?.output || []} />
          {result?.errors?.length > 0 && <ErrorPanel errors={result.errors} />}

          {/* AI Tutor Section */}
          {(aiExplanation || isLoadingAI || aiError) && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: '#313244',
              borderRadius: '0.5rem',
              borderLeft: '4px solid #A6E3A1',
            }}>
              <h4 style={{ color: '#A6E3A1', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🐱</span> AI Tutor
              </h4>
              
              {isLoadingAI && (
                <div style={{ color: '#CDD6F4', fontStyle: 'italic' }}>
                  <span>The cat is thinking</span>
                  <span style={{ animation: 'none' }}>...</span>
                </div>
              )}

              {aiError && (
                <div style={{ color: '#F38BA8' }}>
                  <strong>Error:</strong> {aiError}
                </div>
              )}

              {aiExplanation && (
                <div style={{
                  color: '#CDD6F4',
                  lineHeight: '1.5',
                  fontSize: '0.95rem',
                }}>
                  {aiExplanation}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
