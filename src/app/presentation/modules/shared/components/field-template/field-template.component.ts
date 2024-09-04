import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { DcDirective } from '../../directives/dc.directive';
import { FieldListener } from '../../interfaces/FieldListener';
import { DynamicFieldComponent } from '../../models/dynamic-field.component';
import { DynamicField } from '../../types/dynamic.types';
import { CustomInput } from '../form-inputs/CustomInput.interface';

@Component({
  selector: 'app-field-template',
  standalone: true,
  imports: [CommonModule,  DcDirective],
  templateUrl: './field-template.component.html',
})
export class FieldTemplateComponent
  implements DynamicFieldComponent, AfterViewInit
{
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    this.loadComponent();
  }

  titleField: string | null = null;

  @Input() fieldListener!: FieldListener;

  @Input() dynamicField!: DynamicField;

  @ViewChild(DcDirective) dcWrapper!: DcDirective;

  private cdr = inject(ChangeDetectorRef);

  loadComponent() {
    const viewContainerRef = this.dcWrapper.viewContainerRef;
    viewContainerRef.clear();


    const componentRef = viewContainerRef.createComponent<CustomInput>(
      this.dynamicField.component
    );



    componentRef.instance.formControl = this.dynamicField.fieldFormControl;
    componentRef.instance.data = this.dynamicField.data;

    this.titleField = this.dynamicField.data['title'];

    // Manually trigger change detection
    this.cdr.detectChanges();
  }
}
