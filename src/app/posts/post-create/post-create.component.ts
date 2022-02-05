import { Component, ComponentFactoryResolver, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";

import { PostsService } from "../posts.service";
import {mimeType} from "./mime-type.validator";
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
  enteredTitle = "";
  enteredContent = "";
  enteredTip = "";
  enteredOznaka = "";
  enteredUploadedImages = "";
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview1 = "";
  imagePreview2 = "";
  imagePreview3 = "";
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
      image1: new FormControl(null, {validators: [Validators.required],
        asyncValidators: [mimeType]}),
      image2: new FormControl(null, {validators: [Validators.required],
          asyncValidators: [mimeType]}),
      image3: new FormControl(null, {validators: [Validators.required],
            asyncValidators: [mimeType]}),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
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
  constructor(public postsService: PostsService, public route:ActivatedRoute) {}

  onImagesPicked(event:Event) {
    let fajlovi = (event.target as HTMLInputElement).files;
    let file;
    console.log(fajlovi);
    this.form.patchValue({image1:fajlovi[0]});
    this.form.patchValue({image2:fajlovi[1]});
    if(fajlovi[3]!=null){
      this.form.patchValue({image3:fajlovi[2]});
    }
    this.form.get('image1').updateValueAndValidity();
    this.form.get('image2').updateValueAndValidity();
    // for(let i=0;i<fajlovi.length;i++){
    //   this.form.get('images').updateValueAndValidity();
    //   console.log(this.form.get('images[i]'));
    // }
    const file1 = (event.target as HTMLInputElement).files[0];
    const file2 = (event.target as HTMLInputElement).files[1];
    // this.form.patchValue({image1: file1});
    // this.form.patchValue({image1: file2});
    // this.form.get('image1').updateValueAndValidity();
    // this.form.get('image2').updateValueAndValidity();
    for(let i=0;i<fajlovi.length;i++){
      const file = (event.target as HTMLInputElement).files[i];
      const reader = new FileReader();
      reader.onload = () => {
        if(i==0){
          this.imagePreview1 = reader.result as string;
        }
        else if(i==1){
          this.imagePreview2 = reader.result as string;
        }
        else if(i==2){
          this.imagePreview3 = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
    // console.log(this.imagePreview1);
    // console.log(this.imagePreview2);
  }

  onImagePicked(event:Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      // this.imagePreview1 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  onSavePost(){
    if(this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create') {
      this.postsService.addPost(this.form.value.title,this.form.value.content,this.form.value.tip,this.form.value.oznaka,this.form.value.image);
    } else {
      this.postsService.updatePost(this.postId,this.form.value.title,this.form.value.content,this.form.value.tip,this.form.value.oznaka,this.form.value.image);
    }
    this.form.reset();
  }

}
