import { Component } from '@angular/core';
import { EmailComposer } from 'capacitor-email-composer';
import {
  AndroidSettings,
  IOSSettings,
  NativeSettings,
} from 'capacitor-native-settings';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  constructor() {}

  openEmail() {
    EmailComposer.hasAccount()
      .then((result) => {
        if (result) {
          console.log('hasAccount:', result);
          // open the email composer
          EmailComposer.open({
            to: ['sharegh.yusefi@robogarden.ca'],
            subject: 'Email Button Clicked',
            body: 'This is a test email from the Ionic app.',
          });
        }
      })
      .catch((error) => {
        console.error('Error checking email account:', error);
      });
  }

  async openSettings(setting: string) {
    let androidOption = AndroidSettings.Keyboard; // default
    let iosOption = IOSSettings.Keyboard; // default

    switch (setting) {
      case 'keyboard':
        androidOption = AndroidSettings.Keyboard;
        iosOption = IOSSettings.Keyboard;
        break;
      case 'wifi':
        androidOption = AndroidSettings.Wifi;
        iosOption = IOSSettings.WiFi;
        break;
      case 'bluetooth':
        androidOption = AndroidSettings.Bluetooth;
        iosOption = IOSSettings.Bluetooth;
        break;
      case 'settings':
        androidOption = AndroidSettings.Settings;
        iosOption = IOSSettings.App;
        break;
      default:
        console.log('Invalid setting');
    }

    // Open the settings page
    await NativeSettings.open({
      optionAndroid: androidOption,
      optionIOS: iosOption,
    });
  }
}
