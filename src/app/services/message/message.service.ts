import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActionEnum } from '../action-enum';
import { MessageResponse } from '../../models/message-response.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private http = inject(HttpClient);
  private commonServicePath = ActionEnum.Message;
  private specificServicePath = '';

  constructor() { }

  public getConversation(partenerId: number) {
    return this.http.get<MessageResponse[]>(`${this.commonServicePath}/${partenerId}`).pipe(
      map((messageResponses) => {
        return messageResponses.map(message => ({
          id: message.id,
          senderId: message.sender_id,
          receiverId: message.receiver_id,
          content: message.content,
          sentAt: message.sent_at,
          document: message.document
        }));
      })
    );
  }

  public sendMessage(receiverId: number, documentId: number, content?: string) {
    this.specificServicePath = 'send';
    const body = JSON.stringify({
      receiver_id: receiverId,
      document_id: documentId,
      content: content
    });
    return this.http.post(`${this.commonServicePath}/${this.specificServicePath}`, body);
  }
}
