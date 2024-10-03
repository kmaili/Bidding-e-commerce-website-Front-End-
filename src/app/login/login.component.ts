import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {AbstractControl, FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";
import {FilesService} from "../services/files.service";
import {ToastrService} from "ngx-toastr";
import {Store} from "@ngrx/store";
import {login, signup} from "../states/user-state/auth.actions";
import {selectIsLoggedIn} from "../states/user-state/auth.selectors";
import {UserModel} from "../models/userModel";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  page:string = "login";
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  selectedFile!: File;
  profile_pic_url!: string;
  constructor(private store: Store, private fb: FormBuilder, private signupService: AuthenticationService, private filesService: FilesService, private toastr: ToastrService) {}


  switchPage(): void{
    if (this.page == "login")
      this.page = "signup";
    else
      this.page = "login";
  }

  submit(): void {
    if (this.page == 'signup'){
      if (this.signupForm.valid){
        this.filesService.upload(this.selectedFile).subscribe(
          (response) => {
            let userData: UserModel = this.signupForm.value
            userData['profile_image'] = response.fileId
            this.store.dispatch(signup({user: userData}))
          },
          (error: Error) => {
            console.log(error);
            this.toastr.error('Something went wrong!', 'Oops!');
          }
        )
      }else{
        this.toastr.warning('all fields are required', 'Complete credentials');
      }
    }else{

      this.store.dispatch(login({user: this.loginForm.value}))
      this.store.select(selectIsLoggedIn).subscribe(isLoggedIn => {
        if (isLoggedIn) {
          window.location.reload();
        }
      });

    }
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        first_name: ['', [Validators.required, Validators.pattern("[a-zA-Z]+")]],
        last_name: ['', [Validators.required, Validators.pattern("[a-zA-Z]+")]],
        username: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-8]+$")]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        cpassword: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
        birth: ['', [Validators.required]],
        profile_image: ['', [Validators.required]]
      },{validators: [this.confirmPasswordValidator]}
    )
    this.loginForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.required]],
      }
    )
  }

  confirmPasswordValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('cpassword')?.value;

    if (password === confirmPassword)
      return null;
    else{
      control.get('cpassword')?.setErrors({passwordMismatch: true});
      return { passwordMismatch: true };
    }
  }

  getControlCondition(control: AbstractControl, is_image_control: boolean = false): boolean {
    return control.invalid && (is_image_control ? true : control.value.length != 0);
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
    }
  }
  isImageFile(file: File): boolean {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return validImageTypes.includes(file.type);
  }
}
