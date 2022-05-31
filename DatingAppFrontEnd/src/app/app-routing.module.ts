import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';


const routes :Routes =[
  {path: '',redirectTo: `Home`, pathMatch: 'full' },
  {path:'Home',component:HomeComponent },
  {
    path:'',
    runGuardsAndResolvers:'always',
    canActivate:[AuthGuard],
    children:[
      {path:'members',component:MemberListComponent , resolve:{users:MemberListResolver}},
      {path:'members/:id',component:MemberDetailComponent,resolve:{user:MemberDetailResolver}},

      {path:'member/edit',component:MemberEditComponent,
      resolve:{user:MemberEditResolver} , canDeactivate:[PreventUnsavedChanges]},
      {path:'lists',component:ListsComponent},
      {path:'messages',component:MessagesComponent}
    ]
  },


]

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
