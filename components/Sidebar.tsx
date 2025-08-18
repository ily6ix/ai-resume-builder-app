import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Zap, 
  FolderOpen, 
  Award,
  CheckCircle,
  Circle
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  completionStatus: {
    personalInfo: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
  };
}

const sidebarSections = [
  {
    id: 'personalInfo',
    title: 'Personal Info',
    icon: User,
    description: 'Basic contact information'
  },
  {
    id: 'experience',
    title: 'Experience',
    icon: Briefcase,
    description: 'Work history and achievements'
  },
  {
    id: 'education',
    title: 'Education',
    icon: GraduationCap,
    description: 'Academic background'
  },
  {
    id: 'skills',
    title: 'Skills',
    icon: Zap,
    description: 'Technical and soft skills'
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: FolderOpen,
    description: 'Portfolio projects'
  },
  {
    id: 'certifications',
    title: 'Certifications',
    icon: Award,
    description: 'Professional certifications'
  }
];

export function Sidebar({ activeTab, onTabChange, completionStatus }: SidebarProps) {
  const completedSections = Object.values(completionStatus).filter(Boolean).length;
  const totalSections = Object.keys(completionStatus).length;
  const completionPercentage = Math.round((completedSections / totalSections) * 100);

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-sidebar-foreground mb-2">Resume Sections</h2>
          <p className="text-sm text-sidebar-foreground/70 mb-4">
            Complete each section to build your resume
          </p>
          
          <Card className="p-4 bg-sidebar-accent">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-sidebar-accent-foreground">Progress</span>
              <Badge variant="secondary" className="text-xs">
                {completedSections}/{totalSections}
              </Badge>
            </div>
            <div className="w-full bg-sidebar-border rounded-full h-2 mb-1">
              <div 
                className="bg-sidebar-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-xs text-sidebar-accent-foreground/70">
              {completionPercentage}% Complete
            </p>
          </Card>
        </div>

        <div className="space-y-2">
          {sidebarSections.map((section) => {
            const Icon = section.icon;
            const isCompleted = completionStatus[section.id as keyof typeof completionStatus];
            const isActive = activeTab === 'builder'; // All sections are part of the builder tab
            
            return (
              <button
                key={section.id}
                onClick={() => onTabChange('builder')}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2 mt-0.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {isCompleted ? (
                      <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                    ) : (
                      <Circle className="w-3 h-3 text-sidebar-foreground/40 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1">{section.title}</h3>
                    <p className="text-xs text-sidebar-foreground/60 line-clamp-2">
                      {section.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-sidebar-border">
          <div className="space-y-2">
            <Card className="p-3 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">AI Tip</h4>
                  <p className="text-xs text-blue-700">
                    Use action verbs and quantify your achievements for better ATS compatibility.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}