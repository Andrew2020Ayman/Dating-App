import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_Servcies/alertify.service';
import { AuthService } from 'src/app/_Servcies/auth.service';
import { UserService } from 'src/app/_Servcies/user.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent implements OnInit {

  @Input() user:User;
  constructor(private auth:AuthService ,private userService:UserService,
              private alertify:AlertifyService){}
  ngOnInit() {
  }

  sendLike(id:number){
    this.userService.sendLike(this.auth.decodedToken.nameid,id).subscribe(data => {
      this.alertify.success('You have liked: ' + this.user.knownAs);
    },error =>{
      this.alertify.error(error);
    });
  }
}
