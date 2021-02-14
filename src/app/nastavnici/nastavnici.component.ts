import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from './user.model';
import { UsersService } from './users.service';

@Component({
  selector: 'app-nastavnici',
  templateUrl: './nastavnici.component.html',
  styleUrls: ['./nastavnici.component.css']
})
export class NastavniciComponent implements OnInit {





  users:User[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  userId: string;
  private usersSub:Subscription;
  private authStatusSubs: Subscription;
  private userIsAuthenticated = false;
  constructor(public usersService: UsersService,public authService:AuthService) {}


  ngOnInit() {
    this.isLoading = true;
    this.usersService.getPosts(this.postsPerPage,this.currentPage);
    this.userId = this.authService.getUserId();
    this.usersSub = this.usersService.getPostUpdateListener().
    subscribe((userData:{users: User[],userCount: number}) => {
      this.isLoading = false;
      this.totalPosts = userData.userCount;
      this.users =userData.users;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.usersService.getPosts(this.postsPerPage,this.currentPage);
  }

  onDelete(postId:string) {
    this.isLoading =true;
    this.usersService.deletePost(postId).subscribe(() => {
      this.usersService.getPosts(this.postsPerPage,this.currentPage);
    });
  }


  ngOnDestroy() {
    this.usersSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }


}
