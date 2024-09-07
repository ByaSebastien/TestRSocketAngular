import { Component } from '@angular/core';
import {SimpleChatService} from "../../services/simple-chat.service";
import {SimpleMessage} from "../../models/simple-message";

@Component({
  selector: 'app-simple-chat',
  templateUrl: './simple-chat.component.html',
  styleUrl: './simple-chat.component.scss'
})
export class SimpleChatComponent {
  messages: SimpleMessage[] = [];  // Tableau pour stocker les messages
  newMessage: string = '';  // Message en cours d'écriture

  constructor(private chatService: SimpleChatService) {
    // S'abonner aux messages reçus via le service
    this.chatService.receiveMessages().subscribe((message) => {
      console.log('test')
      this.messages.push(message);  // Ajouter chaque nouveau message au tableau
    });
  }

  connect(){
    this.chatService.connect();
  }

  subscribe(){
    this.chatService.subscribe();
  }

  // Méthode pour envoyer un message
  sendMessage() {
    if (this.newMessage.trim()) {  // Vérifie que le message n'est pas vide
      this.chatService.sendMessage({content: this.newMessage});  // Envoie le message via le service
      this.newMessage = '';  // Réinitialise le champ texte
    }
  }
}
