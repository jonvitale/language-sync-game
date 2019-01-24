import { NgModule } from '@angular/core';

import { 
	MatButtonModule, 
	MatIconModule,
  MatSelectModule,
  MatFormFieldModule,
  MatCardModule,
} from '@angular/material';


@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
 
  ],
  exports: [
  	MatButtonModule,
  	MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
 
  ]
})
export class MaterialModule { }