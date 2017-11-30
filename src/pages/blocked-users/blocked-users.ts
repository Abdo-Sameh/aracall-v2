import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FriendsProvider } from '../../providers/friends/friends'

/**
 * Generated class for the BlockedUsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-blocked-users',
  templateUrl: 'blocked-users.html',
})
export class BlockedUsersPage {
  blocked
  constructor(public toastCtrl: ToastController, public friends: FriendsProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.getAllBlocked();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BlockedUsersPage');
  }

  getAllBlocked() {
    this.friends.getAllBlocked().subscribe(res => {
      this.blocked = res;
    });
  }

  unblockUser(id, index) {
    this.friends.unblockUser(id).subscribe(res => {
      if (res.status == 1) {
        let toast = this.toastCtrl.create({
          message: 'User unblocked successfully',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.blocked.splice(index, 1);
      }
    });
  }

  back() {
    this.navCtrl.pop();
  }
}
