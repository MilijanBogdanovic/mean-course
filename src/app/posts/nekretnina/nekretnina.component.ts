import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import {Subscription} from 'rxjs';
import { AuthService } from "src/app/auth/auth.service";
import { mimeType } from '../post-create/mime-type.validator';
import {Post} from '../post.model';
import {PostsService} from '../posts.service';
@Component({
  selector: 'app-nekretnina',
  templateUrl: './nekretnina.component.html',
  styleUrls: ['./nekretnina.component.css']
})
export class NekretninaComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  enteredTip = "";
  enteredOznaka = "";
  enteredUploadedImages = "";
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  // imagePreview2: string;
  private mode = 'create';
  private postId: string;
  ngOnInit() {
    console.log("Hello!");
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {validators: [Validators.required]}),
      tip: new FormControl(null, {validators: [Validators.required]}),
      oznaka: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required],
        asyncValidators: [mimeType]}),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'nekretnina';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content, tip:postData.tip,oznaka:postData.oznaka,imagePath:postData.imagePath,creator:postData.creator};
          this.form.setValue({title: this.post.title,content : this.post.content,tip:this.post.tip,oznaka:this.post.oznaka,image: this.post.imagePath});
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
  constructor(public postsService: PostsService, public route:ActivatedRoute,private router:Router) {}

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
  onSavePost(){
    this.router.navigate(["/"]);
  }
}

