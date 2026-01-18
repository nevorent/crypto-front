import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { DocumentSelectorDialogComponent } from '../document-selector-dialog/document-selector-dialog.component';
import { Document } from '../models/document.model';
import { DocumentService } from '../services/document/document.service';
import { MessageService } from '../services/message/message.service';
import { SpinnerService } from '../services/spinner/spinner.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-message-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.scss'
})
export class MessageBoxComponent implements OnInit{
  private documentService = inject(DocumentService);
  private messageService = inject(MessageService);
  private spinnerService = inject(SpinnerService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private documents: Document[] = [];

  @Input() receiver?: User;
  @Input() sender?: User;

  protected messageText: string = '';
  protected documentId?: number;

  ngOnInit(): void {
    this.documentService.getDocuments().subscribe((documents) => {
      this.documents = documents;
    });
  }

  sendFileAndMessage() {
    this.spinnerService.show();
    if (this.receiver != null && this.documentId != null) {
      this.messageService.sendMessage(this.receiver?.id, this.documentId, this.messageText != '' ? this.messageText : undefined).subscribe({
        next: () => {
          this.spinnerService.hide();
          this.resetFields();
        },
        error: (err) => {
          this.spinnerService.hide();
          this.snackBar.open('An error has occurred: ' + err, 'Dismiss', { duration: 4000 });
          this.resetFields();
        }
      });
    }
  }

  openSelectDocumentDialog() {
    const dialogRef = this.dialog.open(DocumentSelectorDialogComponent, {
      width: '450px',
      data: this.documents,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((selectedId: number | undefined) => {
      if (selectedId) {
        this.documentId = selectedId;
      }
    });
  }

  private resetFields() {
    this.documentId = undefined;
    this.messageText = '';
  }
}
