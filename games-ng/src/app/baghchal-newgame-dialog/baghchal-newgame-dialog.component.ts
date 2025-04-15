import { Component, inject, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { merge } from 'rxjs';
import { GamesService } from '../games.service';

@Component({
  selector: 'app-baghchal-newgame-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './baghchal-newgame-dialog.component.html',
  styleUrl: './baghchal-newgame-dialog.component.css'
})
export class BaghchalNewgameDialogComponent {
  readonly tiger = new FormControl('', [Validators.required, Validators.email]);
  readonly goat = new FormControl('', [Validators.required, Validators.email]);
  tigerError = signal('');
  goatError = signal('');
  gamesService: GamesService = inject(GamesService);

  constructor(private dialogRef: MatDialogRef<BaghchalNewgameDialogComponent>) {
    merge(this.tiger.statusChanges, this.tiger.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage(this.tiger, this.tigerError));
    merge(this.goat.statusChanges, this.goat.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage(this.goat, this.goatError));
  }

  updateErrorMessage(fc: FormControl, sig: WritableSignal<string>) {
    if (fc.hasError('required')) {
      sig.set('You must enter a value');
    } else if (fc.hasError('email')) {
      sig.set('Not a valid email');
    } else {
      sig.set('');
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  create() {
    if (this.tiger.invalid || this.goat.invalid) {
      console.log("invalid values");
      return;
    }
    console.log(this.tiger.value);
    console.log(this.goat.value);
  }
}
