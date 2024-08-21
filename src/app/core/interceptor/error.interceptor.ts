import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { errorHandler } from '../handlers/error.handler';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          console.log(`Error event`);
        } else {
          const errorType = errorHandler(error);
          console.log(error);

          switch (errorType) {
            case HttpStatusCode.BadRequest:
              // Handle BadRequest
              break;

            case 498:
              // Handle custom error code (e.g., session expired)
              localStorage.removeItem('Authorization');
              localStorage.removeItem('client_id');
              // Redirect or handle session expiration
              // Note: Redirecting or handling routing is not part of the function-based interceptor here
              break;

            default:
              // Handle other error codes or cases
              break;
          }

          throw new Error("An error occurred, please try again.");
        }
      } else {
        console.log('An unexpected error occurred');
      }
      return throwError(() => new Error(error.statusText));
    })
  );
};
