import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../core/services/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent implements OnInit {
  isLoading = false;

  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loaderService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }
}
