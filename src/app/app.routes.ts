import { Routes } from '@angular/router';
import {DisplayContentComponent} from './features/document-managment/components/display-content/display-content.component';
import {ChatComponent} from './features/chat/components/chat/chat.component';
import {ConfirmProcessingComponent} from './features/document-managment/components/confirm-processing/confirm-processing.component';
import {SelectUrlComponent} from './features/document-extraction/collections/select-url/select-url.component';
import {CollectionsComponent} from './features/document-managment/components/collections/collections.component';
import {DocsFilesComponent} from './features/document-managment/components/docs-files/docs-files.component';
import {ListProcesses} from './features/show-process/components/list-processes/list-processes';
import {HomeComponent} from './features/home/components/home/home.component';
import {ModelsSidebarComponent} from './features/chat/components/models-sidebar/models-sidebar.component';
import {HistorySidebarComponent} from './features/chat/components/history-sidebar/history-sidebar.component';


export const routes: Routes = [
  {path: 'collection-data', component: DisplayContentComponent },
  {path: 'chat', component: ChatComponent },
  {path: 'docs-files', component: DocsFilesComponent},
  {path: 'finish', component: ConfirmProcessingComponent},
  {path:'extract-url', component: SelectUrlComponent},
  {path:'collections', component: CollectionsComponent},
  {path:'process', component: ListProcesses},
  {path:'home', component: HomeComponent},
  {path:'test', component: ModelsSidebarComponent},
  {path:'test1', component: HistorySidebarComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
