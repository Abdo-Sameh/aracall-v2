import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FriendsProvider } from '../../providers/friends/friends';
import { SingleChatProvider } from '../../providers/single-chat/single-chat';

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
  userId
  message
  constructor(public singleChat: SingleChatProvider, public alertCtrl: AlertController, public loadingctrl: LoadingController, public friends: FriendsProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
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

    for (let o = 0; o < this.chosenUsers.length; o++) {

      this.singleChat.check_chat_history(this.userId, this.chosenUsers[o].userid).subscribe(res => {
        console.log(res)
        if (res.status == 1) {
          this.singleChat.broadcasting('haveChatHistory', res.cid, this.message, this.userId).subscribe(res2 => {
            console.log(res2)
            //this.navCtrl.push(ChathandlerPage,{'data':res.cid,'avatar':res.avatar,'title':res.first_name })
          })
          //this.navCtrl.push(ChathandlerPage,{'data':res.cid,'avatar': res.avatar,'title':res.first_name })
        } else {
          // this.navCtrl.push(NewChatPage,{'data':res.cid,'avatar':res.avatar,'title':res.first_name })
          this.singleChat.broadcasting('', this.chosenUsers[o].userid, this.message, this.userId).subscribe(res2 => {
            console.log(res2)
            //this.navCtrl.push(ChathandlerPage,{'data':res.cid,'avatar':res.avatar,'title':res.first_name })
          })
        }
      })
    }
    const alert = this.alertCtrl.create({
      title: 'Boroadcast',
      subTitle: 'Boroadcast message sent successfully',
      buttons: ['ok']
    });
    alert.present();
    this.navCtrl.pop()
  }

}
