import { Component } from '@angular/core';
import {RSocketService} from "./services/rsocket.service";
import {Message} from "./models/message";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'fend';
}
