import { Component, Input, OnInit } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Message } from 'src/app/_models/message';
import { AlertifyService } from 'src/app/_Servcies/alertify.service';
import { AuthService } from 'src/app/_Servcies/auth.service';
import { UserService } from 'src/app/_Servcies/user.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss']
})
export class MemberMessagesComponent implements OnInit {

@Input() recipientId:number;
messages : Message[];

newMessage:any ={};

  constructor(private userService:UserService ,
      private alertify:AlertifyService,private auth :AuthService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages(){

    const currentUserId = this.auth.decodedToken.nameid;
    this.userService.getMessageThread(this.auth.decodedToken.nameid,this.recipientId)
    .pipe(
      tap(messages => {
        console.log(messages);
        for (let message of messages) {
          if (message.isRead != true && message.recipientId == currentUserId) {
            console.log(message);

            this.userService.markAsRead(currentUserId, message.id);
          }
        }
      })
    )
      .subscribe(messages => {
       this.messages = messages;
      },error => {
        this.alertify.error(error);
      })
  }

  sendMessage(){
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.auth.decodedToken.nameid,this.newMessage)
    .subscribe((message:Message) => {
      this.messages.unshift(message);
      this.newMessage.content = '';
    },error =>{
      this.alertify.error(error);
    })
  }
}
