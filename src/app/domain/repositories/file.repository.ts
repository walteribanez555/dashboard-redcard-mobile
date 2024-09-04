import { UploadFileDto } from "../dtos/files/upload-file.dto";

export abstract class FileRepository {

  // abstract create( dto : CreateCoverageDto) : Promise<CoverageEntity>;
  // abstract updateById( dto : UpdateCoverageDto) : Promise<CoverageEntity>;
  // abstract findById( id : number) : Promise<CoverageEntity[]>;
  // abstract findAll() : Promise<CoverageEntity[]>;
  // abstract deleteById( id : number) : Promise<any>;

  abstract upload( files : UploadFileDto[]): Promise<UploadFileDto[]>;
  abstract delete( key : string) : Promise<string>;
}
