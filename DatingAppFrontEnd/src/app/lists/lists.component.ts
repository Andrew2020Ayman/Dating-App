import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginationResult } from '../_models/pagination';
import { User } from '../_models/user';
import { AlertifyService } from '../_Servcies/alertify.service';
import { AuthService } from '../_Servcies/auth.service';
import { UserService } from '../_Servcies/user.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

users:User[];
pagination:Pagination;
likesParam  : string;

  constructor( private auth:AuthService , private userService:UserService,
               private route:ActivatedRoute,private alertify:AlertifyService) { }

  ngOnInit() {
    this.likesParam = 'Likers';

    this.route.data.subscribe(data=>{
    this.users = data['users'].result;
    this.pagination = data['users'].pagination;
    });
this.loadUsers();


  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers(){
    this.userService.getUsers(this.pagination.currentPage , this.pagination.itemsPerPage,null,this.likesParam)
    .subscribe((response:PaginationResult<User[]>)=>{
      this.users = response.result;
      this.pagination = response.pagination;
      console.log(this.users);

    },error=>{
      this.alertify.error(error);
    })
  }


}
