import { TabsPage } from '../tabs/tabs';
import { ContactsPage } from '../contacts/contacts';
import { SingleChatProvider } from '../../providers/single-chat/single-chat';
import { ChatHandlerPage } from '../chat-handler/chat-handler';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Subscription } from "rxjs";
import { Observable } from 'rxjs/Rx';
import * as $ from 'jquery'
let servers = { 'iceServers': [{ 'urls': 'stun:stun.services.mozilla.com' }, { 'urls': 'stun:stun.l.google.com:19302' }, { 'urls': 'turn:numb.viagenie.ca', 'credential': 'webrtc', 'username': 'websitebeaver@mail.com' }] };
// let pc = new (servers);
let database, remotevideo, localvideo, sendMessage, number, remoteid;
let myid = Math.floor(Math.random() * 1000000000);
console.log('my id is' + myid)
let remotestrean = undefined;
/**
 * Generated class for the GroupVideoHandlerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
// let connection = new RTCMultiConnection();
export declare var RTCMultiConnection: any;

@Component({
  selector: 'page-group-video-handler',
  templateUrl: 'group-video-handler.html',
})
export class GroupVideoHandlerPage {

  connection = new RTCMultiConnection();

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.initalizeCall();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupVideoHandlerPage');
  }

  initalizeCall() {
    // this.connection.socketURL('http://localhost:8100/');
    this.connection.session = {
      audio: true,
      video: true
    };

    this.connection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true
    };


    // this.connection.socketURL = 'https://its4-conference.herokuapp.com/';
    // this.connection.openOrJoin('roomid');
    // this.connection.onstream = function (e) {
    // document.getElementById("video_div").appendChild(event.mediaElement);
    //console.log(event.mediaElement);
    // };
  }

  openOrJoin(){
    this.connection.openOrJoin('predefiend-roomid')
  }
}
