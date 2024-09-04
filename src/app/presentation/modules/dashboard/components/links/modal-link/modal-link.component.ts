import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActionModalListener } from '../../../../shared/interfaces/ActionModalListener';
import { DynamicForm } from '../../../../shared/types/dynamic.types';
import { ModalContent } from '../../../../shared/models/modal-content';
import { DcDirective } from '../../../../shared/directives/dc.directive';
import { DynamicFormComponent } from '../../../../shared/models/dynamic-form.component';

@Component({
  selector: 'app-modal-link',
  standalone: true,
  imports: [
    CommonModule,
    DcDirective,
  ],
  templateUrl : './modal-link.component.html',

})
export class ModalLinkComponent  implements ModalContent {

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {

    const modalListener = this.createModalListener();
    this.loadComponent(this.actualFormIndex);
    this.onCreateModal.emit(modalListener);
    this.cdr.detectChanges();
  }



  loadComponent(itemPos : number){

    const item = this.forms[itemPos];



    const viewContainerRef = this.dcWrapper.viewContainerRef;
    viewContainerRef.clear();


    const componentRef = viewContainerRef.createComponent<DynamicFormComponent>(
      item.component
    )

    componentRef.instance.step = itemPos;
    componentRef.instance.fields  = item.dynamicFields;
    componentRef.instance.data = item.data;


    //Render again with the form
    componentRef.instance.renderForm();
    // componentRef.instance.formGroup = item.formGroup;


  }





  createModalListener() {
    const modalListener : ActionModalListener = {
      onNext : ( ) => {
        return this.nextStepForm();
      },
      onPrev : ( ) => {
        return this.prevStepForm();
      }
    }

    return modalListener
  }







  actionsModal?: ActionModalListener | undefined;
  onCreateModal = new EventEmitter<any>();
  actualFormIndex = 0;

  @ViewChild(DcDirective) dcWrapper! : DcDirective;

  @Input() forms : DynamicForm[] = [];
  @Input() data : any;


  nextStepForm(){
    if(this.actualFormIndex < this.forms.length - 1){
      this.actualFormIndex++;
    }
    this.loadComponent(this.actualFormIndex);
    return { actualForm :  this.forms[this.actualFormIndex], actualStep : this.actualFormIndex};
  }

  prevStepForm(){
    if(this.actualFormIndex > 0){
      this.actualFormIndex--;
    }
    this.loadComponent(this.actualFormIndex);
    return{ actualForm :  this.forms[this.actualFormIndex], actualStep : this.actualFormIndex};
  }



  private cdr = inject(ChangeDetectorRef);

 }
