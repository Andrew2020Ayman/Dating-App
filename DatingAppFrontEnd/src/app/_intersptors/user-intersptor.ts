import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertifyService } from '../_Servcies/alertify.service';
import { AuthService } from '../_Servcies/auth.service';

​
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
     private AuthServ:AuthService,
     private alertify:AlertifyService,
     private router: Router
     ) {}
​
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const AuthToken = localStorage.getItem('token');
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + AuthToken),
    });
    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
         if(error.status === 401|| error.status === 403){
          errorMsg = `Error Code: ${error.status},  Message: ${error.error.message}`;

          localStorage.removeItem("token");
          localStorage.removeItem("user");
          this.router.navigateByUrl("Home");
          return throwError(errorMsg);
         }
         else if(error.status == 409){
          console.log('this is server side error');
         }
         else{
          return throwError(error);
         }
      })
    );
  }

}
