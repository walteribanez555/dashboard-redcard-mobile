import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-discounts-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './discounts-header.component.html',
})
export class DiscountsHeaderComponent {
  @Output() onAdd = new EventEmitter();

  onAddToggle() {
    this.onAdd.emit();
  }
}
