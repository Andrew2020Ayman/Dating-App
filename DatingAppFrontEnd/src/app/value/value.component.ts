import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.css']
})
export class ValueComponent implements OnInit {

  values : any;
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.getValues();
  }

  getValues(){
    this.http.get('https://localhost:5001/Values').subscribe(res =>{
      this.values = res;
    },error=>{
      console.error(error);
    })
  }
}
