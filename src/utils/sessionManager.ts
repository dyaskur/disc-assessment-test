import type { SessionData } from '$types/sessions';

const SESSION_KEY = 'lastSession';

export const sessionManager = {
  saveSession: (data: SessionData) => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  },

  loadSession: (): SessionData | null => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Failed to load session:', error);
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  },

  clearSession: () => {
    localStorage.removeItem(SESSION_KEY);
  }
};
