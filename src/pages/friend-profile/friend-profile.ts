import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FriendsProvider } from '../../providers/friends/friends';
import { SingleChatProvider } from '../../providers/single-chat/single-chat';

import { AudioHandlerPage } from '../audio-handler/audio-handler'
import { VideoHandlerPage } from '../video-handler/video-handler'
import { TabsPage } from '../tabs/tabs';
/**
 * Generated class for the FriendProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-friend-profile',
  templateUrl: 'friend-profile.html',
})
export class FriendProfilePage {
  Friend_Id
  data
  name;
  img;
  cover;
  userId
  constructor(public translate: TranslateService, public singleChat: SingleChatProvider, public alert: AlertController, public friends: FriendsProvider, public loadingctrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
    this.data = this.navParams.get('data');
    this.userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
    console.log(this.data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendProfilePage');
  }


  SendMessage() {
    this.navCtrl.pop();
  }

  voiceCall() {
    let loading = this.loadingctrl.create({
      showBackdrop: true,
      content: 'Calling',
      spinner: 'dots'

    });
    loading.present();
    this.singleChat.remoteid(this.data.name, this.userId).then(data => {
      let number = Math.floor(Math.random() * 1000000000);
      this.singleChat.sendnumber(data, number, 'audio', this.userId);
      let avatar = this.data.avatar;
      loading.dismiss()
      this.navCtrl.push(AudioHandlerPage, { avatar, data, number, remote: false });
    })
  }

  videoCall() {
    let loading1 = this.loadingctrl.create({
      showBackdrop: true,
      content: 'Calling',
      spinner: 'dots',

    });
    loading1.present();
    let number = Math.floor(Math.random() * 1000000000);
    this.singleChat.remoteid(this.data.name, this.userId).then(data => {
      this.singleChat.sendnumber(data, number, 'video', this.userId);
      let avatar = this.data.avatar;
      loading1.dismiss();
      this.navCtrl.push(VideoHandlerPage, { name: this.data.name, avatar, data, number, remote: false });
    })
  }

  block() {
    let message, title, cancel, ok;
    this.translate.get('block-user').subscribe(value => { title = value; })
    this.translate.get('want-to-block-this-user').subscribe(value => { message = value; })
    this.translate.get('ok').subscribe(value => { ok = value; })
    this.translate.get('cancel').subscribe(value => { cancel = value; })

    let blockUser = this.alert.create({
        title: title,
        message: message,
        buttons: [{
          text: ok,
          handler: data => {
            this.singleChat.blockUser(this.data.id, this.userId).subscribe(res => {
              loading1.dismiss()
              console.log(res)
              if (res.status == 1) {
                this.navCtrl.popToRoot();
              }
            }
            )
          }
        }, {
          'text': cancel,
          role: 'cancel'
        }
        ],
      })
    blockUser.present()
    let loading1 = this.loadingctrl.create({
      showBackdrop: false
    });
  }


  back() {
    this.navCtrl.pop();
  }

}
