import { Pipe, type PipeTransform } from '@angular/core';

export enum TypeDiscount {
  PERCENTUAL = 1,
  FIXED = 2,
}


@Pipe({
  name: 'appTypeDiscount',
  standalone: true,
})
export class TypeDiscountPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    switch (value) {
      case TypeDiscount.PERCENTUAL:
        return 'Porcentual';
      case TypeDiscount.FIXED:
        return 'Fijo';
      default:
        return 'No definido';
    }
  }

}
