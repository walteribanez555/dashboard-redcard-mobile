import { inject, Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { DiscountActions } from './discount.actions';
import { DiscountEntity } from '../../../domain/entities/discount.entity';
import { StatusAction } from '../../enums/Status.enum';
import {
  CreateDiscountService,
  DeleteDiscountService,
  GetDiscountService,
  GetDiscountsService,
  UpdateDiscountService,
} from '../../../domain/use-cases';
import { DeleteDiscountDto } from '../../../domain/dtos/discounts/delete-discount.dto';
import { timer } from 'rxjs';

export interface DiscountStateModel {
  discounts: DiscountEntity[];
  discountById: DiscountEntity | null;
  status: StatusAction;
}

@State<DiscountStateModel>({
  name: 'discount',
  defaults: {
    discounts: [],
    discountById: null,
    status: StatusAction.INITIAL,
  },
})
@Injectable()
export class DiscountState {
  private readonly createDiscountUseCase = inject(CreateDiscountService);
  private readonly updateDiscountUseCase = inject(UpdateDiscountService);
  private readonly getDiscountsUseCase = inject(GetDiscountsService);
  private readonly getDiscountUseCase = inject(GetDiscountService);
  private readonly deleteDiscountUseCase = inject(DeleteDiscountService);

  @Action(DiscountActions.GetAll)
  async getAll(ctx: StateContext<DiscountStateModel>) {
    ctx.patchState({ status: StatusAction.INITIAL });
    const discounts = await this.getDiscountsUseCase.execute();
    ctx.patchState({ discounts, status: StatusAction.INITIAL });
  }

  async get(
    ctx: StateContext<DiscountStateModel>,
    action: DiscountActions.Get
  ) {
    ctx.patchState({ status: StatusAction.LOADING });
    const discount = await this.getDiscountUseCase.execute(action.discountId);
    ctx.patchState({
      status: StatusAction.SUCCESS,
      discountById: discount[0] ? discount[0] : null,
    });
  }

  @Action(DiscountActions.Update)
  async update(
    ctx: StateContext<DiscountStateModel>,
    action: DiscountActions.Update
  ) {
    ctx.patchState({ status: StatusAction.LOADING });
    const updatedDiscount = await this.updateDiscountUseCase.execute(
      action.dto
    );
    const discounts = ctx
      .getState()
      .discounts.map((d) =>
        d.discount_id=== action.dto.discount_id ? updatedDiscount : d
      );
    ctx.patchState({ discounts, status: StatusAction.SUCCESS });
  }

  @Action(DiscountActions.Create)
  async create(
    ctx: StateContext<DiscountStateModel>,
    action: DiscountActions.Create
  ) {
    ctx.patchState({ status: StatusAction.LOADING });
    const discount = await this.createDiscountUseCase.execute(action.dto);
    ctx.patchState({
      discounts: [...ctx.getState().discounts, discount],
      status: StatusAction.SUCCESS,
    });
  }

  @Action(DiscountActions.Delete)
  async delete(
    ctx: StateContext<DiscountStateModel>,
    action: DiscountActions.Delete
  ) {
    ctx.patchState({ status: StatusAction.LOADING });
    const discountDelete = DeleteDiscountDto.create({
      id: action.discountId,
      files: action.files,
    });

    if (discountDelete[0]) {
      ctx.patchState({ status: StatusAction.ERROR });
      return;
    }

    await this.deleteDiscountUseCase.execute(
      discountDelete[1] as DeleteDiscountDto
    );
    const discounts = ctx
      .getState()
      .discounts.filter((d) => d.discount_id !== action.discountId);
    ctx.patchState({ discounts, status: StatusAction.SUCCESS });

    this.setInitialState(ctx);
  }

  setInitialState(ctx: StateContext<DiscountStateModel>) {
    timer(2000).subscribe(() => {
      ctx.patchState({ status: StatusAction.INITIAL });
    });
  }
}
