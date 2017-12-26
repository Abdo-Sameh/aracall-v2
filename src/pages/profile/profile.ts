import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { SettingsProvider } from './../../providers/settings/settings';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { EditProfilePage } from '../../pages/edit-profile/edit-profile';


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
  constructor(private photoViewer: PhotoViewer, public alert: AlertController, public settings: SettingsProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
    this.get_user_status();
    this.get_online_status();
    this.getUserData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  getUserData() {
    this.settings.profileDetailsApiCall(this.userId).subscribe(res => {
      console.log(res)
      this.user = res;
    })
  }

  viewImage(path) {
    this.photoViewer.show(path);
  }

  get_user_status() {
    this.settings.get_user_chat_status(this.userId).subscribe(res => {
      console.log(res)
      this.userStatus = res.chat_status;

    })
  }

  get_online_status() {
    this.settings.get_user_chat_online_status(this.userId).subscribe(res => {
      this.onlineStatus = res.online_status;
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
              this.settings.set_user_chat_status(data.newStatus, this.userId).subscribe(res => {
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
    this.settings.set_user_chat_online_status(online_status, this.userId).subscribe(res => {
      console.log(res)
      this.onlineStatus = res.online_status
    })
  }

  editProfilePage() {
    this.navCtrl.push(EditProfilePage);
  }

  back() {
    this.navCtrl.pop();
  }

}
