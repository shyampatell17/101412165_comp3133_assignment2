import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-delete-confirmation',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="delete-dialog">
      <h2 mat-dialog-title>
        <mat-icon color="warn">warning</mat-icon>
        Confirm Delete
      </h2>
      
      <mat-dialog-content>
        <p>Are you sure you want to delete {{data.employeeName}}?</p>
        <p class="warning-text">This action cannot be undone.</p>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button mat-button (click)="onNoClick()">Cancel</button>
        <button mat-raised-button color="warn" (click)="onYesClick()">
          <mat-icon>delete</mat-icon>
          Delete
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .delete-dialog {
      padding: 1rem;
    }

    h2 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #f44336;
      margin: 0;
    }

    mat-dialog-content {
      margin: 1rem 0;
    }

    .warning-text {
      color: #666;
      font-style: italic;
      margin-top: 0.5rem;
    }

    mat-dialog-actions {
      margin-bottom: 0;
      padding: 1rem 0 0;
    }

    button {
      min-width: 100px;
    }
  `]
})
export class DeleteConfirmationComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employeeName: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
} 