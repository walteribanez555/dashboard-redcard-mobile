import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { DialogType, DialogPosition } from '../../../shared/enum/dialog';
import { Dialog } from '../../../shared/models/dialog';
import { Subject, timer } from 'rxjs';
import { StatusAction } from '../../../../../application/enums/Status.enum';

@Component({
  selector: 'app-discounts',
  standalone: true,
  imports: [
    CommonModule,
    ListDiscountsComponent,
    DiscountsHeaderComponent,
    DetailDiscountComponent,
    DcDirective,
  ],
  templateUrl: './discounts.component.html',
})
export class DiscountsComponent implements OnInit {
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
  onLoading$ = this.facadeService.statusAction;
  private dialogNotifier = new Subject();

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
          const { Descripcion, Monto, Tipo, Titulo, Archivos } =
            responseModalFormMapper(resp);

          this.facadeService.addItem({
            description: Descripcion,
            title: Titulo,
            type: Tipo,
            amount: Monto,
            images: Archivos,
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
            items: this.items,
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
    close: () => {
      this.dcWrapper.viewContainerRef.clear();
      this.onShowItem = false;
    },
    submit: (form) => {
      this.dcWrapper.viewContainerRef.clear();
      this.onShowItem = false;

      const dialog = {
        typeDialog: DialogType.isAlert,
        data: {
          title: 'Advertencia',
          description: 'Estas seguro de realizar esta accion',
          icon: 'assets/icons/heroicons/outline/exclamation.svg',
        },
        options: {
          withActions: true,
          position: [DialogPosition.center],
          withBackground: true,
          colorIcon: 'text-red-500',
        },
      };

      this.dialogService.open(dialog).subscribe((resp) => {
        console.log({ form });
        const { amount, description, files, id, previousFiles, title, type } = form.value;
        this.facadeService.updateItem({
          discountId : id,
          description,
          title,
          type,
          value:  amount,
          images: files,
          previousFiles,
        });
      });
    },
    delete: (entity) => {
      this.dcWrapper.viewContainerRef.clear();
      this.onShowItem = false;

      const dialog: Dialog = {
        typeDialog: DialogType.isAlert,
        data: {
          title: 'Advertencia',
          description: 'Estas seguro de realizar esta accion',
          icon: 'assets/icons/heroicons/outline/exclamation.svg',
        },
        options: {
          withActions: true,
          position: [DialogPosition.center],
          withBackground: true,
          colorIcon: 'text-red-500',
        },
      };

      this.dialogService.open(dialog).subscribe((resp) => {
        this.facadeService.deleteItem(entity as DiscountEntity);
      });
    },
    cancel: () => {
      this.dcWrapper.viewContainerRef.clear();
      this.onShowItem = false;
    },
  };

  onDetailDiscount(discount: DiscountEntity) {
    const viewContainerRef = this.dcWrapper.viewContainerRef;

    viewContainerRef.clear();

    const componentFactory = viewContainerRef.createComponent(
      DetailDiscountComponent
    );
    componentFactory.instance.detailListener = this.detailListener;
    componentFactory.instance.discountEntity = discount;

    this.onShowItem = true;
  }

  constructor() {
    effect(() =>  {
      switch (this.onLoading$()) {
        case StatusAction.LOADING:
          const dialog: Dialog = {
            typeDialog: DialogType.isLoading,
            listener: this.dialogNotifier,
            data: {
              title: 'Cargando',
              description: 'Espere un momento por favor',
              icon: 'assets/icons/loading.svg',
            },
            options: {
              withActions: false,
              withBackground: true,
              position: [DialogPosition.center],
              colorIcon: 'text-primary',
            },
          };

          this.dialogService.open(dialog);
          break;
        case StatusAction.SUCCESS:
          this.dialogNotifier.next(null);
          //Show Success dialog
          const dialogSuccess: Dialog = {
            typeDialog: DialogType.isSuccess,
            data: {
              title: 'Operacion Exitosa',
              description: 'La operacion se ha completado con exito',
              icon: 'assets/icons/heroicons/outline/check-badge.svg',
            },
            options: {
              withBackground: false,
              position: [DialogPosition.top, DialogPosition.right],
              colorIcon: 'text-green-500',
              timeToShow: timer(2000),
            },
          };

          this.dialogService.open(dialogSuccess);

          break;

        case StatusAction.INITIAL:
          this.dialogNotifier.next(null);
          break;

        default:
          this.dialogNotifier.next(null);
      }
    })

  }
}
