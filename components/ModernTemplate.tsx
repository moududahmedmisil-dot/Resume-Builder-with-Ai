
import React, { forwardRef } from 'react';
import { useResumeState } from '../contexts/ResumeContext';
import { PhoneIcon } from './icons/PhoneIcon';
import { MailIcon } from './icons/MailIcon';
import { LinkedinIcon } from './icons/LinkedinIcon';
import { GithubIcon } from './icons/GithubIcon';
import { LocationIcon } from './icons/LocationIcon';

const ModernTemplate = forwardRef<HTMLDivElement>((props, ref) => {
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
    <div ref={ref} className="bg-white shadow-lg w-[210mm] min-h-[297mm] mx-auto text-sm font-sans flex">
      {/* Left Sidebar */}
      <aside className="w-1/3 bg-gray-800 text-white p-6 flex flex-col">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-wide">{personalInfo.name || 'Your Name'}</h1>
          <p className="text-md text-blue-300 mt-1">{personalInfo.title || 'Your Title'}</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider border-b border-blue-300 pb-1 mb-3 text-blue-200">Contact</h2>
            <div className="space-y-2 text-xs">
              {personalInfo.phone && <p className="flex items-center gap-2"><PhoneIcon /> {personalInfo.phone}</p>}
              {personalInfo.email && <p className="flex items-center gap-2"><MailIcon /> {personalInfo.email}</p>}
              {personalInfo.location && <p className="flex items-center gap-2"><LocationIcon /> {personalInfo.location}</p>}
              {personalInfo.linkedin && <p className="flex items-center gap-2"><LinkedinIcon /> {personalInfo.linkedin}</p>}
              {personalInfo.github && <p className="flex items-center gap-2"><GithubIcon /> {personalInfo.github}</p>}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider border-b border-blue-300 pb-1 mb-3 text-blue-200">Education</h2>
            {education.map(edu => (
              <div key={edu.id} className="mb-2 last:mb-0">
                <h3 className="font-bold text-base">{edu.institution}</h3>
                <p className="text-blue-300 text-xs">{edu.degree}</p>
                <p className="text-gray-400 text-xs mt-1">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
              </div>
            ))}
          </section>
          
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider border-b border-blue-300 pb-1 mb-3 text-blue-200">Skills</h2>
            <div className="flex flex-wrap gap-2">
                {skills.map(skill => skill.name && (
                    <span key={skill.id} className="bg-blue-200 text-blue-900 text-xs font-semibold px-2 py-0.5 rounded">{skill.name}</span>
                ))}
            </div>
          </section>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-2/3 p-8">
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4 uppercase tracking-wider">Summary</h2>
          <p className="text-gray-700 leading-relaxed text-sm">{summary}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4 uppercase tracking-wider">Experience</h2>
          {experience.map(exp => (
            <div key={exp.id} className="mb-4 last:mb-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-base text-gray-800">{exp.role}</h3>
                <p className="text-xs text-gray-500 font-medium">{formatDate(exp.startDate)} - {exp.endDate === 'Present' ? 'Present' : formatDate(exp.endDate)}</p>
              </div>
              <p className="text-blue-600 font-semibold text-sm">{exp.company}</p>
              <ul className="mt-2 text-gray-600 list-disc list-inside space-y-1 text-xs">
                {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^•\s*/, '')}</li>)}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4 uppercase tracking-wider">Projects</h2>
          {projects.map(proj => (
            <div key={proj.id} className="mb-4 last:mb-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-base text-gray-800">{proj.name}</h3>
                <a href={`https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">{proj.link}</a>
              </div>
              <p className="mt-1 text-gray-600 text-xs">{proj.description}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
});

export default ModernTemplate;
