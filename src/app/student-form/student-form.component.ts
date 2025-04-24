import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
  standalone: false,
})
export class StudentFormComponent implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  closeForm() {
    this.navCtrl.navigateBack('/tabs/tab1');
  }

  onSubmit() {
    console.log('Form submitted!');
  }
}
