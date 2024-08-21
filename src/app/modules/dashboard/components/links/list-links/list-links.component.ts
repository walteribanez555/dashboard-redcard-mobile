import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Link } from '../../../models/link.model';
import { ItemListLinkComponent } from '../item-list-link/item-list-link.component';
import { Status } from '../../../../../core/constants/status';
import { LinkUI } from '../../../models/ui/link-ui.model';

@Component({
  selector: 'app-list-links',
  standalone: true,
  imports: [
    CommonModule,
    ItemListLinkComponent,
  ],
  templateUrl : './list-links.component.html',
})
export class ListLinksComponent {

  @Input() links : LinkUI[] = [];
  @Input() states : Status[] = [];
  @Output() onSelectLink = new EventEmitter();


  onSelectTable(item : LinkUI) {
    this.onSelectLink.emit(item);
  }


 }
