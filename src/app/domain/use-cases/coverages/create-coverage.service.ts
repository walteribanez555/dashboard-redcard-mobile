import { Injectable } from '@angular/core';
import { CreateCoverageDto } from '../../dtos/coverages/create-coverage.dto';
import { CoverageEntity } from '../../entities/coverage.entity';
import { CoverageRepository } from '../../repositories/coverage.repository';
import { FileRepository } from '../../repositories/file.repository';

export interface CreateCoverageUseCase {
  execute(dto : CreateCoverageDto): Promise<CoverageEntity>;
}

@Injectable({
  providedIn: 'root',
})
export class CreateCoverageService implements CreateCoverageUseCase {
  constructor(
    private coverageRepository: CoverageRepository, private fileRepository : FileRepository ) {}

  async execute(dto : CreateCoverageDto): Promise<CoverageEntity> {
    const filesUrl = await this.fileRepository.upload(dto.files);

    dto.files = filesUrl;

    return this.coverageRepository.create(dto);
  }
}
