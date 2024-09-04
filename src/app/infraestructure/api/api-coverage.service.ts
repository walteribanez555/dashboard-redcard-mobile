import { inject, Injectable } from '@angular/core';
import { CoverageRepository } from '../../domain/repositories/coverage.repository';
import { CreateCoverageDto } from '../../domain/dtos/coverages/create-coverage.dto';
import { UpdateCoverageDto } from '../../domain/dtos/coverages/update-coverage.dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CoverageEntity } from '../../domain/entities/coverage.entity';
import { firstValueFrom, map, of } from 'rxjs';

export interface CoverageRequestCreate {
  id ? : number;
  coverage_id ? : number;
  title: string;
  description: string;
  files: string;
}

export interface CoverageResponseDto {
  coverage_id?: number;
  id?: number;
  title: string;
  description: string;
  files: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiCoverageService implements CoverageRepository {
  private _http = inject(HttpClient);

  private _apiUrl = environment.apiMobile + 'coverages';

  constructor() {}
  create(dto: CreateCoverageDto): Promise<CoverageEntity> {
    const fileString: string = dto.files.map((file) => file.filename).join(',');

    const request: CoverageRequestCreate = {
      title: dto.title,
      description: dto.description,
      files: fileString.length == 0 ? 'demo' : fileString,
    };

    return firstValueFrom(
      this._http.post<CoverageResponseDto>(this._apiUrl, request).pipe(
        map((resp) => {
          return new CoverageEntity(
            resp.id ? resp.id : resp.coverage_id!,
            resp.id ? resp.id : resp.coverage_id!,
            resp.title,
            resp.description,
            resp.files.split(',')
          );
        })
      )
    );
  }

  updateById(dto: UpdateCoverageDto): Promise<CoverageEntity> {
    const fileString: string = dto.files.map((file) => file.filename).join(',');
    const request: CoverageRequestCreate = {
      coverage_id : dto.coverage_id,
      title: dto.title,
      description: dto.description,
      files: fileString.length == 0 ? 'demo' : fileString,
    };

    return firstValueFrom(
      this._http.put<any>(
        `${this._apiUrl}?id=${dto.coverage_id}`,
        request
      ).pipe(
        map(() => {
          return new CoverageEntity(
            dto.coverage_id,
            dto.coverage_id,
            dto.title,
            dto.description,
            dto.files.map((file) => file.filename)
          );
        })
      )
    );
  }

  findById(id: number): Promise<CoverageEntity[]> {
    return firstValueFrom(
      this._http.get<CoverageResponseDto[]>(`${this._apiUrl}?id=${id}`).pipe(
        map((resp) => {
          return resp.map((coverage) => {
            return new CoverageEntity(
              coverage.id ? coverage.id : coverage.coverage_id!,
              coverage.id ? coverage.id : coverage.coverage_id!,
              coverage.title,
              coverage.description,
              coverage.files.split(',')
            );
          });
        })
      )
    );
  }

  findAll(): Promise<CoverageEntity[]> {
    return firstValueFrom(
      this._http.get<CoverageResponseDto[]>(this._apiUrl).pipe(
        map((resp) => {
          return resp.map((coverage) => {
            return new CoverageEntity(
              coverage.id ? coverage.id : coverage.coverage_id!,
              coverage.id ? coverage.id : coverage.coverage_id!,
              coverage.title,
              coverage.description,
              coverage.files.split(',')
            );
          });
        })
      )
    );
  }

  deleteById(id: number): Promise<any> {
    return firstValueFrom(this._http.delete(`${this._apiUrl}?id=${id}`));
  }
}
