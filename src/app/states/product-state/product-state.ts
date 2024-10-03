import {ProductModel} from "../../models/productModel";

export interface ProductState {
  products: ProductModel[]
}

export const initialState: ProductState = {
  products: []
}
