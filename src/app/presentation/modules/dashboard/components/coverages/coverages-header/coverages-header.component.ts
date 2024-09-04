import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-coverages-header',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl : './coverages-header.component.html',
})
export class CoveragesHeaderComponent {


  @Output() onAddToggleAction = new EventEmitter();


  onAddToggle() {
    this.onAddToggleAction.emit();
  }



 }
