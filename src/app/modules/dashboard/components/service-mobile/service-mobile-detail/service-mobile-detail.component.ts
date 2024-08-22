import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { DetailListener } from '../../../interfaces/Detail.listener';
import { Service } from '../../../models/service.model';
import { FileInputComponent } from '../../../../shared/components/custom-inputs/file-input/file-input.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SelectComponent } from '../../../../shared/components/custom-inputs/select/select.component';
import { ItemList } from '../../../../shared/components/item-list/interfaces/ItemList.interfaces';
import {
  fetchImageAsFile,
  getImageBase64,
} from '../../../../shared/utils/images';
import { ServiceUI } from '../../../models/ui/service-ui.model';

@Component({
  selector: 'app-service-mobile-detail',
  standalone: true,
  imports: [
    CommonModule,
    FileInputComponent,
    ReactiveFormsModule,
    FormsModule,
    SelectComponent,
  ],
  templateUrl: './service-mobile-detail.component.html',
})
export class ServiceMobileDetailComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    fetchImageAsFile(this.service.img_url, this.service.description).then(
      (img) => {

         this.formDetails = new FormGroup({
          plan: new FormControl(this.service.service.servicio_id),
          description: new FormControl(this.service.description),
          image: new FormControl(img),
          status: new FormControl(this.service.status.id),
        });


      }
    );
  }
  private cdr = inject(ChangeDetectorRef);
  items: ItemList[] = [
    {
      id: 1,
      name: 'Activo',
    },
    {
      id: 2,
      name: 'Inactivo',
    },
  ];



  ngOnInit(): void {
    this.cdr.detectChanges();
  }

  @Input() detailListener!: DetailListener;
  @Input() service!: ServiceUI;
  @Input() data : any;

  formDetails : FormGroup | null = null;

  close() {
    this.detailListener.close();
  }

  onSubmit() {
    this.detailListener.submit(this.formDetails!);
  }


  onDelete( ) {
    this.detailListener.delete(this.service.id || this.service.service_id!);
  }
}
