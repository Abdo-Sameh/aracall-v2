import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SignaturePadModule } from 'angular2-signaturepad';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileOpener } from '@ionic-native/file-opener';
import { FileChooser } from '@ionic-native/file-chooser';
import { Media, MediaObject } from '@ionic-native/media';
import { Globalization } from '@ionic-native/globalization';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { EmojiPickerModule } from '@ionic-tools/emoji-picker';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Vibration } from '@ionic-native/vibration';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignaturePage } from '../pages/signature/signature'
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
import { ChatSettingsPage } from './../pages/chat-settings/chat-settings';
import { NewChatPage } from './../pages/new-chat/new-chat';
import { NotificationSettingsPage } from './../pages/notification-settings/notification-settings';
import { BlockedUsersPage } from './../pages/blocked-users/blocked-users';
import { RecordingPage } from '../pages/recording/recording';
import { SearchPage } from '../pages/search/search'
import { TabsPage } from '../pages/tabs/tabs';
import { AllChatsPage } from './../pages/all-chats/all-chats';
import { ContactsPage } from './../pages/contacts/contacts';
import { InfoPage } from './../pages/info/info';
import { AllGroupsPage } from './../pages/all-groups/all-groups';
import { GroupChatPage } from './../pages/group-chat/group-chat';
import { AuthProvider } from '../providers/auth/auth';
import { SingleChatProvider } from '../providers/single-chat/single-chat';
import { GroupChatProvider } from '../providers/group-chat/group-chat';
import { SettingsProvider } from '../providers/settings/settings';
import { FriendsProvider } from '../providers/friends/friends';
import { GroupVideoHandlerPage } from './../pages/group-video-handler/group-video-handler';
import { GroupAudioHandlerPage } from './../pages/group-audio-handler/group-audio-handler';
import { NativeRingtones } from '@ionic-native/native-ringtones';
import { NativeAudio } from '@ionic-native/native-audio';
import { MusicControls } from '@ionic-native/music-controls';
import { LongPressModule } from 'ionic-long-press';
import { TimeProvider } from '../providers/time/time';
import { ImagePicker } from '@ionic-native/image-picker';


@NgModule({
  declarations: [
    MyApp,
    LoginPage, SignaturePage, InfoPage, FriendProfilePage, GroupInfoPage, EditProfilePage, MapLocationPage, VideoHandlerPage, ChatHandlerPage,
    ProfilePage, CreateGroupPage, BroadcastPage, MorePage, AudioHandlerPage, AddMemberPage, SearchPage, TabsPage, AllChatsPage, ContactsPage, AllGroupsPage,
    GroupChatPage, ChatSettingsPage, BlockedUsersPage, NotificationSettingsPage, RecordingPage, NewChatPage, GroupVideoHandlerPage, GroupAudioHandlerPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    SignaturePadModule,
    EmojiPickerModule.forRoot(),
    HttpClientModule,
    LongPressModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, LoginPage, SignaturePage, InfoPage, FriendProfilePage, GroupInfoPage, EditProfilePage, MapLocationPage, VideoHandlerPage, ChatHandlerPage,
    ProfilePage, CreateGroupPage, BroadcastPage, MorePage, AudioHandlerPage, AddMemberPage, SearchPage, TabsPage, AllChatsPage, ContactsPage, AllGroupsPage,
    GroupChatPage, ChatSettingsPage, BlockedUsersPage, NotificationSettingsPage, RecordingPage, NewChatPage, GroupVideoHandlerPage, GroupAudioHandlerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Camera,
    FilePath,
    FileTransfer,
    Globalization,
    Vibration,
    FileChooser,
    ImagePicker,
    File,
    PhotoViewer,
    Base64ToGallery,
    Media,
    NativeRingtones,
    MusicControls,
    NativeAudio,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    SingleChatProvider,
    GroupChatProvider,
    SettingsProvider,
    Diagnostic,
    FriendsProvider,
    AndroidPermissions,
    TimeProvider
  ]
})
export class AppModule { }
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/lang/', '.json');
}
