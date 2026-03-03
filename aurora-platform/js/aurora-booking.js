/* ═══════════════════════════════════════════════════════
   AURORA — Booking & Escrow Engine (aurora-booking.js)
   Venue booking, escrow, ratings, payout simulation
   ═══════════════════════════════════════════════════════ */

'use strict';

const AuroraBooking = (() => {

    const STORAGE_KEY = 'aurora_bookings';
    const PLATFORM_FEE = 0.20; // 20%
    let _bookings = [];

    function _load() {
        try {
            const b = localStorage.getItem(STORAGE_KEY);
            if (b) _bookings = JSON.parse(b);
        } catch (e) { }
        // seed demo bookings
        if (_bookings.length === 0) {
            _bookings = AuroraData.getAllBookings().map(b => ({ ...b }));
            _save();
        }
    }
    function _save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(_bookings));
    }

    /* ── Helpers ───────────────────────────────────────── */
    function calculateEscrow(venue, durationHours) {
        const venueCost = venue.hourlyRate * durationHours;
        const platformFee = venueCost * PLATFORM_FEE;
        const total = venueCost + platformFee;
        return { venueCost, platformFee, total, tokenEquivalent: AuroraTokens.kesToTokens(total) };
    }

    /* ── Create Booking ────────────────────────────────── */
    function createBooking({ clientId, companionId, venueId, dateTime, durationHours, paymentMethod }) {
        const venue = AuroraData.getVenue(venueId);
        if (!venue) { Aurora.showToast('Venue not found.', 'error'); return null; }

        const escrow = calculateEscrow(venue, durationHours);

        // Deduct experience tokens for partial coverage, rest via payment gateway
        const tokenCoverageTokens = Math.min(AuroraTokens.getExperienceBalance(), escrow.tokenEquivalent);
        AuroraTokens.spendExperience(tokenCoverageTokens, `Escrow deposit — ${venue.name}`);

        const booking = {
            bookingId: Aurora.generateId(),
            clientId, companionId, venueId,
            dateTime: new Date(dateTime).toISOString(),
            durationHours: parseFloat(durationHours),
            escrowAmount: escrow.total,
            venueCost: escrow.venueCost,
            platformFee: escrow.platformFee,
            paymentMethod: paymentMethod || 'tokens',
            status: 'pending',
            clientRating: null,
            companionRating: null,
            createdAt: new Date().toISOString(),
        };
        _bookings.unshift(booking);
        _save();
        Aurora.showToast('✓ Booking created! Awaiting companion confirmation.', 'success', 5000);
        return booking;
    }

    /* ── Status Transitions ────────────────────────────── */
    function confirmBooking(bookingId) {
        const b = _bookings.find(b => b.bookingId === bookingId);
        if (!b) return;
        b.status = 'confirmed';
        _save();
        Aurora.showToast('Booking confirmed by companion! ✨', 'success');
    }

    function completeBooking(bookingId) {
        const b = _bookings.find(b => b.bookingId === bookingId);
        if (!b) return;
        b.status = 'completed';
        _save();
    }

    function disputeBooking(bookingId) {
        const b = _bookings.find(b => b.bookingId === bookingId);
        if (!b) return;
        b.status = 'disputed';
        _save();
        Aurora.showToast('Dispute filed. Admin will review within 24 hours.', 'error', 6000);
    }

    function cancelBooking(bookingId) {
        const b = _bookings.find(b => b.bookingId === bookingId);
        if (!b || b.status !== 'pending') return;
        b.status = 'cancelled';
        // Refund tokens
        AuroraTokens.refund(AuroraTokens.kesToTokens(b.escrowAmount * 0.5), 'experience', 'Cancellation partial refund');
        _save();
        Aurora.showToast('Booking cancelled. 50% refund applied.', 'gold');
    }

    /* ── Ratings & Payout ──────────────────────────────── */
    function submitRating(bookingId, ratingBy, stars) {
        const b = _bookings.find(b => b.bookingId === bookingId);
        if (!b) return;
        if (ratingBy === 'client') b.clientRating = stars;
        if (ratingBy === 'companion') b.companionRating = stars;

        // Auto-resolve if both rated
        if (b.clientRating !== null && b.companionRating !== null) {
            const avg = (b.clientRating + b.companionRating) / 2;
            if (avg >= 3) {
                b.status = 'completed';
                // Simulate companion payout
                const companionPayout = b.escrowAmount * (1 - PLATFORM_FEE);
                Aurora.showToast(`Meeting verified ✓ Companion payout: KES ${companionPayout.toLocaleString()}`, 'success', 6000);
            } else {
                b.status = 'disputed';
                Aurora.showToast('Low rating detected — escrow held for admin review.', 'error', 6000);
            }
        }
        _save();
    }

    /* ── Queries ───────────────────────────────────────── */
    function getUserBookings(userId) {
        return _bookings.filter(b => b.clientId === userId || b.companionId === userId);
    }
    function getAllBookings() { return [..._bookings]; }
    function getBooking(id) { return _bookings.find(b => b.bookingId === id); }
    function getPendingDisputes() { return _bookings.filter(b => b.status === 'disputed'); }

    function init() { _load(); }

    return {
        init, calculateEscrow, createBooking,
        confirmBooking, completeBooking, disputeBooking, cancelBooking,
        submitRating, getUserBookings, getAllBookings, getBooking, getPendingDisputes,
        PLATFORM_FEE,
    };

})();

document.addEventListener('DOMContentLoaded', () => AuroraBooking.init());
