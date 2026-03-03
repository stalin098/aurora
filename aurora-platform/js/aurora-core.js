/* ═══════════════════════════════════════════════════════
   AURORA — Core Application Engine (aurora-core.js)
   Auth state, routing, notifications, discreet mode
   ═══════════════════════════════════════════════════════ */

'use strict';

const Aurora = (() => {
  /* ── State ─────────────────────────────────────────── */
  const _state = {
    user:         null,
    isLoggedIn:   false,
    notifications:[],
    discreetMode: false,
  };

  function _load() {
    try {
      const saved = localStorage.getItem('aurora_user');
      if (saved) { _state.user = JSON.parse(saved); _state.isLoggedIn = true; }
      _state.discreetMode = localStorage.getItem('aurora_discreet') === 'true';
      if (_state.discreetMode) document.body.classList.add('discreet-mode');
    } catch(e) {}
  }
  function _save() {
    if (_state.user) localStorage.setItem('aurora_user', JSON.stringify(_state.user));
  }

  /* ── Auth ──────────────────────────────────────────── */
  function login(userData) {
    _state.user = { ...userData, loginAt: Date.now() };
    _state.isLoggedIn = true;
    _save();
    showToast('Welcome back, ' + _state.user.alias + ' ✨', 'gold');
  }
  function logout() {
    _state.user = null;
    _state.isLoggedIn = false;
    localStorage.removeItem('aurora_user');
    window.location.href = 'index.html';
  }
  function getUser() { return _state.user; }
  function isLoggedIn() { return _state.isLoggedIn; }
  function requireAuth() {
    if (!_state.isLoggedIn) { window.location.href = 'onboarding.html'; return false; }
    return true;
  }
  function isAdmin() { return _state.user?.role === 'admin'; }
  function isVerified() { return _state.user?.verificationStatus === 'verified'; }

  /* ── Discreet Mode ─────────────────────────────────── */
  function toggleDiscreet() {
    _state.discreetMode = !_state.discreetMode;
    document.body.classList.toggle('discreet-mode', _state.discreetMode);
    localStorage.setItem('aurora_discreet', String(_state.discreetMode));
    showToast(_state.discreetMode ? '🔒 Discreet mode on' : '👁 Discreet mode off', 'gold');
    return _state.discreetMode;
  }
  function isDiscreet() { return _state.discreetMode; }

  /* ── Toast Notifications ───────────────────────────── */
  let _toastContainer = null;
  function _ensureToastContainer() {
    if (!_toastContainer) {
      _toastContainer = document.querySelector('.toast-container');
      if (!_toastContainer) {
        _toastContainer = document.createElement('div');
        _toastContainer.className = 'toast-container';
        document.body.appendChild(_toastContainer);
      }
    }
    return _toastContainer;
  }
  function showToast(message, type = 'gold', duration = 3500) {
    const c = _ensureToastContainer();
    const t = document.createElement('div');
    const icons = { gold: '✨', success: '✓', error: '✕' };
    t.className = `toast ${type}`;
    t.innerHTML = `<span style="font-size:1.1rem">${icons[type]||'ℹ'}</span><span>${message}</span>`;
    c.appendChild(t);
    setTimeout(() => {
      t.classList.add('hiding');
      setTimeout(() => t.remove(), 400);
    }, duration);
  }

  /* ── Modal helpers ─────────────────────────────────── */
  function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  }
  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  }
  function closeAllModals() {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
  // Close modal on overlay click
  document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) closeAllModals();
  });

  /* ── Navigation Helpers ────────────────────────────── */
  function setActiveNav(href) {
    document.querySelectorAll('.bottom-nav-item, .sidebar-item').forEach(el => {
      el.classList.toggle('active', el.getAttribute('href') === href || el.dataset.nav === href);
    });
  }

  /* ── Format Helpers ────────────────────────────────── */
  function formatKES(amount) {
    return 'KES ' + Number(amount).toLocaleString('en-KE', { minimumFractionDigits: 0 });
  }
  function formatDate(ts) {
    return new Date(ts).toLocaleDateString('en-KE', { day:'numeric', month:'short', year:'numeric' });
  }
  function formatTime(ts) {
    return new Date(ts).toLocaleTimeString('en-KE', { hour:'2-digit', minute:'2-digit' });
  }
  function timeAgo(ts) {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff/60000);
    if (mins < 1)  return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins/60);
    if (hrs  < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs/24)}d ago`;
  }
  function generateId() {
    return 'aur_' + Math.random().toString(36).substr(2,9);
  }

  /* ── Date helpers ──────────────────────────────────── */
  function addHours(date, h) { return new Date(new Date(date).getTime() + h*3600000); }
  function addDays(date, d)  { return new Date(new Date(date).getTime() + d*86400000); }

  /* ── Panic Button ──────────────────────────────────── */
  function activatePanic() {
    showToast('🚨 Emergency contacts notified. Stay safe.', 'error', 6000);
    // In production: trigger SMS/push to emergency contacts
  }

  /* ── Init ──────────────────────────────────────────── */
  function init() {
    _load();
    // Wire panic button if present
    document.querySelectorAll('.panic-btn').forEach(b => b.addEventListener('click', activatePanic));
    // Wire discreet toggles
    document.querySelectorAll('[data-action="toggle-discreet"]').forEach(b => b.addEventListener('click', toggleDiscreet));
    // Wire logout
    document.querySelectorAll('[data-action="logout"]').forEach(b => b.addEventListener('click', logout));
    // Wire modal close buttons
    document.querySelectorAll('[data-close-modal]').forEach(b => {
      b.addEventListener('click', () => closeModal(b.dataset.closeModal));
    });
    // Wire modal open buttons
    document.querySelectorAll('[data-open-modal]').forEach(b => {
      b.addEventListener('click', () => openModal(b.dataset.openModal));
    });
  }

  /* ── Public API ────────────────────────────────────── */
  return {
    init, login, logout, getUser, isLoggedIn, requireAuth, isAdmin, isVerified,
    toggleDiscreet, isDiscreet,
    showToast, openModal, closeModal, closeAllModals,
    setActiveNav, formatKES, formatDate, formatTime, timeAgo, generateId,
    addHours, addDays, activatePanic,
  };
})();

// Auto-init when DOM ready
document.addEventListener('DOMContentLoaded', () => Aurora.init());
