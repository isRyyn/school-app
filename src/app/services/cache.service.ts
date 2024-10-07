import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { baseUrl } from './app-constants';

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    
    private cache = new Map<string, HttpResponse<any>>();

    get(req: HttpRequest<any>): HttpResponse<any> | null {
        return this.cache.get(req.urlWithParams) || null;
    }

    put(req: HttpRequest<any>, response: HttpResponse<any>): void {
        this.cache.set(req.urlWithParams, response);
    }

    clear(): void {
        this.cache.clear();
    }

    clearUrl(apiString: string): void {
        this.cache.delete(`${baseUrl}/${apiString}`);
    }

    addResponseInCache(apiString: string, response: any): void {
        const httpRequest = new HttpRequest('GET', `${baseUrl}/${apiString}`);
        const httpResponse = new HttpResponse({
            body: response,
            status: 200,
            statusText: 'OK'
        });
        this.put(httpRequest, httpResponse);
    }
}
