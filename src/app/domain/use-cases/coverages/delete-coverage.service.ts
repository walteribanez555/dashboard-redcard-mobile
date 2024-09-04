import { Injectable } from '@angular/core';
import { CoverageRepository } from '../../repositories/coverage.repository';
import { DeleteCoverageDto } from '../../dtos/coverages/delete-coverage.dto';
import { FileRepository } from '../../repositories/file.repository';

export interface DeleteCoverageUseCase {
  execute(dto : DeleteCoverageDto): Promise<void>;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteCoverageService implements DeleteCoverageUseCase {
  constructor(private repository: CoverageRepository, private fileRepository : FileRepository) {}
  async execute(dto : DeleteCoverageDto): Promise<void> {

    const previousFiles = dto.files.map( file => file.split('/').pop()!);
    await Promise.all(
      previousFiles.map( file => this.fileRepository.delete(file))
    );

    return this.repository.deleteById(dto.id);
  }
}
