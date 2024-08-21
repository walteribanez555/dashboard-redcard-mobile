import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-service-mobile-header',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl : './service-mobile-header.component.html',

})
export class ServiceMobileHeaderComponent {

  @Output() onAddServiceToggle = new EventEmitter();


  constructor() { }

  ngOnInit(): void{

  }

  onAddToggle() {
    this.onAddServiceToggle.emit();
  }

 }
