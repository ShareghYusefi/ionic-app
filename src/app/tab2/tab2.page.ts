import { Component } from '@angular/core';
import { SmsManager } from '@byteowls/capacitor-sms';
import { Contacts, EmailType, PhoneType } from '@capacitor-community/contacts';
import {
  LocalNotifications,
  PermissionStatus,
  ScheduleOptions,
} from '@capacitor/local-notifications';
import { CallNumber } from 'capacitor-call-number';
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
  contacts: any[] = [];

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

  retrieveListOfContacts = async () => {
    const projection = {
      // Specify which fields should be retrieved.
      name: true,
      phones: true,
    };

    const result = await Contacts.getContacts({
      projection,
    });

    this.contacts = result.contacts;
    console.log('Contacts:', JSON.stringify(result.contacts));
  };

  createNewContact = async () => {
    const res = await Contacts.createContact({
      contact: {
        name: {
          given: 'Susan',
          family: 'Sally',
        },
        birthday: {
          year: 1990,
          month: 1,
          day: 1,
        },
        phones: [
          {
            type: PhoneType.Mobile,
            label: 'mobile',
            number: '+1-212-456-7890',
          },
          {
            type: PhoneType.Work,
            label: 'work',
            number: '212-456-7890',
          },
        ],
        emails: [
          {
            type: EmailType.Work,
            label: 'work',
            address: 'example@example.com',
          },
        ],
        urls: ['example.com'],
      },
    });

    // TODO:: toast message of successful contact creation

    console.log(res.contactId);
  };

  callContact = async (contact: any) => {
    await CallNumber.call({
      number: contact.phones?.[0]?.number,
      bypassAppChooser: false, // shows the default call dialer screen
    });
  };

  createandsendSMS = async (contact: any) => {
    const numbers: string[] = [contact.phones?.[0]?.number];
    SmsManager.send({
      numbers: numbers,
      text: 'This is a example SMS',
    })
      .then(() => {
        // success toast message
        console.log('SMS sent successfully');
      })
      .catch((error) => {
        console.error(error);
      });
  };
}
