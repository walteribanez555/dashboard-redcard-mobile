import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap, map, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { IntentLogin, ResponseLogin } from '../../../models/IntentLogin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private http = inject(HttpClient);

  private apiUrl = environment.apiAuthUrl + '/sessions';



  login(intentLogin: IntentLogin): Observable<ResponseLogin> {
    return this.http.post<ResponseLogin>(this.apiUrl, intentLogin).pipe(
      tap( (resp ) => {
          localStorage.setItem('client_id', intentLogin.username);
          localStorage.setItem('Authorization', resp.sessionToken);
      })
    );
  }



  getUser() {
    return localStorage.getItem('client_id');
  }

  logout() {
    localStorage.removeItem('client_id');
    localStorage.removeItem('Authorization');
  }


}
