import {createAction, props} from "@ngrx/store";
import {ProductModel} from "../../models/productModel";


export const addProduct = createAction(
  "[Product] Add Product",
  props<{product: ProductModel}>()
);
export const addProductSuccess = createAction(
  "[Product] Add Product Success",
  props<{product: ProductModel}>()
);
export const addProductFailure = createAction(
  "[Product] Add Product Failure",
  props<{error: any}>()
);
export const updateProduct = createAction(
  "[Product] update Product",
  props<{product: ProductModel}>()
);
export const updateProductSuccess = createAction(
  "[Product] update Product Success",
  props<{product: ProductModel}>()
);
export const updateProductFailure = createAction(
  "[Product] update Product Failure",
  props<{error: any}>()
);
