import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // Replace with your actual username and password or retrieve them from a service
  private readonly username = 'yourUsername';
  private readonly password = 'yourPassword';

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if the request is a POST request
    if (request.method === 'POST') {
      // Clone the request and add the authorization header
      const clonedRequest = request.clone({
        setHeaders: {
          'Authorization': 'Basic ' + btoa(`${this.username}:${this.password}`)
        }
      });
      return next.handle(clonedRequest);
    }
    
    // Pass the request through unchanged for non-POST requests
    return next.handle(request);
  }
}
