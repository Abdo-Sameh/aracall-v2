import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FriendsProvider } from '../../providers/friends/friends';

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
  constructor(public alert: AlertController, public friends: FriendsProvider, public loadingctrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
    this.data = this.navParams.get('data');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendProfilePage');
  }

  Block(blockedUser) {

    let editGroupName = this.alert.create(
      {
        title: 'Block user',
        message: "Do you want block this user ! ",

        buttons: [
          {
            text: 'ok',
            handler: data => {
              this.friends.blockUser(blockedUser).subscribe(res => {
                loading1.dismiss()
                if (res.status == 1) {
                  this.navCtrl.push(TabsPage);
                }
              }
              )
            }

          },
          {
            'text': 'cancel',
            role: 'cancel'
          }
        ],

      })
    editGroupName.present()
    // alert(this.cid)
    let loading1 = this.loadingctrl.create({
      showBackdrop: false
    });

    // chat/delete/messages
  }

  SendMessage() {
    this.navCtrl.pop();
  }

  // show_data() {
  //
  //   let loading = this.loadingctrl.create({
  //     showBackdrop: false
  //   });
  //
  //   this.friends.getfriendprofile(this.Friend_Id).then(data => {
  //     console.log(data)
  //     this.name = data['name']
  //     this.img = data['avatar']
  //     this.cover = data['cover']
  //   })
  //   loading.dismiss()
  // }

  back() {
    this.navCtrl.pop();
  }

}
