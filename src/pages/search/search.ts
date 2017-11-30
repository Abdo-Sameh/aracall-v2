import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, App } from 'ionic-angular';
import { FriendsProvider } from '../../providers/friends/friends';
import { SingleChatProvider } from '../../providers/single-chat/single-chat';

import { ChatHandlerPage } from '../chat-handler/chat-handler';
import { NewChatPage } from '../new-chat/new-chat';

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
  constructor(public app: App, public singleChat: SingleChatProvider, public friends: FriendsProvider, public loadingctrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
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

  goTochatPage(other_userid) {
    this.singleChat.check_chat_history(other_userid).subscribe(res => {
      if (res.status == 1) {
        this.app.getRootNav().push(ChatHandlerPage, { 'data': res.cid, 'avatar': res.avatar, 'title': res.name, 'is_blocked': res.is_blocked })
      } else {
        this.app.getRootNav().push(NewChatPage, { 'data': res.cid, 'avatar': res.avatar, 'title': res.name, 'is_blocked': res.is_blocked })
      }
    })
  }

}
