import {Injectable} from '@angular/core';
import {
  RSocketClient,
  JsonSerializer,
  IdentitySerializer, encodeRoute, encodeCompositeMetadata, MESSAGE_RSOCKET_ROUTING,
} from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import {Observable, Subject} from 'rxjs';
import {Message} from "../models/message";

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private client: RSocketClient<any, any>;  // Le client RSocket
  private messageStream: Subject<Message> = new Subject();  // Flux pour les messages entrants
  private connection: any;

  constructor() {
    // Initialisation du client RSocket
    this.client = new RSocketClient({
      serializers: {
        data: JsonSerializer,  // Le client envoie et reçoit des données JSON
        metadata: IdentitySerializer,  // Les métadonnées ne sont pas modifiées (simple routage)
      },
      setup: {
        keepAlive: 10000,  // Intervalle pour envoyer des messages keep-alive toutes les 10 secondes
        lifetime: 20000,  // Durée de vie de la connexion RSocket avant expiration
        dataMimeType: 'application/json',  // Format des données envoyé et reçu : JSON
        metadataMimeType: 'message/x.rsocket.routing.v0',  // Format des métadonnées pour le routage
      },
      transport: new RSocketWebSocketClient({
        url: 'ws://localhost:7000/rsocket',  // Connexion via WebSocket à ce serveur
      }),
    });

    // Connexion au serveur et abonnement au flux de chat
    this.client.connect().subscribe({
      onComplete: (rsocket) => {
        this.connection = rsocket;
        // Abonnement à la route "chat" pour recevoir les messages
        this.connection.requestStream({
          metadata: String.fromCharCode('chat'.length) + 'chat'
        }).subscribe({
          onNext: (message: any) => {
            console.log(message)
            this.messageStream.next(message.data)
          },  // Ajouter chaque message reçu au flux
          onError: (error: any) => console.error(error), // Gérer les erreurs
          onSubscribe: (subscription: any) => {
            console.log("sub ok")
            subscription.request(2147483646);
          },
          onComplete: () => console.log("finish"),
        });
      },
      onError: (error) => console.error(error),  // Gérer les erreurs de connexion
    });
  }

  // Méthode pour envoyer un message
  sendMessage(message: string) {
    // Envoi du message à la route "send-message" sur le serveur
    this.connection.fireAndForget({
      data: message,  // Contenu du message à envoyer
      metadata: String.fromCharCode('send-message'.length) + 'send-message',  // Route de destination
    });
  }

  // Méthode pour s'abonner au flux de messages reçus
  receiveMessages(): Observable<Message> {
    return this.messageStream.asObservable();  // Renvoie un observable pour écouter les messages
  }
}
