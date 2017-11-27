import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { SettingsProvider } from './../../providers/settings/settings';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  styleUrls: ['../../assets/main.css']
})
export class ProfilePage {
  user = {}
  userStatus = ''
  onlineStatus = ''
  newOnlineStatus = ''
  userId
  constructor(public alert: AlertController, public settings: SettingsProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.get_user_status();
    this.getUserData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  getUserData() {
    this.settings.getLoggedInUSerProfile().subscribe(res => {
      console.log(res)
      this.user = res;
    })
  }

  get_user_status() {
    this.settings.get_user_chat_status().subscribe(res => {
      console.log(res)
      this.userStatus = res.chat_status;

    })
  }

  changeStatus(userid = this.userId) {
    let status = this.alert.create(
      {
        title: 'change status',
        inputs: [{
          name: 'newStatus',
          placeholder: this.userStatus
        }],
        buttons: [
          {
            text: 'save',
            handler: data => {
              this.settings.set_user_chat_status(data.newStatus).subscribe(res => {
                console.log(res)
                this.userStatus = res.status
              })
            }
          }
        ]
      })
    status.present()
  }

  onChange(online_status) {
    console.log(online_status)
    this.settings.set_user_chat_online_status(this.userId, online_status).subscribe(res => {
      console.log(res)
      this.onlineStatus = res.online_status
    })
  }

}
