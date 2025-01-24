import {Injectable} from '@angular/core';
import {IdentitySerializer, JsonSerializer, RSocketClient} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client";
import {UserDTO, UserForm} from "../models/user";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private client: RSocketClient<any, any>;
  private connection: any;
  private _currentUser$: BehaviorSubject<UserDTO | undefined> = new BehaviorSubject<UserDTO | undefined>(undefined);

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

  register(form: UserForm) {
    this.connection.fireAndForget({
      data: form,
      metadata: String.fromCharCode('register'.length) + 'register',
    })
  }

  login(form: UserForm) {
    this.connection.requestResponse({
      data: form,
      metadata: String.fromCharCode('login'.length) + 'login',
    }).subscribe({
      onComplete: (responce: any) => {
        console.log("logged");
        this._currentUser$.next(responce.data);
      }
    })
  }

  get currentUser(){
    return this._currentUser$.value;
  }

  get currentUser$(){
    return this._currentUser$.asObservable();
  }
}
