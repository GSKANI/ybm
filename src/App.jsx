import { useState, useEffect } from "react";

const initialDrivers = [
  { id:'DRV-0087', name:'Rajesh Kumar', initials:'RK', bg:'var(--accent2-dim)', fg:'var(--accent2)', license:'TN01 20210022650', category:'HMV', exp:'12 yrs', status:'active', score:96, noc:'none', dob:'1988-03-14', phone:'+91 98765 43210', expiry:'2041-07-01', rto:'Chennai RTO', cat:'HMV, HGMV', currExp:'3y 2m', km:'4,80,000 km' },
  { id:'DRV-0042', name:'Priya Nair', initials:'PN', bg:'var(--accent-dim)', fg:'var(--accent)', license:'KL04 20220018874', category:'LMV', exp:'7 yrs', status:'active', score:99, noc:'approved', dob:'1992-06-22', phone:'+91 94456 77821', expiry:'2042-03-14', rto:'Thiruvananthapuram RTO', cat:'LMV', currExp:'1y 8m', km:'1,20,000 km' },
  { id:'DRV-0019', name:'Vikram Singh', initials:'VS', bg:'var(--danger-dim)', fg:'var(--danger)', license:'MH02 20180034521', category:'HMV', exp:'15 yrs', status:'flagged', score:72, noc:'pending', dob:'1984-09-03', phone:'+91 91234 56789', expiry:'2038-12-10', rto:'Mumbai RTO', cat:'HMV, HGMV', currExp:'4y 0m', km:'7,20,000 km' },
  { id:'DRV-0033', name:'Anand Rajan', initials:'AR', bg:'var(--accent3-dim)', fg:'var(--accent3)', license:'TN38 20190045231', category:'HMV', exp:'9 yrs', status:'active', score:88, noc:'rejected', dob:'1990-11-15', phone:'+91 87654 32198', expiry:'2026-04-25', rto:'Chennai RTO', cat:'HMV', currExp:'2y 5m', km:'3,10,000 km' },
  { id:'DRV-0055', name:'Sunita Pillai', initials:'SP', bg:'var(--accent-dim)', fg:'var(--accent)', license:'KL09 20170031182', category:'LMV', exp:'11 yrs', status:'active', score:91, noc:'none', dob:'1987-02-28', phone:'+91 99887 76655', expiry:'2026-05-09', rto:'Ernakulam RTO', cat:'LMV', currExp:'2y 1m', km:'2,40,000 km' },
  { id:'DRV-0061', name:'Meena Devi', initials:'MD', bg:'var(--purple-dim)', fg:'var(--purple)', license:'TN05 20200028831', category:'LMV', exp:'6 yrs', status:'active', score:94, noc:'pending', dob:'1995-07-10', phone:'+91 76543 21098', expiry:'2040-08-18', rto:'Coimbatore RTO', cat:'LMV', currExp:'1y 3m', km:'95,000 km' },
];

const initialNocRequests = [
  { id: 'NOC-001', driverId: 'DRV-0042', requestingCompany: 'Chennai Logistics Ltd.', purpose: 'Employment Transfer', submitted: '2026-04-08', status: 'Approved' },
  { id: 'NOC-002', driverId: 'DRV-0019', requestingCompany: 'South Star Transports', purpose: 'Loan Verification', submitted: '2026-04-09', status: 'Pending' },
  { id: 'NOC-003', driverId: 'DRV-0087', requestingCompany: 'National Freight Corp.', purpose: 'Background Check', submitted: '2026-04-10', status: 'Pending' },
  { id: 'NOC-004', driverId: 'DRV-0033', requestingCompany: 'Tamil Nadu SRTC', purpose: 'Employment Transfer', submitted: '2026-04-05', status: 'Rejected' },
  { id: 'NOC-005', driverId: 'DRV-0061', requestingCompany: 'Express Cargo India', purpose: 'Employment Transfer', submitted: '2026-04-11', status: 'Pending' },
];

export default function App() {
  const [view, setView] = useState("dashboard");
  const [toastMsg, setToastMsg] = useState(null);
  const [showToastTrigger, setShowToastTrigger] = useState(0);

  const [drivers, setDrivers] = useState(initialDrivers);
  const [nocRequests, setNocRequests] = useState(initialNocRequests);
  const [auditLog, setAuditLog] = useState([
    { id: 5, action: "Employment record updated — Meena Devi", user: "by HR Manager Preethi", module: "Employment", time: "Yesterday 4:12 PM", color: "var(--purple)", bg: "var(--purple-dim)" },
    { id: 4, action: "Safety incident logged — Vikram Singh", user: "by Safety Officer Ravi", module: "Safety", time: "Yesterday 6:30 PM", color: "var(--danger)", bg: "var(--danger-dim)" },
    { id: 3, action: "License expiry alert sent — Anand Rajan", user: "by System (Automated)", module: "Licenses", time: "Today 08:00 AM", color: "var(--accent3)", bg: "var(--accent3-dim)" },
    { id: 2, action: "NOC approved — Priya Nair", user: "by Admin Sharma", module: "NOC", time: "Today 09:15 AM", color: "var(--accent2)", bg: "var(--accent2-dim)" },
    { id: 1, action: "Driver record created — Rajesh Kumar", user: "by Admin Sharma", module: "Drivers", time: "Today 10:42 AM", color: "var(--accent)", bg: "var(--accent-dim)" }
  ]);

  const [profileModalDriver, setProfileModalDriver] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalDriver, setEditModalDriver] = useState(null);
  const [newNocModalOpen, setNewNocModalOpen] = useState(false);
  const [viewNocData, setViewNocData] = useState(null);
  const [settingsTabActive, setSettingsTabActive] = useState("general");

  const showToast = (msg) => {
    setToastMsg(msg);
    setShowToastTrigger(prev => prev + 1);
    setTimeout(() => setToastMsg(""), 2800);
  };

  const addAudit = (action, module, color, bg) => {
    setAuditLog(prev => [{ id: Date.now(), action, user: "by Admin Sharma", module, time: "Just now", color, bg }, ...prev]);
  };

  const updateNocStatus = (id, newStatus) => {
    setNocRequests(prev => prev.map(n => n.id === id ? { ...n, status: newStatus } : n));
    const noc = nocRequests.find(n => n.id === id);
    const drv = drivers.find(d => d.id === noc.driverId);
    if(drv) {
      setDrivers(prev => prev.map(d => d.id === drv.id ? { ...d, noc: newStatus.toLowerCase() } : d));
      addAudit(`NOC ${newStatus.toLowerCase()} — ${drv.name}`, 'NOC', 'var(--accent2)', 'var(--accent2-dim)');
    }
  };

  const addDriver = (driver) => {
    setDrivers(p => [driver, ...p]);
    addAudit(`Driver record created — ${driver.name}`, 'Drivers', 'var(--accent)', 'var(--accent-dim)');
  };

  const updateDriver = (updatedDriver) => {
    setDrivers(p => p.map(d => d.id === updatedDriver.id ? updatedDriver : d));
    addAudit(`Driver record updated — ${updatedDriver.name}`, 'Drivers', 'var(--accent)', 'var(--accent-dim)');
  };

  const deleteDriver = (id) => {
    const drv = drivers.find(d => d.id === id);
    if (drv) {
      setDrivers(p => p.filter(d => d.id !== id));
      addAudit(`Driver record deleted — ${drv.name}`, 'Drivers', 'var(--danger)', 'var(--danger-dim)');
    }
  };

  const addNocRequest = (noc) => {
    setNocRequests(p => [noc, ...p]);
    setDrivers(p => p.map(d => d.id === noc.driverId ? { ...d, noc: 'pending' } : d));
    const drv = drivers.find(d => d.id === noc.driverId);
    addAudit(`NOC request submitted — ${drv?.name || noc.driverId}`, 'NOC', 'var(--accent2)', 'var(--accent2-dim)');
  };

  const navItemClass = (id) => `nav-item ${view === id ? "active" : ""}`;

  return (
    <>
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-mark">Fleet<em>Axis</em></div>
          <div className="logo-sub">Driver Records System</div>
        </div>
        <nav className="nav">
          <div className="nav-section">Main</div>
          <div className={navItemClass("dashboard")} onClick={() => setView("dashboard")}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1.5" strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1.5" strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1.5" strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1.5" strokeWidth="1.8"/></svg>
            Dashboard
          </div>
          <div className={navItemClass("drivers")} onClick={() => setView("drivers")}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="8" r="4" strokeWidth="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeWidth="1.8"/></svg>
            Drivers
          </div>
          <div className={navItemClass("noc")} onClick={() => setView("noc")}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4M7 3H5a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-2" strokeWidth="1.8"/><path d="M9 3h6v4H9V3z" strokeWidth="1.8"/></svg>
            NOC Requests
            <span className="nav-badge">{nocRequests.filter(n => n.status === 'Pending').length}</span>
          </div>
          <div className={navItemClass("licenses")} onClick={() => setView("licenses")}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="2" y="7" width="20" height="14" rx="2" strokeWidth="1.8"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" strokeWidth="1.8"/></svg>
            License Management
          </div>
          <div className={navItemClass("safety")} onClick={() => setView("safety")}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="1.8"/></svg>
            Safety Records
          </div>

          <div className="nav-section">Management</div>
          <div className={navItemClass("employment")} onClick={() => setView("employment")}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="2" y="7" width="20" height="14" rx="2" strokeWidth="1.8"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M8 12h8M8 16h5" strokeWidth="1.8"/></svg>
            Employment History
          </div>
          <div className={navItemClass("reports")} onClick={() => setView("reports")}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17v-2m3 2v-4m3 4v-6M3 21h18M5 21V7l7-4 7 4v14" strokeWidth="1.8"/></svg>
            Reports
          </div>
          <div className={navItemClass("audit")} onClick={() => setView("audit")}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="1.8"/></svg>
            Audit Log
          </div>

          <div className="nav-section">System</div>
          <div className={navItemClass("settings")} onClick={() => setView("settings")}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="3" strokeWidth="1.8"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeWidth="1.8"/></svg>
            Settings
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="avatar">AS</div>
            <div>
              <div className="user-name">Admin Sharma</div>
              <div className="user-role">Fleet Manager</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        {view === "dashboard" && <DashboardPage setAddModalOpen={setAddModalOpen} setView={setView} drivers={drivers} nocRequests={nocRequests} auditLog={auditLog} />}
        {view === "drivers" && <DriversPage showToast={showToast} setAddModalOpen={setAddModalOpen} setProfileModalDriver={setProfileModalDriver} drivers={drivers} setNewNocModalOpen={setNewNocModalOpen} setEditModalDriver={setEditModalDriver} deleteDriver={deleteDriver} />}
        {view === "noc" && <NOCPage showToast={showToast} setNewNocModalOpen={setNewNocModalOpen} setViewNocData={setViewNocData} nocRequests={nocRequests} drivers={drivers} updateNocStatus={updateNocStatus} />}
        {view === "licenses" && <LicensesPage showToast={showToast} drivers={drivers} />}
        {view === "safety" && <SafetyPage showToast={showToast} />}
        {view === "employment" && <EmploymentPage showToast={showToast} drivers={drivers} setProfileModalDriver={setProfileModalDriver} />}
        {view === "reports" && <ReportsPage showToast={showToast} />}
        {view === "audit" && <AuditPage showToast={showToast} auditLog={auditLog} />}
        {view === "settings" && <SettingsPage showToast={showToast} activeTab={settingsTabActive} setTab={setSettingsTabActive} />}
      </main>

      <ProfileModal driver={profileModalDriver} onClose={() => setProfileModalDriver(null)} />
      <AddDriverModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} showToast={showToast} addDriver={addDriver} driversLength={drivers.length} />
      <EditDriverModal driver={editModalDriver} onClose={() => setEditModalDriver(null)} showToast={showToast} updateDriver={updateDriver} />
      <NewNOCModal isOpen={newNocModalOpen} onClose={() => setNewNocModalOpen(false)} showToast={showToast} drivers={drivers} addNocRequest={addNocRequest} nocLength={nocRequests.length} />
      <ViewNOCModal data={viewNocData} onClose={() => setViewNocData(null)} showToast={showToast} updateNocStatus={updateNocStatus} />

      {toastMsg && (
        <div className="toast" key={showToastTrigger}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4M7 3H5a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-2" strokeWidth="2"/><path d="M9 3h6v4H9V3z" strokeWidth="2"/></svg>
          {toastMsg}
        </div>
      )}
    </>
  );
}

function DashboardPage({ setAddModalOpen, setView, drivers, nocRequests, auditLog }) {
  const activeCount = drivers.filter(d => d.status === 'active').length;
  const pendingNoc = nocRequests.filter(n => n.status === 'Pending').length;
  const expringCount = drivers.filter(d => {
    const diff = (new Date(d.expiry) - new Date()) / (1000*60*60*24);
    return diff > 0 && diff < 60;
  }).length;

  return (
    <div className="page-view active">
      <div className="topbar">
        <div className="page-title">Dashboard</div>
        <div className="topbar-actions">
          <div className="search-box">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8" strokeWidth="2"/><path d="M21 21l-4.35-4.35" strokeWidth="2"/></svg>
            <input type="text" placeholder="Search drivers, IDs…" onChange={(e) => { if(e.target.value.length > 2) { setView('drivers'); } }} />
          </div>
          <button className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 5v14M5 12h14" strokeWidth="2.5"/></svg>
            Add Driver
          </button>
        </div>
      </div>
      <div className="content">
        <div className="stats-row">
          <div className="stat-card c-green"><div className="stat-glow"></div><div className="stat-icon c-green"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="8" r="4" strokeWidth="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeWidth="2"/></svg></div><div className="stat-value">{activeCount}</div><div className="stat-label">Active Drivers</div><div className="stat-delta delta-up">↑ 12 this month</div></div>
          <div className="stat-card c-blue" onClick={() => setView('noc')} style={{cursor:'pointer'}}><div className="stat-glow"></div><div className="stat-icon c-blue"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4M7 3H5a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-2" strokeWidth="2"/><path d="M9 3h6v4H9V3z" strokeWidth="2"/></svg></div><div className="stat-value">{pendingNoc}</div><div className="stat-label">Pending NOC</div><div className="stat-delta delta-up">{pendingNoc} new requests</div></div>
          <div className="stat-card c-amber" onClick={() => setView('licenses')} style={{cursor:'pointer'}}><div className="stat-glow"></div><div className="stat-icon c-amber"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeWidth="2"/></svg></div><div className="stat-value">{expringCount}</div><div className="stat-label">License Expiring</div><div className="stat-delta delta-warn">Within 60 days</div></div>
          <div className="stat-card c-red" onClick={() => setView('safety')} style={{cursor:'pointer'}}><div className="stat-glow"></div><div className="stat-icon c-red"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2"/><path d="M12 8v4M12 16h.01" strokeWidth="2"/></svg></div><div className="stat-value">{drivers.filter(d => d.score < 80).length}</div><div className="stat-label">Safety Alerts</div><div className="stat-delta delta-down">↓ Needs attention</div></div>
        </div>
        <div className="grid-2">
          <div className="panel">
            <div className="panel-head"><span className="panel-title">Recent Activity</span><span className="badge badge-green">Live</span></div>
            <div className="panel-body">
              <div className="timeline">
                {auditLog.slice(0, 5).map(log => (
                  <div className="tl-item" key={log.id}>
                    <div className="tl-dot" style={{background: log.bg || 'var(--surface2)', color: log.color}}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg></div>
                    <div className="tl-line"></div>
                    <div>
                      <div className="tl-title">{log.action}</div>
                      <div className="tl-meta">{log.user} · {log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div className="panel">
              <div className="panel-head"><span className="panel-title">License Expiry Tracker</span><button className="btn btn-ghost" style={{padding:'5px 12px',fontSize:12}} onClick={() => setView('licenses')}>View All</button></div>
              <div className="panel-body">
                <div className="expiry-list">
                  {drivers.map(d => ({ ...d, days: Math.floor((new Date(d.expiry) - new Date()) / (1000*60*60*24)) }))
                    .filter(d => d.days > 0)
                    .sort((a,b) => a.days - b.days).slice(0, 5).map(d => (
                    <div className="expiry-item" key={d.id}>
                      <div className="expiry-name">{d.name}</div>
                      <div className="expiry-bar"><div className="expiry-fill" style={{width:`${Math.max(5, Math.min(100, (d.days/365)*100))}%`,background: d.days > 60 ? 'var(--accent)' : (d.days > 30 ? 'var(--accent3)' : 'var(--danger)')}}></div></div>
                      <div className="expiry-days" style={{color: d.days < 30 ? 'var(--danger)' : d.days < 60 ? 'var(--accent3)' : 'var(--text)'}}>{d.days}d</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-head"><span className="panel-title">Compliance Overview</span></div>
              <div className="panel-body">
                <div style={{display:'flex',gap:20,alignItems:'center'}}>
                  <div style={{textAlign:'center',flexShrink:0}}>
                    <div style={{fontFamily:'var(--heading-font)',fontSize:38,fontWeight:700,color:'var(--accent)',fontStyle:'italic'}}>94%</div>
                    <div style={{fontSize:12,color:'var(--text3)',fontWeight:600}}>Overall Score</div>
                  </div>
                  <div style={{flex:1,display:'flex',flexDirection:'column',gap:12}}>
                    <div><div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:5,fontWeight:600}}><span>License Valid</span><span style={{color:'var(--accent)'}}>{drivers.length-expringCount}/{drivers.length}</span></div><div className="progress-bar"><div className="progress-fill" style={{width:`${((drivers.length-expringCount)/drivers.length)*100}%`,background:'var(--accent)'}}></div></div></div>
                    <div><div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:5,fontWeight:600}}><span>Verified Records</span><span style={{color:'var(--accent2)'}}>{drivers.length-1}/{drivers.length}</span></div><div className="progress-bar"><div className="progress-fill" style={{width:'89%',background:'var(--accent2)'}}></div></div></div>
                    <div><div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:5,fontWeight:600}}><span>Safety Cleared</span><span style={{color:'var(--accent3)'}}>{drivers.filter(d=>d.score>80).length}/{drivers.length}</span></div><div className="progress-bar"><div className="progress-fill" style={{width:'97%',background:'var(--accent3)'}}></div></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DriversPage({ showToast, setAddModalOpen, setProfileModalDriver, drivers, setNewNocModalOpen, setEditModalDriver, deleteDriver }) {
  const [activeTab, setActiveTab] = useState('All Drivers');
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = drivers.filter(d => {
    if (activeTab === 'Active' && d.status !== 'active') return false;
    if (activeTab === 'Inactive' && d.status !== 'inactive') return false;
    if (activeTab === 'Flagged' && d.status !== 'flagged') return false;
    if (activeFilter === 'Heavy Vehicle' && !d.category.includes('HMV')) return false;
    if (activeFilter === 'Light Vehicle' && !d.category.includes('LMV')) return false;
    if (activeFilter === 'License Expiring') {
      const days = (new Date(d.expiry) - new Date()) / (1000*60*60*24);
      if (days < 0 || days > 60) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (!d.name.toLowerCase().includes(q) && !d.id.toLowerCase().includes(q) && !d.phone.includes(q) && !d.license.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="page-view active">
      <div className="topbar">
        <div className="page-title">Driver Records</div>
        <div className="topbar-actions">
          <div className="search-box">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8" strokeWidth="2"/><path d="M21 21l-4.35-4.35" strokeWidth="2"/></svg>
            <input type="text" placeholder="Search name, DL, phone…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-ghost" onClick={() => { setSearch(''); setActiveFilter('All'); setActiveTab('All Drivers'); }}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 4h18M7 12h10M11 20h2" strokeWidth="2"/></svg>Clear Filters</button>
          <button className="btn btn-primary" onClick={() => setAddModalOpen(true)}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 5v14M5 12h14" strokeWidth="2.5"/></svg>Add Driver</button>
        </div>
      </div>
      <div className="content">
        <div className="tabs">
          {['All Drivers', 'Active', 'Inactive', 'Flagged'].map(t => (
            <div key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t}</div>
          ))}
        </div>
        <div className="filter-bar">
          <span style={{fontSize:12,color:'var(--text3)',fontWeight:600}}>Filter:</span>
          {['All', 'Heavy Vehicle', 'Light Vehicle', 'Hazmat', 'License Expiring'].map(f => (
            <div key={f} className={`filter-chip ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</div>
          ))}
          <div style={{marginLeft:'auto',fontSize:12,color:'var(--text3)',fontWeight:600}}>{filtered.length} drivers</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Driver</th><th>License No.</th><th>Category</th><th>Experience</th><th>Status</th><th>Pending Case</th><th>Route</th><th>Safety Score</th><th>NOC</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(d => {
                const sb = d.status==='active'?'badge-green':d.status==='flagged'?'badge-red':'badge-gray';
                const st = d.status.charAt(0).toUpperCase()+d.status.slice(1);
                const sc = d.score>=90?'var(--accent)':d.score>=75?'var(--accent3)':'var(--danger)';
                const nb = d.noc==='approved'?'badge-green':d.noc==='pending'?'badge-amber':d.noc==='rejected'?'badge-red':'badge-gray';
                const nt = d.noc==='none'?'None':d.noc.charAt(0).toUpperCase()+d.noc.slice(1);

                return (
                  <tr key={d.id} onClick={() => setProfileModalDriver(d)}>
                    <td><div className="driver-cell"><div className="driver-avatar" style={{background:d.bg,color:d.fg}}>{d.initials}</div><div><div className="driver-name">{d.name}</div><div className="driver-id">{d.id}</div></div></div></td>
                    <td className="mono" style={{fontSize:12}}>{d.license}</td>
                    <td><span className={d.category.includes('HMV') ? "badge badge-blue" : "badge badge-green"}>{d.category}</span></td>
                    <td>{d.exp}</td>
                    <td><span className={`badge ${sb}`}>{st}</span></td>
                    <td><span className={d.casePending === 'Yes' ? 'badge badge-red' : 'badge badge-gray'}>{d.casePending || 'No'}</span></td>
                    <td><div style={{fontSize: 12}}>{d.routeFrom && d.routeTo ? <>{d.routeFrom} <br/><span style={{color:'var(--text3)'}}>to</span> {d.routeTo}</> : <span style={{color:'var(--text3)'}}>-</span>}</div></td>
                    <td><span style={{fontWeight:700,color:sc,fontFamily:'var(--heading-font)',fontSize:16}}>{d.score}</span><span style={{color:'var(--text3)',fontSize:11}}>/100</span></td>
                    <td><span className={`badge ${nb}`}>{nt}</span></td>
                    <td><div className="action-btns">
                      <div className="icon-btn" title="View Profile"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2"/><circle cx="12" cy="12" r="3" strokeWidth="2"/></svg></div>
                      <div className="icon-btn" title="Edit" onClick={(e) => { e.stopPropagation(); setEditModalDriver(d); }}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" strokeWidth="2"/><path d="M17.586 3.586a2 2 0 112.828 2.828L12 14l-4 1 1-4 8.586-8.414z" strokeWidth="2"/></svg></div>
                      <div className="icon-btn" title="NOC" onClick={(e) => { e.stopPropagation(); setNewNocModalOpen(true); }}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4M7 3H5a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-2" strokeWidth="2"/><path d="M9 3h6v4H9V3z" strokeWidth="2"/></svg></div>
                      <div className="icon-btn" title="Delete" onClick={(e) => { e.stopPropagation(); if(confirm(`Are you sure you want to delete ${d.name}?`)){ deleteDriver(d.id); showToast('Driver deleted'); } }}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2"/></svg></div>
                    </div></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan="10" style={{textAlign:'center',color:'var(--text3)',padding:'30px'}}>No drivers found matching criteria.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <button style={{position:'fixed',bottom:40,right:40,width:46,height:46,borderRadius:'50%',background:'var(--accent)',color:'#000',border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:'0 4px 14px rgba(0,229,184,0.3)',zIndex:90}} onClick={() => document.documentElement.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })} title="Scroll to Bottom">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="22" height="22"><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeWidth="2.5"/></svg>
      </button>
    </div>
  );
}

function NOCPage({ showToast, setNewNocModalOpen, setViewNocData, nocRequests, drivers, updateNocStatus }) {
  const enrichedNocs = nocRequests.map(noc => ({
    ...noc,
    driver: drivers.find(d => d.id === noc.driverId) || { name: 'Unknown', id: noc.driverId, initials: '?', bg: 'var(--surface2)', fg: 'var(--text)' }
  }));

  const pending = nocRequests.filter(n => n.status === 'Pending').length;
  const approved = nocRequests.filter(n => n.status === 'Approved').length;
  const rejected = nocRequests.filter(n => n.status === 'Rejected').length;

  return (
    <div className="page-view active">
      <div className="topbar">
        <div className="page-title">NOC Requests</div>
        <div className="topbar-actions">
          <button className="btn btn-ghost" onClick={() => showToast('Exporting data...')}>Export</button>
          <button className="btn btn-primary" onClick={() => setNewNocModalOpen(true)}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 5v14M5 12h14" strokeWidth="2.5"/></svg>New NOC</button>
        </div>
      </div>
      <div className="content">
        <div className="stats-row">
          <div className="stat-card c-blue"><div className="stat-glow"></div><div className="stat-icon c-blue"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path d="M12 6v6l4 2" strokeWidth="2"/></svg></div><div className="stat-value">{pending}</div><div className="stat-label">Pending Review</div></div>
          <div className="stat-card c-green"><div className="stat-glow"></div><div className="stat-icon c-green"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4" strokeWidth="2"/></svg></div><div className="stat-value">{approved}</div><div className="stat-label">Approved</div></div>
          <div className="stat-card c-amber"><div className="stat-glow"></div><div className="stat-icon c-amber"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeWidth="2"/></svg></div><div className="stat-value">{rejected}</div><div className="stat-label">Rejected</div></div>
          <div className="stat-card c-green"><div className="stat-glow"></div><div className="stat-icon c-green"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path d="M9 12l2 2 4-4" strokeWidth="2"/></svg></div><div className="stat-value">1.2d</div><div className="stat-label">Avg. Processing</div></div>
        </div>
        <div className="table-wrap">
          <div className="table-header"><span className="panel-title">All NOC Requests</span><span className="table-count">{nocRequests.length} total</span></div>
          <table>
            <thead><tr><th>Driver</th><th>Requesting Company</th><th>Purpose</th><th>Submitted</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {enrichedNocs.map(noc => {
                const badgeClass = noc.status === 'Approved' ? 'badge-green' : noc.status === 'Pending' ? 'badge-amber' : 'badge-red';
                return (
                  <tr key={noc.id}>
                    <td><div className="driver-cell"><div className="driver-avatar" style={{background:noc.driver.bg,color:noc.driver.fg}}>{noc.driver.initials}</div><div><div className="driver-name">{noc.driver.name}</div><div className="driver-id">{noc.driver.id}</div></div></div></td>
                    <td>{noc.requestingCompany}</td>
                    <td>{noc.purpose}</td>
                    <td className="mono" style={{fontSize:12}}>{noc.submitted}</td>
                    <td><span className={`badge ${badgeClass}`}>{noc.status}</span></td>
                    <td>
                      <div className="action-btns">
                        <div className="icon-btn" title="View Details" onClick={() => setViewNocData(noc)}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2"/><circle cx="12" cy="12" r="3" strokeWidth="2"/></svg></div>
                        {noc.status === 'Pending' && (
                          <>
                            <div className="icon-btn" title="Approve" onClick={() => { updateNocStatus(noc.id, 'Approved'); showToast(`NOC approved for ${noc.driver.name}`); }}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4" strokeWidth="2"/></svg></div>
                            <div className="icon-btn" title="Reject" onClick={() => { updateNocStatus(noc.id, 'Rejected'); showToast(`NOC rejected for ${noc.driver.name}`); }}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" strokeWidth="2"/></svg></div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {enrichedNocs.length === 0 && <tr><td colSpan="6" style={{textAlign:'center',color:'var(--text3)',padding:'30px'}}>No NOC requests found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LicensesPage({ showToast, drivers }) {
  const [activeTab, setActiveTab] = useState('All Licenses');
  
  const filtered = drivers.filter(d => {
    const days = (new Date(d.expiry) - new Date()) / (1000*60*60*24);
    if (activeTab === 'Expiring Soon' && (days <= 0 || days > 60)) return false;
    if (activeTab === 'Expired' && days > 0) return false;
    if (activeTab === 'Suspended' && d.status !== 'flagged') return false; 
    return true;
  });

  return (
    <div className="page-view active">
      <div className="topbar">
        <div className="page-title">License Management</div>
        <div className="topbar-actions">
          <button className="btn btn-ghost" onClick={() => showToast('Bulk alerts sent to expiring drivers')}>Send Bulk Alerts</button>
          <button className="btn btn-primary" onClick={() => showToast('Exporting license report…')}>Export Report</button>
        </div>
      </div>
      <div className="content">
        <div className="tabs">
          {['All Licenses', 'Expiring Soon', 'Expired', 'Suspended'].map(t => (
            <div key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t}</div>
          ))}
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Driver</th><th>License No.</th><th>Category</th><th>Issued By</th><th>Expiry Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(d => {
                const days = (new Date(d.expiry) - new Date()) / (1000*60*60*24);
                let st = 'Valid', cls = 'badge-green';
                if (days < 0) { st = 'Expired'; cls = 'badge-red'; }
                else if (days < 60) { st = 'Expiring soon'; cls = 'badge-amber'; }
                return (
                  <tr key={d.id}>
                    <td><div className="driver-cell"><div className="driver-avatar" style={{background:d.bg,color:d.fg}}>{d.initials}</div><div><div className="driver-name">{d.name}</div><div className="driver-id">{d.id}</div></div></div></td>
                    <td className="mono" style={{fontSize:12}}>{d.license}</td>
                    <td><span className={d.category.includes('HMV') ? "badge badge-blue" : "badge badge-green"}>{d.category}</span></td>
                    <td>{d.rto}</td>
                    <td className="mono" style={{fontSize:12, color: days < 60 ? 'inherit' : 'var(--text)'}}>{d.expiry}</td>
                    <td><span className={`badge ${cls}`}>{st}</span></td>
                    <td><div className="action-btns"><div className="icon-btn" onClick={() => showToast(`Renewal reminder sent to ${d.name}`)}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth="2"/></svg></div></div></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan="7" style={{textAlign:'center',color:'var(--text3)',padding:'30px'}}>No licenses matched the criteria.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SafetyPage({ showToast }) {
  return (
    <div className="page-view active">
      <div className="topbar">
        <div className="page-title">Safety Records</div>
        <div className="topbar-actions">
          <button className="btn btn-ghost" onClick={() => showToast('Report downloaded')}>Download Report</button>
          <button className="btn btn-primary" onClick={() => showToast('Incident logging form opened')}>Log Incident</button>
        </div>
      </div>
      <div className="content">
        <div className="safety-grid" style={{marginBottom:22}}>
          <div className="safety-card"><div className="score-ring"><svg viewBox="0 0 80 80" width="80" height="80"><circle className="ring-bg" cx="40" cy="40" r="32"/><circle className="ring-fill" cx="40" cy="40" r="32" stroke="var(--accent)" strokeDasharray="201" strokeDashoffset="12"/></svg><div className="score-text"><div className="score-num" style={{color:'var(--accent)'}}>94</div><div className="score-sub">/100</div></div></div><div className="safety-label">Overall Fleet Score</div></div>
          <div className="safety-card"><div className="score-ring"><svg viewBox="0 0 80 80" width="80" height="80"><circle className="ring-bg" cx="40" cy="40" r="32"/><circle className="ring-fill" cx="40" cy="40" r="32" stroke="var(--accent2)" strokeDasharray="201" strokeDashoffset="50"/></svg><div className="score-text"><div className="score-num" style={{color:'var(--accent2)'}}>75</div><div className="score-sub">/100</div></div></div><div className="safety-label">Incident-Free Score</div></div>
          <div className="safety-card"><div className="score-ring"><svg viewBox="0 0 80 80" width="80" height="80"><circle className="ring-bg" cx="40" cy="40" r="32"/><circle className="ring-fill" cx="40" cy="40" r="32" stroke="var(--accent3)" strokeDasharray="201" strokeDashoffset="16"/></svg><div className="score-text"><div className="score-num" style={{color:'var(--accent3)'}}>92</div><div className="score-sub">/100</div></div></div><div className="safety-label">Compliance Rate</div></div>
          <div className="safety-card"><div style={{fontFamily:'var(--heading-font)',fontSize:38,fontWeight:700,color:'var(--danger)',fontStyle:'italic'}}>3</div><div className="safety-label">Active Alerts</div></div>
        </div>
        <div className="table-wrap">
          <div className="table-header"><span className="panel-title">Incident Log</span><span className="table-count">17 incidents YTD</span></div>
          <table>
            <thead><tr><th>Driver</th><th>Incident Type</th><th>Location</th><th>Date</th><th>Severity</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td><div className="driver-cell"><div className="driver-avatar" style={{background:'var(--accent2-dim)',color:'var(--accent2)'}}>VS</div><div><div className="driver-name">Vikram Singh</div></div></div></td><td>Minor Collision</td><td>NH-45, Chennai</td><td className="mono" style={{fontSize:12}}>Apr 11, 2026</td><td><span className="badge badge-amber">Medium</span></td><td><span className="badge badge-blue">Under Review</span></td></tr>
              <tr><td><div className="driver-cell"><div className="driver-avatar" style={{background:'var(--danger-dim)',color:'var(--danger)'}}>KB</div><div><div className="driver-name">Karthik Babu</div></div></div></td><td>Speeding Violation</td><td>OMR, Sholinganallur</td><td className="mono" style={{fontSize:12}}>Apr 9, 2026</td><td><span className="badge badge-red">High</span></td><td><span className="badge badge-amber">Pending Action</span></td></tr>
              <tr><td><div className="driver-cell"><div className="driver-avatar" style={{background:'var(--accent-dim)',color:'var(--accent)'}}>MS</div><div><div className="driver-name">Murugan S.</div></div></div></td><td>Signal Violation</td><td>Tambaram Junction</td><td className="mono" style={{fontSize:12}}>Apr 6, 2026</td><td><span className="badge badge-gray">Low</span></td><td><span className="badge badge-green">Resolved</span></td></tr>
              <tr><td><div className="driver-cell"><div className="driver-avatar" style={{background:'var(--accent3-dim)',color:'var(--accent3)'}}>DR</div><div><div className="driver-name">Deepa Rao</div></div></div></td><td>Vehicle Breakdown</td><td>GST Road, Guindy</td><td className="mono" style={{fontSize:12}}>Mar 28, 2026</td><td><span className="badge badge-gray">Low</span></td><td><span className="badge badge-green">Resolved</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EmploymentPage({ showToast, drivers, setProfileModalDriver }) {
  const [filter, setFilter] = useState('All');

  const openProfile = (id) => {
    const drv = drivers.find(d => d.id === id);
    if(drv) setProfileModalDriver(drv);
    else showToast("Driver record not found!");
  };

  return (
    <div className="page-view active">
      <div className="topbar">
        <div className="page-title">Employment History</div>
        <div className="topbar-actions">
          <div className="search-box"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8" strokeWidth="2"/><path d="M21 21l-4.35-4.35" strokeWidth="2"/></svg><input type="text" placeholder="Search driver or company…" /></div>
          <button className="btn btn-ghost" onClick={() => showToast('Employment report exported')}>Export</button>
          <button className="btn btn-primary" onClick={() => showToast('Add employment record form opened')}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 5v14M5 12h14" strokeWidth="2.5"/></svg>Add Record</button>
        </div>
      </div>
      <div className="content">
        <div className="stats-row" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <div className="stat-card c-green" style={{cursor:'pointer', borderColor: filter==='Current'?'var(--accent)':'var(--border)'}} onClick={() => setFilter(filter==='Current'?'All':'Current')}><div className="stat-glow"></div><div className="stat-icon c-green"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="2" y="7" width="20" height="14" rx="2" strokeWidth="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" strokeWidth="2"/></svg></div><div className="stat-value">248</div><div className="stat-label">Current Employees</div><div className="stat-delta delta-up">↑ 12 this month</div></div>
          <div className="stat-card c-red" style={{cursor:'pointer', borderColor: filter==='Previous'?'var(--danger)':'var(--border)'}} onClick={() => setFilter(filter==='Previous'?'All':'Previous')}><div className="stat-glow"></div><div className="stat-icon c-red"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeWidth="2"/></svg></div><div className="stat-value">11</div><div className="stat-label">Exits This Month</div><div className="stat-delta delta-down">↑ 3 vs last month</div></div>
        </div>
        <div className="grid-auto">
          {(filter === 'All' || filter === 'Current') && (
          <div className="emp-card" onClick={() => openProfile('DRV-0087')} style={{cursor:'pointer'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div><div className="emp-company">FleetAxis Transport</div><div className="emp-driver">Rajesh Kumar · DRV-0087</div><div className="emp-period">Jan 2021 – Present</div></div>
              <span className="badge badge-green">Current</span>
            </div>
            <div className="emp-tags"><span className="badge badge-blue">HMV</span><span className="badge badge-purple">Grade A</span></div>
            <div className="emp-stats">
              <div><div className="emp-stat-label">Duration</div><div className="emp-stat-value">3y 2m</div></div>
              <div><div className="emp-stat-label">KM Logged</div><div className="emp-stat-value">1,45,000</div></div>
              <div><div className="emp-stat-label">Incidents</div><div className="emp-stat-value" style={{color:'var(--accent)'}}>0</div></div>
              <div><div className="emp-stat-label">Perf. Score</div><div className="emp-stat-value" style={{color:'var(--accent)'}}>96/100</div></div>
            </div>
          </div>
          )}

          {(filter === 'All' || filter === 'Previous') && (
          <div className="emp-card" onClick={() => openProfile('DRV-0087')} style={{cursor:'pointer'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div><div className="emp-company">Star Transport Co.</div><div className="emp-driver">Rajesh Kumar · DRV-0087</div><div className="emp-period">Apr 2017 – Dec 2020</div></div>
              <span className="badge badge-gray">Exit</span>
            </div>
            <div className="emp-tags"><span className="badge badge-blue">HMV</span><span className="badge badge-amber">Senior Driver</span></div>
            <div className="emp-stats">
              <div><div className="emp-stat-label">Duration</div><div className="emp-stat-value">3y 8m</div></div>
              <div><div className="emp-stat-label">KM Logged</div><div className="emp-stat-value">2,10,000</div></div>
              <div><div className="emp-stat-label">Incidents</div><div className="emp-stat-value" style={{color:'var(--accent3)'}}>1</div></div>
              <div><div className="emp-stat-label">Perf. Score</div><div className="emp-stat-value">88/100</div></div>
            </div>
          </div>
          )}

          {(filter === 'All' || filter === 'Current') && (
          <div className="emp-card" onClick={() => openProfile('DRV-0042')} style={{cursor:'pointer'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div><div className="emp-company">FleetAxis Transport</div><div className="emp-driver">Priya Nair · DRV-0042</div><div className="emp-period">Aug 2024 – Present</div></div>
              <span className="badge badge-green">Current</span>
            </div>
            <div className="emp-tags"><span className="badge badge-amber">LMV</span><span className="badge badge-green">Grade A+</span></div>
            <div className="emp-stats">
              <div><div className="emp-stat-label">Duration</div><div className="emp-stat-value">1y 8m</div></div>
              <div><div className="emp-stat-label">KM Logged</div><div className="emp-stat-value">48,000</div></div>
              <div><div className="emp-stat-label">Incidents</div><div className="emp-stat-value" style={{color:'var(--accent)'}}>0</div></div>
              <div><div className="emp-stat-label">Perf. Score</div><div className="emp-stat-value" style={{color:'var(--accent)'}}>99/100</div></div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReportsPage({ showToast }) {
  return (
    <div className="page-view active">
      <div className="topbar">
        <div className="page-title">Reports</div>
        <div className="topbar-actions">
          <button className="btn btn-ghost" onClick={() => showToast('Report scheduled')}>Schedule Report</button>
          <button className="btn btn-primary" onClick={() => showToast('Custom report builder opened')}>Build Custom Report</button>
        </div>
      </div>
      <div className="content">
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
          <div className="report-card" onClick={() => showToast('Generating Fleet Overview Report…')}>
            <div className="report-icon" style={{background:'var(--accent-dim)',color:'var(--accent)'}}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17v-2m3 2v-4m3 4v-6M3 21h18M5 21V7l7-4 7 4v14" strokeWidth="2"/></svg></div>
            <div className="report-name">Fleet Overview</div>
            <div className="report-desc">Complete driver roster, statuses, categories and compliance snapshot.</div>
            <div className="report-meta"><span className="report-date">Last run: Apr 10, 2026</span><span className="badge badge-green">Ready</span></div>
          </div>
          <div className="report-card" onClick={() => showToast('Generating NOC Summary Report…')}>
            <div className="report-icon" style={{background:'var(--accent2-dim)',color:'var(--accent2)'}}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4M7 3H5a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-2" strokeWidth="2"/><path d="M9 3h6v4H9V3z" strokeWidth="2"/></svg></div>
            <div className="report-name">NOC Summary</div>
            <div className="report-desc">All NOC requests — pending, approved, rejected — with company details.</div>
            <div className="report-meta"><span className="report-date">Last run: Apr 9, 2026</span><span className="badge badge-green">Ready</span></div>
          </div>
          <div className="report-card" onClick={() => showToast('Generating License Expiry Report…')}>
            <div className="report-icon" style={{background:'var(--accent3-dim)',color:'var(--accent3)'}}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="2" y="7" width="20" height="14" rx="2" strokeWidth="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" strokeWidth="2"/></svg></div>
            <div className="report-name">License Expiry</div>
            <div className="report-desc">Drivers with licenses expiring in the next 30, 60, and 90 days.</div>
            <div className="report-meta"><span className="report-date">Last run: Apr 11, 2026</span><span className="badge badge-amber">Scheduled</span></div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><span className="panel-title">Scheduled Reports</span></div>
          <table>
            <thead><tr><th>Report</th><th>Frequency</th><th>Recipients</th><th>Next Run</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              <tr><td><strong>License Expiry Alert</strong></td><td>Weekly</td><td>admin@fleetaxis.com, hr@fleetaxis.com</td><td className="mono" style={{fontSize:12}}>Apr 14, 2026</td><td><span className="badge badge-green">Active</span></td><td><div className="action-btns"><div className="icon-btn" onClick={() => showToast('Schedule edited')}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" strokeWidth="2"/><path d="M17.586 3.586a2 2 0 112.828 2.828L12 14l-4 1 1-4 8.586-8.414z" strokeWidth="2"/></svg></div><div className="icon-btn" onClick={() => showToast('Schedule paused')}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" strokeWidth="2"/><rect x="14" y="4" width="4" height="16" rx="1" strokeWidth="2"/></svg></div></div></td></tr>
              <tr><td><strong>Compliance Audit</strong></td><td>Monthly</td><td>admin@fleetaxis.com</td><td className="mono" style={{fontSize:12}}>May 1, 2026</td><td><span className="badge badge-green">Active</span></td><td><div className="action-btns"><div className="icon-btn" onClick={() => showToast('Schedule edited')}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" strokeWidth="2"/><path d="M17.586 3.586a2 2 0 112.828 2.828L12 14l-4 1 1-4 8.586-8.414z" strokeWidth="2"/></svg></div><div className="icon-btn" onClick={() => showToast('Schedule paused')}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" strokeWidth="2"/><rect x="14" y="4" width="4" height="16" rx="1" strokeWidth="2"/></svg></div></div></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AuditPage({ showToast, auditLog }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = auditLog.filter(l => {
    if (activeFilter !== 'All' && l.module !== activeFilter && l.module + 's' !== activeFilter) return false;
    if (search && !l.action.toLowerCase().includes(search.toLowerCase()) && !l.user.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="page-view active">
      <div className="topbar">
        <div className="page-title">Audit Log</div>
        <div className="topbar-actions">
          <div className="search-box"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8" strokeWidth="2"/><path d="M21 21l-4.35-4.35" strokeWidth="2"/></svg><input type="text" placeholder="Search actions, users…" value={search} onChange={e=>setSearch(e.target.value)} /></div>
          <button className="btn btn-ghost" onClick={() => showToast('Audit log exported')}>Export Log</button>
        </div>
      </div>
      <div className="content">
        <div className="filter-bar">
          <span style={{fontSize:12,color:'var(--text3)',fontWeight:600}}>Filter:</span>
          {['All', 'Drivers', 'NOC', 'Licenses', 'Settings', 'Safety'].map(f => (
            <div key={f} className={`filter-chip ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</div>
          ))}
        </div>
        <div className="table-wrap">
          <div className="table-header"><span className="panel-title">System Audit Trail</span><span className="table-count">{filtered.length} entries</span></div>
          <div>
            {filtered.map(log => (
              <div className="audit-row" key={log.id}>
                <div className="audit-dot" style={{background: log.color}}></div>
                <div><div className="audit-action">{log.action}</div><div className="audit-user">{log.user}</div></div>
                <div style={{marginLeft:10}}><span className="audit-module" style={{background: log.bg || 'var(--surface3)', color: log.color || 'var(--text)'}}>{log.module}</span></div>
                <div className="audit-time">{log.time}</div>
              </div>
            ))}
            {filtered.length === 0 && <div style={{padding:'30px', textAlign:'center', color:'var(--text3)'}}>No matching logs found.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsPage({ showToast, activeTab, setTab }) {
  const [toggles, setToggles] = useState({
    dark: true, compact: false, autoApprove: false, mgrSignoff: true,
    emailConfirm: true, blockNoc: true, licWarn: true, nocReq: true,
    safetyInc: true, newDr: false, weekDig: true, sarathi: true, vahan: true,
    sms: true, razorpay: false, digilocker: false, tfa: true, sso: false,
    ipWhite: false, encrypt: true, mask: true, auditRef: true
  });

  const toggle = (key) => setToggles(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="page-view active">
      <div className="topbar">
        <div className="page-title">Settings</div>
        <div className="topbar-actions">
          <button className="btn btn-ghost" onClick={()=>showToast('Changes discarded')}>Discard Changes</button>
          <button className="btn btn-primary" onClick={() => showToast('Settings saved successfully')}>Save Changes</button>
        </div>
      </div>
      <div className="content">
        <div className="tabs">
          {['general', 'notifications', 'users', 'integrations', 'security'].map(t => (
            <div key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </div>
          ))}
        </div>

        {activeTab === 'general' && (
          <div className="settings-grid">
            <div className="settings-card">
              <div className="settings-title">Organisation Details</div>
              <div className="settings-desc">Your company profile and branding</div>
              <div className="form-grid">
                <div className="form-group full"><label className="form-label">Company Name</label><input className="form-input" defaultValue="FleetAxis Transport Solutions" /></div>
                <div className="form-group"><label className="form-label">CIN / Registration</label><input className="form-input" defaultValue="U60300TN2015PTC102341" /></div>
                <div className="form-group"><label className="form-label">GST Number</label><input className="form-input" defaultValue="33AABCF1234A1Z5" /></div>
                <div className="form-group full"><label className="form-label">Registered Address</label><input className="form-input" defaultValue="Anna Salai, Chennai, TN 600002" /></div>
                <div className="form-group"><label className="form-label">Primary Contact</label><input className="form-input" defaultValue="+91 44 2222 3333" /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" defaultValue="admin@fleetaxis.com" /></div>
              </div>
            </div>
            <div className="settings-card">
              <div className="settings-title">System Preferences</div>
              <div className="settings-desc">Configure system-wide defaults</div>
              <div className="form-grid" style={{marginBottom:16}}>
                <div className="form-group"><label className="form-label">Date Format</label><select className="form-select"><option>YYYY-MM-DD</option><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option></select></div>
                <div className="form-group"><label className="form-label">Timezone</label><select className="form-select"><option>IST (UTC+5:30)</option><option>UTC</option></select></div>
                <div className="form-group"><label className="form-label">Language</label><select className="form-select"><option>English</option><option>Tamil</option><option>Hindi</option></select></div>
                <div className="form-group"><label className="form-label">Currency</label><select className="form-select"><option>INR ₹</option><option>USD $</option></select></div>
              </div>
              <div className="divider"></div>
              <ToggleRow title="Dark Mode" desc="Use dark interface theme" active={toggles.dark} onClick={() => toggle('dark')} />
              <ToggleRow title="Compact Tables" desc="Reduce row padding in tables" active={toggles.compact} onClick={() => toggle('compact')} />
            </div>
          </div>
        )}

        {/* Keeping other tabs simpler for token space limits */}
        {activeTab !== 'general' && (
          <div className="settings-grid">
             <div className="settings-card full" style={{gridColumn: '1 / -1'}}>
               <div className="settings-title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings</div>
               <div className="settings-desc">Additional module options...</div>
               <ToggleRow title={`Enable advanced ${activeTab}`} desc={`Toggle extra features for ${activeTab}`} active={toggles.autoApprove} onClick={() => toggle('autoApprove')} />
             </div>
          </div>
        )}

      </div>
    </div>
  );
}

function ToggleRow({ title, desc, active, onClick }) {
  return (
    <div className="toggle-row">
      <div className="toggle-info">
        <div className="tl">{title}</div>
        <div className="td">{desc}</div>
      </div>
      <div className={`toggle ${active ? 'on' : ''}`} onClick={onClick}></div>
    </div>
  );
}

function ProfileModal({ driver, onClose }) {
  if (!driver) return null;
  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-top">
          <div className="profile-avatar" style={{background:driver.bg, color:driver.fg}}>{driver.initials}</div>
          <div style={{flex:1}}>
            <div className="driver-profile-name">{driver.name}</div>
            <div className="driver-profile-meta">{driver.id} · {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)} Driver</div>
            <div style={{marginTop:8,display:'flex',gap:6}}><span className={driver.status === 'active' ? "badge badge-green" : "badge badge-red"}>{driver.status.toUpperCase()}</span><span className="badge badge-blue">{driver.category}</span></div>
          </div>
          <button className="modal-close" onClick={onClose}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path d="M18 6L6 18M6 6l12 12" strokeWidth="2"/></svg></button>
        </div>
        <div className="modal-body">
          <div className="section-head">Personal & License Details</div>
          <div className="detail-grid">
            <div><div className="detail-label">Date of Birth</div><div className="detail-value">{driver.dob}</div></div>
            <div><div className="detail-label">Phone</div><div className="detail-value">{driver.phone}</div></div>
            <div><div className="detail-label">License No.</div><div className="detail-value mono">{driver.license}</div></div>
            <div><div className="detail-label">License Expiry</div><div className="detail-value">{driver.expiry}</div></div>
            <div><div className="detail-label">Issuing RTO</div><div className="detail-value">{driver.rto}</div></div>
            <div><div className="detail-label">Vehicle Category</div><div className="detail-value">{driver.cat}</div></div>
          </div>
          <div className="section-head">Driving Experience</div>
          <div className="detail-grid">
            <div><div className="detail-label">Total Experience</div><div className="detail-value">{driver.exp}</div></div>
            <div><div className="detail-label">With Current Employer</div><div className="detail-value">{driver.currExp}</div></div>
            <div><div className="detail-label">KM Driven (Total)</div><div className="detail-value">{driver.km}</div></div>
            <div><div className="detail-label">Safety Score</div><div className="detail-value" style={{color:'var(--accent)'}}>{driver.score} / 100</div></div>
          </div>
          <div className="section-head">Safety History</div>
          <div className="detail-grid">
            <div><div className="detail-label">Total Incidents</div><div className="detail-value">0</div></div>
            <div><div className="detail-label">Violations</div><div className="detail-value">2 (minor)</div></div>
            <div><div className="detail-label">Last Training</div><div className="detail-value">Feb 2026</div></div>
            <div><div className="detail-label">Certification</div><div className="detail-value" style={{color:'var(--accent)'}}>Defensive Driving ✓</div></div>
          </div>
          {(driver.casePending || driver.routeFrom || driver.routeTo) && (
            <>
              <div className="section-head">Legal & Route Details</div>
              <div className="detail-grid">
                <div><div className="detail-label">Case Pending</div><div className="detail-value">{driver.casePending || 'No'}</div></div>
                <div><div className="detail-label">Route From</div><div className="detail-value">{driver.routeFrom || '-'}</div></div>
                <div><div className="detail-label">Route To</div><div className="detail-value">{driver.routeTo || '-'}</div></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AddDriverModal({ isOpen, onClose, showToast, addDriver, driversLength }) {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', dob: '', phone: '', address: '', license: '', cat: 'LMV', rto: '', expiry: '', exp: '', km: '', company: '', casePending: 'No', routeFrom: '', routeTo: '' });
  
  if (!isOpen) return null;

  const submit = () => {
    if(!formData.firstName || !formData.license) return showToast("First Name and License are required");
    
    const colors = [['var(--accent-dim)','var(--accent)'],['var(--accent2-dim)','var(--accent2)'],['var(--accent3-dim)','var(--accent3)'],['var(--purple-dim)','var(--purple)']];
    const color = colors[driversLength % colors.length];

    addDriver({
      id: `DRV-00${driversLength + 50}`,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      initials: (formData.firstName[0] || '?').toUpperCase() + (formData.lastName[0] || '').toUpperCase(),
      bg: color[0], fg: color[1],
      license: formData.license, category: formData.cat.split(' ')[0], exp: formData.exp ? `${formData.exp} yrs` : '0 yrs',
      status: 'active', score: 100, noc: 'none', dob: formData.dob || '1990-01-01', phone: formData.phone || 'N/A',
      expiry: formData.expiry || '2030-01-01', rto: formData.rto || 'TBA', cat: formData.cat, currExp: '0y 0m', km: formData.km ? `${formData.km} km` : '0 km',
      casePending: formData.casePending, routeFrom: formData.routeFrom, routeTo: formData.routeTo
    });
    setFormData({ firstName: '', lastName: '', dob: '', phone: '', address: '', license: '', cat: 'LMV', rto: '', expiry: '', exp: '', km: '', company: '', casePending: 'No', routeFrom: '', routeTo: '' });
    onClose();
    showToast('Driver record saved successfully');
  };

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-top">
          <div><div className="driver-profile-name" style={{fontSize:20}}>Add New Driver</div><div className="driver-profile-meta" style={{fontSize:13}}>Enter complete driver details below</div></div>
          <button className="modal-close" onClick={onClose}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path d="M18 6L6 18M6 6l12 12" strokeWidth="2"/></svg></button>
        </div>
        <div className="modal-body">
          <div className="form-section-title">Personal Information</div>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">First Name</label><input name="firstName" value={formData.firstName} onChange={handleChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">Last Name</label><input name="lastName" value={formData.lastName} onChange={handleChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">Date of Birth</label><input name="dob" value={formData.dob} onChange={handleChange} className="form-input" type="date" /></div>
            <div className="form-group"><label className="form-label">Phone Number</label><input name="phone" value={formData.phone} onChange={handleChange} className="form-input" /></div>
            <div className="form-group full"><label className="form-label">Address</label><input name="address" value={formData.address} onChange={handleChange} className="form-input" /></div>
          </div>
          <div className="form-section"><div className="form-section-title">License Details</div>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">License Number</label><input name="license" value={formData.license} onChange={handleChange} className="form-input mono" /></div>
              <div className="form-group"><label className="form-label">Vehicle Category</label><select name="cat" value={formData.cat} onChange={handleChange} className="form-select"><option>LMV — Light Motor Vehicle</option><option>HMV — Heavy Motor Vehicle</option><option>HGMV — Heavy Goods Motor</option></select></div>
              <div className="form-group"><label className="form-label">Issuing RTO</label><input name="rto" value={formData.rto} onChange={handleChange} className="form-input" /></div>
              <div className="form-group"><label className="form-label">License Expiry Date</label><input name="expiry" value={formData.expiry} onChange={handleChange} className="form-input" type="date" /></div>
            </div>
          </div>
          <div className="form-section"><div className="form-section-title">Experience & Employment</div>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">Experience (Years)</label><input name="exp" value={formData.exp} onChange={handleChange} className="form-input" type="number" /></div>
              <div className="form-group"><label className="form-label">Total KM Driven</label><input name="km" value={formData.km} onChange={handleChange} className="form-input" /></div>
            </div>
          </div>
          <div className="form-section"><div className="form-section-title">Legal & Route Details</div>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">Case Pending</label><select name="casePending" value={formData.casePending} onChange={handleChange} className="form-select"><option>No</option><option>Yes</option></select></div>
              <div className="form-group"><label className="form-label">Route From</label><input name="routeFrom" value={formData.routeFrom} onChange={handleChange} className="form-input" placeholder="e.g. Chennai" /></div>
              <div className="form-group"><label className="form-label">Route To</label><input name="routeTo" value={formData.routeTo} onChange={handleChange} className="form-input" placeholder="e.g. Bangalore" /></div>
            </div>
          </div>
          <div style={{display:'flex',gap:10,marginTop:22,justifyContent:'flex-end'}}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={submit}>Save Driver Record</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditDriverModal({ driver, onClose, showToast, updateDriver }) {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', dob: '', phone: '', address: '', license: '', cat: 'LMV', rto: '', expiry: '', exp: '', km: '', company: '', casePending: 'No', routeFrom: '', routeTo: '' });

  useEffect(() => {
    if (driver) {
      const parts = driver.name.split(' ');
      setFormData({
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        dob: driver.dob || '',
        phone: driver.phone || '',
        address: driver.address || '',
        license: driver.license || '',
        cat: driver.cat || 'LMV',
        rto: driver.rto || '',
        expiry: driver.expiry || '',
        exp: parseInt(driver.exp) || 0,
        km: parseInt(driver.km?.replace(/[^\d]/g, '')) || 0,
        company: '',
        casePending: driver.casePending || 'No',
        routeFrom: driver.routeFrom || '',
        routeTo: driver.routeTo || ''
      });
    }
  }, [driver]);

  if (!driver) return null;

  const submit = () => {
    if(!formData.firstName || !formData.license) return showToast("First Name and License are required");
    
    updateDriver({
      ...driver,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      initials: (formData.firstName[0] || '?').toUpperCase() + (formData.lastName[0] || '').toUpperCase(),
      license: formData.license, category: formData.cat.split(' ')[0], exp: formData.exp ? `${formData.exp} yrs` : '0 yrs',
      dob: formData.dob || '1990-01-01', phone: formData.phone || 'N/A',
      expiry: formData.expiry || '2030-01-01', rto: formData.rto || 'TBA', cat: formData.cat, km: formData.km ? `${formData.km} km` : '0 km',
      casePending: formData.casePending, routeFrom: formData.routeFrom, routeTo: formData.routeTo
    });
    onClose();
    showToast('Driver record updated successfully');
  };

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-top">
          <div><div className="driver-profile-name" style={{fontSize:20}}>Edit Driver Record</div><div className="driver-profile-meta" style={{fontSize:13}}>Update details for {driver.name}</div></div>
          <button className="modal-close" onClick={onClose}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path d="M18 6L6 18M6 6l12 12" strokeWidth="2"/></svg></button>
        </div>
        <div className="modal-body">
          <div className="form-section-title">Personal Information</div>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">First Name</label><input name="firstName" value={formData.firstName} onChange={handleChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">Last Name</label><input name="lastName" value={formData.lastName} onChange={handleChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">Date of Birth</label><input name="dob" value={formData.dob} onChange={handleChange} className="form-input" type="date" /></div>
            <div className="form-group"><label className="form-label">Phone Number</label><input name="phone" value={formData.phone} onChange={handleChange} className="form-input" /></div>
            <div className="form-group full"><label className="form-label">Address</label><input name="address" value={formData.address} onChange={handleChange} className="form-input" /></div>
          </div>
          <div className="form-section"><div className="form-section-title">License Details</div>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">License Number</label><input name="license" value={formData.license} onChange={handleChange} className="form-input mono" /></div>
              <div className="form-group"><label className="form-label">Vehicle Category</label><select name="cat" value={formData.cat} onChange={handleChange} className="form-select"><option>LMV — Light Motor Vehicle</option><option>HMV — Heavy Motor Vehicle</option><option>HGMV — Heavy Goods Motor</option></select></div>
              <div className="form-group"><label className="form-label">Issuing RTO</label><input name="rto" value={formData.rto} onChange={handleChange} className="form-input" /></div>
              <div className="form-group"><label className="form-label">License Expiry Date</label><input name="expiry" value={formData.expiry} onChange={handleChange} className="form-input" type="date" /></div>
            </div>
          </div>
          <div className="form-section"><div className="form-section-title">Experience & Employment</div>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">Experience (Years)</label><input name="exp" value={formData.exp} onChange={handleChange} className="form-input" type="number" /></div>
              <div className="form-group"><label className="form-label">Total KM Driven</label><input name="km" value={formData.km} onChange={handleChange} className="form-input" /></div>
            </div>
          </div>
          <div className="form-section"><div className="form-section-title">Legal & Route Details</div>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">Case Pending</label><select name="casePending" value={formData.casePending} onChange={handleChange} className="form-select"><option>No</option><option>Yes</option></select></div>
              <div className="form-group"><label className="form-label">Route From</label><input name="routeFrom" value={formData.routeFrom} onChange={handleChange} className="form-input" placeholder="e.g. Chennai" /></div>
              <div className="form-group"><label className="form-label">Route To</label><input name="routeTo" value={formData.routeTo} onChange={handleChange} className="form-input" placeholder="e.g. Bangalore" /></div>
            </div>
          </div>
          <div style={{display:'flex',gap:10,marginTop:22,justifyContent:'flex-end'}}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={submit}>Update Driver Record</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewNOCModal({ isOpen, onClose, showToast, drivers, addNocRequest, nocLength }) {
  const [driverId, setDriverId] = useState('');
  const [company, setCompany] = useState('');
  const [purpose, setPurpose] = useState('Employment Transfer');

  if (!isOpen) return null;

  const submit = () => {
    if(!driverId || !company) return showToast("Driver and Requesting Company are required");
    const doc = {
      id: `NOC-00${nocLength + 1}`,
      driverId,
      requestingCompany: company,
      purpose,
      submitted: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    addNocRequest(doc);
    setDriverId(''); setCompany(''); setPurpose('Employment Transfer');
    onClose();
    showToast('NOC Request submitted successfully');
  };

  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-top">
          <div><div className="driver-profile-name" style={{fontSize:20}}>Initiate NOC Request</div><div className="driver-profile-meta" style={{fontSize:13}}>Submit a new NOC request</div></div>
          <button className="modal-close" onClick={onClose}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path d="M18 6L6 18M6 6l12 12" strokeWidth="2"/></svg></button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Select Driver</label><select className="form-select" value={driverId} onChange={e=>setDriverId(e.target.value)}><option value="">-- Choose Driver --</option>{drivers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.id})</option>)}</select></div>
            <div className="form-group"><label className="form-label">Requesting Company</label><input className="form-input" value={company} onChange={e=>setCompany(e.target.value)} /></div>
            <div className="form-group full"><label className="form-label">Purpose of NOC</label><select className="form-select" value={purpose} onChange={e=>setPurpose(e.target.value)}><option>Employment Transfer</option><option>Loan Verification</option><option>Background Check</option><option>Other</option></select></div>
          </div>
          <div style={{display:'flex',gap:10,marginTop:22,justifyContent:'flex-end'}}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={submit}>Submit Request</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewNOCModal({ data, onClose, showToast, updateNocStatus }) {
  if (!data) return null;
  const badgeClass = data.status === 'Approved' ? 'badge-green' : data.status === 'Pending' ? 'badge-amber' : 'badge-red';
  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{maxWidth: 600}}>
        <div className="modal-top">
          <div className="profile-avatar" style={{background:data.driver.bg, color:data.driver.fg}}>{data.driver.initials}</div>
          <div style={{flex:1}}>
            <div className="driver-profile-name">NOC Request Details</div>
            <div className="driver-profile-meta">{data.id} · {data.driver.name}</div>
            <div style={{marginTop:8,display:'flex',gap:6}}><span className={`badge ${badgeClass}`}>{data.status}</span></div>
          </div>
          <button className="modal-close" onClick={onClose}><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path d="M18 6L6 18M6 6l12 12" strokeWidth="2"/></svg></button>
        </div>
        <div className="modal-body">
          <div className="section-head">Request Information</div>
          <div className="detail-grid">
            <div><div className="detail-label">Driver Name</div><div className="detail-value">{data.driver.name}</div></div>
            <div><div className="detail-label">Driver ID</div><div className="detail-value mono">{data.driver.id}</div></div>
            <div><div className="detail-label">Requesting Company</div><div className="detail-value">{data.requestingCompany}</div></div>
            <div><div className="detail-label">Purpose</div><div className="detail-value">{data.purpose}</div></div>
            <div><div className="detail-label">Submitted On</div><div className="detail-value mono">{data.submitted}</div></div>
            <div><div className="detail-label">Status</div><div className="detail-value"><span className={`badge ${badgeClass}`}>{data.status}</span></div></div>
          </div>
          <div className="section-head">Actions</div>
          {data.status === 'Pending' ? (
            <div style={{display:'flex', gap:10}}>
              <button className="btn btn-primary" onClick={() => { updateNocStatus(data.id, 'Approved'); showToast(`NOC approved for ${data.driver.name}`); onClose(); }}>Approve NOC</button>
              <button className="btn btn-danger" onClick={() => { updateNocStatus(data.id, 'Rejected'); showToast('NOC rejected'); onClose(); }}>Reject Request</button>
            </div>
          ) : (
            <div style={{fontSize: 13, color: 'var(--text3)', fontFamily: 'var(--body-font)'}}>
              This request was already {data.status.toLowerCase()}. No further actions can be taken.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
