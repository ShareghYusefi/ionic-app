import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SchoolService } from '../school.service';
import { Student } from '../student';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
  standalone: false,
})
export class StudentFormComponent implements OnInit {
  constructor(
    private navCtrl: NavController,
    private schoolService: SchoolService,
    private formBuilder: FormBuilder
  ) {}

  student!: FormGroup;

  ngOnInit() {
    this.student = this.formBuilder.group({
      id: [0, [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      age: [18, [Validators.required, Validators.min(18)]],
      level: ['', [Validators.required]],
    });
  }

  get name() {
    return this.student.get('name');
  }

  closeForm() {
    this.navCtrl.navigateBack('/tabs/tab1');
  }

  onSubmit() {
    console.log('Form submitted!', this.student.value);
    this.schoolService.addStudent(this.student.value).subscribe(
      (response) => {
        console.log('Student added!', response);
        this.student.reset(); // Reset the form after submission
        this.navCtrl.navigateBack('/tabs/tab1');
      },
      (error) => {
        console.error('Error adding student', error);
      }
    );
  }
}
