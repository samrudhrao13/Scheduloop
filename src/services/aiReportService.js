import { ref, set, get } from 'firebase/database';
import { database } from '../config/firebase';
import { generateId } from '../utils/helpers';

// Using OpenRouter with a free/low-cost fallback model (text-only)
// Original key (sk-or-v1...) should be placed in VITE_OPENAI_API_KEY
const OPENROUTER_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
// Recommended lightweight model for summaries (adjust if you have access to better):
const DEFAULT_MODEL = 'openai/gpt-4o-mini';

export const generateAIReport = async (eventData, institutionName, userRole, eventImageUrl = null) => {
    try {
        if (!eventData) {
            throw new Error('Event data is required');
        }
        if (!OPENROUTER_KEY) {
            throw new Error('OpenRouter API key missing (VITE_OPENAI_API_KEY).');
        }

        const prompt = generateReportPrompt({ ...eventData, institutionName }, eventImageUrl);

        const response = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_KEY}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'College ERP Event Report'
            },
            body: JSON.stringify({
                model: DEFAULT_MODEL,
                messages: [
                    { role: 'user', content: prompt }
                ],
                max_tokens: 1500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`AI API error: ${errorData.error?.message || response.statusText}`);
        }

        const aiResponse = await response.json();
        const generatedText = aiResponse.choices?.[0]?.message?.content;
        if (!generatedText) {
            throw new Error('Empty AI response');
        }

        const reportId = generateId();
        const report = {
            eventId: eventData.id,
            content: generatedText,
            generatedAt: Date.now(),
            createdBy: eventData.createdBy,
            createdByRole: userRole,
            image: eventImageUrl || null,
            topic: eventData.topic,
            venue: eventData.venue,
            date: eventData.date,
            attendeeCount: eventData.attendees ? Object.keys(eventData.attendees).length : 0,
            accessibleTo: generateAccessHierarchy(userRole)
        };

        await saveReport(reportId, report);
        return { success: true, reportId, report };
    } catch (error) {
        console.error('AI Report Generation Error:', error);
        return { success: false, error: error.message };
    }
};

const generateReportPrompt = (eventData, headerImageUrl = null) => {
    const attendeeCount = eventData.attendees ? Object.keys(eventData.attendees).length : 0;
    const dateStr = typeof eventData.date === 'number'
        ? new Date(eventData.date).toLocaleDateString()
        : eventData.date;

    return `You are an assistant that writes concise, professional event reports for colleges.
Use clear section headings. Avoid bullet-overload. Keep paragraphs short.
Do not fabricate details.
    
Institution: ${eventData.institutionName || 'N/A'}
Event Title: ${eventData.topic}
Date: ${dateStr}
Duration: ${eventData.duration}
Venue: ${eventData.venue || 'Not specified'}
Attendees Count: ${attendeeCount}
${eventData.description ? `Description: ${eventData.description}` : ''}
${headerImageUrl ? `Note: An event banner image exists at ${headerImageUrl} for reference (do not analyze image content).` : ''}

Please generate a detailed report with the following sections:
    
1. **Event Overview and Objectives**
   - Brief summary of the event
   - Main objectives and goals

2. **Participation and Engagement Analysis**
   - Attendee demographics and participation rate
   - Level of engagement observed

3. **Event Execution**
   - How well the event was organized
   - Key activities and sessions

4. **Key Highlights and Outcomes**
   - Major achievements and takeaways
   - Notable moments or presentations

5. **Areas of Success**
   - What worked well
   - Positive feedback points

6. **Recommendations for Future Events**
   - Suggestions for improvement
   - Best practices to continue

Conclude with a short summary paragraph. Write in a formal tone suitable for institutional records.`;
};

const generateAccessHierarchy = (creatorRole) => {
    const hierarchy = {
        faculty: ['faculty', 'hod', 'principal', 'admin'],
        hod: ['hod', 'principal', 'admin'],
        principal: ['principal', 'admin'],
        admin: ['admin']
    };

    return hierarchy[creatorRole] || [];
};

export const saveReport = async (reportId, reportData) => {
    try {
        await set(ref(database, `reports/${reportId}`), reportData);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getReports = async (userRole, eventId = null) => {
    try {
        const reportsRef = ref(database, 'reports');
        const snapshot = await get(reportsRef);

        if (!snapshot.exists()) {
            return { success: true, reports: [] };
        }

        const reports = [];
        snapshot.forEach(child => {
            const report = child.val();
            if (report.accessibleTo.includes(userRole) && (!eventId || report.eventId === eventId)) {
                reports.push({
                    id: child.key,
                    ...report
                });
            }
        });

        return { success: true, reports };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getReportById = async (reportId, userRole) => {
    try {
        const reportRef = ref(database, `reports/${reportId}`);
        const snapshot = await get(reportRef);

        if (!snapshot.exists()) {
            return { success: false, error: 'Report not found' };
        }

        const report = snapshot.val();
        if (!report.accessibleTo.includes(userRole)) {
            return { success: false, error: 'Access denied' };
        }

        return { success: true, report: { id: reportId, ...report } };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const deleteReport = async (reportId, userRole) => {
    try {
        const reportRef = ref(database, `reports/${reportId}`);
        const snapshot = await get(reportRef);
        if (!snapshot.exists()) return { success: false, error: 'Report not found' };
        const report = snapshot.val();
        // Allow deletion only if same role that generated or admin
        if (!(report.createdByRole === userRole || userRole === 'admin')) {
            return { success: false, error: 'Not authorized to delete' };
        }
        await set(reportRef, null);
        return { success: true };
    } catch (e) {
        return { success: false, error: e.message };
    }
};