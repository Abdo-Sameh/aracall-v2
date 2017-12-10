import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, ToastController, AlertController, Loading, LoadingController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';
import * as $ from 'jquery';
import { Media, MediaObject } from '@ionic-native/media';

import { AudioHandlerPage } from '../audio-handler/audio-handler'
import { VideoHandlerPage } from '../video-handler/video-handler'
import { EmojiPickerModule } from '@ionic-tools/emoji-picker';


import { FriendsProvider } from '../../providers/friends/friends';
import { GroupChatProvider } from '../../providers/group-chat/group-chat';
import { FriendProfilePage } from '../friend-profile/friend-profile';
import { SignaturePage } from '../signature/signature';
import { GroupInfoPage } from '../group-info/group-info';

import { TabsPage } from '../tabs/tabs';
import { GroupVideoHandlerPage } from '../group-video-handler/group-video-handler';
import { GroupAudioHandlerPage } from '../group-audio-handler/group-audio-handler';

import { MapLocationPage } from '../map-location/map-location';
import { RecordingPage } from '../recording/recording';
import { SettingsProvider } from '../../providers/settings/settings'


/**
 * Generated class for the GroupChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-group-chat',
  templateUrl: 'group-chat.html',
  styleUrls: ['../../assets/main.css']
})
export class GroupChatPage {

  group
  userId
  messages
  currentUserID
  lastImage: string = null;
  loading: Loading
  lastonline
  friendData
  emojitext = ''
  remoteavatar
  the_userId
  cid
  is_blocked
  username
  groupMembers
  chats = []
  msgs = []
  settings = [{ 'last_seen_status': '', 'read_receipt': '' }];
  constructor(private fileChooser: FileChooser, public groupChat: GroupChatProvider, public loadingctrl: LoadingController, public alert: AlertController, public Settings: SettingsProvider, public media: Media, public toast: ToastController, private filePath: FilePath, private file: File, public platform: Platform, public camera: Camera, public actionSheetCtrl: ActionSheetController, public friends: FriendsProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.group = navParams.get('group');
    this.userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
    console.log(this.group);
    this.get_chat_members(this.group.cid);
    this.groupChat.display_single_chat_messages(this.group.cid).subscribe((res) => {
      console.log(res);
      for (let key in res) {
        res[key].time = this.edittime(Date.now(), res[key].time)
        this.chats.push(res[key])
      }
    });
    console.log(this.chats);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupChatPage');
  }

  goToGroupInfo() {

    this.navCtrl.push(GroupInfoPage, { 'group': this.group })
  }

  openMore() {
    $('.toggle-icons').toggleClass('open');
  }

  missingRequirments() {
    let alertCtrl = this.alert.create({
      title: 'Missing requirments',

      message: 'There are some missing requirements to enable Group Audio or video chat: \n' +
      '    - SSL certificate  '
      + ' - Mail server ' + '  - Firewall',
      buttons: [{

        text: 'ok',
        role: 'cancle'

      }]
    });
    alertCtrl.present()

  }



  edittime(current, previous) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerWeek = 7 * msPerDay;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
      return 'now';
    }

    else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + ' hours ago';
    }
    else if (elapsed < msPerWeek) {
      return Math.round(elapsed / msPerDay) + ' days ago';
    }
    else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerWeek) + ' weeks ago';
    }

    else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) + ' months ago';
    }

    else {
      return Math.round(elapsed / msPerYear) + ' years ago';
    }
  }


  dropdown() {

    $(document).on('click', '.type-message .toggle-arrow', function() {
      $(this).find("img").toggle();
      $('.toggle-icons').toggleClass('open');
    });
    $(document).on('click', '.toggle-icons .ion-more', function() {
      $('.chat-message-box .dropdown').toggleClass('open');
    });
  }



  send(cid = this.group.cid, userid = this.userId, text = this.emojitext) {
    this.groupChat.send_message(cid, userid, text, this.userId).subscribe((res) => {
      this.emojitext = '';
    });
  }
  location() {
    this.navCtrl.push(MapLocationPage, { id: this.group.cid, remoteid: this.userId });
  }
  handleSelection(event) {
    this.emojitext += event.char;
  }

  // video() {
  //   console.log(this.group.cid);
  //   this.navCtrl.push(GroupVideoHandlerPage, {
  //     cid: this.group.cid
  //   });
  // }

  get_chat_members(cid) {
    this.groupChat.getGroupChatMembers(cid).subscribe(res => { console.log(res); this.groupMembers = res; })
  }

  video() {
    let loading1 = this.loadingctrl.create({
      showBackdrop: false
    });
    let number = Math.floor(Math.random() * 1000000000);
    for (let member of this.groupMembers) {
      if (member.userid != this.userId) {
        this.groupChat.sendnumber(member.userid, "vid" + number.toString(16), 'video', this.userId);
        console.log(member);
      }
    }
    loading1.dismiss()
    this.navCtrl.push(GroupVideoHandlerPage, { cid: this.group.cid, members: this.groupMembers, remote: false, number: "vid" + number.toString(16) });
  }

  audio() {
    let loading1 = this.loadingctrl.create({
      showBackdrop: false
    });
    let number = Math.floor(Math.random() * 1000000000);
    for (let member of this.groupMembers) {
      if (member.userid != this.userId) {
        this.groupChat.sendnumber(member.userid, "aud" + number.toString(16), 'audio', this.userId);
        console.log(member);
      }
    }
    loading1.dismiss()
    this.navCtrl.push(GroupAudioHandlerPage, { cid: this.group.cid, members: this.groupMembers, remote: false, number: "aud" + number.toString(16) });
  }

  // call() {
  //   let  loading1 = this.loadingctrl.create({
  //       showBackdrop: false
  //     });
  //     this.groupChat.remoteid(this.username).then(data => {
  //     let number = Math.floor(Math.random() * 1000000000);
  //       this.groupChat.sendnumber(data, number, 'audio');
  //       let avatar = this.remoteavatar;
  //       loading1.dismiss()
  //       this.navCtrl.push(AudioHandlerPage, { avatar, data, number, remote: false });
  //
  //     })
  //
  //   }
  //
  //   video() {
  //   let  loading1 = this.loadingctrl.create({
  //       showBackdrop: false
  //     });
  //     let number = Math.floor(Math.random() * 1000000000);
  //     this.groupChat.remoteid(this.username).then(data => {
  //       this.groupChat.sendnumber(data, number, 'video');
  //       let avatar = this.remoteavatar;
  //       loading1.dismiss()
  //       this.navCtrl.push(VideoHandlerPage, { name: this.username, avatar, data, number, remote: false });
  //
  //     })
  //
  //
  //   }


}
