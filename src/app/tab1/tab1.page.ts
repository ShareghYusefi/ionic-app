import { Component } from '@angular/core';
import { InfiniteScrollCustomEvent, NavController } from '@ionic/angular';
import { Student } from '../student';
import { SchoolService } from '../school.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  constructor(
    private navCtrl: NavController,
    private schoolService: SchoolService
  ) {}

  students: Student[] = [];

  ngOnInit() {
    // get students from the server
    this.loadStudents();
  }

  ionViewDidEnter() {
    // refresh the list of students
    this.loadStudents();
  }

  // get students from the server
  loadStudents() {
    this.schoolService.getStudents().subscribe((response) => {
      this.students = response;
    });
  }

  delete(id: number) {
    this.schoolService.deleteStudent(id).subscribe((response) => {
      console.log('Student deleted!', response);
      this.students = this.students.filter(
        (student) => student.id !== response.id
      );
    });
  }

  // ? means that the parameter is optional
  openForm(id?: number) {
    this.navCtrl.navigateForward('/tabs/students-form' + (id ? '/' + id : ''));
  }
}
