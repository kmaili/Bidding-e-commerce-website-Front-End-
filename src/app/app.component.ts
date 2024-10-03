import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {authenticateWithToken} from "./states/user-state/auth.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'e-commerce';

  constructor(private store: Store) {
  }
  ngOnInit(): void {
    this.store.dispatch(authenticateWithToken())
  }
}
