import { Component } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RecordingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-recording',
  templateUrl: 'recording.html',
})
export class RecordingPage {
  file: MediaObject;
  name
  recordCallback
  constructor(private media: Media, public navCtrl: NavController, public navParams: NavParams) {
    if (this.file == null) {
      this.name = 'file:///storage/emulated/0/Recordings/' + this.createFileName();
      this.file = this.media.create(this.name);
    }
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
    }
    catch (e) {
      alert('Could not start recording.');
    }
  }

  stopRecording() {
    try {
      this.file.stopRecord();
      this.file.release();
    }
    catch (e) {
      alert('Could not stop recording.');
    }
  }

  send() {
    this.recordCallback(this.name).then(() => {
      this.navCtrl.pop();
    });
  }

}
