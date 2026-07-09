'use client';

import { useState } from 'react';

export function PromptCopyButton({ promptBody }: { promptBody?: string | null }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = async () => {
    if (!promptBody) {
      setError('No prompt body available to copy.');
      setCopied(false);
      return;
    }

    try {
      await navigator.clipboard.writeText(promptBody);
      setCopied(true);
      setError(null);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Unable to copy right now. Please try again.');
      setCopied(false);
    }
  };

  return (
    <div className="space-y-2">
      <button type="button" onClick={handleCopy} className="btn-primary w-full">
        {copied ? 'Copied' : 'Copy prompt'}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
