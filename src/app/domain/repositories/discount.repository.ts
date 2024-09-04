import { CreateDiscountDto, UpdateDiscountDto } from "../dtos";
import { DiscountEntity } from "../entities/discount.entity";


export abstract class DiscountRepository {
  abstract createDiscount(dto : CreateDiscountDto): Promise<DiscountEntity>;
  abstract deleteDiscount(id : number): Promise<any>;
  abstract getDiscount(id : number): Promise<DiscountEntity[]>;
  abstract getDiscounts(): Promise<DiscountEntity[]>;
  abstract updateDiscount(dto : UpdateDiscountDto) : Promise<DiscountEntity>;
}
