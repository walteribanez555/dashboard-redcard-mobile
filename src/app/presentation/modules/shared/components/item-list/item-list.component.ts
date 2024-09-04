import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ItemList } from './interfaces/ItemList.interfaces';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl : './item-list.component.html',
})
export class ItemListComponent implements ItemList {
  @Input() id!: number;
  @Input() name!: string;




}
