import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SettingsProvider } from '../../providers/settings/settings';

/**
 * Generated class for the ChatSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-chat-settings',
  templateUrl: 'chat-settings.html',
})
export class ChatSettingsPage {
  chatSettings
  constructor(public settings: SettingsProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.chatSettings = this.navParams.get('settings')

    if (this.chatSettings['last_seen_status'] == "1") {
      this.chatSettings['last_seen_status'] = true
    } else {
      this.chatSettings['last_seen_status'] = false
    }

    if (this.chatSettings['read_receipt_status'] == "1") {
      this.chatSettings['read_receipt_status'] = true
    } else {
      this.chatSettings['read_receipt_status'] = false
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatSettingsPage');
  }

  change_value(clicked, item) {
    console.log(item)
    console.log(clicked)
    if (clicked == 'last_seen') {
      let read_receipt = this.chatSettings['read_receipt_status']
      console.log('last_seen' + read_receipt + 'clicked' + clicked + 'item' + item)

      if (item == true) {
        if (read_receipt == true) {
          this.settings.set_user_chat_settings('1', '1').subscribe(res => console.log(res))
        } else {
          this.settings.set_user_chat_settings('1', '0').subscribe(res => console.log(res))
        }
      } else {
        if (read_receipt == false) {
          this.settings.set_user_chat_settings('0', '1').subscribe(res => console.log(res))
        } else {
          this.settings.set_user_chat_settings('0', '1').subscribe(res => console.log(res))
        }
      }
    } else if (clicked == 'read_receipt') {
      let last_seen = this.chatSettings['last_seen_status']
      console.log('last_seen' + last_seen + 'clicked' + clicked + 'item' + item)
      if (item == true) {
        if (last_seen == true) {
          this.settings.set_user_chat_settings('1', '1').subscribe(res => console.log(res))
        } else {
          this.settings.set_user_chat_settings('0', '1').subscribe(res => console.log(res))
        }
      } else {
        if (last_seen == false) {
          this.settings.set_user_chat_settings('0', '0').subscribe(res => console.log(res))
        } else {
          this.settings.set_user_chat_settings('1', '0').subscribe(res => console.log(res))
        }
      }
    }
  }

}
