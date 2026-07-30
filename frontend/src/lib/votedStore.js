const KEY = 'voted_submissions';

function readVotes() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

export function getVote(id) {
  return readVotes()[id] || null;
}

export function setVote(id, direction) {
  const votes = readVotes();
  votes[id] = direction;
  localStorage.setItem(KEY, JSON.stringify(votes));
}
