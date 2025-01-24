import {Injectable} from '@angular/core';
import {
  RSocketClient,
  JsonSerializer,
  IdentitySerializer,
} from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import {Observable, Subject} from 'rxjs';
import {SimpleMessage} from "../models/simple-message";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Injectable({
  providedIn: 'root',
})
export class RSocketService {

  private client: RSocketClient<any, any>;
  private connection: any
  private messageSubject: Subject<SimpleMessage> = new Subject();

  constructor() {
    // Configuration du client RSocket
    this.client = new RSocketClient({
      serializers: {
        data: JsonSerializer,        // Sérialisation des données en JSON
        metadata: IdentitySerializer, // Pas de sérialisation pour les métadonnées
      },
      setup: {
        keepAlive: 10000,  // Envoie des messages keep-alive toutes les 10 secondes
        lifetime: 20000,   // Durée de vie de la connexion avant qu'elle ne soit fermée
        dataMimeType: 'application/json', // Type MIME des données (JSON)
        metadataMimeType: 'message/x.rsocket.routing.v0', // Type MIME des métadonnées pour le routage
      },
      transport: new RSocketWebSocketClient({
        url: 'ws://localhost:7000/rsocket',  // Connexion via WebSocket à cette URL
      }),
    });
  }

  // Méthode pour envoyer un message via RSocket et recevoir une réponse
  sendMessage(message: string) {
      this.connection.requestResponse({
        data: message, // Données du message envoyées
        metadata: String.fromCharCode('request-response'.length) + 'request-response', // Indique la route "request-response" côté serveur
      }).subscribe({
        onComplete: (response: any) => {
          this.messageSubject.next(response.data);  // Retourne la réponse du serveur au composant
        },
        onError: (error: any) => console.log(error), // En cas d'erreur
      });
  }

  connect() {
    // Etablissement de la connexion avec le serveur RSocket
    this.client.connect().subscribe({
      onComplete: (rsocket) => {
        console.log("connected");
        // Envoi d'un message et attente d'une réponse (request-response)
        this.connection = rsocket;
      },
      onError: (error) => console.log(error), // Gestion des erreurs lors de la connexion
    });
  }

  get $messageSubject(){
    return this.messageSubject.asObservable();
  }
}
