import { BOOL_TYPE } from "@angular/compiler/src/output/output_ast";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl:'./header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  userIsAuthenticated:any= false;
  private authListenerSubs: Subscription;
  useremail:string;
  constructor(private authService: AuthService){}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.useremail = this.authService.getUserEmail();
      localStorage.setItem("useremail",this.useremail);
    });
    this.useremail = localStorage.getItem("useremail");
    console.log(localStorage);
  }
  onLogout() {
    this.authService.logout();
    localStorage.clear();
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
