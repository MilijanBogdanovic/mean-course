import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators'
import { Router } from '@angular/router';
import { query } from '@angular/animations';
import { User } from './user.model';

@Injectable({providedIn: 'root'})
export class UsersService {
 private users: User[] = [];
 private usersUpdated = new Subject<{users: User[], userCount: number}>();

 constructor(private http: HttpClient,private router:Router) {}

  getPosts(postsPerPage:number, currentPage:number) {
    const queryParams =`?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, users:any, maxUsers: number}>('http://localhost:3000/api/users' +queryParams)
    .pipe(map((userData) => {
      return {users: userData.users.map(post => {
        return  {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          creator: post.creator
        };
      }), maxPosts: userData.maxUsers };
    }))
    .subscribe(transformedUserData => {
      console.log(transformedUserData);
      this.users = transformedUserData.users;

      this.usersUpdated.next({users: [...this.users], userCount:transformedUserData.maxPosts});
    });
  }

  getPostUpdateListener() {
    return this.usersUpdated.asObservable();
  }
  getPost(id:string) {
    return this.http.get<{_id:string, email:string}>("http://localhost:3000/api/users/" + id);
  }




  deletePost(postId:string) {
    return this.http.delete("http://localhost:3000/api/users/" + postId);
  }
}
