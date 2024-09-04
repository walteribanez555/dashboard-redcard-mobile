import { State } from "../models/status.model";

export class Status{
  public static states : State[] = [
    {
      id : 1,
      title : 'Activo'
    },
    {
      id : 2,
      title : 'Inactivo'
    }
  ]
}
