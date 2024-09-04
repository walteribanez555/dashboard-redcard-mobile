import { CreateDiscountDto, UpdateDiscountDto } from "../../../domain/dtos";

export namespace DiscountActions{


  export class Get {
    static readonly type = "[Discount] Get";
    constructor( public discountId : number) {}

  }

  export class GetAll {
    static readonly type = "[Discount] GetAll";
    constructor(){}

  }


  export class Create {
    static readonly type = "[Discount] Create";
    constructor( public dto : CreateDiscountDto){}
  }

  export class Update {
    static readonly type = "[Discount] Update";
    constructor( public dto : UpdateDiscountDto){}
  }

  export class Delete {
    static readonly type = "[Discount] Delete";
    constructor( public discountId: number, public files : string[]) {}
  }



}
