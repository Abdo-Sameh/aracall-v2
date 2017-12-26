import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Platform, ToastController } from 'ionic-angular';
import { FriendsProvider } from '../../providers/friends/friends';
import { SingleChatProvider } from '../../providers/single-chat/single-chat';
import * as $ from 'jquery';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { SignaturePage } from '../signature/signature';
import { MapLocationPage } from '../map-location/map-location';
import { RecordingPage } from '../recording/recording';
import { FileChooser } from '@ionic-native/file-chooser';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

/**
 * Generated class for the BroadcastPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var cordova: any;
@Component({
  selector: 'page-broadcast',
  templateUrl: 'broadcast.html',
  styleUrls: ['../../assets/main.css']
})
export class BroadcastPage {
  friendsList
  friendsnames
  chosenUsers = []
  lastImage: string = null;
  usersForm : FormGroup;
  names
  userId
  message
  emojitext = ''
  constructor(private fileChooser: FileChooser, public file: File, private filePath: FilePath, public toast: ToastController, public platform: Platform, public camera: Camera, public singleChat: SingleChatProvider, public alertCtrl: AlertController, public loadingctrl: LoadingController, public friends: FriendsProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BroadcastPage');
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

  add(user){
    let index = this.chosenUsers.indexOf(user);
    if(index == -1){
      this.chosenUsers.push(user);
    }else {
      this.chosenUsers.splice(index, 1);
    }
  }

  send(cid = '', text = this.emojitext) {
    for(let i = 0; i < this.chosenUsers.length; ++i){
      this.singleChat.send_message(cid, this.chosenUsers[i].userid, text, this.userId).subscribe((res) => {
        this.emojitext = '';
        const alert = this.alertCtrl.create({
          title: 'Boroadcast',
          subTitle: 'Boroadcast message sent successfully',
          buttons: ['ok']
        });
        alert.present();
        this.navCtrl.pop()
      });
    }

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
      // alert(err);
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
      for (let i = 0; i < this.chosenUsers.length; i++) {
        this.singleChat.sendMessage('', this.chosenUsers[i].userid, '', this.lastImage, type, this.userId);
      }
      const alert = this.alertCtrl.create({
        title: 'Boroadcast',
        subTitle: 'Boroadcast message sent successfully',
        buttons: ['ok']
      });
      alert.present();
      this.navCtrl.pop()
      // this.singleChat.sendMessage(this.cid, this.the_userId, this.emojitext, this.lastImage, type, this.userId);
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

  handleSelection(event) {
    this.emojitext += event.char;
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

  location() {
    // console.log(this.chosenUsers);
    // for (let i = 0; i < arr.length; i++) {
    //   if (arr[i] == true) {
    //     this.chosenUsers.push({ 'userid': this.friendsnames[i].userid, 'username': this.friendsnames[i].name, 'new': true })
    //   }
    // }
    this.navCtrl.push(MapLocationPage, { users: this.chosenUsers, id: '', remoteid: this.userId, chatType: 'broadcast' });
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

}
