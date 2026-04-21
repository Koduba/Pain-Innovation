// User identification and tracking utilities

export interface UserSession {
  identifier: string;
  ip: string;
  sessionId: string;
}

export class UserTracker {
  private static instance: UserTracker;
  private sessionData: UserSession | null = null;

  static getInstance(): UserTracker {
    if (!UserTracker.instance) {
      UserTracker.instance = new UserTracker();
    }
    return UserTracker.instance;
  }

  // Get user session information
  async getUserSession(): Promise<UserSession> {
    if (this.sessionData) {
      return this.sessionData;
    }

    // Get user IP (client-side approximation)
    const ip = await this.getUserIP();
    
    // Get or create session ID
    const sessionId = this.getSessionId();
    
    // Create user identifier
    const identifier = this.createIdentifier(ip, sessionId);

    this.sessionData = {
      identifier,
      ip,
      sessionId
    };

    return this.sessionData;
  }

  // Get user IP (client-side approximation)
  private async getUserIP(): Promise<string> {
    try {
      // Try to get IP from a public API
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || '127.0.0.1';
    } catch (error) {
      console.warn('Could not get user IP:', error);
      return '127.0.0.1';
    }
  }

  // Get or create session ID
  private getSessionId(): string {
    // Check if we're in a browser environment
    if (typeof sessionStorage !== 'undefined') {
      let sessionId = sessionStorage.getItem('survey_session_id');
      
      if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('survey_session_id', sessionId);
      }
      
      return sessionId;
    } else {
      // Server-side fallback - create a consistent session ID
      return 'server_session_' + Date.now();
    }
  }

  // Create consistent user identifier
  private createIdentifier(ip: string, sessionId: string): string {
    // Use session ID as primary identifier, fallback to IP
    return sessionId || ip || 'anonymous_' + Date.now();
  }

  // Clear session (for testing or logout)
  clearSession(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('survey_session_id');
    }
    this.sessionData = null;
  }

  // Get browser fingerprint for additional tracking
  getBrowserFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Browser fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      !!window.sessionStorage,
      !!window.localStorage,
      canvas.toDataURL()
    ].join('|');
    
    return btoa(fingerprint).substring(0, 32);
  }
}
