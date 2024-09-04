import { Observable, TimeInterval } from "rxjs";
import { DialogPosition, DialogType } from "../enum/dialog";

export interface Dialog {
  typeDialog? : DialogType,
  options? : DialogOptions,
  data ? : DialogData,
  listener ? : Observable<any>,
}


export interface DialogData{
  title : string,
  description : string,
  icon? : string,
}

export interface DialogOptions{
  withActions? : boolean;
  position? : DialogPosition[],
  timeToShow? : Observable<0>,
  withBackground? : boolean;
  colorIcon? : string,
}



