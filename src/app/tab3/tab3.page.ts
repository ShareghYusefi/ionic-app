import { Component } from '@angular/core';
import { EmailComposer } from 'capacitor-email-composer';

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
}
