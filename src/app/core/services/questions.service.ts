import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionPayload } from '../../interfaces/question/question';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  apiUrl = `${environment.apiUrl}/qa`;
  constructor(private http : HttpClient) { }

  getAllQuestions(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  createQuestion(payload: QuestionPayload): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }
  updateQuestion(id: number, payload: QuestionPayload): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload);
  }
  deleteQuestion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
