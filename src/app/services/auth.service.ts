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
        localStorage.setItem(this.authTokenKey, token);
        localStorage.setItem(this.userRoleKey, role);
        localStorage.setItem(this.sessionId, sessionId);

        if(userId) {
            localStorage.setItem(this.userId, userId);
        }
    }

    getAuthToken(): string | null {
        return localStorage.getItem(this.authTokenKey);
    }

    getUserRole(): string | null {
        return localStorage.getItem(this.userRoleKey);
    }

    getSessionId(): string | null {
        return localStorage.getItem(this.sessionId);
    }
    
    getUserId(): string | null {
        return localStorage.getItem(this.userId);
    }
 
    isLoggedIn(): boolean {
        return !!this.getAuthToken();
    }

    logout(): void {
        localStorage.removeItem(this.authTokenKey);
        localStorage.removeItem(this.userRoleKey);
        localStorage.removeItem(this.sessionId);
        localStorage.removeItem(this.userId);
    }
}
