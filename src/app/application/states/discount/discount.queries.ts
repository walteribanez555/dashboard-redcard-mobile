import { createPropertySelectors, createSelector } from "@ngxs/store";
import { DiscountState, DiscountStateModel } from "./discount.state";

export class DiscountSelectors{

  static getSlices = createPropertySelectors<DiscountStateModel>( DiscountState );


  static getDiscounts = createSelector(
    [DiscountSelectors.getSlices.discounts],
    ( discounts ) => discounts
  )


  static getDiscount = createSelector(
    [DiscountSelectors.getSlices.discountById],
    ( discount ) => discount
  )

  static getStatus = createSelector(
    [DiscountSelectors.getSlices.status],
    ( loading ) => loading
  )

}
