import React from 'react';
import { getAttendanceStats } from '../../services/attendanceService';
import { formatDate } from '../../utils/helpers';
import AIEventReport from './AIEventReport';
import '../../styles/components.css';
import '../../styles/ai-report.css';

const EventReportGenerator = ({
    event,
    institutionName,
    attendance,
    registrations,
    feedback,
    users,
    roomData,
    userRole
}) => {

    const generateReport = () => {
        const attendanceStats = getAttendanceStats(attendance || {});
        const registrationCount = registrations ? Object.keys(registrations).length : 0;
        const feedbackData = feedback || { averageRating: 0, totalCount: 0 };

        // Get event image from localStorage
        let eventImageData = null;
        if (event.imagePath) {
            try {
                eventImageData = localStorage.getItem(`event_image_${event.imagePath}`);
            } catch (error) {
                console.error('Error loading event image:', error);
            }
        }

        // Create a printable HTML document
        const reportWindow = window.open('', '_blank');
        reportWindow.document.write(generateReportHTML({
            event,
            institutionName,
            attendanceStats,
            registrationCount,
            feedbackData,
            attendance,
            registrations,
            users,
            roomData,
            eventImageData
        }));
        reportWindow.document.close();

        // Wait for images to load before printing
        setTimeout(() => {
            reportWindow.print();
        }, 500);
    };

    const generateReportHTML = (data) => {
        const presentStudents = data.attendance ?
            Object.entries(data.attendance)
                .filter(([userId, att]) => att.status === 'present')
                .map(([userId, att]) => ({
                    ...att,
                    ...data.users[userId]
                }))
                .sort((a, b) => a.name?.localeCompare(b.name)) : [];

        const absentStudents = data.attendance ?
            Object.entries(data.attendance)
                .filter(([userId, att]) => att.status === 'absent')
                .map(([userId, att]) => ({
                    ...att,
                    ...data.users[userId]
                }))
                .sort((a, b) => a.name?.localeCompare(b.name)) : [];

        const registeredStudents = data.registrations ?
            Object.entries(data.registrations)
                .map(([userId, reg]) => ({
                    ...reg,
                    ...data.users[userId]
                }))
                .sort((a, b) => a.name?.localeCompare(b.name)) : [];

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Event Report - ${data.event.title}</title>
    <style>
        @page {
            size: A4;
            margin: 15mm;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
        }
        
        .page {
            page-break-after: always;
            padding: 20px;
        }
        
        .page:last-child {
            page-break-after: auto;
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid #667eea;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        
        .institution-name {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
            text-transform: uppercase;
        }
        
        .report-title {
            font-size: 18px;
            color: #555;
            margin-top: 10px;
        }
        
        .report-date {
            font-size: 12px;
            color: #999;
            margin-top: 5px;
        }
        
        .section {
            margin: 25px 0;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #667eea;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 8px;
            margin-bottom: 15px;
        }
        
        .event-image {
            width: 100%;
            max-height: 400px;
            object-fit: cover;
            border-radius: 8px;
            margin: 15px 0;
            border: 2px solid #e0e0e0;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 15px 0;
        }
        
        .info-item {
            padding: 10px;
            background: #f8f9fa;
            border-radius: 6px;
            border-left: 4px solid #667eea;
        }
        
        .info-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .info-value {
            font-size: 16px;
            color: #333;
            font-weight: 500;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        
        .stat-card {
            text-align: center;
            padding: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 8px;
        }
        
        .stat-card.success {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        }
        
        .stat-card.danger {
            background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
        }
        
        .stat-card.warning {
            background: linear-gradient(135deg, #ffc107 0%, #ff8b3d 100%);
        }
        
        .stat-number {
            font-size: 32px;
            font-weight: bold;
            margin: 5px 0;
        }
        
        .stat-label {
            font-size: 12px;
            opacity: 0.9;
            text-transform: uppercase;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 12px;
        }
        
        table thead {
            background: #667eea;
            color: white;
        }
        
        table th {
            padding: 10px;
            text-align: left;
            font-weight: 600;
        }
        
        table td {
            padding: 8px;
            border-bottom: 1px solid #e0e0e0;
        }
        
        table tbody tr:nth-child(even) {
            background: #f8f9fa;
        }
        
        table tbody tr.absent-row {
            background: #ffe6e6;
        }
        
        .status-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
        }
        
        .status-present {
            background: #d4edda;
            color: #155724;
        }
        
        .status-absent {
            background: #f8d7da;
            color: #721c24;
        }
        
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
            font-size: 11px;
            color: #999;
        }
        
        .signature-section {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-top: 50px;
        }
        
        .signature-box {
            text-align: center;
            padding: 15px;
            border-top: 2px solid #333;
        }
        
        .signature-label {
            font-size: 12px;
            color: #666;
            margin-top: 10px;
        }
        
        @media print {
            body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }
            
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <!-- PAGE 1: Event Overview & Image -->
    <div class="page">
        <div class="header">
            <div class="institution-name">${data.institutionName}</div>
            <div class="report-title">EVENT REPORT</div>
            <div class="report-date">Generated on ${new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}</div>
        </div>
        
        <div class="section">
            <div class="section-title">Event Information</div>
            
            <h2 style="color: #667eea; margin: 15px 0; text-align: center; font-size: 24px;">
                ${data.event.title}
            </h2>
            
            ${data.eventImageData ? `
                <img src="${data.eventImageData}" alt="Event Image" class="event-image" />
            ` : `
                <div style="width: 100%; height: 300px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                     border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; 
                     font-size: 48px; margin: 15px 0;">
                    📅
                </div>
            `}
            
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Event Type</div>
                    <div class="info-value">${data.event.type}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Venue</div>
                    <div class="info-value">${data.event.roomName}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Date</div>
                    <div class="info-value">${formatDate(data.event.startDate)}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Time</div>
                    <div class="info-value">${data.event.startTime} - ${data.event.endTime}</div>
                </div>
                ${data.event.guestNames ? `
                <div class="info-item" style="grid-column: span 2;">
                    <div class="info-label">Guest Speakers</div>
                    <div class="info-value">${data.event.guestNames}</div>
                </div>
                ` : ''}
                ${data.event.description ? `
                <div class="info-item" style="grid-column: span 2;">
                    <div class="info-label">Description</div>
                    <div class="info-value">${data.event.description}</div>
                </div>
                ` : ''}
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">Event Statistics</div>
            <div class="stats-grid">
                <div class="stat-card warning">
                    <div class="stat-label">Registrations</div>
                    <div class="stat-number">${data.registrationCount}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Marked</div>
                    <div class="stat-number">${data.attendanceStats.total}</div>
                </div>
                <div class="stat-card success">
                    <div class="stat-label">Present</div>
                    <div class="stat-number">${data.attendanceStats.present}</div>
                    <div style="font-size: 14px; margin-top: 5px;">${data.attendanceStats.presentPercentage}%</div>
                </div>
                <div class="stat-card danger">
                    <div class="stat-label">Absent</div>
                    <div class="stat-number">${data.attendanceStats.absent}</div>
                    <div style="font-size: 14px; margin-top: 5px;">${data.attendanceStats.absentPercentage}%</div>
                </div>
            </div>
            
            ${data.event.isPaid ? `
            <div class="info-grid" style="margin-top: 20px;">
                <div class="info-item">
                    <div class="info-label">Event Fee</div>
                    <div class="info-value">₹${data.event.fee}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Total Revenue</div>
                    <div class="info-value">₹${data.registrationCount * data.event.fee}</div>
                </div>
            </div>
            ` : ''}
            
            ${data.feedbackData.totalCount > 0 ? `
            <div class="info-grid" style="margin-top: 20px;">
                <div class="info-item">
                    <div class="info-label">Average Rating</div>
                    <div class="info-value">${'⭐'.repeat(Math.round(data.feedbackData.averageRating))} ${data.feedbackData.averageRating}/5</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Total Feedback</div>
                    <div class="info-value">${data.feedbackData.totalCount} responses</div>
                </div>
            </div>
            ` : ''}
        </div>
        
        <div class="footer">
            Report generated automatically by Institution ERP System | Page 1 of 4
        </div>
    </div>
    
    <!-- PAGE 2: Present Students -->
    <div class="page">
        <div class="header">
            <div class="institution-name">${data.institutionName}</div>
            <div class="report-title">${data.event.title} - PRESENT STUDENTS</div>
        </div>
        
        <div class="section">
            <div class="section-title">Students Present (${presentStudents.length})</div>
            
            ${presentStudents.length > 0 ? `
            <table>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>USN</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Marked At</th>
                        <th>Distance</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${presentStudents.map((student, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${student.usn || 'N/A'}</td>
                        <td>${student.name || 'Unknown'}</td>
                        <td>${student.department || 'N/A'}</td>
                        <td>${new Date(student.timestamp).toLocaleString('en-IN')}</td>
                        <td>${student.distance || 0}m</td>
                        <td><span class="status-badge status-present">✓ Present</span></td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : '<p style="text-align: center; padding: 40px; color: #999;">No students marked present</p>'}
        </div>
        
        <div class="footer">
            Report generated automatically by Institution ERP System | Page 2 of 4
        </div>
    </div>
    
    <!-- PAGE 3: Absent Students -->
    <div class="page">
        <div class="header">
            <div class="institution-name">${data.institutionName}</div>
            <div class="report-title">${data.event.title} - ABSENT STUDENTS</div>
        </div>
        
        <div class="section">
            <div class="section-title">Students Absent (${absentStudents.length})</div>
            
            ${absentStudents.length > 0 ? `
            <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid #ffc107;">
                <strong>Note:</strong> Students marked absent were outside the ${data.roomData?.radius || 100}m radius of the event location when they attempted to mark attendance.
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>USN</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Marked At</th>
                        <th>Distance</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${absentStudents.map((student, index) => `
                    <tr class="absent-row">
                        <td>${index + 1}</td>
                        <td>${student.usn || 'N/A'}</td>
                        <td>${student.name || 'Unknown'}</td>
                        <td>${student.department || 'N/A'}</td>
                        <td>${new Date(student.timestamp).toLocaleString('en-IN')}</td>
                        <td style="font-weight: bold; color: #dc3545;">${student.distance || 0}m</td>
                        <td><span class="status-badge status-absent">✗ Absent</span></td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : '<p style="text-align: center; padding: 40px; color: #999;">No students marked absent</p>'}
        </div>
        
        <div class="footer">
            Report generated automatically by Institution ERP System | Page 3 of 4
        </div>
    </div>
    
    <!-- PAGE 4: Registrations & Summary -->
    <div class="page">
        <div class="header">
            <div class="institution-name">${data.institutionName}</div>
            <div class="report-title">${data.event.title} - REGISTRATIONS</div>
        </div>
        
        <div class="section">
            <div class="section-title">Registered Students (${registeredStudents.length})</div>
            
            ${registeredStudents.length > 0 ? `
            <table>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>USN</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Email</th>
                        <th>Registered On</th>
                        ${data.event.isPaid ? '<th>Amount Paid</th>' : ''}
                    </tr>
                </thead>
                <tbody>
                    ${registeredStudents.map((student, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${student.usn || 'N/A'}</td>
                        <td>${student.name || 'Unknown'}</td>
                        <td>${student.department || 'N/A'}</td>
                        <td style="font-size: 10px;">${student.email || 'N/A'}</td>
                        <td>${new Date(student.registeredAt).toLocaleDateString('en-IN')}</td>
                        ${data.event.isPaid ? `<td>₹${student.amountPaid || 0}</td>` : ''}
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : '<p style="text-align: center; padding: 40px; color: #999;">No registrations for this event</p>'}
        </div>
        
        <div class="signature-section">
            <div class="signature-box">
                <div style="height: 40px;"></div>
                <div class="signature-label">Event Coordinator</div>
            </div>
            <div class="signature-box">
                <div style="height: 40px;"></div>
                <div class="signature-label">HOD Signature</div>
            </div>
            <div class="signature-box">
                <div style="height: 40px;"></div>
                <div class="signature-label">Principal Signature</div>
            </div>
        </div>
        
        <div class="footer">
            Report generated automatically by Institution ERP System | Page 4 of 4
        </div>
    </div>
</body>
</html>
        `;
    };

    // Get event images for AI report
    const getEventImages = () => {
        const images = [];

        try {
            // Add main event image if exists
            if (event.imagePath) {
                if (event.imageUrl) {
                    // If we have a direct URL, use it
                    images.push({ url: event.imageUrl });
                } else {
                    // Try to get from localStorage as fallback
                    const mainImage = localStorage.getItem(`event_image_${event.imagePath}`);
                    if (mainImage && mainImage.startsWith('data:image')) {
                        images.push({ url: mainImage });
                    }
                }
            }

            // Add attendance proof images if any
            if (attendance) {
                Object.values(attendance).forEach(att => {
                    if (att.proofImage && att.proofImage.startsWith('data:image')) {
                        images.push({ url: att.proofImage });
                    } else if (att.proofImageUrl) {
                        images.push({ url: att.proofImageUrl });
                    }
                });
            }
        } catch (error) {
            console.error('Error processing images:', error);
        }

        return images;
    };

    return (
        <div className="ai-report">
            <AIEventReport
                event={{
                    ...event,
                    id: event?.id,
                    topic: event?.title || event?.topic,
                    date: event?.date || event?.startDate,
                    duration: event?.duration,
                    createdBy: event?.createdBy,
                    createdByRole: users?.[event?.createdBy]?.role || userRole,
                    creatorRole: users?.[event?.createdBy]?.role || userRole,
                    attendees: event?.attendees || {},
                    description: event?.description,
                    venue: event?.venue || roomData?.name,
                    institutionName,
                    imagePath: event?.imagePath
                }}
                userRole={userRole}
            />
        </div>
    );
};

export default EventReportGenerator;