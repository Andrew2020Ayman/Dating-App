import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertifyService } from '../_Servcies/alertify.service';
import { AuthService } from '../_Servcies/auth.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model :any = {};
  @Output() cancelRegister = new EventEmitter();

  user:User;
  registerForm: FormGroup;
  bsConfig?: Partial<BsDatepickerConfig>;
  constructor(private auth:AuthService,private alertify: AlertifyService,
              private fb : FormBuilder,private router:Router) { }

  ngOnInit(): void {
    this.bsConfig={
      containerClass:'theme-red'
    },
    this.createRegisterForm();
  }

  createRegisterForm(){
    this.registerForm = this.fb.group({
      gender:['male'],
      username:['',Validators.required],
      knownAs:['',Validators.required],
      city:['',Validators.required],
      country:['',Validators.required],
      dateOfBirth:[null,Validators.required],
      password:['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword:['',Validators.required]
    },{validator: this.passwordMatchValidator});
  }
  passwordMatchValidator(g:FormGroup){
    return g.get('password').value != g.get('confirmPassword').value ? {'mismatch':true} : null;
  }
  register(){
    if(this.registerForm.valid){
     this.user = Object.assign({},this.registerForm.value)
     this.auth.register(this.user).subscribe(()=>{
      this.alertify.success("registration successful");
     },error=>{
        this.alertify.error(error);
     },()=>{
       this.auth.login(this.user).subscribe(()=>{
         this.router.navigate(['/members']);
       })
     });
    }

  }
  cancel(){
    this.cancelRegister.emit(false);
    console.log('cancel');

  }
}
