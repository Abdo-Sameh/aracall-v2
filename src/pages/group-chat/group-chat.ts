import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams ,AlertController} from 'ionic-angular';
import { GroupChatProvider } from '../../providers/group-chat/group-chat';

import { GroupInfoPage } from '../../pages/group-info/group-info';

/**
 * Generated class for the GroupChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-group-chat',
  templateUrl: 'group-chat.html',
})
export class GroupChatPage {

  group
  messages
  constructor(public navCtrl: NavController, public navParams: NavParams,public alert : AlertController ,public groupChat:GroupChatProvider) {
    this.group = navParams.get('group');
    this.logined_user=localStorage.getItem('userid').replace(/[^0-9]/g, "");
    this.groupchat.display_single_chat_messages(this.cid).subscribe((res)=>{
             for (let key in res) {
              res[key].time = this.edittime(Date.now() , res[key].time)
              this.chats.push(res[key])
              }
              loading.dismiss()
              });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupChatPage');
  }

  goToGroupInfo() {

    this.navCtrl.push(GroupInfoPage, { 'group': this.group })
  }

  missingRequirments()
  {
      let alertCtrl= this.alert.create({
           title: 'Missing requirments',

          message:'There are some missing requirements to enable Group Audio or video chat: \n'+
               '    - SSL certificate  '
           +' - Mail server ' + '  - Firewall',
          buttons:[{

            text: 'ok',
            role: 'cancle'

          }]
      });
      alertCtrl.present()

  }



  edittime(current, previous) {
     var msPerMinute = 60 * 1000;
     var msPerHour = msPerMinute * 60;
     var msPerDay = msPerHour * 24;
     var msPerWeek = 7 * msPerDay;
     var msPerMonth = msPerDay * 30;
     var msPerYear = msPerDay * 365;

     var elapsed = current - previous;

     if (elapsed < msPerMinute) {
       return 'now';
     }

     else if (elapsed < msPerHour) {
       return Math.round(elapsed / msPerMinute) + ' minutes ago';
     }

     else if (elapsed < msPerDay) {
       return Math.round(elapsed / msPerHour) + ' hours ago';
     }
     else if (elapsed < msPerWeek) {
       return Math.round(elapsed / msPerDay) + ' days ago';
     }
     else if (elapsed < msPerMonth) {
       return Math.round(elapsed / msPerWeek) + ' weeks ago';
     }



     else if (elapsed < msPerYear) {
       return Math.round(elapsed / msPerMonth) + ' months ago';
     }

     else {
       return Math.round(elapsed / msPerYear) + ' years ago';
     }
   }


   dropdown() {

     $(document).on('click', '.type-message .toggle-arrow', function() {
       $(this).find("img").toggle();
       $('.toggle-icons').toggleClass('open');
     });
     $(document).on('click', '.toggle-icons .ion-more', function() {
       $('.chat-message-box .dropdown').toggleClass('open');
     });
   }



   send(cid = this.group.cid , userid = this.logined_user , text = this.emojitext) {
       this.groupChat.send_message(cid,userid,text).subscribe((res)=>{
         this.emojitext = '';
     });
   }
   location() {
     this.navCtrl.push(MapLocationPage,{id:this.group.cid,remoteid:this.logined_user});
   }
   handleSelection(event) {
     this.emojitext+=event.char;
   }
   call() {
     let  loading1 = this.loadingctrl.create({
         showBackdrop: false
       });
       this.groupchat.remoteid(this.username).then(data => {
       let number = Math.floor(Math.random() * 1000000000);
         this.groupchat.sendnumber(data, number, 'audio');
         let avatar = this.remoteavatar;
         loading1.dismiss()
         this.navCtrl.push(AudioHandlerPage, { avatar, data, number, remote: false });

       })

     }

     video() {
     let  loading1 = this.loadingctrl.create({
         showBackdrop: false
       });
       let number = Math.floor(Math.random() * 1000000000);
       this.groupchat.remoteid(this.username).then(data => {
         this.groupchat.sendnumber(data, number, 'video');
         let avatar = this.remoteavatar;
         loading1.dismiss()
         this.navCtrl.push(VideoHandlerPage, { name: this.username, avatar, data, number, remote: false });

       })


     }


}
