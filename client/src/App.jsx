import { useEffect, useMemo, useState } from "react";
import CandidateModal from "./components/CandidateModal.jsx";
import CandidatePanel from "./components/CandidatePanel.jsx";
import CandidatesTable from "./components/CandidatesTable.jsx";
import Dashboard from "./components/Dashboard.jsx";
import JobModal from "./components/JobModal.jsx";
import JobsView from "./components/JobsView.jsx";
import Login from "./components/Login.jsx";
import PipelineBoard from "./components/PipelineBoard.jsx";
import Shell from "./components/Shell.jsx";
import { api, setAuthToken } from "./services/api.js";
import Swal from "sweetalert2";

function storedUser() {
  try {
    return JSON.parse(localStorage.getItem("ats_user") || "null");
  } catch {
    return null;
  }
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("ats_token") || "");
  const [user, setUser] = useState(storedUser);
  const [view, setView] = useState("overview");
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    stage: "All",
    jobId: "All"
  });
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthToken(token);

    if (token) {
      loadWorkspace();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadCandidates();
    }
  }, [filters.search, filters.stage, filters.jobId]);

  const pageTitle = useMemo(() => {
    const titles = {
      overview: "Overview",
      pipeline: "Pipeline",
      candidates: "Candidates",
      jobs: "Jobs"
    };
    return titles[view] || "Overview";
  }, [view]);

  async function loadWorkspace() {
    setLoading(true);
    setError("");

    try {
      const [meResponse, jobsResponse, candidatesResponse, metricsResponse] = await Promise.all([
        api.me(),
        api.getJobs(),
        api.getCandidates(filters),
        api.getMetrics()
      ]);

      setUser(meResponse.user);
      localStorage.setItem("ats_user", JSON.stringify(meResponse.user));
      setJobs(jobsResponse.jobs);
      setCandidates(candidatesResponse.candidates);
      setMetrics(metricsResponse.metrics);
    } catch (requestError) {
      setError(requestError.message);

      if (requestError.message.toLowerCase().includes("session") || requestError.message.toLowerCase().includes("token")) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadCandidates() {
    try {
      const response = await api.getCandidates(filters);
      setCandidates(response.candidates);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function refreshMetrics() {
    const response = await api.getMetrics();
    setMetrics(response.metrics);
  }

  function mergeCandidate(candidate) {
    setCandidates((current) => {
      const exists = current.some((item) => item.id === candidate.id);
      return exists ? current.map((item) => (item.id === candidate.id ? candidate : item)) : [candidate, ...current];
    });

    setSelectedCandidate((current) => (current?.id === candidate.id ? candidate : current));
  }

  async function login(credentials) {
    setLoginLoading(true);
    setError("");
    try {
      const response = await api.login(credentials);
      setAuthToken(response.token);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem("ats_user", JSON.stringify(response.user));
      Swal.fire("Login Successful", "You have been logged in successfully.", "success");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoginLoading(false);
    }
  }


  async function logout() {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setAuthToken("");
    localStorage.removeItem("ats_user");
    setToken("");
    setUser(null);
    setSelectedCandidate(null);

    Swal.fire("Logged Out!", "You have been logged out.", "success");
  }

  async function selectCandidate(candidate) {
    const candidateId = candidate?.id;
    const found = candidates.find((item) => item.id === candidateId);

    if (found?.name) {
      setSelectedCandidate(found);
      return;
    }

    try {
      const response = await api.getCandidate(candidateId);
      setSelectedCandidate(response.candidate);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function createCandidate(payload) {
    const response = await api.createCandidate(payload);
    mergeCandidate(response.candidate);
    setCandidateModalOpen(false);
    await refreshMetrics();
  }

  async function updateCandidate(candidateId, payload) {
    const response = await api.updateCandidate(candidateId, payload);
    mergeCandidate(response.candidate);
    await refreshMetrics();
  }

  async function deleteCandidate(candidateId) {
    const result = await Swal.fire({
      title: "Delete Candidate?",
      text: "Are you sure you want to delete this candidate?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    const response = await api.deleteCandidate(candidateId);
    setCandidates((current) => current.filter((item) => item.id !== candidateId));
    setSelectedCandidate(null);
    await refreshMetrics();
  }

  async function moveCandidate(candidateId, stage) {
    if (!stage) {
      return;
    }

    const response = await api.moveCandidate(candidateId, stage);
    mergeCandidate(response.candidate);
    await refreshMetrics();
  }

  async function addNote(candidateId, body) {
    const response = await api.addNote(candidateId, body);
    mergeCandidate(response.candidate);
    await refreshMetrics();
  }

  async function createJob(payload) {
    const response = await api.createJob(payload);
    setJobs((current) => [response.job, ...current]);
    setJobModalOpen(false);
    await refreshMetrics();
  }

  async function updateJob(jobId, payload) {
    const response = await api.updateJob(jobId, payload);
    setJobs((current) => current.map((job) => (job.id === jobId ? response.job : job)));
    await loadCandidates();
    await refreshMetrics();
  }

  function updateFilters(partial) {
    setFilters((current) => ({ ...current, ...partial }));
  }

  function renderView() {
    if (loading) {
      return <div className="empty-state">Loading workspace...</div>;
    }

    if (view === "overview") {
      return <Dashboard metrics={metrics} onSelectCandidate={selectCandidate} />;
    }

    if (view === "pipeline") {
      return (
        <PipelineBoard
          candidates={candidates}
          onSelectCandidate={selectCandidate}
          onMoveCandidate={moveCandidate}
        />
      );
    }

    if (view === "candidates") {
      return (
        <CandidatesTable
          candidates={candidates}
          jobs={jobs}
          filters={filters}
          onFiltersChange={updateFilters}
          onSelectCandidate={selectCandidate}
        />
      );
    }

    return <JobsView jobs={jobs} onUpdateJob={updateJob} />;
  }

  if (!token) {
    return <Login loading={loginLoading} error={error} onLogin={login} />;
  }

  return (
    <>
      <Shell
        user={user}
        view={view}
        search={filters.search}
        onViewChange={setView}
        onSearchChange={(search) => updateFilters({ search })}
        onAddCandidate={() => setCandidateModalOpen(true)}
        onAddJob={() => setJobModalOpen(true)}
        onLogout={logout}
      >
        <div className="page-heading">
          <div>
            <p className="eyebrow">Workspace</p>
            <h1>{pageTitle}</h1>
          </div>
          {error ? <p className="app-error">{error}</p> : null}
        </div>
        {renderView()}
      </Shell>

      <CandidatePanel
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onMoveCandidate={moveCandidate}
        onAddNote={addNote}
      />

      <CandidateModal
        open={candidateModalOpen}
        jobs={jobs}
        onClose={() => setCandidateModalOpen(false)}
        onSubmit={createCandidate}
      />

      <JobModal open={jobModalOpen} onClose={() => setJobModalOpen(false)} onSubmit={createJob} />
    </>
  );
}
