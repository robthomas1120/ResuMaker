'use client';

import { ResumeData } from '@/app/page';

interface HeaderEditorProps {
  data: ResumeData;
  onDataChange: (data: ResumeData) => void;
}

export function HeaderEditor({ data, onDataChange }: HeaderEditorProps) {
  const handleChange = (field: keyof Omit<ResumeData, 'projects' | 'work_experience' | 'education' | 'short_description'>, value: string) => {
    onDataChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={data.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Full Name"
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />
      <input
        type="text"
        value={data.address}
        onChange={(e) => handleChange('address', e.target.value)}
        placeholder="City, State"
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />
      <input
        type="text"
        value={data.phone_number}
        onChange={(e) => handleChange('phone_number', e.target.value)}
        placeholder="Phone Number"
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />
      <input
        type="email"
        value={data.email || ''}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="Email Address"
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />
      <input
        type="text"
        value={data.website || ''}
        onChange={(e) => handleChange('website', e.target.value)}
        placeholder="Website (e.g. linkedin.com/in/yourname)"
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );
}
