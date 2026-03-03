/* ═══════════════════════════════════════════════════════
   AURORA — Roulette Matching Engine (aurora-roulette.js)
   Wheel spin, token betting, match creation
   ═══════════════════════════════════════════════════════ */

'use strict';

const AuroraRoulette = (() => {

    const HISTORY_KEY = 'aurora_roulette_history';
    let _history = [];
    let _isSpinning = false;

    function _load() {
        try {
            const h = localStorage.getItem(HISTORY_KEY);
            if (h) _history = JSON.parse(h);
        } catch (e) { }
    }
    function _save() {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(_history));
    }

    /* ── Wheel SVG Generation ──────────────────────────── */
    function buildWheel(canvasEl, profiles) {
        if (!canvasEl) return;
        const count = profiles.length;
        const radius = 140;
        const cx = 150, cy = 150;
        const colors = [
            '#6D3B5C', '#523255', '#3D2440', '#7A4068', '#513050',
            '#5E3662', '#472A4A', '#614059', '#3A2042', '#6B3D5A'
        ];
        let svgContent = `<svg viewBox="0 0 300 300" class="wheel-svg" id="auroraWheel">
      <defs>
        <filter id="wheelGlow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>`;

        // Outer ring
        svgContent += `<circle cx="${cx}" cy="${cy}" r="${radius + 8}" fill="none" stroke="${colors[0]}" stroke-width="2" opacity="0.4"/>`;

        for (let i = 0; i < count; i++) {
            const startAngle = (i / count) * 2 * Math.PI - Math.PI / 2;
            const endAngle = ((i + 1) / count) * 2 * Math.PI - Math.PI / 2;
            const x1 = cx + radius * Math.cos(startAngle);
            const y1 = cy + radius * Math.sin(startAngle);
            const x2 = cx + radius * Math.cos(endAngle);
            const y2 = cy + radius * Math.sin(endAngle);
            const largeArc = count > 2 ? 0 : 1;
            const color = colors[i % colors.length];

            // Segment
            svgContent += `<path d="M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z"
        fill="${color}" stroke="#2C1A2E" stroke-width="1.5"/>`;

            // Label - midpoint angle
            const midAngle = startAngle + (endAngle - startAngle) / 2;
            const lx = cx + (radius * 0.62) * Math.cos(midAngle);
            const ly = cy + (radius * 0.62) * Math.sin(midAngle);
            const profile = profiles[i];
            svgContent += `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle"
        font-size="16" fill="rgba(249,242,231,0.9)" font-family="Nunito, sans-serif">${profile.emoji}</text>`;
        }

        // Center circle
        svgContent += `<circle cx="${cx}" cy="${cy}" r="32" fill="#2C1A2E" stroke="${colors[0]}" stroke-width="2"/>`;
        svgContent += `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
      font-size="18" fill="#B89B7A" font-family="Cormorant Garamond, serif">✦</text>`;

        // Outer decorative ring
        svgContent += `<circle cx="${cx}" cy="${cy}" r="${radius + 2}" fill="none" stroke="rgba(184,155,122,0.35)" stroke-width="1.5"/>`;
        svgContent += `</svg>`;
        canvasEl.innerHTML = svgContent;
    }

    /* ── Spin Logic ────────────────────────────────────── */
    function spin({ betTokens = 5, userRole = 'client', userCity = 'Nairobi', onResult }) {
        if (_isSpinning) return;

        // Deduct tokens
        if (!AuroraTokens.spendConnection(betTokens, `Roulette spin (${betTokens} tokens)`)) return;

        _isSpinning = true;

        // Hide previous result
        const resultEl = document.getElementById('rouletteResult');
        if (resultEl) resultEl.style.display = 'none';

        // Get candidates (opposite role)
        const targetRole = userRole === 'client' ? 'companion' : 'client';
        const candidates = AuroraData.getAllProfiles().filter(p =>
            p.role === targetRole && p.verificationStatus === 'verified'
        );

        // Select random winner
        const winner = candidates[Math.floor(Math.random() * candidates.length)];

        // Animate wheel
        const wheelEl = document.getElementById('auroraWheel');
        if (wheelEl) {
            const spins = 5 + Math.floor(Math.random() * 5); // 5-10 full spins
            const winIdx = candidates.indexOf(winner);
            const segDeg = 360 / candidates.length;
            const extraDeg = 360 - (winIdx * segDeg) - (segDeg / 2); // land on winner
            const totalDeg = spins * 360 + extraDeg;
            wheelEl.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
            wheelEl.style.transform = `rotate(${totalDeg}deg)`;
        }

        // Reveal result after animation
        setTimeout(() => {
            _isSpinning = false;
            _history.unshift({
                histId: Aurora.generateId(),
                winner: winner.alias,
                winnerId: winner.userId,
                tokensSpent: betTokens,
                date: new Date().toISOString(),
                accepted: false,
            });
            _save();
            if (typeof onResult === 'function') onResult(winner);
        }, 4200);
    }

    /* ── Accept / Decline Match ────────────────────────── */
    function acceptMatch(winnerId) {
        // Simulate counterpart response (70% accept rate)
        const accepted = Math.random() < 0.70;
        const h = _history.find(r => r.winnerId === winnerId);
        if (h) h.accepted = accepted;
        _save();
        if (accepted) {
            // Create match in storage
            Aurora.showToast('🎉 Match accepted! You can now message each other.', 'success', 5000);
        } else {
            Aurora.showToast('They passed this time. Spin again?', 'error', 4000);
        }
        return accepted;
    }

    function getHistory() { return [..._history]; }

    function init() { _load(); }

    return { init, buildWheel, spin, acceptMatch, getHistory };

})();

document.addEventListener('DOMContentLoaded', () => AuroraRoulette.init());
