import { Routes } from '@angular/router';
import { ModelsSidebarComponent } from './chat/components/model-selector/models-sidebar.component';
import { HistorySidebarComponent } from './chat/components/chat-history/history-sidebar.component';
import { SignInComponent } from './auth/components/register-form/sign-in.component';
import { LoginComponent } from './auth/components/login-form/login.component';
import { LandingPage } from './landing-page/landing-page';
import { RChatComponent } from './chat/components/chat-window/r-chat.component';
import { UserMessage } from './chat/components/message-user/user-message';
import { AssistantMessageComponent } from './chat/components/message-assistant/assistant-message.component';
import { StartChatComponent } from './chat/components/start-chat/start-chat.component';


export const routes: Routes = [
  {path:'test', component: ModelsSidebarComponent},
  {path:'test1', component: HistorySidebarComponent},
  {path:'sign-in', component: SignInComponent},
  {path:'login', component: LoginComponent},
  {path: 'star', component: LandingPage},
  {path: 'lol' , component: RChatComponent},
  {path: 'start' , component: StartChatComponent},

  { path: '', redirectTo: 'star', pathMatch: 'full' },
];
