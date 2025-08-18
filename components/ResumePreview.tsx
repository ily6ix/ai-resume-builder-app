import React from 'react';
import { ResumeData, ResumeTemplate, SkillItem } from '../App';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { MapPin, Mail, Phone, Globe, Linkedin, ExternalLink, Star } from 'lucide-react';

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: ResumeTemplate;
  scale?: number;
}

const SkillWithRating = ({ skill, template }: { skill: SkillItem; template: ResumeTemplate }) => {
  const renderStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <Star
            key={rating}
            className={`w-3 h-3 ${
              rating <= skill.level 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderDots = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <div
            key={rating}
            className={`w-2 h-2 rounded-full ${
              rating <= skill.level 
                ? 'bg-blue-500' 
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderProgressBar = () => {
    const percentage = (skill.level / 5) * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-orange-400 to-pink-500 h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };



  if (template === 'professional') {
    return (
      <div className="flex items-center justify-between">
        <span className="text-gray-700">{skill.name}</span>
        {renderDots()}
      </div>
    );
  } else if (template === 'modern') {
    return (
      <div className="bg-gray-100 px-3 py-2 rounded">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">{skill.name}</span>
          {renderStars()}
        </div>
      </div>
    );
  } else { // creative
    return (
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-800">{skill.name}</span>
          <span className="text-xs text-gray-600">
            {['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Expert'][skill.level - 1]}
          </span>
        </div>
        {renderProgressBar()}
      </div>
    );
  }
};

export function ResumePreview({ resumeData, template, scale = 1 }: ResumePreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const containerStyle = {
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: `${100 / scale}%`,
    height: scale < 1 ? `${100 / scale}%` : 'auto'
  };

  if (template === 'professional') {
    return (
      <div style={containerStyle}>
        <div className="bg-white text-black p-8 max-w-4xl mx-auto shadow-lg min-h-[11in] w-[8.5in]">
          {/* Header */}
          <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {resumeData.personalInfo.fullName || 'Your Name'}
            </h1>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              {resumeData.personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {resumeData.personalInfo.email}
                </div>
              )}
              {resumeData.personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {resumeData.personalInfo.phone}
                </div>
              )}
              {resumeData.personalInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {resumeData.personalInfo.location}
                </div>
              )}
              {resumeData.personalInfo.linkedIn && (
                <div className="flex items-center gap-1">
                  <Linkedin className="w-4 h-4" />
                  {resumeData.personalInfo.linkedIn}
                </div>
              )}
              {resumeData.personalInfo.website && (
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {resumeData.personalInfo.website}
                </div>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {resumeData.personalInfo.summary && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {resumeData.personalInfo.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {resumeData.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className="space-y-4">
                {resumeData.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-gray-700 font-medium">{exp.company}</p>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 leading-relaxed mb-2">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resumeData.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                EDUCATION
              </h2>
              <div className="space-y-3">
                {resumeData.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                        <p className="text-gray-700">{edu.institution}</p>
                        {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        {edu.graduationYear}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {(resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0 || resumeData.skills.languages.length > 0) && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                SKILLS
              </h2>
              <div className="space-y-4">
                {resumeData.skills.technical.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Technical Skills</h3>
                    <div className="space-y-2">
                      {resumeData.skills.technical.map((skill, index) => (
                        <SkillWithRating key={index} skill={skill} template={template} />
                      ))}
                    </div>
                  </div>
                )}
                {resumeData.skills.soft.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Soft Skills</h3>
                    <div className="space-y-2">
                      {resumeData.skills.soft.map((skill, index) => (
                        <SkillWithRating key={index} skill={skill} template={template} />
                      ))}
                    </div>
                  </div>
                )}
                {resumeData.skills.languages.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Languages</h3>
                    <div className="space-y-2">
                      {resumeData.skills.languages.map((skill, index) => (
                        <SkillWithRating key={index} skill={skill} template={template} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Projects */}
          {resumeData.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                PROJECTS
              </h2>
              <div className="space-y-3">
                {resumeData.projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      {project.link && (
                        <div className="flex items-center gap-1 text-sm text-blue-600">
                          <ExternalLink className="w-3 h-3" />
                          <span>View Project</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-2">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <p className="text-gray-600 text-sm">
                        <span className="font-semibold">Technologies: </span>
                        {project.technologies.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resumeData.certifications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                CERTIFICATIONS
              </h2>
              <div className="space-y-2">
                {resumeData.certifications.map((cert) => (
                  <div key={cert.id} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                      <p className="text-gray-700">{cert.issuer}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      {formatDate(cert.date)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (template === 'modern') {
    return (
      <div style={containerStyle}>
        <div className="bg-white text-black p-8 max-w-4xl mx-auto shadow-lg min-h-[11in] w-[8.5in]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 -m-8 mb-6">
            <h1 className="text-4xl font-bold mb-3">
              {resumeData.personalInfo.fullName || 'Your Name'}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {resumeData.personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {resumeData.personalInfo.email}
                </div>
              )}
              {resumeData.personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {resumeData.personalInfo.phone}
                </div>
              )}
              {resumeData.personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {resumeData.personalInfo.location}
                </div>
              )}
              {resumeData.personalInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {resumeData.personalInfo.website}
                </div>
              )}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="col-span-1 space-y-6">
              {/* Skills */}
              {(resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0) && (
                <div>
                  <h2 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide">
                    Skills
                  </h2>
                  {resumeData.skills.technical.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-800 mb-2">Technical</h3>
                      <div className="space-y-2">
                        {resumeData.skills.technical.map((skill, index) => (
                          <SkillWithRating key={index} skill={skill} template={template} />
                        ))}
                      </div>
                    </div>
                  )}
                  {resumeData.skills.soft.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-800 mb-2">Soft Skills</h3>
                      <div className="space-y-2">
                        {resumeData.skills.soft.map((skill, index) => (
                          <SkillWithRating key={index} skill={skill} template={template} />
                        ))}
                      </div>
                    </div>
                  )}
                  {resumeData.skills.languages.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-800 mb-2">Languages</h3>
                      <div className="space-y-2">
                        {resumeData.skills.languages.map((skill, index) => (
                          <SkillWithRating key={index} skill={skill} template={template} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Education */}
              {resumeData.education.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide">
                    Education
                  </h2>
                  <div className="space-y-3">
                    {resumeData.education.map((edu) => (
                      <div key={edu.id}>
                        <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                        <p className="text-gray-700 text-sm">{edu.field}</p>
                        <p className="text-gray-600 text-sm">{edu.institution}</p>
                        <p className="text-gray-500 text-xs">{edu.graduationYear}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {resumeData.certifications.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide">
                    Certifications
                  </h2>
                  <div className="space-y-2">
                    {resumeData.certifications.map((cert) => (
                      <div key={cert.id}>
                        <h3 className="font-semibold text-gray-800 text-sm">{cert.name}</h3>
                        <p className="text-gray-600 text-xs">{cert.issuer}</p>
                        <p className="text-gray-500 text-xs">{formatDate(cert.date)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="col-span-2 space-y-6">
              {/* Professional Summary */}
              {resumeData.personalInfo.summary && (
                <div>
                  <h2 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide">
                    Professional Summary
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {resumeData.personalInfo.summary}
                  </p>
                </div>
              )}

              {/* Experience */}
              {resumeData.experience.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide">
                    Experience
                  </h2>
                  <div className="space-y-4">
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="border-l-4 border-blue-200 pl-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                            <p className="text-blue-600 font-medium">{exp.company}</p>
                          </div>
                          <div className="text-right text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                          </div>
                        </div>
                        {exp.description && (
                          <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {resumeData.projects.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide">
                    Projects
                  </h2>
                  <div className="space-y-4">
                    {resumeData.projects.map((project) => (
                      <div key={project.id} className="border-l-4 border-purple-200 pl-4">
                        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                        <p className="text-gray-700 leading-relaxed mb-2">{project.description}</p>
                        {project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.map((tech, index) => (
                              <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template === 'creative') {
    return (
      <div style={containerStyle}>
        <div className="bg-white text-black p-8 max-w-4xl mx-auto shadow-lg min-h-[11in] w-[8.5in]">
          {/* Header */}
          <div className="relative mb-8">
            <div className="absolute -left-8 -top-8 w-32 h-32 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full opacity-10"></div>
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10"></div>
            
            <div className="relative z-10">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
                {resumeData.personalInfo.fullName || 'Your Name'}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                {resumeData.personalInfo.email && (
                  <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
                    <Mail className="w-4 h-4 text-orange-500" />
                    {resumeData.personalInfo.email}
                  </div>
                )}
                {resumeData.personalInfo.phone && (
                  <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                    <Phone className="w-4 h-4 text-blue-500" />
                    {resumeData.personalInfo.phone}
                  </div>
                )}
                {resumeData.personalInfo.location && (
                  <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                    <MapPin className="w-4 h-4 text-green-500" />
                    {resumeData.personalInfo.location}
                  </div>
                )}
                {resumeData.personalInfo.website && (
                  <div className="flex items-center gap-1 bg-purple-50 px-3 py-1 rounded-full">
                    <Globe className="w-4 h-4 text-purple-500" />
                    {resumeData.personalInfo.website}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          {resumeData.personalInfo.summary && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-1 bg-gradient-to-r from-orange-400 to-pink-500 rounded"></div>
                <h2 className="text-2xl font-bold text-gray-800">About Me</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg bg-gray-50 p-4 rounded-lg border-l-4 border-orange-400">
                {resumeData.personalInfo.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {resumeData.experience.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded"></div>
                <h2 className="text-2xl font-bold text-gray-800">Experience</h2>
              </div>
              <div className="space-y-6">
                {resumeData.experience.map((exp, index) => (
                  <div key={exp.id} className="relative">
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex-shrink-0 mt-1"></div>
                      <div className="flex-1">
                        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                              <p className="text-blue-600 font-semibold">{exp.company}</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-3 py-1 rounded-full text-sm">
                              {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                            </div>
                          </div>
                          {exp.description && (
                            <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    {index < resumeData.experience.length - 1 && (
                      <div className="w-0.5 h-4 bg-gradient-to-b from-blue-400 to-purple-500 ml-3 mt-2"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills, Education, Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills */}
            {(resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0 || resumeData.skills.languages.length > 0) && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded"></div>
                  <h2 className="text-xl font-bold text-gray-800">Skills</h2>
                </div>
                <div className="space-y-4">
                  {resumeData.skills.technical.length > 0 && (
                    <div>
                      <h3 className="font-bold text-gray-800 mb-3">Technical</h3>
                      <div className="space-y-2">
                        {resumeData.skills.technical.map((skill, index) => (
                          <SkillWithRating key={index} skill={skill} template={template} />
                        ))}
                      </div>
                    </div>
                  )}
                  {resumeData.skills.soft.length > 0 && (
                    <div>
                      <h3 className="font-bold text-gray-800 mb-3">Soft Skills</h3>
                      <div className="space-y-2">
                        {resumeData.skills.soft.map((skill, index) => (
                          <SkillWithRating key={index} skill={skill} template={template} />
                        ))}
                      </div>
                    </div>
                  )}
                  {resumeData.skills.languages.length > 0 && (
                    <div>
                      <h3 className="font-bold text-gray-800 mb-3">Languages</h3>
                      <div className="space-y-2">
                        {resumeData.skills.languages.map((skill, index) => (
                          <SkillWithRating key={index} skill={skill} template={template} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Education */}
            {resumeData.education.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded"></div>
                  <h2 className="text-xl font-bold text-gray-800">Education</h2>
                </div>
                <div className="space-y-3">
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border-l-4 border-purple-400">
                      <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-purple-700 font-medium">{edu.field}</p>
                      <p className="text-gray-700">{edu.institution}</p>
                      <p className="text-gray-600 text-sm">{edu.graduationYear}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Projects */}
          {resumeData.projects.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded"></div>
                <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumeData.projects.map((project) => (
                  <div key={project.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border-l-4 border-yellow-400">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{project.name}</h3>
                    <p className="text-gray-700 leading-relaxed mb-3">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resumeData.certifications.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded"></div>
                <h2 className="text-xl font-bold text-gray-800">Certifications</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {resumeData.certifications.map((cert) => (
                  <div key={cert.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-3 rounded-lg border-l-4 border-indigo-400">
                    <h3 className="font-bold text-gray-900 text-sm">{cert.name}</h3>
                    <p className="text-indigo-700 text-sm">{cert.issuer}</p>
                    <p className="text-gray-600 text-xs">{formatDate(cert.date)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback for unknown templates - default to professional
  return (
    <div style={containerStyle}>
      <div className="bg-white text-black p-8 max-w-4xl mx-auto shadow-lg min-h-[11in] w-[8.5in]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Template Not Found</h1>
          <p className="text-gray-600">The selected template "{template}" is not available. Please select a different template.</p>
        </div>
      </div>
    </div>
  );
}