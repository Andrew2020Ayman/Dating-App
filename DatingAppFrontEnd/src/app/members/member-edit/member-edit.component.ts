import { ChangeDetectionStrategy, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_Servcies/alertify.service';
import { AuthService } from 'src/app/_Servcies/auth.service';
import { UserService } from 'src/app/_Servcies/user.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
 @ViewChild('editForm') editForm:NgForm;
 user:User;
  photoUrl: string;
 @HostListener('window:beforeunload',['$event'])
 unloadNotification($event:any){
   if(this.editForm.dirty){
     $event.returnValue = true;
   }
 }
  constructor(private route:ActivatedRoute,private userService:UserService,
    private auth:AuthService,private alertify:AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data=>{
      this.user = data['user'];
    });
    this.auth.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  updateUser(){
    this.userService.updateUSer(this.auth.decodedToken.nameid, this.user).subscribe(next =>{
      this.alertify.success('Profile updated Successfully');
      this.editForm.reset(this.user);
    },error=>{
       this.alertify.error(error);
    })
  }

  updateMainPhoto(photoUrl){
    this.user.photoUrl = photoUrl;
  }
}
