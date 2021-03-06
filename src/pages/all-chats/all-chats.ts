import { Component } from '@angular/core';
import { NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { SingleChatProvider } from './../../providers/single-chat/single-chat';
import { GroupChatProvider } from './../../providers/group-chat/group-chat';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { BroadcastPage } from '../../pages/broadcast/broadcast';
import { SearchPage } from '../../pages/search/search';
import { GroupChatPage } from '../../pages/group-chat/group-chat';
import { ChatHandlerPage } from '../../pages/chat-handler/chat-handler';

/**
 * Generated class for the AllChatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-all-chats',
  templateUrl: 'all-chats.html',
  styleUrls: ['../../assets/main.css', '../../assets/ionicons.min.css']
})
export class AllChatsPage {
  chats
  userId
  constructor(public loadingCtrl: LoadingController, public groupChat: GroupChatProvider, public app: App, public singleChat: SingleChatProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllChatsPage');
    this.singleChat.getConversations(this.userId).subscribe(data => {
      this.chats = data;
      console.log(data);
    })
  }

  // swipeEvent(e) {
  //   console.log(e)
  //   if (e.direction == '2') {
  //     this.navCtrl.parent.select(2);
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

  newBroadcast() {
    this.app.getRootNav().push(BroadcastPage);
  }

  newMessage() {
    this.app.getRootNav().push(SearchPage)
  }

  openChat(index, type, cid, title, avatar, is_blocked, user1, user2) {
    let loading = this.loadingCtrl.create({
      content: 'Loading',
      spinner: 'bubbles'
    });
    loading.present();
    if (type == 'multiple') {
      this.groupChat.usersCoversation(this.chats[index].cid, this.userId).subscribe(res => {
        console.log(res)
        loading.dismiss();
        this.app.getRootNav().push(GroupChatPage, {
          'messages': res,
          'group' : this.chats[index],
        })
      })

    } else {
      console.log(user1, user2);
      loading.dismiss();
      if(user1 == this.userId)
        this.app.getRootNav().push(ChatHandlerPage, { cid, title, avatar, 'is_blocked': is_blocked, user1: user2 });
      else
        this.app.getRootNav().push(ChatHandlerPage, { cid, title, avatar, 'is_blocked': is_blocked, user1: user1 });
    }
  }

  userForm = new FormGroup({
    mail: new FormControl(null, [Validators.required])
  });

  doRefresh(refresher) {
    this.singleChat.getConversations(this.userId).subscribe(data => {
      this.chats = data;
    })
      if (refresher != 0)
        refresher.complete();
    }


  checkinput() {
    if (this.userForm.value.mail == "") { return true } else { return false }
  }

}
