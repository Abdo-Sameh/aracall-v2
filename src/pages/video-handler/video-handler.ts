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
let pc = new RTCPeerConnection(servers);
let database, remotevideo, localvideo, sendMessage, number, remoteid;
import { NativeRingtones } from '@ionic-native/native-ringtones';

let myid = Math.floor(Math.random() * 1000000000);
console.log('my id is' + myid)
let remotestrean = undefined;
/**
 * Generated class for the Videohandler2Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
export declare var RTCMultiConnection: any;
let connection, streamId, timer1, timer2, incoming;
@Component({
  selector: 'page-video-handler',
  templateUrl: 'video-handler.html',
})
export class VideoHandlerPage {

  private tick: string;
  streamId
  userId
  private subscription: Subscription; timer = true; unmute = true;
  number; remotename; hideavatar = false; remoteavatar; speaker; hidetext = true; time = true; text = "Ringing"; hideaccept = true; hidedeny = true; hideend = true; mute = true; hidevideo = true;
  constructor(public events: Events, public navCtrl: NavController, private ringtones: NativeRingtones, public navParams: NavParams, public db: SingleChatProvider) {
    this.userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
    document.addEventListener("backbutton", onBackKeyDown, false);

    function onBackKeyDown() {
      this.end();
    }
    database = this.db;
    incoming = this.navParams.get('remote');
    this.number = this.navParams.get('number');
    remoteid = this.navParams.get('data');
    number = this.number;

    sendMessage = this.sendmessage

    this.initalizeCall();
    if (incoming != true) {
      //caller
      this.remoteavatar = this.navParams.get('avatar')
      this.remotename = this.navParams.get('name')
      this.mute = false;
      this.hideaccept = true;
      this.hidedeny = true;
      this.hideend = false;
      this.hidetext = false;
      this.time = true;
      this.speaker = true;

      this.db.callee_recieved_listen(remoteid).subscribe(data => {
        if (data == true) { this.text = "Ringing" }
      })
      this.db.callee_accept_listen(remoteid).subscribe(data => {
        console.log('accept listen is' + data)
        if (data == true) {
          this.timer = false;
          this.speaker = false;
          this.hideavatar = true; this.hidetext = true; this.hidevideo = false; this.mute = false;
          let counter = 0;
          let iteration = 0; this.timer = false
          timer1 = setInterval(function() {
            var minutes = iteration;
            var seconds = counter;
            counter++;
            if (seconds == 59) {
              iteration++;
              counter = 0;
            }
            var Timer = minutes + ':' + seconds;
            $(".video-timer").html(Timer);
          }, 1000);
        }
      })
      this.db.callee_end_listen(remoteid).subscribe(data => {
        console.log('callee end data ' + data)
        if (data == true) {

          this.events.publish('callended', "user");
          console.log('callee end poped')
          this.navCtrl.pop()
        }
      })
      this.db.callee_deny_listen(remoteid).subscribe(data => {
        if (data == true) {
          this.events.publish('callended', "user");
          console.log('callee deny poped')
          this.navCtrl.pop();
        }
      })
    } else {

      //callee
      this.ringtones.getRingtone().then((ringtones) => {
        this.ringtones.playRingtone(ringtones[3]['Url']);
      });
      this.remoteavatar = this.navParams.get('avatar')
      this.remotename = this.navParams.get('name')
      this.hideaccept = false;
      this.hidedeny = false;
      this.hideend = true;
      this.mute = true;
      this.hideavatar = false;
      this.text = 'Ringing';
      this.hidetext = false;
      this.timer = true
      this.speaker = true;
      this.hideavatar = false
      console.log(this.remotename)
      this.hidevideo = true;
      this.time = true;
      this.db.calee_recieved_set(undefined, true, this.userId);

      this.db.caller_end_listen(this.userId).subscribe(data => {
        console.log(data)
        if (data == true) {
          this.events.publish('callended', "user");
          console.log('set tabspage as a root')
          this.navCtrl.setRoot(TabsPage, { tabIndex: 0 })
        }
      })
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Videohandler2Page');
  }

  initalizeCall() {
    connection = new RTCMultiConnection();
    connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

    // if you want audio+video conferencing
    connection.session = {
      audio: true,
      video: true
    };

    connection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true
    };
    // alert('initalize');

    connection.onstream = function(event) {
      var video = event.mediaElement;
      // alert(video);
      video.id = event.streamid;
      this.streamId = event.streamid;
      // alert(video.id);
      streamId = video.id
      // var node = document.createElement("LI");
      // node.className = "group-call";
      // video.setAttribute("style", "width: 150px; height: 150px;");

      alert($('.video-user').children().length);
      if ($('.video-user').children().length == 0) {
        video.setAttribute("style", "width: 150px; height: 150px;");
        video.removeAttribute("controls");
        document.getElementById("video-user").appendChild(video);
      }
      else {
        video.setAttribute("style", "width: 100%; height: 100%;");
        video.removeAttribute("controls");
        document.getElementById("video-call").appendChild(video);

      }
    };

    // console.log((this.cid * 1000000000).toString(16));
    if (incoming == false) {
      // alert(this.number);
      connection.openOrJoin(this.number);
    }
  }

  sendmessage(id, data) {
    this.db.writetodb(number, { sender: id, message: data })
    //msg.remove () ;
  }

  muteCall() {
    this.unmute = false;
    this.mute = true;
    // connection.streamEvents[streamId].stream.mute('audio');
    connection.attachStreams.forEach(function(stream) {
      stream.mute(); // mute all tracks
    });
  }

  unmuteCall() {
    this.unmute = true;
    this.mute = false;
    // connection.streamEvents[streamId].stream.unmute('audio');
    connection.attachStreams.forEach(function(stream) {
      stream.unmute(); // mute all tracks
    });
  }

  // readmessage(data) {
  //   if (data != null) {
  //     var msg = JSON.parse(data.message);
  //     var sender = data.sender;
  //     if (sender != myid) {
  //       if (msg.ice != undefined)
  //         pc.addIceCandidate(new RTCIceCandidate(msg.ice));
  //       else if (msg.sdp.type == "offer")
  //         pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
  //           .then(() => pc.createAnswer())
  //           .then(answer => pc.setLocalDescription(answer))
  //           .then(() => this.sendmessage(myid, JSON.stringify({ 'sdp': pc.localDescription })));
  //       else if (msg.sdp.type == "answer") {
  //         setTimeout(function() {
  //           pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
  //         }, 2000);
  //       }
  //     }
  //   }
  // }

  end() {
    this.events.publish('callended', "user");
    this.ringtones.getRingtone().then((ringtones) => {
      this.ringtones.playRingtone(ringtones[0]['Url']);
    });
    // audioTracks.enabled = false
    if (incoming != true) {
      this.db.calee_recieved_set(remoteid, false, this.userId)
      //caller
      this.db.callee_accept_set(remoteid, false, this.userId)
      this.db.callee_deny_set(remoteid, false)
      this.db.set_caller_data(remoteid, this.userId)
      this.db.caller_end_set(remoteid, true)
      this.db.caller_end_set(remoteid, false);
      if (remotestrean != undefined) { pc.close(); }

      this.db.set_incoming(remoteid, { 0: "undefined" }, this.userId)
      console.log('caller end poped')
      connection.close();
      clearInterval(timer1);
      clearInterval(timer2);
      this.navCtrl.pop()
    } else {
      this.db.calee_recieved_set(undefined, false, this.userId)
      //callee
      this.db.callee_accept_set(undefined, false, this.userId)
      this.db.callee_deny_set(undefined, false)
      this.db.set_caller_data(undefined, this.userId)
      this.db.callee_end_set(true, this.userId);
      this.db.callee_end_set(false, this.userId)
      if (remotestrean != undefined) { pc.close(); }
      this.db.set_incoming(undefined, { 0: "undefined" }, this.userId)
      console.log('callee end setroot')
      connection.close();
      clearInterval(timer1);
      clearInterval(timer2);
      this.navCtrl.pop()
    }

  }

  deny() {
    this.events.publish('callended', "user")
    this.ringtones.getRingtone().then((ringtones) => {
      this.ringtones.playRingtone(ringtones[0]['Url']);
    });
    this.db.callee_deny_set(undefined, true);
    this.db.callee_deny_set(undefined, false);
    this.db.calee_recieved_set(undefined, false, this.userId)
    if (remotestrean != undefined) { pc.close(); }
    this.db.set_incoming(undefined, { 0: "undefined" }, this.userId)
    console.log('callee deny setroot')
    this.navCtrl.setRoot(TabsPage, { tabIndex: 0 })
  }

  accept() {
    connection.openOrJoin(this.number);
    this.ringtones.getRingtone().then((ringtones) => {
      this.ringtones.playRingtone(ringtones[3]['Url']);
    });
    this.hidetext = true;
    this.hideavatar = true;
    this.db.callee_accept_set(undefined, true, this.userId);
    this.hidevideo = false;
    this.mute = false;
    this.hideaccept = true;
    this.hidedeny = true;
    this.hideend = false;
    let counter = 0;
    let iteration = 0; this.timer = false
    timer2 = setInterval(function() {
      var minutes = iteration;
      var seconds = counter;
      counter++;
      if (seconds == 59) {
        iteration++;
        counter = 0;
      }
      var Timer = minutes + ':' + seconds;
      $(".video-timer").html(Timer);
    }, 1000);

  }
}
