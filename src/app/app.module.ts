import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './components/test/test.component';
import { SimpleChatComponent } from './components/simple-chat/simple-chat.component';
import {FormsModule} from "@angular/forms";
import { PrivateChatComponent } from './components/private-chat/private-chat.component';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    SimpleChatComponent,
    PrivateChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
