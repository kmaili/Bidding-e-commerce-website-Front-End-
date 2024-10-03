import {Action, createReducer, on} from "@ngrx/store";
import {initialState, ProductState} from "./product-state";
import {
  addProduct,
  addProductFailure,
  addProductSuccess,
  updateProduct,
  updateProductFailure,
  updateProductSuccess
} from "./product-actions";

export const ProductReducer = createReducer(
  initialState,
  on(addProduct, (state) => ({...state, error: null})),
  on(addProductSuccess, (state, {product}) => ({...state, products: [...state.products, product]})),
  on(addProductFailure, (state, {error}) => ({...state, error})),
  on(updateProduct, (state) => ({...state, error: null})),
  on(updateProductSuccess, (state, {product}) => ({...state, products: [...state.products, product]})),
  on(updateProductFailure, (state, {error}) => ({...state, error})),
)
export function reducer(state: ProductState | undefined, action: Action): ProductState {
  return ProductReducer(state, action);
}
