const sessions = new Map();
const TTL_MS = 3 * 60 * 1000;

export function getSession(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    return null;
  }
  return session;
}

export function createSession(sessionId, phoneNumber) {
  const session = {
    step: 'topic',
    topic: null,
    ward: null,
    rawText: null,
    phoneNumber,
    expiresAt: Date.now() + TTL_MS,
  };
  sessions.set(sessionId, session);
  return session;
}

export function touchSession(sessionId) {
  const session = getSession(sessionId);
  if (session) {
    session.expiresAt = Date.now() + TTL_MS;
  }
  return session;
}

export function clearSession(sessionId) {
  sessions.delete(sessionId);
}
