import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FileInputComponent } from '../../custom-inputs/file-input/file-input.component';
import { CustomInput } from '../CustomInput.interface';
import { FormControl, FormsModule, ReactiveFormsModule, Validator } from '@angular/forms';

@Component({
  selector: 'app-input-file',
  standalone: true,
  imports: [
    CommonModule,
    FileInputComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl : './input-file.component.html',
})
export class InputFileComponent implements CustomInput  {

  @Input()  formControl!: FormControl<any>;
  @Input()  data: any;
  @Input()  validators : Validator[] = [];

}
