import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from '../../core/guards/auth.guard';
import { QuestionsComponent } from './questions/questions.component';

const routes: Routes = [
//  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, 
  { path: 'dashboard', component: DashboardComponent },
  { path: 'questions', component: QuestionsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
