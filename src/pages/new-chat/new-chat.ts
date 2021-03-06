import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, ToastController, Loading, LoadingController, AlertController } from 'ionic-angular';
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
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { FriendsProvider } from '../../providers/friends/friends';
import { SingleChatProvider } from '../../providers/single-chat/single-chat';
import { FriendProfilePage } from '../friend-profile/friend-profile';
import { SignaturePage } from '../signature/signature';
import { MapLocationPage } from '../map-location/map-location';
import { RecordingPage } from '../recording/recording';
import { SettingsProvider } from '../../providers/settings/settings'
/**
 * Generated class for the ChatHandlerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var cordova: any;
@Component({
  selector: 'page-new-chat',
  templateUrl: 'new-chat.html',
  styleUrls: ['../../assets/main.css']
})
export class NewChatPage {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('input1') private myinput: ElementRef;
  currentUserID
  lastImage: string = null;
  loading: Loading
  lastonline
  friendData
  emojitext
  remoteavatar
  the_userId
  cid
  is_blocked
  logined_user
  username
  chats = []
  msgs = []
  userId
  settings = [{ 'last_seen_status': '', 'read_receipt': '' }];
  constructor(public photoViewer: PhotoViewer, private transfer: FileTransfer, public alert: AlertController, private fileChooser: FileChooser, public singleChat: SingleChatProvider, public loadingctrl: LoadingController, public Settings: SettingsProvider, public media: Media, public toast: ToastController, private filePath: FilePath, private file: File, public platform: Platform, public camera: Camera, public actionSheetCtrl: ActionSheetController, public friends: FriendsProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
    this.cid = navParams.get('cid');
    this.remoteavatar = this.navParams.get('avatar');
    this.the_userId = navParams.get('user1');
    this.is_blocked = this.navParams.get('is_blocked');
    this.logined_user = localStorage.getItem('userid').replace(/[^0-9]/g, "");
    this.username = this.navParams.get('title');
    let loading = loadingctrl.create({
      showBackdrop: false
    });
    loading.present();
    console.log(this.the_userId + " " + this.userId)
    this.friends.profileDetailsApiCall(this.the_userId, this.userId).subscribe(res => {
      console.log(res)
      this.friendData = res;
      this.currentUserID = res.id;
      console.log(this.currentUserID)
      this.lastonline = res.profile_info[0].value;
      this.Settings.get_user_chat_settings(this.userId).subscribe(res => {
        this.settings[0].last_seen_status = res.last_seen_status
        this.settings[0].read_receipt = res.read_receipt_status
      })
      console.log(res)
    });

    this.singleChat.display_single_chat_messages(this.cid, this.userId).subscribe((res) => {
      for (let key in res) {
        res[key].time = this.edittime(Date.now(), res[key].time)
        this.chats.push(res[key])
      }
      loading.dismiss()
    });
  }

  ionViewDidLoad() {
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

  viewImage(path) {
    this.photoViewer.show(path);
  }

  openMore() {
    $('.toggle-icons').toggleClass('open');
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

  view_profile() {
    console.log(this.currentUserID)
    this.remoteavatar = this.navParams.get('avatar');
    this.navCtrl.push(FriendProfilePage, {
      data: this.friendData
    });
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      // title: 'Select Image Source',
      buttons: [
        {
          text: 'Library',
          handler: () => {
            // alert("lib");
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        }
      ]
    });
    actionSheet.present();
  }

  openGallery() {
    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  }

  openCamera() {
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  // vibrate() {
  //   this.vibration.vibrate(50);
  // }

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
      // alert(err);
      this.presentToast('Error while selecting image.');
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
      this.singleChat.sendMessage(this.cid, this.the_userId, this.emojitext, this.lastImage, type, this.userId);
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

  send(userid = this.the_userId, text = this.emojitext) {
    console.log(this.the_userId, text, this.userId);
    this.singleChat.send_message("", userid, text, this.userId).subscribe((res) => {
      this.emojitext = '';
    });
  }

  location() {
    this.navCtrl.push(MapLocationPage, { id: this.cid, remoteid: this.logined_user, chatType: 'single' });
  }

  handleSelection(event) {
    this.emojitext += event.char;
  }

  handleFileName(path) {
    let name = path.substring(path.lastIndexOf('/') + 1);
    return name;
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

  call() {
    let loading1 = this.loadingctrl.create({
      showBackdrop: true,
      content: 'Calling',
      spinner: 'dots'
    });
    loading1.present();
    this.singleChat.remoteid(this.username, this.userId).then(data => {
      let number = Math.floor(Math.random() * 1000000000);
      this.singleChat.sendnumber(data, number, 'audio', this.userId);
      let avatar = this.remoteavatar;
      loading1.dismiss()
      this.navCtrl.push(AudioHandlerPage, { avatar, data, number, remote: false });
    })
  }

  video() {
    let loading1 = this.loadingctrl.create({
      showBackdrop: true,
      content: 'Calling',
      spinner: 'dots',

    });
    loading1.present();
    let number = Math.floor(Math.random() * 1000000000);
    this.singleChat.remoteid(this.username, this.userId).then(data => {
      this.singleChat.sendnumber(data, number, 'video', this.userId);
      let avatar = this.remoteavatar;
      loading1.dismiss();
      this.navCtrl.push(VideoHandlerPage, { name: this.username, avatar, data, number, remote: false });
    })
  }

  Block(blockedUser) {
    let blockUser = this.alert.create({
      title: 'Block user',
      message: "Do you want block this user ?",
      buttons: [
        {
          text: 'ok',
          handler: data => {
            this.singleChat.blockUser(blockedUser, this.logined_user).subscribe(res => {
              loading1.dismiss()
              console.log(res)
              if (res.status == 1) {
                this.is_blocked = true;
                // this.navCtrl.push(TabsPage);
              }
            }
            )
          }
        },
        {
          'text': 'cancel',
          role: 'cancel'
        }
      ],
    })
    blockUser.present()
    let loading1 = this.loadingctrl.create({
      showBackdrop: false
    });
  }

  unBlock(blockedUser) {
    let editGroupName = this.alert.create(
      {
        title: 'Unblock user',
        message: "Do you want unblock this user ?",
        buttons: [{
          text: 'Ok',
          handler: data => {
            this.friends.unblockUser(blockedUser, this.userId).subscribe(res => {
              loading1.dismiss()
              console.log(res);
              if (res.status == 1) {
                this.is_blocked = false;
                // window.location.reload();
                // this.navCtrl.pop();
              }
            }
            )
          }
        }, {
          'text': 'Cancel',
          role: 'cancel'
        }
        ],
      })
    editGroupName.present()
    let loading1 = this.loadingctrl.create({
      showBackdrop: false
    });
  }
}
