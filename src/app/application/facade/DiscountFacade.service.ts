import { inject, Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { StatusAction } from '../enums/Status.enum';
import { DiscountSelectors } from '../states/discount/discount.queries';
import { DiscountEntity } from '../../domain/entities/discount.entity';
import { DiscountActions } from '../states/discount/discount.actions';
import { CreateDiscountDto, UpdateDiscountDto, UploadFileDto } from '../../domain/dtos';

@Injectable({
  providedIn: 'root',
})
export class DiscountFacadeService {
  private _store = inject(Store);

  statusAction: Signal<StatusAction> = this._store.selectSignal(
    DiscountSelectors.getStatus
  );

  discounts: Signal<DiscountEntity[]> = this._store.selectSignal(
    DiscountSelectors.getDiscounts
  );

  constructor() {
    this._store.dispatch(new DiscountActions.GetAll());
  }

  addItem(props: { [key: string]: any }) {
    const { title, description, amount, type, images } = props;




    if (!title) throw new Error('Title is required');
    if (!description) throw new Error('Description is required');
    if (!amount) throw new Error('Value is required');
    if (!type) throw new Error('Type is required');
    if (!images) throw new Error('Images is required');

    const uploadFileDto : UploadFileDto[] = images.map( (file : any) => {
      return new UploadFileDto(file, file.name);
    })

    const intentCreation = CreateDiscountDto.create({
      title,
      description,
      amount,
      type,
      images: uploadFileDto,
    });
    if (intentCreation[0]) throw new Error(intentCreation[0] as string);

    this._store.dispatch(
      new DiscountActions.Create(intentCreation[1] as CreateDiscountDto)
    );
  }

  updateItem(props : {[key:string]:any}) {
    const { discountId, title, description, value, type, previousFiles, images } = props;

    if (!discountId) throw new Error('DiscountId is required');
    if (!title) throw new Error('Title is required');
    if (!description) throw new Error('Description is required');
    if (!value) throw new Error('Value is required');
    if (!type) throw new Error('Type is required');
    if (!images) throw new Error('Images is required');
    if (!previousFiles) throw new Error('PreviousFiles is required');

    const uploadFileDto : UploadFileDto[] = images.map( (file: File) => {
      return new UploadFileDto(file, file.name);
    })


    const updatedProps = {
      ...props,
      images: uploadFileDto,
    };

    const intentCreation = UpdateDiscountDto.create(updatedProps);
    if (intentCreation[0]) throw new Error(intentCreation[0] as string);

    this._store.dispatch(
      new DiscountActions.Update(intentCreation[1] as UpdateDiscountDto)
    );
  }

  deleteItem( entity : DiscountEntity) {
    this._store.dispatch(new DiscountActions.Delete(entity.discount_id, entity.imagesUrl));
  }

}
