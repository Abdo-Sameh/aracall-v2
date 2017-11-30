import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FriendsProvider } from '../../providers/friends/friends';

/**
 * Generated class for the BroadcastPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-broadcast',
  templateUrl: 'broadcast.html',
  styleUrls: ['../../assets/main.css']
})
export class BroadcastPage {
  friendsList
  friendsnames
  chosenUsers = []
  names
  constructor(public alertCtrl: AlertController, public loadingctrl: LoadingController, public friends: FriendsProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BroadcastPage');
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

  onclick(value) {
    value.users = [];
    var arr = Object.keys(value).map(function(key) { return value[key]; });
    for (let i = 0; i < arr.length; i++) {

      if (arr[i] == true) {
        this.chosenUsers.push({ 'userid': this.friendsnames[i].userid, 'username': this.friendsnames[i].name, 'new': true })
      }
    }

    console.log(this.chosenUsers)

    // for (let o = 0; o < this.chosenUsers.length; o++) {
    //
    //   this.database.check_chat_history(this.userid, this.chosenUsers[o].userid).subscribe(res => {
    //     console.log(res)
    //     if (res.status == 1) {
    //       this.database.broadcasting('haveChatHistory', res.cid, this.message, this.userid).subscribe(res2 => {
    //         console.log(res2)
    //       })
    //     } else {
    //       this.database.broadcasting('', this.chosenUsers[o].userid, this.message, this.userid).subscribe(res2 => {
    //         console.log(res2)
    //       })
    //     }
    //   })
    // }
    const alert = this.alertCtrl.create({
      title: 'Boroadcast',
      subTitle: 'Boroadcast message sent successfully',
      buttons: ['ok']
    });
    alert.present();
    this.navCtrl.pop()
  }

}
