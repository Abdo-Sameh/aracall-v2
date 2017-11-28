import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FriendsProvider } from '../../providers/friends/friends';

/**
 * Generated class for the ContactsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {
  friendsList
  constructor(public friends: FriendsProvider, public loadingctrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactsPage');
    let loading = this.loadingctrl.create({
      showBackdrop: false
    });
    loading.present();
    this.friends.getFriends().subscribe(data => {
      loading.dismiss();
      this.friendsList = data;
    });
  }

}
