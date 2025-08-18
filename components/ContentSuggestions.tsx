import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Lightbulb, Copy, RefreshCw, Sparkles, Target, Users, TrendingUp, Plus, Edit3 } from 'lucide-react';

interface ContentSuggestionsProps {
  type: 'summary' | 'experience' | 'skills';
  onApplySuggestion: (suggestion: string) => void;
  jobRole?: string;
  industry?: string;
}

const predefinedRoles = [
  {
    category: 'Software Developer',
    icon: Target,
    suggestions: [
      "Experienced software developer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable applications and improving system performance by 40%.",
      "Results-driven developer with strong problem-solving skills and experience in agile methodologies. Passionate about creating efficient, maintainable code and collaborating with cross-functional teams to deliver high-quality software solutions.",
      "Full-stack developer with expertise in modern web technologies and database design. Successfully led development of 3 major projects, resulting in improved user engagement and reduced load times by 35%."
    ]
  },
  {
    category: 'Marketing Professional',
    icon: TrendingUp,
    suggestions: [
      "Strategic marketing professional with 7+ years of experience in digital marketing, brand management, and campaign optimization. Proven ability to increase brand awareness by 60% and drive revenue growth through data-driven marketing strategies.",
      "Creative marketing specialist with expertise in content creation, social media management, and SEO. Successfully managed campaigns that generated 150% ROI and built engaged communities of 50K+ followers.",
      "Results-oriented marketing manager with strong analytical skills and experience in multi-channel campaigns. Led initiatives that improved customer acquisition by 45% and enhanced brand positioning in competitive markets."
    ]
  },
  {
    category: 'Project Manager',
    icon: Users,
    suggestions: [
      "Certified project manager with 8+ years of experience leading cross-functional teams and delivering complex projects on time and within budget. Expertise in Agile and Waterfall methodologies with a proven track record of 98% project success rate.",
      "Strategic project leader with strong communication skills and experience managing stakeholder relationships. Successfully delivered $2M+ projects while improving team productivity by 30% through process optimization.",
      "Detail-oriented project manager with expertise in risk management and resource allocation. Led digital transformation initiatives that reduced operational costs by 25% and improved customer satisfaction scores."
    ]
  }
];

const skillSuggestions = {
  technical: [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git',
    'TypeScript', 'MongoDB', 'PostgreSQL', 'GraphQL', 'REST APIs', 'Machine Learning',
    'Data Analysis', 'Agile', 'Scrum', 'CI/CD', 'Kubernetes', 'Microservices'
  ],
  soft: [
    'Leadership', 'Communication', 'Problem Solving', 'Team Collaboration',
    'Critical Thinking', 'Adaptability', 'Time Management', 'Creativity',
    'Emotional Intelligence', 'Conflict Resolution', 'Mentoring', 'Public Speaking',
    'Strategic Planning', 'Decision Making', 'Customer Service', 'Negotiation'
  ],
  languages: [
    'English (Native)', 'Spanish (Fluent)', 'French (Conversational)',
    'German (Basic)', 'Mandarin (Conversational)', 'Japanese (Basic)',
    'Portuguese (Fluent)', 'Italian (Conversational)', 'Arabic (Basic)',
    'Hindi (Conversational)', 'Korean (Basic)', 'Russian (Conversational)'
  ]
};

const achievementTemplates = [
  "Increased system performance by [X]% through optimization and refactoring",
  "Led a team of [X] developers to deliver [project] ahead of schedule",
  "Reduced operational costs by $[X] annually through process improvements",
  "Improved customer satisfaction scores from [X]% to [Y]%",
  "Successfully managed a budget of $[X] for [project/initiative]",
  "Trained and mentored [X] junior team members, improving team productivity by [Y]%",
  "Implemented new [technology/process] resulting in [X]% efficiency improvement",
  "Collaborated with [X] stakeholders to align project goals and deliverables"
];

// Generic summary templates that can be adapted to any role
const generateCustomSummaries = (role: string) => {
  const roleAdjectives = [
    'experienced', 'results-driven', 'dedicated', 'innovative', 'strategic',
    'detail-oriented', 'passionate', 'accomplished', 'versatile', 'dynamic'
  ];
  
  const skillAreas = [
    'problem-solving', 'team leadership', 'strategic planning', 'process optimization',
    'stakeholder management', 'cross-functional collaboration', 'performance improvement',
    'project delivery', 'quality assurance', 'customer satisfaction'
  ];
  
  const achievements = [
    'improving efficiency by 30%', 'leading successful project deliveries',
    'driving revenue growth', 'enhancing team productivity', 'streamlining operations',
    'increasing customer satisfaction', 'reducing costs by 25%', 'mentoring team members',
    'implementing best practices', 'delivering results ahead of schedule'
  ];

  return [
    `${roleAdjectives[0].charAt(0).toUpperCase() + roleAdjectives[0].slice(1)} ${role.toLowerCase()} with 5+ years of expertise in ${skillAreas[0]} and ${skillAreas[1]}. Proven track record of ${achievements[0]} and ${achievements[1]}.`,
    
    `${roleAdjectives[1].charAt(0).toUpperCase() + roleAdjectives[1].slice(1)} ${role.toLowerCase()} with strong ${skillAreas[2]} skills and experience in ${skillAreas[3]}. Successfully ${achievements[2]} while ${achievements[3]} through data-driven approaches.`,
    
    `${roleAdjectives[2].charAt(0).toUpperCase() + roleAdjectives[2].slice(1)} ${role.toLowerCase()} specializing in ${skillAreas[4]} and ${skillAreas[5]}. Led initiatives that resulted in ${achievements[4]} and ${achievements[5]}, demonstrating commitment to excellence and continuous improvement.`
  ];
};

export function ContentSuggestions({ type, onApplySuggestion, jobRole, industry }: ContentSuggestionsProps) {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customRole, setCustomRole] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');
  const [customSuggestions, setCustomSuggestions] = useState<string[]>([]);

  const handleCustomRoleSubmit = () => {
    if (customRole.trim()) {
      const suggestions = generateCustomSummaries(customRole.trim());
      setCustomSuggestions(suggestions);
    }
  };

  const handleAddCustomRole = () => {
    setIsCustomMode(true);
    setCustomRole('');
    setCustomIndustry('');
    setCustomSuggestions([]);
  };

  const handleBackToPredefined = () => {
    setIsCustomMode(false);
    setCustomSuggestions([]);
  };

  if (type === 'summary') {
    return (
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900">AI-Powered Summary Suggestions</h3>
            <p className="text-blue-700 text-sm">
              {isCustomMode ? 'Create summaries for your specific role' : 'Choose a template that matches your role'}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={isCustomMode ? handleBackToPredefined : handleAddCustomRole}
            className="flex items-center gap-2 text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            {isCustomMode ? (
              <>
                <Target className="w-4 h-4" />
                Predefined Roles
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Custom Role
              </>
            )}
          </Button>
        </div>

        {isCustomMode ? (
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customRole" className="text-sm font-medium text-blue-900">
                  Your Job Title/Role *
                </Label>
                <Input
                  id="customRole"
                  placeholder="e.g., Data Scientist, UX Designer, Sales Manager"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="mt-1 border-blue-200 focus:border-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="customIndustry" className="text-sm font-medium text-blue-900">
                  Industry (Optional)
                </Label>
                <Input
                  id="customIndustry"
                  placeholder="e.g., FinTech, Healthcare, E-commerce"
                  value={customIndustry}
                  onChange={(e) => setCustomIndustry(e.target.value)}
                  className="mt-1 border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>
            <Button
              onClick={handleCustomRoleSubmit}
              disabled={!customRole.trim()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Generate Summaries
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mb-4">
            {predefinedRoles.map((template, index) => {
              const Icon = template.icon;
              return (
                <Button
                  key={index}
                  variant={selectedCategory === index ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(index)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {template.category}
                </Button>
              );
            })}
          </div>
        )}

        <div className="space-y-3">
          {(isCustomMode && customSuggestions.length > 0 ? customSuggestions : 
            (!isCustomMode ? predefinedRoles[selectedCategory].suggestions : [])
          ).map((suggestion, index) => (
            <Card key={index} className="p-4 bg-white border-blue-100 hover:border-blue-200 transition-colors">
              <p className="text-gray-700 leading-relaxed mb-3 text-sm">{suggestion}</p>
              <Button
                size="sm"
                onClick={() => onApplySuggestion(suggestion)}
                className="flex items-center gap-2"
              >
                <Copy className="w-3 h-3" />
                Use This Summary
              </Button>
            </Card>
          ))}
          
          {isCustomMode && customRole.trim() && customSuggestions.length === 0 && (
            <Card className="p-4 bg-white border-blue-100">
              <p className="text-gray-500 text-center text-sm">
                Click "Generate Summaries" to create personalized suggestions for your role.
              </p>
            </Card>
          )}
        </div>

        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-blue-800 text-xs">
            💡 <strong>Tip:</strong> {isCustomMode ? 
              'Customize these AI-generated templates with your specific achievements, years of experience, and key accomplishments.' :
              'Customize these templates with your specific achievements, years of experience, and key skills to make them uniquely yours.'
            }
          </p>
        </div>

        {isCustomMode && (
          <div className="mt-3 p-3 bg-indigo-100 rounded-lg">
            <p className="text-indigo-800 text-xs">
              🎯 <strong>Pro Tip:</strong> Be specific with your role title (e.g., "Senior Frontend Developer" instead of just "Developer") for more targeted suggestions.
            </p>
          </div>
        )}
      </Card>
    );
  }

  if (type === 'skills') {
    return (
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-2 rounded-lg">
            <Target className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-green-900">Popular Skills by Category</h3>
            <p className="text-green-700 text-sm">Click to add relevant skills to your resume</p>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(skillSuggestions).map(([category, skills]) => (
            <div key={category}>
              <h4 className="font-medium text-gray-800 mb-3 capitalize">
                {category === 'technical' ? 'Technical Skills' : 
                 category === 'soft' ? 'Soft Skills' : 'Languages'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, isExpanded ? skills.length : 10).map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer hover:bg-green-100 hover:border-green-300 transition-colors"
                    onClick={() => onApplySuggestion(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              {!isExpanded && skills.length > 10 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                  className="mt-2 text-green-600 hover:text-green-700"
                >
                  Show more skills...
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (type === 'experience') {
    return (
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-purple-900">Achievement Templates</h3>
            <p className="text-purple-700 text-sm">Quantify your impact with these proven formats</p>
          </div>
        </div>

        <div className="space-y-3">
          {achievementTemplates.map((template, index) => (
            <Card key={index} className="p-4 bg-white border-purple-100 hover:border-purple-200 transition-colors">
              <p className="text-gray-700 leading-relaxed mb-3 text-sm">{template}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onApplySuggestion(template)}
                className="flex items-center gap-2"
              >
                <Copy className="w-3 h-3" />
                Use Template
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-4 p-3 bg-purple-100 rounded-lg">
          <p className="text-purple-800 text-xs">
            📊 <strong>Best Practice:</strong> Replace [X] and [Y] with specific numbers and metrics. Quantified achievements are 3x more likely to get noticed by recruiters.
          </p>
        </div>
      </Card>
    );
  }

  return null;
}