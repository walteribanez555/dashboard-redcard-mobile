import { Injectable } from '@angular/core';
import { DiscountRepository } from '../../repositories/discount.repository';
import { DiscountEntity } from '../../entities/discount.entity';

export interface GetDiscountsUseCase {
  execute(): Promise<DiscountEntity[]>;
}

@Injectable({
  providedIn: 'root',
})
export class GetDiscountsService implements GetDiscountsUseCase {
  constructor(private repository: DiscountRepository) {}

  execute(): Promise<DiscountEntity[]> {
    return this.repository.getDiscounts();
  }
}
