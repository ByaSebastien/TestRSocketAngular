import { Component } from '@angular/core';
import {SimpleMessage} from "../../models/simple-message";
import {RSocketService} from "../../services/rsocket.service";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {

  response: SimpleMessage |undefined;

  constructor(private rsocketService: RSocketService) {
    this.rsocketService.$messageSubject.subscribe((e: SimpleMessage) => {
      this.response = e;
    });
  }

  sendMessage() {
    this.rsocketService.sendMessage('Hello RSocket');
  }

  connect(){
    this.rsocketService.connect();
  }
}
