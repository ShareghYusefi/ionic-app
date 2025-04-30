import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  message!: string;
  apiUrl!: string;

  constructor() {}

  ngOnInit() {
    this.message = environment.message;
    this.apiUrl = environment.school_api_service;
    console.log('Environment:', environment);
    console.log('API URL:', this.apiUrl);
    console.log('Message:', this.message);
  }
}
