import { Component, inject, OnInit, Output } from '@angular/core';
import { UsersFilterComponent } from '../users-filter/users-filter.component';
import { MessageBoxComponent } from '../message-box/message-box.component';
import { User } from '../models/user.model';
import { UserService } from '../services/user/user.service';
import { Router } from '@angular/router';
import { Message } from '../models/message.model';
import { MessageService } from '../services/message/message.service';
import { ChatComponent } from '../chat/chat.component';
import { Document } from '../models/document.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    UsersFilterComponent,
    MessageBoxComponent,
    ChatComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  protected sender?: User;
  protected receiver?: User;
  protected messages: Message[] = [];

  ngOnInit(): void {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.userService.getUser().subscribe((user) => {
      this.sender = user;
    })
  }

  protected changeReceiver(receiver: User) {
    this.receiver = receiver;
    this.messageService.getConversation(receiver.id).subscribe((messages) => {
      this.messages = messages;
    });
  }
}
