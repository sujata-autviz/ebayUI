import { Component, EventEmitter, Input, input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent implements OnInit {
  @Input() title: string | undefined;
  @Input() class: string | undefined;
  @Input() disabled: boolean | undefined;
  @Output() onTap = new EventEmitter()
  ngOnInit(): void {
   
  }
  onClick(){
    this.onTap.emit()
  }
}
