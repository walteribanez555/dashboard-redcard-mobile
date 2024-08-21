import { State } from "../../../../core/models/status.model";

export interface LinkUI {
  id? : number,
  link_id? : number,
  title : string,
  subtitle: string,
  url : string,
  status : State,
}
