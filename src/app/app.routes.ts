import { Routes } from '@angular/router';
import {DisplayContentComponent} from './display-content/display-content.component';
import {ChatComponent} from './chat/chat.component';
import {CodeProcessComponent} from './code-process/code-process.component';
import {FinishComponent} from './finish/finish.component';
import {SelectGiturlComponent} from './select-giturl/select-giturl.component';
import {CollectionsComponent} from './collections/collections.component';
import {DocsFilesComponent} from './docs-files/docs-files.component';
import {ProcessListComponent} from './process-list/process-list.component';
import {HomeComponent} from './home/home.component';
import {SideBarComponent} from './side-bar/side-bar.component';
import {HighlightComponent} from './highlight/highlight.component';


export const routes: Routes = [
  {path: 'collection-data', component: DisplayContentComponent },
  {path: 'chat', component: ChatComponent },
  {path: 'code-process', component: CodeProcessComponent},
  {path: 'docs-files', component: DocsFilesComponent},
  {path: 'finish', component: FinishComponent},
  {path: 'finish', component: FinishComponent},
  {path:'extract-url', component: SelectGiturlComponent},
  {path:'collections', component: CollectionsComponent},
  {path:'process', component: ProcessListComponent},
  {path:'home', component: HomeComponent},
  {path:'side-bar', component: SideBarComponent},
  {path:'h1', component: HighlightComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
