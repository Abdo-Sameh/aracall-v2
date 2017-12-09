import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { VideoHandlerPage } from '../pages/video-handler/video-handler';
import { AudioHandlerPage } from '../pages/audio-handler/audio-handler';
import { GroupVideoHandlerPage } from '../pages/group-video-handler/group-video-handler';
import { GroupAudioHandlerPage } from '../pages/group-audio-handler/group-audio-handler';

import { SingleChatProvider } from './../providers/single-chat/single-chat';
import { GroupChatProvider } from './../providers/group-chat/group-chat';

let temp, caller_data1, caller_data;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  checkLogin = localStorage.getItem('loggedIn')
  userId
  constructor(public groupChat: GroupChatProvider, public singleChat: SingleChatProvider, public events: Events, globalization: Globalization, translate: TranslateService, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

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
    this.events.subscribe('callended', (user) => {
      console.log('temp set to undefined')
      temp = undefined;
    })
    // document.addEventListener("pause", function() {
    //   firebase.set_active(Date.now());
    // }, true);
    // document.addEventListener("resume", function() {
    //   firebase.set_active("true");
    // }, true);

    //network = this.network ;
    // this.init();
    // this.test() ;

  }

  // init() {
  //   let connectSubscription = this.network.onConnect().subscribe(() => {
  //     console.log("connected")
  //   });
  //
  //   // stop connect watch
  //   connectSubscription.unsubscribe();
  //   let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
  //     let alert = this.alertCtrl.create({
  //       title: 'Error',
  //       subTitle: 'Check Your Internet Connection And Try Again',
  //       buttons: ['OK']
  //     });
  //     alert.present();
  //   });
  //
  //   // stop disconnect watch
  //   disconnectSubscription.unsubscribe();
  //
  // }



  // ngOnInit() {
  //   console.log('app' + this.checkLogin)
  //   if ((this.checkLogin == "0") || (!this.checkLogin)) {
  //     this.rootPage = LoginPage
  //   } else {
  //     this.rootPage = TabsPage
  //   }
  // }

  ngOnInit() {

    if (localStorage.getItem('loggedIn') == "1") {
      this.userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
      // if (localStorage.getItem('userid') == undefined) {
      //   this.nav.setRoot(LoginPage)
      //
      // } else {
      //   this.database.set_userid(localStorage.getItem('userid'));
      //   firebase.set_active("true");
      // }

      //this.getSingleCalls();
      this.getGroupCalls();
      this.nav.setRoot(TabsPage);
    } else {
      //this.getSingleCalls();
      this.getGroupCalls();
      // this.nav.setRoot(TabsPage);
      //     when deploying uncomment the next and comment above

      //
      this.nav.setRoot(LoginPage);
    }
  }

  getSingleCalls() {
    this.singleChat.incominglistener(this.userId).subscribe(data => {
      console.log(data);
      if (data != null) {
        caller_data1 = data;
        if (data[0] != "undefined") {
          this.singleChat.caller_data_listen(this.userId).subscribe(data => {
            console.log('inside app component listener')
            caller_data = data;
            if (temp == undefined) {
              if (caller_data1.type == "video") {
                console.log('video tab set root true')
                this.nav.setRoot(VideoHandlerPage, { name: caller_data.name, avatar: caller_data.avatar, number: caller_data1.number, remote: true });
              } else {
                this.nav.setRoot(AudioHandlerPage, { name: caller_data.name, avatar: caller_data.avatar, number: caller_data1.number, remote: true });
              }
              temp = caller_data1;
            }
          })
        }
      }
    })
  }

  getGroupCalls() {
    this.groupChat.incominglistener(this.userId).subscribe(data => {
      console.log(data);
      if (data != null) {
        caller_data1 = data;
        if (data[0] != "undefined") {
          this.groupChat.caller_data_listen(this.userId).subscribe(data => {
            console.log('inside app component listener')
            caller_data = data;
            if (temp == undefined) {
              if (caller_data1.type == "video") {
                console.log('video tab set root true')
                this.nav.setRoot(GroupVideoHandlerPage, { name: caller_data.name, avatar: caller_data.avatar, number: caller_data1.number, remote: true });
              } else {
                this.nav.setRoot(GroupAudioHandlerPage, { name: caller_data.name, avatar: caller_data.avatar, number: caller_data1.number, remote: true });
              }
              temp = caller_data1;
            }
          })
        }
      }
    })
  }

}
