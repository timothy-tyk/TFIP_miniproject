import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatMessage } from 'src/app/models/chatmessage-model';
import { User } from 'src/app/models/user-model';
import { ChatService } from 'src/app/services/chat/chat.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  @Input() userInfo!: User;
  chatForm!: FormGroup;
  chatlog: ChatMessage[] = this.websocketSvc.messages;

  constructor(
    private fb: FormBuilder,
    private chatSvc: ChatService,
    private websocketSvc: WebsocketService
  ) {}
  ngOnInit(): void {
    this.websocketSvc.initializeConnection();
    this.initializeChatForm();
    // this.retrieveChatMessages();
  }

  initializeChatForm() {
    this.chatForm = this.fb.group({
      message: this.fb.control('', [Validators.required]),
    });
  }
  onSubmitMessage() {
    // const msg = this.chatForm.get('message')?.value;
    const msg = {
      email: this.userInfo.email,
      message: this.chatForm.get('message')?.value,
      location: 'lobby',
      timestamp: new Date().getTime(),
    };
    // this.chatSvc.submitChatMessage(msg).then((res) => console.log(res));
    this.websocketSvc.sendMessage(JSON.stringify(msg));
  }

  retrieveChatMessages() {
    this.chatSvc.getChatMessages('lobby').then((res) => {
      this.chatlog = res as ChatMessage[];
    });
  }
}
