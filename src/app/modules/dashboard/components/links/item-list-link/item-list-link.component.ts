import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Link } from '../../../models/link.model';
import { LinkUI } from '../../../models/ui/link-ui.model';

@Component({
  selector: '[item-list-link]',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
  ],
  templateUrl : './item-list-link.component.html',

})
export class ItemListLinkComponent {

  @Input() link! : LinkUI;



 }
