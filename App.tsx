
import React, { useRef, useState } from 'react';
import { ResumeProvider } from './contexts/ResumeContext';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import { DownloadIcon } from './components/icons/DownloadIcon';
import ModernTemplate from './components/ModernTemplate';
import CreativeTemplate from './components/CreativeTemplate';

// Make jspdf available in the window scope
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

type Template = 'classic' | 'modern' | 'creative';

const templates: { id: Template; name: string }[] = [
  { id: 'classic', name: 'Classic' },
  { id: 'modern', name: 'Modern' },
  { id: 'creative', name: 'Creative' },
];

const TemplateSelector: React.FC<{ selected: Template; onSelect: (id: Template) => void }> = ({ selected, onSelect }) => (
  <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
    {templates.map(template => (
      <button
        key={template.id}
        onClick={() => onSelect(template.id)}
        className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
          selected === template.id
            ? 'bg-white text-blue-600 shadow'
            : 'bg-transparent text-gray-600 hover:bg-gray-200'
        }`}
      >
        {template.name}
      </button>
    ))}
  </div>
);


const App: React.FC = () => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [template, setTemplate] = useState<Template>('classic');

  const handleDownloadPdf = async () => {
    const { jsPDF } = window.jspdf;
    const canvas = await window.html2canvas(previewRef.current!, { scale: 3 });
    const imgData = canvas.toDataURL('image/png');
    
    // A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;
    const widthInPdf = pdfWidth;
    const heightInPdf = widthInPdf / ratio;
    
    let position = 0;
    
    if (heightInPdf <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, widthInPdf, heightInPdf);
    } else {
        // Handle content that spans multiple pages
        let remainingHeight = imgHeight;
        while (remainingHeight > 0) {
            const pageCanvas = document.createElement('canvas');
            const pageCanvasContext = pageCanvas.getContext('2d');
            pageCanvas.width = imgWidth;
            // Height of the slice to fit on one page
            const sliceHeight = (pdfHeight * imgWidth) / pdfWidth;
            pageCanvas.height = Math.min(sliceHeight, remainingHeight);
            
            pageCanvasContext?.drawImage(canvas, 0, -position, imgWidth, imgHeight);

            const pageImgData = pageCanvas.toDataURL('image/png');
            pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, (pageCanvas.height * pdfWidth) / imgWidth);

            position += pageCanvas.height;
            remainingHeight -= pageCanvas.height;
            if (remainingHeight > 0) {
                pdf.addPage();
            }
        }
    }
    
    pdf.save('resume.pdf');
  };

  const handleExport = () => {
    setLoading(true);
    // Timeout to ensure UI updates before heavy task
    setTimeout(() => {
        handleDownloadPdf().finally(() => setLoading(false));
    }, 100);
  };

  return (
    <ResumeProvider>
      <div className="min-h-screen font-sans text-gray-800">
        <header className="bg-white shadow-md sticky top-0 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Resume Builder</h1>
              <div className="flex items-center gap-4">
                <TemplateSelector selected={template} onSelect={setTemplate} />
                <button
                    onClick={handleExport}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Exporting...
                        </>
                    ) : (
                        <>
                            <DownloadIcon />
                            Download PDF
                        </>
                    )}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="sm:hidden mb-6">
                <label htmlFor="template-select" className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                <select
                    id="template-select"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value as Template)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
            </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
            <div className="lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto pr-4 -mr-4">
              <ResumeForm />
            </div>
            <div className="mt-8 lg:mt-0">
               <div className="sticky top-[90px]">
                 {template === 'classic' && <ResumePreview ref={previewRef} />}
                 {template === 'modern' && <ModernTemplate ref={previewRef} />}
                 {template === 'creative' && <CreativeTemplate ref={previewRef} />}
               </div>
            </div>
          </div>
        </main>
      </div>
    </ResumeProvider>
  );
};

export default App;
