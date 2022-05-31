import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showHideRegister = false;
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }

  toggleRegister(){
    this.showHideRegister = !this.showHideRegister;
  }


  cancelRegisterMode(registerMode :boolean){
    this.showHideRegister = registerMode;
  }
}
