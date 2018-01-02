import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, App } from 'ionic-angular';
import { FriendsProvider } from '../../providers/friends/friends';
import { SingleChatProvider } from '../../providers/single-chat/single-chat';
import { TimeProvider } from './../../providers/time/time';

import { ChatHandlerPage } from '../chat-handler/chat-handler';
import { NewChatPage } from '../new-chat/new-chat';

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
  userId
  online_status
  constructor(public time: TimeProvider, public app: App, public singleChat: SingleChatProvider, public friends: FriendsProvider, public loadingctrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
    this.userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactsPage');
    let loading = this.loadingctrl.create({
      showBackdrop: false
    });
    loading.present();
    this.friends.getFriends(this.userId).subscribe(data => {
      loading.dismiss();
      this.friendsList = data;
      for (let i = 0; i < this.friendsList.length; ++i) {
        if (this.checkOnline(this.friendsList[i].online_time * 1000) < 60) {
          this.friendsList[i].online_status = 0;
        } else {
          this.friendsList[i].online_status = -1;
        }
      }
      console.log(data);
    });
  }

  checkOnline(time) {
    return this.time.checkOnline(time);
  }

  doRefresh(refresher) {
    let loading = this.loadingctrl.create({
      showBackdrop: false
    });
    loading.present();
    this.friends.getFriends(this.userId).subscribe(data => {
      loading.dismiss();
      this.friendsList = data;
      for(let i = 0; i < this.friendsList.length; ++i){
        if(this.checkOnline(this.friendsList[i].online_time * 1000) < 60){
          this.friendsList[i].online_status = 0;
        }else{
          this.friendsList[i].online_status = -1;
        }
      }
      console.log(data);
    });
    if (refresher != 0)
      refresher.complete();
  }

  // swipeEvent(e) {
  //   console.log(e.direction)
  //   if (e.direction == '1') {
  //     this.navCtrl.parent.select(1);
  //   }
  //   // else if (e.direction == '4') {
  //   //   this.navCtrl.parent.select(0);
  //   // }
  //   // else if (e.direction == '1') {
  //   //   this.navCtrl.parent.select(1);
  //   // }
  //   // else if (e.direction == '3') {
  //   //   this.navCtrl.parent.select(3);
  //   // }
  // }

  goTochatPage(other_userid) {
    this.singleChat.check_chat_history(other_userid, this.userId).subscribe(res => {
      console.log(res);
      if (res.status == 1) {
        this.app.getRootNav().push(ChatHandlerPage, { cid: res.cid, title: res.name, avatar: res.avatar, 'is_blocked': res.is_blocked, user1: res.user1 });
        // this.app.getRootNav().push(ChatHandlerPage, { 'data': res.cid, 'avatar': res.avatar, 'title': res.name, 'is_blocked': res.is_blocked })
      } else {
        // this.app.getRootNav().push(ChatHandlerPage, { cid, title, avatar, 'is_blocked': is_blocked, user1 });
        this.app.getRootNav().push(NewChatPage, { cid: res.cid, 'avatar': res.avatar, 'title': res.name, 'is_blocked': res.is_blocked, user1: res.user1 })
      }
    })
  }

}
