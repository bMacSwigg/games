import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-baghchal-info-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './baghchal-info-dialog.component.html',
  styleUrl: './baghchal-info-dialog.component.css'
})
export class BaghchalInfoDialogComponent {
  constructor(private dialogRef: MatDialogRef<BaghchalInfoDialogComponent>) {}

  close() {
    this.dialogRef.close();
  }
}
