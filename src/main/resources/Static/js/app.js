document.addEventListener('DOMContentLoaded', () => {
    console.log('Inproma App initialized');

    let activeUserId = 1;
    let holdings = [];

    // Safe DOM element selector helper
    const getEl = (id) => document.getElementById(id);

    // Elements
    const userSelect = getEl('userSelect');
    const holdingsTableBody = getEl('holdings-table-body');
    const balancingTableBody = getEl('balancing-table-body');
    const categoriesList = getEl('categories-list');
    const rulesList = getEl('rules-list');
    const runBalancingBtn = getEl('run-balancing-btn');
    
    // Stats
    const statTotalVal = getEl('stat-total-val');
    const statTotalCount = getEl('stat-total-count');
    const statRebalanceStatus = getEl('stat-rebalance-status');

    // Modal
    const addModal = getEl('add-modal');
    const openAddModalBtn = getEl('open-add-modal');
    const closeAddModalBtn = getEl('close-add-modal');
    const addHoldingForm = getEl('add-holding-form');

    // Tab Navigation
    const tabs = {
        'holdings': { btn: getEl('tab-holdings-btn'), content: getEl('tab-holdings') },
        'balancing': { btn: getEl('tab-balancing-btn'), content: getEl('tab-balancing') },
        'categories': { btn: getEl('tab-categories-btn'), content: getEl('tab-categories') }
    };

    // Attach Tab Event Listeners Safely
    Object.keys(tabs).forEach(tabKey => {
        const item = tabs[tabKey];
        if (item.btn) {
            item.btn.addEventListener('click', () => switchTab(tabKey));
        }
    });

    function switchTab(selectedKey) {
        Object.keys(tabs).forEach(key => {
            const item = tabs[key];
            if (!item.btn || !item.content) return;

            if (key === selectedKey) {
                item.content.classList.remove('hidden');
                item.content.classList.add('block');
                item.btn.classList.add('text-emerald-600', 'border-emerald-500', 'font-semibold');
                item.btn.classList.remove('text-slate-500', 'border-transparent');
            } else {
                item.content.classList.add('hidden');
                item.content.classList.remove('block');
                item.btn.classList.remove('text-emerald-600', 'border-emerald-500', 'font-semibold');
                item.btn.classList.add('text-slate-500', 'border-transparent');
            }
        });
    }

    // Modal Listeners
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

    // Initialize Data Fetching
    loadUsers();
    loadHoldings();
    loadCategories();
    loadRules();

    if (userSelect) {
        userSelect.addEventListener('change', (e) => {
            activeUserId = e.target.value;
            loadHoldings();
        });
    }

    // 1. Load Users
    async function loadUsers() {
        try {
            const res = await fetch('/api/users');
            if (res.ok && userSelect) {
                const users = await res.json();
                if (users.length > 0) {
                    userSelect.innerHTML = users.map(u => `<option value="${u.id}">${u.username || u.name || 'User ' + u.id}</option>`).join('');
                    activeUserId = users[0].id;
                }
            }
        } catch (e) {
            console.warn('Could not fetch users list. Defaulting to User ID 1.');
        }
    }

    // 2. Load Holdings
    async function loadHoldings() {
        if (!holdingsTableBody) return;
        holdingsTableBody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400">Loading holdings...</td></tr>`;
        try {
            let res = await fetch(`/api/portfolio-holdings/user/${activeUserId}`);
            if (!res.ok) res = await fetch('/api/portfolio-holdings');
            
            if (res.ok) {
                holdings = await res.json();
                renderHoldings(holdings);
            } else {
                holdingsTableBody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400">No holdings found.</td></tr>`;
                updateMetrics([]);
            }
        } catch (err) {
            console.error('Error fetching holdings:', err);
            holdingsTableBody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-red-500">Unable to load holdings data.</td></tr>`;
        }
    }

    function renderHoldings(data) {
        if (!holdingsTableBody) return;
        if (!data || data.length === 0) {
            holdingsTableBody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400">No holdings available. Add one above.</td></tr>`;
            updateMetrics([]);
            return;
        }

        holdingsTableBody.innerHTML = data.map(item => {
            const price = item.currentUnitPrice || item.price || 0;
            const qty = item.quantity || 0;
            const total = price * qty;
            return `
                <tr class="hover:bg-slate-50 transition">
                    <td class="p-4 font-mono text-xs text-slate-400">#${item.id}</td>
                    <td class="p-4 font-bold text-slate-900">${item.tickerSymbol || 'N/A'}</td>
                    <td class="p-4 text-slate-600">${item.assetCategory ? item.assetCategory.name : 'General'}</td>
                    <td class="p-4 text-slate-700">${qty}</td>
                    <td class="p-4 text-slate-700">$${price.toFixed(2)}</td>
                    <td class="p-4 font-semibold text-slate-900">$${total.toFixed(2)}</td>
                    <td class="p-4 text-right">
                        <button onclick="deleteHolding(${item.id})" class="text-red-500 hover:text-red-700 text-xs font-semibold">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');

        updateMetrics(data);
    }

    function updateMetrics(data) {
        const totalVal = data.reduce((sum, item) => sum + ((item.currentUnitPrice || item.price || 0) * (item.quantity || 0)), 0);
        if (statTotalVal) statTotalVal.textContent = `$${totalVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (statTotalCount) statTotalCount.textContent = data.length;
    }

    // 3. Add Holding Form Submit
    if (addHoldingForm) {
        addHoldingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                userId: parseInt(activeUserId),
                tickerSymbol: getEl('form-ticker')?.value || '',
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
                    alert('Failed to save holding.');
                }
            } catch (err) {
                console.error('Save error:', err);
            }
        });
    }

    // 4. Delete Holding Global Handler
    window.deleteHolding = async function(id) {
        if (!confirm('Are you sure you want to delete this holding?')) return;
        try {
            const res = await fetch(`/api/portfolio-holdings/${id}`, { method: 'DELETE' });
            if (res.ok) loadHoldings();
        } catch (e) {
            console.error('Delete error:', e);
        }
    };

    // 5. Portfolio Rebalancing Engine Trigger
    if (runBalancingBtn) {
        runBalancingBtn.addEventListener('click', async () => {
            if (!balancingTableBody) return;
            balancingTableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">Executing balancing engine...</td></tr>`;
            try {
                const res = await fetch(`/api/portfolio-balancing/calculate/${activeUserId}`);
                if (res.ok) {
                    const results = await res.json();
                    renderBalancingResults(results);
                } else {
                    balancingTableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-amber-600">Rebalancing calculated no changes or returned status ${res.status}.</td></tr>`;
                }
            } catch (err) {
                console.error('Balancing error:', err);
                balancingTableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-500">Error connecting to PortfolioBalancingController.</td></tr>`;
            }
        });
    }

    function renderBalancingResults(results) {
        if (!balancingTableBody) return;
        if (!results || results.length === 0) {
            balancingTableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">Portfolio is fully balanced!</td></tr>`;
            if (statRebalanceStatus) {
                statRebalanceStatus.textContent = 'Balanced';
                statRebalanceStatus.className = 'text-3xl font-extrabold text-emerald-500 mt-2';
            }
            return;
        }

        if (statRebalanceStatus) {
            statRebalanceStatus.textContent = `${results.length} Trades Required`;
            statRebalanceStatus.className = 'text-3xl font-extrabold text-amber-500 mt-2';
        }

        balancingTableBody.innerHTML = results.map(r => {
            const actionColor = r.action === 'BUY' ? 'bg-emerald-100 text-emerald-800' :
                                r.action === 'SELL' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-600';
            return `
                <tr class="hover:bg-slate-50 transition">
                    <td class="p-4 font-bold text-slate-900">${r.tickerSymbol || r.categoryName || 'N/A'}</td>
                    <td class="p-4 text-slate-600">${r.currentAllocation || 0}%</td>
                    <td class="p-4 text-slate-600">${r.targetAllocation || 0}%</td>
                    <td class="p-4">
                        <span class="px-2.5 py-1 text-xs font-bold rounded-full ${actionColor}">${r.action || 'HOLD'}</span>
                    </td>
                    <td class="p-4 font-semibold text-slate-900">$${Math.abs(r.recommendedAmount || 0).toFixed(2)}</td>
                    <td class="p-4 text-slate-700">${r.unitsToTrade || 0}</td>
                </tr>
            `;
        }).join('');
    }

    // 6. Helpers
    async function loadCategories() {
        if (!categoriesList) return;
        try {
            const res = await fetch('/api/asset-categories');
            if (res.ok) {
                const data = await res.json();
                categoriesList.innerHTML = data.map(c => `
                    <li class="py-3 flex justify-between items-center">
                        <span class="font-medium text-slate-800">${c.name}</span>
                        <span class="text-xs text-slate-400">${c.description || 'Category'}</span>
                    </li>
                `).join('');
            }
        } catch (e) {}
    }

    async function loadRules() {
        if (!rulesList) return;
        try {
            const res = await fetch('/api/portfolio-rules');
            if (res.ok) {
                const data = await res.json();
                rulesList.innerHTML = data.map(r => `
                    <li class="py-3 flex justify-between items-center">
                        <span class="font-medium text-slate-800">${r.ruleName || 'Rule #' + r.id}</span>
                        <span class="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">${r.thresholdPercentage || 0}% Drift</span>
                    </li>
                `).join('');
            }
        } catch (e) {}
    }
});