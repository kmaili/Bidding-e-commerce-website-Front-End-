import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserModel} from "../models/userModel";
import {Store} from "@ngrx/store";
import {signup, update} from "../states/user-state/auth.actions";
import {selectProfilePic, selectUser} from "../states/user-state/auth.selectors";
import {FilesService} from "../services/files.service";
import {SafeUrl} from "@angular/platform-browser";
import {debounceTime, distinctUntilChanged, filter, first, Observable} from "rxjs";
import {productSelector} from "../states/product-state/product-selectors";
import {ProductModel} from "../models/productModel";
import {ProductService} from "../services/product.service";
import {Router} from "@angular/router";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('sortBy') orderBy!: ElementRef;
  private profilePicture!: SafeUrl;
  sortOrder: string = 'asc';
  isVisible: boolean = false;
  selectedFile!: File;
  profile_pic_url!: string;
  pageProducts: ProductModel[] = []
  pageSize: number = 12;
  totalPages: number = 0;
  totalProductsCount: number = 0;
  selectedPage = 1;
  pageRange!: number[];
  searchQuery?: string = undefined;
  searchController = new FormControl();

  openOverlay(): void {
    this.isVisible = true;
  }

  closeOverlay(): void {
    this.isVisible = false;
  }

  constructor(private store : Store, private filesService: FilesService, private productService: ProductService, private router: Router) {
  }

  editingField?: keyof UserModel;
  userModel: UserModel = new UserModel();
  initialUserModel: UserModel = new UserModel();

  setEditing(field?: keyof UserModel | undefined, previousField?: keyof UserModel | undefined): void {
    if (field === undefined &&
      this.userModel[previousField!] !== this.initialUserModel[previousField!]) {
      this.store.dispatch(update({field: previousField!, value: this.userModel[previousField!]!}));
      this.store.select(selectUser).pipe(first()).subscribe(updatedUserModel => {
        if (updatedUserModel[previousField!] === this.userModel[previousField!]!) {
          console.log("updated ----------"+updatedUserModel.first_name)
          this.initialUserModel = {...updatedUserModel}
          this.userModel = {...this.userModel}
        }
      });
      }
    this.editingField = field;
  }

  updateValue(field: keyof UserModel, event: any): void {
    const inputValue: string = event.target.value;
    this.userModel[field] = inputValue;
  }

  checkEditing(field: string) {
    return field !== this.editingField;
  }

  ngOnInit(): void {
    this.store.select(selectUser).pipe(filter(user => isNotEmpty(user)), // Ensure non-null user
      first()).subscribe(userModel => {
      this.initialUserModel = {... userModel };
      this.userModel = {... userModel };
      console.log("profile: ", this.userModel)
    })
    this.loadUserProducts();
    this.store.select(selectProfilePic).subscribe(imageId => {
      if (imageId) {
        this.filesService.generateImageUrl(imageId).subscribe(blob => {
          this.profilePicture = blob.url
        })
      }
    });
    this.searchController.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged()
    ).subscribe(query=>{
      this.selectedPage = 1
      this.orderBy.nativeElement.value = "created_at";
      this.searchQuery = query;
      this.loadUserProducts(query)
    })
  }
  getProfilePicBgStyle() {
    return {
      'background-image': `url(${this.profilePicture})`,
      'background-size': 'cover',    // Ensures the image fills the div
      'background-position': 'center'
    };
  }

  changeProfilePic(){
    this.filesService.upload(this.selectedFile).subscribe(
      (response) => {
        let fileId = response.fileId
        this.store.dispatch(update({field: "profile_image", value: fileId}));
      },
      (error: Error) => {
        console.log(error);
      }
    )
  }
  selectImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && this.isImageFile(file)) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profile_pic_url = e.target?.result as string; // Set the image source
      };
      reader.readAsDataURL(file);
      this.changeProfilePic()
    }
    return false
  }
  isImageFile(file: File): boolean {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return validImageTypes.includes(file.type);
  }

  protected loadUserProducts(searchQuery: string | undefined = undefined) {
    let userId: string = "2"//this.userModel.user_id!
    this.productService.loadByUser(userId, this.selectedPage-1, this.pageSize, this.orderBy == undefined ? 'created_at':this.orderBy.nativeElement.value, this.sortOrder, searchQuery ? searchQuery : undefined).subscribe(
      response => {
        this.pageProducts = response.content
        this.totalPages = response.totalPages;
        this.totalProductsCount = response.totalElements;
        this.generatePageRange()
      },
      error => {
        console.log(error);
      }
    )
  }
  reloadProductsWithOrder(){
    this.loadUserProducts(this.searchQuery);
  }
  generatePageRange(){
    let before;
    if (this.selectedPage - 2 > 0)
      before = 2
    else
      before = this.selectedPage - 1;

    let after;
    if (this.selectedPage + (5-before-1) <= this.totalPages)
      after = 5-before-1;
    else
      after = this.totalPages - this.selectedPage
    if ( (before+after+1 < 5) && after < 2 && this.selectedPage-before-(2-after) >= 1)
      before = before + (2-after);
    else if ( (before+after+1 < 5) && before < 2 && this.selectedPage+after+(2-before) <= this.totalPages)
      after = after + (2-before);
    let arr = [];
    for (let i = this.selectedPage-before;i<=this.selectedPage+after;i++)
      arr.push(i);
    this.pageRange = arr;
  }

  navigateToEditPage(product: ProductModel) {
    this.router.navigate(['/product'], {queryParams: {mode: "update"}, state: {product: product}});
  }
}
function isNotEmpty(user: UserModel): boolean {
  return user.user_id !== undefined &&
    user.first_name !== "" &&
    user.last_name !== "" &&
    user.email !== "" &&
    user.phone !== "" &&
    user.username !== "" &&
    user.birth !== "" &&
    user.profile_image !== undefined;
}
