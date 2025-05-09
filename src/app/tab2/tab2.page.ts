import { Component } from '@angular/core';
import { SmsManager } from '@byteowls/capacitor-sms';
import { Contacts, EmailType, PhoneType } from '@capacitor-community/contacts';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import {
  LocalNotifications,
  PermissionStatus,
  ScheduleEvery,
} from '@capacitor/local-notifications';
import { Share } from '@capacitor/share';
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

  async scheduleNotification(
    seconds: number,
    repeatArg?: boolean,
    everyArg?: ScheduleEvery
  ) {
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
              repeats: repeatArg,
              every: everyArg,
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

  // read file from assets folder
  copyFileToShareLocation = async (filename: string) => {
    try {
      // 1. get the file from assets folder
      const response = await fetch(`assets/${filename}`);
      // get file blog(binary large object): a collection of binary data (1's abd 0's) stored as a single entity
      // Example of BLOB: image, audio, video, etc.
      const blob = await response.blob(); // blob is a file-like object of immutable, raw data

      // 2. transform blob to base64 string data format: base64 is a binary-to-text endoding used by web browsers and mobile devices to display images
      const reader = new FileReader(); // file reader is a built-in JavaScript object that allows you to read the contents of files stored on the user's computer
      // create a prmise to read the file as base64
      const base64Promise = new Promise<string>((resolve, reject) => {
        // When file is read successfully, this event is triggered to resolve the promise
        reader.onloadend = () => {
          resolve(reader.result as string); // resolve the promise with the base64 string
        };
        reader.onerror = reject; // if there is an error, reject the promise
        reader.readAsDataURL(blob); // read the file as base64 string
      });
      // 3. wait for the promise to resolve
      const base64String = await base64Promise;
      console.log('Base64 String:', base64String);

      // 4. create a file in the cache directory of mobile device
      const result = await Filesystem.writeFile({
        path: filename,
        data: base64String.split(',')[1], // split the base64 string to get the data part
        directory: Directory.Cache,
      });

      // return the uri of the file
      return result.uri;
    } catch (error) {
      console.error('Error copying file:', error);
      return null; // return null if there is an error
    }
  };

  // Share file with other apps
  shareWithApps = async () => {
    // get the file to share from assets folder.
    const fileURI = await this.copyFileToShareLocation('basketball.png');

    if (fileURI) {
      try {
        await Share.share({
          title: 'See cool stuff',
          text: 'Really awesome thing you need to see right meow',
          url: fileURI,
          dialogTitle: 'Share with buddies',
        });
      } catch (error) {
        console.error('Error sharing file:', error);
      }
    }
  };

  imageUrl: string | undefined;

  takePhotoAndSaveToGallery = async () => {
    try {
      const image = await Camera.getPhoto({
        source: CameraSource.Camera, // take photo from camera
        quality: 90,
        allowEditing: true, // allow cropping
        resultType: CameraResultType.Uri,
        saveToGallery: true, // save to gallery
      });

      if (!image || !image.path) {
        console.error('No image selected');
        return;
      }

      this.imageUrl = image.webPath; // get the image web path

      return image.path; // return the image path
    } catch (error) {
      console.error('Error taking photo:', error);
      return null; // return null if there is an error
    }
  };

  selectAndCropPhoto = async () => {};
}
