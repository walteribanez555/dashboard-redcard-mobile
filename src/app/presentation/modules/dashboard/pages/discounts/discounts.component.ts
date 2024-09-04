import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ListDiscountsComponent } from '../../components/discounts/list-discounts/list-discounts.component';
import { DiscountsHeaderComponent } from '../../components/discounts/discounts-header/discounts-header.component';
import { DetailDiscountComponent } from '../../components/discounts/detail-discount/detail-discount.component';
import { DiscountFacadeService } from '../../../../../application/facade/DiscountFacade.service';
import { DialogService } from '../../../shared/services/Dialog.service';
import { ModalService } from '../../../shared/services/Modal.service';
import { FormControl } from '@angular/forms';
import { InputTextComponent } from '../../../shared/components/form-inputs/input-text/input-text.component';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { DynamicForm } from '../../../shared/types/dynamic.types';
import { ModalDiscountsComponent } from '../../components/discounts/modal-discounts/modal-discounts.component';
import { ActionType } from '../../../shared/enum/action';
import { responseModalFormMapper } from '../../../shared/utils/mappers/response-modal-form/response-modal-form';
import { InputMultipleFilesComponent } from '../../../shared/components/form-inputs/input-multiple-files/input-multiple-files.component';
import { DiscountEntity } from '../../../../../domain/entities/discount.entity';
import { DcDirective } from '../../../shared/directives/dc.directive';
import { DetailListener } from '../../interfaces/Detail.listener';
import { ItemList } from '../../../shared/components/item-list/interfaces/ItemList.interfaces';
import { SelectComponent } from '../../../shared/components/custom-inputs/select/select.component';
import { InputSelectComponent } from '../../../shared/components/form-inputs/input-select/input-select.component';

@Component({
  selector: 'app-discounts',
  standalone: true,
  imports: [
    CommonModule,
    ListDiscountsComponent,
    DiscountsHeaderComponent,
    DetailDiscountComponent,
    DcDirective
  ],
  templateUrl: './discounts.component.html',
})
export class DiscountsComponent implements OnInit{

  @ViewChild(DcDirective) dcWrapper!: DcDirective;
  onShowItem: boolean = false;


  items: ItemList[] = [
    {
      id: 1,
      name: 'Porcentual',
    },
    {
      id: 2,
      name: 'Fijo',
    },
  ];

  private facadeService = inject(DiscountFacadeService);
  private dialogService = inject(DialogService);
  private modalService = inject(ModalService);

  discounts$ = this.facadeService.discounts;

  ngOnInit(): void {}

  onAddDiscount() {
    this.modalService
      .open(ModalDiscountsComponent, {
        title: `Agregar Cobertura`,
        size: 'sm',
        forms: [this.generateDiscountForm(), this.generateFileForm()],
        data: {},
        icon: 'assets/icons/heroicons/outline/plus.svg',
        actions: [
          {
            action: ActionType.Create,
            title: 'Agregar',
          },
        ],
      })
      .subscribe({
        next: (resp) => {
          const { Descripcion, Monto, Tipo, Titulo, Archivos } = responseModalFormMapper(resp);




          this.facadeService.addItem({
            description : Descripcion,
            title : Titulo,
            type : Tipo,
            amount : Monto,
            images : Archivos,
          });

        },
        error: (err) => {
          console.log({ err });
        },
        complete: () => {},
      });
  }

  generateDiscountForm() {
    const discountForm: DynamicForm = {
      component: FormTemplateComponent,
      data: {
        title: 'Agregar nueva descuento',
        description: 'Especificaciones necesarias del descuento a agregar',
      },
      dynamicFields: [
        {
          component: InputTextComponent,
          data: {
            placeholder: 'Nueva descuento',
            title: 'Titulo',
          },
          fieldFormControl: new FormControl(''),
        },
        {
          component: InputTextComponent,
          data: {
            placeholder: 'descripcion de la cobertura',
            title: 'Descripcion',
          },
          fieldFormControl: new FormControl(''),
        },
        {
          component: InputSelectComponent,
          data: {
            placeholder: 'Nueva descuento',
            title: 'Tipo',
            items : this.items,
          },
          fieldFormControl: new FormControl(''),
        },
        {
          component: InputTextComponent,
          data: {
            placeholder: 'Nueva descuento',
            title: 'Monto',
          },
          fieldFormControl: new FormControl(''),
        },

      ],
    };

    return discountForm;
  }

  generateFileForm() {
    const fileForm: DynamicForm = {
      component: FormTemplateComponent,
      data: {
        title: 'Agregar archivos',
        description: 'Agregue los archivos necesarios para la cobertura',
      },
      dynamicFields: [
        {
          component: InputMultipleFilesComponent,
          data: {
            placeholder: 'Agregar archivos',
            title: 'Archivos',
          },
          fieldFormControl: new FormControl(),
        },
      ],
    };
    return fileForm;
  }

  detailListener: DetailListener<DiscountEntity> = {
    close : ( ) => {
      this.dcWrapper.viewContainerRef.clear();
      this.onShowItem = false;
    },
    submit : ( form ) => {

    },
    delete : ( entity ) => {

    },
    cancel  : ( ) => {
      this.dcWrapper.viewContainerRef.clear();
      this.onShowItem = false;
    }

  }


  onDetailDiscount(discount :DiscountEntity) {
    const viewContainerRef = this.dcWrapper.viewContainerRef;

    viewContainerRef.clear();

    const componentFactory = viewContainerRef.createComponent(
      DetailDiscountComponent,
    );
    componentFactory.instance.detailListener = this.detailListener;
    componentFactory.instance.discountEntity = discount;

    this.onShowItem = true;

  }

}
