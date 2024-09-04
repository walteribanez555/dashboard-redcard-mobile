import { Injectable } from '@angular/core';
import { CoverageEntity } from '../../entities/coverage.entity';
import { CoverageRepository } from '../../repositories/coverage.repository';

export interface GetCoverageUseCase {
  execute(id: number): Promise<CoverageEntity[]>;
}

@Injectable({
  providedIn: 'root',
})
export class GetCoverageService implements GetCoverageUseCase {
  constructor(private repository: CoverageRepository) {}



  execute(id: number): Promise<CoverageEntity[]> {
    return this.repository.findById(id);
  }
}
