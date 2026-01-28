'use client';

import { ResumeData } from '@/app/page';
import { SectionType } from '@/components/resume-editor';

interface SectionEditorProps {
  type: SectionType;
  data: ResumeData;
  onDataChange: (data: ResumeData) => void;
}

export function SectionEditor({ type, data, onDataChange }: SectionEditorProps) {
  const updateArrayItem = (index: number, field: string, value: string | string[]) => {
    const newData = { ...data };
    const array = newData[type] as any[];
    array[index] = { ...array[index], [field]: value };
    onDataChange(newData);
  };

  const addItem = () => {
    const newData = { ...data };
    const array = newData[type] as any[];
    
    if (type === 'projects') {
      array.push({
        project_title: '',
        project_description: '',
        dataset: '',
        key_features: [],
      });
    } else if (type === 'work_experience') {
      array.push({
        duration: '',
        position: '',
        descriptions: [],
      });
    } else if (type === 'education') {
      array.push({
        duration: '',
        school: '',
        course: '',
        descriptions: [],
      });
    }
    
    onDataChange(newData);
  };

  const removeItem = (index: number) => {
    const newData = { ...data };
    const array = newData[type] as any[];
    array.splice(index, 1);
    onDataChange(newData);
  };

  const addBullet = (index: number, field: 'descriptions' | 'key_features') => {
    const newData = { ...data };
    const array = newData[type] as any[];
    const item = array[index];
    if (!item[field]) {
      item[field] = [];
    }
    (item[field] as string[]).push('');
    onDataChange(newData);
  };

  const removeBullet = (index: number, field: 'descriptions' | 'key_features', bulletIndex: number) => {
    const newData = { ...data };
    const array = newData[type] as any[];
    const item = array[index];
    (item[field] as string[]).splice(bulletIndex, 1);
    onDataChange(newData);
  };

  const updateBullet = (index: number, field: 'descriptions' | 'key_features', bulletIndex: number, value: string) => {
    const newData = { ...data };
    const array = newData[type] as any[];
    const item = array[index];
    (item[field] as string[])[bulletIndex] = value;
    onDataChange(newData);
  };

  const items = data[type] as any[];

  return (
    <div className="space-y-4">
      {items.map((item, itemIdx) => (
        <div key={itemIdx} className="border border-gray-200 rounded p-3 bg-gray-50">
          {/* Type-specific fields */}
          {type === 'projects' && (
            <>
              <input
                type="text"
                value={item.project_title}
                onChange={(e) => updateArrayItem(itemIdx, 'project_title', e.target.value)}
                placeholder="Project Title"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                value={item.dataset}
                onChange={(e) => updateArrayItem(itemIdx, 'dataset', e.target.value)}
                placeholder="Dataset/Tech Stack"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <textarea
                value={item.project_description}
                onChange={(e) => updateArrayItem(itemIdx, 'project_description', e.target.value)}
                placeholder="Project description"
                rows={2}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div className="space-y-1 mb-2">
                {item.key_features?.map((feature: string, fidx: number) => (
                  <div key={fidx} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateBullet(itemIdx, 'key_features', fidx, e.target.value)}
                      placeholder="Key feature"
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                      onClick={() => removeBullet(itemIdx, 'key_features', fidx)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => addBullet(itemIdx, 'key_features')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Feature
              </button>
            </>
          )}

          {type === 'work_experience' && (
            <>
              <input
                type="text"
                value={item.position}
                onChange={(e) => updateArrayItem(itemIdx, 'position', e.target.value)}
                placeholder="Job Title"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                value={item.duration}
                onChange={(e) => updateArrayItem(itemIdx, 'duration', e.target.value)}
                placeholder="Duration (e.g., 2022 - Present)"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div className="space-y-1 mb-2">
                {item.descriptions?.map((desc: string, didx: number) => (
                  <div key={didx} className="flex gap-2">
                    <input
                      type="text"
                      value={desc}
                      onChange={(e) => updateBullet(itemIdx, 'descriptions', didx, e.target.value)}
                      placeholder="Achievement/responsibility"
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                      onClick={() => removeBullet(itemIdx, 'descriptions', didx)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => addBullet(itemIdx, 'descriptions')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Achievement
              </button>
            </>
          )}

          {type === 'education' && (
            <>
              <input
                type="text"
                value={item.course}
                onChange={(e) => updateArrayItem(itemIdx, 'course', e.target.value)}
                placeholder="Degree/Course"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                value={item.school}
                onChange={(e) => updateArrayItem(itemIdx, 'school', e.target.value)}
                placeholder="School/University"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                value={item.duration}
                onChange={(e) => updateArrayItem(itemIdx, 'duration', e.target.value)}
                placeholder="Duration (e.g., 2018 - 2022)"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div className="space-y-1 mb-2">
                {item.descriptions?.map((desc: string, didx: number) => (
                  <div key={didx} className="flex gap-2">
                    <input
                      type="text"
                      value={desc}
                      onChange={(e) => updateBullet(itemIdx, 'descriptions', didx, e.target.value)}
                      placeholder="Honor/achievement"
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                      onClick={() => removeBullet(itemIdx, 'descriptions', didx)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => addBullet(itemIdx, 'descriptions')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Honor
              </button>
            </>
          )}

          <button
            onClick={() => removeItem(itemIdx)}
            className="text-red-600 hover:text-red-700 text-sm font-medium mt-2"
          >
            Delete {type === 'work_experience' ? 'Experience' : type === 'education' ? 'Education' : 'Project'}
          </button>
        </div>
      ))}

      <button
        onClick={addItem}
        className="w-full px-3 py-2 bg-black text-white rounded text-sm font-medium hover:bg-gray-800"
      >
        + Add {type === 'work_experience' ? 'Experience' : type === 'education' ? 'Education' : 'Project'}
      </button>
    </div>
  );
}
