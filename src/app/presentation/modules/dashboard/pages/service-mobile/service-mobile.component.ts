import { CommonModule, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { ServiceMobileHeaderComponent } from '../../components/service-mobile/service-mobile-header/service-mobile-header.component';
import { ListServiceMobileComponent } from '../../components/service-mobile/list-service-mobile/list-service-mobile.component';
import { ProductServiceService } from '../../../../core/services/api/dashboard/productService.service';
import { Service } from '../../models/service.model';
import { DcDirective } from '../../../shared/directives/dc.directive';
import { DetailListener } from '../../interfaces/Detail.listener';
import { ServiceMobileDetailComponent } from '../../components/service-mobile/service-mobile-detail/service-mobile-detail.component';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalService } from '../../../shared/services/Modal.service';
import { InputTextComponent } from '../../../shared/components/form-inputs/input-text/input-text.component';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { DynamicForm } from '../../../shared/types/dynamic.types';
import { ModalServiceMobileComponent } from '../../components/service-mobile/modal-service-mobile/modal-service-mobile.component';
import { ActionType } from '../../../shared/enum/action';
import { InputSelectComponent } from '../../../shared/components/form-inputs/input-select/input-select.component';
import { InputFileComponent } from '../../../shared/components/form-inputs/input-file/input-file.component';
import { S3Service } from '../../../../core/services/aws/s3.service';
import { responseModalFormMapper } from '../../../shared/utils/mappers/response-modal-form/response-modal-form';
import {
  catchError,
  of,
  switchMap,
  throwError,
  timer,
} from 'rxjs';
import { ServicioService } from '../../../../core/services/api/crm/servicio.service';
import { ServicioCRM } from '../../../../core/models/ServicioCRM.model';
import { ServiceUI } from '../../models/ui/service-ui.model';
import { Status } from '../../../../core/constants/status';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { AuthComponent } from '../../../auth/auth.component';
import { DialogService } from '../../../shared/services/Dialog.service';
import { Dialog } from '../../../shared/models/dialog';
import { DialogPosition, DialogType } from '../../../shared/enum/dialog';
import { CoverageFacadeService } from '../../../../../application/facade/CoverageFacade.service';

// export interface Dialog {
//   typeDialog? : DialogType,
//   options? : DialogOptions,
//   data ? : DialogData,
//   listener ? : Observable<any>,
// }

// export interface DialogData{
//   title : string,
//   description : string,
//   icon : string,
// }

// export interface DialogOptions{
//   withActions? : boolean;
//   position? : DialogPosition[],
//   timeToShow? : Observable<0>,
//   withBackground? : boolean;
//   colorIcon? : string,
// }

@Component({
  selector: 'app-service-mobile',
  standalone: true,
  imports: [
    CommonModule,
    ServiceMobileHeaderComponent,
    ListServiceMobileComponent,
    DialogComponent,
    DcDirective,
    AuthComponent,
    NgFor,
  ],
  templateUrl: './service-mobile.component.html',
})
export class ServiceMobileComponent {
  onShowItem: boolean = false;

  listServices: Service[] = [];
  listServiceCRM: ServicioCRM[] = [];
  states = Status.states;
  listServicesUi: ServiceUI[] = [];

  private services = inject(ProductServiceService);
  private servicesCRM = inject(ServicioService);
  private modalService = inject(ModalService);
  private s3Service = inject(S3Service);
  private dialogService = inject(DialogService);

  private coverageFacade = inject(CoverageFacadeService)

  isLoadingListItems : boolean = true;

  @ViewChild(DcDirective) dcWrapper!: DcDirective;

  constructor() {}

  coverages$ = this.coverageFacade.coverages;

  detailListener: DetailListener<ServiceUI> = {
    close: () => {
      this.dcWrapper.viewContainerRef.clear();
      this.onShowItem = false;
    },
    submit: async (form: FormGroup) => {
      this.dcWrapper.viewContainerRef.clear();
      this.onShowItem = false;

      const { id, plan, description, image, status } = form.value;

      const statusValue = status;

      const index = this.listServicesUi.findIndex(
        (service) => service.service_id === id || service.id === id
      );

      const item = this.listServicesUi[index];

      const urlImg = this.listServicesUi[index].img_url;

      const fileName = urlImg.substring(urlImg.lastIndexOf('/') + 1);

      const uniqueId = Math.floor(Math.random() * 1000);
      const type = image.name.split('.');
      const newfileName = `${uniqueId}-${plan}`;

      const fileExtension = type[type.length - 1];

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

      this.dialogService
        .open(dialog)
        .pipe(
          switchMap((resp: any) => {
            return of(null);
          }),
          switchMap((resp) => {
            this.isLoadingListItems = true;

            return this.s3Service.deleteObject(fileName);
          }),
          switchMap((resp) => {
            return this.s3Service.createItem(
              image,
              newfileName + '.' + fileExtension
            );
          }),
          switchMap((url: string) => {
            const updatedService: Service = {
              id: id,
              service_id: id,
              servicio_id: plan,
              description,
              status: statusValue,
              destiny: item.destiny,
              img_url: url!,
            };
            return this.services.updateService(updatedService);
          })
        )
        .subscribe({
          next: (resp) => {
            const serviceCRM = this.listServiceCRM.find(
              (service) => service.servicio_id == id
            );
            const updatedItem: ServiceUI = {
              ...resp,
              service: serviceCRM!,
              status:
                this.states.find(
                  (statusType) => statusType.id === statusValue
                ) || ({ id: 0, title: '' } as any),
            };
            this.listServicesUi[index] = updatedItem;

            dialog.typeDialog = DialogType.isSuccess;
            dialog.data = {
              title: 'Actualizado',
              description: 'El servicio ha sido actualizado correctamente',
              icon: 'assets/icons/heroicons/outline/check-badge.svg',
            };
            dialog.options = {
              withActions: false,
              position: [DialogPosition.top, DialogPosition.right],
              withBackground: false,
              colorIcon: 'text-green-700',
              timeToShow: timer(2000),
            };
            this.dialogService.open(dialog);

          },
          error: (err) => {
            console.log({ err });

          },
          complete: () => {
            this.isLoadingListItems = false;

          },
        });
    },
    cancel: () => {
      this.dcWrapper.viewContainerRef.clear();
      this.onShowItem = false;
    },

    delete: (id : number | ServiceUI) => {
      this.dcWrapper.viewContainerRef.clear();
      this.onShowItem = false;

      const index = this.listServicesUi.findIndex(
        (service) => service.service_id === id || service.id === id
      );

      const urlImg = this.listServicesUi[index].img_url;

      const fileName = urlImg.substring(urlImg.lastIndexOf('/') + 1);

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

      this.dialogService
        .open(dialog)
        .pipe(
          switchMap((resp: any) => {
            return of(null);
          }),
          switchMap((resp: any) => {
            return this.s3Service.deleteObject(fileName);
          }),
          switchMap((resp: any) => {
            return this.services.deleteService(id as number);
          })
        )
        .subscribe({
          next: (resp) => {
            dialog.typeDialog = DialogType.isSuccess;
            (dialog.data = {
              title: 'Eliminado',
              description: 'El servicio ha sido eliminado correctamente',
              icon: 'assets/icons/heroicons/outline/check-badge.svg',
            }),
              (dialog.options = {
                withActions: false,
                position: [DialogPosition.top, DialogPosition.right],
                withBackground: false,
                colorIcon: 'text-green-700',
                timeToShow: timer(2000),
              });
            this.dialogService.open(dialog);
            this.listServicesUi.splice(index, 1);
          },
          error: (err) => {
            console.log({ err });
          },
          complete: () => {
            console.log({ fileName });
          },
        });

      // this.s3Service.getObject(fileName)?.then((resp => {
      //   console.log({resp});
      // }))
    },
  };

  ngOnInit(): void {
    this.services
      .getServices()
      .pipe(
        switchMap((resp) => {
          this.listServices = [...resp];
          return this.servicesCRM.getAll();
        })
      )
      .subscribe({
        next: (resp) => {
          this.listServiceCRM = [...resp];

          this.listServicesUi = this.listServices.map((service) => {
            const serviceCRM = this.listServiceCRM.filter(
              (serviceCRM) => serviceCRM.servicio_id === service.servicio_id
            )[0];
            return {
              ...service,
              service: serviceCRM,
              status:
                this.states.find((status) => status.id === service.status) ||
                ({ id: 0, title: '' } as any),
            };
          });

          this.isLoadingListItems = false;
        },
        error: (err) => {},
        complete: () => {},
      });
  }

  onDetailService(service: ServiceUI) {
    const viewContainerRef = this.dcWrapper.viewContainerRef;

    viewContainerRef.clear();

    const componentFactory = viewContainerRef.createComponent(
      ServiceMobileDetailComponent
    );
    componentFactory.instance.detailListener = this.detailListener;
    componentFactory.instance.service = service;
    componentFactory.instance.data = {
      items: this.listServiceCRM.map((service) => {
        return {
          id: service.servicio_id,
          name: service.servicio,
        };
      }),
    };

    this.onShowItem = true;
  }


  onAddService() {
    const serviceForm: DynamicForm = {
      component: FormTemplateComponent,
      data: {
        title: 'Detalles del servicio',
        description: 'Especificaciones necesarias del servicio',
      },
      dynamicFields: [
        {
          component: InputSelectComponent,
          data: {
            title: 'Plan',
            items: this.listServiceCRM.map((service) => {
              return {
                id: service.servicio_id,
                name: service.servicio,
              };
            }),
          },
          fieldFormControl: new FormControl(''),
        },
        {
          component: InputTextComponent,
          data: {
            placeholder: 'Descripcion general del plan',
            title: 'Descripcion',
          },
          fieldFormControl: new FormControl(''),
        },
        {
          component: InputTextComponent,
          data: {
            placeholder: 'Destinos que se podran visualizar',
            title: 'Destinos',
          },
          fieldFormControl: new FormControl(''),
        },
      ],
    };

    const serviceImageForm: DynamicForm = {
      component: FormTemplateComponent,
      data: {
        title: 'Imagen',
        description: 'Selecciona la imagen a agregar',
      },
      dynamicFields: [
        {
          component: InputFileComponent,
          data: {
            title: 'Imagen',
          },
          fieldFormControl: new FormControl(''),
        },
      ],
    };

    this.modalService
      .open(ModalServiceMobileComponent, {
        title: `Agregar Plan`,
        size: 'sm',
        forms: [serviceForm, serviceImageForm],
        data: {},
        icon: 'assets/icons/heroicons/outline/plus.svg',
        actions: [
          {
            action: ActionType.Create,
            title: 'Agregar',
          },
        ],
      })
      .pipe(
        switchMap((resp) => {
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

          return this.dialogService.open(dialog).pipe(
            switchMap((respDialog) => {
              return of(resp);
            })
          );
        }),
        switchMap((resp) => {
          this.isLoadingListItems = true;

          const formResponse = responseModalFormMapper(resp);
          const { Plan, Descripcion, Imagen, Destinos } = formResponse;

          const uniqueId = Math.floor(Math.random() * 1000);
          const type = Imagen.name.split('.');
          const fileName = `${uniqueId}-${Plan}`;

          const fileExtension = type[type.length - 1];
          return this.s3Service
            .createItem(Imagen, fileName + '.' + fileExtension)
            .pipe(
              switchMap((url: string) => {
                const newService: Service = {
                  servicio_id: Plan,
                  description: Descripcion,
                  destiny: Destinos,
                  img_url: url!,
                  status: 1,
                };
                return of(newService);
              }),

            );
        }),
        switchMap((newService: Service) => {
          return this.services.createService(newService).pipe(
            switchMap((resp ) => {
              return of(newService);
            }),
            catchError((err) => {
              return throwError({newService, err});
            })
          )
        }),
      )
      .subscribe({
        next: (resp) => {
          this.listServices.push(resp);
          this.listServicesUi.push({
            ...resp,
            service: this.listServiceCRM.filter(
              (service) => service.servicio_id === resp.servicio_id
            )[0],
            status:
              this.states.find((status) => status.id === resp.status) ||
              ({ id: 0, title: '' } as any),
          });
        },
        complete: () => {
          this.isLoadingListItems = false;

        },
        error: (err) => {

          const dialog: Dialog = {
            typeDialog: DialogType.isAlert,
            data: {
              title: 'Error',
              description: 'Ha ocurrido un error al agregar el servicio',
              icon: 'assets/icons/heroicons/outline/x-circle.svg',
            },
            options: {
              withActions: false,
              position: [DialogPosition.top, DialogPosition.right],
              withBackground: false,
              colorIcon: 'text-red-700',
              timeToShow: timer(2000),
            },
          };

          this.dialogService.open(dialog);

          if(err.newService){
            this.s3Service.deleteObject(err.newService.img_url.split('/').pop()!);
          }



        },
      });
  }
}
