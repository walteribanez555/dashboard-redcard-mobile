import { inject, Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { CoverageActions } from './coverage.actions';
import { CoverageEntity } from '../../../domain/entities/coverage.entity';
import {
  CreateCoverageService,
  UpdateCoverageService,
  GetCoveragesService,
  DeleteCoverageService,
  GetCoverageService,
} from '../../../domain/use-cases';
import { StatusAction } from '../../enums/Status.enum';
import { DeleteCoverageDto } from '../../../domain/dtos/coverages/delete-coverage.dto';
import { timer } from 'rxjs';

export interface CoverageStateModel {
  coverages: CoverageEntity[];
  coverageById: CoverageEntity | null;
  status: StatusAction;
}

@State<CoverageStateModel>({
  name: 'coverage',
  defaults: {
    coverages: [],
    coverageById: null,
    status: StatusAction.INITIAL,
  },
})
@Injectable()
export class CoverageState {
  private readonly createCoverageUseCase = inject(CreateCoverageService);
  private readonly updateCoverageUseCase = inject(UpdateCoverageService);
  private readonly getCoveragesUseCase = inject(GetCoveragesService);
  private readonly getCoverageUseCase = inject(GetCoverageService);
  private readonly deleteCoverageUseCase = inject(DeleteCoverageService);

  @Action(CoverageActions.GetAll)
  async getAll(ctx: StateContext<CoverageStateModel>) {
    ctx.patchState({ status: StatusAction.INITIAL });
    const coverages = await this.getCoveragesUseCase.execute();
    ctx.patchState({ coverages, status: StatusAction.INITIAL });
  }

  async get(
    ctx: StateContext<CoverageStateModel>,
    action: CoverageActions.Get
  ) {
    ctx.patchState({ status: StatusAction.LOADING });
    const coverageId = await this.getCoverageUseCase.execute(action.coverageId);
    ctx.patchState({
      status: StatusAction.SUCCESS,
      coverageById: coverageId[0] ? coverageId[0] : null,
    });
    this.setInitialState(ctx);
  }

  @Action(CoverageActions.Create)
  async create(
    ctx: StateContext<CoverageStateModel>,
    action: CoverageActions.Create
  ) {
    ctx.patchState({ status: StatusAction.LOADING });
    const coverage = await this.createCoverageUseCase.execute(action.dto);
    ctx.patchState({
      coverages: [...ctx.getState().coverages, coverage],
      status: StatusAction.SUCCESS,
    });
    this.setInitialState(ctx);
  }

  @Action(CoverageActions.Update)
  async update(
    ctx: StateContext<CoverageStateModel>,
    action: CoverageActions.Update
  ) {
    ctx.patchState({ status: StatusAction.LOADING });
    const coverage = await this.updateCoverageUseCase.execute(action.dto);
    const coverages = ctx
      .getState()
      .coverages.map((c) =>
        c.coverage_id === coverage.coverage_id ? coverage : c
      );
    ctx.patchState({ coverages, status: StatusAction.SUCCESS });
    this.setInitialState(ctx);
  }

  @Action(CoverageActions.Delete)
  async delete(
    ctx: StateContext<CoverageStateModel>,
    action: CoverageActions.Delete
  ) {
    ctx.patchState({ status: StatusAction.LOADING });
    const coverageDelete = DeleteCoverageDto.create({
      id: action.coverageId,
      files: action.files,
    });

    if (coverageDelete[0]) {
      ctx.patchState({ status: StatusAction.ERROR });
      return;
    }

    await this.deleteCoverageUseCase.execute(
      coverageDelete[1] as DeleteCoverageDto
    );
    const coverages = ctx
      .getState()
      .coverages.filter((c) => c.coverage_id !== action.coverageId);
    ctx.patchState({ coverages, status: StatusAction.SUCCESS });

    this.setInitialState(ctx);
  }

  setInitialState(ctx: StateContext<CoverageStateModel>) {
    timer(2000).subscribe(() => {
      ctx.patchState({ status: StatusAction.INITIAL });
    });
  }
}
