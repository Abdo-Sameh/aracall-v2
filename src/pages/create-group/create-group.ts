import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FriendsProvider } from '../../providers/friends/friends';
import { GroupChatProvider } from '../../providers/group-chat/group-chat';

import { GroupChatPage } from '../../pages/group-chat/group-chat';

/**
 * Generated class for the CreateGroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-create-group',
  templateUrl: 'create-group.html',
  styleUrls: ['../../assets/main.css']
})
export class CreateGroupPage {
  friendsList
  names
  friendsnames
  chosenUsers = []
  message
  userId
  constructor(public groupChat: GroupChatProvider, public alert: AlertController, public loadingctrl: LoadingController, public friends: FriendsProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateGroupPage');
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

  getFriends(value) {
    value.users = [];
    var arr = Object.keys(value).map(function(key) { return value[key]; });
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == true) {
        console.log(this.friendsnames[i].userid)
        this.chosenUsers.push(this.friendsnames[i].userid)
      }
    }

    console.log(this.chosenUsers)
    let editGroupName = this.alert.create(
      {
        title: 'Group name',
        inputs: [{
          name: 'groupName',
          placeholder: 'Enter group name !'
        }],
        buttons: [
          {
            text: 'ok',
            handler: data => {
              let group_name = data.groupName
              this.groupChat.createGroup(group_name, this.chosenUsers, this.message).subscribe(res => {
                console.log(res)
                if (res.status == 1) {
                  this.groupChat.set_group_name(res.cid, group_name).subscribe(res1 => console.log(res1))
                  this.groupChat.set_group_admin(res.cid).subscribe(res2 => console.log(res2))
                  this.groupChat.usersCoversation(res.cid).subscribe(res3 => {
                    this.message = ''
                    this.chosenUsers = []
                    this.navCtrl.push(GroupChatPage, {
                      'messages': res3, 'chatUserName': group_name, 'cid': res.cid, 'group_admin': this.userId
                    })
                  })
                }
              })
            }
          }
        ]
      })
    editGroupName.present()
  }

}
