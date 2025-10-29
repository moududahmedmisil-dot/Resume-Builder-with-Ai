import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useResumeState, useResumeDispatch } from '../contexts/ResumeContext';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import type { WorkExperience, Education, Skill, Project } from '../types';
import { AIWriterModal } from './AIWriterModal';
import { SparklesIcon } from './icons/SparklesIcon';
import { GoogleGenAI } from '@google/genai';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <details className="group" open>
    <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      <ChevronDownIcon className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
    </summary>
    <div className="p-6 bg-white border border-gray-200 rounded-b-lg">{children}</div>
  </details>
);

type HandleDynamicChange = {
  (type: 'EXPERIENCE', id: string, field: keyof WorkExperience, value: string): void;
  (type: 'EDUCATION', id: string, field: keyof Education, value: string): void;
  (type: 'SKILL', id: string, field: keyof Skill, value: string): void;
  (type: 'PROJECT', id: string, field: keyof Project, value: string): void;
}

type ModalTarget = 
  | { type: 'summary' }
  | { type: 'experience'; id: string };

const ResumeForm: React.FC = () => {
  const state = useResumeState();
  const dispatch = useResumeDispatch();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState<ModalTarget | null>(null);
  const [aiIsLoading, setAiIsLoading] = useState(false);

  const handlePersonalInfoChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { [e.target.name]: e.target.value } });
  };

  const handleSummaryChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'UPDATE_SUMMARY', payload: e.target.value });
  };

  const handleDynamicChange: HandleDynamicChange = (
    type: 'EXPERIENCE' | 'EDUCATION' | 'SKILL' | 'PROJECT',
    id: string,
    field: string,
    value: string
  ) => {
    switch (type) {
      case 'EXPERIENCE': {
        const item = state.experience.find(i => i.id === id);
        if (item) {
          dispatch({
            type: 'UPDATE_EXPERIENCE',
            payload: { ...item, [field as keyof WorkExperience]: value }
          });
        }
        break;
      }
      case 'EDUCATION': {
        const item = state.education.find(i => i.id === id);
        if (item) {
          dispatch({
            type: 'UPDATE_EDUCATION',
            payload: { ...item, [field as keyof Education]: value }
          });
        }
        break;
      }
      case 'SKILL': {
        const item = state.skills.find(i => i.id === id);
        if (item) {
          dispatch({
            type: 'UPDATE_SKILL',
            payload: { ...item, [field as keyof Skill]: value }
          });
        }
        break;
      }
      case 'PROJECT': {
        const item = state.projects.find(i => i.id === id);
        if (item) {
          dispatch({
            type: 'UPDATE_PROJECT',
            payload: { ...item, [field as keyof Project]: value }
          });
        }
        break;
      }
    }
  };


  const addDynamicItem = (type: 'EXPERIENCE' | 'EDUCATION' | 'SKILL' | 'PROJECT') => {
    const newItem = {
      id: crypto.randomUUID(),
      company: '', role: '', startDate: '', endDate: '', description: '',
      institution: '', degree: '',
      name: '',
      link: ''
    };
    dispatch({ type: `ADD_${type}` as any, payload: newItem });
  };

  const deleteDynamicItem = (type: 'EXPERIENCE' | 'EDUCATION' | 'SKILL' | 'PROJECT', id: string) => {
    dispatch({ type: `DELETE_${type}` as any, payload: id });
  };

  const openAIModal = (target: ModalTarget) => {
    setModalTarget(target);
    setIsModalOpen(true);
  };

  const handleGenerateAI = async (keywords: string): Promise<string> => {
    if (!modalTarget) return "";
    setAiIsLoading(true);

    let prompt = '';
    if (modalTarget.type === 'summary') {
        prompt = `You are a professional resume writer. Based on the following keywords, write a compelling and professional summary for a resume in 2-4 sentences. Keywords: "${keywords}"`;
    } else if (modalTarget.type === 'experience') {
        prompt = `You are a professional resume writer. Based on the following keywords and accomplishments, write 3-4 concise and impactful bullet points for a work experience section in a resume. Start each bullet point with an action verb and on a new line, prefixed with '• '. Keywords: "${keywords}"`;
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("AI generation failed:", error);
        return "Sorry, an error occurred while generating content.";
    } finally {
        setAiIsLoading(false);
    }
  };

  const handleUseAIText = (text: string) => {
    if (!modalTarget) return;

    if (modalTarget.type === 'summary') {
        dispatch({ type: 'UPDATE_SUMMARY', payload: text });
    } else if (modalTarget.type === 'experience') {
        const exp = state.experience.find(e => e.id === modalTarget.id);
        if (exp) {
            dispatch({ type: 'UPDATE_EXPERIENCE', payload: { ...exp, description: text } });
        }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {isModalOpen && (
          <AIWriterModal
              isOpen={isModalOpen}
              isLoading={aiIsLoading}
              onClose={() => setIsModalOpen(false)}
              onGenerate={handleGenerateAI}
              onAccept={handleUseAIText}
              title={modalTarget?.type === 'summary' ? 'AI Summary Writer' : 'AI Experience Writer'}
              promptHint={
                modalTarget?.type === 'summary' 
                ? "e.g., 8 years react, led a team, increased user engagement by 20%"
                : "e.g., managed team of 5, built new dashboard, reduced bug reports by 15%"
              }
          />
      )}

      <Section title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" name="name" value={state.personalInfo.name} onChange={handlePersonalInfoChange} />
          <Input label="Job Title" name="title" value={state.personalInfo.title} onChange={handlePersonalInfoChange} />
          <Input label="Phone" name="phone" value={state.personalInfo.phone} onChange={handlePersonalInfoChange} />
          <Input label="Email" name="email" type="email" value={state.personalInfo.email} onChange={handlePersonalInfoChange} />
          <Input label="LinkedIn Profile URL" name="linkedin" value={state.personalInfo.linkedin} onChange={handlePersonalInfoChange} />
          <Input label="GitHub Profile URL" name="github" value={state.personalInfo.github} onChange={handlePersonalInfoChange} />
          <div className="md:col-span-2">
             <Input label="Location" name="location" value={state.personalInfo.location} onChange={handlePersonalInfoChange} />
          </div>
        </div>
      </Section>
      
      <Section title="Professional Summary">
        <TextArea 
          label="Summary" 
          value={state.summary} 
          onChange={handleSummaryChange} 
          onAIOpen={() => openAIModal({type: 'summary'})}
        />
      </Section>

      <Section title="Work Experience">
        <div className="space-y-4">
          {state.experience.map((exp) => (
            <div key={exp.id} className="p-4 border rounded-md relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Company" value={exp.company} onChange={e => handleDynamicChange('EXPERIENCE', exp.id, 'company', e.target.value)} />
                <Input label="Role" value={exp.role} onChange={e => handleDynamicChange('EXPERIENCE', exp.id, 'role', e.target.value)} />
                <Input label="Start Date" type="date" value={exp.startDate} onChange={e => handleDynamicChange('EXPERIENCE', exp.id, 'startDate', e.target.value)} />
                <Input label="End Date" type="text" placeholder="Present or End Date" value={exp.endDate} onChange={e => handleDynamicChange('EXPERIENCE', exp.id, 'endDate', e.target.value)} />
                <div className="md:col-span-2">
                  <TextArea 
                    label="Description" 
                    value={exp.description} 
                    onChange={e => handleDynamicChange('EXPERIENCE', exp.id, 'description', e.target.value)} 
                    onAIOpen={() => openAIModal({type: 'experience', id: exp.id})}
                  />
                </div>
              </div>
              <button onClick={() => deleteDynamicItem('EXPERIENCE', exp.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700">
                <TrashIcon />
              </button>
            </div>
          ))}
          <button onClick={() => addDynamicItem('EXPERIENCE')} className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800">
            <PlusIcon /> Add Experience
          </button>
        </div>
      </Section>

      <Section title="Education">
        <div className="space-y-4">
          {state.education.map((edu) => (
            <div key={edu.id} className="p-4 border rounded-md relative">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Institution" value={edu.institution} onChange={e => handleDynamicChange('EDUCATION', edu.id, 'institution', e.target.value)} />
                    <Input label="Degree" value={edu.degree} onChange={e => handleDynamicChange('EDUCATION', edu.id, 'degree', e.target.value)} />
                    <Input label="Start Date" type="date" value={edu.startDate} onChange={e => handleDynamicChange('EDUCATION', edu.id, 'startDate', e.target.value)} />
                    <Input label="End Date" type="date" value={edu.endDate} onChange={e => handleDynamicChange('EDUCATION', edu.id, 'endDate', e.target.value)} />
               </div>
               <button onClick={() => deleteDynamicItem('EDUCATION', edu.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700">
                <TrashIcon />
              </button>
            </div>
          ))}
          <button onClick={() => addDynamicItem('EDUCATION')} className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800">
            <PlusIcon /> Add Education
          </button>
        </div>
      </Section>
      
      <Section title="Projects">
        <div className="space-y-4">
          {state.projects.map((proj) => (
            <div key={proj.id} className="p-4 border rounded-md relative">
               <div className="grid grid-cols-1 gap-4">
                    <Input label="Project Name" value={proj.name} onChange={e => handleDynamicChange('PROJECT', proj.id, 'name', e.target.value)} />
                    <Input label="Project Link" value={proj.link} onChange={e => handleDynamicChange('PROJECT', proj.id, 'link', e.target.value)} />
                    <TextArea label="Description" value={proj.description} onChange={e => handleDynamicChange('PROJECT', proj.id, 'description', e.target.value)} />
               </div>
               <button onClick={() => deleteDynamicItem('PROJECT', proj.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700">
                <TrashIcon />
              </button>
            </div>
          ))}
          <button onClick={() => addDynamicItem('PROJECT')} className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800">
            <PlusIcon /> Add Project
          </button>
        </div>
      </Section>
      
      <Section title="Skills">
        <div className="space-y-4">
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                {state.skills.map((skill) => (
                    <div key={skill.id} className="relative">
                        <Input label="" value={skill.name} onChange={e => handleDynamicChange('SKILL', skill.id, 'name', e.target.value)} />
                        <button onClick={() => deleteDynamicItem('SKILL', skill.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700">
                            <TrashIcon className='w-4 h-4'/>
                        </button>
                    </div>
                ))}
            </div>
          <button onClick={() => addDynamicItem('SKILL')} className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800">
            <PlusIcon /> Add Skill
          </button>
        </div>
      </Section>

    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
  </div>
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    onAIOpen?: () => void;
}
const TextArea: React.FC<TextAreaProps> = ({ label, onAIOpen, ...props }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            {onAIOpen && (
                <button 
                  type="button" 
                  onClick={onAIOpen}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                    <SparklesIcon />
                    Generate with AI
                </button>
            )}
        </div>
        <textarea
            {...props}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
    </div>
);

export default ResumeForm;