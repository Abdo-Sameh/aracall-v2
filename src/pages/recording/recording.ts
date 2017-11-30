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
  constructor(private media: Media, public navCtrl: NavController, public navParams: NavParams) {
    if (this.file == null) {
      this.file = this.media.create(this.createFileName());
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RecordingPage');
  }
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = 'Recordings/' + n + ".wav";
    return newFileName;
  }

  startRecording() {
    try {
      this.file.startRecord();
    }
    catch (e) {
      alert('Could not start recording.');
    }
  }

  stopRecording() {
    try {
      this.file.stopRecord();
    }
    catch (e) {
      alert('Could not stop recording.');
    }
  }

  // startPlayback() {
  //   try {
  //     this.file.play();
  //   }
  //   catch (e) {
  //     alert('Could not play recording.');
  //   }
  // }
  //
  // stopPlayback() {
  //   try {
  //     this.file.stop();
  //   }
  //   catch (e) {
  //     alert('Could not stop playing recording.');
  //   }
  // }

  send() {
    // alert(this.file);
    this.navCtrl.pop();
  }

}
