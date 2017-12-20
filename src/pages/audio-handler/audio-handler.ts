import { TabsPage } from '../tabs/tabs';
import { ContactsPage } from '../contacts/contacts';
import { ChatHandlerPage } from '../chat-handler/chat-handler';
import { SingleChatProvider } from '../../providers/single-chat/single-chat';
import { Component, ViewChild } from '@angular/core';
import { NativeRingtones } from '@ionic-native/native-ringtones';

import { NavController, NavParams, Events } from 'ionic-angular';
import * as $ from 'jquery'
let database, remotevideo, localvideo, sendMessage, number, remoteid;
let myid = Math.floor(Math.random() * 1000000000);
console.log('my id is' + myid)
let remotestrean = undefined;
let audioTracks;
/**
 * Generated class for the Videohandler2Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
export declare var RTCMultiConnection: any;
let connection, streamId, timer1, timer2;
@Component({
  selector: 'page-audio-handler',
  templateUrl: 'audio-handler.html',
})
export class AudioHandlerPage {
  @ViewChild('localVideo') localVideo;
  @ViewChild('selfVideo') selfVideo; timer = true;
  userId
  unmute = true;
  number; remotename; hideavatar = false; remoteavatar; speaker; mutehideend = true; hidetext = true; text = "Connecting"; incoming; hideaccept = true; hidedeny = true; hideend = true; mute = true; hidevideo = true;
  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams,private ringtones: NativeRingtones, public db: SingleChatProvider) {
    this.userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
    this.remoteavatar = this.navParams.get('avatar')
    this.remotename = this.navParams.get('name')
    document.addEventListener("backbutton", onBackKeyDown, false);

    function onBackKeyDown() {
      this.end();
    }
    database = this.db;
    this.incoming = this.navParams.get('remote');
    this.number = this.navParams.get('number');
    remoteid = this.navParams.get('data');
    number = this.number;

    sendMessage = this.sendmessage

    this.initalizeCall();
    if (this.incoming != true) {
      //caller
      this.hideaccept = true;
      this.hidedeny = true;
      this.hideend = false;
      this.hidetext = false;
      this.mutehideend = true;
      this.speaker = true;


      this.db.callee_recieved_listen(remoteid).subscribe(data => {
        if (data == true) { this.text = "Ringing"; this.timer = true }
      })
      this.db.callee_accept_listen(remoteid).subscribe(data => {
        console.log('accept listen is' + data)
        if (data == true) {

          this.mutehideend = false; this.speaker = false; this.hideavatar = false; this.hidetext = true; this.hidevideo = false; this.mute = false;
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
          this.timer = true;
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

      console.log(this.remotename)
      this.ringtones.getRingtone().then((ringtones) => {
      this.ringtones.playRingtone(ringtones[0]['Url']);});
      this.hideaccept = false;
      this.hidedeny = false;
      this.hideend = true;
      this.mute = true;
      this.speaker = true;
      this.hidevideo = true;
      this.mutehideend = true;

      if (this.db.calee_recieved_set(undefined, true, this.userId)) {

      }
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
    // console.log('before new');
    connection = new RTCMultiConnection();
    connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
    // console.log('before session');
    // if you want audio+video conferencing
    connection.session = {
      audio: true,
      video: false
    };
    // console.log('after session');
    connection.mediaConstraints = {
      audio: true,
      video: false
    };

    connection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: false
    };

    // alert('initalize');
    connection.audiosContainer = document.getElementById('audios');
    connection.onstream = function(event) {
      console.log(event)
      var audio = event.mediaElement;
      event.isAudioMuted
      // alert(audio);
      audio.id = event.streamid;
      streamId = audio.id;
      // alert(audio.id);
      // var node = document.createElement("LI");
      // node.className = "group-call";
      audio.setAttribute("style", "width: 0%; height: 0%;");
      audio.removeAttribute("controls");
      document.getElementById("audios").appendChild(audio);
    };
    if (this.incoming == false) {
      console.log(this.number)
      // var node = document.createElement("LI");
      // node.className = "group-call";
      // var img = document.createElement("IMG");
      // img.setAttribute("src", this.myAvatar);
      // document.getElementById("images").appendChild(node).appendChild(img)
      connection.openOrJoin(this.number);
    }
  }

  sendmessage(id, data) {
    database.writetodb(number, { sender: id, message: data })
    //msg.remove () ;
  }

  muteCall() {
    this.unmute = false;
    this.mutehideend = true;
    // connection.streamEvents[streamId].stream.mute('audio');
    connection.attachStreams.forEach(function(stream) {
      stream.mute(); // mute all tracks
    });
  }

  unmuteCall() {
    this.unmute = true;
    this.mutehideend = false;
    // connection.streamEvents[streamId].stream.unmute('audio');
    connection.attachStreams.forEach(function(stream) {
      stream.unmute(); // mute all tracks
    });
  }


  end() {
    this.events.publish('callended', "user");
    this.ringtones.getRingtone().then((ringtones) => {
    this.ringtones.playRingtone(ringtones[0]['Url']);});
    // audioTracks.enabled = false
    if (this.incoming != true) {
      this.db.calee_recieved_set(remoteid, false, this.userId)
      //caller
      this.db.callee_accept_set(remoteid, false, this.userId)
      this.db.callee_deny_set(remoteid, false)
      this.db.set_caller_data(remoteid, this.userId)
      this.db.caller_end_set(remoteid, true)
      this.db.caller_end_set(remoteid, false);
      this.db.set_incoming(remoteid, { 0: "undefined" }, this.userId)
      console.log('caller end poped')
      connection.close();
      clearInterval(timer1);
      this.navCtrl.pop()
    } else {
      this.db.calee_recieved_set(undefined, false, this.userId)
      //callee
      this.ringtones.getRingtone().then((ringtones) => {
      this.ringtones.playRingtone(ringtones[3]['Url']);});
      this.db.callee_accept_set(undefined, false, this.userId)
      this.db.callee_deny_set(undefined, false)
      this.db.set_caller_data(undefined, this.userId)
      this.db.callee_end_set(true, this.userId);
      this.db.callee_end_set(false, this.userId)
      this.db.set_incoming(undefined, { 0: "undefined" }, this.userId)
      console.log('callee end setroot')
      connection.close();
      clearInterval(timer2);
      this.navCtrl.setRoot(TabsPage, { tabIndex: 0 })
    }


  }
  deny() {
    this.events.publish('callended', "user")
    this.ringtones.getRingtone().then((ringtones) => {
    this.ringtones.playRingtone(ringtones[3]['Url']);});
    this.db.callee_deny_set(undefined, true);
    this.db.callee_deny_set(undefined, false);
    this.db.calee_recieved_set(undefined, false, this.userId)
    this.db.set_incoming(undefined, { 0: "undefined" }, this.userId)
    console.log('callee deny setroot')
    this.navCtrl.setRoot(TabsPage, { tabIndex: 0 })
  }
  mutesound() {
    // audioTracks.setGain(.2); // or gainController.off();
    $(document).on('click', '#mute', function() {
      for (var i = 0, l = audioTracks.length; i < l; i++) {
        audioTracks[i].enabled = !audioTracks[i].enabled;
      }

    })

    // alert(audioTracks)

  }
  accept() {
    //  alert("!")
    connection.openOrJoin(this.number);
    this.ringtones.getRingtone().then((ringtones) => {
    this.ringtones.playRingtone(ringtones[3]['Url']);});
    this.mutehideend = false;
    this.hidetext = true;
    this.hideavatar = false;
    this.db.callee_accept_set(undefined, true, this.userId);
    //alert(this.db.callee_accept_set(undefined , true))
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
