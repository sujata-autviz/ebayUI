import { NgModule } from '@angular/core';
import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { routes } from '../app.routes';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmojiValidationDirective } from '../shared/custom-directives/emoji-validation/emoji-validation.directive';


@NgModule({
  declarations: [ 
    LoginComponent,
  ],
  imports: [
    FormsModule, 
    ReactiveFormsModule,
    CommonModule,
    AccountRoutingModule,
    EmojiValidationDirective
  ],
  providers: [],
  exports: [] 
})
export class AccountModule { }
