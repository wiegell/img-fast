import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ImgFastComponent } from './img-fast/img-fast.component';
import { ImgFastService } from './img-fast.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ImgFastComponent
  ],
  imports: [
    BrowserModule, HttpClientModule
  ],
  providers: [ImgFastService],
  bootstrap: [AppComponent]
})
export class AppModule { }
