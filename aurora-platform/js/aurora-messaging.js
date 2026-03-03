/* ═══════════════════════════════════════════════════════
   AURORA — Messaging Engine (aurora-messaging.js)
   Ephemeral logic, encryption mock, 30-day storage
   ═══════════════════════════════════════════════════════ */

'use strict';

const AuroraMessaging = (() => {

    const STORAGE_KEY = 'aurora_messages';
    let _conversations = {};

    function _load() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) _conversations = JSON.parse(stored);
        } catch (e) { }
        if (Object.keys(_conversations).length === 0) {
            _conversations = {
                'match001': AuroraData.getMatchMessages('match001'),
                'match002': AuroraData.getMatchMessages('match002')
            };
            _save();
        }
    }

    function _save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(_conversations));
    }

    function sendMessage(matchId, senderId, text, options = {}) {
        if (!_conversations[matchId]) _conversations[matchId] = [];
        const msg = {
            msgId: Aurora.generateId(),
            senderId,
            text, // In reality, this would be encrypted
            createdAt: new Date().toISOString(),
            expiresAt: options.save24h ? new Date(Date.now() + 86400000).toISOString() : null, // 24h or ephemeral
            isNSFW: !!options.nsfw,
            isSaved: !!options.save24h,
            status: 'sent', // sent, delivered, read
            hardDeleteAt: new Date(Date.now() + 30 * 86400000).toISOString() // 30-day legal hold
        };
        _conversations[matchId].push(msg);
        _save();
        return msg;
    }

    function getMessages(matchId) {
        const msgs = _conversations[matchId] || [];
        const now = new Date();
        // Filter out expired ephemeral messages (simulated by checking if they are 1 minute old locally, unless saved)
        return msgs.filter(m => {
            // Hard delete rule
            if (new Date(m.hardDeleteAt) < now) return false;

            // If saved, check expiresAt
            if (m.isSaved && m.expiresAt) {
                return new Date(m.expiresAt) > now;
            }

            // If ephemeral and read, it should disappear.
            // For demo, we just return them but UI will mark them as "Disappears on read"
            return true;
        });
    }

    function markAsRead(matchId, msgId) {
        const msgs = _conversations[matchId];
        if (msgs) {
            const m = msgs.find(m => m.msgId === msgId);
            if (m && m.status !== 'read') {
                m.status = 'read';
                _save();
                // Ephemeral messages vanish immediately from UI on read
            }
        }
    }

    function init() {
        _load();
        // Clean up old messages periodic check (simulating cron 30 days)
        setInterval(() => {
            const now = new Date();
            let changed = false;
            Object.keys(_conversations).forEach(cm => {
                const initialLen = _conversations[cm].length;
                _conversations[cm] = _conversations[cm].filter(m => new Date(m.hardDeleteAt) > now);
                if (_conversations[cm].length !== initialLen) changed = true;
            });
            if (changed) _save();
        }, 60000); // Check every minute in demo
    }

    return { init, sendMessage, getMessages, markAsRead };

})();

document.addEventListener('DOMContentLoaded', () => AuroraMessaging.init());
