import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ResumeTemplate, ResumeData } from '../App';
import { ResumePreview } from './ResumePreview';
import { Check, Palette, Briefcase, Zap } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: ResumeTemplate;
  onTemplateChange: (template: ResumeTemplate) => void;
  resumeData: ResumeData;
}

const templates = [
  {
    id: 'professional' as ResumeTemplate,
    name: 'Professional',
    description: 'Clean, traditional format perfect for corporate environments and conservative industries.',
    icon: Briefcase,
    features: ['ATS-Optimized', 'Traditional Layout', 'Corporate-Friendly'],
    preview: 'Traditional black and white design with clear sections and professional formatting.'
  },
  {
    id: 'modern' as ResumeTemplate,
    name: 'Modern',
    description: 'Contemporary design with color accents and improved visual hierarchy.',
    icon: Palette,
    features: ['Eye-Catching', 'Two-Column Layout', 'Color Accents'],
    preview: 'Blue gradient header with sidebar layout for skills and education.'
  },
  {
    id: 'creative' as ResumeTemplate,
    name: 'Creative',
    description: 'Bold, vibrant design for creative professionals and modern startups.',
    icon: Zap,
    features: ['Colorful Design', 'Visual Elements', 'Creative Industries'],
    preview: 'Gradient elements, colorful skill badges, and dynamic visual layout.'
  }

];

export function TemplateSelector({ selectedTemplate, onTemplateChange, resumeData }: TemplateSelectorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose Your Template</h2>
        <p className="text-muted-foreground">
          Select a resume template that best fits your industry and personal style
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {templates.map((template) => {
          const Icon = template.icon;
          const isSelected = selectedTemplate === template.id;
          
          return (
            <Card
              key={template.id}
              className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
                isSelected 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : 'hover:ring-1 hover:ring-primary/20'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.preview}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {template.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {template.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <Button
                  onClick={() => onTemplateChange(template.id)}
                  variant={isSelected ? 'default' : 'outline'}
                  className="w-full"
                >
                  {isSelected ? 'Selected' : 'Use This Template'}
                </Button>
              </div>

              {/* Template Preview */}
              <div className="border-t bg-muted/20 p-4">
                <div className="relative overflow-hidden rounded border bg-white shadow-sm">
                  <div className="h-64 overflow-hidden">
                    <ResumePreview
                      resumeData={resumeData}
                      template={template.id}
                      scale={0.2}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">ATS Compatibility</h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              All templates are designed to be ATS (Applicant Tracking System) friendly. 
              The Professional template offers the highest compatibility, while Modern and Creative 
              templates balance visual appeal with ATS requirements.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-4">
          <div className="bg-amber-100 p-2 rounded-lg">
            <Zap className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-900 mb-2">Template Recommendations</h3>
            <div className="text-amber-700 text-sm space-y-1">
              <p><strong>Professional:</strong> Finance, Law, Healthcare, Government</p>
              <p><strong>Modern:</strong> Tech, Consulting, Marketing, Sales</p>
              <p><strong>Creative:</strong> Design, Media, Startups, Arts</p>

            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}