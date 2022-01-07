import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  isLoading = false;
  isClicked:boolean = false;
  constructor(public authService: AuthService) { }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.name, form.value.surname,
      form.value.username,
      form.value.email,
      form.value.password,form.value.city,form.value.dateOfBirth,form.value.contactPhone);
  }
  pritisnut() {
    this.isClicked = true;
  }

}



