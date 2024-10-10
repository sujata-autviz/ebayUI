import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpVehService {

  public url = environment.apiUrl;
  currentUser = JSON.parse(localStorage.getItem('loginUser'))
  constructor(private http: HttpClient) { }


  httpOptions = {
    headers: new HttpHeaders({
      Authorization: this.currentUser ? this.currentUser.token : '',
      token: '1234'
    })
  }

  createEmployee(data) {
    return this.http.post(`${this.url}/user`, data, this.httpOptions)
      .pipe(
        map((result: any) => {
          return result;
        })
      )
  }

  getDepartment() {
    return this.http.get(`${this.url}/department`, this.httpOptions)
      .pipe(
        map((result: any) => {
          return result;
        })
      )
  }

  getVehicles() {
    return this.http.get(`${this.url}/vehicle`, this.httpOptions)
      .pipe(
        map((result: any) => {
          return result;
        })
      )
  }

  updateEmployee(data, id) {
    return this.http
      .put(`${this.url}/user/${id}`, data, this.httpOptions)
      .pipe(retry(1),
        map((result: any) => {
          return result;
        })
      )
  }

}
