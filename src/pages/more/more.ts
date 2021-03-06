import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SettingsProvider } from '../../providers/settings/settings';

import { ProfilePage } from './../profile/profile';
import { ChatSettingsPage } from '../chat-settings/chat-settings';
import { NotificationSettingsPage } from '../notification-settings/notification-settings';
import { BlockedUsersPage } from '../blocked-users/blocked-users';
import { LoginPage } from './../login/login';
/**
 * Generated class for the MorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
  styleUrls: ['../../assets/main.css', '../../assets/ionicons.min.css']
})
export class MorePage {
  userId
  constructor(public settings: SettingsProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MorePage');
  }

  openaccount() {
    this.navCtrl.push(ProfilePage);
  }

  signout() {
    localStorage.setItem('userid', '')
    localStorage.setItem('loggedIn', "0" );
    localStorage.setItem('userName', "" );
    localStorage.setItem('userAvatar', "" );
    localStorage.setItem('userData', "" );
    localStorage.setItem('userDataID', "" );
    localStorage.setItem('userCover', "" );
    // this.database.signout();
    // localStorage.clear();
    this.navCtrl.setRoot(LoginPage);
  }

  chatSettings() {
    console.log('here');
    this.settings.get_user_chat_settings(this.userId).subscribe(res => {
      console.log(res);
      this.navCtrl.push(ChatSettingsPage, { 'settings': res })
    })
  }

  notificationSettings() {
    this.navCtrl.push(NotificationSettingsPage)

  }

  blockedUsers() {
    this.navCtrl.push(BlockedUsersPage)

  }

}
