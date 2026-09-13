import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './input-form.component.html',
  styleUrl: './input-form.component.scss',
})
export class InputFormComponent {
  lensOrder = new FormGroup({
    left: new FormGroup({
      sphere: new FormControl(''),
      cylinder: new FormControl(''),
      axis: new FormControl(''),
      diameter: new FormControl(''),
      productNumber: new FormControl(''),
      addition: new FormControl(''),
    }),
    right: new FormGroup({
      sphere: new FormControl(''),
      cylinder: new FormControl(''),
      axis: new FormControl(''),
      diameter: new FormControl(''),
      productNumber: new FormControl(''),
      addition: new FormControl(''),
    }),
    pupilDistance: new FormControl(''),
    baseCurve: new FormControl(''),
    material: new FormControl(''),
  });

  updateOrder() {
    this.lensOrder.setValue({
      baseCurve: '8.0',
      material: 'Wood',
      pupilDistance: '60',
      left: {
        sphere: '-2.5',
        cylinder: '-1.25',
        axis: '90',
        diameter: '14.0',
        productNumber: '12345',
        addition: '1.0',
      },
      right: {
        sphere: '-2.5',
        cylinder: '-1.25',
        axis: '90',
        diameter: '14.0',
        productNumber: '12345',
        addition: '1.0',
      },
    });
  }
}
