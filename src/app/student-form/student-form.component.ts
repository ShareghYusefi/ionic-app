import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SchoolService } from '../school.service';
import { Student } from '../student';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  student!: FormGroup;

  ngOnInit() {
    this.student = this.formBuilder.group({
      id: [0, [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      age: [18, [Validators.required, Validators.min(18)]],
      level: ['', [Validators.required]],
    });

    // get id of our student from the URL
    this.route.paramMap.subscribe(
      (params) => {
        let id = params.get('id');
        if (id) {
          // get our student data from the server
          this.schoolService.getStudent(parseInt(id)).subscribe(
            (response: Student) => {
              console.log('Get Student', response);
              // update the form with the student data
              this.student.patchValue({
                id: response.id,
                name: response.name,
                age: response.age,
                level: response.level,
              });
            },
            (error) => {
              console.error('Error getting student from db', error);
            }
          );
        }
      },
      (error) => {
        console.error('Error getting student id from params', error);
      }
    );
  }

  get name() {
    return this.student.get('name');
  }

  closeForm() {
    this.navCtrl.navigateBack('/tabs/tab1');
  }

  onSubmit() {
    // check if form is valid
    if (this.student.invalid) {
      console.log('Form is invalid!');
      return;
    }
    // check for id in route params
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // update student data
      this.schoolService
        .updateStudent(parseInt(id), this.student.value)
        .subscribe(
          (response) => {
            console.log('Student updated!', response);
            this.student.reset(); // Reset the form after submission
            this.navCtrl.navigateBack('/tabs/tab1');
          },
          (error) => {
            console.error('Error updating student', error);
          }
        );
    } else {
      // add student data
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
}
