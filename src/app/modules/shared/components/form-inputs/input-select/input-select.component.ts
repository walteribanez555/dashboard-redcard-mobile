import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validator } from '@angular/forms';
import { SelectComponent } from '../../custom-inputs/select/select.component';
import { CustomInput } from '../CustomInput.interface';

@Component({
  selector: 'app-input-select',
  standalone: true,
  imports: [
    CommonModule,
    SelectComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl : './input-select.component.html',

})
export class InputSelectComponent implements CustomInput  {

  @Input()  formControl!: FormControl<any>;
  @Input()  data: any;
  @Input()  validators : Validator[] = [];

 }
