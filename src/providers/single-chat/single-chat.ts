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
