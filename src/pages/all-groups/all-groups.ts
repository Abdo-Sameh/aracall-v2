import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GroupChatProvider } from './../../providers/group-chat/group-chat';

import { CreateGroupPage } from './../create-group/create-group';
import { GroupChatPage } from './../group-chat/group-chat';


/**
 * Generated class for the AllGroupsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-all-groups',
  templateUrl: 'all-groups.html',
})
export class AllGroupsPage {
  chats = [];
  chatsCount
  constructor(public groupChat: GroupChatProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.getConversations();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllGroupsPage');

  }

  newGroup() {
    this.navCtrl.push(CreateGroupPage)
  }

  getConversations() {
    this.groupChat.getConverstationsList().subscribe(res => {
      console.log(res);
      for (let i = 0; i < res.length; ++i) {
        if (res[i].type == 'multiple') {
          this.chats.push(res[i])
        }
      }
      console.log(this.chats)
      this.chatsCount = this.chats.length
    })
  }

  openGroupChat(index) {
    console.log(this.chats[index]);
    this.groupChat.usersCoversation(this.chats[index].cid).subscribe(res => {
      console.log(res);
      this.navCtrl.push(GroupChatPage, {
        'chat': res,
      })
    })
  }

}
