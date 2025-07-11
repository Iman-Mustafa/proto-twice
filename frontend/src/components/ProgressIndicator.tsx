import React from 'react';

export default function ProgressIndicator() {
  return (
    <div className="flex items-center justify-center my-4">
      <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12" cy="12" r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
      <span className="ml-3 text-sm text-indigo-700 font-medium">Generating your prototype...</span>
    </div>
  );
}