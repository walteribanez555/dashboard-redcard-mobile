import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-links-header',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl : './links-header.component.html',

})
export class LinksHeaderComponent {


  @Output() onAddLinkToggle = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onAddToggle() {
    this.onAddLinkToggle.emit();
  }

 }
