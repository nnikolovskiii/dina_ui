import { Routes } from '@angular/router';
import {ViewQuestionsComponent} from './view-questions/view-questions.component';
import {ChatComponent} from './chat/chat.component';
import {CodeProcessComponent} from './code-process/code-process.component';
import {FinishComponent} from './finish/finish.component';
import {ChatListComponent} from './chat-list/chat-list.component';


export const routes: Routes = [
  {path: 'questions', component: ViewQuestionsComponent },
  {path: 'chat', component: ChatComponent },
  {path: 'code-process', component: CodeProcessComponent},
  {path: 'finish', component: FinishComponent},
  {path: 'chat-list', component: ChatListComponent},
  {path: 'finish', component: FinishComponent},
];
