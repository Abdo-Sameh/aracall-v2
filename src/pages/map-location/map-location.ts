import { NavController, NavParams, LoadingController, AlertController, Platform } from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Http } from '@angular/http'
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';
import { ChatHandlerPage } from './../chat-handler/chat-handler';
import { SingleChatProvider } from './../../providers/single-chat/single-chat';
import { GroupChatProvider } from './../../providers/group-chat/group-chat';
import { Diagnostic } from '@ionic-native/diagnostic';

let cid, remoteid;

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
  chosenUsers
  constructor(public groupChat: GroupChatProvider, public platform: Platform, public diagnostic: Diagnostic, public alertCtrl: AlertController, public loadingctrl: LoadingController, public database: SingleChatProvider, public navCtrl: NavController, public navParams: NavParams, public http: Http, public geolocation: Geolocation) {
    this.userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
    cid = this.navParams.get('id');
    remoteid = this.navParams.get('remoteid')
    this.chosenUsers = this.navParams.get('users')
    this.isLocationAvailable();
  }

  doRefresh(refresher) {
    this.isLocationAvailable();
    if (refresher != 0)
      refresher.complete();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MaplocationPage');
  }

  isLocationAvailable() {
    this.diagnostic.isLocationAvailable()
      .then((isAvailable) => {
        this.getUserPosition();
      })
      .catch((error: any) => {
        alert('Location is:' + error);
        this.diagnostic.switchToLocationSettings();
      });
  }

  getUserPosition() {
    this.options = {
      maximumAge: 3000, timeout: 3000, enableHighAccuracy: true
    };
    this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {

      this.currentPos = pos;

      console.log(pos);
      this.lat = pos.coords.latitude;
      this.long = pos.coords.longitude;
      this.addMap(pos.coords.latitude, pos.coords.longitude);

    }, (err: PositionError) => {
      alert("Open GPS")
      this.diagnostic.switchToLocationSettings();
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
    console.log(url)
    var imgLocation = "https://maps.googleapis.com/maps/api/staticmap?size=370x400&zoom=14&markers=color%3Ared%7C" + this.lat + "%2C%20" + this.long;
    console.log(imgLocation);
    console.log(url)
    if (url != undefined) {
      console.log(cid)
      if (this.navParams.get('chatType') == 'single')
        this.database.send_location(cid, remoteid, url, this.userId, imgLocation).subscribe((res) => { });
      else if (this.navParams.get('chatType') == 'broadcast') {
        for (let i = 0; i < this.chosenUsers.length; ++i) {
          this.database.send_location('', this.chosenUsers[i].userid, url, this.userId, imgLocation).subscribe((res) => { });
        }
        this.navCtrl.pop();
      }
      else
        this.groupChat.send_location(cid, remoteid, url, this.userId, imgLocation).subscribe((res) => { });
      this.navCtrl.pop();
    }
  }
}
