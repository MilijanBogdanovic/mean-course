import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { KontaktComponent } from './kontakt/kontakt.component';
import { MasterstudijeComponent } from './masterstudije/masterstudije.component';
import { NastavniciComponent } from './nastavnici/nastavnici.component';
import { NaukaComponent } from './nauka/nauka.component';
import { OsnovnestudijeComponent } from './osnovnestudije/osnovnestudije.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
const routes: Routes = [
  {path: '', component: PostListComponent},
  {path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]},
  {path: 'edit/:postId',component: PostCreateComponent, canActivate: [AuthGuard]},
  {path:'login', component: LoginComponent},
  {path:'signup', component: SignupComponent},
  {path:'nastavnici', component: NastavniciComponent},
  {path:'osnovnestudije', component: OsnovnestudijeComponent},
  {path:'masterstudije', component: MasterstudijeComponent},
  {path:'nauka', component: NaukaComponent},
  {path:'kontakt', component: KontaktComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
