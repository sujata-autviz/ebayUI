import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { Keyword } from '../../../interfaces/keyword/keyword';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { finalize, takeUntil } from 'rxjs';
import { BaseDestroyCompoent } from '../../../shared/utils/baseDestroy';
import { NotificationService } from '../../../core/services/notification.service';

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
  previousKeyword : string ='';
  dashboardService: DashboardService = inject(DashboardService);
  constructor(private fb: FormBuilder, private _notificationService : NotificationService) {
    super();
    this.keywordForm = this.fb.group({
      keyword: ['', [Validators.required, Validators.minLength(1)]], // Ensure the keyword control is required
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
    if (newKeywordValue && newKeywordValue.trim()) {
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
          this._notificationService.successToast('Keyword created successfully');
        },
        (error) => {
          this.saving = false;
          console.error('Error creating keyword:', error);
        }
      );
    }
  }
  clearCreateError(): void {
    this.createErrorMessage = ''; // Clear create error message on input
}

clearUpdateError(index: number): void {
    this.updateErrorMessages[index] = ''; // Clear specific update error message on input
}
  editKeyword(index: number): void {
    this.keywordsList[index].editing = true;
    this.previousKeyword=this.keywordsList[index].keywords
  }

  updateKeyword(index: number): void {
    const keywordId = this.keywordsList[index].id;
    const newKeywordValue = this.keywordsList[index].keywords;
    if ( newKeywordValue && newKeywordValue.trim() && this.keywordsList && this.keywordsList.length>0) {
      const keywordExists = this.keywordsList.some(
        (keyword) => keyword.keywords.toLowerCase() === newKeywordValue.toLowerCase() && keyword.id != keywordId
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
            this._notificationService.successToast('Keyword updated successfully');
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
      this._notificationService.confirmDelete( this.keywordsList[index].keywords).then((result) => {
        if (result.isConfirmed) {
          this.dashboardService.deleteKeyword(keywordId).pipe((takeUntil(this.destroy$), finalize(()=>{         
          }))).subscribe(
          (response) => {
            console.log('Keyword deleted:', response);
            this.keywordsList.splice(index, 1);
            this._notificationService.successToast('Deleted successfully');
          },
          (error) => {
            console.error('Error deleting keyword:', error);
          }
        );
        } else {
          console.log('Delete action was cancelled');
        }
      });
     
    }
  }

  cancelEdit(index: number): void {
    this.keywordsList[index].editing = false;
    this.updateErrorMessages[index]  = '';
    this.keywordsList[index].keywords = this.previousKeyword ;
     // Cancel editing
  }
}
