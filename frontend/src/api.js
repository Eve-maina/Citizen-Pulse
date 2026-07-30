export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export class RejectionError extends Error {
  constructor(reason, reasonSw) {
    super(reason || 'Submission rejected');
    this.name = 'RejectionError';
    this.reason = reason;
    this.reasonSw = reasonSw;
  }
}

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

async function handleSubmit(res) {
  const body = await res.json().catch(() => ({}));
  if (res.status === 422 && body.rejected) {
    throw new RejectionError(body.reason, body.reasonSw);
  }
  if (!res.ok) {
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return body;
}

// Deduplicates identical concurrent GETs so React StrictMode's dev-mode
// double-mount (or any accidental double-call) never fires the request twice.
const inflight = new Map();

function get(url) {
  if (inflight.has(url)) return inflight.get(url);
  const promise = fetch(url)
    .then(handle)
    .finally(() => inflight.delete(url));
  inflight.set(url, promise);
  return promise;
}

export const api = {
  getTopics: () => get(`${BASE_URL}/topics`),
  getWards: () => get(`${BASE_URL}/wards`),
  submit: (formData) =>
    fetch(`${BASE_URL}/submissions`, { method: 'POST', body: formData }).then(handleSubmit),
  getRecommendations: () => get(`${BASE_URL}/recommendations`),
  getHotspots: () => get(`${BASE_URL}/hotspots`),
  getTopicStats: () => get(`${BASE_URL}/stats/topics`),
  getUrgencyStats: () => get(`${BASE_URL}/stats/urgency`),
  getSubmissions: () => get(`${BASE_URL}/submissions`),
  vote: (id, direction) =>
    fetch(`${BASE_URL}/submissions/${id}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direction }),
    }).then(handle),
};
