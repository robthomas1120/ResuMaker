'use client';

import { ResumeData } from '@/app/page';
import { useEffect, useState, useMemo } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: '0.5in 0.6in',
    fontFamily: 'Times-Roman',
    fontSize: 10,
    lineHeight: 1.3,
    color: '#000',
    backgroundColor: '#fff',
  },
  header: {
    textAlign: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contactInfo: {
    textAlign: 'center',
    fontSize: 9,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    paddingBottom: 8,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    paddingBottom: 2,
  },
  section: {
    marginBottom: 10,
  },
  entryContainer: {
    marginBottom: 8,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  entryTitle: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  entrySubtitle: {
    fontStyle: 'italic',
    fontSize: 10,
  },
  entryDate: {
    fontStyle: 'italic',
    fontSize: 10,
    textAlign: 'right',
  },
  bulletList: {
    marginTop: 2,
    marginLeft: 14,
  },
  bulletItem: {
    fontSize: 9,
    marginBottom: 1,
  },
  description: {
    fontSize: 9,
  },
});

// PDF Document component
function ResumeDocument({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.name || 'YOUR NAME'}</Text>
        </View>

        {/* Contact Info */}
        <View style={styles.contactInfo}>
          <Text>
            {[data.address, data.phone_number, data.email, data.website]
              .filter(Boolean)
              .join(' | ')}
          </Text>
        </View>

        {/* Summary */}
        {data.short_description && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Professional Summary</Text>
            <Text style={styles.description}>{data.short_description}</Text>
          </View>
        )}

        {/* Projects - First */}
        {data.projects && data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>PROJECTS</Text>
            {data.projects.map((project, idx) => (
              <View key={idx} style={styles.entryContainer}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>{project.project_title}</Text>
                  <Text style={styles.entryDate}>{project.dataset || ''}</Text>
                </View>
                {project.project_description && (
                  <Text style={styles.description}>
                    {project.project_description}
                  </Text>
                )}
                {project.key_features && project.key_features.length > 0 && (
                  <View style={styles.bulletList}>
                    {project.key_features.map((feature, fidx) => (
                      <Text key={fidx} style={styles.bulletItem}>
                        • {feature}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Work Experience - Second */}
        {data.work_experience && data.work_experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>WORK EXPERIENCE</Text>
            {data.work_experience.map((job, idx) => (
              <View key={idx} style={styles.entryContainer}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>{job.position}</Text>
                  <Text style={styles.entryDate}>{job.duration || ''}</Text>
                </View>
                {job.descriptions && job.descriptions.length > 0 && (
                  <View style={styles.bulletList}>
                    {job.descriptions.map((desc, didx) => (
                      <Text key={didx} style={styles.bulletItem}>
                        • {desc}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education - Last */}
        {data.education && data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>EDUCATION</Text>
            {data.education.map((edu, idx) => (
              <View key={idx} style={styles.entryContainer}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>{edu.school}</Text>
                </View>
                <View style={styles.entryRow}>
                  <Text style={styles.entrySubtitle}>{edu.course}</Text>
                  <Text style={styles.entryDate}>{edu.duration || ''}</Text>
                </View>
                {edu.descriptions && edu.descriptions.length > 0 && (
                  <View style={styles.bulletList}>
                    {edu.descriptions.map((desc, didx) => (
                      <Text key={didx} style={styles.bulletItem}>
                        • {desc}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}

export function ResumePDFPreview({ data }: { data: ResumeData }) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize the document
  const document = useMemo(() => <ResumeDocument data={data} />, [data]);

  useEffect(() => {
    let cancelled = false;
    let currentUrl: string | null = null;

    const generatePDF = async () => {
      setIsGenerating(true);
      setError(null);

      try {
        const blob = await pdf(document).toBlob();
        if (cancelled) return;

        const url = URL.createObjectURL(blob);
        currentUrl = url;

        // Revoke previous URL
        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl);
        }

        setPdfUrl(url);
      } catch (err) {
        if (cancelled) return;
        console.error('Error generating PDF:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate PDF');
      } finally {
        if (!cancelled) {
          setIsGenerating(false);
        }
      }
    };

    const timeoutId = setTimeout(generatePDF, 500);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [data]);

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      <div className="flex-1 bg-white rounded-lg overflow-hidden flex items-center justify-center w-full max-w-4xl shadow-lg" style={{ minHeight: '850px' }}>
        {isGenerating && !pdfUrl && (
          <div className="text-gray-500 flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span>Generating PDF...</span>
          </div>
        )}

        {error && (
          <div className="text-red-500 flex flex-col items-center gap-2 p-4 text-center">
            <span className="font-semibold">Error generating PDF</span>
            <span className="text-sm">{error}</span>
          </div>
        )}

        {pdfUrl && !error && (
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            className="w-full h-full"
            style={{ border: 'none', minHeight: '850px' }}
            title="Resume PDF Preview"
          />
        )}

        {!pdfUrl && !isGenerating && !error && (
          <div className="text-gray-400">Loading preview...</div>
        )}
      </div>

      {isGenerating && pdfUrl && (
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          Updating...
        </div>
      )}
    </div>
  );
}
