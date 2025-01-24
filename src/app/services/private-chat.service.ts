import { Injectable } from '@angular/core';
import { RSocketClient, JsonSerializer, IdentitySerializer } from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import {Observable, Subject, Subscription} from 'rxjs';
import {PrivateMessage} from "../models/private-message";

@Injectable({
  providedIn: 'root',
})
export class PrivateChatService {
  private client: RSocketClient<any, any>;
  private connection: any;
  private messageStream: Subject<PrivateMessage> = new Subject();

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

  connect(){
    // Connexion au serveur RSocket
    this.client.connect().subscribe({
      onComplete: (rsocket) => {
        this.connection = rsocket;
        console.log('Connexion établie');
      },
      onError: (error) => console.error('Erreur de connexion :', error),
    });
  }

  // Méthode pour enregistrer un utilisateur
  registerUser(username: string) {
    this.connection.fireAndForget({
      data: {username},
      metadata: String.fromCharCode('register-private-chat'.length) + 'register-private-chat',
    });
  }

  // Méthode pour envoyer un message privé
  sendMessage(fromUser: string, toUser: string, message: string) {
    const payload = { fromUser, toUser, message };
    this.connection.fireAndForget({
      data: payload,
      metadata: String.fromCharCode('send-private-message'.length) + 'send-private-message',
    });
  }

  // Méthode pour recevoir les messages en flux
  receiveMessages(username: string) {
    this.connection.requestStream({
      data: {username},
      metadata: String.fromCharCode('private-chat'.length) + 'private-chat',
    }).subscribe({
      onNext: (response: any) => {
        this.messageStream.next(response.data); // Ajoute le message reçu au flux
      },
      onSubscribe: (subscription: any) => {
        console.log("Sub ok");
        subscription.request(2147483646);
      },
      onError: (error: any) => console.error('Erreur lors de la réception des messages :', error),
    });
  }

  get $messageStream(){
    return this.messageStream.asObservable();
  }
}
