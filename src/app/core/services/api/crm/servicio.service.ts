import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ServicioCRM } from '../../../models/ServicioCRM.model';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private apiUrl = environment.apiUrl + '/servicios';
  private http = inject(HttpClient);

  constructor() {}
  getAll(): Observable<ServicioCRM[]> {
    return this.http.get<ServicioCRM[]>(this.apiUrl);
  }
  getOne(id: string | number): Observable<ServicioCRM[]> {
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.get<ServicioCRM[]>(this.apiUrl, { params }).pipe(
      map((resp: ServicioCRM[]) => {
        if (resp.length === 0) {
          throw new Error("User Not Found");
        }
        return [resp[0]];
      })
    );

  }
  create(item: ServicioCRM): Observable<ServicioCRM> {
    throw new Error('Method not implemented.');
  }
  update(id: string | number, item: ServicioCRM): Observable<ServicioCRM> {
    throw new Error('Method not implemented.');
  }
  delete(id: string | number): Observable<any> {
    throw new Error('Method not implemented.');
  }
}
