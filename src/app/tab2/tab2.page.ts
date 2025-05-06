import { Component } from '@angular/core';
import {
  LocalNotifications,
  PermissionStatus,
  ScheduleOptions,
} from '@capacitor/local-notifications';
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

  async requestPermission() {
    try {
      // request permission for sending notifications
      const result: PermissionStatus =
        await LocalNotifications.requestPermissions();
      console.log('Permission status:', result);
      if (result.display != 'granted') {
        console.log('Permission not granted!');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  }

  async scheduleNotification(seconds: number) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1,
            title: 'Hello',
            body: 'This is a test notification',
            schedule: {
              at: new Date(
                // get current time
                new Date().getTime() +
                  // add 3 seconds
                  seconds * 1000
              ),
            },
          },
        ],
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }
}
