/* ═══════════════════════════════════════════════════════
   AURORA — Mock Data Layer (aurora-data.js)
   Profiles, venues, messages, bookings, transactions
   ═══════════════════════════════════════════════════════ */

'use strict';

const AuroraData = (() => {

    /* ── Profiles ──────────────────────────────────────── */
    const PROFILES = [
        // CLIENTS (Women 35+)
        {
            userId: 'c001', role: 'client', alias: 'LunaGlow', emoji: '👩🏾',
            ageRange: [36, 40], city: 'Nairobi', bio: 'Confident CEO who knows what she wants. Lover of fine wine, jazz, and spontaneous adventures. Looking for genuine energy, no strings.',
            vibeTags: ['Fine Dining', 'Art', 'Jazz', 'Travel'], meetingTypes: ['dinner', 'private'],
            verificationStatus: 'verified', healthVerified: true, rating: 4.9, reviewCount: 12,
            memberSince: '2025-08-01', lastActive: Date.now() - 600000,
            photos: ['👩🏾‍💼', '👩🏾', '🌸', '💄'], publicPhotos: 2, totalPhotos: 4,
        },
        {
            userId: 'c002', role: 'client', alias: 'SilkRose', emoji: '👩🏽',
            ageRange: [41, 45], city: 'Nairobi', bio: 'Architect by day, adventurer by night. I design beautiful things and seek beautiful experiences. Discreet and elegant.',
            vibeTags: ['Culture', 'Architecture', 'Wine', 'Theatre'], meetingTypes: ['dinner', 'outing'],
            verificationStatus: 'verified', healthVerified: false, rating: 4.7, reviewCount: 8,
            memberSince: '2025-09-15', lastActive: Date.now() - 1800000,
            photos: ['👩🏽', '🌹', '🎭', '🍷'], publicPhotos: 2, totalPhotos: 4,
        },
        {
            userId: 'c003', role: 'client', alias: 'OnyxQueen', emoji: '👸🏿',
            ageRange: [38, 42], city: 'Mombasa', bio: 'Entrepreneur. I run three businesses and still make time for pleasure. Seeking a companion who can keep up with my energy.',
            vibeTags: ['Beach', 'Business', 'Cuisine', 'Fitness'], meetingTypes: ['outing', 'private'],
            verificationStatus: 'verified', healthVerified: true, rating: 5.0, reviewCount: 5,
            memberSince: '2025-10-01', lastActive: Date.now() - 3600000,
            photos: ['👸🏿', '🌊', '🌺', '💪'], publicPhotos: 3, totalPhotos: 5,
        },
        {
            userId: 'c004', role: 'client', alias: 'VelvetDusk', emoji: '👩🏽‍🦱',
            ageRange: [35, 39], city: 'Nairobi', bio: 'Former diplomat, current philanthropist. I enjoy intellectual conversations as much as intimate ones. French fluent.',
            vibeTags: ['Diplomacy', 'Books', 'French Cuisine', 'Hiking'], meetingTypes: ['dinner', 'outing'],
            verificationStatus: 'verified', healthVerified: false, rating: 4.8, reviewCount: 15,
            memberSince: '2025-07-20', lastActive: Date.now() - 7200000,
            photos: ['👩🏽‍🦱', '📚', '🍽️', '✈️'], publicPhotos: 2, totalPhotos: 4,
        },
        {
            userId: 'c005', role: 'client', alias: 'AmberNight', emoji: '👩🏾‍🦳',
            ageRange: [45, 49], city: 'Kisumu', bio: 'Professor of Literature. Passionate soul seeking warmth and connection. I read Neruda and dance alone at 2am.',
            vibeTags: ['Literature', 'Poetry', 'Dance', 'Music'], meetingTypes: ['dinner', 'private'],
            verificationStatus: 'pending', healthVerified: false, rating: 0, reviewCount: 0,
            memberSince: '2026-01-10', lastActive: Date.now() - 86400000,
            photos: ['👩🏾‍🦳', '📖', '🌙', '🎶'], publicPhotos: 2, totalPhotos: 4,
        },

        // COMPANIONS (Men 21-35)
        {
            userId: 'm001', role: 'companion', alias: 'StormAce', emoji: '👨🏾',
            ageRange: [27, 27], city: 'Nairobi', bio: 'Fitness trainer. Disciplined, attentive, and respectful. I believe a woman deserves to feel like a goddess.',
            vibeTags: ['Fitness', 'Cooking', 'Nature', 'Photography'], meetingTypes: ['dinner', 'outing', 'private'],
            verificationStatus: 'verified', healthVerified: true, rating: 4.9, reviewCount: 23,
            memberSince: '2025-06-01', lastActive: Date.now() - 300000,
            photos: ['👨🏾', '💪', '🌿', '📷'], publicPhotos: 3, totalPhotos: 6,
        },
        {
            userId: 'm002', role: 'companion', alias: 'BlueFlame', emoji: '👨🏽',
            ageRange: [29, 29], city: 'Nairobi', bio: 'Surgeon. Intelligent, composed, impeccable manners. I bring sophistication and genuine care to every encounter.',
            vibeTags: ['Medicine', 'Jazz', 'Wine', 'Chess'], meetingTypes: ['dinner', 'private'],
            verificationStatus: 'verified', healthVerified: true, rating: 5.0, reviewCount: 17,
            memberSince: '2025-07-10', lastActive: Date.now() - 900000,
            photos: ['👨🏽', '🍷', '♟️', '🎷'], publicPhotos: 3, totalPhotos: 5,
        },
        {
            userId: 'm003', role: 'companion', alias: 'EbonyEdge', emoji: '👨🏿',
            ageRange: [24, 24], city: 'Mombasa', bio: 'Marine biologist. Ocean-calm, curious, and full of stories. Best conversation you\'ve ever had, guaranteed.',
            vibeTags: ['Ocean', 'Science', 'Art', 'Cooking'], meetingTypes: ['outing', 'dinner'],
            verificationStatus: 'verified', healthVerified: false, rating: 4.7, reviewCount: 9,
            memberSince: '2025-09-01', lastActive: Date.now() - 1200000,
            photos: ['👨🏿', '🌊', '🎨', '🍳'], publicPhotos: 2, totalPhotos: 4,
        },
        {
            userId: 'm004', role: 'companion', alias: 'GoldRush', emoji: '👦🏽',
            ageRange: [22, 22], city: 'Nairobi', bio: 'Tech entrepreneur. Building the future by day, living presently by night. Energy you won\'t forget.',
            vibeTags: ['Tech', 'Travel', 'Music', 'Cars'], meetingTypes: ['outing', 'private'],
            verificationStatus: 'verified', healthVerified: true, rating: 4.6, reviewCount: 11,
            memberSince: '2025-10-15', lastActive: Date.now() - 1800000,
            photos: ['👦🏽', '💻', '✈️', '🎵'], publicPhotos: 2, totalPhotos: 4,
        },
        {
            userId: 'm005', role: 'companion', alias: 'MidnightCrest', emoji: '👨🏾‍🦱',
            ageRange: [31, 31], city: 'Kisumu', bio: 'Jazz musician and yoga instructor. Balanced, sensual, present. I make time slow down.',
            vibeTags: ['Jazz', 'Yoga', 'Philosophy', 'Wine'], meetingTypes: ['dinner', 'outing', 'private'],
            verificationStatus: 'verified', healthVerified: true, rating: 5.0, reviewCount: 31,
            memberSince: '2025-05-01', lastActive: Date.now() - 600000,
            photos: ['👨🏾‍🦱', '🎷', '🧘', '🍷'], publicPhotos: 3, totalPhotos: 7,
        },
        {
            userId: 'm006', role: 'companion', alias: 'SapphireSky', emoji: '👨🏽‍🦲',
            ageRange: [33, 33], city: 'Nairobi', bio: 'Chef and food critic. I will take you on a culinary journey you will never forget. Every sense — satisfied.',
            vibeTags: ['Cuisine', 'Wine', 'Travel', 'Art'], meetingTypes: ['dinner', 'private'],
            verificationStatus: 'verified', healthVerified: false, rating: 4.8, reviewCount: 14,
            memberSince: '2025-08-20', lastActive: Date.now() - 3600000,
            photos: ['👨🏽‍🦲', '🍽️', '🌍', '🎨'], publicPhotos: 2, totalPhotos: 4,
        },
        {
            userId: 'm007', role: 'companion', alias: 'CoralDrift', emoji: '👨🏿‍🦱',
            ageRange: [26, 26], city: 'Nairobi', bio: 'Architect. I draw beautiful structures — and I draw people in. Charming, reliable, very attentive.',
            vibeTags: ['Architecture', 'Design', 'Hiking', 'Music'], meetingTypes: ['outing', 'dinner'],
            verificationStatus: 'verified', healthVerified: true, rating: 4.5, reviewCount: 7,
            memberSince: '2025-11-01', lastActive: Date.now() - 7200000,
            photos: ['👨🏿‍🦱', '🏛️', '🌿', '🎸'], publicPhotos: 2, totalPhotos: 4,
        },
    ];

    /* ── Venues ────────────────────────────────────────── */
    const VENUES = [
        {
            venueId: 'v001', name: 'Radisson Blu Nairobi', city: 'Nairobi', emoji: '🏨',
            address: 'Upper Hill, Nairobi', hourlyRate: 8500, type: 'partner',
            amenities: ['Private Suite', 'Room Service', 'CCTV', 'Panic Buttons', 'Concierge'],
            rating: 4.9, description: '5-star luxury in the heart of Nairobi. Discreet valet, executive suites.',
            isActive: true, platformFeePercent: 20,
        },
        {
            venueId: 'v002', name: 'The Aurora Suite — Westlands', city: 'Nairobi', emoji: '✨',
            address: 'Westlands, Nairobi', hourlyRate: 5500, type: 'aurora-owned',
            amenities: ['Private Entrance', 'Champagne Service', 'CCTV', 'Panic Button', 'Security Personnel', 'Jacuzzi'],
            rating: 5.0, description: 'Aurora\'s flagship private suite. Tastefully designed, completely discreet.',
            isActive: true, platformFeePercent: 20,
        },
        {
            venueId: 'v003', name: 'Serena Hotel Nairobi', city: 'Nairobi', emoji: '🌹',
            address: 'Processional Way, Nairobi', hourlyRate: 7000, type: 'partner',
            amenities: ['Private Dining', 'CCTV', 'Security', 'Valet', 'Spa Access'],
            rating: 4.8, description: 'Historic elegance, world-class privacy. Perfect for dinner and beyond.',
            isActive: true, platformFeePercent: 20,
        },
        {
            venueId: 'v004', name: 'Swahili Beach Resort', city: 'Mombasa', emoji: '🌊',
            address: 'Diani Beach, Mombasa', hourlyRate: 9000, type: 'partner',
            amenities: ['Oceanfront Suite', 'Private Pool', 'CCTV', 'Security', 'Room Service'],
            rating: 4.9, description: 'Beachfront luxury. The sound of waves, absolute privacy.',
            isActive: true, platformFeePercent: 20,
        },
        {
            venueId: 'v005', name: 'The Aurora Retreat — Kisumu', city: 'Kisumu', emoji: '🌺',
            address: 'Kisumu CBD, Lakeside', hourlyRate: 3800, type: 'aurora-owned',
            amenities: ['Private Entry', 'Lake View', 'CCTV', 'Panic Button', 'Security'],
            rating: 4.7, description: 'Aurora\'s Kisumu sanctuary. Lake views, total discretion.',
            isActive: true, platformFeePercent: 20,
        },
        {
            venueId: 'v006', name: 'Tribe Hotel Nairobi', city: 'Nairobi', emoji: '💎',
            address: 'Limuru Road, Village Market, Nairobi', hourlyRate: 6500, type: 'partner',
            amenities: ['Contemporary Suite', 'CCTV', 'Concierge', 'Bar Access', 'Valet'],
            rating: 4.6, description: 'Contemporary luxury, vibrant crowd, complete discretion.',
            isActive: true, platformFeePercent: 20,
        },
    ];

    /* ── Token Packages ────────────────────────────────── */
    const TOKEN_PACKAGES = [
        { id: 'tp001', name: 'Starter', tokens: 50, priceKES: 750, popular: false, bonusTokens: 0 },
        { id: 'tp002', name: 'Popular', tokens: 100, priceKES: 1500, popular: true, bonusTokens: 10, badge: 'Best Value' },
        { id: 'tp003', name: 'Premium', tokens: 250, priceKES: 3500, popular: false, bonusTokens: 30, badge: 'Most Popular' },
        { id: 'tp004', name: 'Elite', tokens: 500, priceKES: 6500, popular: false, bonusTokens: 75, badge: 'Best Deal' },
    ];

    /* ── Conversations / Messages ──────────────────────── */
    function _makeMessages(matchId, profiles) {
        const msgs = [
            { senderId: profiles[0].userId, text: 'Hello, I noticed your profile. Quite intriguing.', offsetMins: -80, saved: false },
            { senderId: profiles[1].userId, text: 'Thank you — you caught my eye as well 😊', offsetMins: -75, saved: false },
            { senderId: profiles[0].userId, text: 'I\'d love to get to know you better over dinner. Are you available this week?', offsetMins: -60, saved: true },
            { senderId: profiles[1].userId, text: 'That sounds lovely. I know a wonderful place in Westlands.', offsetMins: -45, saved: false },
            { senderId: profiles[0].userId, text: '✨ Perfect. Shall we say Friday, 8pm?', offsetMins: -10, saved: false },
        ];
        return msgs.map((m, i) => ({
            messageId: 'msg_' + matchId + '_' + i,
            matchId, senderId: m.senderId,
            text: m.text,
            isRead: true, isSaved: m.saved,
            createdAt: new Date(Date.now() - m.offsetMins * 60000).toISOString(),
            expiresAt: m.saved ? new Date(Date.now() + 86400000).toISOString() : null,
            storedUntil: new Date(Date.now() + 30 * 86400000).toISOString(),
            isNSFW: false,
        }));
    }

    const MATCHES = [
        { matchId: 'match001', user1: 'c001', user2: 'm001', type: 'swipe', tokensSpent: 5, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
        { matchId: 'match002', user1: 'c001', user2: 'm002', type: 'roulette', tokensSpent: 10, createdAt: new Date(Date.now() - 86400000).toISOString() },
        { matchId: 'match003', user1: 'c002', user2: 'm003', type: 'swipe', tokensSpent: 5, createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
    ];

    const MESSAGES = [
        ..._makeMessages('match001', [
            PROFILES.find(p => p.userId === 'c001'),
            PROFILES.find(p => p.userId === 'm001'),
        ]),
        ..._makeMessages('match002', [
            PROFILES.find(p => p.userId === 'c001'),
            PROFILES.find(p => p.userId === 'm002'),
        ]),
    ];

    /* ── Bookings ──────────────────────────────────────── */
    const BOOKINGS = [
        {
            bookingId: 'bk001', clientId: 'c001', companionId: 'm001', venueId: 'v002',
            dateTime: new Date(Date.now() + 86400000 * 3).toISOString(),
            durationHours: 3, escrowAmount: 19500, platformFee: 3900,
            status: 'confirmed', clientRating: null, companionRating: null,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
            bookingId: 'bk002', clientId: 'c002', companionId: 'm003', venueId: 'v001',
            dateTime: new Date(Date.now() - 86400000 * 2).toISOString(),
            durationHours: 2, escrowAmount: 20400, platformFee: 4080,
            status: 'completed', clientRating: 5, companionRating: 4,
            createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        },
        {
            bookingId: 'bk003', clientId: 'c003', companionId: 'm005', venueId: 'v004',
            dateTime: new Date(Date.now() - 86400000).toISOString(),
            durationHours: 4, escrowAmount: 43200, platformFee: 8640,
            status: 'disputed', clientRating: 2, companionRating: 5,
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        },
    ];

    /* ── Token Transactions (mock history) ─────────────── */
    const TOKEN_HISTORY = [
        { txId: 'tx001', type: 'purchase', amount: +100, ref: 'M-Pesa *0712', date: new Date(Date.now() - 86400000 * 5).toISOString() },
        { txId: 'tx002', type: 'spend_connection', amount: -5, ref: 'Roulette spin', date: new Date(Date.now() - 86400000 * 4).toISOString() },
        { txId: 'tx003', type: 'spend_connection', amount: -2, ref: 'Message request to StormAce', date: new Date(Date.now() - 86400000 * 3).toISOString() },
        { txId: 'tx004', type: 'purchase', amount: +250, ref: 'Visa *4242', date: new Date(Date.now() - 86400000 * 2).toISOString() },
        { txId: 'tx005', type: 'spend_experience', amount: -50, ref: 'Venue booking bk001', date: new Date(Date.now() - 86400000).toISOString() },
        { txId: 'tx006', type: 'spend_connection', amount: -10, ref: 'Gallery unlock – BlueFlame', date: new Date(Date.now() - 3600000 * 6).toISOString() },
        { txId: 'tx007', type: 'spend_connection', amount: -2, ref: 'Message request to GoldRush', date: new Date(Date.now() - 3600000 * 2).toISOString() },
    ];

    /* ── Admin Queues ──────────────────────────────────── */
    const ID_VERIFICATION_QUEUE = [
        { queueId: 'q001', alias: 'AmberNight', city: 'Kisumu', role: 'client', submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(), idType: 'National ID', status: 'pending' },
        { queueId: 'q002', alias: 'NovaMist', city: 'Nairobi', role: 'companion', submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(), idType: 'Passport', status: 'pending' },
        { queueId: 'q003', alias: 'CrystalRain', city: 'Mombasa', role: 'client', submittedAt: new Date(Date.now() - 86400000).toISOString(), idType: 'National ID', status: 'pending' },
    ];

    const PHOTO_MODERATION_QUEUE = [
        { photoId: 'ph001', alias: 'GoldRush', emoji: '👦🏽', flag: 'Possible AI-generated', confidence: 0.71, submittedAt: new Date(Date.now() - 1800000).toISOString() },
        { photoId: 'ph002', alias: 'NovaMist', emoji: '👨🏾', flag: 'NSFW detected', confidence: 0.88, submittedAt: new Date(Date.now() - 3600000 * 3).toISOString() },
        { photoId: 'ph003', alias: 'CoralDrift', emoji: '👨🏿‍🦱', flag: 'Face not visible', confidence: 0.92, submittedAt: new Date(Date.now() - 86400000).toISOString() },
    ];

    const REPORTS = [
        { reportId: 'r001', reporterAlias: 'SilkRose', reportedAlias: 'NovaMist', reason: 'Aggressive messaging after being rejected.', status: 'pending', riskScore: 7.2, createdAt: new Date(Date.now() - 3600000 * 4).toISOString() },
        { reportId: 'r002', reporterAlias: 'OnyxQueen', reportedAlias: 'ShadowBurst', reason: 'Asked for explicit photos without consent in first message.', status: 'pending', riskScore: 8.5, createdAt: new Date(Date.now() - 86400000).toISOString() },
        { reportId: 'r003', reporterAlias: 'VelvetDusk', reportedAlias: 'PineCraft', reason: 'No-show for confirmed booking. Did not cancel in advance.', status: 'resolved', riskScore: 4.1, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    ];

    /* ── Public API ────────────────────────────────────── */
    return {
        getAllProfiles: () => PROFILES,
        getClients: () => PROFILES.filter(p => p.role === 'client'),
        getCompanions: () => PROFILES.filter(p => p.role === 'companion'),
        getProfile: (id) => PROFILES.find(p => p.userId === id),
        getProfileByAlias: (alias) => PROFILES.find(p => p.alias === alias),

        getAllVenues: () => VENUES,
        getVenuesByCity: (c) => VENUES.filter(v => v.city === c && v.isActive),
        getVenue: (id) => VENUES.find(v => v.venueId === id),

        getTokenPackages: () => TOKEN_PACKAGES,
        getTokenHistory: () => TOKEN_HISTORY,

        getAllMatches: () => MATCHES,
        getMatchMessages: (mid) => MESSAGES.filter(m => m.matchId === mid),
        getAllMessages: () => MESSAGES,

        getAllBookings: () => BOOKINGS,
        getBooking: (id) => BOOKINGS.find(b => b.bookingId === id),

        getIDQueue: () => ID_VERIFICATION_QUEUE,
        getPhotoQueue: () => PHOTO_MODERATION_QUEUE,
        getReports: () => REPORTS,
    };

})();
