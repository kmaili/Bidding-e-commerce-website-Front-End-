import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ProductModel} from "../models/productModel";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiAddProductApiUrl: string = "http://localhost:8080/api/products/add";
  apiUpdateProductApiUrl: string = "http://localhost:8080/api/products/update";
  loadProductApiUrl: string = "http://localhost:8080/api/products/load_user_products";
  constructor(private http: HttpClient) { }

  addProduct(product: ProductModel): Observable<ProductModel>{
    console.log("adding ...")
    return this.http.post<ProductModel>(this.apiAddProductApiUrl, product, {withCredentials: true});
  }

  loadByUser(userId: string, pageIndex: number, pageSize: number, sortBy: string, sortOrder: string, searchQuery: string | undefined = undefined): Observable<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set("owner", userId);
    httpParams = httpParams.set("pageIndex", pageIndex);
    httpParams = httpParams.set("pageSize", pageSize);
    httpParams = httpParams.set("sortBy", sortBy);
    httpParams = httpParams.set("sortOrder", sortOrder);
    httpParams = httpParams.set("searchQuery", "");
    if (searchQuery)
      httpParams = httpParams.set("searchQuery", searchQuery);
    return this.http.get(this.loadProductApiUrl, {params: httpParams, withCredentials: true});
  }

  updateProduct(product: ProductModel): Observable<ProductModel>{
    console.log("updating ...")
    return this.http.put<ProductModel>(this.apiUpdateProductApiUrl, product, {withCredentials: true});
  }
}
