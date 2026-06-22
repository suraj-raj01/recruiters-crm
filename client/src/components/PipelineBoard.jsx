import { ArrowRight, Calendar, MapPin, Star } from "lucide-react";
import { STAGES } from "../utils/constants.js";
import { dueTone, formatDate } from "../utils/format.js";

function CandidateCard({ candidate, onSelect, onMove }) {
  return (
    <article
      className="candidate-card"
      draggable
      onDragStart={(event) => event.dataTransfer.setData("text/plain", candidate.id)}
    >
      <button className="card-hitbox" type="button" onClick={() => onSelect(candidate)}>
        <span className="candidate-topline">
          <strong>{candidate.name}</strong>
          <span className="rating-pill">
            <Star size={14} />
            {candidate.rating}/5
          </span>
        </span>
        <span className="candidate-headline">{candidate.headline}</span>
        <span className="candidate-meta">
          <MapPin size={14} />
          {candidate.location || "Remote"}
        </span>
        <span className={`due-pill ${dueTone(candidate.nextStepDueDate)}`}>
          <Calendar size={14} />
          {formatDate(candidate.nextStepDueDate)}
        </span>
      </button>

      <div className="candidate-card-footer">
        <span>{candidate.job?.title || "Unassigned"}</span>
        <button
          className="icon-button tiny"
          type="button"
          onClick={() => onMove(candidate.id, nextStage(candidate.stage))}
          title="Move to next stage"
          disabled={!nextStage(candidate.stage)}
        >
          <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}

function nextStage(stage) {
  const index = STAGES.indexOf(stage);
  return index >= 0 && index < STAGES.length - 1 ? STAGES[index + 1] : "";
}

export default function PipelineBoard({ candidates, onSelectCandidate, onMoveCandidate }) {
  const grouped = STAGES.reduce((acc, stage) => {
    acc[stage] = candidates.filter((candidate) => candidate.stage === stage);
    return acc;
  }, {});

  function dropOnStage(event, stage) {
    event.preventDefault();
    const candidateId = event.dataTransfer.getData("text/plain");

    if (candidateId) {
      onMoveCandidate(candidateId, stage);
    }
  }

  return (
    <div className="pipeline-board" aria-label="Candidate pipeline">
      {STAGES.map((stage) => (
        <section
          className="pipeline-column"
          key={stage}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => dropOnStage(event, stage)}
        >
          <header>
            <strong>{stage}</strong>
            <span>{grouped[stage].length}</span>
          </header>
          <div className="column-stack">
            {grouped[stage].map((candidate) => (
              <CandidateCard
                candidate={candidate}
                key={candidate.id}
                onSelect={onSelectCandidate}
                onMove={onMoveCandidate}
              />
            ))}
            {!grouped[stage].length ? <p className="column-empty">No candidates</p> : null}
          </div>
        </section>
      ))}
    </div>
  );
}
