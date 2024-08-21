
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Service } from '../../../../modules/dashboard/models/service.model';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {


  constructor() { }

  // id? : number;
  // service_id? : number;
  // servicio_id : number;
  // description : string;
  // destiny : string;
  // img_url : string;
  // status : number;


  // mockData: Service[] = [
  //   {
  //     id: 1,
  //     service_id: 1,
  //     servicio_id: 3,
  //     description: 'Servicio de limpieza',
  //     destiny: 'Limpieza de oficinas',
  //     img_url: 'https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w600/2023/10/free-images.jpg',
  //     status: 2
  //   },
  //   {
  //     id: 2,
  //     service_id: 2,
  //     servicio_id: 3,
  //     description: 'Servicio de mantenimiento',
  //     destiny: 'Mantenimiento de oficinas',
  //     img_url: 'https://redcard-repo-files.s3.amazonaws.com/localflow.jpeg',
  //     status: 1
  //   },
  //   {
  //     id: 3,
  //     service_id: 3,
  //     servicio_id: 4,
  //     description: 'Servicio de jardineria',
  //     destiny: 'Jardineria de oficinas',
  //     img_url: 'https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w600/2023/10/free-images.jpg',
  //     status : 1,
  //   }
  // ]

  apiMobile = environment.apiMobile + '/services';
  private http = inject(HttpClient);


  getServices() : Observable<Service[]> {
    return this.http.get<Service[]>(this.apiMobile);

  }

  getServiceById(id : number) : Observable<Service[]> {
   return this.http.get<Service[]>(`${this.apiMobile}?id=${id}`);
  }

  createService(Service : Service) : Observable<Service> {
    return this.http.post<Service>(this.apiMobile, Service);
  }

  updateService(Service : Service)  {
    return this.http.put<Service>(this.apiMobile, Service);
  }

  deleteService(id : number)  {
    return this.http.delete(`${this.apiMobile}/${id}`);

  }



}
