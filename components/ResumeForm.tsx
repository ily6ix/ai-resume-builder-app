import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Plus, 
  Trash2, 
  Lightbulb, 
  User, 
  Briefcase, 
  GraduationCap, 
  Zap, 
  FolderOpen, 
  Award,
  Star,
  StarOff
} from 'lucide-react';
import { ResumeData, SkillItem } from '../App';
import { ContentSuggestions } from './ContentSuggestions';
import { AIWritingAssistant } from './AIWritingAssistant';

interface ResumeFormProps {
  resumeData: ResumeData;
  onUpdateData: (section: keyof ResumeData, data: any) => void;
}

const skillLevels = [
  { value: 1, label: 'Beginner', description: 'Basic understanding' },
  { value: 2, label: 'Novice', description: 'Limited experience' },
  { value: 3, label: 'Intermediate', description: 'Some experience' },
  { value: 4, label: 'Advanced', description: 'Extensive experience' },
  { value: 5, label: 'Expert', description: 'Authority level' }
] as const;

const degreeOptions = [
  // South African Qualifications
  'NSC (National Senior Certificate)',
  'NCV (National Certificate Vocational)',
  'NCV Level 2',
  'NCV Level 3',
  'NCV Level 4',
  'N1 Certificate',
  'N2 Certificate',
  'N3 Certificate',
  'N4 Certificate',
  'N5 Certificate',
  'N6 Certificate',
  'National Certificate',
  'National Diploma',
  'Higher Certificate',
  'Advanced Certificate',
  'BTech (Bachelor of Technology)',
  'NDip (National Diploma)',
  // International Qualifications
  'High School Diploma',
  'GED',
  'Associate Degree',
  'Bachelor of Arts (BA)',
  'Bachelor of Science (BS)',
  'Bachelor of Science (BSc)',
  'Bachelor of Engineering (BEng)',
  'Bachelor of Technology (BTech)',
  'Bachelor of Commerce (BCom)',
  'Bachelor of Business Administration (BBA)',
  'Bachelor of Fine Arts (BFA)',
  'Bachelor of Education (BEd)',
  'Bachelor of Laws (LLB)',
  'Bachelor of Medicine (MBBCh)',
  'Bachelor of Social Work (BSW)',
  'Honours Degree',
  'Master of Arts (MA)',
  'Master of Science (MS)',
  'Master of Science (MSc)',
  'Master of Engineering (MEng)',
  'Master of Business Administration (MBA)',
  'Master of Education (MEd)',
  'Master of Laws (LLM)',
  'Master of Fine Arts (MFA)',
  'Master of Social Work (MSW)',
  'Master of Public Health (MPH)',
  'Doctor of Philosophy (PhD)',
  'Doctor of Education (EdD)',
  'Doctor of Medicine (MD)',
  'Juris Doctor (JD)',
  'Certificate',
  'Diploma',
  'Advanced Diploma',
  'Professional Certificate',
  'Trade Certificate',
  'Apprenticeship',
  'Other'
];

const SkillRating = ({ level, onChange }: { level: number; onChange: (level: number) => void }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          className="focus:outline-none transition-colors"
        >
          {rating <= level ? (
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ) : (
            <StarOff className="w-4 h-4 text-gray-300 hover:text-yellow-400" />
          )}
        </button>
      ))}
      <span className="ml-2 text-xs text-gray-600">
        {skillLevels.find(l => l.value === level)?.label}
      </span>
    </div>
  );
};

export function ResumeForm({ resumeData, onUpdateData }: ResumeFormProps) {
  const [activeSection, setActiveSection] = useState('personal');
  const [newSkills, setNewSkills] = useState({
    technical: '',
    soft: '',
    languages: ''
  });
  const [customDegrees, setCustomDegrees] = useState<{ [key: string]: string }>({});

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addExperience = () => {
    const newExperience = {
      id: generateId(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    };
    onUpdateData('experience', [...resumeData.experience, newExperience]);
  };

  const updateExperience = (id: string, field: string, value: any) => {
    const updated = resumeData.experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onUpdateData('experience', updated);
  };

  const removeExperience = (id: string) => {
    const filtered = resumeData.experience.filter(exp => exp.id !== id);
    onUpdateData('experience', filtered);
  };

  const addEducation = () => {
    const newEducation = {
      id: generateId(),
      institution: '',
      degree: '',
      field: '',
      graduationYear: '',
      gpa: ''
    };
    onUpdateData('education', [...resumeData.education, newEducation]);
  };

  const updateEducation = (id: string, field: string, value: string) => {
    const updated = resumeData.education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onUpdateData('education', updated);
  };

  const removeEducation = (id: string) => {
    const filtered = resumeData.education.filter(edu => edu.id !== id);
    onUpdateData('education', filtered);
  };

  const addProject = () => {
    const newProject = {
      id: generateId(),
      name: '',
      description: '',
      technologies: [],
      link: ''
    };
    onUpdateData('projects', [...resumeData.projects, newProject]);
  };

  const updateProject = (id: string, field: string, value: any) => {
    const updated = resumeData.projects.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    );
    onUpdateData('projects', updated);
  };

  const removeProject = (id: string) => {
    const filtered = resumeData.projects.filter(proj => proj.id !== id);
    onUpdateData('projects', filtered);
  };

  const addCertification = () => {
    const newCertification = {
      id: generateId(),
      name: '',
      issuer: '',
      date: '',
      link: ''
    };
    onUpdateData('certifications', [...resumeData.certifications, newCertification]);
  };

  const updateCertification = (id: string, field: string, value: string) => {
    const updated = resumeData.certifications.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    );
    onUpdateData('certifications', updated);
  };

  const removeCertification = (id: string) => {
    const filtered = resumeData.certifications.filter(cert => cert.id !== id);
    onUpdateData('certifications', filtered);
  };

  const addSkill = (category: 'technical' | 'soft' | 'languages', skillName: string, level: number = 3) => {
    if (skillName.trim() && !resumeData.skills[category].some(skill => skill.name === skillName.trim())) {
      const newSkill: SkillItem = {
        name: skillName.trim(),
        level: level as 1 | 2 | 3 | 4 | 5
      };
      const updated = {
        ...resumeData.skills,
        [category]: [...resumeData.skills[category], newSkill]
      };
      onUpdateData('skills', updated);
    }
  };

  const updateSkillLevel = (category: 'technical' | 'soft' | 'languages', index: number, level: number) => {
    const updated = {
      ...resumeData.skills,
      [category]: resumeData.skills[category].map((skill, i) => 
        i === index ? { ...skill, level: level as 1 | 2 | 3 | 4 | 5 } : skill
      )
    };
    onUpdateData('skills', updated);
  };

  const removeSkill = (category: 'technical' | 'soft' | 'languages', index: number) => {
    const updated = {
      ...resumeData.skills,
      [category]: resumeData.skills[category].filter((_, i) => i !== index)
    };
    onUpdateData('skills', updated);
  };

  const handleAddSkill = (category: 'technical' | 'soft' | 'languages') => {
    const skillName = newSkills[category];
    if (skillName.trim()) {
      addSkill(category, skillName);
      setNewSkills(prev => ({ ...prev, [category]: '' }));
    }
  };

  const handleAddSkillFromSuggestion = (skill: string) => {
    // Determine which category to add the skill to based on common skill types
    const technicalKeywords = ['javascript', 'python', 'react', 'node', 'sql', 'aws', 'docker', 'git', 'typescript', 'mongodb', 'postgresql', 'graphql', 'api', 'machine learning', 'data', 'agile', 'scrum', 'ci/cd', 'kubernetes', 'microservices'];
    const languageKeywords = ['english', 'spanish', 'french', 'german', 'mandarin', 'japanese', 'portuguese', 'italian', 'arabic', 'hindi', 'korean', 'russian', 'native', 'fluent', 'conversational', 'basic'];
    
    const skillLower = skill.toLowerCase();
    
    if (languageKeywords.some(keyword => skillLower.includes(keyword))) {
      addSkill('languages', skill);
    } else if (technicalKeywords.some(keyword => skillLower.includes(keyword))) {
      addSkill('technical', skill);
    } else {
      addSkill('soft', skill);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="personal" className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            <span className="hidden sm:inline">Work</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-1">
            <GraduationCap className="w-3 h-3" />
            <span className="hidden sm:inline">Education</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span className="hidden sm:inline">Skills</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-1">
            <FolderOpen className="w-3 h-3" />
            <span className="hidden sm:inline">Projects</span>
          </TabsTrigger>
          <TabsTrigger value="certifications" className="flex items-center gap-1">
            <Award className="w-3 h-3" />
            <span className="hidden sm:inline">Certs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={resumeData.personalInfo.fullName}
                  onChange={(e) => onUpdateData('personalInfo', {
                    ...resumeData.personalInfo,
                    fullName: e.target.value
                  })}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => onUpdateData('personalInfo', {
                    ...resumeData.personalInfo,
                    email: e.target.value
                  })}
                  placeholder="john.doe@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) => onUpdateData('personalInfo', {
                    ...resumeData.personalInfo,
                    phone: e.target.value
                  })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={resumeData.personalInfo.location}
                  onChange={(e) => onUpdateData('personalInfo', {
                    ...resumeData.personalInfo,
                    location: e.target.value
                  })}
                  placeholder="San Francisco, CA"
                />
              </div>
              <div>
                <Label htmlFor="linkedIn">LinkedIn</Label>
                <Input
                  id="linkedIn"
                  value={resumeData.personalInfo.linkedIn}
                  onChange={(e) => onUpdateData('personalInfo', {
                    ...resumeData.personalInfo,
                    linkedIn: e.target.value
                  })}
                  placeholder="linkedin.com/in/johndoe"
                />
              </div>
              <div>
                <Label htmlFor="website">Website/Portfolio</Label>
                <Input
                  id="website"
                  value={resumeData.personalInfo.website}
                  onChange={(e) => onUpdateData('personalInfo', {
                    ...resumeData.personalInfo,
                    website: e.target.value
                  })}
                  placeholder="johndoe.com"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea
                id="summary"
                value={resumeData.personalInfo.summary}
                onChange={(e) => onUpdateData('personalInfo', {
                  ...resumeData.personalInfo,
                  summary: e.target.value
                })}
                placeholder="Brief professional summary highlighting your key skills and experience..."
                rows={4}
              />
            </div>
          </Card>

          <ContentSuggestions 
            type="summary" 
            onApplySuggestion={(suggestion) => 
              onUpdateData('personalInfo', {
                ...resumeData.personalInfo,
                summary: suggestion
              })
            }
          />
        </TabsContent>

        <TabsContent value="experience" className="space-y-6">
          {resumeData.experience.map((exp, index) => (
            <Card key={exp.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Experience {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(exp.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Company Name</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    placeholder="Company Inc."
                  />
                </div>
                <div>
                  <Label>Position Title</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <div className="space-y-2">
                    <Input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      disabled={exp.current}
                    />
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={exp.current}
                        onCheckedChange={(checked) => updateExperience(exp.id, 'current', checked)}
                      />
                      <Label className="text-sm">Currently working here</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Label>Job Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  placeholder="Describe your role and responsibilities..."
                  rows={3}
                />
              </div>

              {/* AI Writing Assistant for this specific experience */}
              <div className="mt-4">
                <AIWritingAssistant
                  type="job-description"
                  currentContent={exp.description}
                  jobTitle={exp.position}
                  company={exp.company}
                  onApplySuggestion={(suggestion) => updateExperience(exp.id, 'description', suggestion)}
                />
              </div>
            </Card>
          ))}
          
          <Button onClick={addExperience} className="w-full" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>

          {/* General ContentSuggestions for experience section */}
          <ContentSuggestions 
            type="experience" 
            onApplySuggestion={(suggestion) => {
              // Apply to the first experience entry, or create one if none exist
              if (resumeData.experience.length === 0) {
                addExperience();
              }
              const targetId = resumeData.experience[0]?.id;
              if (targetId) {
                updateExperience(targetId, 'description', suggestion);
              }
            }}
          />
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          {resumeData.education.map((edu, index) => (
            <Card key={edu.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Education {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(edu.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Institution</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    placeholder="University of Example"
                  />
                </div>
                <div>
                  <Label>Degree/Qualification</Label>
                  <div className="space-y-2">
                    <Select
                      value={edu.degree}
                      onValueChange={(value) => {
                        if (value === 'custom') {
                          setCustomDegrees(prev => ({ ...prev, [edu.id]: '' }));
                          updateEducation(edu.id, 'degree', '');
                        } else {
                          updateEducation(edu.id, 'degree', value);
                          setCustomDegrees(prev => {
                            const newState = { ...prev };
                            delete newState[edu.id];
                            return newState;
                          });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select degree/qualification" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="custom">
                          <em>Type custom degree...</em>
                        </SelectItem>
                        {degreeOptions.map((degree) => (
                          <SelectItem key={degree} value={degree}>
                            {degree}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {(customDegrees[edu.id] !== undefined || (!edu.degree && !degreeOptions.includes(edu.degree))) && (
                      <Input
                        value={customDegrees[edu.id] !== undefined ? customDegrees[edu.id] : edu.degree}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCustomDegrees(prev => ({ ...prev, [edu.id]: value }));
                          updateEducation(edu.id, 'degree', value);
                        }}
                        placeholder="Enter custom degree/qualification"
                        className="mt-2"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <Label>Field of Study</Label>
                  <Input
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                    placeholder="Computer Science"
                  />
                </div>
                <div>
                  <Label>Graduation Year</Label>
                  <Input
                    value={edu.graduationYear}
                    onChange={(e) => updateEducation(edu.id, 'graduationYear', e.target.value)}
                    placeholder="2024"
                  />
                </div>
                <div>
                  <Label>GPA (Optional)</Label>
                  <Input
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    placeholder="3.8/4.0"
                  />
                </div>
              </div>
            </Card>
          ))}
          
          <Button onClick={addEducation} className="w-full" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Skills & Proficiency</h3>
            
            {(['technical', 'soft', 'languages'] as const).map((category) => (
              <div key={category} className="mb-6">
                <Label className="text-base font-medium capitalize mb-3 block">
                  {category === 'technical' ? 'Technical Skills' : 
                   category === 'soft' ? 'Soft Skills' : 'Languages'}
                </Label>
                
                <div className="space-y-3 mb-4">
                  {resumeData.skills[category].map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{skill.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <SkillRating
                          level={skill.level}
                          onChange={(level) => updateSkillLevel(category, index, level)}
                        />
                        <button
                          onClick={() => removeSkill(category, index)}
                          className="text-gray-400 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder={`Add ${category} skill...`}
                    value={newSkills[category]}
                    onChange={(e) => setNewSkills(prev => ({ ...prev, [category]: e.target.value }))}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddSkill(category);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddSkill(category)}
                    disabled={!newSkills[category].trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            ))}

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                ⭐ <strong>Skill Levels:</strong> Rate your proficiency from 1 (Beginner) to 5 (Expert). This helps employers understand your expertise level.
              </p>
            </div>
          </Card>

          {/* ContentSuggestions for skills section */}
          <ContentSuggestions 
            type="skills"
            onApplySuggestion={handleAddSkillFromSuggestion}
          />
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          {resumeData.projects.map((project, index) => (
            <Card key={project.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Project {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(project.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Project Name</Label>
                  <Input
                    value={project.name}
                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                    placeholder="My Awesome Project"
                  />
                </div>
                <div>
                  <Label>Project Link (Optional)</Label>
                  <Input
                    value={project.link}
                    onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                    placeholder="https://github.com/user/project"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <Label>Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  placeholder="Describe what this project does and your role in it..."
                  rows={3}
                />
              </div>
              
              <div className="mt-4">
                <Label>Technologies Used</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="secondary" className="flex items-center gap-1">
                      {tech}
                      <button
                        onClick={() => {
                          const updated = project.technologies.filter((_, i) => i !== techIndex);
                          updateProject(project.id, 'technologies', updated);
                        }}
                        className="ml-1 hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add technology..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        if (input.value.trim()) {
                          updateProject(project.id, 'technologies', [...project.technologies, input.value.trim()]);
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                      if (input && input.value.trim()) {
                        updateProject(project.id, 'technologies', [...project.technologies, input.value.trim()]);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* AI Writing Assistant for project description */}
              <div className="mt-4">
                <AIWritingAssistant
                  type="project-description"
                  currentContent={project.description}
                  projectName={project.name}
                  technologies={project.technologies}
                  onApplySuggestion={(suggestion) => updateProject(project.id, 'description', suggestion)}
                />
              </div>
            </Card>
          ))}
          
          <Button onClick={addProject} className="w-full" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6">
          {resumeData.certifications.map((cert, index) => (
            <Card key={cert.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Certification {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCertification(cert.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Certification Name</Label>
                  <Input
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                    placeholder="AWS Solutions Architect"
                  />
                </div>
                <div>
                  <Label>Issuing Organization</Label>
                  <Input
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                    placeholder="Amazon Web Services"
                  />
                </div>
                <div>
                  <Label>Date Obtained</Label>
                  <Input
                    type="month"
                    value={cert.date}
                    onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Credential Link (Optional)</Label>
                  <Input
                    value={cert.link}
                    onChange={(e) => updateCertification(cert.id, 'link', e.target.value)}
                    placeholder="https://credential-url.com"
                  />
                </div>
              </div>
            </Card>
          ))}
          
          <Button onClick={addCertification} className="w-full" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}