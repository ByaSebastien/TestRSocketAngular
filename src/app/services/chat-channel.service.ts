import { Injectable } from '@angular/core';
import { RSocketClient, JsonSerializer, IdentitySerializer } from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import { Observable, Subject } from 'rxjs';
import {SimpleMessage} from "../models/simple-message";

@Injectable({
  providedIn: 'root',
})
export class ChatChannelService {
  private client: RSocketClient<any, any>;
  private connection: any;
  private inputMessages$ = new Subject<SimpleMessage>();  // Flux pour envoyer des messages
  private messageStream$ = new Subject<SimpleMessage>();  // Flux pour recevoir des messages

  constructor() {
    // Configuration du client RSocket
    this.client = new RSocketClient({
      serializers: {
        data: JsonSerializer,
        metadata: IdentitySerializer,
      },
      setup: {
        keepAlive: 10000,
        lifetime: 20000,
        dataMimeType: 'application/json',
        metadataMimeType: 'message/x.rsocket.routing.v0',
      },
      transport: new RSocketWebSocketClient({ url: 'ws://localhost:7000/rsocket' }),
    });
  }

  // Méthode pour démarrer la communication bidirectionnelle
  startChat(): Observable<SimpleMessage> {
    this.client.connect().subscribe({
      onComplete: (rsocket) => {
        this.connection = rsocket;
        this.connection.requestChannel({
          metadata: String.fromCharCode('chat-channel'.length) + 'chat-channel',
          data: this.inputMessages$.asObservable(),
        }).subscribe({
          onNext: (response: any) => {
            console.log('Message reçu du serveur:', response.data);
            this.messageStream$.next(response.data);  // Stocke les messages reçus
          },
          onError: (error: any) => console.error('Erreur:', error),
          onSubscribe: (subscription: any) => {
            console.log('sub')
            // subscription.request(10);  // Demande les messages
          },
        });
      },
      onError: (error) => {
        console.error('Erreur de connexion RSocket:', error);
      },
    });
    return this.messageStream$.asObservable();  // Retourne les messages reçus
  }

  // Méthode pour envoyer un message
  sendMessage(message: SimpleMessage) {
    this.inputMessages$.next(message);  // Envoie le message au serveur
  }
}
