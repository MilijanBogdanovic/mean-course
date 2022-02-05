import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";
import { ActivatedRoute } from "@angular/router";
import {Subscription} from 'rxjs';
import { AuthService } from "src/app/auth/auth.service";
import {Post} from '../post.model';
import {PostsService} from '../posts.service';

@Component({
  selector: 'app-gost',
  templateUrl:'./gost.component.html',
  styleUrls: ['./gost.component.css']
})
export class GostComponent implements OnInit, OnDestroy{
  /* posts = [
  {title:'First Post', content: 'This is the first post\'s content'},
  {title:'Second Post', content: 'This is the second post\'s content'},
  {title:'Third Post', content: 'This is the third post\'s content'}
  ]; */
  posts:Post[] = [];
  isLoading = false;
  totalPosts = 0;

  userIsAuthenticated:any = false;
  userId: string;
  private postsSub:Subscription;
  private authStatusSubs: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) {}


  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPostsLastFive();
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener().
    subscribe((postData:{posts: Post[],postCount: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
  }


  onSearch(form: NgForm) {
    if(form.invalid) {
      console.log("RETURN!");
      return;
    }
    this.isLoading = true;
    //this.postsService.searchBySingleFilter(this.postsPerPage, this.currentPage,"content",form.value.content);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }
}
