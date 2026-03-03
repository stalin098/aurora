/* ═══════════════════════════════════════════════════════
   AURORA — Payment Gateway Simulation (aurora-payments.js)
   M-Pesa, Airtel Money, Visa/MC, Crypto (USDT/USDC)
   ═══════════════════════════════════════════════════════ */

'use strict';

const AuroraPayments = (() => {

    const HISTORY_KEY = 'aurora_payment_history';
    let _history = [];

    function _load() {
        try {
            const h = localStorage.getItem(HISTORY_KEY);
            if (h) _history = JSON.parse(h);
        } catch (e) { }
    }
    function _save() { localStorage.setItem(HISTORY_KEY, JSON.stringify(_history)); }

    const GATEWAYS = {
        mpesa: { name: 'M-Pesa', icon: '📱', color: '#4CAF50', provider: 'Safaricom Daraja API' },
        airtel: { name: 'Airtel Money', icon: '📶', color: '#FF3D00', provider: 'Airtel Africa API' },
        card: { name: 'Visa / Mastercard', icon: '💳', color: '#1A1F71', provider: 'Stripe / Flutterwave' },
        crypto: { name: 'Crypto (USDT/USDC)', icon: '₿', color: '#F7931A', provider: 'Hurupay VASP' },
    };

    function getGateways() { return GATEWAYS; }

    /* ── Simulate purchase ─────────────────────────────── */
    function processPurchase({ packageId, gateway, amount, tokens, phone = '', onSuccess, onError }) {
        const pkg = AuroraData.getTokenPackages().find(p => p.id === packageId);
        if (!pkg) { if (onError) onError('Package not found'); return; }

        // Show processing state
        Aurora.showToast(`Processing ${GATEWAYS[gateway]?.name || gateway} payment...`, 'gold', 2000);

        // Simulate gateway-specific delay
        const delays = { mpesa: 7000, airtel: 5000, card: 2500, crypto: 4000 };
        const delay = delays[gateway] || 3000;

        setTimeout(() => {
            // 95% success rate simulation
            if (Math.random() < 0.95) {
                const totalTokens = pkg.tokens + (pkg.bonusTokens || 0);
                AuroraTokens.addTokens(totalTokens, 0, `${GATEWAYS[gateway]?.name} *${_maskRef(phone || '0712')}`);

                _history.unshift({
                    paymentId: Aurora.generateId(),
                    gateway, packageId, amount,
                    tokens: totalTokens, status: 'completed',
                    gatewayRef: _generateRef(gateway),
                    date: new Date().toISOString(),
                });
                _save();

                if (onSuccess) onSuccess({ tokens: totalTokens });
            } else {
                Aurora.showToast('Payment failed. Please try again.', 'error', 5000);
                if (onError) onError('Gateway timeout');
            }
        }, delay);
    }

    /* ── M-Pesa STK Push Simulation ───────────────────── */
    function initMpesaSTK(phone, amount, onResult) {
        // Basic phone validation
        const clean = phone.replace(/\D/g, '');
        if (clean.length < 9) {
            Aurora.showToast('Please enter a valid Safaricom number', 'error');
            return;
        }
        Aurora.showToast(`📱 STK Push sent to ${_maskPhone(phone)}. Check your phone.`, 'gold', 8000);
        // Simulate user completing payment on phone
        setTimeout(() => onResult(Math.random() < 0.92), 7000);
    }

    /* ── Helpers ───────────────────────────────────────── */
    function _maskPhone(phone) {
        const c = phone.replace(/\D/g, '');
        return c.length >= 9 ? c.slice(0, 3) + '****' + c.slice(-3) : phone;
    }
    function _maskRef(ref) {
        return ref.slice(-4).padStart(ref.length, '*');
    }
    function _generateRef(gateway) {
        const prefixes = { mpesa: 'QAV', airtel: 'ATM', card: 'STR', crypto: 'HRP' };
        const prefix = prefixes[gateway] || 'REF';
        return prefix + Math.random().toString(36).toUpperCase().slice(2, 10);
    }

    function getHistory() { return [..._history]; }

    function init() { _load(); }

    return { init, getGateways, processPurchase, initMpesaSTK, getHistory };

})();

document.addEventListener('DOMContentLoaded', () => AuroraPayments.init());
