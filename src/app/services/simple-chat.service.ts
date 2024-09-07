import {Injectable} from '@angular/core';
import {
  RSocketClient,
  JsonSerializer,
  IdentitySerializer, encodeRoute, encodeCompositeMetadata, MESSAGE_RSOCKET_ROUTING,
} from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import {Observable, Subject} from 'rxjs';
import {SimpleMessage} from "../models/simple-message";

@Injectable({
  providedIn: 'root',
})
export class SimpleChatService {
  private client: RSocketClient<any, any>;  // Le client RSocket
  private messageStream: Subject<SimpleMessage> = new Subject();  // Flux pour les messages entrants
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
  }

  connect(){
    // Connexion au serveur et abonnement au flux de simple-chat
    this.client.connect().subscribe({
      onComplete: (rsocket) => {
        console.log('connected');
        this.connection = rsocket;
      },
      onError: (error) => console.error(error),  // Gérer les erreurs de connexion
    });
  }

  subscribe(){
    // Abonnement à la route "simple-chat" pour recevoir les messages
    this.connection.requestStream({
      metadata: String.fromCharCode('simple-chat'.length) + 'simple-chat'
    }).subscribe({
      onNext: (message: any) => {
        console.log(message);
        message.data.content.replace('"', '',true);
        this.messageStream.next(message.data);
      },  // Ajouter chaque message reçu au flux
      onError: (error: any) => {
        console.error(error)  // Gérer les erreurs
        this.client.close();
        this.handleReconnection();
      },
      onSubscribe: (subscription: any) => {
        console.log("sub ok")
        subscription.request(2147483646); // Max possible
        // subscription.request(10); // Limite à 10 messages à la fois
      },
      onComplete: () => console.log("finish"),
    });
  }

  // Gestion de la reconnexion
  handleReconnection() {
    console.log("Tentative de reconnexion...");
    setTimeout(() => {
      this.reconnect();  // Réessaye de se connecter après un délai
    }, 5000); // Par exemple, un délai de 5 secondes
  }

  reconnect() {
    // Logique de reconnexion
    this.client.connect().then(() => {
      this.subscribe();
    });
  }

  // Méthode pour envoyer un message
  sendMessage(message: SimpleMessage) {
    // Envoi du message à la route "send-message" sur le serveur
    this.connection.fireAndForget({
      data: message,  // Contenu du message à envoyer
      metadata: String.fromCharCode('send-simple-message'.length) + 'send-simple-message',  // Route de destination
    });
  }

  // Méthode pour s'abonner au flux de messages reçus
  receiveMessages(): Observable<SimpleMessage> {
    return this.messageStream.asObservable();  // Renvoie un observable pour écouter les messages
  }
}
