import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('Authorization');

  // Determine the headers based on the presence of the token
  const headers = new HttpHeaders({
    Authorization: token ? token : 'ExternalUser902010',
    Schema: 'redcard',
  });

  // Clone the request and set the new headers
  const modifiedReq = req.clone({ headers });

  return next(modifiedReq);
};
