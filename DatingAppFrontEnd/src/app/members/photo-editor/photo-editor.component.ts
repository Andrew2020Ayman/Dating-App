import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Photo } from 'src/app/_models/Photo';
import { AlertifyService } from 'src/app/_Servcies/alertify.service';
import { AuthService } from 'src/app/_Servcies/auth.service';
import { UserService } from 'src/app/_Servcies/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss']
})
export class PhotoEditorComponent implements OnInit {

  baseUrl = environment.apiUrl;
  @Input() photos:Photo[];
  @Output() getMemberPhotoChange =new EventEmitter<string>();

  uploader:FileUploader;
  hasBaseDropZoneOver:boolean;
  response:string;
  currentMain:Photo;
  constructor (private auth:AuthService , private userService:UserService,private alertify:AlertifyService){}

  ngOnInit() {
    this.intializeIploader();
  }


  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  intializeIploader(){
    this.uploader = new FileUploader({
      url:this.baseUrl+'users/'+this.auth.decodedToken.nameid+'/photos',
      authToken:'Bearer '+localStorage.getItem('token'),
      isHTML5:true,
      allowedFileType:['image'],
      removeAfterUpload:true,
      autoUpload:false,
      maxFileSize:10*1024*1024
    }) ;

    this.uploader.onAfterAddingFile= (file)=>{file.withCredentials = false;};

    this.uploader.onSuccessItem = (item,response,status,headers)=> {
      if(response){
        const res:Photo =JSON.parse(response);
        const photo ={
          id:res.id,
          url:res.url,
          dateAdded:res.dateAdded,
          description:res.description,
          isMain:res.isMain
        } ;
        this.photos.push(photo);
        if(photo.isMain){
          this.auth.changeMemberPhoto(photo.url);
          this.auth.currentUser.photoUrl = photo.url;
          localStorage.setItem('user',JSON.stringify(this.auth.currentUser));
        }
      }
    }
  }

  setMainPhoto(photo:Photo){
    this.userService.setMainPhoto(this.auth.decodedToken.nameid, photo.id).subscribe(()=>{
      this.currentMain = this.photos.filter(p => p.isMain === true)[0];
      this.currentMain.isMain =false;
      photo.isMain = true;
      this.auth.changeMemberPhoto(photo.url);
      this.auth.currentUser.photoUrl = photo.url;
      localStorage.setItem('user',JSON.stringify(this.auth.currentUser));
    },error=>{
      this.alertify.error(error)
    })
  }

  deletePhoto(id:number){

    this.alertify.confirm('Are you sure you want to delete this photo?',()=>{
      this.userService.deletePhoto(this.auth.decodedToken.nameid,id).subscribe(()=>{
        this.photos.splice(this.photos.findIndex(p=>p.id === id),1);
        this.alertify.success('photo has been deleted');
      },error =>{
        this.alertify.error(error);
      })
    });

  }
}
