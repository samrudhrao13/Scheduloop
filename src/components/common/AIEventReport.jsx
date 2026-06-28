import React, { useState, useEffect } from 'react';
import { generateAIReport, getReports, deleteReport } from '../../services/aiReportService';
import { getEventImageUrl } from '../../services/storageService';
import LoadingSpinner from './LoadingSpinner';
import { formatDate } from '../../utils/helpers';
import '../../styles/components.css';
import '../../styles/ai-report.css';

const AIEventReport = ({ event, userRole }) => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [headerImage, setHeaderImage] = useState(null);

    useEffect(() => {
        fetchReports();
    }, [userRole, event?.id]);

    useEffect(() => {
        // Load only the main event image from storage (if path exists)
        const load = async () => {
            if (event?.imagePath) {
                const url = await getEventImageUrl(event.imagePath);
                setHeaderImage(url);
            } else {
                setHeaderImage(null);
            }
        };
        load();
    }, [event?.imagePath]);

    const fetchReports = async () => {
        try {
            const result = await getReports(userRole, event?.id);
            if (result.success) {
                setReports(result.reports);
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError('Failed to fetch reports');
        }
    };

    const handleGenerateReport = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Event data:', event);
            console.log('User role:', userRole);

            // Validate event data with better error messages
            if (!event) {
                throw new Error('Event object is missing');
            }

            const eventId = event.id || event._id || event.key;
            if (!eventId) {
                throw new Error('Event ID is missing');
            }

            const eventTitle = event.topic || event.title || event.name;
            if (!eventTitle) {
                throw new Error('Event title/topic is missing');
            }

            const eventData = {
                id: eventId,
                topic: eventTitle,
                date: event.date || event.startDate || event.createdAt || Date.now(),
                duration: event.duration || 'Not specified',
                createdBy: event.createdBy || 'Unknown',
                attendees: event.attendees || {},
                description: event.description || '',
                venue: event.venue || event.roomName || 'Not specified',
                institutionName: event.institutionName || 'Institution'
            };

            console.log('Formatted event data:', eventData);

            const result = await generateAIReport(eventData, eventData.institutionName, userRole, headerImage);

            if (result.success) {
                await fetchReports();
                setError(null);
            } else {
                setError(result.error || 'Failed to generate report');
            }
        } catch (error) {
            console.error('Report generation error:', error);
            setError(error.message || 'Failed to generate report');
        }
        setLoading(false);
    };

    const downloadReportAsPDF = (report) => {
        // Create a printable version
        const printWindow = window.open('', '_blank');
        const content = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${report.topic} - AI Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
                    h1 { color: #1976d2; margin: 0; }
                    h2 { color: #333; margin-top: 20px; }
                    .meta { background: #f5f5f5; padding: 10px; margin: 20px 0; border-radius: 5px; }
                    .meta span { display: inline-block; margin-right: 20px; }
                    img { max-width: 100%; margin: 10px 0; }
                    .header { display:flex; gap:16px; align-items:center; border-bottom:2px solid #eee; padding-bottom:10px; }
                    .header img { max-height: 70px; margin:0; }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${window.location.origin}/logo.svg" alt="App Logo" />
                    <div>
                        <div style="font-weight:600; color:#555;">${event.institutionName || 'Institution'}</div>
                        <h1>${report.topic}</h1>
                        ${headerImage ? `<img src="${headerImage}" alt="Event" style="max-width:180px; margin-top:6px; border-radius:4px"/>` : ''}
                    </div>
                </div>
                <div class="meta">
                    <span><strong>Generated:</strong> ${formatDate(report.generatedAt)}</span>
                    <span><strong>Attendees:</strong> ${report.attendeeCount || 0}</span>
                    <span><strong>Venue:</strong> ${report.venue || 'N/A'}</span>
                </div>
                <div>${report.content.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('')}</div>
            </body>
            </html>
        `;
        printWindow.document.write(content);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    };

    const handleDelete = async (reportId) => {
        if (!window.confirm('Delete this report?')) return;
        const res = await deleteReport(reportId, userRole);
        if (!res.success) {
            setError(res.error);
        } else {
            fetchReports();
        }
    };

    const renderReport = (report) => {
        const accessRoles = {
            faculty: 'Faculty, HOD, Principal, Admin',
            hod: 'HOD, Principal, Admin',
            principal: 'Principal, Admin',
            admin: 'Admin'
        };

        return (
            <div key={report.id} className="report-container">
                <div className="report-header">
                    <div>
                        <h3>{event.institutionName || 'Institution'} — {report.topic}</h3>
                        {headerImage && (
                            <img src={headerImage} alt="Event" style={{ maxWidth: '220px', marginTop: 8, borderRadius: 4 }} />
                        )}
                        <div className="report-meta">
                            <span className="report-date">
                                Generated: {formatDate(report.generatedAt)}
                            </span>
                            {report.createdByRole && (
                                <span className="report-access">
                                    Accessible to: {accessRoles[report.createdByRole] || 'Unknown'}
                                </span>
                            )}
                            {report.attendeeCount !== undefined && (
                                <span className="report-attendees">
                                    Attendees: {report.attendeeCount}
                                </span>
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => downloadReportAsPDF(report)}
                            className="download-pdf-btn"
                            title="Download as PDF"
                        >
                            📄 Export PDF
                        </button>
                        {(report.createdByRole === userRole || userRole === 'admin') && (
                            <button
                                onClick={() => handleDelete(report.id)}
                                className="download-pdf-btn"
                                style={{ backgroundColor: '#d32f2f' }}
                                title="Delete Report"
                            >🗑 Delete</button>
                        )}
                    </div>
                </div>
                <div className="report-content">
                    <div className="report-text">
                        {report.content.split('\n').map((paragraph, index) => {
                            if (!paragraph.trim()) return null;
                            // Check if paragraph is a heading (starts with #, **, or is numbered)
                            if (paragraph.match(/^#+\s/) || paragraph.match(/^\*\*.*\*\*$/) || paragraph.match(/^\d+\.\s\*\*/)) {
                                return <h4 key={index}>{paragraph.replace(/[#*]/g, '').trim()}</h4>;
                            }
                            return <p key={index}>{paragraph}</p>;
                        })}
                    </div>
                    {report.images && report.images.length > 0 && (
                        <div className="report-images">
                            <h4>Event Images</h4>
                            {report.images.map((imageUrl, index) => (
                                <img
                                    key={index}
                                    src={imageUrl}
                                    alt={`Event image ${index + 1}`}
                                    className="report-image"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const canGenerate = userRole === event.creatorRole || userRole === event.createdByRole || userRole === event.role || userRole === event.creatorRole;

    return (
        <div className="ai-report-section">
            <div className="report-actions">
                <h2>AI Event Reports</h2>
                {canGenerate ? (
                    <button
                        onClick={handleGenerateReport}
                        disabled={loading}
                        className="generate-report-btn"
                    >
                        Generate New Report
                    </button>
                ) : (
                    <div style={{ color: '#666', fontSize: '0.85em' }}>Report generation restricted to event creator's role.</div>
                )}
            </div>

            {loading && <LoadingSpinner />}

            {error && <div className="error-message">{error}</div>}

            <div className="reports-list">
                {reports.length > 0 ? (
                    reports.map(report => renderReport(report))
                ) : (
                    <p className="no-reports">No reports available</p>
                )}
            </div>
        </div>
    );
};

export default AIEventReport;