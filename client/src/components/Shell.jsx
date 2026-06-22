import { Briefcase, LayoutDashboard, LogOut, Plus, Search, Users } from "lucide-react";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "pipeline", label: "Pipeline", icon: Users },
  { id: "candidates", label: "Candidates", icon: Search },
  { id: "jobs", label: "Jobs", icon: Briefcase }
];

export default function Shell({
  user,
  view,
  search,
  onViewChange,
  onSearchChange,
  onAddCandidate,
  onAddJob,
  onLogout,
  children
}) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark small">TD</span>
          <div>
            <strong>TalentDeck</strong>
            <span>Recruiter ATS</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Primary">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={view === item.id ? "nav-item active" : "nav-item"}
                key={item.id}
                type="button"
                onClick={() => onViewChange(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-user">
          <span className="avatar" style={{ backgroundColor: user?.avatarColor, fontSize: '1.3rem' }}>
            {user?.name?.slice(0, 1) || "R"}
          </span>
          <div>
            <strong>{user?.name}</strong>
            <span>{user?.role}</span>
          </div>
          <button className="icon-button" type="button" onClick={onLogout} title="Sign out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="search-box">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search candidates"
              aria-label="Search candidates"
            />
          </div>

          <div className="topbar-actions">
            <button className="secondary-action" type="button" onClick={onAddJob}>
              <Briefcase size={17} />
              <span>Job</span>
            </button>
            <button className="primary-action compact" type="button" onClick={onAddCandidate}>
              <Plus size={18} />
              <span>Candidate</span>
            </button>
          </div>
        </header>

        <section className="workspace-content">{children}</section>
      </main>
    </div>
  );
}
