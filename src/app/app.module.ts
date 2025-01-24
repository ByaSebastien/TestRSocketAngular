import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './components/test/test.component';
import { SimpleChatComponent } from './components/simple-chat/simple-chat.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { PrivateChatComponent } from './components/private-chat/private-chat.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { ChatConversationComponent } from './components/conversation/chat-conversation/chat-conversation.component';
import {ChatChannelComponent} from "./components/chat-channel/chat-channel.component";

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    SimpleChatComponent,
    PrivateChatComponent,
    ConversationComponent,
    ChatConversationComponent,
    ChatChannelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
