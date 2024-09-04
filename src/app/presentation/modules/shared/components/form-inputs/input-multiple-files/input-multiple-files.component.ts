import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MultipleFileInputComponent } from '../../custom-inputs/multiple-file-input/multiple-file-input.component';
import { CustomInput } from '../CustomInput.interface';
import { FormControl, FormsModule, ReactiveFormsModule, Validator } from '@angular/forms';

@Component({
  selector: 'app-input-multiple-files',
  standalone: true,
  imports: [
    CommonModule,
    MultipleFileInputComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl : './input-multiple-files.component.html',

})
export class InputMultipleFilesComponent implements CustomInput {

  @Input()  formControl!: FormControl<any>;
  @Input()  data: any;
  @Input()  validators : Validator[] = [];


}
