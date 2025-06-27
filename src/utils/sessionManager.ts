export const sessionManager = {
  saveSession: (data: any) => {
    try {
      localStorage.setItem('lastSession', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  },

  loadSession: () => {
    try {
      const session = localStorage.getItem('lastSession');
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Failed to load session:', error);
      localStorage.removeItem('lastSession');
      return null;
    }
  },

  clearSession: () => {
    localStorage.removeItem('lastSession');
  }
};
