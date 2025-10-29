import React, { useState } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface AIWriterModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onGenerate: (keywords: string) => Promise<string>;
  onAccept: (generatedText: string) => void;
  title: string;
  promptHint: string;
}

export const AIWriterModal: React.FC<AIWriterModalProps> = ({
  isOpen,
  isLoading,
  onClose,
  onGenerate,
  onAccept,
  title,
  promptHint
}) => {
  const [keywords, setKeywords] = useState('');
  const [generatedText, setGeneratedText] = useState('');

  const handleGenerateClick = async () => {
    if (!keywords) return;
    const result = await onGenerate(keywords);
    setGeneratedText(result);
  };
  
  const handleAcceptClick = () => {
    onAccept(generatedText);
    // Reset state for next use
    setKeywords('');
    setGeneratedText('');
  };

  const handleClose = () => {
    // Reset state on close
    setKeywords('');
    setGeneratedText('');
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div 
        className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
          
          <div>
            <label htmlFor="ai-keywords" className="block text-sm font-medium text-gray-700 mb-1">
              Enter keywords or phrases
            </label>
            <textarea
              id="ai-keywords"
              rows={3}
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder={promptHint}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleGenerateClick}
              disabled={isLoading || !keywords}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon />
                  Generate
                </>
              )}
            </button>
          </div>

          {generatedText && (
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">AI Generated Result:</h3>
                <div 
                  className="text-gray-800 text-sm whitespace-pre-wrap"
                  style={{ maxHeight: '200px', overflowY: 'auto' }}
                >
                    {generatedText}
                </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-end items-center gap-4 rounded-b-lg">
           <button 
            type="button" 
            onClick={handleClose} 
            className="text-sm font-semibold text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleAcceptClick}
            disabled={!generatedText || isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors"
          >
            Use This Text
          </button>
        </div>
      </div>
    </div>
  );
};
