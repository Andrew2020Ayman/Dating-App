import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertifyService } from '../_Servcies/alertify.service';
import { AuthService } from '../_Servcies/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model : any ={};
  photoUrl:string;

  constructor(private auth: AuthService , private alertify: AlertifyService,private router:Router) { }

  ngOnInit(): void {
    this.auth.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  login(){
    console.log(this.model);

      this.auth.login(this.model).subscribe(res => {
        this.alertify.success("Logged in successfully");
      },error =>{
        this.alertify.error(error);
      },()=>{
        this.router.navigate(['/members']);
      });
  }
  loggedIn(){
    return this.auth.loggedIn();
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user')
    this.auth.decodedToken = null;
    this.auth.currentUser = null;
    this.alertify.message("Logged out");
    this.router.navigate(['/Home']);
  }
}
