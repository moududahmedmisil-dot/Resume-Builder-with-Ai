
import React, { createContext, useReducer, useContext, Dispatch } from 'react';
import type { ResumeData, ResumeAction, WorkExperience, Education, Skill, Project } from '../types';

const initialResumeData: ResumeData = {
  personalInfo: {
    name: 'Jane Doe',
    title: 'Senior Frontend Developer',
    phone: '123-456-7890',
    email: 'jane.doe@example.com',
    linkedin: 'linkedin.com/in/janedoe',
    github: 'github.com/janedoe',
    location: 'San Francisco, CA'
  },
  summary: 'Dedicated and experienced Frontend Developer with over 8 years of experience in building and maintaining responsive and user-friendly web applications using React, TypeScript, and modern JavaScript frameworks. Proven ability to lead projects and collaborate with cross-functional teams to deliver high-quality software.',
  experience: [
    {
      id: crypto.randomUUID(),
      company: 'Tech Solutions Inc.',
      role: 'Senior Frontend Developer',
      startDate: '2018-06-01',
      endDate: 'Present',
      description: '• Led the development of a new customer-facing dashboard, resulting in a 20% increase in user engagement.\n• Mentored junior developers and conducted code reviews to ensure code quality and consistency.\n• Collaborated with UI/UX designers to translate wireframes into high-fidelity prototypes.'
    }
  ],
  education: [
    {
      id: crypto.randomUUID(),
      institution: 'University of Technology',
      degree: 'B.S. in Computer Science',
      startDate: '2010-09-01',
      endDate: '2014-05-01'
    }
  ],
  skills: [
    { id: crypto.randomUUID(), name: 'React' },
    { id: crypto.randomUUID(), name: 'TypeScript' },
    { id: crypto.randomUUID(), name: 'JavaScript (ES6+)' },
    { id: crypto.randomUUID(), name: 'Tailwind CSS' },
    { id: crypto.randomUUID(), name: 'Node.js' },
    { id: crypto.randomUUID(), name: 'Git & GitHub' },
  ],
  projects: [
    {
      id: crypto.randomUUID(),
      name: 'E-commerce Platform',
      link: 'github.com/janedoe/ecommerce',
      description: 'A full-stack e-commerce application built with React, Redux, and Node.js, featuring product search, cart functionality, and Stripe integration for payments.'
    }
  ]
};

const resumeReducer = (state: ResumeData, action: ResumeAction): ResumeData => {
  switch (action.type) {
    case 'UPDATE_PERSONAL_INFO':
      return { ...state, personalInfo: { ...state.personalInfo, ...action.payload } };
    case 'UPDATE_SUMMARY':
      return { ...state, summary: action.payload };
    case 'ADD_EXPERIENCE':
      return { ...state, experience: [...state.experience, action.payload] };
    case 'UPDATE_EXPERIENCE':
      return { ...state, experience: state.experience.map(exp => exp.id === action.payload.id ? action.payload : exp) };
    case 'DELETE_EXPERIENCE':
      return { ...state, experience: state.experience.filter(exp => exp.id !== action.payload) };
    case 'ADD_EDUCATION':
      return { ...state, education: [...state.education, action.payload] };
    case 'UPDATE_EDUCATION':
      return { ...state, education: state.education.map(edu => edu.id === action.payload.id ? action.payload : edu) };
    case 'DELETE_EDUCATION':
      return { ...state, education: state.education.filter(edu => edu.id !== action.payload) };
    case 'ADD_SKILL':
      return { ...state, skills: [...state.skills, action.payload] };
    case 'UPDATE_SKILL':
      return { ...state, skills: state.skills.map(skill => skill.id === action.payload.id ? action.payload : skill) };
    case 'DELETE_SKILL':
      return { ...state, skills: state.skills.filter(skill => skill.id !== action.payload) };
    case 'ADD_PROJECT':
        return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
        return { ...state, projects: state.projects.map(proj => proj.id === action.payload.id ? action.payload : proj) };
    case 'DELETE_PROJECT':
        return { ...state, projects: state.projects.filter(proj => proj.id !== action.payload) };
    default:
      return state;
  }
};

const ResumeStateContext = createContext<ResumeData | undefined>(undefined);
const ResumeDispatchContext = createContext<Dispatch<ResumeAction> | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(resumeReducer, initialResumeData);
  return (
    <ResumeStateContext.Provider value={state}>
      <ResumeDispatchContext.Provider value={dispatch}>
        {children}
      </ResumeDispatchContext.Provider>
    </ResumeStateContext.Provider>
  );
};

export const useResumeState = () => {
  const context = useContext(ResumeStateContext);
  if (context === undefined) {
    throw new Error('useResumeState must be used within a ResumeProvider');
  }
  return context;
};

export const useResumeDispatch = () => {
  const context = useContext(ResumeDispatchContext);
  if (context === undefined) {
    throw new Error('useResumeDispatch must be used within a ResumeProvider');
  }
  return context;
};
