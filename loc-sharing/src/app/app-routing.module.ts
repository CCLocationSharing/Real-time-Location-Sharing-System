import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { LibrariesComponent }    from './libraries/libraries.component';
import { ReserveComponent }      from './reserve/reserve.component';
import { ConfirmComponent }      from './confirm/confirm.component';
import { LibraryDetailComponent} from './library-detail/library-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/libraries', pathMatch: 'full' },
  { path: 'detail/:id', component: LibraryDetailComponent },
  { path: 'libraries', component: LibrariesComponent },
  { path: 'reserve', component: ReserveComponent },
  { path: 'confirm', component: ConfirmComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}