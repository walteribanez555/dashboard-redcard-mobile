import { inject, Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { CoverageSelectors } from '../states/coverage/coverage.queries';
import { CoverageEntity } from '../../domain/entities/coverage.entity';
import { CoverageActions } from '../states/coverage/coverage.actions';
import { UpdateCoverageDto } from '../../domain/dtos/coverages/update-coverage.dto';
import { CreateCoverageDto } from '../../domain/dtos/coverages/create-coverage.dto';
import { UploadFileDto } from '../../domain/dtos/files/upload-file.dto';
import { StatusAction } from '../enums/Status.enum';


@Injectable({
  providedIn: 'root',
})
export class CoverageFacadeService {
  private _store = inject(Store);

  statusAction: Signal<StatusAction> = this._store.selectSignal(
    CoverageSelectors.getStatus
  );
  coverages: Signal<CoverageEntity[]> = this._store.selectSignal(
    CoverageSelectors.getCoverages
  );

  constructor() {
    this._store.dispatch(new CoverageActions.GetAll());
  }

  addItem( title : string, description : string, files : File[] ) {

    const uploadFileDto : UploadFileDto[] = files.map( file => {
      return new UploadFileDto(file, file.name);
    })

    const createCoverageDto : CreateCoverageDto = new CreateCoverageDto( title, description, uploadFileDto);

    this._store.dispatch(new CoverageActions.Create(createCoverageDto));
  }

  updateItem(
    coverageId: number,
    title: string,
    description: string,
    previousFiles : string[],
    files: File[],
  ) {

    const uploadFileDto : UploadFileDto[] = files.map( file => {
      return new UploadFileDto(file, file.name);
    })
    const updateCoverageDto: UpdateCoverageDto = new UpdateCoverageDto(
      coverageId,
      title,
      description,
      previousFiles,
      uploadFileDto,
    );

    this._store.dispatch(new CoverageActions.Update(updateCoverageDto));
  }


  deleteItem(item : CoverageEntity) {

    const id = item.coverage_id ? item.coverage_id : item.id;
    this._store.dispatch(new CoverageActions.Delete(id!, item.files));
  }

  getItems() {
    this._store.dispatch(new CoverageActions.GetAll());
  }

  getItem(coverageId: number) {
    this._store.dispatch(new CoverageActions.Get(coverageId));
  }
}
