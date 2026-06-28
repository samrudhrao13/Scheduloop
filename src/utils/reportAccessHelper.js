/**
 * Report Access Helper
 * Determines who can view event reports based on the creator's role hierarchy
 */

export const USER_ROLE_HIERARCHY = {
    'faculty': 1,
    'hod': 2,
    'principal': 3,
    'admin': 4
};

/**
 * Check if a user can view the report for an event
 * @param {string} currentUserRole - Role of the user trying to view the report
 * @param {string} eventCreatorRole - Role of the user who created the event
 * @returns {boolean} - True if user can view the report
 */
export const canViewEventReport = (currentUserRole, eventCreatorRole) => {
    const currentRoleLevel = USER_ROLE_HIERARCHY[currentUserRole];
    const creatorRoleLevel = USER_ROLE_HIERARCHY[eventCreatorRole];

    // If either role is not in hierarchy (e.g., student, superadmin), return false
    if (!currentRoleLevel || !creatorRoleLevel) {
        return false;
    }

    // User can view report if their role level is >= creator's role level
    // Example: If faculty creates (level 1), faculty, HOD, principal, admin can view
    // If HOD creates (level 2), only HOD, principal, admin can view
    return currentRoleLevel >= creatorRoleLevel;
};

/**
 * Get list of events where the current user can view reports
 * @param {Object} events - All events object
 * @param {Object} users - All users object (to get creator's role)
 * @param {string} currentUserRole - Role of the current user
 * @returns {Object} - Filtered events where user can view reports
 */
export const getEventsWithReportAccess = (events, users, currentUserRole) => {
    if (!events || !users) return {};

    const filteredEvents = {};

    Object.entries(events).forEach(([eventId, event]) => {
        const creatorUser = users[event.createdBy];
        if (creatorUser && canViewEventReport(currentUserRole, creatorUser.role)) {
            filteredEvents[eventId] = event;
        }
    });

    return filteredEvents;
};

/**
 * Check if user can generate report for an event
 * (Same logic as viewing, but explicit function for clarity)
 * @param {string} currentUserRole - Role of the user trying to generate the report
 * @param {string} eventCreatorRole - Role of the user who created the event
 * @returns {boolean} - True if user can generate the report
 */
export const canGenerateEventReport = (currentUserRole, eventCreatorRole) => {
    return canViewEventReport(currentUserRole, eventCreatorRole);
};

/**
 * Get access level message for UI display
 * @param {string} currentUserRole - Role of the current user
 * @returns {string} - Message explaining report access
 */
export const getReportAccessMessage = (currentUserRole) => {
    const messages = {
        'faculty': 'You can view reports for events created by Faculty',
        'hod': 'You can view reports for events created by Faculty and HOD',
        'principal': 'You can view reports for events created by Faculty, HOD, and Principal',
        'admin': 'You can view reports for all events'
    };

    return messages[currentUserRole] || 'Limited report access';
};

/**
 * Get role display name
 * @param {string} role - Role identifier
 * @returns {string} - Human-readable role name
 */
export const getRoleDisplayName = (role) => {
    const displayNames = {
        'faculty': 'Faculty',
        'hod': 'HOD',
        'principal': 'Principal',
        'admin': 'Admin',
        'student': 'Student',
        'superadmin': 'Super Admin'
    };

    return displayNames[role] || role;
};