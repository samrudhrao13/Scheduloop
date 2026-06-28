export const USER_ROLES = {
    SUPER_ADMIN: 'superadmin',
    ADMIN: 'admin',
    PRINCIPAL: 'principal',
    HOD: 'hod',
    FACULTY: 'faculty',
    STUDENT: 'student'
};

export const EVENT_STATUS = {
    PENDING_HOD: 'pending_hod',
    PENDING_PRINCIPAL: 'pending_principal',
    PENDING_ADMIN: 'pending_admin',
    APPROVED: 'approved',
    REJECTED_BY_HOD: 'rejected_by_hod',
    REJECTED_BY_PRINCIPAL: 'rejected_by_principal',
    REJECTED_BY_ADMIN: 'rejected_by_admin'
};

export const EVENT_TYPES = [
    'Seminar',
    'Workshop',
    'Lab',
    'Quiz',
    'Sports',
    'Cultural',
    'Hackathon',
    'Conference'
];

export const GEO_FENCE_RADIUS = 100; // meters

export const FEEDBACK_WINDOW = 48 * 60 * 60 * 1000; // 48 hours

export const DEFAULT_WALLET_BALANCE = 1000;