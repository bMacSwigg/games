import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-baghchal-newgame-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './baghchal-newgame-dialog.component.html',
  styleUrl: './baghchal-newgame-dialog.component.css'
})
export class BaghchalNewgameDialogComponent {
  tiger: string = '';
  goat: string = '';

  constructor(private dialogRef: MatDialogRef<BaghchalNewgameDialogComponent>) {}

  cancel() {
    this.dialogRef.close();
  }

  create() {
    console.log(this.tiger);
    console.log(this.goat);
  }
}
