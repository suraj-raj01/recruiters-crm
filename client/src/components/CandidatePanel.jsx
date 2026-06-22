import { Calendar, FileText, Mail, MapPin, Phone, Send, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { STAGES } from "../utils/constants.js";
import { dueTone, formatDate, formatDateTime } from "../utils/format.js";

export default function CandidatePanel({ candidate, onClose, onMoveCandidate, onAddNote }) {
  const [note, setNote] = useState("");

  useEffect(() => {
    setNote("");
  }, [candidate?.id]);

  if (!candidate) {
    return null;
  }

  async function submitNote(event) {
    event.preventDefault();

    if (!note.trim()) {
      return;
    }

    await onAddNote(candidate.id, note.trim());
    setNote("");
  }

  return (
    <aside className="candidate-drawer" aria-label="Candidate details">
      <div className="drawer-header">
        <div>
          <p className="eyebrow">{candidate.stage}</p>
          <h2>{candidate.name}</h2>
        </div>
        <button className="icon-button" type="button" onClick={onClose} title="Close details">
          <X size={18} />
        </button>
      </div>

      <p className="drawer-headline">{candidate.headline}</p>

      <div className="drawer-facts">
        <span>
          <Mail size={15} />
          {candidate.email}
        </span>
        <span>
          <Phone size={15} />
          {candidate.phone || "No phone"}
        </span>
        <span>
          <MapPin size={15} />
          {candidate.location || "Remote"}
        </span>
        <span>
          <Star size={15} />
          {candidate.rating}/5 rating
        </span>
      </div>

      <div className="drawer-section">
        <label>
          Stage
          <select value={candidate.stage} onChange={(event) => onMoveCandidate(candidate.id, event.target.value)}>
            {STAGES.map((stage) => (
              <option value={stage} key={stage}>
                {stage}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="drawer-section">
        <h3>Role</h3>
        <div className="role-line">
          <strong>{candidate.job?.title || "Unassigned"}</strong>
          <span>{candidate.job?.department || ""}</span>
        </div>
      </div>

      <div className="drawer-section">
        <h3>Next step</h3>
        <div className={`next-step ${dueTone(candidate.nextStepDueDate)}`}>
          <Calendar size={16} />
          <span>
            <strong>{candidate.nextStep}</strong>
            <small>{formatDate(candidate.nextStepDueDate)}</small>
          </span>
        </div>
      </div>

      <div className="drawer-section">
        <h3>Skills</h3>
        <div className="skill-row">
          {(candidate.skills || []).map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>

      {candidate.resumeUrl ? (
        <a className="resume-link" href={candidate.resumeUrl} target="_blank" rel="noreferrer">
          <FileText size={16} />
          Resume
        </a>
      ) : null}

      <div className="drawer-section">
        <h3>Notes</h3>
        <form className="note-form" onSubmit={submitNote}>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a note" />
          <button className="primary-action compact" type="submit">
            <Send size={16} />
            <span>Add</span>
          </button>
        </form>
        <div className="notes-list">
          {(candidate.notes || []).map((item) => (
            <article className="note-item" key={item.id || item._id || item.createdAt}>
              <p>{item.body}</p>
              <span>
                {item.author} - {formatDateTime(item.createdAt)}
              </span>
            </article>
          ))}
          {!candidate.notes?.length ? <p className="empty-copy">No notes yet.</p> : null}
        </div>
      </div>
    </aside>
  );
}
