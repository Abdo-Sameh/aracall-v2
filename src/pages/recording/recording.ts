import { Component } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media';
import { NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
// import {Timer} from './itimer';

/**
 * Generated class for the RecordingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var cordova: any;
@Component({
  selector: 'page-recording',
  templateUrl: 'recording.html',
})
export class RecordingPage {
  file: MediaObject;
  name
  recordCallback
  flag = 0;
  public seconds: number = 0;
  constructor(public filePath: File, private media: Media, public navCtrl: NavController, public navParams: NavParams) {



    this.filePath.checkDir('file:///storage/emulated/0/', 'Recordings').then(() => {
      // Media Directory Exists, do nothing.
      // alert('Media Storage Loaded');
      if (this.file == null) {
        this.name = 'file:///storage/emulated/0/Recordings/' + this.createFileName();
        this.file = this.media.create(this.name);
      }
    }).catch(err => {
      // alert('Media Storage not found... Creating');
      this.filePath.createDir('file:///storage/emulated/0/', 'Recordings', false).then(dir => {
        if (this.file == null) {
          this.name = 'file:///storage/emulated/0/Recordings/' + this.createFileName();
          this.file = this.media.create(this.name);
        }
        // alert('Media Directory Created!');
      }).catch(err => {
        // alert('CRITICAL ERROR. MEDIA STORAGE DIRECTORY FAILED TO BE CREATED:' + err);
        // alert('Because of this, media files cannot be stored or loaded locally');

      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecordingPage');
  }

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".mp3";
    return newFileName;
  }

  ionViewWillEnter() {
    this.recordCallback = this.navParams.get("recordCallback")
  }

  startRecording() {


    try {
      this.file.startRecord();
      window.setTimeout(() => this.file.stopRecord(), 30000);
      this.flag = 1;
      var timer = setInterval(() => {
        if (this.flag == 2) {
          // console.log('stop')
          clearInterval(timer);
        }
        else if (this.seconds != 30) {
          this.seconds += 1;
        }
        else {
          clearInterval(timer);
        }
      }, 1000);
    }
    catch (e) {
      alert('Could not start recording.');
    }
  }

  stopRecording() {
    this.flag = 2;
    console.log(this.flag)
    try {
      this.file.stopRecord();
      this.file.release();
    }
    catch (e) {
      alert('Could not stop recording.');
    }
  }

  playRecording() {
    try {
      this.file.play();
    }
    catch (e) {
      alert(e);
    }
  }

  send() {
    this.recordCallback(this.name).then(() => {
      this.navCtrl.pop();
    });
  }

  back() {
    this.navCtrl.pop();
  }
}
