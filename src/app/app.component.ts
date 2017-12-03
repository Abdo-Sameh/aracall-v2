import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  checkLogin = localStorage.getItem('loggedIn')

  constructor(globalization: Globalization, translate: TranslateService, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      translate.setDefaultLang('en');
      platform.setDir('ltr', true);
      
    //  this.document.getElementById('appstyle').setAttribute('href', 'assets/css/main.css');

      // globalization.getPreferredLanguage()
      //   .then(res => {
      //     translate.use((res.value).split("-")[0]);
      //     translate.setDefaultLang((res.value).split("-")[0]);
      //     if (translate.getDefaultLang() == "ar") {
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

  ngOnInit() {
    console.log('app' + this.checkLogin)
    if ((this.checkLogin == "0") || (!this.checkLogin)) {
    this.rootPage = LoginPage
    } else {
      this.rootPage = TabsPage

    }

  }
}
