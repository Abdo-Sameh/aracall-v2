import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignaturePage } from '../pages/signature/signature'
import { UploadImagePage } from '../pages/upload-image/upload-image';
import { FriendProfilePage } from './../pages/friend-profile/friend-profile';
import { GroupInfoPage } from './../pages/group-info/group-info';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { MapLocationPage } from './../pages/map-location/map-location';
import { VideoHandlerPage } from './../pages/video-handler/video-handler';
import { ChatHandlerPage } from './../pages/chat-handler/chat-handler';
import { ProfilePage } from './../pages/profile/profile';
import { CreateGroupPage } from './../pages/create-group/create-group';
import { BroadcastPage } from './../pages/broadcast/broadcast';
import { MorePage } from './../pages/more/more';
import { AudioHandlerPage } from './../pages/audio-handler/audio-handler';
import { AddMemberPage } from './../pages/add-member/add-member';
// import { RecordingPage } from '../pages/recording/recording';
import { SearchPage } from '../pages/search/search'
import { TabsPage } from '../pages/tabs/tabs';
import { AllChatsPage } from './../pages/all-chats/all-chats';
import { ContactsPage } from './../pages/contacts/contacts';
import { AllGroupsPage } from './../pages/all-groups/all-groups';
import { GroupChatPage } from './../pages/group-chat/group-chat';
import { AuthProvider } from '../providers/auth/auth';
import { SingleChatProvider } from '../providers/single-chat/single-chat';
import { GroupChatProvider } from '../providers/group-chat/group-chat';
import { SettingsProvider } from '../providers/settings/settings';
import { FriendsProvider } from '../providers/friends/friends';


@NgModule({
  declarations: [
    MyApp,
    LoginPage, SignaturePage, UploadImagePage, FriendProfilePage, GroupInfoPage, EditProfilePage, MapLocationPage, VideoHandlerPage, ChatHandlerPage,
    ProfilePage, CreateGroupPage, BroadcastPage, MorePage, AudioHandlerPage, AddMemberPage, SearchPage, TabsPage, AllChatsPage, ContactsPage, AllGroupsPage,
    GroupChatPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, LoginPage, SignaturePage, UploadImagePage, FriendProfilePage, GroupInfoPage, EditProfilePage, MapLocationPage, VideoHandlerPage, ChatHandlerPage,
    ProfilePage, CreateGroupPage, BroadcastPage, MorePage, AudioHandlerPage, AddMemberPage, SearchPage, TabsPage, AllChatsPage, ContactsPage, AllGroupsPage,
    GroupChatPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    SingleChatProvider,
    GroupChatProvider,
    SettingsProvider,
    FriendsProvider
  ]
})
export class AppModule { }
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/lang/', '.json');
}
