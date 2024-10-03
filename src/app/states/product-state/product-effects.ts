import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {
  addProduct,
  addProductFailure,
  addProductSuccess, updateProduct,
  updateProductFailure,
  updateProductSuccess
} from "./product-actions";
import {catchError, map, of, switchMap} from "rxjs";
import {ProductService} from "../../services/product.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Injectable()
export class ProductStateEffects {
  constructor(private actions$: Actions, private productService: ProductService, private toast: ToastrService, private router: Router) {}

  $addProduct = createEffect(()=>
      this.actions$.pipe(
        ofType(addProduct),
        switchMap(action => this.productService.addProduct(action.product).pipe(
          map(insertedProduct => {
            this.toast.success("Product added")
            this.router.navigate(["/profile"]);
            return addProductSuccess({product: insertedProduct});
          }),
          catchError(error => {
            this.toast.error("Fail to add product")
            return of(addProductFailure({error }));
          })
        ))
      )
  )
  updateProduct = createEffect(()=>
    this.actions$.pipe(
      ofType(updateProduct),
      switchMap(action => this.productService.updateProduct(action.product).pipe(
        map(insertedProduct => {
          this.toast.success("Product updated")
          this.router.navigate(["/profile"]);
          return updateProductSuccess({product: insertedProduct});
        }),
        catchError(error => {
          this.toast.error("Fail to update product")
          return of(updateProductFailure({error }));
        })
      ))
    )
  )
}
