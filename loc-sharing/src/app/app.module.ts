import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

import { AppComponent } from './app.component';
import { LibrariesComponent } from './libraries/libraries.component';
import { ReserveComponent } from './reserve/reserve.component';
import { LibraryDetailComponent } from './library-detail/library-detail.component';
import { AppRoutingModule } from './/app-routing.module';
import { ConfirmComponent } from './confirm/confirm.component';


@NgModule({
  declarations: [
    AppComponent,
    LibrariesComponent,
    ReserveComponent,
    LibraryDetailComponent,
    ConfirmComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
