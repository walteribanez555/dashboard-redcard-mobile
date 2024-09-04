import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Link } from '../../../models/link.model';
import { ItemListLinkComponent } from '../item-list-link/item-list-link.component';
import { Status } from '../../../../../core/constants/status';
import { LinkUI } from '../../../models/ui/link-ui.model';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-list-links',
  standalone: true,
  imports: [
    CommonModule,
    ItemListLinkComponent,
    SvgIconComponent
  ],
  templateUrl : './list-links.component.html',
})
export class ListLinksComponent {

  @Input() links : LinkUI[] = [];
  @Input() states : Status[] = [];
  @Output() onSelectLink = new EventEmitter();
  @Input() isLoading = true;


  onSelectTable(item : LinkUI) {
    this.onSelectLink.emit(item);
  }


 }
