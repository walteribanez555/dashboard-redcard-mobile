import { inject, Injectable } from '@angular/core';
import { DiscountRepository } from '../../domain/repositories/discount.repository';
import { DiscountEntity } from '../../domain/entities/discount.entity';
import { CreateDiscountDto, UpdateDiscountDto } from '../../domain/dtos';
import { firstValueFrom, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface DiscountResponse {
  id?: number;
  discount_id?: number;
  title: string;
  description: string;
  amount: number;
  type: number;
  imagesUrl: string;
}

export interface DiscountRequest {
  id?: number;
  discount_id?: number;
  title: string;
  description: string;
  amount: number;
  type: number;
  imagesUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiDiscountsService implements DiscountRepository {
  private _apiUrl = environment.apiMobile + 'discounts';
  private _http = inject(HttpClient);

  constructor() {}
  createDiscount(dto: CreateDiscountDto): Promise<DiscountEntity> {
    const fileString: string = dto.images
      .map((file) => file.filename)
      .join(',');
    const request: DiscountRequest = {
      title: dto.title,
      description: dto.description,
      amount: dto.amount,
      type: dto.type,
      imagesUrl: fileString.length == 0 ? 'demo' : fileString,
    };

    return firstValueFrom(
      this._http.post<DiscountResponse>(this._apiUrl, request).pipe(
        map((resp) => {
          return new DiscountEntity(
            resp.id ? resp.id : resp.discount_id!,
            resp.title,
            resp.description,
            resp.amount,
            resp.type,
            resp.imagesUrl.split(',')
          );
        })
      )
    );
  }
  deleteDiscount(id: number): Promise<any> {
    return firstValueFrom(this._http.delete(`${this._apiUrl}?id=${id}`));
  }


  getDiscount(id: number): Promise<DiscountEntity[]> {
    return firstValueFrom(
      this._http.get<DiscountResponse[]>(this._apiUrl + '?id=' + id).pipe(
        map((resp) => {
          return resp.map((discount) => {
            return new DiscountEntity(
              discount.id ? discount.id : discount.discount_id!,
              discount.title,
              discount.description,
              discount.amount,
              discount.type,
              discount.imagesUrl.split(',')
            );
          });
        })
      )
    );
  }
  getDiscounts(): Promise<DiscountEntity[]> {
    return firstValueFrom(
      this._http.get<DiscountResponse[]>(this._apiUrl).pipe(
        map((resp) => {
          return resp.map((discount) => {
            return new DiscountEntity(
              discount.id ? discount.id : discount.discount_id!,
              discount.title,
              discount.description,
              discount.amount,
              discount.type,
              discount.imagesUrl.split(',')
            );
          });
        })
      )
    );
  }

  updateDiscount(dto: UpdateDiscountDto): Promise<DiscountEntity> {
    return firstValueFrom(
      this._http
        .put<DiscountResponse>(this._apiUrl + '?id=' + dto.discount_id, dto)
        .pipe(
          map((resp) => {
            return new DiscountEntity(
              resp.id ? resp.id : resp.discount_id!,
              resp.title,
              resp.description,
              resp.amount,
              resp.type,
              resp.imagesUrl.split(',')
            );
          })
        )
    );
  }
}
