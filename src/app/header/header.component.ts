import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {LoginComponent} from "../login/login.component";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {selectIsLoggedIn, selectProfilePic, selectUser} from "../states/user-state/auth.selectors";
import {logout} from "../states/user-state/auth.actions";
import {DomSanitizer, SafeStyle, SafeUrl} from "@angular/platform-browser";
import {FilesService} from "../services/files.service";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  isLoggedIn!: Observable<boolean>;
  user!: Observable<any>;
  profilePicture!: SafeUrl;

  constructor(public dialog : MatDialog, private store : Store, private filesService: FilesService, private sanitizer: DomSanitizer) {}
  openLoginDialog() {
    this.dialog.open(LoginComponent, {
      width: '90%',
      height: '90%',
      disableClose: false,
    });
  }
  logout():void{
    this.store.dispatch(logout());

  }
  ngOnInit(): void {
    this.isLoggedIn = this.store.select(selectIsLoggedIn)
    this.user = this.store.select(selectUser)

    this.store.select(selectProfilePic).subscribe(image => {
      if (image) {
        this.filesService.download(image).subscribe(response => {
          const blob = new Blob([response.body!], { type: response.body!.type });
          const objectUrl = URL.createObjectURL(blob);
          console.log('Blob:', blob);
          console.log('Object URL:', blob);
          console.log('Response Type:', typeof blob);
          this.profilePicture= `url(${objectUrl})`;
          setTimeout(() => {
            URL.revokeObjectURL(objectUrl);
          }, 5000);
        });
      }
    });
  }
  getProfilePicBgStyle() {
    return {
      'background-image': this.profilePicture,
      'background-size': 'cover',    // Ensures the image fills the div
      'background-position': 'center'
    };
  }

}
