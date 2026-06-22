import { Activity, Briefcase, Calendar, CheckCircle, Star, Users } from "lucide-react";
import { formatDate, formatDateTime } from "../utils/format.js";

function Kpi({ icon: Icon, label, value, tone }) {
  return (
    <article className={`kpi-card ${tone || ""}`}>
      <span className="kpi-icon">
        <Icon size={20} />
      </span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}

export default function Dashboard({ metrics, onSelectCandidate }) {
  if (!metrics) {
    return <div className="empty-state">Loading dashboard...</div>;
  }

  const maxStageCount = Math.max(...metrics.stageCounts.map((item) => item.count), 1);

  return (
    <div className="dashboard-grid">
      <section className="kpi-grid">
        <Kpi icon={Users} label="Candidates" value={metrics.totalCandidates} />
        <Kpi icon={Activity} label="Active pipeline" value={metrics.activeCandidates} tone="blue" />
        <Kpi icon={Briefcase} label="Open jobs" value={metrics.openJobs} tone="green" />
        <Kpi icon={CheckCircle} label="Hired" value={metrics.hired} tone="success" />
        <Kpi icon={Star} label="Avg rating" value={metrics.averageRating} tone="gold" />
      </section>

      <section className="panel wide">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Pipeline</p>
            <h2>Stage distribution</h2>
          </div>
          <strong>{metrics.conversionRate}% hired</strong>
        </div>
        <div className="stage-bars">
          {metrics.stageCounts.map((item) => (
            <div className="stage-bar-row" key={item.stage}>
              <span>{item.stage}</span>
              <div className="bar-track">
                <span style={{ width: `${(item.count / maxStageCount) * 100}%` }} />
              </div>
              <strong>{item.count}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Next steps</p>
            <h2>Due soon</h2>
          </div>
          <Calendar size={20} />
        </div>
        <div className="stack-list">
          {metrics.dueSoon.map((candidate) => (
            <button className="list-row" type="button" key={candidate.id} onClick={() => onSelectCandidate(candidate)}>
              <span>
                <strong>{candidate.name}</strong>
                <small>{candidate.nextStep}</small>
              </span>
              <em>{formatDate(candidate.nextStepDueDate)}</em>
            </button>
          ))}
          {!metrics.dueSoon.length ? <p className="empty-copy">No pending follow-ups.</p> : null}
        </div>
      </section>


      <section className="panel wide">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Activity</p>
            <h2>Recent updates</h2>
          </div>
        </div>
        <div className="activity-feed">
          {metrics.recentActivity.map((event) => (
            <button
              className="activity-row"
              type="button"
              key={`${event.candidateId}-${event.createdAt}-${event.message}`}
              onClick={() => onSelectCandidate({ id: event.candidateId })}
            >
              <span className={`activity-dot ${event.type}`} />
              <span>
                <strong>{event.candidateName}</strong>
                <small>{event.message}</small>
              </span>
              <em>{formatDateTime(event.createdAt)}</em>
            </button>
          ))}
        </div>
      </section>
      
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Sources</p>
            <h2>Candidate mix</h2>
          </div>
        </div>
        <div className="source-cloud">
          {Object.entries(metrics.sourceCounts).map(([source, count]) => (
            <span key={source}>
              {source}
              <strong>{count}</strong>
            </span>
          ))}
        </div>
      </section>

    </div>
  );
}
