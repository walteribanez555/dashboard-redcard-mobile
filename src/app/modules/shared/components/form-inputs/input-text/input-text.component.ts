import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CustomInput } from '../CustomInput.interface';
import { FormControl, FormsModule, ReactiveFormsModule, Validator } from '@angular/forms';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl : './input-text.component.html',

})
export class InputTextComponent implements CustomInput {

  @Input()  formControl!: FormControl<any>;
  @Input()  data: any;
  @Input()  validators : Validator[] = [];

 }
