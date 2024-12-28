import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly authTokenKey = 'authToken';
    private readonly userRoleKey = 'userRole';
    private readonly sessionId = 'sessionId';
    private readonly userId = 'userId';

    constructor() { }

    setAuthToken(token: string, role: string, sessionId: string, userId?: string): void {
        sessionStorage.setItem(this.authTokenKey, token);
        sessionStorage.setItem(this.userRoleKey, role);
        sessionStorage.setItem(this.sessionId, sessionId);

        if(userId) {
            sessionStorage.setItem(this.userId, userId);
        }
    }

    getAuthToken(): string | null {
        return sessionStorage.getItem(this.authTokenKey);
    }

    getUserRole(): string | null {
        return sessionStorage.getItem(this.userRoleKey);
    }

    getSessionId(): string | null {
        return sessionStorage.getItem(this.sessionId);
    }

    setSessionId(id: string): void {
        sessionStorage.setItem(this.sessionId, id);
    }

    clearSessionId(): void {
        sessionStorage.removeItem(this.sessionId);
    }
    
    getUserId(): string | null {
        return sessionStorage.getItem(this.userId);
    }
 
    isLoggedIn(): boolean {
        return !!this.getAuthToken();
    }

    logout(): void {
        sessionStorage.removeItem(this.authTokenKey);
        sessionStorage.removeItem(this.userRoleKey);
        sessionStorage.removeItem(this.sessionId);
        sessionStorage.removeItem(this.userId);
    }
}
