import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import { 
  Download, 
  FileText, 
  Globe, 
  Printer, 
  CheckCircle, 
  Info,
  Copy,
  ExternalLink,
  AlertCircle,
  FileImage
} from 'lucide-react';
import { ResumeData, ResumeTemplate } from '../App';
import { ResumePreview } from './ResumePreview';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeData: ResumeData;
  template: ResumeTemplate;
}

export function ExportDialog({ open, onOpenChange, resumeData, template }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<'html' | 'pdf' | 'docx'>('html');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportFormats = [
    {
      id: 'html' as const,
      name: 'HTML',
      description: 'Web-ready format with interactive links and modern styling',
      icon: Globe,
      features: ['Interactive Links', 'ATS-Friendly', 'Mobile Responsive', 'Easy Sharing'],
      recommended: true,
      size: '~50KB'
    },
    {
      id: 'pdf' as const,
      name: 'PDF',
      description: 'Professional print-ready format with high-quality output',
      icon: FileText,
      features: ['Print-Optimized', 'Universal Compatibility', 'Fixed Layout', 'Professional'],
      recommended: false,
      size: '~200KB'
    },
    {
      id: 'docx' as const,
      name: 'DOCX',
      description: 'Microsoft Word format for easy editing and customization',
      icon: FileImage,
      features: ['Editable', 'Word Compatible', 'Standard Format', 'ATS-Friendly'],
      recommended: false,
      size: '~100KB'
    }
  ];

  // Check if resume has minimum required information
  const isResumeComplete = () => {
    const { personalInfo, experience, education, skills } = resumeData;
    return !!(
      personalInfo.fullName.trim() &&
      personalInfo.email.trim() &&
      (experience.length > 0 || education.length > 0) &&
      (skills.technical.length > 0 || skills.soft.length > 0)
    );
  };

  const getCompletionIssues = () => {
    const issues = [];
    if (!resumeData.personalInfo.fullName.trim()) issues.push('Full name is required');
    if (!resumeData.personalInfo.email.trim()) issues.push('Email address is required');
    if (resumeData.experience.length === 0 && resumeData.education.length === 0) {
      issues.push('At least one experience or education entry is required');
    }
    if (resumeData.skills.technical.length === 0 && resumeData.skills.soft.length === 0) {
      issues.push('At least one skill is required');
    }
    return issues;
  };

  const simulateProgress = (duration: number) => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setExportProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          resolve(true);
        }
      }, duration / 10);
    });
  };

  const handleExport = async () => {
    if (!isResumeComplete()) return;

    setIsExporting(true);
    setExportProgress(0);
    
    try {
      if (selectedFormat === 'html') {
        await simulateProgress(1000);
        const htmlContent = generateHTMLResume();
        downloadFile(htmlContent, `${getFileName()}.html`, 'text/html');
        toast.success('HTML resume downloaded successfully!');
      } else if (selectedFormat === 'pdf') {
        await simulateProgress(2000);
        await generatePDFResume();
        toast.success('PDF resume generated and downloaded!');
      } else if (selectedFormat === 'docx') {
        await simulateProgress(1500);
        await generateDOCXResume();
        toast.success('DOCX resume downloaded successfully!');
      }
      
      setExportComplete(true);
      setTimeout(() => {
        setExportComplete(false);
        setExportProgress(0);
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
      setExportProgress(0);
    } finally {
      setIsExporting(false);
    }
  };

  const getFileName = () => {
    const name = resumeData.personalInfo.fullName
      .replace(/\s+/g, '-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '');
    return `${name}-resume-${template}` || `resume-${template}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  // Function to convert oklch colors to standard hex colors
  const convertOklchToHex = (cssText: string) => {
    const oklchToHex: { [key: string]: string } = {
      'oklch(0.145 0 0)': '#252525',           // Dark gray/black
      'oklch(0.985 0 0)': '#fafafa',           // Light gray/white
      'oklch(0.95 0.0058 264.53)': '#f1f5f9',  // Light blue-gray
      'oklch(0.269 0 0)': '#444444',           // Medium gray
      'oklch(0.708 0 0)': '#b5b5b5',           // Light gray
      'oklch(0.922 0 0)': '#ebebeb',           // Very light gray
      'oklch(0.205 0 0)': '#343434',           // Dark gray
      'oklch(0.97 0 0)': '#f7f7f7',            // Almost white
      'oklch(0.439 0 0)': '#707070',           // Medium gray
      'oklch(0.646 0.222 41.116)': '#f59e0b',  // Amber
      'oklch(0.6 0.118 184.704)': '#06b6d4',   // Cyan
      'oklch(0.398 0.07 227.392)': '#3b82f6',  // Blue
      'oklch(0.828 0.189 84.429)': '#84cc16',  // Lime
      'oklch(0.769 0.188 70.08)': '#eab308',   // Yellow
      'oklch(0.488 0.243 264.376)': '#8b5cf6', // Violet
      'oklch(0.696 0.17 162.48)': '#10b981',   // Emerald
      'oklch(0.627 0.265 303.9)': '#ec4899',   // Pink
      'oklch(0.645 0.246 16.439)': '#f97316',  // Orange
      'oklch(0.396 0.141 25.723)': '#dc2626',  // Red
      'oklch(0.637 0.237 25.331)': '#ef4444',  // Light red
    };

    let convertedCss = cssText;

    // Replace all oklch color functions with hex equivalents
    Object.entries(oklchToHex).forEach(([oklch, hex]) => {
      const regex = new RegExp(oklch.replace(/[()]/g, '\\$&'), 'g');
      convertedCss = convertedCss.replace(regex, hex);
    });

    // Replace any remaining oklch functions with fallback colors
    convertedCss = convertedCss.replace(/oklch\([^)]+\)/g, (match) => {
      // Parse the oklch values and provide fallback
      if (match.includes('0.145')) return '#252525'; // Dark
      if (match.includes('0.985')) return '#fafafa'; // Light
      if (match.includes('0.95')) return '#f1f5f9';  // Very light
      if (match.includes('0.269')) return '#444444'; // Medium dark
      if (match.includes('0.708')) return '#b5b5b5'; // Medium light
      return '#6b7280'; // Default gray fallback
    });

    return convertedCss;
  };

  const generateHTMLResume = () => {
    const { personalInfo, experience, education, skills, projects, certifications } = resumeData;
    
    // Helper function to get skill level text
    const getSkillLevelText = (level: number) => {
      const levels = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Expert'];
      return levels[level - 1] || 'Intermediate';
    };
    
    // Helper function to format skill with level
    const formatSkillWithLevel = (skill: { name: string; level: number }) => {
      return `${skill.name} (${getSkillLevelText(skill.level)})`;
    };
    
    // Base styles that are common to all templates - converted to hex colors
    const baseStyles = `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        line-height: 1.6; 
        background: #f5f5f5; 
        padding: 20px; 
        color: #252525;
      }
      .resume-container { 
        max-width: 8.5in; 
        margin: 0 auto; 
        background: white; 
        box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
        border-radius: 8px; 
        overflow: hidden; 
        min-height: 11in;
        padding: 2rem;
      }
      @media print {
        body { background: white; padding: 0; color: black; }
        .resume-container { box-shadow: none; border-radius: 0; }
      }
      @media (max-width: 768px) {
        body { padding: 10px; }
        .resume-container { padding: 1rem; }
      }
    `;

    // Generate template-specific content and styles
    let templateContent = '';
    let templateStyles = baseStyles;

    if (template === 'professional') {
      templateStyles += `
        .header { text-align: center; border-bottom: 2px solid #d1d5db; padding-bottom: 1.5rem; margin-bottom: 1.5rem; }
        .header h1 { font-size: 2rem; font-weight: bold; color: #111827; margin-bottom: 0.5rem; }
        .contact-info { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; font-size: 0.875rem; color: #6b7280; }
        .contact-item { display: flex; align-items: center; gap: 0.25rem; }
        .section { margin-bottom: 1.5rem; }
        .section h2 { font-size: 1.25rem; font-weight: bold; color: #111827; margin-bottom: 0.75rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.25rem; text-transform: uppercase; }
        .experience-item, .education-item, .project-item { margin-bottom: 1rem; }
        .item-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
        .position, .degree, .project-name { font-size: 1.125rem; font-weight: 600; color: #111827; }
        .company, .institution { color: #374151; font-weight: 500; }
        .date { color: #6b7280; font-size: 0.875rem; }
        .description { color: #374151; margin-top: 0.5rem; line-height: 1.6; }
        .skills-list { color: #374151; }
        .skills-category { font-weight: 600; color: #111827; }
      `;

      templateContent = `
        <div class="header">
          <h1>${personalInfo.fullName || 'Your Name'}</h1>
          <div class="contact-info">
            ${personalInfo.email ? `<div class="contact-item">📧 ${personalInfo.email}</div>` : ''}
            ${personalInfo.phone ? `<div class="contact-item">📞 ${personalInfo.phone}</div>` : ''}
            ${personalInfo.location ? `<div class="contact-item">📍 ${personalInfo.location}</div>` : ''}
            ${personalInfo.website ? `<div class="contact-item">🌐 ${personalInfo.website}</div>` : ''}
            ${personalInfo.linkedIn ? `<div class="contact-item">💼 ${personalInfo.linkedIn}</div>` : ''}
          </div>
        </div>

        ${personalInfo.summary ? `
        <div class="section">
          <h2>Professional Summary</h2>
          <p class="description">${personalInfo.summary}</p>
        </div>
        ` : ''}

        ${experience.length > 0 ? `
        <div class="section">
          <h2>Professional Experience</h2>
          ${experience.map(exp => `
          <div class="experience-item">
            <div class="item-header">
              <div>
                <div class="position">${exp.position}</div>
                <div class="company">${exp.company}</div>
              </div>
              <div class="date">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</div>
            </div>
            ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
            ${exp.achievements.length > 0 ? `
            <div class="description">
              <strong>Key Achievements:</strong>
              <ul style="margin-left: 1rem; margin-top: 0.5rem;">
                ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
              </ul>
            </div>
            ` : ''}
          </div>
          `).join('')}
        </div>
        ` : ''}

        ${education.length > 0 ? `
        <div class="section">
          <h2>Education</h2>
          ${education.map(edu => `
          <div class="education-item">
            <div class="item-header">
              <div>
                <div class="degree">${edu.degree} in ${edu.field}</div>
                <div class="institution">${edu.institution}</div>
                ${edu.gpa ? `<div style="color: #6b7280; font-size: 0.875rem;">GPA: ${edu.gpa}</div>` : ''}
              </div>
              <div class="date">${edu.graduationYear}</div>
            </div>
          </div>
          `).join('')}
        </div>
        ` : ''}

        ${(skills.technical.length > 0 || skills.soft.length > 0 || skills.languages.length > 0) ? `
        <div class="section">
          <h2>Skills</h2>
          ${skills.technical.length > 0 ? `
          <div style="margin-bottom: 0.5rem;">
            <span class="skills-category">Technical: </span>
            <span class="skills-list">${skills.technical.map(skill => formatSkillWithLevel(skill)).join(', ')}</span>
          </div>
          ` : ''}
          ${skills.soft.length > 0 ? `
          <div style="margin-bottom: 0.5rem;">
            <span class="skills-category">Soft Skills: </span>
            <span class="skills-list">${skills.soft.map(skill => formatSkillWithLevel(skill)).join(', ')}</span>
          </div>
          ` : ''}
          ${skills.languages.length > 0 ? `
          <div>
            <span class="skills-category">Languages: </span>
            <span class="skills-list">${skills.languages.map(skill => formatSkillWithLevel(skill)).join(', ')}</span>
          </div>
          ` : ''}
        </div>
        ` : ''}

        ${projects.length > 0 ? `
        <div class="section">
          <h2>Projects</h2>
          ${projects.map(project => `
          <div class="project-item">
            <div class="project-name">${project.name}</div>
            ${project.description ? `<div class="description">${project.description}</div>` : ''}
            ${project.technologies.length > 0 ? `
            <div style="margin-top: 0.5rem; color: #6b7280;">
              <strong>Technologies:</strong> ${project.technologies.join(', ')}
            </div>
            ` : ''}
            ${project.link ? `<div style="margin-top: 0.5rem;"><strong>Link:</strong> <a href="${project.link}" style="color: #2563eb;">${project.link}</a></div>` : ''}
          </div>
          `).join('')}
        </div>
        ` : ''}

        ${certifications.length > 0 ? `
        <div class="section">
          <h2>Certifications</h2>
          ${certifications.map(cert => `
          <div class="education-item">
            <div class="item-header">
              <div>
                <div class="degree">${cert.name}</div>
                <div class="institution">${cert.issuer}</div>
              </div>
              <div class="date">${formatDate(cert.date)}</div>
            </div>
            ${cert.link ? `<div style="margin-top: 0.5rem;"><a href="${cert.link}" style="color: #2563eb;">View Credential</a></div>` : ''}
          </div>
          `).join('')}
        </div>
        ` : ''}
      `;
    } else if (template === 'modern') {
      templateStyles += `
        .header { background: linear-gradient(to right, #2563eb, #9333ea); color: white; padding: 2rem; margin: -2rem -2rem 2rem -2rem; }
        .header h1 { font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem; }
        .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; font-size: 0.875rem; }
        .contact-item { display: flex; align-items: center; gap: 0.5rem; }
        .two-column { display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; }
        .section { margin-bottom: 2rem; }
        .section h2 { font-size: 1.125rem; font-weight: bold; color: #2563eb; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .skill-tag { background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem; margin: 0.125rem; display: inline-block; }
        .experience-border { border-left: 4px solid #bfdbfe; padding-left: 1rem; margin-bottom: 1rem; }
        .experience-title { font-size: 1.125rem; font-weight: 600; color: #111827; }
        .experience-company { color: #2563eb; font-weight: 500; }
        .experience-date { background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem; color: #6b7280; }
        .project-border { border-left: 4px solid #d8b4fe; padding-left: 1rem; }
        .project-tag { background: #ede9fe; color: #7c3aed; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; margin: 0.125rem; display: inline-block; }
      `;

      templateContent = `
        <div class="header">
          <h1>${personalInfo.fullName || 'Your Name'}</h1>
          <div class="contact-grid">
            ${personalInfo.email ? `<div class="contact-item">📧 ${personalInfo.email}</div>` : ''}
            ${personalInfo.phone ? `<div class="contact-item">📞 ${personalInfo.phone}</div>` : ''}
            ${personalInfo.location ? `<div class="contact-item">📍 ${personalInfo.location}</div>` : ''}
            ${personalInfo.website ? `<div class="contact-item">🌐 ${personalInfo.website}</div>` : ''}
          </div>
        </div>

        <div class="two-column">
          <div>
            ${(skills.technical.length > 0 || skills.soft.length > 0) ? `
            <div class="section">
              <h2>Skills</h2>
              ${skills.technical.length > 0 ? `
              <div style="margin-bottom: 1rem;">
                <h3 style="font-weight: 600; color: #374151; margin-bottom: 0.5rem;">Technical</h3>
                <div>
                  ${skills.technical.map(skill => `<span class="skill-tag">${formatSkillWithLevel(skill)}</span>`).join('')}
                </div>
              </div>
              ` : ''}
              ${skills.soft.length > 0 ? `
              <div>
                <h3 style="font-weight: 600; color: #374151; margin-bottom: 0.5rem;">Soft Skills</h3>
                <div>
                  ${skills.soft.map(skill => `<span class="skill-tag">${formatSkillWithLevel(skill)}</span>`).join('')}
                </div>
              </div>
              ` : ''}
            </div>
            ` : ''}

            ${education.length > 0 ? `
            <div class="section">
              <h2>Education</h2>
              ${education.map(edu => `
              <div style="margin-bottom: 1rem;">
                <h3 style="font-weight: 600; color: #374151;">${edu.degree}</h3>
                <p style="color: #6b7280; font-size: 0.875rem;">${edu.field}</p>
                <p style="color: #6b7280; font-size: 0.875rem;">${edu.institution}</p>
                <p style="color: #9ca3af; font-size: 0.75rem;">${edu.graduationYear}</p>
              </div>
              `).join('')}
            </div>
            ` : ''}

            ${certifications.length > 0 ? `
            <div class="section">
              <h2>Certifications</h2>
              ${certifications.map(cert => `
              <div style="margin-bottom: 0.5rem;">
                <h3 style="font-weight: 600; color: #374151; font-size: 0.875rem;">${cert.name}</h3>
                <p style="color: #6b7280; font-size: 0.75rem;">${cert.issuer}</p>
                <p style="color: #9ca3af; font-size: 0.75rem;">${formatDate(cert.date)}</p>
              </div>
              `).join('')}
            </div>
            ` : ''}
          </div>

          <div>
            ${personalInfo.summary ? `
            <div class="section">
              <h2>Professional Summary</h2>
              <p style="color: #374151; line-height: 1.6;">${personalInfo.summary}</p>
            </div>
            ` : ''}

            ${experience.length > 0 ? `
            <div class="section">
              <h2>Experience</h2>
              ${experience.map(exp => `
              <div class="experience-border">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                  <div>
                    <div class="experience-title">${exp.position}</div>
                    <div class="experience-company">${exp.company}</div>
                  </div>
                  <div class="experience-date">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</div>
                </div>
                ${exp.description ? `<p style="color: #374151; line-height: 1.6;">${exp.description}</p>` : ''}
              </div>
              `).join('')}
            </div>
            ` : ''}

            ${projects.length > 0 ? `
            <div class="section">
              <h2>Projects</h2>
              ${projects.map(project => `
              <div class="project-border" style="margin-bottom: 1rem;">
                <h3 style="font-size: 1.125rem; font-weight: 600; color: #111827;">${project.name}</h3>
                <p style="color: #374151; line-height: 1.6; margin: 0.5rem 0;">${project.description}</p>
                ${project.technologies.length > 0 ? `
                <div>
                  ${project.technologies.map(tech => `<span class="project-tag">${tech}</span>`).join('')}
                </div>
                ` : ''}
              </div>
              `).join('')}
            </div>
            ` : ''}
          </div>
        </div>
      `;
    } else if (template === 'creative') {
      templateStyles += `
        .creative-header { position: relative; margin-bottom: 2rem; }
        .creative-bg-1 { position: absolute; left: -2rem; top: -2rem; width: 8rem; height: 8rem; background: linear-gradient(135deg, #fb923c, #ec4899); border-radius: 50%; opacity: 0.1; }
        .creative-bg-2 { position: absolute; right: -2rem; bottom: -2rem; width: 6rem; height: 6rem; background: linear-gradient(135deg, #60a5fa, #a855f7); border-radius: 50%; opacity: 0.1; }
        .creative-header h1 { font-size: 3rem; font-weight: bold; background: linear-gradient(to right, #ea580c, #ec4899); -webkit-background-clip: text; background-clip: text; color: #ea580c; margin-bottom: 1rem; position: relative; z-index: 10; }
        .contact-pills { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem; }
        .contact-pill { display: flex; align-items: center; gap: 0.25rem; padding: 0.5rem 1rem; border-radius: 9999px; font-size: 0.875rem; }
        .pill-orange { background: #fed7aa; color: #9a3412; }
        .pill-blue { background: #bfdbfe; color: #1e40af; }
        .pill-green { background: #bbf7d0; color: #166534; }
        .pill-purple { background: #e9d5ff; color: #7c2d12; }
        .section-creative { margin-bottom: 2rem; }
        .section-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
        .section-bar { width: 2rem; height: 0.25rem; border-radius: 0.125rem; }
        .bar-orange { background: linear-gradient(to right, #fb923c, #ec4899); }
        .bar-blue { background: linear-gradient(to right, #60a5fa, #a855f7); }
        .bar-green { background: linear-gradient(to right, #34d399, #3b82f6); }
        .bar-purple { background: linear-gradient(to right, #a855f7, #ec4899); }
        .bar-yellow { background: linear-gradient(to right, #fbbf24, #ea580c); }
        .section-creative h2 { font-size: 1.5rem; font-weight: bold; color: #374151; }
        .about-box { background: #f9fafb; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #fb923c; font-size: 1.125rem; line-height: 1.6; color: #374151; }
        .experience-timeline { position: relative; }
        .timeline-item { position: relative; display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1.5rem; }
        .timeline-dot { width: 1.5rem; height: 1.5rem; background: linear-gradient(135deg, #60a5fa, #a855f7); border-radius: 50%; flex-shrink: 0; margin-top: 0.25rem; }
        .timeline-card { background: white; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); flex: 1; }
        .timeline-title { font-size: 1.25rem; font-weight: bold; color: #111827; }
        .timeline-company { color: #2563eb; font-weight: 600; }
        .timeline-date { background: linear-gradient(to right, #60a5fa, #a855f7); color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; }
        .timeline-line { position: absolute; left: 0.75rem; top: 2rem; width: 0.125rem; height: 1rem; background: linear-gradient(to bottom, #60a5fa, #a855f7); }
        .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
        .skill-category { margin-bottom: 1rem; }
        .skill-category h3 { font-weight: bold; color: #374151; margin-bottom: 0.5rem; }
        .skill-tag-creative { display: inline-block; margin: 0.125rem; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; color: white; }
        .skill-technical { background: linear-gradient(to right, #34d399, #3b82f6); }
        .skill-soft { background: linear-gradient(to right, #a855f7, #ec4899); }
        .education-card { background: linear-gradient(135deg, #f3e8ff, #fce7f3); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #a855f7; margin-bottom: 0.75rem; }
        .project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
        .project-card { background: linear-gradient(135deg, #fef3c7, #fed7aa); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #fbbf24; }
        .project-tech { background: #fef3c7; color: #92400e; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; margin: 0.125rem; display: inline-block; }
      `;

      templateContent = `
        <div class="creative-header">
          <div class="creative-bg-1"></div>
          <div class="creative-bg-2"></div>
          <div style="position: relative; z-index: 10;">
            <h1>${personalInfo.fullName || 'Your Name'}</h1>
            <div class="contact-pills">
              ${personalInfo.email ? `<div class="contact-pill pill-orange">📧 ${personalInfo.email}</div>` : ''}
              ${personalInfo.phone ? `<div class="contact-pill pill-blue">📞 ${personalInfo.phone}</div>` : ''}
              ${personalInfo.location ? `<div class="contact-pill pill-green">📍 ${personalInfo.location}</div>` : ''}
              ${personalInfo.website ? `<div class="contact-pill pill-purple">🌐 ${personalInfo.website}</div>` : ''}
            </div>
          </div>
        </div>

        ${personalInfo.summary ? `
        <div class="section-creative">
          <div class="section-header">
            <div class="section-bar bar-orange"></div>
            <h2>About Me</h2>
          </div>
          <div class="about-box">${personalInfo.summary}</div>
        </div>
        ` : ''}

        ${experience.length > 0 ? `
        <div class="section-creative">
          <div class="section-header">
            <div class="section-bar bar-blue"></div>
            <h2>Experience</h2>
          </div>
          <div class="experience-timeline">
            ${experience.map((exp, index) => `
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                  <div>
                    <div class="timeline-title">${exp.position}</div>
                    <div class="timeline-company">${exp.company}</div>
                  </div>
                  <div class="timeline-date">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</div>
                </div>
                ${exp.description ? `<p style="color: #374151; line-height: 1.6;">${exp.description}</p>` : ''}
              </div>
            </div>
            ${index < experience.length - 1 ? '<div class="timeline-line"></div>' : ''}
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div class="skills-grid">
          ${(skills.technical.length > 0 || skills.soft.length > 0) ? `
          <div class="section-creative">
            <div class="section-header">
              <div class="section-bar bar-green"></div>
              <h2>Skills</h2>
            </div>
            ${skills.technical.length > 0 ? `
            <div class="skill-category">
              <h3>Technical</h3>
              <div>
                ${skills.technical.map(skill => `<span class="skill-tag-creative skill-technical">${formatSkillWithLevel(skill)}</span>`).join('')}
              </div>
            </div>
            ` : ''}
            ${skills.soft.length > 0 ? `
            <div class="skill-category">
              <h3>Soft Skills</h3>
              <div>
                ${skills.soft.map(skill => `<span class="skill-tag-creative skill-soft">${formatSkillWithLevel(skill)}</span>`).join('')}
              </div>
            </div>
            ` : ''}
          </div>
          ` : ''}

          ${education.length > 0 ? `
          <div class="section-creative">
            <div class="section-header">
              <div class="section-bar bar-purple"></div>
              <h2>Education</h2>
            </div>
            ${education.map(edu => `
            <div class="education-card">
              <h3 style="font-weight: bold; color: #111827;">${edu.degree}</h3>
              <p style="color: #7c3aed; font-weight: 500;">${edu.field}</p>
              <p style="color: #374151;">${edu.institution}</p>
              <p style="color: #6b7280; font-size: 0.875rem;">${edu.graduationYear}</p>
            </div>
            `).join('')}
          </div>
          ` : ''}
        </div>

        ${projects.length > 0 ? `
        <div class="section-creative">
          <div class="section-header">
            <div class="section-bar bar-yellow"></div>
            <h2>Projects</h2>
          </div>
          <div class="project-grid">
            ${projects.map(project => `
            <div class="project-card">
              <h3 style="font-size: 1.125rem; font-weight: bold; color: #111827; margin-bottom: 0.5rem;">${project.name}</h3>
              <p style="color: #374151; line-height: 1.6; margin-bottom: 0.75rem;">${project.description}</p>
              ${project.technologies.length > 0 ? `
              <div>
                ${project.technologies.map(tech => `<span class="project-tech">${tech}</span>`).join('')}
              </div>
              ` : ''}
            </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
      `;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName} - Resume (${template.charAt(0).toUpperCase() + template.slice(1)})</title>
    <style>
        ${templateStyles}
    </style>
</head>
<body>
    <div class="resume-container">
        ${templateContent}
    </div>
</body>
</html>`;
  };

  const generatePDFResume = async () => {
    try {
      // Import jsPDF and html2canvas with proper syntax
      const [jsPDFModule, html2canvasModule] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);
      
      const { jsPDF } = jsPDFModule;
      const html2canvas = html2canvasModule.default;
      
      // Generate HTML content for PDF
      let htmlContent = generateHTMLResume();
      
      // Convert oklch colors to hex colors for html2canvas compatibility
      htmlContent = convertOklchToHex(htmlContent);
      
      // Create a temporary div with the resume content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '816px'; // 8.5 inches at 96 DPI
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      tempDiv.style.color = '#000000';
      
      document.body.appendChild(tempDiv);
      
      try {
        // Wait a moment for fonts to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Convert to canvas with specific options for better compatibility
        const canvas = await html2canvas(tempDiv.querySelector('.resume-container') as HTMLElement, {
          width: 816,
          height: 1056, // 11 inches at 96 DPI
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          foreignObjectRendering: false,
          removeContainer: true,
          imageTimeout: 15000
        });
        
        // Create PDF
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [816, 1056]
        });
        
        const imgData = canvas.toDataURL('image/png', 1.0);
        pdf.addImage(imgData, 'PNG', 0, 0, 816, 1056);
        
        // Download the PDF
        pdf.save(`${getFileName()}.pdf`);
        
      } finally {
        document.body.removeChild(tempDiv);
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  };

  const generateDOCXResume = async () => {
    const { personalInfo, experience, education, skills, projects, certifications } = resumeData;
    
    try {
      // Import JSZip
      const JSZipModule = await import('jszip');
      const JSZip = JSZipModule.default;
      
      // Create the DOCX file structure
      const docx = new JSZip();
      
      // Add the required DOCX structure
      docx.file('[Content_Types].xml', generateContentTypes());
      
      const rels = docx.folder('_rels');
      if (rels) {
        rels.file('.rels', generateRels());
      }
      
      const wordFolder = docx.folder('word');
      if (wordFolder) {
        wordFolder.file('document.xml', generateDOCXXML());
        
        const wordRels = wordFolder.folder('_rels');
        if (wordRels) {
          wordRels.file('document.xml.rels', generateDocumentRels());
        }
        
        wordFolder.file('styles.xml', generateStyles());
        wordFolder.file('settings.xml', generateSettings());
        wordFolder.file('webSettings.xml', generateWebSettings());
        wordFolder.file('fontTable.xml', generateFontTable());
      }
      
      const docProps = docx.folder('docProps');
      if (docProps) {
        docProps.file('core.xml', generateCoreProps());
        docProps.file('app.xml', generateAppProps());
      }
      
      // Generate the DOCX file
      const content = await docx.generateAsync({ type: 'blob' });
      
      // Download the file
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${getFileName()}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('DOCX generation failed:', error);
      throw new Error('Failed to generate DOCX. Please try again.');
    }
  };

  const generateDOCXXML = () => {
    const { personalInfo, experience, education, skills, projects, certifications } = resumeData;
    
    // Helper function to get skill level text
    const getSkillLevelText = (level: number) => {
      const levels = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Expert'];
      return levels[level - 1] || 'Intermediate';
    };
    
    // Helper function to format skill with level
    const formatSkillWithLevel = (skill: { name: string; level: number }) => {
      return `${skill.name} (${getSkillLevelText(skill.level)})`;
    };
    
    const escapeXml = (text: string) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };
    
    const createParagraph = (text: string, style = 'Normal') => {
      return `<w:p><w:pPr><w:pStyle w:val="${style}"/></w:pPr><w:r><w:t>${escapeXml(text)}</w:t></w:r></w:p>`;
    };
    
    const createHeading = (text: string, level = 1) => {
      return `<w:p><w:pPr><w:pStyle w:val="Heading${level}"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t>${escapeXml(text)}</w:t></w:r></w:p>`;
    };
    
    let content = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>`;

    // Header with name and template info
    content += createHeading(`${personalInfo.fullName} - ${template.charAt(0).toUpperCase() + template.slice(1)} Template`, 1);
    
    // Contact information
    const contactInfo = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.website,
      personalInfo.linkedIn
    ].filter(Boolean).join(' | ');
    
    if (contactInfo) {
      content += createParagraph(contactInfo);
    }
    
    content += createParagraph(''); // Empty line
    
    // Professional Summary
    if (personalInfo.summary) {
      content += createHeading('Professional Summary', 2);
      content += createParagraph(personalInfo.summary);
      content += createParagraph('');
    }
    
    // Experience
    if (experience.length > 0) {
      content += createHeading('Professional Experience', 2);
      experience.forEach(exp => {
        content += createParagraph(`${exp.position} - ${exp.company}`, 'Heading3');
        content += createParagraph(`${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`);
        if (exp.description) {
          content += createParagraph(exp.description);
        }
        if (exp.achievements.length > 0) {
          content += createParagraph('Key Achievements:');
          exp.achievements.forEach(achievement => {
            content += createParagraph(`• ${achievement}`);
          });
        }
        content += createParagraph('');
      });
    }
    
    // Education
    if (education.length > 0) {
      content += createHeading('Education', 2);
      education.forEach(edu => {
        content += createParagraph(`${edu.degree} in ${edu.field}`, 'Heading3');
        content += createParagraph(`${edu.institution} - ${edu.graduationYear}`);
        if (edu.gpa) {
          content += createParagraph(`GPA: ${edu.gpa}`);
        }
        content += createParagraph('');
      });
    }
    
    // Skills
    if (skills.technical.length > 0 || skills.soft.length > 0 || skills.languages.length > 0) {
      content += createHeading('Skills', 2);
      if (skills.technical.length > 0) {
        content += createParagraph('Technical Skills:', 'Heading3');
        content += createParagraph(skills.technical.map(skill => formatSkillWithLevel(skill)).join(', '));
      }
      if (skills.soft.length > 0) {
        content += createParagraph('Soft Skills:', 'Heading3');
        content += createParagraph(skills.soft.map(skill => formatSkillWithLevel(skill)).join(', '));
      }
      if (skills.languages.length > 0) {
        content += createParagraph('Languages:', 'Heading3');
        content += createParagraph(skills.languages.map(skill => formatSkillWithLevel(skill)).join(', '));
      }
      content += createParagraph('');
    }
    
    // Projects
    if (projects.length > 0) {
      content += createHeading('Projects', 2);
      projects.forEach(project => {
        content += createParagraph(project.name, 'Heading3');
        if (project.description) {
          content += createParagraph(project.description);
        }
        if (project.technologies.length > 0) {
          content += createParagraph(`Technologies: ${project.technologies.join(', ')}`);
        }
        if (project.link) {
          content += createParagraph(`Link: ${project.link}`);
        }
        content += createParagraph('');
      });
    }
    
    // Certifications
    if (certifications.length > 0) {
      content += createHeading('Certifications', 2);
      certifications.forEach(cert => {
        content += createParagraph(`${cert.name} - ${cert.issuer}`, 'Heading3');
        content += createParagraph(formatDate(cert.date));
        if (cert.link) {
          content += createParagraph(`Link: ${cert.link}`);
        }
        content += createParagraph('');
      });
    }
    
    content += `</w:body></w:document>`;
    
    return content;
  };

  const generateContentTypes = () => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
  <Override PartName="/word/webSettings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.webSettings+xml"/>
  <Override PartName="/word/fontTable.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;
  };

  const generateRels = () => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;
  };

  const generateDocumentRels = () => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings" Target="webSettings.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable" Target="fontTable.xml"/>
</Relationships>`;
  };

  const generateStyles = () => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:styleId="Normal" w:default="1">
    <w:name w:val="Normal"/>
    <w:pPr>
      <w:spacing w:after="200" w:line="276" w:lineRule="auto"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Calibri" w:eastAsia="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
      <w:sz w:val="22"/>
      <w:szCs w:val="22"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:pPr>
      <w:spacing w:before="480" w:after="0"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Calibri Light" w:eastAsia="Calibri Light" w:hAnsi="Calibri Light" w:cs="Calibri Light"/>
      <w:sz w:val="32"/>
      <w:szCs w:val="32"/>
      <w:color w:val="2F5496"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:pPr>
      <w:spacing w:before="200" w:after="0"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Calibri Light" w:eastAsia="Calibri Light" w:hAnsi="Calibri Light" w:cs="Calibri Light"/>
      <w:sz w:val="26"/>
      <w:szCs w:val="26"/>
      <w:color w:val="2F5496"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading3">
    <w:name w:val="heading 3"/>
    <w:pPr>
      <w:spacing w:before="200" w:after="0"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Calibri Light" w:eastAsia="Calibri Light" w:hAnsi="Calibri Light" w:cs="Calibri Light"/>
      <w:sz w:val="24"/>
      <w:szCs w:val="24"/>
      <w:color w:val="1F3763"/>
    </w:rPr>
  </w:style>
</w:styles>`;
  };

  const generateSettings = () => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:zoom w:percent="100"/>
</w:settings>`;
  };

  const generateWebSettings = () => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:webSettings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:optimizeForBrowser/>
</w:webSettings>`;
  };

  const generateFontTable = () => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:fonts xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:font w:name="Calibri">
    <w:panose1 w:val="020F0502020204030204"/>
    <w:charset w:val="00"/>
    <w:family w:val="swiss"/>
    <w:pitch w:val="variable"/>
    <w:sig w:usb0="E00002FF" w:usb1="4000ACFF" w:usb2="00000001" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/>
  </w:font>
  <w:font w:name="Calibri Light">
    <w:panose1 w:val="020F0302020204030204"/>
    <w:charset w:val="00"/>
    <w:family w:val="swiss"/>
    <w:pitch w:val="variable"/>
    <w:sig w:usb0="E00002FF" w:usb1="4000ACFF" w:usb2="00000001" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/>
  </w:font>
</w:fonts>`;
  };

  const generateCoreProps = () => {
    const now = new Date().toISOString();
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>${resumeData.personalInfo.fullName} Resume - ${template.charAt(0).toUpperCase() + template.slice(1)} Template</dc:title>
  <dc:creator>AI Resume Builder</dc:creator>
  <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
</cp:coreProperties>`;
  };

  const generateAppProps = () => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>AI Resume Builder</Application>
  <DocSecurity>0</DocSecurity>
  <ScaleCrop>false</ScaleCrop>
  <SharedDoc>false</SharedDoc>
  <HyperlinksChanged>false</HyperlinksChanged>
  <AppVersion>1.0000</AppVersion>
</Properties>`;
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Fixed clipboard copy function with fallback
  const copyToClipboard = async () => {
    const htmlContent = generateHTMLResume();
    
    try {
      // First try the modern Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(htmlContent);
        toast.success('HTML content copied to clipboard!');
        return;
      }
    } catch (err) {
      console.log('Clipboard API failed, using fallback method');
    }

    // Fallback method using textarea
    try {
      const textArea = document.createElement('textarea');
      textArea.value = htmlContent;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        toast.success('HTML content copied to clipboard!');
      } else {
        throw new Error('execCommand failed');
      }
    } catch (err) {
      console.error('All clipboard methods failed:', err);
      
      // Final fallback - show the content in a new window for manual copying
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>Resume HTML - Copy This Content</title></head>
            <body>
              <h3>Copy the HTML content below:</h3>
              <textarea style="width:100%;height:400px;font-family:monospace;font-size:12px;">${htmlContent.replace(/"/g, '&quot;')}</textarea>
              <p><em>Select all text above and copy it manually (Ctrl+A, then Ctrl+C)</em></p>
            </body>
          </html>
        `);
        newWindow.document.close();
        toast.info('HTML content opened in new window for manual copying');
      } else {
        toast.error('Unable to copy to clipboard. Please allow popups to copy content.');
      }
    }
  };

  const completionIssues = getCompletionIssues();
  const isComplete = isResumeComplete();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Your Resume - {template.charAt(0).toUpperCase() + template.slice(1)} Template
          </DialogTitle>
          <DialogDescription>
            Choose your preferred format and download your professional resume with the selected template styling
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Export Options */}
          <div className="space-y-6">
            {!isComplete && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p>Complete your resume to enable export:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {completionIssues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-4">Export Formats</h3>
              <div className="space-y-3">
                {exportFormats.map((format) => {
                  const Icon = format.icon;
                  const isSelected = selectedFormat === format.id;
                  
                  return (
                    <Card
                      key={format.id}
                      className={`p-4 cursor-pointer transition-all ${
                        isSelected 
                          ? 'ring-2 ring-primary border-primary' 
                          : 'hover:border-primary/50'
                      } ${!isComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => isComplete && setSelectedFormat(format.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4>{format.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {format.size}
                            </Badge>
                            {format.recommended && (
                              <Badge variant="secondary" className="text-xs">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {format.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {format.features.map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {isComplete && (
              <>
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription className="text-sm">
                    {selectedFormat === 'html' && 
                      `HTML format creates a web page with your selected ${template} template styling. Perfect for digital applications and portfolios.`
                    }
                    {selectedFormat === 'pdf' && 
                      `PDF export generates a high-quality PDF with your ${template} template design. Perfect for email attachments and printing.`
                    }
                    {selectedFormat === 'docx' && 
                      `DOCX format creates a Microsoft Word document with ${template} template formatting that you can open, edit, and customize further.`
                    }
                  </AlertDescription>
                </Alert>

                {isExporting && (
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <div>
                        <h4>Generating your resume...</h4>
                        <p className="text-sm text-muted-foreground">
                          Creating {selectedFormat.toUpperCase()} file with {template} template
                        </p>
                      </div>
                    </div>
                    <Progress value={exportProgress} className="w-full" />
                  </Card>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={handleExport}
                    disabled={isExporting || !isComplete}
                    className="flex-1 flex items-center gap-2"
                  >
                    {isExporting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Exporting...
                      </>
                    ) : exportComplete ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Complete!
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Export {selectedFormat.toUpperCase()}
                      </>
                    )}
                  </Button>
                  
                  {selectedFormat === 'html' && isComplete && (
                    <Button
                      variant="outline"
                      onClick={copyToClipboard}
                      className="flex items-center gap-2"
                      disabled={isExporting}
                    >
                      <Copy className="w-4 h-4" />
                      Copy HTML
                    </Button>
                  )}
                </div>
              </>
            )}

            <Card className="p-4 bg-blue-50 border-blue-200">
              <h4 className="text-blue-900 mb-2">Export Tips</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• HTML format preserves your template styling perfectly</li>
                <li>• PDF generates print-ready files with template design</li>
                <li>• DOCX allows editing while maintaining template structure</li>
                <li>• All formats include your selected {template} template styling</li>
              </ul>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preview - {template.charAt(0).toUpperCase() + template.slice(1)} Template</h3>
            <div className="border rounded-lg bg-white shadow-sm overflow-hidden resume-preview-export">
              <ResumePreview 
                resumeData={resumeData}
                template={template}
                scale={0.6}
              />
            </div>
            
            <div className="text-center">
              <Button variant="outline" size="sm" className="flex items-center gap-2 mx-auto">
                <ExternalLink className="w-3 h-3" />
                View Full Size
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}