import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FriendsProvider } from '../../providers/friends/friends';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  friendsList
  friendsnames
  names
  constructor(public friends: FriendsProvider, public loadingctrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
    let loading = this.loadingctrl.create({
      showBackdrop: false
    });
    loading.present();
    this.friends.getFriends().subscribe(data => {
      loading.dismiss();
      this.friendsList = data;
      this.friendsnames = data;
    });
  }

  onInput(evt) {
    this.names = this.friendsList;
    let val = evt.target.value;

    if (val && val.trim() != '') {
      this.friendsnames = [];
      for (let i = 0; i < this.names.length; i++) {
        if (this.names[i].name.toLowerCase().indexOf(val.toLowerCase()) == 0) {
          this.friendsnames.push(this.names[i]);
        } else {
          this.friendsnames.splice(i, 1)
        }
      }
    }
    if (!val) {
      this.friendsnames = this.friends;
    }

  }

}
