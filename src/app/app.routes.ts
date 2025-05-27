import { Routes } from '@angular/router';
import {ModelsSidebarComponent} from './chat/components/models-sidebar/models-sidebar.component';
import {HistorySidebarComponent} from './chat/components/history-sidebar/history-sidebar.component';
import {SignInComponent} from './auth/components/sign-in/sign-in.component';
import {LoginComponent} from './auth/components/login/login.component';
import {LandingPage} from './landing-page/landing-page';
import {RChatComponent} from './chat/components/r-chat/r-chat.component';
import {UserMessage} from './chat/components/user-message/user-message';
import {AssistantMessageComponent} from './chat/components/assistant-message/assistant-message.component';
import {QuestionItemComponent} from './chat/components/question-item/question-item.component';
import {SuggestedQuestionsComponent} from './chat/components/suggested-questions/suggested-questions.component';
import {StartChatComponent} from './chat/components/start-chat/start-chat.component';


export const routes: Routes = [
  {path:'test', component: ModelsSidebarComponent},
  {path:'test1', component: HistorySidebarComponent},
  {path:'sign-in', component: SignInComponent},
  {path:'login', component: LoginComponent},
  {path: 'star', component: LandingPage},
  {path: 'lol' , component: RChatComponent},
  {path: 'start' , component: StartChatComponent},

  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
