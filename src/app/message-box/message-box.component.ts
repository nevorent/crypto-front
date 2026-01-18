import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../models/user.model';

@Component({
  selector: 'app-message-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.scss'
})
export class MessageBoxComponent {
  messageText: string = '';

  @Input() receiver?: User;
  @Output() messageSent = new EventEmitter<string>();
  @Output() fileAttached = new EventEmitter<void>();

  sendMessage() {
    if (!this.messageText.trim()) return; // Don't send empty messages

    this.messageSent.emit(this.messageText);
    this.messageText = ''; // Clear input after sending
  }

  attachFile() {
    this.fileAttached.emit(); // Just a trigger for now
    console.log('Attach file clicked');
  }
}
