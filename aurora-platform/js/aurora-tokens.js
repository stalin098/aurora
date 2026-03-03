/* ═══════════════════════════════════════════════════════
   AURORA — Token Economy Engine (aurora-tokens.js)
   Buy, spend, refund, balance management
   ═══════════════════════════════════════════════════════ */

'use strict';

const AuroraTokens = (() => {

    const STORAGE_KEY = 'aurora_tokens';
    const LOG_KEY = 'aurora_token_log';

    /* ── State ─────────────────────────────────────────── */
    let _balance = { connection: 0, experience: 0 };
    let _log = [];

    function _load() {
        try {
            const b = localStorage.getItem(STORAGE_KEY);
            const l = localStorage.getItem(LOG_KEY);
            if (b) _balance = JSON.parse(b);
            if (l) _log = JSON.parse(l);
        } catch (e) { }
        // Seed demo balance for new users
        if (_balance.connection === 0 && _balance.experience === 0 && _log.length === 0) {
            _balance = { connection: 83, experience: 50 };
            _log = AuroraData.getTokenHistory().map(t => ({ ...t }));
            _save();
        }
    }
    function _save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(_balance));
        localStorage.setItem(LOG_KEY, JSON.stringify(_log));
    }

    /* ── Getters ───────────────────────────────────────── */
    function getBalance() { return { ..._balance }; }
    function getConnectionBalance() { return _balance.connection; }
    function getExperienceBalance() { return _balance.experience; }
    function getTotal() { return _balance.connection + _balance.experience; }
    function getLog() { return [..._log].reverse(); }

    /* ── Operations ────────────────────────────────────── */
    function addTokens(connectionAmt, experienceAmt = 0, ref = '') {
        _balance.connection += connectionAmt;
        _balance.experience += experienceAmt;
        _log.push({
            txId: Aurora.generateId(),
            type: 'purchase',
            amount: +(connectionAmt + experienceAmt),
            connectionAmt, experienceAmt,
            ref, date: new Date().toISOString(),
        });
        _save();
        _animateBalance();
        Aurora.showToast(`✨ ${connectionAmt + experienceAmt} tokens added!`, 'success');
    }

    function spendConnection(amount, reason = '') {
        if (_balance.connection < amount) {
            Aurora.showToast(`Insufficient Connection Tokens (need ${amount}, have ${_balance.connection})`, 'error');
            return false;
        }
        _balance.connection -= amount;
        _log.push({
            txId: Aurora.generateId(),
            type: 'spend_connection', amount: -amount, ref: reason,
            date: new Date().toISOString(),
        });
        _save();
        _animateBalance();
        return true;
    }

    function spendExperience(amount, reason = '') {
        if (_balance.experience < amount) {
            // Try to cover with connection tokens
            const shortfall = amount - _balance.experience;
            if (_balance.connection < shortfall) {
                Aurora.showToast(`Insufficient tokens for this booking`, 'error');
                return false;
            }
            _balance.experience = 0;
            _balance.connection -= shortfall;
        } else {
            _balance.experience -= amount;
        }
        _log.push({
            txId: Aurora.generateId(),
            type: 'spend_experience', amount: -amount, ref: reason,
            date: new Date().toISOString(),
        });
        _save();
        _animateBalance();
        return true;
    }

    function refund(amount, tokenType = 'connection', reason = '') {
        if (tokenType === 'experience') _balance.experience += amount;
        else _balance.connection += amount;
        _log.push({
            txId: Aurora.generateId(),
            type: 'refund', amount: +amount, ref: reason,
            date: new Date().toISOString(),
        });
        _save();
        Aurora.showToast(`Refund: ${amount} tokens returned`, 'success');
    }

    /* ── UI Update ─────────────────────────────────────── */
    function _animateBalance() {
        document.querySelectorAll('[data-token-display]').forEach(el => {
            const type = el.dataset.tokenDisplay;
            const val = type === 'connection' ? _balance.connection
                : type === 'experience' ? _balance.experience
                    : getTotal();
            // Animate count-up
            const target = val;
            const prev = parseInt(el.textContent) || 0;
            let current = prev;
            const step = Math.max(1, Math.ceil(Math.abs(target - prev) / 12));
            const inc = target > prev ? step : -step;
            const timer = setInterval(() => {
                current += inc;
                if ((inc > 0 && current >= target) || (inc < 0 && current <= target)) {
                    current = target;
                    clearInterval(timer);
                    el.classList.add('token-pop');
                    setTimeout(() => el.classList.remove('token-pop'), 400);
                }
                el.textContent = current;
            }, 40);
        });
    }

    function refreshDisplays() {
        document.querySelectorAll('[data-token-display]').forEach(el => {
            const type = el.dataset.tokenDisplay;
            el.textContent = type === 'connection' ? _balance.connection
                : type === 'experience' ? _balance.experience
                    : getTotal();
        });
    }

    /* ── Price Helpers ─────────────────────────────────── */
    function canAffordConnection(amount) { return _balance.connection >= amount; }
    function canAffordExperience(amount) { return (_balance.connection + _balance.experience) >= amount; }
    function tokensToKES(tokens) { return tokens * 15; } // 1 token ≈ KES 15
    function kesToTokens(kes) { return Math.floor(kes / 15); }

    /* ── Init ──────────────────────────────────────────── */
    function init() {
        _load();
        refreshDisplays();
    }

    return {
        init, getBalance, getConnectionBalance, getExperienceBalance, getTotal, getLog,
        addTokens, spendConnection, spendExperience, refund,
        refreshDisplays, canAffordConnection, canAffordExperience,
        tokensToKES, kesToTokens,
    };

})();

document.addEventListener('DOMContentLoaded', () => AuroraTokens.init());
