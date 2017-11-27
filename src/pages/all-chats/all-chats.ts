import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SingleChatProvider } from './../../providers/single-chat/single-chat';

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
  constructor(public singleChat: SingleChatProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllChatsPage');
    this.singleChat.getConversations().subscribe(data => {
      this.chats = data;
    })
  }

}
