import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertifyService } from '../_Servcies/alertify.service';
import { AuthService } from '../_Servcies/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth : AuthService , private router:Router,
              private alertify:AlertifyService){}

  canActivate():boolean  {
    if(this.auth.loggedIn() ) { return true; }
    this.alertify.error('You shall not pass!!!');
    this.router.navigate(['/Home']);
    return false;
  }

}
