import {Component} from '@angular/core';
import {PrivateChatService} from "../../services/private-chat.service";
import {PrivateMessage} from "../../models/private-message";

@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrl: './private-chat.component.scss'
})
export class PrivateChatComponent {

  username: string = '';
  target: string = '';
  message: string = '';
  messages: PrivateMessage[] = [];

  constructor(
    private chatService: PrivateChatService
  ) {
    this.chatService.$messageStream.subscribe(m => this.messages.push(m));
  }

  connect() {
    this.chatService.connect();
  }

  register() {
    if (this.username.trim()) {
      this.chatService.registerUser(this.username);
      this.chatService.receiveMessages(this.username);
    }
  }

  sendMessage() {
    this.messages.push({fromUser: this.username, toUser: this.target, message: this.message});
    this.chatService.sendMessage(this.username, this.target, this.message);
  }

}
