/* ═══════════════════════════════════════════════════════
   AURORA — Admin Logic Engine (aurora-admin.js)
   Handles moderation queues, dispute resolution, verifications
   ═══════════════════════════════════════════════════════ */

'use strict';

const AuroraAdmin = (() => {

    const STORAGE_KEY = 'aurora_admin_state';
    let _state = {
        idQueue: [],
        disputeQueue: [],
        reportQueue: []
    };

    function _load() {
        try {
            const s = localStorage.getItem(STORAGE_KEY);
            if (s) _state = JSON.parse(s);
        } catch (e) { }

        // Seed initial data if empty
        if (_state.idQueue.length === 0) {
            const queues = AuroraData.getAdminQueues();
            _state.idQueue = [...queues.idVerification];
            _state.disputeQueue = AuroraBooking.getPendingDisputes() || [];
            _state.reportQueue = [...queues.reports];
            _save();
        }
    }

    function _save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(_state));
    }

    function getQueues() {
        return _state;
    }

    function approveID(userId) {
        _state.idQueue = _state.idQueue.filter(item => item.userId !== userId);
        _save();
        Aurora.showToast('ID Approved. User is now verified.', 'success');
    }

    function rejectID(userId, reason) {
        _state.idQueue = _state.idQueue.filter(item => item.userId !== userId);
        _save();
        Aurora.showToast(`ID Rejected. Reason: ${reason}`, 'error');
    }

    function resolveDispute(bookingId, resolution) {
        const idx = _state.disputeQueue.findIndex(d => d.bookingId === bookingId);
        if (idx > -1) {
            _state.disputeQueue.splice(idx, 1);
            _save();
            Aurora.showToast(`Dispute resolved: ${resolution}`, 'success');
        }
    }

    function actionReport(reportId, action) {
        const idx = _state.reportQueue.findIndex(r => r.reportId === reportId);
        if (idx > -1) {
            _state.reportQueue.splice(idx, 1);
            _save();
            Aurora.showToast(`Report actioned: ${action}`, 'gold');
        }
    }

    function getStats() {
        return {
            revenue: AuroraTokens.getHistory().reduce((sum, tx) => sum + (tx.amountKES || 0), 0),
            activeUsers: 8432,
            activeVenues: AuroraData.getVenues().length,
            pendingIDs: _state.idQueue.length,
            pendingDisputes: _state.disputeQueue.length
        };
    }

    function init() {
        _load();
    }

    return { init, getQueues, approveID, rejectID, resolveDispute, actionReport, getStats };

})();

document.addEventListener('DOMContentLoaded', () => AuroraAdmin.init());
