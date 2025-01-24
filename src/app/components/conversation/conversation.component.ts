import {Component} from '@angular/core';
import {ConversationDTO} from "../../models/conversation";
import {ConversationService} from "../../services/conversation.service";
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserDTO} from "../../models/user";

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss'
})
export class ConversationComponent {

  currentUser: UserDTO | undefined;
  currentConversation: ConversationDTO | undefined;
  conversations: ConversationDTO[] = [];
  authForm: FormGroup;
  conversationForm: FormGroup;

  constructor(
    private readonly _conversationService: ConversationService,
    private readonly _authService: AuthService,
    private readonly _fb: FormBuilder,
  ) {
    this._conversationService.connect();
    this._authService.connect();
    this._authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.authForm = this._fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.conversationForm = this._fb.group({
      title: ['', [Validators.required]],
    })
  }

  getConversations() {
    this._conversationService.getAllConversation().subscribe({
      onNext: (result: any) => {
        this.conversations.push(result.data);
      },
      onSubscribe: (subscription: any) => {
        console.log("Subbed");
        subscription.request(2147483646);
      }
    });
  }

  submitAuth(action: "login" | "register") {
    this.authForm.markAllAsTouched();
    if (this.authForm.valid) {
      switch (action) {
        case "login":
          this._authService.login(this.authForm.value);
          console.log("logged in");
          break;
        case "register":
          this._authService.register(this.authForm.value);
          console.log("registered");
          break;
      }
    }
  }

  submitConversation(){
    this.conversationForm.markAllAsTouched();

    if(this.conversationForm.valid) {
      this._conversationService.addConversation(this.conversationForm.value);
    }
  }

  setConversation(conversation: ConversationDTO) {
    this.currentConversation = conversation;
  }
}
