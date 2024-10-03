import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ProductState} from "./product-state";

export const selectProductState = createFeatureSelector<ProductState>('product');


export const productSelector = createSelector(
  selectProductState,
  (state: ProductState) => state.products,
)
export const productSelectorAtIndex = createSelector(
  productSelector,
  (products) => (index: number) => {return products[index];}
)
