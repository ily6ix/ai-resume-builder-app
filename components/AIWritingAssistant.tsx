import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Sparkles, 
  Copy, 
  RefreshCw, 
  Wand2, 
  Brain, 
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AIWritingAssistantProps {
  type: 'job-description' | 'project-description';
  onApplySuggestion: (suggestion: string) => void;
  currentContent?: string;
  jobTitle?: string;
  company?: string;
  projectName?: string;
  technologies?: string[];
}

const jobDescriptionTemplates = [
  "Led cross-functional team of [X] members to deliver [project/initiative] that resulted in [specific outcome/metric]",
  "Developed and implemented [technology/system] that improved [metric] by [X]% and reduced [cost/time] by [Y]%",
  "Collaborated with [departments/stakeholders] to design and execute [strategy/solution] achieving [specific result]",
  "Managed [budget/resources] worth $[X] while overseeing [project/process] delivery within [timeframe]",
  "Optimized [process/system] through [methodology/approach] resulting in [X]% efficiency improvement",
  "Mentored and trained [X] team members in [skills/technologies] improving overall team productivity by [Y]%",
  "Spearheaded [initiative/project] from conception to deployment, serving [X] users and generating $[Y] revenue",
  "Implemented [technology/framework] to automate [process] reducing manual effort by [X] hours per week"
];

const projectDescriptionTemplates = [
  "Built a [type] application using [technologies] that allows users to [main functionality] with [key features]",
  "Developed [project type] to solve [problem] by implementing [solution approach] resulting in [outcome/benefit]",
  "Created [application/system] that integrates with [external services/APIs] to provide [core functionality] for [target users]",
  "Designed and implemented [architecture/feature] using [technologies] to handle [scale/requirement] with [performance metric]",
  "Architected [system/application] with [key technologies] featuring [main capabilities] and supporting [user count/scale]",
  "Built responsive [type] application with [technologies] including features like [feature 1], [feature 2], and [feature 3]",
  "Developed [project name] using [tech stack] to [primary purpose] with automated [testing/deployment/feature]",
  "Created full-stack [application type] leveraging [technologies] with real-time [feature] and [additional capability]"
];

const toneOptions = [
  { id: 'professional', label: 'Professional', description: 'Formal and business-appropriate' },
  { id: 'dynamic', label: 'Dynamic', description: 'Action-oriented and energetic' },
  { id: 'technical', label: 'Technical', description: 'Focused on technical details' },
  { id: 'results-focused', label: 'Results-Focused', description: 'Emphasizes outcomes and metrics' }
];

const generateSmartSuggestion = (
  type: 'job-description' | 'project-description',
  jobTitle?: string,
  company?: string,
  projectName?: string,
  technologies?: string[],
  tone: string = 'professional'
) => {
  if (type === 'job-description') {
    const templates = jobDescriptionTemplates;
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    let suggestion = template;
    
    // Replace placeholders with context-aware content
    if (jobTitle) {
      if (jobTitle.toLowerCase().includes('developer') || jobTitle.toLowerCase().includes('engineer')) {
        suggestion = suggestion.replace('[technology/system]', 'scalable software solutions')
                              .replace('[methodology/approach]', 'agile development practices')
                              .replace('[project/initiative]', 'software development project');
      } else if (jobTitle.toLowerCase().includes('manager')) {
        suggestion = suggestion.replace('[project/initiative]', 'strategic initiative')
                              .replace('[methodology/approach]', 'data-driven strategies')
                              .replace('[departments/stakeholders]', 'cross-functional teams');
      } else if (jobTitle.toLowerCase().includes('designer')) {
        suggestion = suggestion.replace('[technology/system]', 'design systems and user interfaces')
                              .replace('[methodology/approach]', 'user-centered design principles')
                              .replace('[project/initiative]', 'design project');
      }
    }
    
    // Apply tone adjustments
    if (tone === 'dynamic') {
      suggestion = suggestion.replace('Led', 'Spearheaded')
                            .replace('Developed', 'Pioneered')
                            .replace('Managed', 'Orchestrated');
    } else if (tone === 'technical') {
      suggestion = suggestion.replace('[specific outcome/metric]', 'improved system performance and code quality')
                            .replace('[technology/system]', 'robust technical architecture');
    }
    
    return suggestion;
  } else {
    const templates = projectDescriptionTemplates;
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    let suggestion = template;
    
    if (projectName) {
      suggestion = suggestion.replace('[project name]', projectName);
    }
    
    if (technologies && technologies.length > 0) {
      const techStack = technologies.slice(0, 3).join(', ');
      suggestion = suggestion.replace('[technologies]', techStack)
                            .replace('[tech stack]', techStack)
                            .replace('[key technologies]', techStack);
    }
    
    // Apply tone adjustments
    if (tone === 'technical') {
      suggestion = suggestion.replace('[type]', 'full-stack web')
                            .replace('[application type]', 'scalable web application')
                            .replace('[system/application]', 'microservices architecture');
    } else if (tone === 'results-focused') {
      suggestion = suggestion.replace('[outcome/benefit]', 'improved user engagement by 40%')
                            .replace('[performance metric]', '99.9% uptime');
    }
    
    return suggestion;
  }
};

export function AIWritingAssistant({ 
  type, 
  onApplySuggestion, 
  currentContent = '',
  jobTitle,
  company,
  projectName,
  technologies = []
}: AIWritingAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTone, setSelectedTone] = useState('professional');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSuggestions, setGeneratedSuggestions] = useState<string[]>([]);

  const isJobDescription = type === 'job-description';
  const templates = isJobDescription ? jobDescriptionTemplates : projectDescriptionTemplates;

  const handleGenerateFromPrompt = async () => {
    if (!customPrompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate 3 suggestions based on the prompt
    const suggestions = [];
    for (let i = 0; i < 3; i++) {
      const suggestion = generateSmartSuggestion(
        type, 
        jobTitle, 
        company, 
        projectName, 
        technologies, 
        selectedTone
      );
      suggestions.push(suggestion);
    }
    
    setGeneratedSuggestions(suggestions);
    setIsGenerating(false);
    toast.success('Generated new suggestions based on your prompt!');
  };

  const handleImproveExisting = async () => {
    if (!currentContent.trim()) {
      toast.error('No existing content to improve. Please add some text first.');
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate AI improvement delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Generate improved versions
    const improvements = [
      currentContent + ' Additionally, collaborated with stakeholders to ensure alignment with business objectives.',
      currentContent.replace(/\b(developed|created|built)\b/gi, 'architected and implemented') + ' This solution exceeded performance expectations.',
      currentContent + ' Implemented best practices that became a template for future projects.'
    ];
    
    setGeneratedSuggestions(improvements);
    setIsGenerating(false);
    toast.success('Generated improved versions of your content!');
  };

  const handleGenerateFromTone = async () => {
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const suggestions = [];
    for (let i = 0; i < 3; i++) {
      const suggestion = generateSmartSuggestion(
        type, 
        jobTitle, 
        company, 
        projectName, 
        technologies, 
        selectedTone
      );
      suggestions.push(suggestion);
    }
    
    setGeneratedSuggestions(suggestions);
    setIsGenerating(false);
    toast.success(`Generated ${selectedTone} suggestions!`);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Brain className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-indigo-900">AI Writing Assistant</h3>
            <p className="text-indigo-700 text-sm">
              {isJobDescription ? 'Generate compelling job descriptions' : 'Create detailed project descriptions'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-indigo-600 hover:text-indigo-700"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          size="sm"
          variant="outline"
          onClick={handleGenerateFromTone}
          disabled={isGenerating}
          className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
        >
          <Sparkles className="w-3 h-3" />
          Generate New
        </Button>
        
        {currentContent && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleImproveExisting}
            disabled={isGenerating}
            className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            <Wand2 className="w-3 h-3" />
            Improve Existing
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-4 mb-4">
          {/* Tone Selection */}
          <div>
            <Label className="text-sm font-medium text-indigo-900 mb-2 block">Writing Tone</Label>
            <div className="grid grid-cols-2 gap-2">
              {toneOptions.map((tone) => (
                <Button
                  key={tone.id}
                  variant={selectedTone === tone.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTone(tone.id)}
                  className={`text-left flex-col items-start h-auto p-3 ${
                    selectedTone === tone.id 
                      ? "bg-indigo-600 text-white" 
                      : "border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  }`}
                >
                  <span className="font-medium">{tone.label}</span>
                  <span className="text-xs opacity-80">{tone.description}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Prompt */}
          <div>
            <Label className="text-sm font-medium text-indigo-900 mb-2 block">Custom Prompt (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder={isJobDescription 
                  ? "e.g., Focus on leadership and team management..." 
                  : "e.g., Emphasize scalability and performance..."}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="border-indigo-200 focus:border-indigo-400"
              />
              <Button
                onClick={handleGenerateFromPrompt}
                disabled={!customPrompt.trim() || isGenerating}
                className="flex items-center gap-2"
              >
                <Zap className="w-3 h-3" />
                Generate
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <Card className="p-4 bg-white border-indigo-100">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-indigo-700">Generating suggestions...</span>
          </div>
        </Card>
      )}

      {/* Generated Suggestions */}
      {generatedSuggestions.length > 0 && !isGenerating && (
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-indigo-600" />
            <Label className="text-sm font-medium text-indigo-900">AI Generated Suggestions</Label>
          </div>
          {generatedSuggestions.map((suggestion, index) => (
            <Card key={index} className="p-4 bg-white border-indigo-100 hover:border-indigo-200 transition-colors">
              <p className="text-gray-700 leading-relaxed mb-3 text-sm">{suggestion}</p>
              <Button
                size="sm"
                onClick={() => onApplySuggestion(suggestion)}
                className="flex items-center gap-2"
              >
                <Copy className="w-3 h-3" />
                Use This Content
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Template Suggestions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-indigo-600" />
          <Label className="text-sm font-medium text-indigo-900">Template Suggestions</Label>
        </div>
        {templates.slice(0, isExpanded ? templates.length : 3).map((template, index) => (
          <Card key={index} className="p-4 bg-white border-indigo-100 hover:border-indigo-200 transition-colors">
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
        
        {!isExpanded && templates.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="w-full text-indigo-600 hover:text-indigo-700"
          >
            Show {templates.length - 3} more templates...
          </Button>
        )}
      </div>

      <div className="mt-4 p-3 bg-indigo-100 rounded-lg">
        <p className="text-indigo-800 text-xs">
          🤖 <strong>AI Tip:</strong> Replace placeholder text like [X], [Y], and bracketed terms with specific numbers, technologies, or achievements for maximum impact.
        </p>
      </div>
    </Card>
  );
}