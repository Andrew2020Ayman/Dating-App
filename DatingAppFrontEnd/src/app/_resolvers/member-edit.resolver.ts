import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable,of } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "../_models/user";
import { AlertifyService } from "../_Servcies/alertify.service";
import { AuthService } from "../_Servcies/auth.service";
import { UserService } from "../_Servcies/user.service";

@Injectable()
export class MemberEditResolver implements Resolve<User>{

  constructor(private userService:UserService , private router:Router ,private auth:AuthService,
              private alertify:AlertifyService){}

    resolve(route: ActivatedRouteSnapshot):Observable<User>{
      return this.userService.getUser(this.auth.decodedToken.nameid).pipe(
        catchError(error=>{
          this.alertify.error('Problem retrieving data');
          this.router.navigate(['/members']);
          return of(null);
        })
      )
    }
}
