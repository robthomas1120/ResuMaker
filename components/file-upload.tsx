'use client';

import React from "react"

import { useRef } from 'react';
import { ResumeData } from '@/app/page';

interface FileUploadProps {
  onUpload: (data: ResumeData) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as ResumeData;
        onUpload(data);
      } catch (error) {
        alert('Invalid JSON file. Please check the format.');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-md">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Resume Builder</h1>
          <p className="text-gray-600">Create professional Harvard-style resumes</p>
        </div>

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-gray-400 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>
          <p className="text-sm font-medium text-gray-700">Click to upload JSON file</p>
          <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="text-left">
          <p className="text-xs font-semibold text-gray-600 mb-2">Required JSON Structure:</p>
          <pre className="bg-gray-100 p-3 rounded text-xs text-gray-700 overflow-x-auto">
{`{
  "name": "string",
  "address": "string",
  "phone_number": "string",
  "short_description": "string",
  "projects": [...],
  "work_experience": [...],
  "education": [...]
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
