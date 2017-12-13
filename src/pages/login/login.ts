//import { FirebaseProvider } from './../../providers/firebase/firebase2';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http'
import { TabsPage } from './../tabs/tabs';
import { VideoHandlerPage } from '../video-handler/video-handler';
import { AudioHandlerPage } from '../audio-handler/audio-handler';
import { GroupVideoHandlerPage } from '../group-video-handler/group-video-handler';
import { GroupAudioHandlerPage } from '../group-audio-handler/group-audio-handler';

import { AuthProvider } from './../../providers/auth/auth';
import { SingleChatProvider } from './../../providers/single-chat/single-chat';
import { GroupChatProvider } from './../../providers/group-chat/group-chat';

// import stylefile from '../assets/main.css' ;
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
let temp, caller_data1, caller_data;
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['../../assets/main.css']
})
export class LoginPage {
  responseData: any;
  loggedIn;
  userData = {
    'username': '', 'password': ''
  };
  constructor(public groupChat: GroupChatProvider, public singleChat: SingleChatProvider, public toastCtrl: ToastController, public auth: AuthProvider, public loadingCtrl: LoadingController, public http: Http, public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation) {

  }

  authLoginUser() {
    if (this.userData.username && this.userData.password) {
      let loading = this.loadingCtrl.create({
        content: "Login",
      });
      loading.present()
      this.auth.loginPostData(this.userData, "login").then((result) => {
        loading.dismiss()

        this.responseData = result;
        console.log(this.responseData);
        if (this.responseData.status != 0) {
          console.log(localStorage.setItem('userData', JSON.stringify(this.responseData)));
          console.log(localStorage.setItem('userName', JSON.stringify(this.responseData.name)));
          console.log(localStorage.setItem('userid', JSON.stringify(this.responseData.id)));
          console.log(localStorage.setItem('userAvatar', this.responseData.avatar));
          console.log(localStorage.setItem('userCover', JSON.stringify(this.responseData.cover)));
          console.log(localStorage.setItem('loggedIn', "1"));
          this.navCtrl.push(TabsPage);
          this.getSingleCalls(this.responseData.id);
          this.getGroupCalls(this.responseData.id);
          // return true;
        }
        else {
          this.Toast("Please enter valid username and password");
          // return false;
        }
      }, (err) => {
        //Connection failed message
      });
    }
    else {
      this.Toast("Insert username and password");
    }
  }

  ///////// Toast function Start  //////////////////////
  public Toast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
  ///////// Toast function End  //////////////////////

  public loading(msg) {
    let toast = this.loadingCtrl.create({
      content: msg,
    });
    toast.present();
  }

  getSingleCalls(userId) {
    this.singleChat.incominglistener(userId).subscribe(data => {
      console.log(data);
      if (data != null) {
        caller_data1 = data;
        if (data[0] != "undefined") {
          this.singleChat.caller_data_listen(userId).subscribe(data => {
            console.log('inside app component listener')
            caller_data = data;
            if (temp == undefined) {
              if (caller_data1.type == "video") {
                console.log('video tab set root true')
                this.navCtrl.setRoot(VideoHandlerPage, { name: caller_data.name, avatar: caller_data.avatar, number: caller_data1.number, remote: true });
              } else {
                this.navCtrl.setRoot(AudioHandlerPage, { name: caller_data.name, avatar: caller_data.avatar, number: caller_data1.number, remote: true });
              }
              temp = caller_data1;
            }
          })
        }
      }
    })
  }

  getGroupCalls(userId) {
    this.groupChat.incominglistener(userId).subscribe(data => {
      console.log(data);
      if (data != null) {
        caller_data1 = data;
        if (data[0] != "undefined") {
          this.groupChat.caller_data_listen(userId).subscribe(data => {
            console.log('inside app component listener')
            caller_data = data;
            if (temp == undefined) {
              if (caller_data1.type == "video") {
                console.log('video tab set root true')
                this.navCtrl.setRoot(GroupVideoHandlerPage, { name: caller_data.name, avatar: caller_data.avatar, number: caller_data1.number, remote: true });
              } else {
                this.navCtrl.setRoot(GroupAudioHandlerPage, { name: caller_data.name, avatar: caller_data.avatar, number: caller_data1.number, remote: true});
              }
              temp = caller_data1;
            }
          })
        }
      }
    })
  }

}
