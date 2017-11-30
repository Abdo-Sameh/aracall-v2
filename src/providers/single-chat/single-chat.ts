import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Loading } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';

/*
  Generated class for the SingleChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let userId;
declare var firebase;
declare var cordova: any;
let myname ;
let alert1,downloadURL,avatar,name ; let signupres ; let signupresult ;
let userID; let cids ; let result = [] ; let friends ; let result5 = []; let msgs ; let chatid = [] ; let insideget ;
let friends2 ;let addchat ;  let getremote  ; let remoteid ; let result34 ; let apichat ; let firebasemsgs ; let apimsgs ;
var config = {
  apiKey: "AIzaSyD301e1goVdXYuQb6jujSI3uPJabnpcFAI",
  authDomain: "arabcall-a9e54.firebaseapp.com",
  databaseURL: "https://arabcall-a9e54.firebaseio.com",
  projectId: "arabcall-a9e54",
  storageBucket: "arabcall-a9e54.appspot.com",
  messagingSenderId: "1094528086232"
};

@Injectable()
export class SingleChatProvider {
  serverURL = 'http://192.168.1.252/arabface/api/'
  KEY = '89129812'
friends2
  constructor(private transfer: FileTransfer, public httpClient: HttpClient, public http: Http) {
    console.log('Hello SingleChatProvider Provider');
    userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
    firebase.initializeApp(config);
  }

  check_chat_history(other_userid) {
    return this.http.get(this.serverURL + this.KEY + '/chat/messages/check/chat/history?userid=' + userId + '&other_userid=' + other_userid)
      .map((res: any) => res.json());
  }

  display_single_chat_messages(cid) {
    return new Observable(observer => {
      firebase.database().ref('one2one/' + cid + '/messages').orderByChild('time').on('value', function(snapshot) {
        observer.next(snapshot.val())
      })
    })
  }

  send_message(cid, theuserid, text) {
    let url = this.serverURL + this.KEY + '/chat/send/message?text=' + text + '&cid=' + cid + '&theuserid=' + theuserid
    console.log(url)
    return this.http.get(url).do((res: any) => {
      console.log(res.json())
      firebase.database().ref('one2one/' + cid + '/messages').push({
        'sender_id': userId, 'id': '1', 'type': 'message', 'time': new Date().getTime(), 'message': '', 'is_read': false, 'is_received': false,
        'text': text, 'audio': '', 'video': '', 'call_duration': '', 'from_me': true, 'image': '', 'file': '', 'location': '', 'emoji': ''
      });
    }).map((res: Response) => res.json());

  }

  sendMessage(cid, theuserid, text, image, type) {
    let message, targetPath;
    var filename = image;
    if (image === null) {
      return '';
    } else {
      targetPath = cordova.file.dataDirectory + image;
      // alert('targetPaht' + targetPath)
    }
    var url, options;

    url = this.serverURL + this.KEY + '/chat/send/message';
    options = {
      fileKey: type,
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: { 'userid': userId, 'cid': cid, 'theuserid': theuserid, 'text': text }
    };
    if (type == 'image')
      options['params'].image = filename
    else if (type == 'file')
      options['params'].file = filename
    // alert(options['params'].cid)
    // alert(options['params'].theuserid)
    // alert(options['params'].userid)
    const fileTransfer: FileTransferObject = this.transfer.create();
    // alert('ay 7aga');
    // let loading: Loading
    // alert(targetPath);
    // alert(url);
    // alert(fileTransfer);
    fileTransfer.upload(targetPath, url, options, true).then(data => {
      // alert('ay 7aga 2');
      // loading.dismissAll()
      let response = JSON.parse(data.response);
      // alert(response['id']);
      // alert(response['text']);
      // alert(response['status']);
      if (response['status'] == 0) {
        //this.presentToast('Error while uploading file.');
      } else {
        let fileType = '', img = '';
        if (type == 'image')
          img = response['image']
        else if (type == 'file')
          fileType = response['file']

        firebase.database().ref('one2one/' + cid + '/messages').push({
          'sender_id': userId, 'id': response['id'], 'type': 'message', 'time': new Date().getTime(), 'message': '', 'is_read': false, 'is_received': false,
          'text': '', 'audio': '', 'video': '', 'call_duration': '', 'from_me': true, 'image': img, 'file': fileType, 'location': '', 'emoji': ''

        });

      }
    }).catch(err => {
      // alert('ay 7aga error');
      alert(err);
      //this.presentToast('Error while uploading file.');
    });
  }
  user = new Observable(observer => {
firebase.auth().onAuthStateChanged(function(user) {

 if (user) {

   // User is signed in.
   var displayName = user.displayName;

   var email = user.email;
   var emailVerified = user.emailVerified;
   var photoURL = user.photoURL;
   var isAnonymous = user.isAnonymous;
   var uid = user.uid;
   var providerData = user.providerData;

   observer.next("logged")
   observer.next({name:displayName})
 } else {

  observer.next("not here")
 }
});

}) ;
  sendnumber(id, number, type) {
    remoteid = id;
    firebase.database().ref(id + '/incoming').set({ number, type: type });

    this.getprofile().then(data => {
      result34 = data;
      console.log(result34)
      firebase.database().ref(id + '/call_status/caller_data').set({ avatar: result34.avatar, name: result34.name });
    })

  }
  getprofile() {
    return new Promise(resolve => {
      this.http.get( this.serverURL + this.KEY + "/profile/details?userid=" + userId).subscribe(data => {
        let data1 = data.text();
        data = JSON.parse(data1);
        resolve(data);
      })
    })

  }
  getConversations() {
    return new Observable(observer => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let urlSearchParams = new URLSearchParams();
      urlSearchParams.append('userid', userId);
      let body = urlSearchParams.toString();
      this.http.post(this.serverURL + this.KEY + '/chat/conversations', body, { headers: headers }).subscribe(data => {
        let data1 = data.text();
        data = JSON.parse(data1);
        observer.next(data)
        // this.addchats().subscribe(data => {
        // })
      })
    })
  }
  remoteid(title) {

  return new Promise (resolve => {

     let body = new URLSearchParams() ;
    body.append('userid' , userId )
    let body1 = body.toString() ;
   let  headers = new Headers();
     headers.append('Content-Type', 'application/x-www-form-urlencoded');
      this.http.post(this.serverURL + this.KEY + '/profile/friends' , body1 , {headers : headers}).subscribe(data => {
    let data1 = data.text() ;
    data = JSON.parse(data1) ;
     friends2 = data ;
    for (let i = 0 ; i < friends2.length;  i ++ ){

    if(friends2[i].name == title) {

        resolve(friends2[i].userid)
    }
}
})

  })

}
  placelistener (number) {
     return new Observable (observer => {
    firebase.database().ref('/' +number).on('child_added' , function (data) {

      observer.next(data.val())
    })


    })
  }

  incominglistener() {

      return new Observable (observer => {


      firebase.database().ref(userID +'/incoming').on('value' , function(snapshot) {

        observer.next(snapshot.val())
      })
    })
  }
  writetodb (number,data) {

  firebase.database().ref(number).push(data) ;

  }

  // mutesound()
  // {
  //   alert
  //   for (var i = 0, l = audioTracks.length; i < l; i++) {
  //     audioTracks[i].enabled = !audioTracks[i].enabled;
  //   }

  // }

  endcall () {
  firebase.database().ref(remoteid + '/incoming').set({0 : "undefined"}) ;

  }

  callee_accept_set (id , value) {
    if(id == undefined) {
    firebase.database().ref(userID + '/call_status/callee_accept').set(value); }
    else {firebase.database().ref(id + '/call_status/callee_accept').set(value); }
  }
  callee_deny_set (id , value) {
    if(id == undefined){
    firebase.database().ref(userID + '/call_status/callee_deny').set(value); }else{
      firebase.database().ref(id + '/call_status/callee_deny').set(value);
    }
  }
  calee_recieved_set (id , value) {
    if(id == undefined){firebase.database().ref(userID + '/call_status/callee_recieved').set(value);  }else{
    firebase.database().ref(id + '/call_status/callee_recieved').set(value);  }
  }
  callee_end_set (value) {
    firebase.database().ref(userID + '/call_status/callee_end').set(value);
  }
  caller_end_set (id,value) {
  firebase.database().ref(id + '/call_status/caller_end').set(value);
  }
  callee_accept_listen (id) {
  return new Observable (observer => {


      firebase.database().ref(id + '/call_status/callee_accept').on('value' , function(snapshot) {

        observer.next(snapshot.val())
      })
    })
  }
  callee_deny_listen (id) {
  return new Observable (observer => {


      firebase.database().ref(id + '/call_status/callee_deny').on('value' , function(snapshot) {

        observer.next(snapshot.val())
      })
    })
  }
  callee_recieved_listen (id) {
  return new Observable (observer => {


      firebase.database().ref(id + '/call_status/callee_recieved').on('value' , function(snapshot) {

        observer.next(snapshot.val())
      })
    })
  }
  callee_end_listen (id) {
    return new Observable (observer => {


      firebase.database().ref(id + '/call_status/callee_end').on('value' , function(snapshot) {
  console.log('calee end listen is fired from database')
        observer.next(snapshot.val())
      })
    })
  }
  caller_end_listen () {
  return new Observable (observer => {


      firebase.database().ref(userID + '/call_status/caller_end').on('value' , function(snapshot) {
  console.log('caller end listen fired')
        observer.next(snapshot.val())
      })
    })
  }
  set_userid (id) {
    userID = id.toString() ;
    console.log('userid is set to' + userID)
  }
  set_incoming (id,value) {
    if(id == undefined){
  firebase.database().ref(userID + '/incoming').set(value)
    }else {
  firebase.database().ref(id + '/incoming').set(value)
    }

  }
  set_active (value) {
    firebase.database().ref(userID + '/active').set(value)
  }
  caller_data_listen () {
    return new Observable (observer => {


      firebase.database().ref(userID + '/call_status/caller_data').on('value' , function(snapshot) {

        observer.next(snapshot.val())
      })
    })
  }
  set_caller_data (id) {
    if(id == undefined){
   firebase.database().ref(userID + '/call_status/caller_data').set({0 : "undefined"})
    }else {
      firebase.database().ref(id + '/call_status/caller_data').set({0 : "undefined"})
    }

  }
  // addchats() {
  //   return new Observable(observer => {
  //
  //     this.getconvo2().subscribe(data => {
  //       apichat = data;
  //       for (let i = 0; i < apichat.length; i++) {
  //         this.getmsg(apichat[i].cid).subscribe(data => {
  //           firebasemsgs = data;
  //
  //           this.getmessagesfromapi(apichat[i].cid).then(data => {
  //
  //             apimsgs = data;
  //             // alert("apimsgs"+JSON.stringify(apimsgs))
  //             // alert("firebasemsgs"+JSON.stringify(firebasemsgs))
  //             if (firebasemsgs == null) {
  //               for (let v = 0; v < apimsgs.length; v++) {
  //                 firebase.database().ref(userID + '/mesages/' + apichat[i].cid).push(apimsgs[v])
  //               }
  //             } else {
  //
  //               if (apimsgs.length > firebasemsgs.length) {
  //
  //                 firebase.database().ref(userID + '/mesages/' + apichat[i].cid).set("undefined")
  //                 for (let v = 0; v < apimsgs.length; v++) {
  //                   firebase.database().ref(userID + '/mesages/' + apichat[i].cid).push(apimsgs[v])
  //                 }
  //               }
  //             }
  //           })
  //         })
  //       }
  //     })
  //   })
  //
  // }

}
