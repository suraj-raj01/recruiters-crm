import { Briefcase, Building2, MapPin } from "lucide-react";
import { JOB_STATUSES } from "../utils/constants.js";

export default function JobsView({ jobs, onUpdateJob }) {
  return (
    <div className="jobs-grid">
      {jobs.map((job) => (
        <article className="job-card" key={job.id}>
          <div className="job-card-top">
            <span className={`priority-dot ${job.priority.toLowerCase()}`} />
            <div>
              <h2>{job.title}</h2>
              <p>{job.department}</p>
            </div>
          </div>

          <div className="job-meta-grid">
            <span>
              <MapPin size={15} />
              {job.location}
            </span>
            <span>
              <Briefcase size={15} />
              {job.employmentType}
            </span>
            <span>
              <Building2 size={15} />
              {job.hiringManager}
            </span>
          </div>

          <p className="job-description">{job.description}</p>

          <div className="skill-row">
            {job.skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>

          <div className="job-card-footer">
            <strong>{job.salaryRange || "Salary TBD"}</strong>
            <select value={job.status} onChange={(event) => onUpdateJob(job.id, { status: event.target.value })}>
              {JOB_STATUSES.map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </article>
      ))}
    </div>
  );
}
