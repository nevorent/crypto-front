import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActionEnum } from '../action-enum';
import { DocumentResponse } from '../../models/document-response.model';
import { map, Observable } from 'rxjs';
import { Document } from '../../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private http = inject(HttpClient);
  private commonServicePath = ActionEnum.Document;
  private specificServicePath = '';

  constructor() { }

  public getDocuments() : Observable<Document[]> {
    return this.http.get<DocumentResponse[]>(`${this.commonServicePath}`).pipe(
      map((documentResponses) => {
        return documentResponses.map(doc => ({
          id: doc.id,
          filename: doc.filename,
          status: doc.status,
          createdAt: doc.created_at,
          mimeType: doc.mime_type
        }));
      })
    );
  }

  public uploadDocument(file: File) : Observable<Document> {
    this.specificServicePath = 'upload';
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<DocumentResponse>(`${this.commonServicePath}/${this.specificServicePath}`, formData).pipe(
      map((documentResponse): Document => {
        return {
          id: documentResponse.id,
          filename: documentResponse.filename,
          status: documentResponse.status,
          createdAt: documentResponse.created_at
        };
      }));
  }

  public getDocumentContent(documentId: number) {
    this.specificServicePath = 'download';
    return this.http.get(`${this.commonServicePath}/${documentId}/${this.specificServicePath}`, {
      responseType: 'blob'
    });
  }
}
