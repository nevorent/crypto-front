import { Component, ElementRef, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { User } from '../models/user.model';
import { Message } from '../models/message.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIcon } from "@angular/material/icon";
import { MatTooltipModule } from '@angular/material/tooltip';
import { DocumentService } from '../services/document/document.service';
import { StatusEnum } from '../models/status-enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WebsocketService } from '../services/websocket/websocket.service';
import { Subscription } from 'rxjs';
import { WebsocketResponse } from '../models/websocket-response.model';
import { MatFormFieldModule, MatHint } from "@angular/material/form-field";
import { SpinnerService } from '../services/spinner/spinner.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatIcon,
    MatTooltipModule,
    MatFormFieldModule,
    MatHint
],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnChanges {
  private documentService = inject(DocumentService);
  private websocketService = inject(WebsocketService);
  private spinnerService = inject(SpinnerService);
  private snackBar = inject(MatSnackBar);

  @Input() sender?: User;
  @Input() receiver?: User;
  @Input() messages: Message[] = [];

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private websocketSubscription?: Subscription;

  ngOnInit(): void {
    this.websocketSubscription = this.websocketService.messageReceived.subscribe((incomingData: any) => {
      this.handleNewMessage(incomingData);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages']) {
      this.spinnerService.show();
      this.scrollToBottom();
    }
  }

  protected isCurrentUser(msg: Message): boolean {
    return msg.senderId === this.sender?.id;
  }

  protected verifySignature(documentId: number, senderId: number) {
    this.documentService.verifyDocument(documentId, senderId).subscribe((response) => {
      if (response.status == StatusEnum.Valid) {
        this.snackBar.open('Valid Signature!', 'Dismiss', { duration: 3000 });
      }
      else {
        if (response.reason) {
          this.snackBar.open('Invalid signature: ' + response.reason, 'Dismiss', { duration: 4000 });
        }
        else {
          this.snackBar.open('Invalid signature.', 'Dismiss', { duration: 4000 });
        }
      }
    })
  }

  protected downloadFile(documentId: number, fileName: string) {
    this.documentService.downloadDocument(documentId, fileName);
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.scrollContainer) {
        const element = this.scrollContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    }, 0);
    this.spinnerService.hide();
  }

  private handleNewMessage(response: WebsocketResponse) {
    const isRelevant = 
      (response.message.sender_id === this.sender?.id && response.message.receiver_id === this.receiver?.id) ||
      (response.message.sender_id === this.receiver?.id && response.message.receiver_id === this.sender?.id);
    if (isRelevant) {
      const msg = response.message;
      this.messages.push({
        id: msg.id,
        senderId: msg.sender_id,
        receiverId: msg.receiver_id,
        content: msg.content,
        sentAt: msg.sent_at,
        document: msg.document
      } as Message);
      this.scrollToBottom();
    }
  }
}
