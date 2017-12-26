import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, Loading, ToastController, LoadingController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { SettingsProvider } from './../../providers/settings/settings';

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var cordova: any;
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  lastImage: string = null;
  loading: Loading
  userAvatar
  userId
  user = {
    'first_name': '',
    'email_address': '',
    'username': '',
    'last_name': '',
    'avatar': '',
  }
  constructor(public settings: SettingsProvider, public loadingctrl: LoadingController, public toast: ToastController, private filePath: FilePath, private transfer: FileTransfer, private file: File, public platform: Platform, public camera: Camera, public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams) {
    this.userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
    this.getUserData()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  }

  getUserData() {
    this.settings.getLoggedInUSerProfile(this.userId).subscribe(res => {
      this.user = res;
      this.userAvatar = res.avatar;
      console.log(this.user);
    })
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
        // alert("else");
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

      }
    }, (err) => {
      // this.presentToast('Error while selecting image.');
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
      this.userAvatar = this.pathForImage(this.lastImage);
    }, error => {
      // alert(error);
      // this.presentToast('Error while storing file.');
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

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  uploadImage() {

    let uploading, message;
    //this.translate.get('uploading').subscribe(value => { uploading = value; })
    //this.translate.get('successfully-uploaded').subscribe(value => { message = value; })
    var filename = this.lastImage;
    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);
    // Destination URL
    var url, options;

    url = "https://arabface.online/api/89129812/profile/change/avatar";
    options = {
      fileKey: "avatar",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: { 'avatar': filename, 'userid': this.userId }
    };


    const fileTransfer: FileTransferObject = this.transfer.create();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options, true).then(data => {
      this.loading.dismissAll()
      let response = JSON.parse(data.response);
      if (response['status'] == 0) {
        // this.presentToast('Error while uploading file.');
      } else {
        this.presentToast(message);
      }
    }, err => {
      // this.presentToast('Error while uploading file.');
    });
  }

  save() {
    let toast = this.toast.create({
      message: "Updated successfully",
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    this.settings.editprofile(this.user.first_name, this.user.last_name, this.user.username, this.user.email_address, this.userId).subscribe(res => {
      this.uploadImage();
      toast.present();
    })
    this.navCtrl.pop();
  }

}
