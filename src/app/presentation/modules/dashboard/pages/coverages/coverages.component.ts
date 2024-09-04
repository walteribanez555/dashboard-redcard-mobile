import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CoveragesHeaderComponent } from '../../components/coverages/coverages-header/coverages-header.component';
import { ListCoveragesComponent } from '../../components/coverages/list-coverages/list-coverages.component';
import { CoverageFacadeService } from '../../../../../application/facade/CoverageFacade.service';
import { CoverageEntity } from '../../../../../domain/entities/coverage.entity';
import { ModalService } from '../../../shared/services/Modal.service';
import { DialogService } from '../../../shared/services/Dialog.service';
import { DynamicForm } from '../../../shared/types/dynamic.types';
import { InputTextComponent } from '../../../shared/components/form-inputs/input-text/input-text.component';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalCoveragesComponent } from '../../components/coverages/modal-coverages/modal-coverages.component';
import { ActionType } from '../../../shared/enum/action';
import { responseModalFormMapper } from '../../../shared/utils/mappers/response-modal-form/response-modal-form';
import { Dialog } from '../../../shared/models/dialog';
import { DialogPosition, DialogType } from '../../../shared/enum/dialog';
import { Observable, Subject, tap, timeout, timer } from 'rxjs';
import { StatusAction } from '../../../../../application/enums/Status.enum';
import { DcDirective } from '../../../shared/directives/dc.directive';
import { DetailCoverageComponent } from '../../components/coverages/detail-coverage/detail-coverage.component';
import { Title } from '@angular/platform-browser';
import { InputMultipleFilesComponent } from '../../../shared/components/form-inputs/input-multiple-files/input-multiple-files.component';
import { DetailListener } from '../../interfaces/Detail.listener';
import { ItemList } from '../../../shared/components/item-list/interfaces/ItemList.interfaces';

@Component({
  selector: 'app-coverages',
  standalone: true,
  imports: [
    CommonModule,
    CoveragesHeaderComponent,
    ListCoveragesComponent,
    DcDirective,
  ],
  templateUrl: './coverages.component.html',
})
export class CoveragesComponent implements OnInit, AfterViewInit {
  @ViewChild(DcDirective) dcWrapper!: DcDirective;


  constructor() {
    effect(() => {
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
    });
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {}

  onShowItem: boolean = false;

  private coverageFacade = inject(CoverageFacadeService);
  private modalService = inject(ModalService);
  private dialogService = inject(DialogService);

  coverages$ = this.coverageFacade.coverages;

  onLoading$ = this.coverageFacade.statusAction;

  private dialogNotifier = new Subject();

  generateCoverageForm() {
    const coverageForm: DynamicForm = {
      component: FormTemplateComponent,
      data: {
        title: 'Agregar nueva cobertura',
        description: 'Especificaciones necesarias de la cobertura a agregar',
      },
      dynamicFields: [
        {
          component: InputTextComponent,
          data: {
            placeholder: 'Nueva cobertura',
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
      ],
    };

    return coverageForm;
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

  onAddCoverageToggle() {
    this.modalService
      .open(ModalCoveragesComponent, {
        title: `Agregar Cobertura`,
        size: 'sm',
        forms: [this.generateCoverageForm(), this.generateFileForm()],
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
          const { Titulo, Descripcion, Archivos } =
            responseModalFormMapper(resp);

          this.coverageFacade.addItem(Titulo, Descripcion, Archivos);
        },
        error: (err) => {},
        complete: () => {},
      });
  }

  detailListener: DetailListener<CoverageEntity> = {
    close: () => {
      this.dcWrapper.viewContainerRef.clear();
      this.onShowItem = false;
    },
    submit: (form: FormGroup) => {
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
        const { id, files, description, previousFiles, title } = form.value;

        this.coverageFacade.updateItem(
          id,
          title,
          description,
          previousFiles,
          files
        );
      });
    },
    cancel: () => {
      this.dcWrapper.viewContainerRef.clear();
      this.onShowItem = false;
    },

    delete: (item: CoverageEntity | number) => {
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
        this.coverageFacade.deleteItem(item as CoverageEntity);
      });
    },
  };

  onDetailCoverage(coverage: CoverageEntity) {
    console.log({ coverage });

    const viewContainerRef = this.dcWrapper.viewContainerRef;

    viewContainerRef.clear();

    const componentFactory = viewContainerRef.createComponent(
      DetailCoverageComponent
    );
    componentFactory.instance.detailListener = this.detailListener;
    componentFactory.instance.coverage = coverage;

    this.onShowItem = true;
  }
}
