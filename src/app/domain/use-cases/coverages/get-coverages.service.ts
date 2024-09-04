import { Injectable } from '@angular/core';
import { CoverageEntity } from '../../entities/coverage.entity';
import { CoverageRepository } from '../../repositories/coverage.repository';

export interface GetCoveragesUseCase {
  execute(): Promise<CoverageEntity[]>;
}

@Injectable({
  providedIn: 'root',
})
export class GetCoveragesService implements GetCoveragesUseCase {
  constructor(private repository: CoverageRepository) {}
  execute(): Promise<CoverageEntity[]> {
    return this.repository.findAll();
  }
}
