import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { PaginationResult } from '../_models/pagination';
import { User } from '../_models/user';
/*
const httpOptions ={
  headers: new HttpHeaders({
   'Authorization':'Bearer '+ localStorage.getItem('token')
  })
}; */

@Injectable({
  providedIn: 'root'
})
export class UserService {

 baseUrl = environment.apiUrl ;
constructor(private http : HttpClient) { }

  getUsers(page? , itemsPerPage? , userParams?,likeParams?): Observable<PaginationResult<User[]>>{
    const paginationResult:PaginationResult<User[]> = new PaginationResult<User[]>();
    let params = new HttpParams();
    if(page != null && itemsPerPage != null){
      params = params.append('pageNumber',page);
      params = params.append('pageSize',itemsPerPage);
    }

    if(userParams != null)
    {
      params = params.append('minAge',userParams.minAge);
      params = params.append('maxAge',userParams.maxAge);
      params = params.append('gender',userParams.gender);
      params = params.append('orderBy',userParams.orderBy);
    }

    if(likeParams === 'Likers'){
      params =params.append('Likers','true');
    }
    if(likeParams === 'Likees'){
      params =params.append('Likees','true');
    }
    return this.http.get<User[]>(this.baseUrl + 'users', {observe:'response',params})
    .pipe(
      map(res => {
        paginationResult.result  = res.body;
        if(res.headers.get('Pagination') != null){
          paginationResult.pagination = JSON.parse(res.headers.get('Pagination'));
        }
        return paginationResult;
    }));
  }
  getUser(id):Observable<User>{
    return this.http.get<User>(this.baseUrl+'users/'+id );
  }
  updateUSer(id:number,user:User){
    return this.http.put(this.baseUrl+'users/'+id,user);
  }
  setMainPhoto(userId:number,id:number){
    return this.http.post(this.baseUrl+'users/'+userId+'/photos/'+id+'/setMain',{});
  }
  deletePhoto(userId:number,id:number){
    return this.http.delete(this.baseUrl+'users/'+userId+'/photos/'+id);
  }
  sendLike(id : number,recipientId:number){
    return this.http.post(this.baseUrl + 'users/'+id+'/like/'+recipientId,{});
  }
  getMessages(id:number,page?,itemsPerPage?,messageContainer?){
    const paginationResult :PaginationResult<Message[]> = new PaginationResult<Message[]>();

    let params = new HttpParams();
    params = params.append('MessageContainer',messageContainer);
    if(page != null && itemsPerPage != null){
      params = params.append('pageNumber',page);
      params = params.append('pageSize',itemsPerPage);
    }

    return this.http.get<Message[]>(this.baseUrl + 'users/'+id + '/messages',{observe:'response',params})
       .pipe(map(res =>{
         paginationResult.result = res.body;
         if(res.headers.get('Pagination') != null){
           paginationResult.pagination = JSON.parse(res.headers.get('Pagination'));
         }
         return paginationResult;
        })
       );
  }
  getMessageThread(id:number, recipientId:number){
    return this.http.get<Message[]>(this.baseUrl+'users/'+id+'/Messages/thread/'+ recipientId);
  }

  sendMessage(id:number,message:Message){
    return this.http.post(this.baseUrl + 'users/'+id+'/messages',message);
  }
  deleteMessage(id:number, userId:number){
    return this.http.post(this.baseUrl+'users/'+ userId + '/messages/' +id,{});
  }

  markAsRead(userId :number , messageId:number){
    console.log(this.baseUrl + 'users/' + userId + '/messages/' + messageId +'/read');

    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + messageId +'/read',{})
          .subscribe();
  }
}
