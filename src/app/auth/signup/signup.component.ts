import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { mimeType } from "./mime-type.validator";

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit{
  isLoading = false;
  isClicked:boolean = false;
  enteredName = "";
  enteredSurname = "";
  enteredUsername = "";
  enteredEmail = "";
  enteredPassword = "";
  enteredCity = "";
  enteredDate_of_Birth = "";
  enteredContact_Phone = "";
  form: FormGroup;
  aFormGroup: FormGroup;
  imagePreview: string;
  siteKey:string ="6Lf0qSceAAAAABN9cI1SxRZao8r9kQx0RdFngA3f";
  ngOnInit(){
    this.form = new FormGroup({
      name: new FormControl(null, {validators: [Validators.required]}),
      surname: new FormControl(null, {validators: [Validators.required]}),
      username: new FormControl(null, {validators: [Validators.required]}),
      email: new FormControl(null, {validators: [Validators.required]
      }),
      password: new FormControl(null, {validators: [Validators.required]}),
      city: new FormControl(null, {validators: [Validators.required]}),
      date_of_birth: new FormControl(null, {validators: [Validators.required]}),
      contact_phone: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required],
        asyncValidators: [mimeType]})
    });
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });
  }
  constructor(public authService: AuthService,private formBuilder: FormBuilder) { }

  onImagePicked(event:Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSignUp(){
    if(this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(this.form.value.name,this.form.value.surname,this.form.value.username,this.form.value.email,this.form.value.password,this.form.value.city,this.form.value.date_of_birth,
                                this.form.value.contact_phone,this.form.value.image);
    this.form.reset();
  }

}



