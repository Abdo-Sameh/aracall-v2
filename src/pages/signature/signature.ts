import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';

/**
 * Generated class for the SignaturePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-signature',
  templateUrl: 'signature.html',
})
export class SignaturePage {
  callback
  fullPath
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;

  public signaturePadOptions: Object = {
    'minWidth': 2,
    'minHeight': 9,
    'canvasWidth': 340,
    'canvasHeight': 900,
  };
  public signatureImage: string;

  constructor(private base64ToGallery: Base64ToGallery, public file: File, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignaturePage');
  }

  canvasResize() {
    let canvas = document.querySelector('canvas');
    this.signaturePad.set('minWidth', 1);
    this.signaturePad.set('minHeight', 10);
    this.signaturePad.set('canvasWidth', canvas.offsetWidth);
    this.signaturePad.set('canvasHeight', canvas.offsetHeight);
  }

  ionViewWillEnter() {
    this.callback = this.navParams.get("callback")
  }

  ngAfterViewInit() {
    console.log("Reset Model Screen");
    this.signaturePad.clear();
    this.canvasResize();
    this.signaturePad.resizeCanvas();
  }

  drawCancel() {
    this.navCtrl.pop();
  }

  drawComplete() {
    this.signatureImage = this.signaturePad.toDataURL();
    this.fullPath = 'file:///'
    // let blob = new Blob([this.signatureImage], { type: 'image/png' });
    // console.log(blob);
    // let time = new Date().getTime();
    // let fullPath = 'file:///storage/emulated/0/Pictures/' + time + '.jpg';
    alert('--------------');
    this.base64ToGallery.base64ToGallery(this.signatureImage, { prefix: '_img' }).then(
      res => {
        alert('success ' + res);
        this.fullPath += res;
        this.callback(this.fullPath).then(() => {
          this.navCtrl.pop();
        });
     },
      err => alert('Error saving image to gallery  ' + err)
    );
    // this.file.writeFile('file:///storage/emulated/0/Pictures/', time + '.jpg', this.signatureImage)
    // this.file([blob], 'file:///storage/emulated/0/Pictures/' + new Date().getTime() + '.jpg');
    // console.log(file);
    // this.signatureImage = file.name.toString();
    // console.log(this.signatureImage);
    alert(this.fullPath);

  }

  drawClear() {
    this.signaturePad.clear();
  }

}
