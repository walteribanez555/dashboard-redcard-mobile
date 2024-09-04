import { CommonModule } from '@angular/common';
import {  Component, Input, Output } from '@angular/core';
import { Service } from '../../../models/service.model';
import { ServiceUI } from '../../../models/ui/service-ui.model';

@Component({
  selector: '[item-list-service-mobile]',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl : './item-list-service-mobile.component.html',

})
export class ItemListServiceMobileComponent {

  @Input() serviceItem! : ServiceUI;



 }
