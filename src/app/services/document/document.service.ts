import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActionEnum } from '../action-enum';
import { DocumentResponse } from '../../models/document-response.model';
import { map, Observable } from 'rxjs';
import { Document } from '../../models/document.model';
import { SignResponse } from '../../models/sign-response.model';
import { DeleteResponse } from '../../models/delete-response.model';
import { VerifyResponse } from '../../models/verify-response.model';

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

  public signDocument(documentId: number, file: File, keyPassword: string, paddingMode: string) {
    this.specificServicePath = 'sign';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('key_password', keyPassword);
    formData.append('padding_mode', paddingMode);

    return this.http.post<SignResponse>(`${this.commonServicePath}/${documentId}/${this.specificServicePath}`, formData);
  }

  public verifyDocument(documentId: number, senderId: number) {
    this.specificServicePath = 'verify';
    return this.http.get<VerifyResponse>(`${this.commonServicePath}/${documentId}/${this.specificServicePath}/${senderId}`);
  }

  public downloadDocument(documentId: number, fileName: string) {
    this.specificServicePath = 'download';
    return this.http.get(`${this.commonServicePath}/${documentId}/${this.specificServicePath}`, {
      responseType: 'blob'
    }).subscribe({
      next: (blob: Blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        return ''
      },
      error: (error) => {
        console.error('Download failed', error);
      }
    });
  }

  public deleteDocument(documentId: number) {
    return this.http.delete<DeleteResponse>(`${this.commonServicePath}/${documentId}`);
  }
}
