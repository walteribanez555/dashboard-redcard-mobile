import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Type,
  ViewChild,
  inject,
} from '@angular/core';
import { SvgIconComponent, SvgIconRegistryService } from 'angular-svg-icon';
import { DcDirective } from '../../directives/dc.directive';
import { ModalContent } from '../../models/modal-content';
import { FormGroup } from '@angular/forms';
import { ActionModal } from '../../models/action-modal';
import { ActionType } from '../../enum/action';
import { DynamicForm } from '../../types/dynamic.types';
import { ActionModalListener } from '../../interfaces/ActionModalListener';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, SvgIconComponent, DcDirective],
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnInit, AfterViewInit {
  delete = ActionType.Delete;
  edit = ActionType.Update;
  create = ActionType.Create;

  // actualForm : DynamicForm | null = null;
  actualStep = 0;


  @Input() title?: string = 'Agregar Elemento';
  @Input() iconPath?: string = 'assets/icons/heroicons/outline/plus.svg';
  @Input() size: string = 'md';
  @Input() forms!: DynamicForm[] | null;
  @Input() data!: any | null;
  @Input() actions : ActionModal[] = [
    {
      action : ActionType.Create,
      title: 'Agregar'
    }
  ]

  @Output() closeEvent = new EventEmitter();
  @Output() submitEvent = new EventEmitter();

  @Input() component!: Type<any>;

  @ViewChild(DcDirective) dcWrapper!: DcDirective;


  listenerFromChild? : ActionModalListener;

  private cdr = inject(ChangeDetectorRef);

  constructor(private elementRef: ElementRef, private iconRegistry: SvgIconRegistryService) {}

  ngOnInit(): void {}

  close() {
    this.elementRef.nativeElement.remove();
    this.closeEvent.emit();
  }

  submit(action : ActionModal) {
    this.elementRef.nativeElement.remove();
    this.submitEvent.emit({ form: this.forms, data: this.data, action });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    this.loadComponent();
  }

  loadComponent() {
    const viewContainerRef = this.dcWrapper.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<ModalContent>(
      this.component
    );

    componentRef.instance.forms= this.forms;
    componentRef.instance.data = this.data;
    componentRef.instance.onCreateModal?.subscribe({
      next: ( modalListener : any) => {
        this.listenerFromChild = modalListener;
      }
    })



    // Manually trigger change detection
    this.cdr.detectChanges();
  }


  toggleNext() {
    const {actualForm , actualStep}= this.listenerFromChild?.onNext();
    this.actualStep = actualStep;
    this.cdr.detectChanges();
  }

  togglePrev() {
    const {actualForm , actualStep} = this.listenerFromChild?.onPrev();
    this.actualStep = actualStep;
    this.cdr.detectChanges();
  }


}
