'use client';

import { ResumeData } from '@/app/page';
import { forwardRef } from 'react';

interface HarvardResumeProps {
    data: ResumeData;
}

export const HarvardResume = forwardRef<HTMLDivElement, HarvardResumeProps>(
    function HarvardResume({ data }, ref) {
        return (
            <div
                className="harvard-resume-root"
                ref={ref}
                style={{
                    width: '8.5in',
                    minHeight: '11in',
                    padding: '0.5in 0.6in',
                    backgroundColor: 'white',
                    fontFamily: 'Times New Roman, Georgia, serif',
                    fontSize: '10pt',
                    lineHeight: '1.3',
                    color: '#000',
                    boxSizing: 'border-box',
                    // Override global CSS variables that use oklch() to safe hex values for html2pdf
                    // @ts-ignore
                    '--background': '#ffffff',
                    '--foreground': '#000000',
                    '--card': '#ffffff',
                    '--card-foreground': '#000000',
                    '--popover': '#ffffff',
                    '--popover-foreground': '#000000',
                    '--primary': '#000000',
                    '--primary-foreground': '#ffffff',
                    '--secondary': '#f3f4f6',
                    '--secondary-foreground': '#111827',
                    '--muted': '#f3f4f6',
                    '--muted-foreground': '#6b7280',
                    '--accent': '#f3f4f6',
                    '--accent-foreground': '#111827',
                    '--destructive': '#ef4444',
                    '--destructive-foreground': '#ffffff',
                    '--border': '#e5e7eb',
                    '--input': '#e5e7eb',
                    '--ring': '#000000',
                }}
            >
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .harvard-resume-root * {
                        border-color: transparent;
                        outline: none;
                    }
                `}} />

                {/* Header - Name */}
                <div style={{ textAlign: 'center', marginBottom: '4px' }}>
                    <h1
                        style={{
                            fontSize: '18pt',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            margin: 0,
                            letterSpacing: '1px',
                        }}
                    >
                        {data.name || 'YOUR NAME'}
                    </h1>
                </div>

                {/* Contact Info */}
                <div
                    style={{
                        textAlign: 'center',
                        fontSize: '9pt',
                        marginBottom: '12px',
                        borderBottom: '1px solid #000',
                        paddingBottom: '8px',
                    }}
                >
                    {[data.address, data.phone_number ? `P: ${data.phone_number}` : '']
                        .filter(Boolean)
                        .join(' | ')}
                </div>

                {/* Education Section */}
                {data.education && data.education.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                        <SectionHeader>EDUCATION</SectionHeader>
                        {data.education.map((edu, idx) => (
                            <div key={idx} style={{ marginBottom: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <span style={{ fontWeight: 'bold' }}>{edu.school}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span>{edu.duration ? extractLocation(edu.school) : ''}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <span style={{ fontStyle: 'italic' }}>{edu.course}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontStyle: 'italic' }}>{edu.duration}</span>
                                    </div>
                                </div>
                                {edu.descriptions && edu.descriptions.length > 0 && (
                                    <div style={{ marginLeft: '0' }}>
                                        {edu.descriptions.map((desc, didx) => (
                                            <div key={didx} style={{ fontSize: '9pt' }}>
                                                {desc}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Work Experience Section */}
                {data.work_experience && data.work_experience.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                        <SectionHeader>WORK EXPERIENCE</SectionHeader>
                        {data.work_experience.map((job, idx) => (
                            <div key={idx} style={{ marginBottom: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <span style={{ fontWeight: 'bold' }}>{job.position}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontStyle: 'italic' }}>{job.duration}</span>
                                    </div>
                                </div>
                                {job.descriptions && job.descriptions.length > 0 && (
                                    <ul
                                        style={{
                                            margin: '2px 0 0 14px',
                                            padding: 0,
                                            listStyleType: 'disc',
                                        }}
                                    >
                                        {job.descriptions.map((desc, didx) => (
                                            <li key={didx} style={{ fontSize: '9pt', marginBottom: '1px' }}>
                                                {desc}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Projects Section */}
                {data.projects && data.projects.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                        <SectionHeader>PROJECTS</SectionHeader>
                        {data.projects.map((project, idx) => (
                            <div key={idx} style={{ marginBottom: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <span style={{ fontWeight: 'bold' }}>{project.project_title}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontStyle: 'italic' }}>{project.dataset}</span>
                                    </div>
                                </div>
                                {project.project_description && (
                                    <div style={{ fontSize: '9pt', fontStyle: 'italic' }}>
                                        {project.project_description}
                                    </div>
                                )}
                                {project.key_features && project.key_features.length > 0 && (
                                    <ul
                                        style={{
                                            margin: '2px 0 0 14px',
                                            padding: 0,
                                            listStyleType: 'disc',
                                        }}
                                    >
                                        {project.key_features.map((feature, fidx) => (
                                            <li key={fidx} style={{ fontSize: '9pt', marginBottom: '1px' }}>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
);

function SectionHeader({ children }: { children: React.ReactNode }) {
    return (
        <h2
            style={{
                fontSize: '10pt',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                margin: '0 0 4px 0',
                borderBottom: '1px solid #000',
                paddingBottom: '2px',
            }}
        >
            {children}
        </h2>
    );
}

function extractLocation(text: string): string {
    // Simple helper to extract location if present after comma
    const parts = text.split(',');
    if (parts.length > 1) {
        return parts.slice(1).join(',').trim();
    }
    return '';
}
