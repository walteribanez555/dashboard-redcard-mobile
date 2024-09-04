import { FormListener } from "../interfaces/FormListener";
import { DynamicField } from "../types/dynamic.types";

export interface DynamicFormComponent{
  //Considerar si mantener formGroup
  fields : DynamicField[];
  step : number;
  renderForm : () => void;
  data : any;

}
