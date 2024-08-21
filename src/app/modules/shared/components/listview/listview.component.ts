import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemList } from '../item-list/interfaces/ItemList.interfaces';
import { ListView } from './interfaces/ListView';
import { ItemListComponent } from '../item-list/item-list.component';

@Component({
  selector: 'app-listview',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    ItemListComponent,
  ],
  templateUrl : './listview.component.html',
})
export class ListviewComponent implements ListView, OnInit {
  ngOnInit(): void {
    this.filteredItems = this.items;

    this.filterListener?.subscribe({
      next: (term: string) => {
        this.filterItems(term);
      },
    });
  }

  @Input() isHidden: boolean = false;
  @Input() onSelectItem!: (item: ItemList) => void;
  @Input() items: ItemList[] = [];
  @Input() filterListener?: Observable<string>;
  filteredItems: ItemList[] = [];

  filterItems(term: string) {
    this.filteredItems = this.items.filter((item) =>
      item.name.toLowerCase().startsWith(term.toLowerCase())
    );
  }

  onSelect(item: ItemList) {
    this.onSelectItem(item);
  }
}
