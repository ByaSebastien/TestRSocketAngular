import { Component } from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {Message} from "../../models/message";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  messages: Message[] = [];  // Tableau pour stocker les messages
  newMessage: string = '';  // Message en cours d'écriture

  constructor(private chatService: ChatService) {
    // S'abonner aux messages reçus via le service
    this.chatService.receiveMessages().subscribe((message) => {
      console.log('test')
      this.messages.push(message);  // Ajouter chaque nouveau message au tableau
    });
  }

  // Méthode pour envoyer un message
  sendMessage() {
    if (this.newMessage.trim()) {  // Vérifie que le message n'est pas vide
      this.chatService.sendMessage(this.newMessage);  // Envoie le message via le service
      this.newMessage = '';  // Réinitialise le champ texte
    }
  }
}
