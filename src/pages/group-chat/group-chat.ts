import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, ToastController, AlertController, Loading, LoadingController } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
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

import { TimeProvider } from './../../providers/time/time';
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
declare var cordova: any;
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
  groupMembers = []
  chats = []
  leftGroup
  msgs = []
  settings = [{ 'last_seen_status': '', 'read_receipt': '' }];
  constructor(public time: TimeProvider, private transfer: FileTransfer, private photoViewer: PhotoViewer, private fileChooser: FileChooser, public groupChat: GroupChatProvider, public loadingctrl: LoadingController, public alert: AlertController, public Settings: SettingsProvider, public media: Media, public toast: ToastController, private filePath: FilePath, private file: File, public platform: Platform, public camera: Camera, public actionSheetCtrl: ActionSheetController, public friends: FriendsProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.leftGroup = true;
    this.group = navParams.get('group');
    this.userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
    console.log(this.group);
    this.get_chat_members(this.group.cid);
    this.groupChat.display_single_chat_messages(this.group.cid).subscribe((res) => {
      console.log(res);
      for (let key in res) {
        res[key].time = this.getTime(res[key].time)
        this.chats.push(res[key])
      }
    });
    console.log(this.chats);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupChatPage');
    $(document).ready(function() {
      $(".type-message input").focus(function() {
        $(".mic-send img").toggle();
      });
      $(".type-message input").blur(function() {
        $(".mic-send img").toggle();
      });
      $("body").click(function(e) {
        if (!$(e.target).is(".message-box-2 .type-message a:nth-child(4),.message-box-2 .type-message a:nth-child(4) *,.toggle-icons,.toggle-icons *")) {
          $(".toggle-icons").removeClass("open");
        }
      });
    });
  }

  handleFileName(path) {
    let type = path.substring(path.lastIndexOf('.') + 1);
    if (type == 'mp3' || type == 'wav' || type == 'm4a' || type == 'ogg')
      return "<audio controls><source src=" + path + "></audio>";
    else if (type == 'mp4' || type == 'avi' || type == 'flv' || type == 'gif' || type == 'rmvb' || type == 'mpeg')
      return "<video controls><source src=" + path + "></video>";
    else
      return path.substring(path.lastIndexOf('/') + 1);
  }

  askForDownload(path) {
    let download = this.alert.create({
      title: 'Download',
      message: "Do you want to download this file ?",
      buttons: [{
        text: 'Yes',
        handler: data => {
          loading.present();
          const fileTransfer: FileTransferObject = this.transfer.create();
          fileTransfer.download(path, 'file:///storage/emulated/0/Download/' + this.handleFileName(path)).then((success) => {
            alert("File downloaded successfully");
            loading.dismiss();
          }).catch((err) => {
            loading.dismiss();
            alert(err);
          });
        }
      },
      {
        text: 'No',
        role: 'cancel'
      }
      ],
    })
    download.present()
    let loading = this.loadingctrl.create({
      showBackdrop: false
    });
  }

  viewImage(path) {
    this.photoViewer.show(path);
  }

  goToGroupInfo() {

    this.navCtrl.push(GroupInfoPage, { 'group': this.group })
  }

  openMore() {
    $('.toggle-icons').toggleClass('open');
  }

  openGallery() {
    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  }

  openCamera() {
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // alert(imagePath);
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), 'image');
          });
      } else {
        // alert("else");
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), 'image');

      }
    }, (err) => {
      alert(err);
      // this.presentToast('Error while selecting image.');
    });
  }

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName, type) {
    // alert(namePath);
    // alert(currentName);
    // alert(newFileName);
    // alert(type);
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.groupChat.sendMessage(this.group.cid, this.the_userId, this.emojitext, this.lastImage, type, this.userId);
    }, error => {
      // alert(error);
      this.presentToast('Error while storing file.');
    });
  }

  presentToast(msg) {
    let toast = this.toast.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  handWriting() {
    // console.log("hand write");
    this.navCtrl.push(SignaturePage, {
      callback: this.myCallbackFunction
    });
  }

  myCallbackFunction = (filePath) => {
    return new Promise((resolve, reject) => {
      if (this.platform.is('android')) {
        // alert(filePath);
        let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
        // alert(correctPath);
        let currentName = filePath.substring(filePath.lastIndexOf('/') + 1);
        // alert(currentName);
        this.copyFileToLocalDir(correctPath, currentName, currentName, 'image');
      }
      resolve();
    });
  }

  recordPage() {
    this.navCtrl.push(RecordingPage, {
      'recordCallback': this.recordCallbackFunction
    })
  }

  recordCallbackFunction = (filePath) => {
    return new Promise((resolve, reject) => {
      if (this.platform.is('android')) {
        // alert(filePath);
        let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
        // alert(correctPath);
        let currentName = filePath.substring(filePath.lastIndexOf('/') + 1);
        // alert(currentName);
        this.copyFileToLocalDir(correctPath, currentName, currentName, 'file');

      } else {
        // alert("else");
        // var currentName = uri.substr(uri.lastIndexOf('/') + 1);
        // var correctPath = uri.substr(0, uri.lastIndexOf('/') + 1);
        // this.copyFileToLocalDir(correctPath, currentName, currentName, 'file');
      }
      resolve();
    });
  }

  chooseFile() {
    this.fileChooser.open()
      .then(uri => {
        // alert(uri);
        if (this.platform.is('android')) {
          this.filePath.resolveNativePath(uri)
            .then(filePath => {
              // alert(filePath);
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              // alert(correctPath);
              let currentName = filePath.substring(filePath.lastIndexOf('/') + 1);
              // alert(currentName);
              this.copyFileToLocalDir(correctPath, currentName, currentName, 'file');
            });
        } else {
          // alert("else");
          var currentName = uri.substr(uri.lastIndexOf('/') + 1);
          var correctPath = uri.substr(0, uri.lastIndexOf('/') + 1);
          this.copyFileToLocalDir(correctPath, currentName, currentName, 'file');
        }
      }).catch(e => alert(e));
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

  getTime(time) {
    return this.time.getTime(time);
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
    this.navCtrl.push(MapLocationPage, { id: this.group.cid, remoteid: this.userId, chatType: 'multiple' });
  }

  handleSelection(event) {
    this.emojitext += event.char;
  }

  get_chat_members(cid) {
    this.groupChat.getGroupChatMembers(cid).subscribe(res => { console.log(res); this.groupMembers = res;
      for (let i = 0; i < this.groupMembers.length; ++i) {
        if (this.groupMembers[i].userid == this.userId) {
          console.log('yes')
          this.leftGroup = false;
        }
      }
      $("#group_chat_footer").show();
     })
  }

  video() {
    let loading1 = this.loadingctrl.create({
      showBackdrop: false
    });
    loading1.present();
    let number = Math.floor(Math.random() * 1000000000);
    for (let member of this.groupMembers) {
      if (member.userid != this.userId) {
        this.groupChat.sendnumber(member.userid, "vid" + number.toString(16), 'video', this.userId);
        console.log(member);
      }
    }
    loading1.dismiss()
    this.navCtrl.push(GroupVideoHandlerPage, { cid: this.group.cid, members: this.groupMembers, remote: false, number: "vid" + number.toString(16), name: this.group.group_name });
  }

  audio() {
    let loading1 = this.loadingctrl.create({
      showBackdrop: false
    });
    loading1.present();
    let number = Math.floor(Math.random() * 1000000000);
    for (let member of this.groupMembers) {
      if (member.userid != this.userId) {
        this.groupChat.sendnumber(member.userid, "aud" + number.toString(16), 'audio', this.userId);
        console.log(member);
      }
    }
    loading1.dismiss()
    this.navCtrl.push(GroupAudioHandlerPage, { cid: this.group.cid, members: this.groupMembers, remote: false, number: "aud" + number.toString(16), name: this.group.group_name });
  }

  leaveGroup() {
    let leaveGroupAlert = this.alert.create(
      {
        title: 'Leave Group',
        message: 'Are you sure you want to leave this group ?',
        buttons: [
          {
            text: 'ok',
            handler: data => {
              this.groupChat.delete_group_member(this.group.cid, this.userId).subscribe(
                (res) => {
                  console.log(res)
                  if (res.status == 1) {
                    this.leftGroup = true;
                    // this.navCtrl.pop();
                    // this.groupMembers.splice(index, 1)
                    // this.numberOfParticipants -= 1
                  }
                }
              )
            }
          },
          {
            text: 'Cancle',
            role: 'cancle'
          }
        ]
      })
    leaveGroupAlert.present()
  }

}
