import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FriendsProvider } from '../../providers/friends/friends';

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
  name;
  img;
  cover;
  constructor(public friends: FriendsProvider, public loadingctrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
    this.Friend_Id = this.navParams.get('currentUserID');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendProfilePage');
  }

  show_data() {

    let loading = this.loadingctrl.create({
      showBackdrop: false
    });

    this.friends.getfriendprofile(this.Friend_Id).then(data => {
      console.log(data)
      this.name = data['name']
      this.img = data['avatar']
      this.cover = data['cover']
    })
    loading.dismiss()
  }

}
