
import React, { forwardRef } from 'react';
import { useResumeState } from '../contexts/ResumeContext';

const CreativeTemplate = forwardRef<HTMLDivElement>((props, ref) => {
    const { personalInfo, summary, experience, education, skills, projects } = useResumeState();

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div ref={ref} className="bg-white shadow-lg w-[210mm] min-h-[297mm] mx-auto p-12 text-gray-800 font-serif">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-extrabold tracking-tight">{personalInfo.name || 'Your Name'}</h1>
                <p className="text-xl text-gray-500 mt-2 tracking-widest uppercase">{personalInfo.title || 'Your Title'}</p>
                <div className="text-xs text-gray-600 mt-6 flex justify-center items-center gap-x-4 flex-wrap">
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.email && <><span>&bull;</span><span>{personalInfo.email}</span></>}
                    {personalInfo.location && <><span>&bull;</span><span>{personalInfo.location}</span></>}
                    {personalInfo.linkedin && <><span>&bull;</span><span>{personalInfo.linkedin}</span></>}
                </div>
            </header>

            <main>
                <Section title="Profile">
                    <p className="text-gray-700 leading-relaxed">{summary}</p>
                </Section>
                
                <Section title="Experience">
                  {experience.map(exp => (
                    <div key={exp.id} className="mb-5 last:mb-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-lg text-gray-800">{exp.role}</h3>
                        <p className="text-xs text-gray-500 font-medium uppercase">{formatDate(exp.startDate)} - {exp.endDate === 'Present' ? 'Present' : formatDate(exp.endDate)}</p>
                      </div>
                      <p className="text-blue-700 font-semibold">{exp.company}</p>
                      <ul className="mt-2 text-gray-600 space-y-1 text-sm list-disc list-inside">
                        {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^•\s*/, '')}</li>)}
                      </ul>
                    </div>
                  ))}
                </Section>

                <Section title="Projects">
                  {projects.map(proj => (
                    <div key={proj.id} className="mb-4 last:mb-0">
                      <div className="flex items-baseline gap-4">
                        <h3 className="font-bold text-lg text-gray-800">{proj.name}</h3>
                        <a href={`https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">{proj.link}</a>
                      </div>
                      <p className="mt-1 text-gray-600 text-sm">{proj.description}</p>
                    </div>
                  ))}
                </Section>

                <Section title="Education">
                  {education.map(edu => (
                    <div key={edu.id} className="mb-2 last:mb-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-lg text-gray-800">{edu.institution}</h3>
                        <p className="text-xs text-gray-500 font-medium uppercase">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                      </div>
                      <p className="text-blue-700 font-semibold">{edu.degree}</p>
                    </div>
                  ))}
                </Section>

                <Section title="Skills">
                    <p className="text-gray-700 leading-relaxed">
                        {skills.map(skill => skill.name).filter(Boolean).join(' ・ ')}
                    </p>
                </Section>
            </main>
        </div>
    );
});

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-xs font-bold uppercase tracking-[.2em] text-gray-500 border-b-2 border-gray-200 pb-2 mb-4">{title}</h2>
    <div className="text-sm">{children}</div>
  </section>
);


export default CreativeTemplate;
