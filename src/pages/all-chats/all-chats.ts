import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
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
  constructor(public groupChat: GroupChatProvider, public app: App, public singleChat: SingleChatProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllChatsPage');
    this.singleChat.getConversations().subscribe(data => {
      this.chats = data;
    })
  }

  newBroadcast() {
    this.app.getRootNav().push(BroadcastPage);
  }

  newMessage() {
    this.navCtrl.push(SearchPage)
  }

  openChat(index, type, data, title, avatar, is_blocked) {
    if (type == 'multiple') {
      this.groupChat.usersCoversation(this.chats[index].cid).subscribe(res => {
        console.log(res)
        this.app.getRootNav().push(GroupChatPage, {
          'messages': res,
          'group' : this.chats[index],
        })
      })

    } else {
      this.app.getRootNav().push(ChatHandlerPage, { data, title, avatar, 'is_blocked': is_blocked });
    }
  }

  userForm = new FormGroup({
    mail: new FormControl(null, [Validators.required])
  });

  checkinput() {
    if (this.userForm.value.mail == "") { return true } else { return false }
  }

}
