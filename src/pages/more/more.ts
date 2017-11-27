import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MorePage');
  }

  openaccount() {
    this.navCtrl.push(ProfilePage);
  }

  signout() {
    localStorage.setItem('userid', '')
    // this.database.signout();
    this.navCtrl.push(LoginPage);
  }
  chatSettings() {
    // this.database.get_user_chat_settings(this.userid).subscribe(res => {
    //   this.navCtrl.push(ChatSettingsPage, { 'settings': res })
    // })
  }

  notificationSettings() {
    this.navCtrl.push(NotificationSettingsPage)

  }

  blockedUsers() {
    this.navCtrl.push(BlockedUsersPage)

  }

}
