import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { BaseDestroyCompoent } from '../../../shared/utils/baseDestroy';
import { QuestionsService } from '../../../core/services/questions.service';
import { finalize, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Question } from '../../../interfaces/question/question';
import { NotificationService } from '../../../core/services/notification.service';
import { LoaderService } from '../../../core/services/loader.service'; // Import LoaderService
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonComponent } from '../../../components/button/button.component';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, DialogModule, ButtonModule, InputTextModule, ButtonComponent],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
})
export class QuestionsComponent extends BaseDestroyCompoent implements OnInit {
  questionList: any[] = [];
  createErrorMessage: string = '';
  addQuestionForm!: FormGroup;
  customPageOptions: number[] = [5];
  openModal: boolean = false;

  constructor(
    private questionService: QuestionsService,
    private fb: FormBuilder,
    private _notificationService: NotificationService,
    private loaderService: LoaderService, // Inject LoaderService
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    super();
  }

  override ngOnInit(): void {
    this.initForm();
    this.getAllQuestions();
  }


    showDialog() {
        this.openModal = true;
    }

  initForm() {
    this.addQuestionForm = this.fb.group({
      id: [''],
      question: ['', Validators.required],
      answer: ['', Validators.required]
    });
  }

  getAllQuestions() {
    this.loaderService.show(); // Show loader
    this.questionService
      .getAllQuestions()
      .pipe(takeUntil(this.destroy$), finalize(() => {}))
      .subscribe(
        (data) => {
          this.loaderService.hide()
          this.questionList = data;
          this.generateCustomPageOptions();
        },
        (error) => {
          this.loaderService.hide()
          this.createErrorMessage = 'Failed to load questions';
          console.error('Error fetching questions:', error);
        }
      );
  }

  addQuestion() {
    if (this.addQuestionForm.invalid) {
      this.addQuestionForm.markAllAsTouched();
      return;
    }
    if (this.addQuestionForm.valid) {
      const { id, ...rest } = this.addQuestionForm.value;
      const question = rest.question.trim();
      const answer = rest.answer.trim();
      const observer = id
        ? this.questionService.updateQuestion(+id, { question: question, answer: answer })
        : this.questionService.createQuestion({ question: question, answer: answer });

      this.loaderService.show(); // Show loader
      observer.pipe(takeUntil(this.destroy$), finalize(() => {}))
        .subscribe(
          (data) => {
            this.openModal = false
            this._notificationService.successAlert(id ? 'Updated question successfully' : 'Created question successfully');
            this.getAllQuestions();
          },
          (error) => {
            this.loaderService.hide()
            this.createErrorMessage = 'Failed to load questions';
            console.error('Error fetching questions:', error);
          }
        );
    }
  }

  get question() {
    return this.addQuestionForm.controls;
  }

  resetAddQuestionForm() {
    this.addQuestionForm.reset();
    this.openModal = true
  }

  editQuestion(question: Question) {
    if (question) {
      this.addQuestionForm.patchValue({
        id: question.id,
        question: question.question,
        answer: question.answer
      });
      this.openModal = true
    }
  }

  deleteQuestion(question: Question) {
    if (question) {
      this._notificationService.confirmDelete(question.question).then((result) => {
        if (result.isConfirmed) {
          this.loaderService.show(); // Show loader
          this.questionService.deleteQuestion(question.id).pipe(takeUntil(this.destroy$), finalize(() => {}))
            .subscribe(
              (response) => {
                this.getAllQuestions();
                this._notificationService.successToast('Deleted successfully');
              },
              (error) => {
                console.error('Error deleting keyword:', error);
              }
            );
        }
      });
    }
  }

  generateCustomPageOptions() {
    const totalRecords = this.questionList.length;
    const maxPageSize = 50;
    this.customPageOptions = [];

    if(totalRecords < 10 ){
      this.customPageOptions = [5, 10];
    }else if(totalRecords > 10){
      this.customPageOptions = [5, 10, 20];
    }else if(totalRecords > 20){
      this.customPageOptions = [5, 10, 20, 50];
    }else if(totalRecords > 50){
      this.customPageOptions = [5, 10, 20, 50, 100];
    }
  }
}
