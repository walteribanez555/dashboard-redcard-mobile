import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DiscountEntity } from '../../../../../../domain/entities/discount.entity';
import { TypeDiscountPipe } from '../../../../shared/pipes/type-discount.pipe';

@Component({
  selector: '[item-list-discount]',
  standalone: true,
  imports: [
    CommonModule,
    TypeDiscountPipe,
  ],
  templateUrl : './item-list-discount.component.html',

})
export class ItemListDiscountComponent {

  @Input() discount! : DiscountEntity

 }
