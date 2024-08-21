import { FormGroup } from "@angular/forms";

export interface DetailListener{
  close : () => void;
  submit : (formGroup : FormGroup) => void;
  cancel : () => void;
}
