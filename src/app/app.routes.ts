import { Routes } from '@angular/router';
import {DisplayContentComponent} from './features/document-managment/components/display-content/display-content.component';
import {ChatComponent} from './features/chat/components/chat/chat.component';
import {ConfirmProcessingComponent} from './features/document-managment/components/confirm-processing/confirm-processing.component';
import {SelectUrlComponent} from './features/document-extraction/collections/select-url/select-url.component';
import {CollectionsComponent} from './features/document-managment/components/collections/collections.component';
import {DocsFilesComponent} from './features/document-managment/components/docs-files/docs-files.component';
import {ListProcesses} from './features/show-process/components/list-processes/list-processes';
import {ModelsSidebarComponent} from './features/chat/components/models-sidebar/models-sidebar.component';
import {HistorySidebarComponent} from './features/chat/components/history-sidebar/history-sidebar.component';
import {DinaHomeComponent} from './features/dina-home/components/dina-home/dina-home.component';
import {SignInComponent} from './features/auth/components/sign-in/sign-in.component';
import {LoginComponent} from './features/auth/components/login/login.component';
import {DocumentFormComponent} from './features/dina-home/components/document-form/document-form.component';
import {PaymentComponent} from './features/dina-home/components/payment/payment.component';
import {StarButtonComponent} from './global-features/buttons/star-button/star-button.component';
import {AppointmentListComponent} from './features/dina-home/components/appointment-list/appointment-list.component';
import {UserInfoComponent} from './global-features/components/user-info/user-info.component';


export const routes: Routes = [
  {path: 'collection-data', component: DisplayContentComponent },
  {path: 'chat', component: ChatComponent },
  {path: 'docs-files', component: DocsFilesComponent},
  {path: 'finish', component: ConfirmProcessingComponent},
  {path:'extract-url', component: SelectUrlComponent},
  {path:'collections', component: CollectionsComponent},
  {path:'process', component: ListProcesses},
  {path:'test', component: ModelsSidebarComponent},
  {path:'test1', component: HistorySidebarComponent},
  {path:'dina-home', component: DinaHomeComponent},
  {path:'sign-in', component: SignInComponent},
  {path:'login', component: LoginComponent},
  {path: 'tmp', component: DocumentFormComponent},
  {path:'payment', component: PaymentComponent},
  {path: 'star', component: StarButtonComponent},
  {path: 'appointment', component: AppointmentListComponent},
  {path: 'user-info', component: UserInfoComponent},
  { path: '', redirectTo: 'dina-home', pathMatch: 'full' },
];
