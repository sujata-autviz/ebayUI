import { Directive, ElementRef, HostListener, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appEmojiValidation]',
  standalone: true
})
export class EmojiValidationDirective {
constructor(private el: ElementRef, @Optional() private ngControl: NgControl) {}

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const inputValue = this.el.nativeElement.value;
    const sanitizedValue = this.removeInvalidCharacters(inputValue);
    this.updateValueAndValidation(sanitizedValue);
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent): void {
    event.preventDefault(); // Prevent the default paste action
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      const pastedText = clipboardData.getData('text/plain');
      const sanitizedText = this.removeInvalidCharacters(pastedText); // Sanitize pasted text
      document.execCommand('insertText', false, sanitizedText);
      this.updateValueAndValidation(this.el.nativeElement.value);
    }
  }

  private removeInvalidCharacters(value: string): string {
    if (value) {
      // Regex pattern to allow alphanumeric characters, spaces, and some special characters
      // This pattern removes emojis and other non-text characters
      return value.replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F700}-\u{1F77F}|\u{1F800}-\u{1F8FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}|\u{E000}-\u{F8FF}]/gu, '');
    }
    return value;
  }

  private updateValueAndValidation(value: string): void {
    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.setValue(value);
      this.ngControl.control.markAsDirty();
      this.ngControl.control.markAsTouched();
    }
  }
}