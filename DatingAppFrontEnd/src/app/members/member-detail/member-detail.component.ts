import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery-9';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_Servcies/alertify.service';
import { UserService } from 'src/app/_Servcies/user.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss']
})
export class MemberDetailComponent implements OnInit {

@ViewChild('memberTabs', { static: true }) memberTabs?: TabsetComponent;
  user:User;
  galleryOptions:NgxGalleryOptions[];
  galleryImages:NgxGalleryImage[];

  constructor(private userService :UserService,private alertify:AlertifyService,
              private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const selectTab = params['tab'];

      this.memberTabs.tabs[(selectTab > 0 ? selectTab : 0)].active = true;
    });

    this.route.data.subscribe(data=>{
      this.user = data['user'];
    });



    this.galleryOptions = [
      {
        width:'500px',
        height:'500px',
        imagePercent:100,
        thumbnailsColumns:4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview:false
      }
    ];
    this.galleryImages = this.getImages();
  }

  getImages(){
    const imageUrls = [];
    for(let i=0 ; i< this.user.photos.length; i++){
      imageUrls.push({
        small:this.user.photos[i].url,
        medium:this.user.photos[i].url,
        big:this.user.photos[i].url,
        describtion: this.user.photos[i].description
      })
    }
    return imageUrls;
  }
  selectTab(tabId : number){
    this.memberTabs.tabs[tabId].active = true;
  }
 /*  loadUser(){
     return this.userService.getUser(+this.route.snapshot.params['id']).subscribe((user:User)=>{
       this.user = user;
     },error =>{
       this.alertify.error(error);
     })
  } */
}
