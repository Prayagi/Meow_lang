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

  const handleRun = async () => {
    const execResult = runMeowCode(code);
    setResult(execResult);
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
        </div>
      </div>
    </div>
  );
}
