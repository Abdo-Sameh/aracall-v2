import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http'
import { Geolocation } from '@ionic-native/geolocation';
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
  map: any;
  userId
  constructor(public diagnostic: Diagnostic, public alertCtrl: AlertController, public loadingctrl: LoadingController, public database: SingleChatProvider, public navCtrl: NavController, public navParams: NavParams, public http: Http, public geolocation: Geolocation) {
    cid = this.navParams.get('id');
    this.userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
    remoteid = this.navParams.get('remoteid')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MaplocationPage');
    this.diagnostic.isLocationEnabled().then(
      (isAvailable) => {

        // console.log('Is available? ' + isAvailable);
        this.getlocation();
      }).catch((e) => {
        console.log(e);
        this.diagnostic.switchToLocationSettings();
        const alert = this.alertCtrl.create({
          title: 'Open Gps',
          message: 'pLease Open Mobile GPS',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                this.navCtrl.pop();

              }
            },
            {
              text: 'OK',
              handler: () => {
                this.diagnostic.switchToLocationSettings();

                console.log('Buy clicked');
              }
            }
          ]
        });
        alert.present();

      });


  }

  send() {
    var url = " http://maps.google.com/?q=" + lat1 + "," + long1;
    console.log(url)
    if (url != undefined) {
      this.database.send_location(cid, remoteid, url, this.userId);
      this.navCtrl.pop();

    }
  }
  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

  getlocation() {

    let optionsGPS = { timeout: 4000, enableHighAccuracy: true };
    this.geolocation.getCurrentPosition(optionsGPS).then((resp) => {
      lat1 = resp.coords.latitude;
      long1 = resp.coords.longitude;
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      // currentPosMarker.setPosition(latLng);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });

      let content = "<h4>Information!</h4>";

      this.addInfoWindow(marker, content);
    }).catch((err) => {
      isenabled = true;
      let alert = this.alertCtrl.create({
        title: 'Open GPS',
        subTitle: 'You need active the GPS',
        buttons: [

          {
            text: 'OK',
            handler: () => {
              this.navCtrl.pop();
              this.diagnostic.switchToLocationSettings();

              console.log('Buy clicked');
            }
          }
        ]
      });
      alert.present();
      this.diagnostic.switchToLocationSettings();
    });
    // this.geolocation.getCurrentPosition().then((resp) => {
    //   lat1=resp.coords.latitude;
    //    long1=resp.coords.longitude;
    //   let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
    //  // currentPosMarker.setPosition(latLng);

    //   let mapOptions = {
    //     center: latLng,
    //     zoom: 15,
    //     mapTypeId: google.maps.MapTypeId.ROADMAP
    //   }

    //   this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //   let marker = new google.maps.Marker({
    //     map: this.map,
    //     animation: google.maps.Animation.DROP,
    //     position: this.map.getCenter()
    //   });

    //   let content = "<h4>Information!</h4>";

    //  this.addInfoWindow(marker, content);

    // https://www.bing.com/maps/default.aspx?where1=30.0444196, 31.2357116
    // http://maps.google.com/?q=30.0444196,31.2357116
    // var url = "  http://maps.google.com/?q="+30.0444196+","+ 31.2357116;
    //      var url2=" https://www.bing.com/maps/default.aspx?v=2&pc=FACEBK&mid=8100&where1=" +resp.coords.latitude+","+resp.coords.longitude;
    //      var url = "http://maps.google.com/maps?saddr=" +resp.coords.latitude+","+resp.coords.longitude;
    //     console.log(url2)

    //     //  this.http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long+'&sensor=true').map(res=>res.json()).subscribe(data => {
    //     //       var address = data.results[0];
    //     //    var location=address.formatted_address;
    //     //    alert(location)
    //      });
    //  }).catch(e =>
    //   {
    //   alert(JSON.stringify(e))
    //   alert('please Turn GPS ON');
    // }


    //  , function(error){
    //   alert(JSON.stringify(error))
    //   alert('please Turn GPS ON');
    //   // alert('please Turn GPS ON');
    //   // console.log("Could not get location");


    // }

  }

}
