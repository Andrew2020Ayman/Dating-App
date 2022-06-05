import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../_models/message';
import { Pagination, PaginationResult } from '../_models/pagination';
import { AlertifyService } from '../_Servcies/alertify.service';
import { AuthService } from '../_Servcies/auth.service';
import { UserService } from '../_Servcies/user.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
messages : Message[];
pagination: Pagination;
messageContainer = 'Unread';

  constructor( private userService:UserService , private auth :AuthService,
    private route:ActivatedRoute,private alertify:AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages =data['messages'].result;
      this.pagination = data['messages'].pagination;

    })
  }

  loadMessages(){
    this.userService.getMessages(this.auth.decodedToken.nameid,this.pagination.currentPage,
      this.pagination.itemsPerPage,this.messageContainer)
      .subscribe((res:PaginationResult<Message[]>) =>{
          this.messages = res.result;
          this.pagination = res.pagination;
      },error => {
        this.alertify.error(error);
      })
  }

  deleteMessage(id:number){
    this.alertify.confirm('Are you sure you want to delete this message',()=>{
      this.userService.deleteMessage(id,this.auth.decodedToken.nameid).subscribe(()=>{
        this.messages.splice(this.messages.findIndex(m => m.id === id,1));
        this.alertify.success('Message has been deleted')
      },error =>{
        this.alertify.error(error);
      })
    })
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }
}
