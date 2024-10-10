import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { Keyword } from '../../../interfaces/keyword/keyword';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { finalize, takeUntil } from 'rxjs';
import { BaseDestroyCompoent } from '../../../shared/utils/baseDestroy';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [HttpClient],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent extends BaseDestroyCompoent implements OnInit {
  keywordsList: Keyword[] = [];
  createErrorMessage: string | null = null;
  updateErrorMessages: string[] = [];
  keywordForm: FormGroup;
  saving = false;
  dashboardService: DashboardService = inject(DashboardService);
  constructor() {
    super();
    this.keywordForm = new FormGroup({
      keyword: new FormControl(''),
    });
  }

  override ngOnInit(): void {
    this.getKeywords();
  }

  getKeywords(): void {
    this.dashboardService
      .getAllKeywords()
      .pipe((takeUntil(this.destroy$), finalize(() => {})))
      .subscribe(
        (data) => {
          this.keywordsList = data
            .filter((item: Keyword) => item.id !== undefined) // Ensure all items have a valid id
            .sort((a: Keyword, b: Keyword) => b.id - a.id);
        },
        (error) => {
          this.createErrorMessage = 'Failed to load keywords';
          console.error('Error fetching keywords:', error);
        }
      );
  }

  addKeyword(): void {
    this.saving = true;
    this.createErrorMessage = '';
    const newKeywordValue = this.keywordForm.get('keyword')?.value;
    if ( newKeywordValue && newKeywordValue.trim() && this.keywordsList && this.keywordsList.length>0) {
      const keywordExists = this.keywordsList.some(
        (keyword) => keyword.keywords.toLowerCase() === newKeywordValue.toLowerCase()
      );
  
      if (keywordExists) {
        this.saving = false; // Stop saving state
         this.createErrorMessage = 'This keyword already exists. Please enter a different keyword.'
        return; // Stop execution to prevent API call
      }
  
      this.dashboardService.createKeyword(newKeywordValue).subscribe(
        (response) => {
          const newKeywordObj: Keyword = {
            id: response.id,
            keywords: newKeywordValue,
            editing: false,
          };
          this.keywordsList.unshift(newKeywordObj);
          this.keywordForm.reset();
          this.createErrorMessage = '';
          this.saving = false;
        },
        (error) => {
          this.saving = false;
          console.error('Error creating keyword:', error);
        }
      );
    }
  }

  editKeyword(index: number): void {
    this.keywordsList[index].editing = true;
  }

  updateKeyword(index: number): void {
    const keywordId = this.keywordsList[index].id;
    const newKeywordValue = this.keywordsList[index].keywords;
    if ( newKeywordValue && newKeywordValue.trim() && this.keywordsList && this.keywordsList.length>0) {
      const keywordExists = this.keywordsList.some(
        (keyword) => keyword.keywords.toLowerCase() === newKeywordValue.toLowerCase()
      );
  
      if (keywordExists) {
        this.saving = false; 
         this.updateErrorMessages[index] = 'This keyword already exists. Please enter a different keyword.'
        return; 
      }
  
    if (keywordId !== undefined) {
      this.dashboardService
        .updateKeyword(keywordId, this.keywordsList[index].keywords)   
        .pipe((takeUntil(this.destroy$), finalize(()=>{
        })))
        .subscribe(
          (response) => {
            console.log('Keyword updated:', response);
            this.keywordsList[index].editing = false;
            this.updateErrorMessages[index] = '';
          },
          (error) => {
            console.error('Error updating keyword:', error);
          }
        );
    }
  }
}

  deleteKeyword(index: number): void {
    const keywordId = this.keywordsList[index].id;
    if (keywordId !== undefined) {
      this.dashboardService.deleteKeyword(keywordId).pipe((takeUntil(this.destroy$), finalize(()=>{
          
        }))).subscribe(
        (response) => {
          console.log('Keyword deleted:', response);
          this.keywordsList.splice(index, 1);
        },
        (error) => {
          console.error('Error deleting keyword:', error);
        }
      );
    }
  }

  cancelEdit(index: number): void {
    this.keywordsList[index].editing = false; // Cancel editing
  }
}
