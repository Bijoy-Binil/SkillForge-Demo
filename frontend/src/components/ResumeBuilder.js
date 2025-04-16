import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button, Card, Spinner, Alert } from 'react-bootstrap';
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

    return (
        <div className="resume-builder">
            <Card className="mb-4">
                <Card.Header>
                    <h2>AI Resume Builder</h2>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <div className="mb-4">
                        <Button 
                            variant="primary" 
                            onClick={handleGenerateResume}
                            disabled={loading}
                            className="me-2"
                        >
                            {loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    <span className="ms-2">Generating...</span>
                                </>
                            ) : (
                                'Generate Resume'
                            )}
                        </Button>
                        
                        {resumeHtml && (
                            <Button 
                                variant="success" 
                                onClick={handlePrint}
                                className="no-print"
                            >
                                Print/Download
                            </Button>
                        )}
                    </div>

                    {resumeHtml && (
                        <div 
                            ref={resumeRef}
                            dangerouslySetInnerHTML={{ __html: resumeHtml }}
                            className="resume-preview"
                        />
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default ResumeBuilder; 