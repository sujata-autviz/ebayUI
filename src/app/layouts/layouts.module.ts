import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LoaderComponent } from '../components/loader/loader.component';

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [LayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,  // Import standalone component here
    HeaderComponent,   // Import standalone component here
    FooterComponent,  
    LoaderComponent
  ],exports: [],
})
export class LayoutsModule { }
