import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../services/cache.service';

const apiToCache: string[] = [
    'students',
    'auth',
    'fee',
    'pages',
    'session',
    'standard',
    'subject',
    'teachers',
    'transactions',
    'vehicles',
    'tc'
]

@Injectable()
export class CachingInterceptor implements HttpInterceptor {

    constructor(private cacheService: CacheService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const endpoint = req.urlWithParams.split('/api/')[1];
 
        const presentInApiToCache = apiToCache.some(x => x == endpoint);

        if (req.method !== 'GET' || !presentInApiToCache) {           
            return next.handle(req);
        }

        const cachedResponse = this.cacheService.get(req);
        if (cachedResponse) {
            return of(cachedResponse);
        }

        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    this.cacheService.put(req, event);
                }
            })
        );
    }
}
