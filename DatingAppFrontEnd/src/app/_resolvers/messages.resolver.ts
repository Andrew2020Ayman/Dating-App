import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable,of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Message } from "../_models/message";
import { AlertifyService } from "../_Servcies/alertify.service";
import { AuthService } from "../_Servcies/auth.service";
import { UserService } from "../_Servcies/user.service";

@Injectable()
export class MessagesResolver implements Resolve<Message[]>{

  pageNumber = 1;
  PageSize = 5;
  messageContainer = 'Unread';
  constructor(private userService:UserService , private router:Router ,
              private alertify:AlertifyService , private auth : AuthService){}

    resolve(route: ActivatedRouteSnapshot):Observable<Message[]>{
      return this.userService.getMessages(this.auth.decodedToken.nameid,
          this.pageNumber,this.PageSize , this.messageContainer).pipe(
          catchError(error=>{
            this.alertify.error('Problem retrieving data');
            this.router.navigate(['/home']);
            return of(null);
        })
      )
    }
}
