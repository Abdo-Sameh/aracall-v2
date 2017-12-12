import { NavController, NavParams, LoadingController, AlertController, Platform } from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Http } from '@angular/http'
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';
import { ChatHandlerPage } from './../chat-handler/chat-handler';
import { SingleChatProvider } from './../../providers/single-chat/single-chat';
import { Diagnostic } from '@ionic-native/diagnostic';

let lat1;
let long1;
let cid, remoteid;
let isenabled: boolean = false;

/**
 * Generated class for the MaplocationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var google;
@Component({
  selector: 'page-map-location',
  templateUrl: 'map-location.html',
})
export class MapLocationPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  userId
  options: GeolocationOptions;
  currentPos: Geoposition;
  lat
  long
  constructor(public platform: Platform, public diagnostic: Diagnostic, public alertCtrl: AlertController, public loadingctrl: LoadingController, public database: SingleChatProvider, public navCtrl: NavController, public navParams: NavParams, public http: Http, public geolocation: Geolocation) {
    this.userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
    cid = this.navParams.get('id');
    remoteid = this.navParams.get('remoteid')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MaplocationPage');
    this.diagnostic.isLocationEnabled().then(
      (isAvailable) => {
        // console.log('Is available? ' + isAvailable);
        this.getUserPosition();
      }).catch((e) => {
        console.log(e);
        this.diagnostic.switchToLocationSettings();
      });
  }

  ionViewDidEnter() {
    this.getUserPosition();
  }


  getUserPosition() {
    this.options = {
      maximumAge: 3000, timeout: 5000, enableHighAccuracy: true
    };
    this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {

      this.currentPos = pos;

      console.log(pos);
      this.lat = pos.coords.latitude;
      this.long = pos.coords.longitude;
      this.addMap(pos.coords.latitude, pos.coords.longitude);

    }, (err: PositionError) => {
      console.log("error : " + err.message);
      ;
    })
  }

  addMap(lat, long) {

    let latLng = new google.maps.LatLng(lat, long);
    console.log(lat + " " + long);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker();

  }

  addMarker() {

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<p>This is your current position !</p>";
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  //https://maps.googleapis.com/maps/api/staticmap?size=370x400&zoom=14&markers=color%3Ared%7C30.0556004%2C%2031.1981732


  sendLocation() {
    var url = "http://maps.google.com/?q=" + this.lat + "," + this.long;
    var imgLocation = "https://maps.googleapis.com/maps/api/staticmap?size=370x400&zoom=14&markers=color%3Ared%7C" + this.lat + "%2C%20" + this.long;
    console.log(imgLocation);
    console.log(url)
    if (url != undefined) {
      console.log(cid)
      this.database.send_location(cid, remoteid, url, this.userId, imgLocation);
      this.navCtrl.pop();
    }
  }
  //
  // addInfoWindow(marker, content) {
  //
  //   let infoWindow = new google.maps.InfoWindow({
  //     content: content
  //   });
  //
  //   google.maps.event.addListener(marker, 'click', () => {
  //     infoWindow.open(this.map, marker);
  //   });
  //
  // }
  //
  // getlocation() {
  //
  //   let optionsGPS = { timeout: 4000, enableHighAccuracy: true };
  //   this.geolocation.getCurrentPosition(optionsGPS).then((resp) => {
  //     lat1 = resp.coords.latitude;
  //     long1 = resp.coords.longitude;
  //     let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
  //     // currentPosMarker.setPosition(latLng);
  //
  //     let mapOptions = {
  //       center: latLng,
  //       zoom: 15,
  //       mapTypeId: google.maps.MapTypeId.ROADMAP
  //     }
  //
  //     this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
  //
  //     let marker = new google.maps.Marker({
  //       map: this.map,
  //       animation: google.maps.Animation.DROP,
  //       position: this.map.getCenter()
  //     });
  //
  //     let content = "<h4>Information!</h4>";
  //
  //     this.addInfoWindow(marker, content);
  //   }).catch((err) => {
  //     isenabled = true;
  //     let alert = this.alertCtrl.create({
  //       title: 'Open GPS',
  //       subTitle: 'You need active the GPS',
  //       buttons: [
  //
  //         {
  //           text: 'OK',
  //           handler: () => {
  //             this.navCtrl.pop();
  //             this.diagnostic.switchToLocationSettings();
  //
  //             console.log('Buy clicked');
  //           }
  //         }
  //       ]
  //     });
  //     alert.present();
  //     // this.diagnostic.switchToLocationSettings();
  //   });
  // }

}
