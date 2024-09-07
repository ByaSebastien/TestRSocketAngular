import { Component } from '@angular/core';
import {Message} from "../../models/message";
import {RSocketService} from "../../services/rsocket.service";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {

  response: Message |undefined;

  constructor(private rsocketService: RSocketService) {}

  sendMessage() {
    this.rsocketService.sendMessage('Hello RSocket').subscribe({
      next: (data) => { this.response = data; },
      error: (error) => { console.error('Erreur RSocket', error); }
    });
  }
}
