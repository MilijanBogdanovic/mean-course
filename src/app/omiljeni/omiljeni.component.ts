import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Post } from '../posts/post.model';
import { PostsService } from '../posts/posts.service';

@Component({
  selector: 'app-omiljeni',
  templateUrl: './omiljeni.component.html',
  styleUrls: ['./omiljeni.component.css']
})
export class OmiljeniComponent implements OnInit, OnDestroy{
  /* posts = [
  {title:'First Post', content: 'This is the first post\'s content'},
  {title:'Second Post', content: 'This is the second post\'s content'},
  {title:'Third Post', content: 'This is the third post\'s content'}
  ]; */
  posts:Post[] = [];
  favoritePosts:string[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  userIsAuthenticated:any = false;
  userId: string;
  private postsSub:Subscription;
  private authStatusSubs: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) {
    this.ngOnInit();
  }


  ngOnInit() {
    this.isLoading = true;
    this.userIsAuthenticated = this.authService.getIsAuth();

    //this.authService.getFavoritePosts();
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
      this.postsSub = this.authService.getPostUpdateListener().
      subscribe((postData:{posts: string[]}) => {
        this.favoritePosts = postData.posts;
      });

    });
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener().
    subscribe((postData:{posts: Post[],postCount: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
      // this.favoritePosts = postData.favoritePosts;
    });

    //console.log(localStorage.getItem("favoritePosts"));
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
  }

  onDelete(postId:string) {
    this.isLoading =true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage,this.currentPage);
    });
  }


  onSearch(form: NgForm) {
    if(form.invalid) {
      console.log("RETURN!");
      return;
    }
    this.isLoading = true;

    this.postsService.searchBySingleFilter(this.postsPerPage, this.currentPage,form.value.title,form.value.content);
    //this.postsService.searchBySingleFilter(this.postsPerPage, this.currentPage,"content",form.value.content);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }
}

