'use client';

import { useState, useRef } from 'react';
import { ResumeEditor } from '@/components/resume-editor';
import { ResumePDFPreview } from '@/components/resume-pdf-preview';

export interface ResumeData {
  name: string;
  address: string;
  phone_number: string;
  email: string;
  website: string;
  projects: Array<{
    project_title: string;
    project_description: string;
    dataset: string;
    key_features: string[];
  }>;
  work_experience: Array<{
    duration: string;
    position: string;
    descriptions: string[];
  }>;
  education: Array<{
    duration: string;
    school: string;
    course: string;
    descriptions: string[];
  }>;
}

const DEFAULT_RESUME: ResumeData = {
  name: 'Your Name',
  address: 'City, State',
  phone_number: '',
  email: '',
  website: '',
  projects: [],
  work_experience: [],
  education: [],
};

export default function Page() {
  const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_RESUME);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Left Panel - Editor */}
        <div className="w-1/2 border-r border-gray-200 overflow-y-auto max-h-screen">
          <ResumeEditor data={resumeData} onDataChange={setResumeData} />
        </div>

        {/* Right Panel - PDF Preview */}
        <div className="w-1/2 overflow-y-auto max-h-screen bg-gray-50 p-8">
          <ResumePDFPreview data={resumeData} />
        </div>
      </div>
    </div>
  );
}
