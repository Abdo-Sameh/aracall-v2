import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { LoginPage } from '../pages/login/login';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;

  constructor(translate: TranslateService, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      translate.setDefaultLang("en");
      platform.setDir('ltr', true);
      // this.document.getElementById('appstyle').setAttribute('href', 'assets/css/main.css');

      // this.globalization.getPreferredLanguage()
      //   .then(res => {
      //     this.translate.use((res.value).split("-")[0]);
      //     this.translate.setDefaultLang((res.value).split("-")[0]);
      //     if (this.translate.getDefaultLang() == "ar") {
      //       platform.setDir('rtl', true);
      //       //this.document.getElementById('appstyle').setAttribute('href', 'assets/css/main-ar.css');
      //     } else {
      //       platform.setDir('ltr', true);
      //       //this.document.getElementById('appstyle').setAttribute('href', 'assets/css/main.css');
      //     }
      //   });

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
