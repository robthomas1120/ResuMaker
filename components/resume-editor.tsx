'use client';

import React, { useRef } from "react"

import { ResumeData } from '@/app/page';
import { HeaderEditor } from './editors/header-editor';
import { SummaryEditor } from './editors/summary-editor';
import { SectionEditor } from './editors/section-editor';
import { PDFExport } from './pdf-export';
import { useState } from 'react';

interface ResumeEditorProps {
  data: ResumeData;
  onDataChange: (data: ResumeData) => void;
}

export type SectionType = 'projects' | 'work_experience' | 'education';

interface SectionConfig {
  type: SectionType;
  label: string;
  order: number;
}

export function ResumeEditor({ data, onDataChange }: ResumeEditorProps) {
  const [sections, setSections] = useState<SectionConfig[]>([
    { type: 'projects', label: 'Projects', order: 0 },
    { type: 'work_experience', label: 'Work Experience', order: 1 },
    { type: 'education', label: 'Education', order: 2 },
  ]);

  const [draggedSection, setDraggedSection] = useState<SectionType | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<SectionType>>(
    new Set(['projects', 'work_experience', 'education'])
  );

  const handleDragStart = (section: SectionType) => {
    setDraggedSection(section);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetSection: SectionType) => {
    if (!draggedSection) return;

    const newSections = [...sections];
    const draggedIdx = newSections.findIndex((s) => s.type === draggedSection);
    const targetIdx = newSections.findIndex((s) => s.type === targetSection);

    if (draggedIdx !== -1 && targetIdx !== -1) {
      [newSections[draggedIdx], newSections[targetIdx]] = [
        newSections[targetIdx],
        newSections[draggedIdx],
      ];
      setSections(newSections);
    }

    setDraggedSection(null);
  };

  const toggleSection = (section: SectionType) => {
    const newVisible = new Set(visibleSections);
    if (newVisible.has(section)) {
      newVisible.delete(section);
    } else {
      newVisible.add(section);
    }
    setVisibleSections(newVisible);
  };

  const getSortedSections = () => {
    return sections
      .filter((s) => visibleSections.has(s.type))
      .sort((a, b) => a.order - b.order);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleJsonImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content) as ResumeData;
        onDataChange(importedData);
      } catch (error) {
        alert('Invalid JSON file. Please check the format.');
        console.error(error);
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be imported again
    event.target.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">Resume Editor</h2>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleJsonImport}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50"
          >
            Import JSON
          </button>
          <button
            onClick={() => {
              const sampleData = {
                name: "Your Full Name",
                address: "City, State",
                phone_number: "09123456789",
                website: "linkedin.com/in/yourname",
                short_description: "Brief professional summary describing your experience and skills.",
                projects: [
                  {
                    project_title: "Project Name",
                    project_description: "Brief description of the project",
                    dataset: "Technologies used",
                    key_features: [
                      "Key feature or achievement 1",
                      "Key feature or achievement 2"
                    ]
                  }
                ],
                work_experience: [
                  {
                    duration: "Month Year – Present",
                    position: "Job Title, Company Name, Location",
                    descriptions: [
                      "Responsibility or achievement 1",
                      "Responsibility or achievement 2"
                    ]
                  }
                ],
                education: [
                  {
                    duration: "Year – Year",
                    school: "University Name, Location",
                    course: "Degree Name",
                    descriptions: [
                      "Relevant coursework or achievement",
                      "GPA or honors"
                    ]
                  }
                ]
              };
              const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'resume_template.json';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50"
          >
            Export Sample
          </button>
          <PDFExport data={data} />
        </div>
      </div>

      <div className="space-y-6">
        {/* Header */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-black mb-3">Header</h3>
          <HeaderEditor data={data} onDataChange={onDataChange} />
        </div>

        {/* Summary */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-black mb-3">Summary</h3>
          <SummaryEditor data={data} onDataChange={onDataChange} />
        </div>

        {/* Sections */}
        {getSortedSections().map((section) => (
          <div
            key={section.type}
            draggable
            onDragStart={() => handleDragStart(section.type)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(section.type)}
            className="border border-gray-200 rounded-lg p-4 cursor-move hover:border-gray-300 transition"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-black">{section.label}</h3>
              <button
                onClick={() => toggleSection(section.type)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded"
              >
                {visibleSections.has(section.type) ? 'Hide' : 'Show'}
              </button>
            </div>
            <SectionEditor
              type={section.type}
              data={data}
              onDataChange={onDataChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
