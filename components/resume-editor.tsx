'use client';

import React, { useRef } from "react"

import { ResumeData } from '@/app/page';
import { HeaderEditor } from './editors/header-editor';
import { SectionEditor } from './editors/section-editor';
import { PDFExport } from './pdf-export';
import { useState } from 'react';

interface ResumeEditorProps {
  data: ResumeData;
  onDataChange: (data: ResumeData) => void;
}

export type SectionType = 'projects' | 'work_experience' | 'education' | 'skills';

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
    { type: 'skills', label: 'Skills', order: 3 },
  ]);

  const [draggedSection, setDraggedSection] = useState<SectionType | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<SectionType>>(
    new Set(['projects', 'work_experience', 'education', 'skills'])
  );

  // ── Save / dirty tracking ──────────────────────────────────────────────
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null);
  // Snapshot of the last-imported or last-saved JSON — initialized from initial data
  const [lastSavedJson, setLastSavedJson] = useState<string>(() => JSON.stringify(data));
  const currentJson = JSON.stringify(data);
  const hasUnsavedChanges = currentJson !== lastSavedJson;

  // Warn before closing/refreshing when there are unsaved changes
  React.useEffect(() => {
    if (!hasUnsavedChanges) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

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

  // ── Import JSON ────────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File System Access API path (Chrome/Edge) — gives us a writable handle
  const handleImportWithPicker = async () => {
    try {
      const [handle] = await (window as any).showOpenFilePicker({
        types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }],
        multiple: false,
      });
      const file: File = await handle.getFile();
      const content = await file.text();
      const importedData = JSON.parse(content) as ResumeData;
      onDataChange(importedData);
      setFileHandle(handle);
      setLastSavedJson(JSON.stringify(importedData));
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        alert('Could not open file. Please try again.');
        console.error(err);
      }
    }
  };

  // Fallback for browsers without File System Access API
  const handleJsonImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content) as ResumeData;
        onDataChange(importedData);
        // No file handle available in fallback mode → Save won't appear
        setFileHandle(null);
        setLastSavedJson(JSON.stringify(importedData));
      } catch (error) {
        alert('Invalid JSON file. Please check the format.');
        console.error(error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleImportClick = () => {
    if ('showOpenFilePicker' in window) {
      handleImportWithPicker();
    } else {
      fileInputRef.current?.click();
    }
  };

  // ── Save (overwrite imported file or export new) ────────────────────────────────────
  const handleSave = async () => {
    // If we don't have a writable file handle (fallback or new file), just export it like regular save
    if (!fileHandle) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${data.name?.replace(/\s+/g, '_') || 'resume'}_data.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setLastSavedJson(JSON.stringify(data));
      return;
    }

    try {
      // In some security contexts Chrome forces "Save As" when calling createWritable on an open handle.
      // Calling showSaveFilePicker with the suggested file handle ensures we overwrite the existing file.
      const saveHandle = await (window as any).showSaveFilePicker({
        suggestedName: fileHandle.name,
        types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }],
      });
      const writable = await saveHandle.createWritable();
      const content = JSON.stringify(data, null, 2);
      await writable.write(content);
      await writable.close();
      setFileHandle(saveHandle); // Update handle in case they chose a new file
      setLastSavedJson(JSON.stringify(data));
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        alert('Failed to save file. Please try again.');
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3 whitespace-nowrap">
          <h2 className="text-2xl font-bold text-black">Resume Editor</h2>
          {hasUnsavedChanges && (
            <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
              ● Unsaved
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleJsonImport}
            className="hidden"
          />
          <button
            onClick={handleImportClick}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 shrink-0"
          >
            Import JSON
          </button>

          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors shrink-0 ${
              hasUnsavedChanges
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Save
          </button>

          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${data.name?.replace(/\s+/g, '_') || 'resume'}_data.json`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50"
          >
            Export JSON
          </button>
          <button
            onClick={() => {
              const sampleData = {
                name: "Your Full Name",
                address: "City, State",
                phone_number: "09123456789",
                website: "linkedin.com/in/yourname",
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
                ],
                skills: [
                  "Skill 1 (e.g., JavaScript)",
                  "Skill 2 (e.g., Python)",
                  "Skill 3 (e.g., Figma)"
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
    </div >
  );
}
