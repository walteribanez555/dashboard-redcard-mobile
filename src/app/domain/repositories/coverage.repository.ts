import { CreateCoverageDto } from "../dtos/coverages/create-coverage.dto";
import { UpdateCoverageDto } from "../dtos/coverages/update-coverage.dto";
import { CoverageEntity } from "../entities/coverage.entity";


export abstract class CoverageRepository {

  abstract create( dto : CreateCoverageDto) : Promise<CoverageEntity>;
  abstract updateById( dto : UpdateCoverageDto) : Promise<any>;
  abstract findById( id : number) : Promise<CoverageEntity[]>;
  abstract findAll() : Promise<CoverageEntity[]>;
  abstract deleteById( id : number) : Promise<any>;

}
