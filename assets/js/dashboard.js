/* ==========================================================================
   RAIDERS SPORTS ACADEMY – PLAYER DASHBOARD LOGIC
   Modules: Overview, My Batches, Attendance, Tournaments, Fees, Profile, Notifications
   All state persisted in localStorage for frontend demonstration.
   ========================================================================== */

(function () {
  const {
    STORAGE_KEYS,
    PROGRAMS,
    TOURNAMENTS,
    DEFAULT_ATTENDANCE_LOG,
    getStoredJSON,
    setStoredJSON
  } = window.RSA_DATA;

  let session = window.RSA_APP.getSession();
  if (!session || !session.playerId) return;

  let barChart = null;
  let radarChart = null;

  const MODULE_TITLES = {
    overview: 'Overview',
    batches: 'My Batches',
    attendance: 'Attendance Tracker',
    tournaments: 'Tournaments',
    fees: 'Fees & Payments',
    profile: 'My Profile',
    notifications: 'Notifications'
  };

  /* -------------------- Sidebar Drawer & Navigation -------------------- */
  const sidebar = document.getElementById('dashSidebar');
  const backdrop = document.getElementById('dashBackdrop');
  const openBtn = document.getElementById('dashSidebarOpen');
  const closeBtn = document.getElementById('dashSidebarClose');

  function setSidebarOpen(open) {
    if (!sidebar || !backdrop) return;
    sidebar.classList.toggle('open', open);
    backdrop.classList.toggle('open', open);
  }

  if (openBtn) openBtn.addEventListener('click', () => setSidebarOpen(true));
  if (closeBtn) closeBtn.addEventListener('click', () => setSidebarOpen(false));
  if (backdrop) backdrop.addEventListener('click', () => setSidebarOpen(false));

  function switchModule(moduleId) {
    document.querySelectorAll('.dash-module-pane').forEach((pane) => {
      pane.classList.toggle('active', pane.id === `module-${moduleId}`);
    });
    document.querySelectorAll('.dash-nav-btn[data-module]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.module === moduleId);
    });
    const titleEl = document.getElementById('topbarModuleTitle');
    if (titleEl) titleEl.textContent = MODULE_TITLES[moduleId] || 'Dashboard';
    setSidebarOpen(false);
    if (moduleId === 'overview') renderCharts();
  }

  document.querySelectorAll('.dash-nav-btn[data-module], .js-switch-module').forEach((btn) => {
    btn.addEventListener('click', () => {
      switchModule(btn.dataset.module || btn.dataset.target);
    });
  });

  document.getElementById('quickViewAllNotifs').addEventListener('click', () => switchModule('notifications'));

  /* -------------------- Sync Player Header & Overview -------------------- */
  function syncPlayerUI() {
    session = window.RSA_APP.getSession();
    const photo = session.photo || 'assets/images/champ-kabaddi-1.jpg';
    document.getElementById('topbarPlayerPhoto').src = photo;
    document.getElementById('topbarPlayerName').textContent = session.fullName;
    document.getElementById('topbarPlayerId').textContent = session.playerId;

    document.getElementById('ovPlayerPhoto').src = photo;
    document.getElementById('ovWelcomeHeading').textContent = `Welcome Back, ${session.fullName.split(' ')[0]}!`;
    document.getElementById('ovProfileSummary').textContent = `${session.playerId} • ${session.sport} • ${session.level} Tier`;
    document.getElementById('ovStatSport').textContent = session.sport;
    document.getElementById('ovStatBatch').textContent = session.batch;

    const regs = getStoredJSON(STORAGE_KEYS.TOURNAMENT_REGS, []);
    if (regs.length) {
      document.getElementById('ovStatTournamentName').textContent = regs[0].tournamentName.replace(' (Demo)', '');
    }

    const pay = getStoredJSON(STORAGE_KEYS.PAYMENTS, {});
    document.getElementById('ovStatFees').textContent = `INR ${(pay.pendingAmount || 0).toLocaleString()}`;
    document.getElementById('ovStatDueDate').textContent = pay.pendingAmount > 0 ? `Next Due: ${pay.nextDueDate}` : 'All Demo Dues Cleared';
  }

  /* -------------------- Chart.js Visualizations -------------------- */
  function renderCharts() {
    if (!window.Chart) return;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(16,19,23,0.08)';
    const textColor = isDark ? '#D1D5DB' : '#374151';

    const ctxBar = document.getElementById('attendanceBarChart');
    if (ctxBar) {
      if (barChart) barChart.destroy();
      barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
          datasets: [
            {
              label: 'Attended Sessions (Demo)',
              data: [18, 20, 22, 19, 23, 8],
              backgroundColor: '#FF5722',
              borderRadius: 6
            },
            {
              label: 'Scheduled Sessions',
              data: [20, 22, 24, 22, 24, 9],
              backgroundColor: 'rgba(255, 212, 59, 0.45)',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: textColor } } },
          scales: {
            x: { ticks: { color: textColor }, grid: { color: gridColor } },
            y: { ticks: { color: textColor }, grid: { color: gridColor }, beginAtZero: true }
          }
        }
      });
    }

    const ctxRadar = document.getElementById('progressRadarChart');
    if (ctxRadar) {
      if (radarChart) radarChart.destroy();
      radarChart = new Chart(ctxRadar, {
        type: 'radar',
        data: {
          labels: ['Speed', 'Agility', 'Stamina', 'Tactical IQ', 'Defense/Tag', 'Attack/Raid'],
          datasets: [{
            label: 'Player Rating (Demo)',
            data: [86, 90, 84, 82, 88, 91],
            backgroundColor: 'rgba(255, 87, 34, 0.25)',
            borderColor: '#FF5722',
            pointBackgroundColor: '#FFD43B'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: textColor } } },
          scales: {
            r: {
              min: 0,
              max: 100,
              ticks: { display: false },
              grid: { color: gridColor },
              angleLines: { color: gridColor },
              pointLabels: { color: textColor, font: { size: 11, weight: 'bold' } }
            }
          }
        }
      });
    }
  }

  window.addEventListener('rsa:themechange', renderCharts);

  /* -------------------- Module 2: My Batches -------------------- */
  function renderBatches() {
    const enrollments = getStoredJSON(STORAGE_KEYS.ENROLLMENTS, []);
    const tbody = document.getElementById('dashBatchesTableBody');
    tbody.innerHTML = enrollments.map((b) => `
      <tr>
        <td class="fw-bold">${b.programName}</td>
        <td>${b.sport}</td>
        <td>${b.batch}</td>
        <td>${b.coach}</td>
        <td>${b.days} • ${b.time}</td>
        <td><span class="status-pill status-active">${b.status}</span></td>
        <td>
          <button type="button" class="btn-academy-secondary btn-sm-compact js-batch-details" data-id="${b.id}">View Details</button>
        </td>
      </tr>
    `).join('');

    document.querySelectorAll('.js-batch-details').forEach((btn) => {
      btn.addEventListener('click', () => {
        const b = enrollments.find((item) => item.id === btn.dataset.id);
        if (!b) return;
        document.getElementById('dashInfoModalTitle').textContent = b.programName;
        document.getElementById('dashInfoModalBody').innerHTML = `
          <div class="d-flex flex-column gap-2">
            <div><strong>Sport Category:</strong> ${b.sport}</div>
            <div><strong>Assigned Batch:</strong> ${b.batch}</div>
            <div><strong>Lead Coach:</strong> ${b.coach}</div>
            <div><strong>Training Schedule:</strong> ${b.days} (${b.time})</div>
            <div><strong>Enrollment Status:</strong> <span class="status-pill status-active">${b.status}</span></div>
            <div><strong>Enrolled On:</strong> ${b.enrolledAt}</div>
          </div>
        `;
        new bootstrap.Modal(document.getElementById('dashInfoModal')).show();
      });
    });

    // Populate "Enroll in Another Batch" modal
    const pSel = document.getElementById('dashProgSelect');
    const bSel = document.getElementById('dashBatchSelect');
    pSel.innerHTML = PROGRAMS.map((p) => `<option value="${p.id}">${p.name} (${p.sport})</option>`).join('');
    function syncBatches() {
      const prog = PROGRAMS.find((p) => p.id === pSel.value) || PROGRAMS[0];
      bSel.innerHTML = prog.batches.map((bt) => `<option value="${bt}">${bt}</option>`).join('');
    }
    pSel.onchange = syncBatches;
    syncBatches();
  }

  document.getElementById('dashAddBatchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const prog = PROGRAMS.find((p) => p.id === document.getElementById('dashProgSelect').value) || PROGRAMS[0];
    const batch = document.getElementById('dashBatchSelect').value;
    const enrollments = getStoredJSON(STORAGE_KEYS.ENROLLMENTS, []);

    enrollments.unshift({
      id: 'enr-' + Date.now(),
      programId: prog.id,
      programName: prog.name,
      sport: prog.sport,
      batch,
      coach: prog.coach,
      days: prog.schedule.split('•')[0].trim(),
      time: prog.timing,
      status: 'Enrolled (Demo)',
      enrolledAt: new Date().toISOString().slice(0, 10)
    });
    setStoredJSON(STORAGE_KEYS.ENROLLMENTS, enrollments);
    addNotification('Batch Updates', `Demo Batch Added: ${prog.name}`, `Enrolled in ${batch} in demo mode.`);

    bootstrap.Modal.getInstance(document.getElementById('dashBatchModal'))?.hide();
    renderBatches();
    renderOverviewRecent();
    window.RSA_APP.showToast('Demo Batch Enrolled', `${prog.name} added to My Batches.`, 'success');
  });

  /* -------------------- Module 3: Attendance -------------------- */
  function renderAttendance() {
    const logs = DEFAULT_ATTENDANCE_LOG;
    const completed = logs.filter((l) => l.status !== 'Upcoming');
    const present = completed.filter((l) => l.status === 'Present').length;
    const absent = completed.filter((l) => l.status === 'Absent').length;
    const pct = Math.round((present / Math.max(completed.length, 1)) * 100);

    document.getElementById('attTotalCount').textContent = logs.length;
    document.getElementById('attPresentCount').textContent = present;
    document.getElementById('attAbsentCount').textContent = absent;
    document.getElementById('attPctVal').textContent = pct + '%';
    document.getElementById('ovStatAttendance').textContent = pct + '%';

    document.getElementById('attendanceHistoryBody').innerHTML = logs.map((l) => {
      const cls = l.status === 'Present' ? 'status-present' : l.status === 'Absent' ? 'status-absent' : 'status-upcoming';
      return `
        <tr>
          <td class="fw-semibold">${l.date}</td>
          <td>${l.session}</td>
          <td>${l.coach}</td>
          <td><span class="status-pill ${cls}">${l.status}</span></td>
        </tr>
      `;
    }).join('');

    // Build November 2026 Calendar (Nov 1, 2026 is Sunday)
    const daysHead = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const calGrid = document.getElementById('attendanceCalendarGrid');
    let html = daysHead.map((d) => `<div class="cal-day-head">${d}</div>`).join('');

    for (let day = 1; day <= 30; day++) {
      const dateStr = `2026-11-${String(day).padStart(2, '0')}`;
      const found = logs.find((l) => l.date === dateStr);
      let cls = '';
      if (found) {
        cls = found.status === 'Present' ? 'cal-present' : found.status === 'Absent' ? 'cal-absent' : 'cal-upcoming';
      }
      html += `<button type="button" class="cal-day-cell ${cls}" data-cal-date="${dateStr}">${day}</button>`;
    }
    calGrid.innerHTML = html;

    calGrid.querySelectorAll('[data-cal-date]').forEach((cell) => {
      cell.addEventListener('click', () => {
        const dt = cell.dataset.calDate;
        const log = logs.find((l) => l.date === dt);
        const infoEl = document.getElementById('calSelectedDayInfo');
        if (log) {
          infoEl.innerHTML = `<strong>${dt}:</strong> ${log.session} with ${log.coach} — <span class="fw-bold">${log.status} (Demo)</span>`;
        } else {
          infoEl.innerHTML = `<strong>${dt}:</strong> Rest / Non-training day in demo schedule.`;
        }
      });
    });
  }

  /* -------------------- Module 4: Tournaments -------------------- */
  function renderTournaments() {
    const regs = getStoredJSON(STORAGE_KEYS.TOURNAMENT_REGS, []);
    const grid = document.getElementById('dashTournamentsGrid');

    grid.innerHTML = TOURNAMENTS.map((t) => {
      const reg = regs.find((r) => r.tournamentId === t.id);
      const isReg = Boolean(reg);
      return `
        <div class="col-md-6 col-xl-4">
          <div class="dash-card">
            <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
              <span class="demo-badge">${t.sport}</span>
              <span class="status-pill ${isReg ? 'status-registered' : 'status-upcoming'}">${isReg ? 'Registered (Demo)' : 'Open'}</span>
            </div>
            <h3 class="card-title-std" style="font-size:1.35rem;">${t.name}</h3>
            <p class="text-secondary-custom mb-3" style="font-size:0.86rem;">${t.description}</p>
            <ul class="card-meta-list mb-3">
              <li><i data-lucide="calendar"></i><span><strong>Date:</strong> ${t.date} (Deadline: ${t.deadline})</span></li>
              <li><i data-lucide="map-pin"></i><span><strong>Venue:</strong> ${t.venue}</span></li>
              <li><i data-lucide="users"></i><span><strong>Eligibility:</strong> ${t.eligibility}</span></li>
            </ul>
            <div class="mt-auto d-flex flex-wrap gap-2 pt-3 border-top" style="border-color:var(--border-color) !important;">
              <button type="button" class="btn-academy-secondary btn-sm-compact js-tr-details" data-tid="${t.id}">View Details</button>
              ${isReg
                ? `<button type="button" class="btn-academy-yellow btn-sm-compact js-tr-view-reg" data-tid="${t.id}">View Registration</button>`
                : `<button type="button" class="btn-academy-primary btn-sm-compact js-tr-register" data-tid="${t.id}">Register Now</button>`
              }
            </div>
          </div>
        </div>
      `;
    }).join('');

    document.getElementById('dashMyTournamentsBody').innerHTML = regs.map((r) => `
      <tr>
        <td class="fw-bold">${r.tournamentName}</td>
        <td>${r.sport}</td>
        <td>${r.category}</td>
        <td>${r.registeredAt}</td>
        <td><span class="status-pill status-registered">${r.status}</span></td>
      </tr>
    `).join('');

    document.querySelectorAll('.js-tr-details').forEach((btn) => {
      btn.addEventListener('click', () => {
        const t = TOURNAMENTS.find((item) => item.id === btn.dataset.tid);
        if (!t) return;
        document.getElementById('dashInfoModalTitle').textContent = t.name;
        document.getElementById('dashInfoModalBody').innerHTML = `
          <p>${t.description}</p>
          <p class="mb-1"><strong>Date:</strong> ${t.date}</p>
          <p class="mb-1"><strong>Venue:</strong> ${t.venue}</p>
          <p class="mb-1"><strong>Deadline:</strong> ${t.deadline}</p>
          <p class="mb-0"><strong>Eligibility:</strong> ${t.eligibility} • ${t.feeNote}</p>
        `;
        new bootstrap.Modal(document.getElementById('dashInfoModal')).show();
      });
    });

    document.querySelectorAll('.js-tr-view-reg').forEach((btn) => {
      btn.addEventListener('click', () => {
        const reg = regs.find((r) => r.tournamentId === btn.dataset.tid);
        if (!reg) return;
        document.getElementById('dashInfoModalTitle').textContent = 'Demo Tournament Pass';
        document.getElementById('dashInfoModalBody').innerHTML = `
          <div class="alert alert-success">Demo Registration Confirmed — Not a real federation pass.</div>
          <p class="mb-1"><strong>Tournament:</strong> ${reg.tournamentName}</p>
          <p class="mb-1"><strong>Player:</strong> ${session.fullName} (${session.playerId})</p>
          <p class="mb-1"><strong>Category:</strong> ${reg.category}</p>
          <p class="mb-0"><strong>Registered Date:</strong> ${reg.registeredAt}</p>
        `;
        new bootstrap.Modal(document.getElementById('dashInfoModal')).show();
      });
    });

    document.querySelectorAll('.js-tr-register').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.getElementById('trRegName').value = session.fullName;
        document.getElementById('trRegId').value = session.playerId;
        document.getElementById('trRegPhone').value = session.phone;
        document.getElementById('trRegSelect').innerHTML = TOURNAMENTS.map((t) => `<option value="${t.id}">${t.name}</option>`).join('');
        document.getElementById('trRegSelect').value = btn.dataset.tid;
        new bootstrap.Modal(document.getElementById('dashTournRegModal')).show();
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  document.getElementById('dashTournRegForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const tid = document.getElementById('trRegSelect').value;
    const t = TOURNAMENTS.find((item) => item.id === tid) || TOURNAMENTS[0];
    const regs = getStoredJSON(STORAGE_KEYS.TOURNAMENT_REGS, []);

    if (!regs.some((r) => r.tournamentId === t.id)) {
      regs.unshift({
        id: 'treg-' + Date.now(),
        tournamentId: t.id,
        tournamentName: t.name,
        sport: document.getElementById('trRegSport').value,
        category: document.getElementById('trRegCat').value,
        status: 'Registered (Demo)',
        registeredAt: new Date().toISOString().slice(0, 10)
      });
      setStoredJSON(STORAGE_KEYS.TOURNAMENT_REGS, regs);
      addNotification('Tournament Announcements', `Registered: ${t.name}`, 'Your demo tournament entry is recorded in Dashboard → Tournaments.');
    }

    bootstrap.Modal.getInstance(document.getElementById('dashTournRegModal'))?.hide();
    renderTournaments();
    syncPlayerUI();
    renderOverviewRecent();
    window.RSA_APP.showToast('Tournament Registered (Demo)', `${t.name} added to your dashboard.`, 'success');
  });

  /* -------------------- Module 5: Fees & Payments (Strict Demo Mode) -------------------- */
  function renderFees() {
    const pay = getStoredJSON(STORAGE_KEYS.PAYMENTS, {});
    document.getElementById('feeTotalVal').textContent = `INR ${(pay.totalFee || 0).toLocaleString()}`;
    document.getElementById('feePaidVal').textContent = `INR ${(pay.paidAmount || 0).toLocaleString()}`;
    document.getElementById('feePendingVal').textContent = `INR ${(pay.pendingAmount || 0).toLocaleString()}`;
    document.getElementById('feeDueDateVal').textContent = pay.pendingAmount > 0 ? pay.nextDueDate : 'Cleared (Demo)';
    document.getElementById('demoPayPendingText').textContent = `INR ${(pay.pendingAmount || 0).toLocaleString()}`;

    const payBtn = document.getElementById('openDemoPayBtn');
    payBtn.disabled = (pay.pendingAmount || 0) <= 0;
    if ((pay.pendingAmount || 0) <= 0) payBtn.textContent = 'Demo Balance Settled';

    document.getElementById('feeBreakdownList').innerHTML = (pay.breakdown || []).map((item) => `
      <div class="d-flex justify-content-between align-items-center p-3 rounded-3" style="background:var(--bg-primary);border:1px solid var(--border-color);">
        <span>${item.item}</span>
        <span class="fw-bold">INR ${item.amount.toLocaleString()}</span>
      </div>
    `).join('');

    document.getElementById('feeHistoryTableBody').innerHTML = (pay.history || []).map((h) => `
      <tr>
        <td class="fw-bold">${h.ref}</td>
        <td>${h.date}</td>
        <td>${h.desc}</td>
        <td>INR ${h.amount.toLocaleString()}</td>
        <td><span class="status-pill status-paid">${h.status}</span></td>
        <td>
          <button type="button" class="btn-academy-secondary btn-sm-compact js-demo-receipt" data-ref="${h.ref}">Download Receipt</button>
        </td>
      </tr>
    `).join('');

    document.querySelectorAll('.js-demo-receipt').forEach((btn) => {
      btn.addEventListener('click', () => {
        const rec = (pay.history || []).find((h) => h.ref === btn.dataset.ref);
        if (!rec) return;
        document.getElementById('dashInfoModalTitle').textContent = 'Demo Fee Receipt';
        document.getElementById('dashInfoModalBody').innerHTML = `
          <div class="p-3 rounded-3" style="border:1px dashed var(--accent-orange);background:var(--bg-primary);">
            <div class="fw-bold text-orange text-uppercase mb-2">Raiders Sports Academy — DEMO RECEIPT</div>
            <div class="small mb-1"><strong>Reference:</strong> ${rec.ref}</div>
            <div class="small mb-1"><strong>Player:</strong> ${session.fullName} (${session.playerId})</div>
            <div class="small mb-1"><strong>Date:</strong> ${rec.date}</div>
            <div class="small mb-1"><strong>Description:</strong> ${rec.desc}</div>
            <div class="small mb-2"><strong>Amount:</strong> INR ${rec.amount.toLocaleString()} (${rec.status})</div>
            <div class="text-secondary-custom" style="font-size:0.75rem;">This is a simulated demo receipt. No real payment or tax invoice was generated.</div>
          </div>
        `;
        new bootstrap.Modal(document.getElementById('dashInfoModal')).show();
      });
    });
  }

  document.getElementById('openDemoPayBtn').addEventListener('click', () => {
    new bootstrap.Modal(document.getElementById('demoPayModal')).show();
  });

  document.getElementById('confirmDemoPayBtn').addEventListener('click', () => {
    const pay = getStoredJSON(STORAGE_KEYS.PAYMENTS, {});
    if ((pay.pendingAmount || 0) <= 0) return;

    const amt = pay.pendingAmount;
    pay.paidAmount += amt;
    pay.pendingAmount = 0;
    pay.history.unshift({
      ref: 'DEMO-TXN-' + Math.floor(92000 + Math.random() * 7999),
      date: new Date().toISOString().slice(0, 10),
      desc: 'Simulated Final Installment (Demo Only)',
      amount: amt,
      status: 'Paid (Demo)'
    });
    setStoredJSON(STORAGE_KEYS.PAYMENTS, pay);
    addNotification('Fee Reminders', 'Simulated Demo Payment Recorded', `Demo record updated for INR ${amt.toLocaleString()}. No real payment occurred.`);

    bootstrap.Modal.getInstance(document.getElementById('demoPayModal'))?.hide();
    renderFees();
    syncPlayerUI();
    window.RSA_APP.showToast('Demo Fee Record Updated', 'Simulated demo receipt generated without collecting card details.', 'success');
  });

  /* -------------------- Module 6: My Profile -------------------- */
  function renderProfile() {
    session = window.RSA_APP.getSession();
    document.getElementById('profCardPhoto').src = session.photo || 'assets/images/champ-kabaddi-1.jpg';
    document.getElementById('profCardName').textContent = session.fullName;
    document.getElementById('profCardId').textContent = session.playerId;
    document.getElementById('profCardSport').textContent = `${session.sport} • ${session.level}`;
    document.getElementById('profCardDob').textContent = session.dob || 'Not specified';
    document.getElementById('profCardBatch').textContent = session.batch || 'Assigned on Trial';
    document.getElementById('profCardJoined').textContent = session.joinedDate || '2026';

    document.getElementById('profEditName').value = session.fullName || '';
    document.getElementById('profEditPhone').value = session.phone || '';
    document.getElementById('profEditGuardian').value = session.guardianName || '';
    document.getElementById('profEditEmergency').value = session.emergencyContact || '';
    document.getElementById('profEditLevel').value = session.level || 'Beginner';
    document.getElementById('profEditEmail').value = session.email || '';
    document.getElementById('profEditAddress').value = session.address || '';
  }

  document.getElementById('dashProfileForm').addEventListener('submit', function (e) {
    e.preventDefault();
    session.fullName = document.getElementById('profEditName').value.trim();
    session.phone = document.getElementById('profEditPhone').value.trim();
    session.guardianName = document.getElementById('profEditGuardian').value.trim();
    session.emergencyContact = document.getElementById('profEditEmergency').value.trim();
    session.level = document.getElementById('profEditLevel').value;
    session.address = document.getElementById('profEditAddress').value.trim();

    setStoredJSON(STORAGE_KEYS.SESSION, session);
    const players = getStoredJSON(STORAGE_KEYS.PLAYERS, []);
    const idx = players.findIndex((p) => p.playerId === session.playerId);
    if (idx !== -1) {
      players[idx] = { ...players[idx], ...session };
      setStoredJSON(STORAGE_KEYS.PLAYERS, players);
    }

    syncPlayerUI();
    renderProfile();
    window.RSA_APP.showToast('Profile Updated (Demo)', 'Your profile updates have been saved to localStorage.', 'success');
  });

  /* -------------------- Module 7: Notifications -------------------- */
  function addNotification(category, title, message) {
    const notifs = getStoredJSON(STORAGE_KEYS.NOTIFICATIONS, []);
    notifs.unshift({
      id: 'notif-' + Date.now(),
      category,
      title,
      message,
      time: 'Just now',
      read: false
    });
    setStoredJSON(STORAGE_KEYS.NOTIFICATIONS, notifs);
    renderNotifications();
  }

  function renderNotifications() {
    const notifs = getStoredJSON(STORAGE_KEYS.NOTIFICATIONS, []);
    const unreadCount = notifs.filter((n) => !n.read).length;

    document.getElementById('sidebarNotifBadge').textContent = unreadCount;
    document.getElementById('topbarNotifCount').textContent = unreadCount;

    const topbarList = document.getElementById('topbarNotifList');
    topbarList.innerHTML = notifs.slice(0, 3).map((n) => `
      <div class="p-2 rounded-2" style="background:var(--bg-primary);border-inline-start:3px solid ${n.read ? 'var(--border-color)' : 'var(--accent-orange)'};">
        <div class="fw-bold">${n.title}</div>
        <div class="text-secondary-custom" style="font-size:0.75rem;">${n.time}</div>
      </div>
    `).join('');

    const filter = document.getElementById('notifFilterSelect').value;
    const filtered = filter === 'All' ? notifs : notifs.filter((n) => n.category === filter);

    document.getElementById('dashNotificationsList').innerHTML = filtered.map((n) => `
      <div class="notif-item ${n.read ? '' : 'is-unread'}">
        <div>
          <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <span class="demo-badge">${n.category}</span>
            <small class="text-secondary-custom">${n.time}</small>
            ${!n.read ? '<span class="badge bg-danger">Unread</span>' : ''}
          </div>
          <div class="fw-bold mb-1">${n.title}</div>
          <div class="text-secondary-custom" style="font-size:0.88rem;">${n.message}</div>
        </div>
        ${!n.read
          ? `<button type="button" class="btn-academy-secondary btn-sm-compact js-mark-read" data-nid="${n.id}">Mark Read</button>`
          : '<span class="text-success fw-semibold" style="font-size:0.8rem;">Read</span>'
        }
      </div>
    `).join('');

    document.querySelectorAll('.js-mark-read').forEach((btn) => {
      btn.addEventListener('click', () => {
        const list = getStoredJSON(STORAGE_KEYS.NOTIFICATIONS, []);
        const item = list.find((n) => n.id === btn.dataset.nid);
        if (item) item.read = true;
        setStoredJSON(STORAGE_KEYS.NOTIFICATIONS, list);
        renderNotifications();
      });
    });
  }

  document.getElementById('notifFilterSelect').addEventListener('change', renderNotifications);
  document.getElementById('markAllReadBtn').addEventListener('click', () => {
    const list = getStoredJSON(STORAGE_KEYS.NOTIFICATIONS, []).map((n) => ({ ...n, read: true }));
    setStoredJSON(STORAGE_KEYS.NOTIFICATIONS, list);
    renderNotifications();
    window.RSA_APP.showToast('All Caught Up', 'All demo notifications marked as read.', 'success');
  });

  function renderOverviewRecent() {
    const notifs = getStoredJSON(STORAGE_KEYS.NOTIFICATIONS, []);
    document.getElementById('ovRecentActivities').innerHTML = notifs.slice(0, 4).map((n) => `
      <div class="p-3 rounded-3" style="background:var(--bg-primary);border:1px solid var(--border-color);">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <span class="text-orange fw-bold" style="font-size:0.75rem;">${n.category}</span>
          <small class="text-secondary-custom">${n.time}</small>
        </div>
        <div class="fw-semibold" style="font-size:0.88rem;">${n.title}</div>
      </div>
    `).join('');
  }

  /* -------------------- Initial Render -------------------- */
  syncPlayerUI();
  renderBatches();
  renderAttendance();
  renderTournaments();
  renderFees();
  renderProfile();
  renderNotifications();
  renderOverviewRecent();
  renderCharts();

  if (window.lucide) window.lucide.createIcons();
})();

