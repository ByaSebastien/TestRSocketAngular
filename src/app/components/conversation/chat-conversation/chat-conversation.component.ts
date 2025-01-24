import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ConversationDTO} from "../../../models/conversation";
import {ConversationService} from "../../../services/conversation.service";
import {UserDTO} from "../../../models/user";
import {AuthService} from "../../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MessageDTO} from "../../../models/message";

@Component({
  selector: 'app-chat-conversation',
  templateUrl: './chat-conversation.component.html',
  styleUrl: './chat-conversation.component.scss'
})
export class ChatConversationComponent implements OnChanges, OnDestroy, OnInit {

  @Input({required: true})
  conversation!: ConversationDTO;
  currentUser: UserDTO | undefined;
  subscribtion: any;

  messages: MessageDTO[] = [];

  messageForm: FormGroup;

  constructor(
    private readonly _conversationService: ConversationService,
    private readonly _authService: AuthService,
    private readonly _fb: FormBuilder,
  ) {
    this._authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.messageForm = this._fb.group({
      content: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.getMessages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversation'] && !changes['conversation'].firstChange) {
      this.messages = [];
      this.subscribtion.cancel();
      this.getMessages();
    }
  }

  getMessages() {
    this._conversationService.getMessageFromConversation({conversationId: this.conversation.id}).subscribe({
      onSubscribe: (subscription: any) => {
        this.subscribtion = subscription;
        console.log("sub to conv " + this.conversation.title)
        subscription.request(2147483646);
      },
      onNext: (result: any) => {
        console.log(result.data);
        this.messages.push(result.data);
      }
    });
  }

  sendMessage() {
    this.messageForm.markAllAsTouched();

    if (this.messageForm.valid) {
      this._conversationService.sendMessage({
        content: this.messageForm.get('content')?.value!,
        userId: this.currentUser!.id,
        conversationId: this.conversation.id
      });
    }
  }

  ngOnDestroy(): void {
    this.subscribtion.cancel();
  }
}
