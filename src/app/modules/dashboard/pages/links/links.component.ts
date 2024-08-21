import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { LinksHeaderComponent } from '../../components/links/links-header/links-header.component';
import { ListLinksComponent } from '../../components/links/list-links/list-links.component';
import { LinkService } from '../../../../core/services/api/dashboard/link.service';
import { Link } from '../../models/link.model';
import { ItemListLinkComponent } from '../../components/links/item-list-link/item-list-link.component';
import { DetailListener } from '../../interfaces/Detail.listener';
import { DcDirective } from '../../../shared/directives/dc.directive';
import { LinkDetailComponent } from '../../components/links/link-detail/link-detail.component';
import { FormControl, FormGroup } from '@angular/forms';
import { Status } from '../../../../core/constants/status';
import { LinkUI } from '../../models/ui/link-ui.model';
import { State } from '../../../../core/models/status.model';
import { ModalService } from '../../../shared/services/Modal.service';
import { InputTextComponent } from '../../../shared/components/form-inputs/input-text/input-text.component';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { DynamicForm } from '../../../shared/types/dynamic.types';
import { ModalLinkComponent } from '../../components/links/modal-link/modal-link.component';
import { ActionType } from '../../../shared/enum/action';
import { responseModalFormMapper } from '../../../shared/utils/mappers/response-modal-form/response-modal-form';

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [
    CommonModule,
    LinksHeaderComponent,
    ListLinksComponent,
    DcDirective
  ],
  templateUrl : './links.component.html',
})
export class LinksComponent implements OnInit {
  ngOnInit(): void {
    this.linkService.getLinks().subscribe({
      next : ( resp ) => {


        this.links = [...resp.map( link => {
          const status = this.states.find( status => status.id === link.status) || {id : 0, title : ''} as State ;
          return {
            ...link,
            status
          }
        })];
      },
      error : ( err ) => {

      },
      complete : ( ) => {

      }
    })
  }


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



  states = Status.states;
  onShowItem : boolean = false;
  private linkService = inject(LinkService);
  private modalService  = inject(ModalService);


  links : LinkUI[] = [];
  @ViewChild(DcDirective) dcWrapper!: DcDirective;

  onAddLink() {
    const linkForm: DynamicForm = {
      component: FormTemplateComponent,
      data: {
        title: 'Detalles del nuevo link a agregar',
        description: 'Especificaciones necesarias del link a agregar',
      },
      dynamicFields: [
        {
          component: InputTextComponent,
          data: {
            placeholder: 'Nuevo Enlace',
            title: 'Titulo',
          },
          fieldFormControl: new FormControl(''),
        },
        {
          component: InputTextComponent,
          data: {
            placeholder: 'Descripcion general del enlace',
            title: 'Subtitulo',
          },
          fieldFormControl: new FormControl(''),
        },
        {
          component: InputTextComponent,
          data: {
            placeholder: 'https://google.com',
            title: 'url',
          },
          fieldFormControl: new FormControl(''),
        },
      ],
    };

    this.modalService.open(ModalLinkComponent, {
      title: `Agregar Enlace`,
      size: 'sm',
      forms: [linkForm],
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
        // console.log({value : formResponse.Almacen});
        // const { warehouseName } = formResponse['almacen'];
        // console.log({warehouseName});

        const { Titulo, Subtitulo, url} = formResponse;

        const newLink : Link  = {
          title: Titulo,
          subtitle: Subtitulo,
          url,
          status: 1,
        }


        this.linkService.createLink(newLink).subscribe({
          next: ( resp ) => {
            this.links.push({
              ...resp,
              status: this.states.find( status => status.id === resp.status) || {id : 0, title : ''} as State
            })
          },
          error : ( err ) => {

          },
          complete : ( ) => {

          }
        })



      },
      error: ( err ) => {
        console.log({err});
      },
      complete: () => {
        console.log('Complete');
      }
    })






  }



  onDetailLink( link : LinkUI) {

    const viewContainerRef = this.dcWrapper.viewContainerRef;

    viewContainerRef.clear();

    const componentFactory = viewContainerRef.createComponent(
      LinkDetailComponent
    );
    componentFactory.instance.detailListener = this.detailListener;
    componentFactory.instance.link = link;

    this.onShowItem = true;

  }


 }
