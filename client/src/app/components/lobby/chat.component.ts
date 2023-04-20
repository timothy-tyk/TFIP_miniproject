import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatMessage } from 'src/app/models/chatmessage-model';
import { User } from 'src/app/models/user-model';
import { ChatService } from 'src/app/services/chat/chat.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() userInfo!: User;
  chatForm!: FormGroup;
  currentLocation: string = location.pathname;
  chatlog: ChatMessage[] = this.websocketSvc.messages.get('/lobby')!;
  msgSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private chatSvc: ChatService,
    private websocketSvc: WebsocketService
  ) {}
  ngOnInit(): void {
    // this.userInfo = JSON.parse(localStorage.getItem('userInfo')!) as User;
    this.websocketSvc.initializeConnection();
    this.initializeChatForm();
    this.msgSubscription = this.websocketSvc.messageAdded.subscribe(
      () => (this.chatlog = this.websocketSvc.messages.get('/lobby')!)
    );
  }
  ngOnDestroy(): void {
    console.log('disconnecting');
    this.websocketSvc.disconnect(this.currentLocation);
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

    this.websocketSvc.sendMessage(JSON.stringify(msg));
    this.initializeChatForm();
  }

  retrieveChatMessages() {
    this.chatSvc.getChatMessages('lobby').then((res) => {
      this.chatlog = res as ChatMessage[];
    });
  }
}
