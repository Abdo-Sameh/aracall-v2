import { TabsPage } from '../tabs/tabs';
import { ContactsPage } from '../contacts/contacts';
import { GroupChatProvider } from '../../providers/group-chat/group-chat';
import { ChatHandlerPage } from '../chat-handler/chat-handler';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { NativeRingtones } from '@ionic-native/native-ringtones';

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
let connection, streamId;
@Component({
  selector: 'page-group-video-handler',
  templateUrl: 'group-video-handler.html',
})
export class GroupVideoHandlerPage {
  connection
  //connection = new RTCMultiConnection();
  cid
  userId
  incoming
  members = []
  number; timer = true;
  text = "Ringing";
  streamId
  name
  accept = true; deny = true; end = true; speaker = true; mute = true; unmute = true;
  constructor(public events: Events, private androidPermissions: AndroidPermissions, private ringtones: NativeRingtones, public navCtrl: NavController, public navParams: NavParams, public groupChat: GroupChatProvider) {
    this.userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
    this.cid = navParams.get('cid');
    this.incoming = this.navParams.get('remote');
    this.number = this.navParams.get('number');
    this.name = this.navParams.get('name');
    this.members = this.navParams.get('members');
    this.initalizeCall();
    if (this.incoming != true) {
      //caller
      // this.remoteavatar = this.navParams.get('avatar')
      // this.remotename = this.navParams.get('name')
      // this.mute = false;
      this.accept = true;
      this.deny = true;
      this.end = false;
      // this.hidetext = false;
      // this.time = true;
      this.mute = true;
      this.speaker = true;

      this.groupChat.callee_recieved_listen(this.cid).subscribe(data => {
        if (data == true) { this.text = "Ringing" }
      })
      for (let member of this.members) {
        this.groupChat.callee_accept_listen(member.userid).subscribe(data => {
          console.log('accept listen is' + data)
          if (data == true) {
            this.timer = false;
            this.speaker = false;
            // this.hideavatar = true;
            // this.hidetext = true; this.hidevideo = false;
            this.mute = false;
            let counter = 0;
            let iteration = 0;
            setInterval(function(newseconds) {
              var minutes = iteration;
              var seconds = counter;
              counter++;
              if (seconds == 59) {
                iteration++;
                counter = 0;
              }
              var timer = minutes + ':' + seconds;
              $(".video-timer").html(timer);
            }, 1000);
          }
        })
      }
      this.groupChat.callee_end_listen(this.cid).subscribe(data => {
        console.log('callee end data ' + data)
        if (data == true) {

          this.events.publish('callended', "user");
          console.log('callee end poped')
          this.navCtrl.pop()
        }
      })
      this.groupChat.callee_deny_listen(this.cid).subscribe(data => {
        if (data == true) {
          this.events.publish('callended', "user");
          console.log('callee deny poped')
          this.navCtrl.pop();
        }
      })
    } else {

      //callee
      // this.remoteavatar = this.navParams.get('avatar')
      // this.remotename = this.navParams.get('name')
      this.accept = false;
      this.ringtones.getRingtone().then((ringtones) => {
        this.ringtones.playRingtone(ringtones[0]['Url']);
      });
      this.deny = false;
      this.end = true;
      this.mute = true;
      // this.hideavatar = false;
      this.text = 'Ringing';
      // this.hidetext = false;
      this.timer = true
      this.speaker = true;
      // this.hideavatar = false
      // console.log(this.remotename)
      // this.hidevideo = true;
      // this.time = true;
      this.groupChat.calee_recieved_set(undefined, true, this.userId);

      this.groupChat.caller_end_listen(this.userId).subscribe(data => {
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
    console.log('ionViewDidLoad GroupVideoHandlerPage');
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
      streamId = event.streamid;
      // alert(video.id);
      var node = document.createElement("LI");
      node.className = "group-call";
      video.setAttribute("style", "width: 100%; height: 100%;");
      video.removeAttribute("controls");
      document.getElementById("Videos").appendChild(node).appendChild(video);
    };
    // console.log((this.cid * 1000000000).toString(16));
    if (this.incoming == false) {
      connection.openOrJoin(this.number);
    }
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

  openOrJoin() {
    // alert('open');
  }

  join() {
    // alert('join');
    connection.open('room-id')
  }

  connect() {
    // alert('connect');
    connection.connect('room-id');
  }

  getAllUsers() {
    connection.getAllParticipants().forEach(function(participantId) {
      var user = connection.peers[participantId];
      var hisFullName = user.extra.fullName;
      var hisUID = user.userid;
      var hisNativePeer = user.peer;
      var hisIncomingStreams = user.peer.getRemoteStreams();
      var hisDataChannels = user.channels;
      // alert(user);
    });
  }

  leave() {
    // alert('you are leaving')
    connection.attachStreams.forEach(function(localStream) {
      localStream.stop();
    });
    // close socket.io connection
    connection.close();
  }

  endCall() {
    this.events.publish('callended', "user");
    this.ringtones.getRingtone().then((ringtones) => {
      this.ringtones.playRingtone(ringtones[3]['Url']);
    });
    // audioTracks.enabled = false
    if (this.incoming != true) {
      for (let member of this.members) {
        this.groupChat.calee_recieved_set(member.userid, false, this.userId)
        //caller
        this.groupChat.callee_accept_set(member.userid, false)
        this.groupChat.callee_deny_set(member.userid, false)
        this.groupChat.set_caller_data(member.userid, this.userId)
        this.groupChat.caller_end_set(member.userid, true)
        this.groupChat.caller_end_set(member.userid, false);
        if (remotestrean != undefined) { connection.close(); }
        this.groupChat.set_incoming(member.userid, { 0: "undefined" }, this.userId)
        console.log('caller end poped')
      }
      this.navCtrl.pop()
    } else {
      this.groupChat.calee_recieved_set(undefined, false, this.userId)
      //callee
      this.groupChat.callee_accept_set(undefined, false)
      this.groupChat.callee_deny_set(undefined, false)
      this.groupChat.set_caller_data(undefined, this.userId)
      this.groupChat.callee_end_set(true, this.userId);
      this.groupChat.callee_end_set(false, this.userId)
      if (remotestrean != undefined) { connection.close(); }
      this.groupChat.set_incoming(undefined, { 0: "undefined" }, this.userId)
      console.log('callee end setroot')
      this.navCtrl.setRoot(TabsPage, { tabIndex: 0 })
    }
    connection.close();
  }

  acceptCall() {
    connection.openOrJoin(this.number);
    this.ringtones.getRingtone().then((ringtones) => {
      this.ringtones.playRingtone(ringtones[0]['Url']);
    });
    // this.text = true;
    // this.hideavatar = true;
    this.groupChat.callee_accept_set(this.userId, true);
    // this.hidevideo = false;
    this.mute = false;
    this.accept = true;
    this.deny = true;
    this.end = false;

    //hide style of caller
    // this.groupChat.caller_end_listen().subscribe(data => {
    //   if (data == true){this.end()}
    // })
  }

  denyCall() {
    this.events.publish('callended', "user")
    this.ringtones.getRingtone().then((ringtones) => {
      this.ringtones.playRingtone(ringtones[0]['Url']);
    });
    this.groupChat.callee_deny_set(undefined, true);
    this.groupChat.callee_deny_set(undefined, false);
    this.groupChat.calee_recieved_set(undefined, false, this.userId)
    if (remotestrean != undefined) { connection.close(); }
    this.groupChat.set_incoming(undefined, { 0: "undefined" }, this.userId)
    console.log('callee deny setroot')
    this.navCtrl.setRoot(TabsPage, { tabIndex: 0 })
  }
}
