import { Injectable } from '@angular/core';
import { DiscountRepository } from '../../repositories/discount.repository';
import { DiscountEntity } from '../../entities/discount.entity';

export interface GetDiscountUseCase {
  execute(id: number): Promise<DiscountEntity[]>;
}

@Injectable({
  providedIn: 'root',
})
export class GetDiscountService implements GetDiscountUseCase {
  constructor(private repository: DiscountRepository) {}

  execute(id: number): Promise<DiscountEntity[]> {
    return this.repository.getDiscount(id);
  }
}
