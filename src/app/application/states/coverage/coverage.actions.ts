import { CreateCoverageDto } from "../../../domain/dtos/coverages/create-coverage.dto";
import { UpdateCoverageDto } from "../../../domain/dtos/coverages/update-coverage.dto";

export namespace CoverageActions {

  export class Get{
    static readonly type = '[Coverage] Get';
    constructor(public coverageId: number) {}
  }

  export class GetAll {
    static readonly type = '[Coverage] GetAll';
  }

  export class Create {
    static readonly type = '[Coverage] Create';
    constructor( public dto : CreateCoverageDto){}
  }

  export class Update {
    static readonly type = '[Coverage] Update';
    constructor( public dto : UpdateCoverageDto){}
  }

  export class Delete {
    static readonly type = '[Coverage] Delete';
    constructor(public coverageId: number, public files : string[]) {}
  }


}
