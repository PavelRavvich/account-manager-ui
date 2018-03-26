import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule, MatNativeDateModule, MatPaginatorModule,
  MatSidenavModule, MatTableModule,
  MatTooltipModule
} from '@angular/material';
import {MatToolbarModule} from '@angular/material/toolbar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatSidenavModule,
    MatNativeDateModule,
    MatMenuModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatSidenavModule,
    MatMenuModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule
  ]
})
export class SharedModule {
}
