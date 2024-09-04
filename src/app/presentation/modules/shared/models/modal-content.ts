import { FormGroup } from "@angular/forms";
import { DynamicForm } from "../types/dynamic.types";
import { ActionModal } from "./action-modal";
import { ActionModalListener } from "../interfaces/ActionModalListener";
import { EventEmitter } from "@angular/core";


export interface ModalContent {

  forms : DynamicForm[] | null;
  data : any;
  actionsModal? : ActionModalListener;
  onCreateModal? : EventEmitter<any>;


}
