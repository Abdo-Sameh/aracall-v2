import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core';
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

    msgs: any = [];
    allmessages = [];
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    @ViewChild('input1') private myinput: ElementRef;
    cid; myavatar; id; remoteavatar; group_name; title;
    titles; remoteid; typing = false;
    toggled: boolean = false;
    emojitext: string = "";
    userName
    messages
    user = { 'message': '' }
    group_admin
    userid
    group_cover
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.messages = this.navParams.get('messages')
       this.cid = this.navParams.get('cid')
       this.group_name = this.navParams.get('group_name')
       this.group_admin = this.navParams.get('group_admin')
       this.group_cover = this.navParams.get('group_cover')
       console.log(this.group_admin)

       this.title = this.navParams.get('chatUserName')
       if (this.group_name != null) {
         this.userName = this.group_name
       } else {
         this.userName = this.titles
       }
       this.userid = localStorage.getItem('userid')  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupChatPage');
  }

  goToGroupInfo() {
    this.navCtrl.push(GroupInfoPage, {  'title': this.userName, 'cid': this.cid, 'group_admin': this.group_admin, 'group_cover': this.group_cover })
  }

}
