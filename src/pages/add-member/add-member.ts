import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { FriendsProvider } from '../../providers/friends/friends';
import { GroupChatProvider } from '../../providers/group-chat/group-chat';

/**
 * Generated class for the AddMemberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-member',
  templateUrl: 'add-member.html',
  styleUrls: ['../../assets/main.css']
})
export class AddMemberPage {
  friendsnames
  friendsList
  chosenUsers = []
  currentMembers
  names
  cid
  constructor(public toast: ToastController, public groupChat: GroupChatProvider, public friends: FriendsProvider, public loadingctrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
    this.currentMembers = this.navParams.get('currentMembers');
    this.cid = this.navParams.get('id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddMemberPage');
    let loading = this.loadingctrl.create({
      showBackdrop: false
    });
    loading.present();
    this.friends.getFriends().subscribe(data => {
      loading.dismiss();
      this.friendsList = data;
      this.friendsnames = data;

    for (let current = 0; current < this.currentMembers.length; current++) {
      for (let all = 0; all < this.friendsnames.length; all++) {
        if (this.friendsnames[all].userid == this.currentMembers[current].userid) {
          this.friendsnames.splice(all, 1)
        }
      }
    }
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
        this.chosenUsers.push(this.friendsnames[i].userid)
      }
    }
  }

  add_member(index, userid) {
    this.groupChat.add_group_member(this.cid, userid).subscribe(res => {
      console.log(res)
      if (res) {
        let toast = this.toast.create({
          message: 'Member added successfully', duration: 2000

        })
        toast.present()
      }
    }
    )
    this.friendsnames.splice(index, 1)
  }

}
