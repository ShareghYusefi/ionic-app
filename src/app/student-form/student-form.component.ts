import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SchoolService } from '../school.service';
import { Student } from '../student';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
  standalone: false,
})
export class StudentFormComponent implements OnInit {
  constructor(
    private navCtrl: NavController,
    private schoolService: SchoolService
  ) {}

  student: Student = {
    id: 0,
    name: '',
    age: 0,
    level: '',
  };

  ngOnInit() {}

  closeForm() {
    this.navCtrl.navigateBack('/tabs/tab1');
  }

  onSubmit() {
    console.log('Form submitted!', this.student);
    this.schoolService.addStudent(this.student).subscribe(
      (response) => {
        console.log('Student added!', response);
        this.navCtrl.navigateBack('/tabs/tab1');
      },
      (error) => {
        console.error('Error adding student', error);
      }
    );
  }
}
