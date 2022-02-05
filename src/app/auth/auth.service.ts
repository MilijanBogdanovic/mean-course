import { HttpClient } from "@angular/common/http";
import { ComponentFactoryResolver, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { User } from "../nastavnici/user.model";
import { Post } from "../posts/post.model";
import { AuthData } from "./signup/auth-data-model";
import { SignupData } from "./signup/signup-data-model";

@Injectable({providedIn: "root"})
export class AuthService {
  private isAuthenticated:any = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private useremail:string;
  private favoritePosts:string[];
  private authStatusListener = new Subject<boolean>();
  private authEmailListener = new Subject<string>();
  private postsUpdated = new Subject<{posts: string[]}>();
  constructor(private http: HttpClient, private router:Router) {}


  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }
  getUserId() {
    return this.userId;
  }
  getUserEmail() {
    return this.useremail;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getAuthEmailListener() {
    return this.authEmailListener.asObservable();
  }
  getUserFavoritePosts(){
    //console.log(this.favoritePosts.toString());
    return this.favoritePosts;
  }
  createUser(name:string,surname:string,username: string, email:string,password:string,city:string,date_of_birth:string,contact_phone:string,image: File) {
    const postData = new FormData();
    postData.append("name", name);
    postData.append("surname", surname);
    postData.append("username", username);
    postData.append("email", email);
    postData.append("password", password);
    postData.append("city", city);
    postData.append("date_of_birth", date_of_birth);
    postData.append("contact_phone", contact_phone);
    postData.append("image", image, username);
    this.http.post<{message: string, user: User}>('http://localhost:3000/api/users/signup', postData)
    .subscribe(responseData => {
      this.router.navigate(["/"]);
    });

  }

  login(email: string, password: string) {
    const authData: AuthData = {email:email, password:password};
    this.http.post<{token: string, expiresIn: number, userId: string,useremail:string,favoritePosts:string[]}>("http://localhost:3000/api/users/login",authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if(token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          // console.log(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.useremail = response.useremail;
          this.favoritePosts = response.favoritePosts;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration*1000);
          this.saveAuthData(token, expirationDate, this.userId,this.favoritePosts);
          this.router.navigate(['/list']);
        }

      })
  }
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if(!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.favoritePosts = authInformation.favoritePosts;
      this.setAuthTimer(expiresIn /1000); //authtimer works with seconds
      this.authStatusListener.next(true);
    }

  }

  logout() {
    this.token =null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);

  }

  private setAuthTimer(duration:number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration*1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId:string,favoritePosts:string[]) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration",expirationDate.toISOString());
    localStorage.setItem("userId", userId);
    localStorage.setItem("favoritePosts",JSON.stringify(favoritePosts));
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
    localStorage.removeItem("favoritePosts");
  }
  private getAuthData():any {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const favoritePosts = JSON.parse(localStorage.getItem("favoritePosts"));
    if( !token || !expirationDate) {
      return;
    }
    return {
      token:token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      favoritePosts: favoritePosts
    }
  }

  updateFavoritePost(postId: string){
    let favoritePosts = JSON.parse(localStorage.getItem("favoritePosts"));
    if(favoritePosts!=null){
      favoritePosts.push(postId);
      localStorage.setItem("favoritePosts",JSON.stringify(favoritePosts));
      console.log(favoritePosts.toString());

    }
  }

  // makeFavorite(postId:string) {
  //   let postData = new FormData();
  //   postData.append("postId",postId);
  //   const queryParams =`?postId=${postId}`;
  //   this.http.put<{postData:string[]}>('http://localhost:3000/api/users/favorite/'+this.userId+queryParams,{})
  //   .subscribe(transformedPostData => {
  //     this.favoritePosts = transformedPostData.favoritePosts;
  //     this.postsUpdated.next({posts: [...this.favoritePosts]});
  //   });
  // }

}
