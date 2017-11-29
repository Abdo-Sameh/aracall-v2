import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, URLSearchParams } from '@angular/http';

/*
  Generated class for the SingleChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let userId;
declare var firebase;
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

  constructor(public httpClient: HttpClient, public http: Http) {
    console.log('Hello SingleChatProvider Provider');
    userId = localStorage.getItem('userid').replace(/[^0-9]/g, "");
    firebase.initializeApp(config);
  }

  check_chat_history(other_userid) {
    return this.http.get(this.serverURL + this.KEY + '/chat/messages/check/chat/history?userid=' + userId + '&other_userid=' + other_userid)
    .map((res: any) => res.json());
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
