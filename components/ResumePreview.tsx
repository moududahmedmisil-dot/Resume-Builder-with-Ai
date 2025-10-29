
import React, { forwardRef } from 'react';
import { useResumeState } from '../contexts/ResumeContext';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { GraduationCapIcon } from './icons/GraduationCapIcon';
import { CodeIcon } from './icons/CodeIcon';
import { UserIcon } from './icons/UserIcon';
import { ProjectIcon } from './icons/ProjectIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { MailIcon } from './icons/MailIcon';
import { LinkedinIcon } from './icons/LinkedinIcon';
import { GithubIcon } from './icons/GithubIcon';
import { LocationIcon } from './icons/LocationIcon';

const ResumePreview = forwardRef<HTMLDivElement>((props, ref) => {
  const { personalInfo, summary, experience, education, skills, projects } = useResumeState();

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch (e) {
        return dateString;
    }
  };

  return (
    <div ref={ref} className="bg-white shadow-lg rounded-lg p-8 w-[210mm] min-h-[297mm] mx-auto text-sm">
      <header className="text-center mb-8 border-b-2 border-gray-200 pb-4">
        <h1 className="text-4xl font-bold tracking-wider text-gray-800">{personalInfo.name || 'Your Name'}</h1>
        <p className="text-lg font-medium text-blue-600 mt-1">{personalInfo.title || 'Your Title'}</p>
        <div className="flex justify-center items-center gap-x-4 gap-y-1 text-xs text-gray-600 mt-4 flex-wrap">
          {personalInfo.phone && <span className="flex items-center gap-1.5"><PhoneIcon /> {personalInfo.phone}</span>}
          {personalInfo.email && <span className="flex items-center gap-1.5"><MailIcon /> {personalInfo.email}</span>}
          {personalInfo.location && <span className="flex items-center gap-1.5"><LocationIcon /> {personalInfo.location}</span>}
          {personalInfo.linkedin && <span className="flex items-center gap-1.5"><LinkedinIcon /> {personalInfo.linkedin}</span>}
          {personalInfo.github && <span className="flex items-center gap-1.5"><GithubIcon /> {personalInfo.github}</span>}
        </div>
      </header>
      
      <main>
        <Section title="Summary" icon={<UserIcon />}>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </Section>
        
        <Section title="Experience" icon={<BriefcaseIcon />}>
          {experience.map(exp => (
            <div key={exp.id} className="mb-4 last:mb-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-base text-gray-800">{exp.role}</h3>
                <p className="text-xs text-gray-500 font-medium">{formatDate(exp.startDate)} - {exp.endDate === 'Present' ? 'Present' : formatDate(exp.endDate)}</p>
              </div>
              <p className="text-blue-600 font-semibold">{exp.company}</p>
              <ul className="mt-2 text-gray-600 list-disc list-inside space-y-1">
                {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^•\s*/, '')}</li>)}
              </ul>
            </div>
          ))}
        </Section>

        <Section title="Projects" icon={<ProjectIcon />}>
          {projects.map(proj => (
            <div key={proj.id} className="mb-4 last:mb-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-base text-gray-800">{proj.name}</h3>
                <a href={`https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">{proj.link}</a>
              </div>
              <p className="mt-1 text-gray-600">{proj.description}</p>
            </div>
          ))}
        </Section>

        <Section title="Education" icon={<GraduationCapIcon />}>
          {education.map(edu => (
            <div key={edu.id} className="mb-2 last:mb-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-base text-gray-800">{edu.institution}</h3>
                <p className="text-xs text-gray-500 font-medium">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
              </div>
              <p className="text-blue-600 font-semibold">{edu.degree}</p>
            </div>
          ))}
        </Section>

        <Section title="Skills" icon={<CodeIcon />}>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => skill.name && (
              <span key={skill.id} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">{skill.name}</span>
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
});

const Section: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
  <section className="mb-6">
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-200 pb-1 flex-grow">{title}</h2>
    </div>
    {children}
  </section>
);

export default ResumePreview;
