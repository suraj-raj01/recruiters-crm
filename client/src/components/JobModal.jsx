import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { EMPLOYMENT_TYPES, JOB_STATUSES, PRIORITIES } from "../utils/constants.js";

const emptyForm = {
  title: "",
  department: "",
  location: "",
  employmentType: "Full-time",
  status: "Open",
  hiringManager: "",
  salaryRange: "",
  priority: "Medium",
  skills: "",
  description: ""
};

export default function JobModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setSaving(false);
    }
  }, [open]);

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
      <section className="modal" role="dialog" aria-modal="true" aria-label="Add job">
        <header className="modal-header">
          <div>
            <p className="eyebrow">New role</p>
            <h2>Add job</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </header>

        <form className="form-grid" onSubmit={submit}>
          <label>
            Title
            <input value={form.title} onChange={(event) => update("title", event.target.value)} required />
          </label>
          <label>
            Department
            <input value={form.department} onChange={(event) => update("department", event.target.value)} required />
          </label>
          <label>
            Location
            <input value={form.location} onChange={(event) => update("location", event.target.value)} required />
          </label>
          <label>
            Hiring manager
            <input
              value={form.hiringManager}
              onChange={(event) => update("hiringManager", event.target.value)}
              required
            />
          </label>
          <label>
            Type
            <select value={form.employmentType} onChange={(event) => update("employmentType", event.target.value)}>
              {EMPLOYMENT_TYPES.map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select value={form.status} onChange={(event) => update("status", event.target.value)}>
              {JOB_STATUSES.map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label>
            Priority
            <select value={form.priority} onChange={(event) => update("priority", event.target.value)}>
              {PRIORITIES.map((priority) => (
                <option value={priority} key={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>
          <label>
            Salary range
            <input value={form.salaryRange} onChange={(event) => update("salaryRange", event.target.value)} />
          </label>
          <label className="span-two">
            Skills
            <input value={form.skills} onChange={(event) => update("skills", event.target.value)} />
          </label>
          <label className="span-two">
            Description
            <textarea value={form.description} onChange={(event) => update("description", event.target.value)} />
          </label>

          <div className="modal-actions span-two">
            <button className="secondary-action" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-action compact" type="submit" disabled={saving}>
              <Save size={16} />
              <span>{saving ? "Saving..." : "Save job"}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
