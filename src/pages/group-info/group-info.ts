import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, ToastController, AlertController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { TranslateService } from '@ngx-translate/core';

import { GroupChatProvider } from '../../providers/group-chat/group-chat';
import { AddMemberPage } from '../add-member/add-member';
/**
 * Generated class for the GroupInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var cordova: any;

@Component({
  selector: 'page-group-info',
  templateUrl: 'group-info.html',
})
export class GroupInfoPage {
  group
  lastImage: string = null;
  groupMembers
  numberOfParticipants
  userId
  customized_group_name = []
  constructor(public translate: TranslateService, public alert: AlertController, public groupChat: GroupChatProvider, public toast: ToastController, public platform: Platform, public actionSheetCtrl: ActionSheetController, private filePath: FilePath, private file: File, public camera: Camera, public navCtrl: NavController, public navParams: NavParams) {
    this.group = navParams.get('group');
    this.userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
    console.log(this.group);
    this.get_chat_members(this.group.cid);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupInfoPage');
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
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
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

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.groupChat.changeGroupAvatar(this.group.cid, this.lastImage, this.userId);


      // this.group.group_cover = this.pathForImage(this.lastImage);
      // this.navCtrl.push(UploadImagePage, {
      //   cid: this.group.cid,
      //   image: this.lastImage
      // })
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  get_chat_members(cid) {
    this.groupChat.getGroupChatMembers(cid).subscribe(res => { console.log(res); this.groupMembers = res; this.numberOfParticipants = res.length })
  }

  deleteMember(index, userid) {
    let deleleGroupMember = this.alert.create({
        title: 'Delete member',
        message: 'Do you want to delete this member?',
        buttons: [{
            text: 'ok',
            handler: data => {
              this.groupChat.delete_group_member(this.group.cid, userid).subscribe(
                (res) => {
                  console.log(res)
                  if (res.status == 1) {
                    this.groupMembers.splice(index, 1)
                    this.numberOfParticipants -= 1
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
    deleleGroupMember.present()
  }

  add_member_to_group() {
    this.navCtrl.push(AddMemberPage, { 'id': this.group.cid, 'currentMembers': this.groupMembers })
  }

  get_group_Data(cid) {
    this.groupChat.get_group_name(cid).subscribe(res => { this.customized_group_name.push(res.group_name); this.group.group_cover = res.group_avatar })
  }

  openEditPage() {
    let message, title, cancel, save;
    this.translate.get('group-name').subscribe(value => { title = value; })
    this.translate.get('change-group-name').subscribe(value => { message = value; })
    this.translate.get('save').subscribe(value => { save = value; })
    this.translate.get('cancel').subscribe(value => { cancel = value; })
    let editGroupName = this.alert.create(
      {
        title: title,
        message: message,
        inputs: [{
          name: 'newName',
          placeholder: this.group.group_name
        }],
        buttons: [
          {
            text: save,
            handler: data => {
              this.groupChat.edit_group_name(this.group.cid, data.newName).subscribe(res => {
                if (res.status == 1) {
                  const toast = this.toast.create({
                    message: 'Name changed successfully ',
                    duration: 2000,
                    position: 'bottom'
                  });
                  toast.present()
                  console.log(res)
                  this.customized_group_name.unshift(res.group_name);
                }
              })
            }
          }, {
            'text': cancel,
            role: 'cancel'
          }
        ]
      })
    editGroupName.present()
  }

  back() {
    this.navCtrl.pop();
  }

}
