import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';

@Component({
  selector: 'app-create-keyword',
  standalone: true,
  imports: [],
  templateUrl: './create-keyword.component.html',
  styleUrl: './create-keyword.component.css'
})
export class CreateKeywordComponent  implements OnInit{
  newKeyword: string = ''; 
  constructor(private _dashboardService : DashboardService){

  }
  ngOnInit(): void {
   
  }
  createKeywords(){
    this._dashboardService.createKeyword(this.newKeyword).subscribe(res=>{

    },(err)=>{
      
    })
  }
}
