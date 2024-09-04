import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemListServiceMobileComponent } from '../item-list-service-mobile/item-list-service-mobile.component';
import { Service } from '../../../models/service.model';
import { ServiceUI } from '../../../models/ui/service-ui.model';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-list-service-mobile',
  standalone: true,
  imports: [
    CommonModule,
    ItemListServiceMobileComponent,
    SvgIconComponent,
  ],
  templateUrl : './list-service-mobile.component.html',

})
export class ListServiceMobileComponent {

  @Input() listServices : ServiceUI[] = [];
  @Input() isLoading : boolean = true;

  @Output() onSelectService = new EventEmitter();


  onSelectItem( item : ServiceUI ) {
    this.onSelectService.emit(item);
  }

}
