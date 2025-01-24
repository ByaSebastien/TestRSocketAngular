import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import {ChatChannelService} from "../../services/chat-channel.service";
import {SimpleMessage} from "../../models/simple-message";

@Component({
  selector: 'app-chat',
  templateUrl: 'chat-channel.component.html',
  styleUrls: ['chat-channel.component.scss']
})
export class ChatChannelComponent implements OnInit {
  public messages$!: Observable<SimpleMessage>;  // Observable des messages reçus
  private inputMessages$ = new Subject<SimpleMessage>();  // Flux des messages envoyés par l'utilisateur

  constructor(private chatService: ChatChannelService) {}

  ngOnInit() {
    this.messages$ = this.chatService.startChat();
  }

  // Méthode pour envoyer un message depuis le champ d'input
  sendMessage(message: string) {
    this.inputMessages$.next({content: message});
  }
}
