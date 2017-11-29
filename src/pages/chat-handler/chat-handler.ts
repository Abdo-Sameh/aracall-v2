import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, ToastController, Loading } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';
import * as $ from 'jquery';

import { FriendsProvider } from '../../providers/friends/friends';
import { SingleChatProvider } from '../../providers/single-chat/single-chat';
import { FriendProfilePage } from '../friend-profile/friend-profile';
import { SignaturePage } from '../signature/signature';
/**
 * Generated class for the ChatHandlerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var cordova: any;
@Component({
  selector: 'page-chat-handler',
  templateUrl: 'chat-handler.html',
  styleUrls: ['../../assets/main.css', '../../assets/ionicons.min.css']
})
export class ChatHandlerPage {
  currentUserID
  lastImage: string = null;
  loading: Loading
  lastonline
  emojitext
  remoteavatar
  the_userId
  cid
  settings = [{ 'last_seen_status': '', 'read_receipt': '' }];
  constructor(private fileChooser: FileChooser, public singleChat: SingleChatProvider, public toast: ToastController, private filePath: FilePath, private file: File, public platform: Platform, public camera: Camera, public actionSheetCtrl: ActionSheetController, public friends: FriendsProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.cid = navParams.get('cid');
    this.the_userId = navParams.get('user1');
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
      'currentUserID': this.currentUserID, id: this.navParams.get('data'), title: this.navParams.get('title'), remoteavatar: this.remoteavatar
    });
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      // title: 'Select Image Source',
      buttons: [
        {
          text: 'Library',
          handler: () => {
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
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = filePath.substring(filePath.lastIndexOf('/') + 1);
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        alert("else");
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.singleChat.sendMessage(this.cid, this.the_userId, this.emojitext, this.lastImage);
    }, error => {
      alert(error);

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
    console.log("hand write");
    this.navCtrl.push(SignaturePage, {
      callback: this.myCallbackFunction
    });
  }
  myCallbackFunction = (image) => {
    return new Promise((resolve, reject) => {
      // this.database.upload_image(image).then(data => {
      //   imagelink = data;
      //   resolve(data);
      //   console.log(data)
      //   this.send();
      // })
      // this.feeds.unshift(post);
    });
  }

  chooseFile() {
    this.fileChooser.open()
      .then(uri => {
        alert(uri);
        if (this.platform.is('android')) {
          this.filePath.resolveNativePath(uri)
            .then(filePath => {
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = filePath.substring(filePath.lastIndexOf('/') + 1);
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            });
        } else {
          alert("else");
          var currentName = uri.substr(uri.lastIndexOf('/') + 1);
          var correctPath = uri.substr(0, uri.lastIndexOf('/') + 1);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        }
      }).catch(e => alert(e));
  }


}
