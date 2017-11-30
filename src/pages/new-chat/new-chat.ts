import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, ToastController, Loading,LoadingController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';
import * as $ from 'jquery';
import {SettingsProvider} from '../../providers/settings/settings'
import { FriendsProvider } from '../../providers/friends/friends';
import { SingleChatProvider } from '../../providers/single-chat/single-chat';
import { FriendProfilePage } from '../friend-profile/friend-profile';
import {AudioHandlerPage}  from '../audio-handler/audio-handler'
import {VideoHandlerPage}  from '../video-handler/video-handler'

import { SignaturePage } from '../signature/signature';

/**
 * Generated class for the NewChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-new-chat',
  templateUrl: 'new-chat.html',
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
  logined_user
  username
  chats = []
  msgs = []
  settings = [{ 'last_seen_status': '', 'read_receipt': '' }];
  constructor(private fileChooser: FileChooser, public singleChat: SingleChatProvider,public Settings:SettingsProvider,  public toast: ToastController, private filePath: FilePath, private file: File, public platform: Platform, public camera: Camera, public actionSheetCtrl: ActionSheetController, public friends: FriendsProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.cid = navParams.get('cid');
    this.remoteavatar = this.navParams.get('avatar');
    this.the_userId = navParams.get('user1');
    this.logined_user=localStorage.getItem('userid').replace(/[^0-9]/g, "");
    this.username= this.navParams.get('title');
    this.friends.profileDetailsApiCall(this.the_userId).subscribe(res => {
     console.log(res)
         this.currentUserID = res.id;
         console.log(this.currentUserID)
         this.lastonline = res.profile_info[0].value;
         this.Settings.get_user_chat_settings().subscribe(res => {
           this.settings[0].last_seen_status = res.last_seen_status
           this.settings[0].read_receipt = res.read_receipt_status
         })
         console.log(res)
  });
  this.singleChat.display_single_chat_messages(this.cid).subscribe((res)=>{
       if(res){
           this.msgs=res
           for (let key in this.msgs){
           this.msgs[key].time = this.edittime(Date.now(),this.msgs[key].time)
           console.log(this.chats)
           this.chats.push( this.msgs[key])

       }

   };
       });
}

ionViewDidLoad() {

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
     return Math.round(elapsed / msPerMinute) + ':minutes ago';
   }

   else if (elapsed < msPerDay) {
     return Math.round(elapsed / msPerHour) + ':hours ago';
   }
   else if (elapsed < msPerWeek) {
     return Math.round(elapsed / msPerDay) + ':days ago';
   }
   else if (elapsed < msPerMonth) {
     return Math.round(elapsed / msPerWeek) + ':weeks ago';
   }



   else if (elapsed < msPerYear) {
     return Math.round(elapsed / msPerMonth) + ':months ago';
   }

   else {
     return Math.round(elapsed / msPerYear) + ':years ago';
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
          alert("lib");
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
    alert(imagePath);
    // Special handling for Android library
    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), 'image');
        });
    } else {
      alert("else");
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), 'image');

    }
  }, (err) => {
    alert(err);
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
  alert(namePath);
  alert(currentName);
  alert(newFileName);
  alert(type);
  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
    this.lastImage = newFileName;
    this.singleChat.sendMessage(this.cid, this.the_userId, this.emojitext, this.lastImage, type);
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

recordPage() {
  this.navCtrl.push(RecordingPage);
}

chooseFile() {
  this.fileChooser.open()
    .then(uri => {
      alert(uri);
      if (this.platform.is('android')) {
        this.filePath.resolveNativePath(uri)
          .then(filePath => {
            alert(filePath);
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            alert(correctPath);
            let currentName = filePath.substring(filePath.lastIndexOf('/') + 1);
            alert(currentName);
            this.copyFileToLocalDir(correctPath, currentName, currentName, 'file');
          });
      } else {
        alert("else");
        var currentName = uri.substr(uri.lastIndexOf('/') + 1);
        var correctPath = uri.substr(0, uri.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, currentName, 'file');
      }
    }).catch(e => alert(e));
}
send(cid = this.cid , userid = this.logined_user , text = this.emojitext) {
  this.singleChat.send_message(cid,userid,text).subscribe((res)=>{console.log(res)});
  this.emojitext = ''
}

}
