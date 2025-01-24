import {Injectable} from '@angular/core';
import {IdentitySerializer, JsonSerializer, RSocketClient} from "rsocket-core";
import {connect, Subject} from "rxjs";
import {PrivateMessage} from "../models/private-message";
import RSocketWebSocketClient from "rsocket-websocket-client";
import {ConversationAsk, ConversationForm} from "../models/conversation";
import {MessageForm} from "../models/message";

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private client: RSocketClient<any, any>;
  private connection: any;

  constructor() {
    // Initialisation du client RSocket
    this.client = new RSocketClient({
      serializers: {
        data: JsonSerializer,
        metadata: IdentitySerializer,
      },
      setup: {
        keepAlive: 10000, // Envoi de pings pour garder la connexion ouverte
        lifetime: 20000, // Durée de vie maximale de la connexion
        dataMimeType: 'application/json',
        metadataMimeType: 'message/x.rsocket.routing.v0',
      },
      transport: new RSocketWebSocketClient({
        url: 'ws://localhost:7000/rsocket', // Adresse du serveur RSocket
      }),
    });
  }

  connect() {
    // Connexion au serveur RSocket
    this.client.connect().subscribe({
      onComplete: (rsocket) => {
        this.connection = rsocket;
        console.log('Connexion établie');
      },
      onError: (error) => console.error('Erreur de connexion :', error),
    });
  }

  addConversation(form: ConversationForm) {
    this.connection.fireAndForget({
      data: form,
      metadata: String.fromCharCode('send-conversation'.length) + 'send-conversation',
    });
  }

  getAllConversation() {
    return this.connection.requestStream({
      metadata: String.fromCharCode('conversation'.length) + 'conversation',
    })
  }

  sendMessage(message: MessageForm){
    this.connection.fireAndForget({
      data: message,
      metadata: String.fromCharCode('send-message'.length) + 'send-message',
    })
  }

  getMessageFromConversation(conversation: ConversationAsk) {
    return this.connection.requestStream({
      data: conversation,
      metadata: String.fromCharCode('message-conversation'.length) + 'message-conversation',
    })
  }
}
