import { Calendar, Filter, MapPin, Star } from "lucide-react";
import { STAGES } from "../utils/constants.js";
import { dueTone, formatDate } from "../utils/format.js";

export default function CandidatesTable({ candidates, jobs, filters, onFiltersChange, onSelectCandidate }) {
  return (
    <div className="table-view">
      <div className="filter-strip">
        <span>
          <Filter size={16} />
          Filters
        </span>
        <select value={filters.stage} onChange={(event) => onFiltersChange({ stage: event.target.value })}>
          <option value="All">All stages</option>
          {STAGES.map((stage) => (
            <option value={stage} key={stage}>
              {stage}
            </option>
          ))}
        </select>
        <select value={filters.jobId} onChange={(event) => onFiltersChange({ jobId: event.target.value })}>
          <option value="All">All jobs</option>
          {jobs.map((job) => (
            <option value={job.id} key={job.id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Job</th>
              <th>Stage</th>
              <th>Rating</th>
              <th>Next step</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id} onClick={() => onSelectCandidate(candidate)}>
                <td>
                  <strong>{candidate.name}</strong>
                  <span>
                    <MapPin size={14} />
                    {candidate.location || "Remote"}
                  </span>
                </td>
                <td>{candidate.job?.title || "Unassigned"}</td>
                <td>
                  <span className={`stage-chip ${candidate.stage.toLowerCase()}`}>{candidate.stage}</span>
                </td>
                <td>
                  <span className="rating-cell">
                    <Star size={15} />
                    {candidate.rating}/5
                  </span>
                </td>
                <td>
                  <span className={`due-pill ${dueTone(candidate.nextStepDueDate)}`}>
                    <Calendar size={14} />
                    {formatDate(candidate.nextStepDueDate)}
                  </span>
                </td>
                <td>{candidate.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!candidates.length ? <p className="empty-state">No candidates match the current filters.</p> : null}
      </div>
    </div>
  );
}
