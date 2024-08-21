import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { FormListener } from '../../interfaces/FormListener';
import { DynamicField } from '../../types/dynamic.types';
import { DynamicFormComponent } from '../../models/dynamic-form.component';
import { FieldTemplateComponent } from '../field-template/field-template.component';

@Component({
  selector: 'app-form-template',
  standalone: true,
  imports: [
    CommonModule,
    FieldTemplateComponent,
  ],
  templateUrl : './form-template.component.html',

})
export class FormTemplateComponent implements DynamicFormComponent, OnInit {
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  @Input() fields: DynamicField[] = [];
  @Input() step!: number;
  @Input() formListener!: FormListener;
  @Input() data!: any;



  // fieldListener : FieldListener | null = null;

  private cdr = inject(ChangeDetectorRef);

  renderForm() {
    this.cdr.detectChanges();
  }


 }
