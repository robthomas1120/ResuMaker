'use client';

import { ResumeData } from '@/app/page';
import { useState } from 'react';
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

interface PDFExportProps {
  data: ResumeData;
}

export function PDFExport({ data }: PDFExportProps) {
  const [isLoading, setIsLoading] = useState(false);

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      const blob = await pdf(<ResumeDocument data={data} />).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${data.name.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isLoading}
      className="px-4 py-2 bg-black text-white rounded text-sm font-medium hover:bg-gray-800 disabled:bg-gray-400"
    >
      {isLoading ? 'Generating...' : 'Export PDF'}
    </button>
  );
}
