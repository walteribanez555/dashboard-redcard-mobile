import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
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
import { switchMap } from 'rxjs';
import { ServicioService } from '../../../../core/services/api/crm/servicio.service';
import { ServicioCRM } from '../../../../core/models/ServicioCRM.model';
import { ServiceUI } from '../../models/ui/service-ui.model';
import { Status } from '../../../../core/constants/status';

@Component({
  selector: 'app-service-mobile',
  standalone: true,
  imports: [
    CommonModule,
    ServiceMobileHeaderComponent,
    ListServiceMobileComponent,
    DcDirective,
  ],
  templateUrl : './service-mobile.component.html',
})
export class ServiceMobileComponent {

  onShowItem : boolean = false;

  listServices : Service[] = [];
  listServiceCRM : ServicioCRM[] = [];
  states = Status.states;
  listServicesUi : ServiceUI[]= [];


  private services = inject(ProductServiceService);
  private servicesCRM = inject(ServicioService);
  private modalService  = inject(ModalService);
  private s3Service = inject(S3Service);

  @ViewChild(DcDirective) dcWrapper!: DcDirective;



  constructor() { }


  detailListener : DetailListener = {
    close: () => {
      this.dcWrapper.viewContainerRef.clear();
      this.onShowItem = false;
    },
    submit: (form : FormGroup) => {
      console.log({value :  form.value});
      this.dcWrapper.viewContainerRef.clear();
      this.onShowItem = false;
    },
    cancel: () => {
      this.dcWrapper.viewContainerRef.clear();
      this.onShowItem = false;
    },
  }


  ngOnInit(): void{
    this.services.getServices().pipe(
      switchMap( (resp ) => {
        this.listServices = [...resp];
        return this.servicesCRM.getAll();
      }),



    ).subscribe({
      next : ( resp ) => {
        this.listServiceCRM = [...resp];

        this.listServicesUi = this.listServices.map( service => {
          const serviceCRM = this.listServiceCRM.filter( serviceCRM => serviceCRM.servicio_id === service.servicio_id)[0];
          return {
            ...service,
            service : serviceCRM,
            status : this.states.find( status => status.id === service.status) || {id : 0, title : ''} as any
          }
        }
        )

        console.log(this.listServicesUi);







      },
      error : ( err ) => {

      },
      complete : ( ) => {

      }
    })
  }

  onDetailService ( service : ServiceUI )  {
    const viewContainerRef = this.dcWrapper.viewContainerRef;

    viewContainerRef.clear();



    const componentFactory = viewContainerRef.createComponent(
      ServiceMobileDetailComponent,
    );
    componentFactory.instance.detailListener = this.detailListener;
    componentFactory.instance.service = service;
    componentFactory.instance.data = {
      items : this.listServiceCRM.map( service => {
        return {
          id : service.servicio_id,
          name : service.servicio
        }
      }
      )
    }

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
            items : this.listServiceCRM.map( service => {
              return {
                id : service.servicio_id,
                name : service.servicio
              }
            }
            )
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

    this.modalService.open(ModalServiceMobileComponent, {
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
    }).subscribe({
      next: ( resp ) => {
        const formResponse = responseModalFormMapper(resp);
        const { Plan, Descripcion, Imagen,Destinos} = formResponse;

        const uniqueId = Math.floor(Math.random() * 1000);
        const fileName = `${uniqueId}-${Imagen.name}`;


        this.s3Service.createItem(Imagen, fileName)!.then( (url) => {
          const newService : Service = {
            servicio_id : Plan,
            description : Descripcion,
            destiny : Destinos,
            img_url : url!,
            status : 1,
          }

          this.services.createService(newService).subscribe({
            next : ( resp ) => {
              this.listServices.push(resp);
              this.listServicesUi.push({
                ...resp,
                service : this.listServiceCRM.filter( service => service.servicio_id === resp.servicio_id)[0],
                status : this.states.find( status => status.id === resp.status) || {id : 0, title : ''} as any
              })
            },
            error : ( err ) => {
              this.s3Service.deleteObject(Imagen.name);

            },
            complete: ( ) => {


            }
          })


        })


      },
      error : ( err ) => {

      },
      complete : ( ) => {

      }


    })


  }

 }
