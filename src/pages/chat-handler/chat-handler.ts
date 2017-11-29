import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FriendsProvider } from '../../providers/friends/friends';
import { FriendProfilePage } from '../friend-profile/friend-profile';
/**
 * Generated class for the ChatHandlerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-chat-handler',
  templateUrl: 'chat-handler.html',
  styleUrls: ['../../assets/main.css', '../../assets/ionicons.min.css']
})
export class ChatHandlerPage {
  currentUserID
  lastonline
  remoteavatar
  the_userId
  settings = [{ 'last_seen_status': '', 'read_receipt': '' }];
  constructor(public friends: FriendsProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.the_userId = navParams.get('data');
    this.friends.profileDetailsApiCall(this.the_userId).subscribe(res => {
      console.log(res)
      this.currentUserID = res.id;
      console.log(this.currentUserID)
      this.lastonline = res.profile_info[0].value;
      // this.database.get_user_chat_settings(this.currentUserID).subscribe(res => {
      //   this.settings[0].last_seen_status = res.last_seen_status
      //   this.settings[0].read_receipt = res.read_receipt_status
      // })
      // console.log(res)
    });

}

ionViewDidLoad() {
  console.log('ionViewDidLoad ChatHandlerPage');
}

view_profile() {
  console.log(this.currentUserID)
  this.remoteavatar = this.navParams.get('avatar');
  this.navCtrl.push(FriendProfilePage, {
    'currentUserID': this.currentUserID, id: this.navParams.get('data'), title: this.navParams.get('title'), remoteavatar: this.remoteavatar
  });
}

}
