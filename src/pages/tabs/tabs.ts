import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { AllGroupsPage } from '../all-groups/all-groups';
import { AllChatsPage } from '../all-chats/all-chats';
import { SearchPage } from '../search/search';
import { ContactsPage } from '../contacts/contacts';
import { MorePage } from '../more/more';
/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  groupRoot = AllGroupsPage
  chatRoot = AllChatsPage
  contactsRoot = ContactsPage
  Search = SearchPage
  mySelectedIndex: number;
  unreadMessagesCount
  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController) {
    this.menu = menu;
    this.menu.enable(true)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

  openMenu() {
    console.log(this.menu)
    this.menu.open();
  }

  searchPage() {
    this.navCtrl.push(SearchPage);
  }

  more() {
    this.navCtrl.push(MorePage);
  }

}
