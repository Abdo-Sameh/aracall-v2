import { TabsPage } from './../tabs/tabs';
import { ContactsPage } from './../contacts/contacts';
import { SingleChatProvider } from '../../providers/single-chat/single-chat';
import { ChatHandlerPage } from './../chathandler/chathandler';
import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import {Subscription} from "rxjs";
import {Observable} from 'rxjs/Rx';
import * as $ from 'jquery'
let  servers = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'webrtc','username': 'websitebeaver@mail.com'}]};
  let pc = new RTCPeerConnection(servers);
  let database , remotevideo , localvideo ,sendMessage,number,remoteid  ;
  let myid = Math.floor(Math.random()*1000000000);
  console.log('my id is' + myid)
  let remotestrean = undefined ;
/**
 * Generated class for the Videohandler2Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-video-handler',
  templateUrl: 'video-handler.html',
})
export class VideoHandlerPage {
   @ViewChild('localVideo') localVideo;
  @ViewChild('selfVideo') selfVideo;
  private tick: string;
  private subscription: Subscription;timer = true
number ;remotename;hideavatar = false;remoteavatar ;speaker; hidetext = true ;time=true; text ="Ringing" ;  incoming ; hideaccept = true ; hidedeny = true ; hideend = true ; mute = true ; hidevideo = true ;
  constructor(public events:Events,public navCtrl: NavController, public navParams: NavParams,public db:SingleChatProvider) {


    document.addEventListener("backbutton", onBackKeyDown, false);

function onBackKeyDown() {
    this.end();
}
    database = this.db ;
    this.incoming = this.navParams.get('remote') ;
    this.number = this.navParams.get('number') ;
    remoteid = this.navParams.get('data') ;
    number = this.number  ;

    sendMessage = this.sendmessage


if(this.incoming != true) {
  //caller
  this.remoteavatar = this.navParams.get('avatar')
  this.remotename = this.navParams.get('name')
  this.mute=false;
  this.hideaccept = true ;
  this.hidedeny = true ;
  this.hideend = false  ;
  this.hidetext = false ;
  this.time=true;
  this.mute=true;
  this.speaker=true;

  this.db.callee_recieved_listen(remoteid).subscribe(data => {
    if(data ==true){this.text = "Ringing"}
  })
  this.db.callee_accept_listen(remoteid).subscribe(data => {
    console.log('accept listen is' + data)
    if(data==true){
this.timer=false;
this.speaker=false;
this.hideavatar=true;this.hidetext = true;this.hidevideo = false ; this.mute = false ;
let counter = 0;
let iteration = 0;
setInterval(function(newseconds){
   var minutes= iteration;
   var seconds =  counter ;
   counter++;
   if(seconds == 59)
  {
    iteration ++;
    counter = 0;
  }
   var timer = minutes +':'+seconds;
 $(".video-timer").html(timer);
},1000);
}
})
  this.db.callee_end_listen(remoteid).subscribe(data => {
    console.log('callee end data '+data)
    if(data == true){

     this.events.publish('callended', "user");
     console.log('callee end poped')
      this.navCtrl.pop()
    }
  })
  this.db.callee_deny_listen(remoteid).subscribe(data => {

if(data==true){
  this.events.publish('callended', "user");
  console.log('callee deny poped')
  this.navCtrl.pop();
}
  })
}else{

  //callee
  this.remoteavatar = this.navParams.get('avatar')
  this.remotename = this.navParams.get('name')
  this.hideaccept = false ;
  this.hidedeny = false ;
  this.hideend = true  ;
  this.mute=true ;
  this.hideavatar=false;
  this.text='Ringing';
  this.hidetext = false ;
  this.timer=true
  this.speaker=true;
  this.hideavatar=false
  console.log(this.remotename)
  this.hidevideo = true ;
  this.time=true;
  this.db.calee_recieved_set(undefined , true) ;

  this.db.caller_end_listen().subscribe(data => {
    console.log(data)
if(data == true){
  this.events.publish('callended', "user");
 console.log('set tabspage as a root')
  this.navCtrl.setRoot(TabsPage , {tabIndex : 0})}
})

}


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Videohandler2Page');

  }

    ngOnInit () {
      console.log('inside ng on init')

    remotevideo = this.localVideo.nativeElement ;
    localvideo = this.selfVideo.nativeElement ;
    navigator.getUserMedia({audio : true , video : true}, (stream) => {

localvideo.srcObject = stream
pc = new RTCPeerConnection(servers);
this.db.placelistener(this.number).subscribe(data => {
var array = $.map(data, function(value, index) {
    return [value];
});

  this.readmessage(data) ;
})


   pc.addStream(stream)
    this.init () ;
if(this.incoming == true){

this.call();
}

    }, (err) => console.error(err) )
  }

  init() {

pc.onicecandidate = (event => (event.candidate)?this.sendmessage(myid, JSON.stringify({'ice': event.candidate})):console.log("Sent All Ice") );
pc.onaddstream = (event => {

  remotevideo.srcObject = event.stream
  remotestrean = event.stream ;


  remotevideo.play();
});
}

call () {
console.log('call function fired')
 pc.createOffer()
 .then(function (offer) {

   pc.setLocalDescription(offer)

 } )
 .then(function () {
sendMessage(myid , JSON.stringify({'sdp': pc.localDescription}))
 })
}

sendmessage (id , data) {



database.writetodb (number , { sender: id, message: data })
//msg.remove () ;
}

readmessage(data) {
if(data !=null) {

var msg = JSON.parse(data.message);
 var sender = data.sender;
 if (sender != myid) {
 if (msg.ice != undefined)
 pc.addIceCandidate(new RTCIceCandidate(msg.ice));
 else if (msg.sdp.type == "offer")
 pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
 .then(() => pc.createAnswer())
 .then(answer => pc.setLocalDescription(answer))
 .then(() => this.sendmessage(myid, JSON.stringify({'sdp': pc.localDescription})));
 else if (msg.sdp.type == "answer"){setTimeout(function() {
    pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
 }, 2000);}

 }
}

}

end() {


  this.events.publish('callended', "user");



  // audioTracks.enabled = false




  if(this.incoming != true) {
    this.db.calee_recieved_set(remoteid , false)
    //caller
    this.db.callee_accept_set(remoteid , false)
this.db.callee_deny_set(remoteid , false)


    this.db.set_caller_data(remoteid)
this.db.caller_end_set(remoteid , true)
this.db.caller_end_set(remoteid , false);
if(remotestrean != undefined){pc.close();}

this.db.set_incoming(remoteid , {0 : "undefined"})
console.log('caller end poped')
this.navCtrl.pop()
  }else {
    this.db.calee_recieved_set(undefined , false)
//callee
  this.db.callee_accept_set(undefined , false)
this.db.callee_deny_set(undefined , false)
 this.db.set_caller_data(undefined)
    this.db.callee_end_set(true) ;
    this.db.callee_end_set(false)
    if(remotestrean != undefined){pc.close();}
    this.db.set_incoming(undefined , {0 : "undefined"})
    console.log('callee end setroot')
  this.navCtrl.setRoot(TabsPage , {tabIndex : 0})
  }


}
deny() {
  this.events.publish('callended' , "user")
this.db.callee_deny_set(undefined , true);

  this.db.callee_deny_set(undefined , false);




this.db.calee_recieved_set(undefined , false)
if(remotestrean != undefined){pc.close();}
this.db.set_incoming(undefined , {0 : "undefined"})
console.log('callee deny setroot')
 this.navCtrl.setRoot(TabsPage , {tabIndex : 0})


}
accept() {

  this.hidetext = true ;
  this.hideavatar=true;
this.db.callee_accept_set(undefined , true);
this.hidevideo = false ;
this.mute = false ;
this.hideaccept = true ;
this.hidedeny = true ;
this.hideend = false ;
//hide style of caller
// this.db.caller_end_listen().subscribe(data => {
//   if (data == true){this.end()}
// })

}



}
