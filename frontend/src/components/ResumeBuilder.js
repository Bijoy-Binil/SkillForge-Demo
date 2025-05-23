import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import './ResumeBuilder.css';

const ResumeBuilder = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [resumeHtml, setResumeHtml] = useState(null);
    const [rawData, setRawData] = useState(null);
    const resumeRef = useRef();

    const handleGenerateResume = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('/api/resume/generate/');
            setResumeHtml(response.data.resume_html);
            setRawData(response.data.raw_data);
        } catch (err) {
            setError('Failed to generate resume. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = useReactToPrint({
        content: () => resumeRef.current,
        pageStyle: `
            @media print {
                body {
                    padding: 20px;
                }
                .no-print {
                    display: none;
                }
            }
        `
    });

    const handleExportPDF = async () => {
        if (!resumeHtml) return;
        try {
            const response = await axios.post('/api/resume/export-pdf/', { html: resumeHtml }, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'resume.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            setError('Failed to export PDF. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="resume-builder">
            <div className="card mb-4">
                <div className="card-header">
                    <h2>AI Resume Builder</h2>
                </div>
                <div className="card-body">
                    {error && <div className="alert">{error}</div>}
                    
                    <div className="mb-4">
                        <button 
                            onClick={handleGenerateResume}
                            disabled={loading}
                            className="generate-btn"
                        >
                            {loading ? (
                                <>
                                    <div className="spinner-border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    <span>Generating...</span>
                                </>
                            ) : (
                                'Generate Resume'
                            )}
                        </button>
                        
                        {resumeHtml && (
                            <>
                                <button 
                                    onClick={handlePrint}
                                    className="no-print"
                                >
                                    Print/Download
                                </button>
                                <button
                                    onClick={handleExportPDF}
                                    className="no-print"
                                    style={{ marginLeft: '10px' }}
                                >
                                    Export as PDF
                                </button>
                            </>
                        )}
                    </div>

                    {resumeHtml && (
                        <div 
                            ref={resumeRef}
                            dangerouslySetInnerHTML={{ __html: resumeHtml }}
                            className="resume-preview"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
