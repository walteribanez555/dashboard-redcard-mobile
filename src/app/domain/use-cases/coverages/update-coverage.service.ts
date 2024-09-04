import { Injectable } from '@angular/core';
import { CoverageEntity } from '../../entities/coverage.entity';
import { CoverageRepository } from '../../repositories/coverage.repository';
import { UpdateCoverageDto } from '../../dtos/coverages/update-coverage.dto';
import { FileRepository } from '../../repositories/file.repository';


export interface UpdateCoverageUseCase{
  execute(dto : UpdateCoverageDto) : Promise<CoverageEntity>;
}

@Injectable({
  providedIn: 'root'
})
export class UpdateCoverageService implements UpdateCoverageUseCase {

  constructor( private repository : CoverageRepository, private fileRepository : FileRepository) { }
  async execute(dto : UpdateCoverageDto): Promise<CoverageEntity> {
    //delete previous files

    const previousFiles = dto.previousFiles.map( file => file.split('/').pop()!);
    //delete files foreach with await and promise all to then continue
    await Promise.all(
      previousFiles.map( file => this.fileRepository.delete(file))
    );

    //upload new files
    const filesUrl = await this.fileRepository.upload(dto.files);

    dto.files = filesUrl;


    return this.repository.updateById(dto);
  }

}
