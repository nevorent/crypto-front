import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { User } from '../models/user.model';
import { Message } from '../models/message.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIcon } from "@angular/material/icon";
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule, 
    DatePipe, 
    MatIcon, 
    MatTooltipModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnChanges{
  @Input() sender?: User;
  @Input() receiver?: User;
  @Input() messages: Message[] = [];

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages']) {
      this.scrollToBottom();
    }
  }

  isCurrentUser(msg: Message): boolean {
    return msg.senderId === this.sender?.id;
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.scrollContainer) {
        const element = this.scrollContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    }, 0);
  }
}
