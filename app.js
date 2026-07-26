/**
 * ImaDoko - 社員行動予定管理システム Main Logic Engine
 */

// --------------------------------------------------------------------------
// 1. Data Models & Default Configuration
// --------------------------------------------------------------------------

const DEFAULT_STATUSES = [
  { id: 'zaiseki', name: '在席', icon: 'fa-user-check', defaultColor: '#10b981' },
  { id: 'zaitaku', name: '在宅勤務', icon: 'fa-house-user', defaultColor: '#06b6d4' },
  { id: 'chokko', name: '直行', icon: 'fa-person-walking-arrow-right', defaultColor: '#3b82f6' },
  { id: 'chokki', name: '直帰', icon: 'fa-person-walking-arrow-loop-left', defaultColor: '#6366f1' },
  { id: 'chokko_chokki', name: '直行・直帰', icon: 'fa-arrows-split-up-and-left', defaultColor: '#8b5cf6' },
  { id: 'gaishutsu', name: '外出', icon: 'fa-car-side', defaultColor: '#f59e0b' },
  { id: 'uchiawase', name: '社内打合せ中', icon: 'fa-comments', defaultColor: '#ec4899' },
  { id: 'taikin', name: '退勤', icon: 'fa-door-closed', defaultColor: '#64748b' },
  { id: 'yasumi', name: '休み', icon: 'fa-mug-hot', defaultColor: '#ef4444' }
];

const INITIAL_MEMBERS = [
  {
    id: 'm1', name: '山田 太郎', dept: '営業部', role: '部長', ext: '101',
    email: 'yamada.t@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    status: '在席', message: '14:00~ A社様とオンライン商談中',
    hasMemo: true, memo: '経理部より伝言: 月次経費申請の件でお電話ください。',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: 'm2', name: '佐藤 花子', dept: '開発部', role: 'リードエンジニア', ext: '201',
    email: 'sato.h@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    status: '在宅勤務', message: '終日在宅。連絡はSlackまたはTeamsまで',
    hasMemo: false, memo: '', lastUpdated: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'm3', name: '鈴木 一郎', dept: '営業部', role: '主任', ext: '102',
    email: 'suzuki.i@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    status: '直行・直帰', message: '東京オフィス訪問後、直接帰宅します。17時復帰不可',
    hasMemo: true, memo: '直行先から直帰の旨、受付共有済みです。',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: 'm4', name: '高橋 健太', dept: '企画部', role: 'マネージャー', ext: '301',
    email: 'takahashi.k@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    status: '社内打合せ中', message: '3F 会議室Bにて新規プロジェクトキックオフ中',
    hasMemo: false, memo: '', lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: 'm5', name: '田中 美咲', dept: '総務部', role: 'スタッフ', ext: '501',
    email: 'tanaka.m@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    status: '退勤', message: 'お疲れ様でした。',
    hasMemo: false, memo: '', lastUpdated: new Date(Date.now() - 1000 * 60 * 360).toISOString()
  },
  {
    id: 'm6', name: '伊藤 誠', dept: '開発部', role: 'フロントエンド開発', ext: '202',
    email: 'ito.m@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    status: '外出', message: 'データセンター現地作業中 (16:30戻り予定)',
    hasMemo: false, memo: '', lastUpdated: new Date(Date.now() - 1000 * 60 * 90).toISOString()
  }
];

const INITIAL_SCHEDULES = [
  {
    id: 'sch_1', memberId: 'm1', memberIds: ['m1'], type: 'once',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().slice(0, 10),
    dayOfWeek: null, status: '休み', title: '有給休暇'
  },
  {
    id: 'sch_2', memberId: 'm2', memberIds: ['m2', 'm6'], type: 'once',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10),
    dayOfWeek: null, status: '外出', title: 'B社 現地調査'
  },
  {
    id: 'sch_3', memberId: 'm2', memberIds: ['m2'], type: 'weekly',
    date: null, dayOfWeek: 3, status: '在宅勤務', title: '定例: 毎週水曜在宅'
  },
  {
    id: 'sch_4', memberId: 'm4', memberIds: ['m4'], type: 'weekly',
    date: null, dayOfWeek: 1, status: '社内打合せ中', title: '定例: 毎週月曜 開発ミーティング'
  }
];

const INITIAL_LOGS = [
  {
    id: 'l1', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    memberName: '山田 太郎', dept: '営業部', oldStatus: '外出', newStatus: '在席',
    message: '14:00~ A社様とオンライン商談中',
    memo: '経理部より伝言: 月次経費申請の件でお電話ください。',
    type: 'manual'
  }
];

// --------------------------------------------------------------------------
// 2. Application Engine & Supabase Helper
// --------------------------------------------------------------------------

class ImaDokoApp {
  constructor() {
    this.supabase = null;
    this.initSupabaseClient();

    this.members = this.loadStorage('imadoko_members', INITIAL_MEMBERS);
    this.statusColors = this.loadStorage('imadoko_colors', this.getDefaultColors());

    // 端末毎のローカル設定
    this.settings = this.loadStorage('imadoko_local_settings', {
      showExactTime: true,
      autoCron: true
    });

    this.schedules = this.loadStorage('imadoko_schedules', INITIAL_SCHEDULES);
    this.logs = this.loadStorage('imadoko_logs', INITIAL_LOGS);

    this.currentView = 'list';
    // ② リスト形式の表示単位は「部署毎」をデフォルトに
    this.groupMode = 'dept';

    this.selectedMemberId = null;
    this.searchQuery = '';
    this.deptFilter = 'ALL';
    this.calendarDate = new Date();
    this.simLogs = [];

    this.init();
  }

  initSupabaseClient() {
    if (window.supabase && window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url && window.SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL') {
      try {
        this.supabase = window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey);
        console.log('Supabase initialized successfully');
      } catch (e) {
        console.error('Supabase initialization failed:', e);
      }
    }
  }

  getDefaultColors() {
    const colors = {};
    DEFAULT_STATUSES.forEach(s => { colors[s.name] = s.defaultColor; });
    return colors;
  }

  loadStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error('LocalStorage error:', e);
      return fallback;
    }
  }

  saveStorage(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { console.error('LocalStorage save error:', e); }
  }

  async init() {
    this.applyStatusColorsToCSS();
    this.bindEvents();
    this.updateFullClock();
    setInterval(() => this.updateFullClock(), 1000);
    this.setupAutoCronChecks();
    this.setupDailyLogCapture();   // ⑧ 平日10:15スナップショット

    this.renderDeptFilterOptions();
    this.renderStatsBar();
    this.renderCurrentView();
    this.renderCalendarUserOptions();
    this.renderStatusOptionsInScheduleModal();

    // ① レスポンシブフォントサイズ調整
    this.setupFluidTypography();
    window.addEventListener('resize', () => this.setupFluidTypography());

    // Supabaseからのデータ非同期ロード & リアルタイム同期の開始
    if (this.supabase) {
      await this.syncDataFromSupabase();
      this.subscribeRealtimeChanges();
    }
  }

  // --------------------------------------------------------------------------
  // Supabase Sync Methods
  // --------------------------------------------------------------------------
  async syncDataFromSupabase() {
    if (!this.supabase) return;

    try {
      // 1. Members
      const { data: dbMembers, error: mErr } = await this.supabase.from('members').select('*');
      if (!mErr && dbMembers) {
        if (dbMembers.length === 0) {
          // 初期シードデータ投入
          await this.seedInitialMembersToSupabase();
        } else {
          this.members = dbMembers.map(m => ({
            id: m.id,
            name: m.name,
            dept: m.dept,
            role: m.role || '',
            ext: m.ext || '',
            email: m.email,
            avatar: m.avatar || '',
            status: m.status,
            message: m.message || '',
            hasMemo: m.has_memo,
            memo: m.memo || '',
            lastUpdated: m.last_updated
          }));
          this.saveStorage('imadoko_members', this.members);
        }
      }

      // 2. Schedules
      const { data: dbSchedules, error: sErr } = await this.supabase.from('schedules').select('*');
      if (!sErr && dbSchedules && dbSchedules.length > 0) {
        this.schedules = dbSchedules.map(s => ({
          id: s.id,
          memberId: s.member_id,
          memberIds: s.member_ids || [s.member_id],
          type: s.type,
          date: s.date,
          dayOfWeek: s.day_of_week,
          status: s.status,
          title: s.title
        }));
        this.saveStorage('imadoko_schedules', this.schedules);
      }

      // 3. Logs
      const { data: dbLogs, error: lErr } = await this.supabase.from('logs').select('*').order('timestamp', { ascending: false }).limit(100);
      if (!lErr && dbLogs && dbLogs.length > 0) {
        this.logs = dbLogs.map(l => ({
          id: l.id,
          timestamp: l.timestamp,
          memberName: l.member_name,
          dept: l.dept,
          oldStatus: l.old_status,
          newStatus: l.new_status,
          message: l.message || '',
          memo: l.memo || '',
          type: l.type || 'manual'
        }));
        this.saveStorage('imadoko_logs', this.logs);
      }

      // 画面更新
      this.renderDeptFilterOptions();
      this.renderStatsBar();
      this.renderCurrentView();
      this.renderCalendarUserOptions();
    } catch (err) {
      console.error('Error syncing with Supabase:', err);
    }
  }

  async seedInitialMembersToSupabase() {
    if (!this.supabase) return;
    const formatted = INITIAL_MEMBERS.map(m => ({
      id: m.id,
      name: m.name,
      dept: m.dept,
      role: m.role,
      ext: m.ext,
      email: m.email,
      avatar: m.avatar,
      status: m.status,
      message: m.message,
      has_memo: m.hasMemo,
      memo: m.memo,
      last_updated: m.lastUpdated
    }));
    await this.supabase.from('members').insert(formatted);
  }

  async upsertMemberToSupabase(member) {
    if (!this.supabase) return;
    const payload = {
      id: member.id,
      name: member.name,
      dept: member.dept,
      role: member.role || '',
      ext: member.ext || '',
      email: member.email,
      avatar: member.avatar || '',
      status: member.status,
      message: member.message || '',
      has_memo: !!member.hasMemo,
      memo: member.memo || '',
      last_updated: member.lastUpdated || new Date().toISOString()
    };
    await this.supabase.from('members').upsert(payload);
  }

  async deleteMemberFromSupabase(id) {
    if (!this.supabase) return;
    await this.supabase.from('members').delete().eq('id', id);
  }

  async upsertScheduleToSupabase(sch) {
    if (!this.supabase) return;
    const payload = {
      id: sch.id,
      member_id: sch.memberId,
      member_ids: sch.memberIds || [sch.memberId],
      type: sch.type,
      date: sch.date || null,
      day_of_week: sch.dayOfWeek !== undefined ? sch.dayOfWeek : null,
      status: sch.status,
      title: sch.title
    };
    await this.supabase.from('schedules').upsert(payload);
  }

  async saveLogToSupabase(log) {
    if (!this.supabase) return;
    const payload = {
      id: log.id,
      timestamp: log.timestamp,
      member_name: log.memberName,
      dept: log.dept,
      old_status: log.oldStatus,
      new_status: log.newStatus,
      message: log.message || '',
      memo: log.memo || '',
      type: log.type || 'manual'
    };
    await this.supabase.from('logs').insert(payload);
  }

  subscribeRealtimeChanges() {
    if (!this.supabase) return;
    this.supabase
      .channel('imadoko-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => {
        this.syncDataFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedules' }, () => {
        this.syncDataFromSupabase();
      })
      .subscribe();
  }

  // ① スクロールバーを出さない流動的フォント・レイアウト
  setupFluidTypography() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const root = document.documentElement;

    // 基準フォントサイズ: 320px→13px / 1920px→17px の線形補間
    const minW = 320, maxW = 1920, minF = 12, maxF = 17;
    const clampedW = Math.min(Math.max(vw, minW), maxW);
    const fontSize = minF + (maxF - minF) * ((clampedW - minW) / (maxW - minW));
    root.style.fontSize = fontSize.toFixed(2) + 'px';

    // ヘッダー高さをvh基準でCSSに渡す（カレンダーなどの高さ計算に利用）
    root.style.setProperty('--viewport-w', vw + 'px');
    root.style.setProperty('--viewport-h', vh + 'px');
    root.style.setProperty('--base-font', fontSize.toFixed(2) + 'px');
  }

  applyStatusColorsToCSS() {
    const root = document.documentElement;
    Object.keys(this.statusColors).forEach(name => {
      const s = DEFAULT_STATUSES.find(x => x.name === name);
      if (s) root.style.setProperty(`--color-${s.id}`, this.statusColors[name]);
    });
  }

  // ⑦ 西暦(和暦) + 日付 + 曜日 + 時刻
  updateFullClock() {
    const now = new Date();
    const year = now.getFullYear();
    let wareki = '';
    if (year >= 2019) wareki = `令和${year - 2018 === 1 ? '元' : year - 2018}年`;
    else if (year >= 1989) wareki = `平成${year - 1988 === 1 ? '元' : year - 1988}年`;

    const month = now.getMonth() + 1;
    const date = now.getDate();
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const dayOfWeek = days[now.getDay()];
    const timeStr = now.toLocaleTimeString('ja-JP', { hour12: false });
    const fullStr = `${year}年 (${wareki}) ${month}月${date}日 (${dayOfWeek}) ${timeStr}`;

    const clockEl = document.getElementById('fullDateClock');
    if (clockEl) clockEl.textContent = fullStr;
  }

  // --------------------------------------------------------------------------
  // 3. UI Renderers
  // --------------------------------------------------------------------------
  renderDeptFilterOptions() {
    const select = document.getElementById('deptFilter');
    if (!select) return;
    const depts = Array.from(new Set(this.members.map(m => m.dept)));
    select.innerHTML = '<option value="ALL">全部署を表示</option>' +
      depts.map(d => `<option value="${d}">${d}</option>`).join('');
    select.value = this.deptFilter;
  }

  renderStatsBar() {
    const statsBar = document.getElementById('statsBar');
    if (!statsBar) return;
    const counts = {};
    DEFAULT_STATUSES.forEach(s => counts[s.name] = 0);
    this.members.forEach(m => { if (counts[m.status] !== undefined) counts[m.status]++; });

    statsBar.innerHTML = DEFAULT_STATUSES.map(s => {
      const color = this.statusColors[s.name] || s.defaultColor;
      return `
        <div class="stat-pill" onclick="app.filterByStatus('${s.name}')">
          <span class="stat-dot" style="background-color: ${color}"></span>
          <span>${s.name}</span>
          <span class="stat-count">${counts[s.name]}</span>
        </div>`;
    }).join('');
  }

  filterByStatus(statusName) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = statusName;
      this.searchQuery = statusName;
      this.renderCurrentView();
    }
  }

  getFilteredMembers() {
    return this.members.filter(m => {
      const matchDept = (this.deptFilter === 'ALL' || m.dept === this.deptFilter);
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q ||
        m.name.toLowerCase().includes(q) ||
        m.dept.toLowerCase().includes(q) ||
        (m.ext && m.ext.toLowerCase().includes(q)) ||
        m.status.toLowerCase().includes(q) ||
        (m.message && m.message.toLowerCase().includes(q)) ||
        (m.memo && m.memo.toLowerCase().includes(q));
      return matchDept && matchSearch;
    });
  }

  renderCurrentView() {
    if (this.currentView === 'list') this.renderListView();
    else if (this.currentView === 'card') this.renderCardView();
    else if (this.currentView === 'calendar') this.renderCalendarView();
  }

  // 更新日時表示 (ON: 最終時刻 / OFF: 経過時間)
  formatTimestampDisplay(isoString) {
    if (!isoString) return '-';
    const date = new Date(isoString);
    if (this.settings.showExactTime) {
      return `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
    } else {
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      if (diffMins < 1) return 'たった今';
      if (diffMins < 60) return `${diffMins}分前`;
      if (diffHours < 24) return `${diffHours}時間前`;
      return `${Math.floor(diffHours / 24)}日前`;
    }
  }

  // ② リスト形式: 単一の統一テーブルの中に各部署/ステータスの区分けヘッダー行を挟み込んで表示
  renderListView() {
    const container = document.getElementById('listGroupContainer');
    if (!container) return;
    const filtered = this.getFilteredMembers();
    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-user-slash"></i><br>該当する社員が見つかりません</div>`;
      return;
    }

    let groups = [];
    if (this.groupMode === 'status') {
      DEFAULT_STATUSES.forEach(s => {
        const mems = filtered.filter(m => m.status === s.name);
        if (mems.length > 0) {
          groups.push({
            title: s.name, type: 'status',
            color: this.statusColors[s.name] || s.defaultColor, icon: s.icon, members: mems
          });
        }
      });
    } else {
      // デフォルト: 部署毎 (dept)
      const depts = Array.from(new Set(filtered.map(m => m.dept)));
      groups = depts.map(d => ({
        title: d, type: 'dept',
        members: filtered.filter(m => m.dept === d)
      }));
    }

    let tableRows = '';
    groups.forEach(g => {
      if (g.type !== 'none') {
        const iconHtml = g.type === 'dept'
          ? '<i class="fa-solid fa-building"></i>'
          : `<i class="fa-solid ${g.icon}" style="color:${g.color}"></i>`;
        const headerClass = g.type === 'dept' ? 'group-header-dept-row' : 'group-header-status-row';
        tableRows += `
          <tr class="group-header-row ${headerClass}">
            <td colspan="6">
              <div class="group-row-header-content">
                <span class="group-row-title">${iconHtml} <span>${g.title}</span></span>
                <span class="group-count-badge">${g.members.length} 名</span>
              </div>
            </td>
          </tr>`;
      }

      tableRows += g.members.map(m => {
        const statusObj = DEFAULT_STATUSES.find(s => s.name === m.status) || DEFAULT_STATUSES[0];
        const themeColor = this.statusColors[m.status] || statusObj.defaultColor;
        const timeDisplayStr = this.formatTimestampDisplay(m.lastUpdated);
        return `
          <tr draggable="true" data-id="${m.id}" data-dept="${m.dept}" onclick="app.openStatusModal('${m.id}')">
            <td>
              <div class="list-user-cell">
                <img class="avatar-md" src="${m.avatar}" alt="" onerror="this.src='https://via.placeholder.com/150'">
                <div>
                  <div style="display:flex;align-items:center;gap:0.4rem;white-space:nowrap;">
                    <strong class="member-name">${m.name}</strong>
                    ${m.ext ? `<span class="ext-badge"><i class="fa-solid fa-phone"></i> ${m.ext}</span>` : ''}
                  </div>
                  <span style="font-size:0.75rem;color:var(--text-muted);">${m.dept}${m.role ? ' (' + m.role + ')' : ''}</span>
                </div>
              </div>
            </td>
            <td>
              <span class="status-badge" style="background-color:${themeColor}">
                <i class="fa-solid ${statusObj.icon}"></i> ${m.status}
              </span>
            </td>
            <td style="max-width:280px;word-break:break-word;">
              ${m.message ? this.escapeHtml(m.message) : '<span style="color:var(--text-light);">-</span>'}
            </td>
            <td>
              ${m.hasMemo && m.memo ? `<span class="list-memo-tag" title="${this.escapeHtml(m.memo)}"><i class="fa-solid fa-thumbtack"></i> ${this.escapeHtml(m.memo)}</span>` : '<span style="color:var(--text-light);">-</span>'}
            </td>
            <td>
              <span class="timestamp-display"><i class="fa-regular fa-clock"></i> ${timeDisplayStr}</span>
            </td>
            <td>
              <button class="btn btn-secondary" style="padding:0.25rem 0.6rem;font-size:0.8rem;" onclick="event.stopPropagation();app.openStatusModal('${m.id}')">変更</button>
            </td>
          </tr>`;
      }).join('');
    });

    container.innerHTML = `
      <div class="table-responsive">
        <table class="status-table unified-status-table">
          <thead>
            <tr>
              <th>社員名 / 内線</th>
              <th>ステータス</th>
              <th>メッセージ</th>
              <th>伝言メモ</th>
              <th>${this.settings.showExactTime ? '最終更新時刻' : '経過時間'}</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>`;

    this.bindDragEvents();
  }

  renderCardView() {
    const container = document.getElementById('cardGroupContainer');
    if (!container) return;
    const filtered = this.getFilteredMembers();
    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-user-slash"></i><br>該当する社員が見つかりません</div>`;
      return;
    }

    let groups = [];
    if (this.groupMode === 'dept_flat' || this.groupMode === 'dept') {
      const depts = Array.from(new Set(filtered.map(m => m.dept)));
      groups = depts.map(d => ({ title: d, type: 'dept', members: filtered.filter(m => m.dept === d) }));
    } else if (this.groupMode === 'status') {
      DEFAULT_STATUSES.forEach(s => {
        const mems = filtered.filter(m => m.status === s.name);
        if (mems.length > 0) {
          groups.push({ title: s.name, type: 'status', color: this.statusColors[s.name] || s.defaultColor, icon: s.icon, members: mems });
        }
      });
    } else {
      groups = [{ title: '', type: 'none', members: filtered }];
    }

    container.innerHTML = groups.map(g => {
      const headerHtml = g.type !== 'none' ? `
        <div class="group-header ${g.type === 'dept' ? 'group-header-dept' : 'group-header-status'}">
          <div class="group-header-title">
            ${g.type === 'dept' ? '<i class="fa-solid fa-building"></i>' : `<i class="fa-solid ${g.icon}" style="color:${g.color}"></i>`}
            <span>${g.title}</span>
          </div>
          <span class="group-count-badge">${g.members.length} 名</span>
        </div>` : '';

      const cardsHtml = g.members.map(m => {
        const statusObj = DEFAULT_STATUSES.find(s => s.name === m.status) || DEFAULT_STATUSES[0];
        const themeColor = this.statusColors[m.status] || statusObj.defaultColor;
        const hexToRgba = (hex, op) => {
          let c = hex.replace('#','');
          if (c.length===3) c = c.split('').map(x=>x+x).join('');
          const n = parseInt(c,16);
          return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${op})`;
        };
        const bgStyle = `background:linear-gradient(135deg,#fff 0%,${hexToRgba(themeColor,0.08)} 100%);border-color:${themeColor};`;
        const timeDisplayStr = this.formatTimestampDisplay(m.lastUpdated);
        return `
          <div class="status-card" draggable="true" data-id="${m.id}" data-dept="${m.dept}" style="${bgStyle}" onclick="app.openStatusModal('${m.id}')">
            <div class="card-top-bar">
              <div class="member-info-header">
                <img class="avatar" src="${m.avatar}" alt="${m.name}" onerror="this.src='https://via.placeholder.com/150'">
                <div>
                  <div style="display:flex;align-items:center;gap:0.35rem;white-space:nowrap;">
                    <span class="member-name">${m.name}</span>
                    ${m.ext ? `<span class="ext-badge"><i class="fa-solid fa-phone"></i> ${m.ext}</span>` : ''}
                  </div>
                  <div class="member-dept">${m.dept}${m.role ? ' · ' + m.role : ''}</div>
                </div>
              </div>
              <div class="status-badge" style="background-color:${themeColor}">
                <i class="fa-solid ${statusObj.icon}"></i> ${m.status}
              </div>
            </div>
            <div class="card-body">
              <div class="status-message ${!m.message ? 'empty' : ''}">
                ${m.message ? this.escapeHtml(m.message) : 'メッセージなし'}
              </div>
              ${m.hasMemo && m.memo ? `
                <div class="card-memo-box">
                  <div class="card-memo-title"><i class="fa-solid fa-thumbtack"></i> 伝言メッセージ</div>
                  <div class="card-memo-text">${this.escapeHtml(m.memo)}</div>
                </div>` : ''}
            </div>
            <div class="card-footer">
              <div class="timestamp-display">
                <i class="fa-regular fa-clock"></i> ${this.settings.showExactTime ? '更新:' : '経過:'} ${timeDisplayStr}
              </div>
              <button class="btn-quick-edit" onclick="event.stopPropagation();app.openStatusModal('${m.id}')">
                <i class="fa-solid fa-pen"></i> 変更
              </button>
            </div>
          </div>`;
      }).join('');

      return `<div class="group-section">${headerHtml}<div class="cards-grid">${cardsHtml}</div></div>`;
    }).join('');

    this.bindDragEvents();
  }
  }

  // ⑦ カレンダー: 予定の曜日表示バグ修正
  renderCalendarUserOptions() {
    const select = document.getElementById('calendarUserSelect');
    if (!select) return;
    select.innerHTML = '<option value="ALL">全社員の予定を表示</option>' +
      this.members.map(m => `<option value="${m.id}">${m.name} (${m.dept})</option>`).join('');
  }

  renderCalendarView() {
    const grid = document.getElementById('calendarGrid');
    const title = document.getElementById('calendarTitle');
    const userSelect = document.getElementById('calendarUserSelect');
    if (!grid || !title) return;

    const year = this.calendarDate.getFullYear();
    const month = this.calendarDate.getMonth();
    title.textContent = `${year}年${month + 1}月`;

    const selectedUserId = userSelect ? userSelect.value : 'ALL';
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const today = new Date();

    let html = '';

    // 前月の埋め
    for (let i = firstDay - 1; i >= 0; i--) {
      html += `<div class="cal-day-cell other-month"><div class="cal-day-number">${daysInPrevMonth - i}</div></div>`;
    }

    // 当月
    for (let d = 1; d <= daysInMonth; d++) {
      // ⑦ ISOStringではなくローカル日付文字列で生成（タイムゾーンのズレを防止）
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const cellDateStr = `${year}-${mm}-${dd}`;
      const cellDateObj = new Date(year, month, d);
      const dayOfWeek = cellDateObj.getDay(); // 0=Sun, 1=Mon, ...
      const isToday = (today.getFullYear() === year && today.getMonth() === month && today.getDate() === d);

      const isSunday = dayOfWeek === 0;
      const isSaturday = dayOfWeek === 6;
      const dayClass = isSunday ? 'sunday' : isSaturday ? 'saturday' : '';

      let eventsHtml = '';

      const matchedSchedules = this.schedules.filter(s => {
        // ⑥ 複数人対応: memberIds配列をチェック
        const memberIds = s.memberIds || [s.memberId];
        const userMatch = (selectedUserId === 'ALL' || memberIds.includes(selectedUserId));
        if (!userMatch) return false;
        if (s.type === 'once' && s.date === cellDateStr) return true;
        if (s.type === 'weekly' && Number(s.dayOfWeek) === dayOfWeek) return true;
        return false;
      });

      matchedSchedules.forEach(sch => {
        const memberIds = sch.memberIds || [sch.memberId];
        let memberName = '';
        if (selectedUserId !== 'ALL') {
          const m = this.members.find(x => x.id === selectedUserId);
          memberName = m ? m.name.split(' ')[0] : '';
        } else if (memberIds.length === 1) {
          const m = this.members.find(x => x.id === memberIds[0]);
          memberName = m ? m.name.split(' ')[0] : '';
        } else {
          memberName = `${memberIds.length}名`;
        }

        const badgeClass = sch.type === 'weekly' ? 'cal-event-weekly' : 'cal-event-future';
        const icon = sch.type === 'weekly' ? '<i class="fa-solid fa-rotate-right"></i>' : '<i class="fa-solid fa-calendar-check"></i>';
        eventsHtml += `
          <div class="cal-event-pill ${badgeClass}" title="${memberName}: ${sch.title} (${sch.status})">
            ${icon} ${memberName ? memberName + ': ' : ''}${sch.title}
          </div>`;
      });

      if (isToday && matchedSchedules.length === 0 && selectedUserId !== 'ALL') {
        const u = this.members.find(m => m.id === selectedUserId);
        if (u) {
          const color = this.statusColors[u.status] || '#3b82f6';
          eventsHtml += `<div class="cal-event-pill" style="background-color:${color}">現在: ${u.status}</div>`;
        }
      }

      html += `
        <div class="cal-day-cell ${isToday ? 'today' : ''} ${dayClass}" onclick="app.quickAddScheduleForDate('${cellDateStr}')">
          <div class="cal-day-number">${d}</div>
          <div class="cal-events-list">${eventsHtml}</div>
        </div>`;
    }

    // 翌月埋め
    const totalCellsSoFar = firstDay + daysInMonth;
    const nextDays = (7 - (totalCellsSoFar % 7)) % 7;
    for (let n = 1; n <= nextDays; n++) {
      html += `<div class="cal-day-cell other-month"><div class="cal-day-number">${n}</div></div>`;
    }

    grid.innerHTML = html;
  }

  // --------------------------------------------------------------------------
  // 4. Modal: Status Update
  // --------------------------------------------------------------------------
  openStatusModal(memberId) {
    const member = this.members.find(m => m.id === memberId);
    if (!member) return;

    this.selectedMemberId = memberId;
    document.getElementById('modalMemberName').textContent = member.name;
    document.getElementById('modalMemberDept').textContent = `${member.dept}${member.role ? ' ' + member.role : ''}`;
    const extEl = document.getElementById('modalMemberExt');
    if (extEl) extEl.innerHTML = member.ext ? `<i class="fa-solid fa-phone"></i> 内線: ${member.ext}` : '';
    document.getElementById('modalMemberAvatar').src = member.avatar;

    const grid = document.getElementById('statusButtonsGrid');
    grid.innerHTML = DEFAULT_STATUSES.map(s => {
      const isSelected = member.status === s.name;
      const color = this.statusColors[s.name] || s.defaultColor;
      return `
        <button type="button"
          class="status-btn-choice ${isSelected ? 'active' : ''}"
          style="background-color:${color};"
          onclick="app.selectStatusInModal('${s.name}')">
          <i class="fa-solid ${s.icon}"></i>
          <span>${s.name}</span>
        </button>`;
    }).join('');

    document.getElementById('statusMessageInput').value = member.message || '';
    const memoCheckbox = document.getElementById('memoCheckbox');
    const memoContainer = document.getElementById('memoContainer');
    memoCheckbox.checked = !!member.hasMemo;
    memoContainer.classList.toggle('hidden', !member.hasMemo);
    document.getElementById('memoMessageInput').value = member.memo || '';

    // ① 複数名一括共有チェックボックスの描画・初期化
    this.renderStatusMembersCheckboxes(memberId);
    const multiChk = document.getElementById('statusMultiCheck');
    const multiContainer = document.getElementById('statusMultiMembersContainer');
    if (multiChk && multiContainer) {
      multiChk.checked = false;
      multiContainer.classList.add('hidden');
      multiChk.onchange = () => multiContainer.classList.toggle('hidden', !multiChk.checked);
    }

    document.getElementById('statusModal').classList.add('open');
  }

  renderStatusMembersCheckboxes(currentMemberId) {
    const container = document.getElementById('statusAdditionalMembers');
    if (!container) return;
    container.innerHTML = this.members.filter(m => m.id !== currentMemberId).map(m => `
      <label class="multi-member-check-label">
        <input type="checkbox" class="statusMemberChk" value="${m.id}">
        <span>${m.name} (${m.dept})</span>
      </label>`).join('');
  }

  selectStatusInModal(statusName) {
    document.querySelectorAll('.status-btn-choice').forEach(btn => {
      btn.classList.toggle('active', btn.querySelector('span').textContent.trim() === statusName);
    });
  }

  saveStatusUpdate() {
    if (!this.selectedMemberId) return;
    const member = this.members.find(m => m.id === this.selectedMemberId);
    if (!member) return;

    const activeBtn = document.querySelector('.status-btn-choice.active');
    if (!activeBtn) { alert('ステータスを1つ選択してください'); return; }

    const newStatus = activeBtn.querySelector('span').textContent.trim();
    const newMessage = document.getElementById('statusMessageInput').value.trim();
    const hasMemo = document.getElementById('memoCheckbox').checked;
    const newMemo = hasMemo ? document.getElementById('memoMessageInput').value.trim() : '';

    const oldStatus = member.status;
    const nowIso = new Date().toISOString();
    member.status = newStatus;
    member.message = newMessage;
    member.hasMemo = hasMemo;
    member.memo = newMemo;
    member.lastUpdated = nowIso;

    const newLog = {
      id: 'l_' + Date.now(), timestamp: nowIso,
      memberName: member.name, dept: member.dept,
      oldStatus, newStatus, message: newMessage, memo: newMemo, type: 'manual'
    };
    this.logs.unshift(newLog);

    this.saveStorage('imadoko_members', this.members);
    this.saveStorage('imadoko_logs', this.logs);

    // Supabaseへの非同期保存
    this.upsertMemberToSupabase(member);
    this.saveLogToSupabase(newLog);

    // ① 複数名一括送信処理
    const multiChk = document.getElementById('statusMultiCheck');
    let updatedNames = [member.name];

    if (multiChk && multiChk.checked) {
      const selectedChks = document.querySelectorAll('.statusMemberChk:checked');
      selectedChks.forEach(chk => {
        const extraMem = this.members.find(m => m.id === chk.value);
        if (extraMem) {
          const oldSt = extraMem.status;
          extraMem.status = newStatus;
          extraMem.message = newMessage;
          extraMem.hasMemo = hasMemo;
          extraMem.memo = newMemo;
          extraMem.lastUpdated = nowIso;
          updatedNames.push(extraMem.name);

          const extraLog = {
            id: 'l_' + Date.now() + '_' + extraMem.id,
            timestamp: nowIso,
            memberName: extraMem.name,
            dept: extraMem.dept,
            oldStatus: oldSt,
            newStatus,
            message: newMessage,
            memo: newMemo,
            type: 'manual'
          };
          this.logs.unshift(extraLog);
          this.upsertMemberToSupabase(extraMem);
          this.saveLogToSupabase(extraLog);
        }
      });
      this.saveStorage('imadoko_members', this.members);
      this.saveStorage('imadoko_logs', this.logs);
    }

    document.getElementById('statusModal').classList.remove('open');
    this.renderStatsBar();
    this.renderCurrentView();
    const noticeText = updatedNames.length > 1
      ? `【一括更新完了】${updatedNames.join('、')} さんのステータスを「${newStatus}」に変更しました。`
      : `【更新完了】${member.name} さんのステータスを「${newStatus}」に変更しました。`;
    this.showNoticeBanner(noticeText);
  }

  // ③ 部署内ドラッグ＆ドロップイベントバインド
  bindDragEvents() {
    let draggedId = null;
    let draggedDept = null;

    document.querySelectorAll('[draggable="true"]').forEach(el => {
      el.addEventListener('dragstart', (e) => {
        draggedId = el.getAttribute('data-id');
        draggedDept = el.getAttribute('data-dept');
        el.classList.add('dragging');
        if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
      });

      el.addEventListener('dragend', () => {
        el.classList.remove('dragging');
        document.querySelectorAll('.drag-over').forEach(x => x.classList.remove('drag-over'));
      });

      el.addEventListener('dragover', (e) => {
        e.preventDefault();
        const targetDept = el.getAttribute('data-dept');
        if (targetDept === draggedDept && el.getAttribute('data-id') !== draggedId) {
          el.classList.add('drag-over');
          if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
        }
      });

      el.addEventListener('dragleave', () => {
        el.classList.remove('drag-over');
      });

      el.addEventListener('drop', (e) => {
        e.preventDefault();
        el.classList.remove('drag-over');
        const targetId = el.getAttribute('data-id');
        const targetDept = el.getAttribute('data-dept');

        if (draggedDept === targetDept && draggedId && targetId && draggedId !== targetId) {
          const draggedIdx = this.members.findIndex(m => m.id === draggedId);
          const targetIdx = this.members.findIndex(m => m.id === targetId);

          if (draggedIdx !== -1 && targetIdx !== -1) {
            const [movedItem] = this.members.splice(draggedIdx, 1);
            this.members.splice(targetIdx, 0, movedItem);
            this.saveStorage('imadoko_members', this.members);
            this.renderCurrentView();
            this.members.forEach(m => this.upsertMemberToSupabase(m));
          }
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. Settings Modal
  // --------------------------------------------------------------------------
  openSettingsModal() {
    document.getElementById('toggleShowExactTime').checked = this.settings.showExactTime;
    document.getElementById('toggleAutoCron').checked = this.settings.autoCron;

    const container = document.getElementById('colorSettingsList');
    container.innerHTML = DEFAULT_STATUSES.map(s => {
      const currentColor = this.statusColors[s.name] || s.defaultColor;
      return `
        <div class="color-picker-item">
          <span><i class="fa-solid ${s.icon}"></i> ${s.name}</span>
          <input type="color" data-status="${s.name}" value="${currentColor}">
        </div>`;
    }).join('');

    document.getElementById('settingsModal').classList.add('open');
  }

  saveSettings() {
    this.settings.showExactTime = document.getElementById('toggleShowExactTime').checked;
    this.settings.autoCron = document.getElementById('toggleAutoCron').checked;

    document.querySelectorAll('.color-picker-item input[type="color"]').forEach(p => {
      this.statusColors[p.getAttribute('data-status')] = p.value;
    });

    this.saveStorage('imadoko_local_settings', this.settings);
    this.saveStorage('imadoko_colors', this.statusColors);
    this.applyStatusColorsToCSS();
    document.getElementById('settingsModal').classList.remove('open');
    this.renderStatsBar();
    this.renderCurrentView();
    this.showNoticeBanner('設定を保存しました（当端末ブラウザ固有）。');
  }

  resetDefaultColors() {
    this.statusColors = this.getDefaultColors();
    this.saveStorage('imadoko_colors', this.statusColors);
    this.applyStatusColorsToCSS();
    this.openSettingsModal();
  }

  // --------------------------------------------------------------------------
  // 6. Member Management CRUD
  // --------------------------------------------------------------------------
  openMemberModal() {
    this.renderMemberListTable();
    document.getElementById('memberModal').classList.add('open');
    // ③ 社員一覧は折り畳み状態で開く
    const listSection = document.getElementById('memberListSection');
    if (listSection) listSection.classList.add('collapsed');
    const toggleBtn = document.getElementById('toggleMemberListBtn');
    if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-chevron-down"></i> 登録中の社員一覧を表示';
  }

  renderMemberListTable() {
    const tbody = document.getElementById('memberListTableBody');
    const countText = document.getElementById('memberCountText');
    if (countText) countText.textContent = this.members.length;
    if (!tbody) return;

    tbody.innerHTML = this.members.map(m => `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:0.5rem;">
            <img class="avatar-md" src="${m.avatar}" onerror="this.src='https://via.placeholder.com/150'">
            <strong>${m.name}</strong>
          </div>
        </td>
        <td>${m.ext ? `<span class="ext-badge"><i class="fa-solid fa-phone"></i> ${m.ext}</span>` : '-'}</td>
        <td>${m.dept}</td>
        <td>${m.role || '-'}</td>
        <td>${m.email}</td>
        <td>
          <button class="btn btn-secondary" style="padding:0.2rem 0.5rem;font-size:0.75rem;" onclick="app.editMember('${m.id}')">編集</button>
          <button class="btn btn-danger-outline" style="padding:0.2rem 0.5rem;font-size:0.75rem;" onclick="app.deleteMember('${m.id}')">削除</button>
        </td>
      </tr>`).join('');
  }

  handleSaveMember(e) {
    e.preventDefault();
    const editId = document.getElementById('memberEditId').value;
    const name = document.getElementById('memberInputName').value.trim();
    const dept = document.getElementById('memberInputDept').value.trim();
    const ext = document.getElementById('memberInputExt').value.trim();
    const role = document.getElementById('memberInputRole').value.trim();
    const email = document.getElementById('memberInputEmail').value.trim();
    let avatar = document.getElementById('memberInputAvatar').value.trim();
    if (!avatar) avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

    let targetMember = null;
    if (editId) {
      targetMember = this.members.find(x => x.id === editId);
      if (targetMember) Object.assign(targetMember, { name, dept, ext, role, email, avatar });
    } else {
      targetMember = {
        id: 'm_' + Date.now(), name, dept, ext, role, email, avatar,
        status: '退勤', message: '', hasMemo: false, memo: '',
        lastUpdated: new Date().toISOString()
      };
      this.members.push(targetMember);
    }

    this.saveStorage('imadoko_members', this.members);
    if (targetMember) this.upsertMemberToSupabase(targetMember);

    this.resetMemberForm();
    this.renderMemberListTable();
    this.renderDeptFilterOptions();
    this.renderStatsBar();
    this.renderCurrentView();
    this.renderCalendarUserOptions();
  }

  editMember(id) {
    const m = this.members.find(x => x.id === id);
    if (!m) return;
    document.getElementById('memberEditId').value = m.id;
    document.getElementById('memberInputName').value = m.name;
    document.getElementById('memberInputDept').value = m.dept;
    document.getElementById('memberInputExt').value = m.ext || '';
    document.getElementById('memberInputRole').value = m.role || '';
    document.getElementById('memberInputEmail').value = m.email;
    document.getElementById('memberInputAvatar').value = m.avatar || '';
    document.getElementById('saveMemberFormBtn').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> 更新内容を保存';
    document.getElementById('cancelMemberEditBtn').classList.remove('hidden');
  }



  resetMemberForm() {
    document.getElementById('addMemberForm').reset();
    document.getElementById('memberEditId').value = '';
    document.getElementById('saveMemberFormBtn').innerHTML = '<i class="fa-solid fa-plus"></i> メンバーを追加 / 更新';
    document.getElementById('cancelMemberEditBtn').classList.add('hidden');
  }

  // --------------------------------------------------------------------------
  // 7. Calendar Schedule Management (⑥ 複数人対応 / ⑦ 曜日バグ修正)
  // --------------------------------------------------------------------------
  openScheduleModal() {
    const memberSelect = document.getElementById('scheduleMemberSelect');
    if (memberSelect) {
      memberSelect.innerHTML = this.members.map(m => `<option value="${m.id}">${m.name} (${m.dept})</option>`).join('');
    }
    // ⑥ 複数人チェックボックス用のメンバーリスト構築
    this.renderScheduleMembersCheckboxes();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    document.getElementById('scheduleDateInput').value = todayStr;
    this.updateScheduleDayOfWeekDisplay(todayStr);
    this.renderScheduleListTable();
    document.getElementById('scheduleModal').classList.add('open');
  }

  // ⑥ 複数人チェックボックスリスト描画
  renderScheduleMembersCheckboxes() {
    const container = document.getElementById('scheduleAdditionalMembers');
    if (!container) return;
    container.innerHTML = this.members.map(m => `
      <label class="multi-member-check-label">
        <input type="checkbox" class="schMemberChk" value="${m.id}">
        <span>${m.name} (${m.dept})</span>
      </label>`).join('');
  }

  renderStatusOptionsInScheduleModal() {
    const select = document.getElementById('scheduleStatusSelect');
    if (!select) return;
    select.innerHTML = DEFAULT_STATUSES.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
  }

  quickAddScheduleForDate(dateStr) {
    this.openScheduleModal();
    document.getElementById('scheduleTypeSelect').value = 'once';
    document.getElementById('singleDateGroup').classList.remove('hidden');
    document.getElementById('weeklyDayGroup').classList.add('hidden');
    document.getElementById('scheduleDateInput').value = dateStr;
    this.updateScheduleDayOfWeekDisplay(dateStr);
  }

  // ② カレンダー日付選択時の曜日リアルタイム表示（タイムゾーンズレ防止）
  updateScheduleDayOfWeekDisplay(dateStr) {
    const el = document.getElementById('scheduleDayOfWeekDisplay');
    if (!el || !dateStr) { if (el) el.textContent = ''; return; }
    const dayNames = ['(日)', '(月)', '(火)', '(水)', '(木)', '(金)', '(土)'];
    const [y, mo, da] = dateStr.split('-').map(Number);
    const dow = new Date(y, mo - 1, da).getDay();
    const colors = ['#ef4444','#0f172a','#0f172a','#0f172a','#0f172a','#0f172a','#3b82f6'];
    el.textContent = dayNames[dow];
    el.style.color = colors[dow];
  }

  renderScheduleListTable() {
    const tbody = document.getElementById('scheduleListTableBody');
    if (!tbody) return;

    if (this.schedules.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:1rem;color:var(--text-muted);">予定はまだ登録されていません</td></tr>`;
      return;
    }

    const daysMap = ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'];

    tbody.innerHTML = this.schedules.map(s => {
      const memberIds = s.memberIds || [s.memberId];
      const memberNames = memberIds.map(id => {
        const m = this.members.find(x => x.id === id);
        return m ? m.name : '不明';
      }).join('、');
      const typeStr = s.type === 'weekly' ? '<span class="badge-dept" style="background:#e0f2fe;color:#0369a1;">毎週定例</span>' : '<span class="badge-dept">単発指定</span>';
      // ⑦ 曜日表示: dateから正しく曜日を導出
      let timeRuleStr = '-';
      if (s.type === 'weekly') {
        timeRuleStr = daysMap[Number(s.dayOfWeek)];
      } else if (s.date) {
        // ⑦ 正しい曜日計算
        const [y, mo, da] = s.date.split('-').map(Number);
        const dow = new Date(y, mo - 1, da).getDay();
        timeRuleStr = `${s.date} (${daysMap[dow]})`;
      }

      return `
        <tr>
          <td><strong>${memberNames}</strong></td>
          <td>${typeStr}</td>
          <td>${timeRuleStr}</td>
          <td><span class="badge-dept">${s.status}</span></td>
          <td>${this.escapeHtml(s.title)}</td>
          <td><button class="btn btn-danger-outline" style="padding:0.15rem 0.45rem;font-size:0.75rem;" onclick="app.deleteSchedule('${s.id}')">削除</button></td>
        </tr>`;
    }).join('');
  }

  saveSchedule() {
    const mainMemberId = document.getElementById('scheduleMemberSelect').value;
    const type = document.getElementById('scheduleTypeSelect').value;
    const date = document.getElementById('scheduleDateInput').value;
    const dayOfWeek = document.getElementById('scheduleDayOfWeekSelect').value;
    const status = document.getElementById('scheduleStatusSelect').value;
    const title = document.getElementById('scheduleTitleInput').value.trim();

    if (!title) { alert('予定のタイトルを入力してください'); return; }

    // ⑥ 複数人 : チェックされた追加メンバーIDを収集
    const multiEnabled = document.getElementById('scheduleMultiCheck') && document.getElementById('scheduleMultiCheck').checked;
    let memberIds = [mainMemberId];
    if (multiEnabled) {
      document.querySelectorAll('.schMemberChk:checked').forEach(chk => {
        if (!memberIds.includes(chk.value)) memberIds.push(chk.value);
      });
    }

    const newSchedule = {
      id: 'sch_' + Date.now(),
      memberId: mainMemberId,
      memberIds,
      type,
      date: type === 'once' ? date : null,
      dayOfWeek: type === 'weekly' ? Number(dayOfWeek) : null,
      status,
      title
    };

    this.schedules.push(newSchedule);
    this.saveStorage('imadoko_schedules', this.schedules);
    this.renderScheduleListTable();
    this.renderCalendarView();
    document.getElementById('scheduleTitleInput').value = '';
    if (multiEnabled) {
      document.querySelectorAll('.schMemberChk').forEach(chk => chk.checked = false);
    }

    this.showNoticeBanner(`予定「${title}」を${memberIds.length}名分登録しました。`);
  }

  deleteSchedule(id) {
    this.schedules = this.schedules.filter(s => s.id !== id);
    this.saveStorage('imadoko_schedules', this.schedules);
    this.renderScheduleListTable();
    this.renderCalendarView();
  }

  // --------------------------------------------------------------------------
  // 8. Simulators & Cron Logic
  // --------------------------------------------------------------------------
  runSimulation1015() {
    const targetMembers = this.members.filter(m => m.status === '退勤');
    const nowStr = new Date().toLocaleTimeString('ja-JP');
    this.simLogs.unshift(`[${nowStr}] --- 午前10:15 「退勤」確認メール送信判定を開始 ---`);
    if (targetMembers.length === 0) {
      this.simLogs.unshift(`[${nowStr}] 判定結果: 現在「退勤」状態の社員はいません。`);
    } else {
      targetMembers.forEach(m => {
        this.simLogs.unshift(`[${nowStr}] ✉ 送信 → ${m.name} <${m.email}> 【ImaDoko】状況確認のお願い`);
      });
      this.simLogs.unshift(`[${nowStr}] 合計 ${targetMembers.length} 名へ確認メールをリクエストしました。`);
    }
    this.renderSimLogs();
    this.showNoticeBanner(`10:15確認メール処理完了: 対象${targetMembers.length}名`);
  }

  runSimulation0000() {
    const nowStr = new Date().toLocaleTimeString('ja-JP');
    const allowedStatuses = ['退勤','直行','直行・直帰','休み'];
    this.simLogs.unshift(`[${nowStr}] --- 午前0:00 ステータス自動リセット ---`);
    let resetCount = 0;
    this.members.forEach(m => {
      if (!allowedStatuses.includes(m.status)) {
        const old = m.status;
        m.status = '退勤';
        m.message = '（0:00 自動リセット）';
        m.lastUpdated = new Date().toISOString();
        resetCount++;
        this.simLogs.unshift(`[${nowStr}] ${m.name}: [${old}] → [退勤]`);
      }
    });
    if (resetCount === 0) {
      this.simLogs.unshift(`[${nowStr}] リセット対象なし。`);
    } else {
      this.simLogs.unshift(`[${nowStr}] ${resetCount} 名を「退勤」に変更しました。`);
      this.saveStorage('imadoko_members', this.members);
      this.renderStatsBar();
      this.renderCurrentView();
    }
    this.renderSimLogs();
    this.showNoticeBanner(`0:00自動リセット完了: ${resetCount}名`);
  }

  renderSimLogs() {
    const box = document.getElementById('simLogBox');
    if (!box) return;
    box.innerHTML = this.simLogs.length
      ? this.simLogs.map(l => `<div class="sim-log-item">${this.escapeHtml(l)}</div>`).join('')
      : '<p class="empty-log">シミュレーションを実行すると結果がここに表示されます。</p>';
  }

  setupAutoCronChecks() {
    setInterval(() => {
      if (!this.settings.autoCron) return;
      const now = new Date();
      const h = now.getHours(), min = now.getMinutes();
      if (h === 10 && min === 15) {
        if (!this.hasRun1015Today) { this.runSimulation1015(); this.hasRun1015Today = true; }
      } else { this.hasRun1015Today = false; }
      if (h === 0 && min === 0) {
        if (!this.hasRun0000Today) { this.runSimulation0000(); this.hasRun0000Today = true; }
      } else { this.hasRun0000Today = false; }
    }, 30000);
  }

  // ⑧ 平日10:15のスナップショットログ自動取得
  setupDailyLogCapture() {
    setInterval(() => {
      if (!this.settings.autoCron) return;
      const now = new Date();
      const h = now.getHours(), min = now.getMinutes();
      const dayOfWeek = now.getDay(); // 0=日, 6=土
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
      if (h === 10 && min === 15 && isWeekday) {
        if (!this.hasSnapshotToday) {
          this.captureStatusSnapshot();
          this.hasSnapshotToday = true;
        }
      } else {
        this.hasSnapshotToday = false;
      }
    }, 30000);
  }

  captureStatusSnapshot() {
    const nowIso = new Date().toISOString();
    this.members.forEach(m => {
      this.logs.unshift({
        id: 'snap_' + Date.now() + '_' + m.id,
        timestamp: nowIso,
        memberName: m.name,
        dept: m.dept,
        oldStatus: '-',
        newStatus: m.status,
        message: m.message || '',
        memo: m.memo || '',
        type: 'snapshot_1015'
      });
    });
    this.saveStorage('imadoko_logs', this.logs);
    this.showNoticeBanner(`10:15 全社員スナップショットログを保存しました (${this.members.length}名)`);
  }

  // --------------------------------------------------------------------------
  // 9. Logs & CSV Export
  // --------------------------------------------------------------------------
  openLogsModal() {
    this.renderLogTable();
    document.getElementById('logsModal').classList.add('open');
  }

  renderLogTable() {
    const tbody = document.getElementById('logTableBody');
    const filterText = (document.getElementById('logSearchInput').value || '').toLowerCase();
    if (!tbody) return;

    const filteredLogs = this.logs.filter(l => {
      if (!filterText) return true;
      return [l.memberName, l.dept, l.newStatus, l.message, l.memo]
        .some(v => v && v.toLowerCase().includes(filterText));
    });

    if (filteredLogs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:1.5rem;">ログがありません</td></tr>`;
      return;
    }

    tbody.innerHTML = filteredLogs.map(l => {
      const typeLabel = l.type === 'snapshot_1015'
        ? '<span class="badge-dept" style="background:#e0f2fe;color:#0369a1;">10:15スナップ</span>'
        : '<span class="badge-dept">手動変更</span>';
      return `
        <tr>
          <td style="font-size:0.8rem;font-weight:600;">${new Date(l.timestamp).toLocaleString('ja-JP')}</td>
          <td>${typeLabel}</td>
          <td><strong>${l.memberName}</strong></td>
          <td>${l.dept}</td>
          <td><span style="color:var(--text-muted);">${l.oldStatus}</span></td>
          <td><strong style="color:var(--primary-color);">${l.newStatus}</strong></td>
          <td style="font-size:0.8rem;">
            ${l.message ? '💬 ' + this.escapeHtml(l.message) : ''}
            ${l.memo ? `<br>📌 ${this.escapeHtml(l.memo)}` : ''}
          </td>
        </tr>`;
    }).join('');
  }

  exportLogsToCSV() {
    if (this.logs.length === 0) { alert('出力するログがありません'); return; }
    const headers = ['日時','種別','社員名','部署','変更前ステータス','変更後ステータス','メッセージ','伝言'];
    const rows = this.logs.map(l => [
      `"${new Date(l.timestamp).toLocaleString('ja-JP')}"`,
      `"${l.type === 'snapshot_1015' ? '10:15スナップ' : '手動変更'}"`,
      `"${l.memberName}"`, `"${l.dept}"`, `"${l.oldStatus}"`, `"${l.newStatus}"`,
      `"${(l.message||'').replace(/"/g,'""')}"`, `"${(l.memo||'').replace(/"/g,'""')}"`
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ImaDoko_Logs_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    this.showNoticeBanner('CSV (Excel形式) をダウンロードしました。');
  }

  clearLogs() {
    if (!confirm('全ての行動ログを消去しますか？')) return;
    this.logs = [];
    this.saveStorage('imadoko_logs', this.logs);
    this.renderLogTable();
  }

  // --------------------------------------------------------------------------
  // 10. Event Binding
  // --------------------------------------------------------------------------
  bindEvents() {
    // View switch
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-view');
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.view-pane').forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        document.getElementById(`${view}View`).classList.add('active');
        this.currentView = view;
        this.renderCurrentView();
      });
    });

    // ② グループモード
    document.getElementById('groupModeSelect').addEventListener('change', (e) => {
      this.groupMode = e.target.value;
      this.renderCurrentView();
    });

    document.getElementById('searchInput').addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.renderCurrentView();
    });

    document.getElementById('deptFilter').addEventListener('change', (e) => {
      this.deptFilter = e.target.value;
      this.renderCurrentView();
    });

    // Status Modal
    document.getElementById('closeStatusModal').addEventListener('click', () => {
      document.getElementById('statusModal').classList.remove('open');
    });
    document.getElementById('cancelStatusModal').addEventListener('click', () => {
      document.getElementById('statusModal').classList.remove('open');
    });
    document.getElementById('saveStatusBtn').addEventListener('click', () => this.saveStatusUpdate());
    document.getElementById('memoCheckbox').addEventListener('change', (e) => {
      document.getElementById('memoContainer').classList.toggle('hidden', !e.target.checked);
    });

    // Settings Modal
    document.getElementById('btnSettings').addEventListener('click', () => this.openSettingsModal());
    document.getElementById('closeSettingsModal').addEventListener('click', () => {
      document.getElementById('settingsModal').classList.remove('open');
    });
    document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveSettings());
    document.getElementById('resetColorsBtn').addEventListener('click', () => this.resetDefaultColors());

    // Member Modal
    document.getElementById('btnManageMembers').addEventListener('click', () => this.openMemberModal());
    document.getElementById('closeMemberModal').addEventListener('click', () => {
      document.getElementById('memberModal').classList.remove('open');
    });
    document.getElementById('addMemberForm').addEventListener('submit', (e) => this.handleSaveMember(e));
    document.getElementById('cancelMemberEditBtn').addEventListener('click', () => this.resetMemberForm());

    // ③ 社員一覧折り畳みトグル
    const toggleBtn = document.getElementById('toggleMemberListBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const section = document.getElementById('memberListSection');
        const collapsed = section.classList.toggle('collapsed');
        toggleBtn.innerHTML = collapsed
          ? '<i class="fa-solid fa-chevron-down"></i> 登録中の社員一覧を表示'
          : '<i class="fa-solid fa-chevron-up"></i> 登録中の社員一覧を折り畳む';
      });
    }

    // Schedule Modal
    document.getElementById('btnAddScheduleBtn').addEventListener('click', () => this.openScheduleModal());
    document.getElementById('closeScheduleModal').addEventListener('click', () => {
      document.getElementById('scheduleModal').classList.remove('open');
    });
    document.getElementById('cancelScheduleModal').addEventListener('click', () => {
      document.getElementById('scheduleModal').classList.remove('open');
    });
    document.getElementById('saveScheduleBtn').addEventListener('click', () => this.saveSchedule());

    document.getElementById('scheduleTypeSelect').addEventListener('change', (e) => {
      const isWeekly = e.target.value === 'weekly';
      document.getElementById('singleDateGroup').classList.toggle('hidden', isWeekly);
      document.getElementById('weeklyDayGroup').classList.toggle('hidden', !isWeekly);
    });

    // ② 日付選択時に曜日をリアルタイム表示
    document.getElementById('scheduleDateInput').addEventListener('change', (e) => {
      this.updateScheduleDayOfWeekDisplay(e.target.value);
    });

    // ⑥ 複数人チェックボックス表示/非表示
    const multiCheck = document.getElementById('scheduleMultiCheck');
    if (multiCheck) {
      multiCheck.addEventListener('change', (e) => {
        const container = document.getElementById('additionalMembersContainer');
        if (container) container.classList.toggle('hidden', !e.target.checked);
      });
    }

    // Auto Simulate
    document.getElementById('btnAutoSimulate').addEventListener('click', () => {
      document.getElementById('autoSimModal').classList.add('open');
    });
    document.getElementById('closeAutoSimModal').addEventListener('click', () => {
      document.getElementById('autoSimModal').classList.remove('open');
    });
    document.getElementById('runSim1015').addEventListener('click', () => this.runSimulation1015());
    document.getElementById('runSim0000').addEventListener('click', () => this.runSimulation0000());

    // Logs Modal
    document.getElementById('btnLogs').addEventListener('click', () => this.openLogsModal());
    document.getElementById('closeLogsModal').addEventListener('click', () => {
      document.getElementById('logsModal').classList.remove('open');
    });
    document.getElementById('logSearchInput').addEventListener('input', () => this.renderLogTable());
    document.getElementById('exportCsvBtn').addEventListener('click', () => this.exportLogsToCSV());
    document.getElementById('clearLogsBtn').addEventListener('click', () => this.clearLogs());

    // Calendar
    document.getElementById('prevMonthBtn').addEventListener('click', () => {
      this.calendarDate.setMonth(this.calendarDate.getMonth() - 1);
      this.renderCalendarView();
    });
    document.getElementById('nextMonthBtn').addEventListener('click', () => {
      this.calendarDate.setMonth(this.calendarDate.getMonth() + 1);
      this.renderCalendarView();
    });
    document.getElementById('todayCalBtn').addEventListener('click', () => {
      this.calendarDate = new Date();
      this.renderCalendarView();
    });
    document.getElementById('calendarUserSelect').addEventListener('change', () => this.renderCalendarView());
  }

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------
  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
              .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }

  showNoticeBanner(msg) {
    const banner = document.getElementById('noticeBanner');
    const text = document.getElementById('noticeText');
    if (banner && text) {
      text.textContent = msg;
      banner.classList.remove('hidden');
    }
  }
}

let app;
document.addEventListener('DOMContentLoaded', () => { app = new ImaDokoApp(); });
