import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { GroupInfoPage } from '../../pages/group-info/group-info';

/**
 * Generated class for the GroupChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-group-chat',
  templateUrl: 'group-chat.html',
})
export class GroupChatPage {
  group
  messages
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.group = navParams.get('group');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupChatPage');
  }

  goToGroupInfo() {
    this.navCtrl.push(GroupInfoPage, { 'group': this.group })
  }

}
