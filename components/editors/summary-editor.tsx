'use client';

import { ResumeData } from '@/app/page';

interface SummaryEditorProps {
  data: ResumeData;
  onDataChange: (data: ResumeData) => void;
}

export function SummaryEditor({ data, onDataChange }: SummaryEditorProps) {
  return (
    <textarea
      value={data.short_description}
      onChange={(e) =>
        onDataChange({
          ...data,
          short_description: e.target.value,
        })
      }
      placeholder="Brief professional summary..."
      rows={3}
      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
    />
  );
}
