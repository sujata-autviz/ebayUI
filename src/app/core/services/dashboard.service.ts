import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiUrl = `${environment.apiUrl}/keywords`;
  constructor(private http : HttpClient) { }

   createKeyword(keyword: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, { keywords: keyword }, { headers });
  }

    getAllKeywords(): Observable<any> {
      return this.http.get<any>(this.apiUrl);
    }
  

    getKeywordById(keywordId: number): Observable<any> {
      const url = `${this.apiUrl}/${keywordId}`;
      return this.http.get<any>(url);
    }
  
   
    updateKeyword(keywordId: number, newKeyword: string): Observable<any> {
      const url = `${this.apiUrl}/${keywordId}`;
     
      return this.http.put(url, { keywords: newKeyword }, this.getHeaders());
    }
  
   
    deleteKeyword(keywordId: number): Observable<any> {
      const url = `${this.apiUrl}/${keywordId}`;
      return this.http.delete<any>(url);
    }

    getHeaders(){
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      };
      return httpOptions
    }
}
