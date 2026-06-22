import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SOURCES, STAGES } from "../utils/constants.js";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  location: "",
  headline: "",
  source: "LinkedIn",
  stage: "Applied",
  rating: 4,
  jobId: "",
  skills: "",
  salaryExpectation: "",
  noticePeriod: "",
  resumeUrl: "",
  nextStep: "Recruiter follow-up",
  nextStepDueDate: ""
};

export default function CandidateModal({ open, jobs, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        ...emptyForm,
        jobId: jobs[0]?.id || ""
      });
      setSaving(false);
    }
  }, [open, jobs]);

  if (!open) {
    return null;
  }

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label="Add candidate">
        <header className="modal-header">
          <div>
            <p className="eyebrow">New candidate</p>
            <h2>Add candidate</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </header>

        <form className="form-grid" onSubmit={submit}>
          <label>
            Name
            <input value={form.name} onChange={(event) => update("name", event.target.value)} required />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
              required
            />
          </label>
          <label>
            Phone
            <input value={form.phone} onChange={(event) => update("phone", event.target.value)} />
          </label>
          <label>
            Location
            <input value={form.location} onChange={(event) => update("location", event.target.value)} />
          </label>
          <label className="span-two">
            Headline
            <input value={form.headline} onChange={(event) => update("headline", event.target.value)} required />
          </label>
          <label>
            Job
            <select value={form.jobId} onChange={(event) => update("jobId", event.target.value)} required>
              {jobs.map((job) => (
                <option value={job.id} key={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Stage
            <select value={form.stage} onChange={(event) => update("stage", event.target.value)}>
              {STAGES.map((stage) => (
                <option value={stage} key={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </label>
          <label>
            Source
            <select value={form.source} onChange={(event) => update("source", event.target.value)}>
              {SOURCES.map((source) => (
                <option value={source} key={source}>
                  {source}
                </option>
              ))}
            </select>
          </label>
          <label>
            Rating
            <input
              type="number"
              min="1"
              max="5"
              value={form.rating}
              onChange={(event) => update("rating", event.target.value)}
            />
          </label>
          <label className="span-two">
            Skills
            <input value={form.skills} onChange={(event) => update("skills", event.target.value)} />
          </label>
          <label>
            Salary
            <input value={form.salaryExpectation} onChange={(event) => update("salaryExpectation", event.target.value)} />
          </label>
          <label>
            Notice period
            <input value={form.noticePeriod} onChange={(event) => update("noticePeriod", event.target.value)} />
          </label>
          <label>
            Next step
            <input value={form.nextStep} onChange={(event) => update("nextStep", event.target.value)} />
          </label>
          <label>
            Due date
            <input
              type="date"
              value={form.nextStepDueDate}
              onChange={(event) => update("nextStepDueDate", event.target.value)}
            />
          </label>
          <label className="span-two">
            Resume URL
            <input value={form.resumeUrl} onChange={(event) => update("resumeUrl", event.target.value)} />
          </label>

          <div className="modal-actions span-two">
            <button className="secondary-action" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-action compact" type="submit" disabled={saving || !jobs.length}>
              <Save size={16} />
              <span>{saving ? "Saving..." : "Save candidate"}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
