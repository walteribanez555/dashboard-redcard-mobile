import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemListServiceMobileComponent } from '../item-list-service-mobile/item-list-service-mobile.component';
import { Service } from '../../../models/service.model';
import { ServiceUI } from '../../../models/ui/service-ui.model';

@Component({
  selector: 'app-list-service-mobile',
  standalone: true,
  imports: [
    CommonModule,
    ItemListServiceMobileComponent,
  ],
  templateUrl : './list-service-mobile.component.html',

})
export class ListServiceMobileComponent {

  @Input() listServices : ServiceUI[] = [];

  @Output() onSelectService = new EventEmitter();


  onSelectItem( item : ServiceUI ) {
    this.onSelectService.emit(item);
  }

}
