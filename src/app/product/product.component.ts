import {Component, ElementRef, ViewChild, ChangeDetectorRef, OnInit} from '@angular/core'; // Ensure ChangeDetectorRef is imported
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ToastrService} from "ngx-toastr";
import {FilesService} from "../services/files.service";
import {first} from "rxjs";
import {ProductModel} from "../models/productModel";
import {Store} from "@ngrx/store";
import {selectUser} from "../states/user-state/auth.selectors";
import {addProduct, updateProduct} from "../states/product-state/product-actions";
import {ActivatedRoute, Event} from "@angular/router";
import {SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('newCat') newCat!: ElementRef;
  selectedFiles: File[] = [];
  images_urls: SafeUrl[] = [];
  newCatHidden: boolean = true;
  addProductForm!: FormGroup;
  product!: ProductModel;
  mode: string = "new" // add new product or update existing one

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private toast: ToastrService, protected filesService: FilesService, private store: Store, private activatedRoute: ActivatedRoute) {  // Inject ChangeDetectorRef here
    this.addProductForm = this.fb.group({
      product_name: ['aa', Validators.required],
      product_description: ['aaaaaaaaaaaaaaaaaaaaaaaa', [Validators.required]],
      product_actual_price: ['1', [Validators.required, Validators.min(0)]],
      product_category: ['lari', Validators.required],
      newCategory: [''],
      stock: ['1', [Validators.required, Validators.min(1)]],
    });
  }



  removeProduct(fileIndex: number) {
    this.selectedFiles.splice(fileIndex, 1);
    this.images_urls.splice(fileIndex, 1);
  }

  async onSubmit() {
    if(this.addProductForm.invalid || (this.addProductForm.get('category')?.value === 'Others' && this.addProductForm.get('newCategory')?.value === '') || this.images_urls.length == 0) {
      this.toast.warning('Some field missed...');
    }
    else if (this.mode === "update"){
      let product = this.addProductForm.value;
      const uploaded_product_images = await this.filesService.uploadProductImages(this.selectedFiles)
      if (product.product_category === 'Others'){
        product.product_category = product.newCategory;
      }

      delete product.newCategory
      product['product_images'] = uploaded_product_images["filesIds"];
      console.log("product to update: ",product)
      this.product = product
      this.store.dispatch(updateProduct({product: product}));
    }else{
      const uploaded_product_images = await this.filesService.uploadProductImages(this.selectedFiles)
      if(uploaded_product_images !== null){
        const product_images = uploaded_product_images.filesIds;
        let product = this.addProductForm.value;
        if (product.product_category === 'Others'){
          product.product_category = product.newCategory;
        }
        delete product.newCategory
        product['product_images'] = product_images;
        this.store.select(selectUser).pipe(first()).subscribe(user => {
          product['user_id'] = user.user_id
        })
        this.store.dispatch(addProduct({product: product}));
      }else{
        console.log("error uploading images")
      }
    }
  }

  onCategoryChange(event: any) {
    if (event.target.value === 'Others') {
      this.newCatHidden = false;

      // Ensure that the view has been updated before focusing on the input
      this.cdr.detectChanges();
      this.newCat.nativeElement.focus();
      console.log("Focused on new category input");
    } else {
      this.newCatHidden = true;
    }
  }


  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(first()).subscribe(async (params) => {
      this.mode = params['mode'];
      if (this.mode === 'update') {
        let productToUpdate: ProductModel = history.state.product as ProductModel;
        this.addProductForm = this.fb.group({
          id: [productToUpdate.id],
          owner: [productToUpdate.owner],
          product_name: [productToUpdate.product_name, Validators.required],
          product_description: [productToUpdate.product_description, [Validators.required]],
          product_actual_price: [productToUpdate.product_actual_price, [Validators.required, Validators.min(0)]],
          product_category: [productToUpdate.product_category === 'Others' ? 'Others' : productToUpdate.product_category, Validators.required],
          newCategory: [productToUpdate.product_category === 'Others' ? productToUpdate.product_category : ''],
          stock: [productToUpdate.stock, [Validators.required, Validators.min(1)]],
        });
        this.product = productToUpdate;
        for (let imgUrl of this.product.product_images!) {
          this.filesService.generateImageUrl(imgUrl).pipe(first()).subscribe(blob=>{
            this.images_urls.push(blob.url);
            this.selectedFiles.push(blob.file)
          }
          );
        }
      }
    });
  }

}
