import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemListDiscountComponent } from '../item-list-discount/item-list-discount.component';
import { DiscountEntity } from '../../../../../../domain/entities/discount.entity';

@Component({
  selector: 'app-list-discounts',
  standalone: true,
  imports: [
    CommonModule,
    ItemListDiscountComponent,
  ],
  templateUrl : './list-discounts.component.html',

})
export class ListDiscountsComponent {

  @Input() discounts : DiscountEntity[] = [];
  @Output() ondiscountSelected = new EventEmitter();


  onSelectTable( discount : DiscountEntity) {
    this.ondiscountSelected.emit(discount);
  }


 }
