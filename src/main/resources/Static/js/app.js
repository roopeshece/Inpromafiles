document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;

    const getEl = (id) => document.getElementById(id);

    // Views & Alerts
    const authView = getEl('auth-view');
    const dashboardView = getEl('dashboard-view');
    const authError = getEl('auth-error');

    // Forms
    const loginForm = getEl('login-form');
    const signupForm = getEl('signup-form');
    const showLoginBtn = getEl('show-login-btn');
    const showSignupBtn = getEl('show-signup-btn');

    // Dashboard Elements
    const activeUsernameDisplay = getEl('active-username-display');
    const logoutBtn = getEl('logout-btn');
    const holdingsTableBody = getEl('holdings-table-body');
    const statTotalVal = getEl('stat-total-val');
    const statTotalCount = getEl('stat-total-count');

    // Modal Elements
    const addModal = getEl('add-modal');
    const openAddModalBtn = getEl('open-add-modal');
    const closeAddModalBtn = getEl('close-add-modal');
    const addHoldingForm = getEl('add-holding-form');

    // 1. Initial Session Check
    checkSession();

    function checkSession() {
        try {
            const saved = localStorage.getItem('inproma_user');
            if (saved) {
                currentUser = JSON.parse(saved);
                if (currentUser && currentUser.id) {
                    showDashboard();
                    return;
                }
            }
        } catch (e) {
            localStorage.removeItem('inproma_user');
        }
        showAuth();
    }

    function showAuth() {
        if (authView) authView.classList.remove('hidden');
        if (dashboardView) dashboardView.classList.add('hidden');
    }

    function showDashboard() {
        if (authView) authView.classList.add('hidden');
        if (dashboardView) dashboardView.classList.remove('hidden');
        if (activeUsernameDisplay && currentUser) {
            activeUsernameDisplay.textContent = currentUser.username || 'User';
        }
        loadHoldings();
    }

    // 2. Auth Switcher Tabs
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', () => {
            loginForm?.classList.remove('hidden');
            signupForm?.classList.add('hidden');
            showLoginBtn.className = "w-1/2 pb-3 font-semibold text-sm border-b-2 border-emerald-500 text-emerald-600";
            if (showSignupBtn) showSignupBtn.className = "w-1/2 pb-3 font-semibold text-sm border-b-2 border-transparent text-slate-400 hover:text-slate-600";
            hideError();
        });
    }

    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', () => {
            signupForm?.classList.remove('hidden');
            loginForm?.classList.add('hidden');
            showSignupBtn.className = "w-1/2 pb-3 font-semibold text-sm border-b-2 border-emerald-500 text-emerald-600";
            if (showLoginBtn) showLoginBtn.className = "w-1/2 pb-3 font-semibold text-sm border-b-2 border-transparent text-slate-400 hover:text-slate-600";
            hideError();
        });
    }

    function showError(msg) {
        if (authError) {
            authError.textContent = msg;
            authError.classList.remove('hidden');
        } else {
            alert(msg);
        }
    }

    function hideError() {
        if (authError) authError.classList.add('hidden');
    }

    // 3. Login Event
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideError();

            const payload = {
                username: getEl('login-username')?.value.trim(),
                password: getEl('login-password')?.value.trim()
            };

            try {
                const res = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();
                if (res.ok) {
                    currentUser = data;
                    localStorage.setItem('inproma_user', JSON.stringify(currentUser));
                    showDashboard();
                } else {
                    showError(data.message || 'Invalid login credentials.');
                }
            } catch (err) {
                showError('Server connection error. Check backend running on port 8088.');
            }
        });
    }

    // 4. Signup Event
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideError();

            const payload = {
                username: getEl('signup-username')?.value.trim(),
                email: getEl('signup-email')?.value.trim(),
                password: getEl('signup-password')?.value.trim()
            };

            try {
                const res = await fetch('/api/users/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();
                if (res.ok) {
                    currentUser = data;
                    localStorage.setItem('inproma_user', JSON.stringify(currentUser));
                    showDashboard();
                } else {
                    showError(data.message || 'Sign up failed.');
                }
            } catch (err) {
                showError('Server connection error. Check backend running on port 8088.');
            }
        });
    }

    // 5. Logout Event
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('inproma_user');
            currentUser = null;
            if (loginForm) loginForm.reset();
            if (signupForm) signupForm.reset();
            showAuth();
        });
    }

    // 6. Modal Toggles
    if (openAddModalBtn && addModal) {
        openAddModalBtn.addEventListener('click', () => {
            addModal.classList.remove('hidden');
            addModal.classList.add('flex');
        });
    }

    if (closeAddModalBtn && addModal) {
        closeAddModalBtn.addEventListener('click', () => {
            addModal.classList.add('hidden');
            addModal.classList.remove('flex');
        });
    }

    // 7. Load Holdings
    async function loadHoldings() {
        if (!holdingsTableBody || !currentUser) return;
        holdingsTableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">Fetching live market quotes...</td></tr>`;

        try {
            const res = await fetch(`/api/portfolio-holdings/user/${currentUser.id}`);
            if (res.ok) {
                const holdings = await res.json();
                renderHoldings(holdings);
            } else {
                holdingsTableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">No stock holdings found. Click + Add New Holding!</td></tr>`;
                updateMetrics([]);
            }
        } catch (err) {
            console.error('Holdings fetch error:', err);
            holdingsTableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-500">Failed to load holdings.</td></tr>`;
        }
    }

    function renderHoldings(data) {
        if (!holdingsTableBody) return;
        if (!data || data.length === 0) {
            holdingsTableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">No stock holdings yet. Click + Add New Holding!</td></tr>`;
            updateMetrics([]);
            return;
        }

        holdingsTableBody.innerHTML = data.map(item => {
            const price = item.currentUnitPrice || 0;
            const qty = item.quantity || 0;
            const total = price * qty;
            return `
                <tr class="hover:bg-slate-50 transition">
                    <td class="p-4 font-mono text-xs text-slate-400">#${item.id}</td>
                    <td class="p-4 font-bold text-slate-900">${item.tickerSymbol ? item.tickerSymbol.toUpperCase() : 'N/A'}</td>
                    <td class="p-4 text-slate-700">${qty}</td>
                    <td class="p-4 text-emerald-600 font-semibold">$${price.toFixed(2)}</td>
                    <td class="p-4 font-bold text-slate-900">$${total.toFixed(2)}</td>
                    <td class="p-4 text-right">
                        <button onclick="deleteHolding(${item.id})" class="text-red-500 hover:text-red-700 text-xs font-semibold">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');

        updateMetrics(data);
    }

    function updateMetrics(data) {
        const totalVal = data.reduce((sum, item) => sum + ((item.currentUnitPrice || 0) * (item.quantity || 0)), 0);
        if (statTotalVal) statTotalVal.textContent = `$${totalVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (statTotalCount) statTotalCount.textContent = data.length;
    }

    // 8. Add Holding Submit
    if (addHoldingForm) {
        addHoldingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentUser) return alert('Session expired. Please log in again.');

            const payload = {
                userId: currentUser.id,
                tickerSymbol: getEl('form-ticker')?.value.trim().toUpperCase(),
                quantity: parseFloat(getEl('form-quantity')?.value || 0),
                currentUnitPrice: parseFloat(getEl('form-price')?.value || 0)
            };

            try {
                const res = await fetch('/api/portfolio-holdings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    if (addModal) {
                        addModal.classList.add('hidden');
                        addModal.classList.remove('flex');
                    }
                    addHoldingForm.reset();
                    loadHoldings();
                } else {
                    const errData = await res.json();
                    alert(errData.message || 'Failed to add holding.');
                }
            } catch (err) {
                console.error('Save error:', err);
                alert('Connection error while saving holding.');
            }
        });
    }

    // Delete Holding Handler
    window.deleteHolding = async function(id) {
        if (!confirm('Delete this stock holding?')) return;
        try {
            const res = await fetch(`/api/portfolio-holdings/${id}`, { method: 'DELETE' });
            if (res.ok) loadHoldings();
        } catch (e) {
            console.error('Delete error:', e);
        }
    };
});