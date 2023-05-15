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
import { Friends } from 'src/app/models/friends-model';
import { Room } from 'src/app/models/room-model';
import { User } from 'src/app/models/user-model';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UserService } from 'src/app/services/user/user.service';
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
  friendsList!: Friends[];

  // Dialog
  dialogVisible: boolean = false;
  dialogInfo!: User;

  constructor(
    private fb: FormBuilder,
    private chatSvc: ChatService,
    private websocketSvc: WebsocketService,
    private userSvc: UserService
  ) {}
  ngOnInit(): void {
    this.websocketSvc.initializeConnection();
    this.initializeChatForm();
    this.msgSubscription = this.websocketSvc.messageAdded.subscribe(
      () => (this.chatlog = this.websocketSvc.messages.get('/lobby')!)
    );
    this.websocketSvc.onJoinLobby(this.userInfo);
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
    const msg: ChatMessage = {
      email: this.userInfo.email,
      message: this.chatForm.get('message')?.value,
      location: 'lobby',
      timestamp: new Date().getTime(),
      type: 'CHAT',
    };

    this.websocketSvc.sendMessage(msg);
    this.initializeChatForm();
  }

  retrieveChatMessages() {
    this.chatSvc.getChatMessages('lobby').then((res) => {
      this.chatlog = res as ChatMessage[];
    });
  }

  showDialog(email: string) {
    console.log('clicked');
    this.userSvc
      .getUserDetails(email)
      .then((res) => (this.dialogInfo = res as User))
      .then(() => (this.dialogVisible = true));
  }

  addFriend(email: string) {
    console.log(email);
    const friends: Friends = {
      id: null,
      userEmail: this.userInfo.email,
      friendEmail: email,
    };
    this.userSvc
      .addFriend(friends)
      .then((res: any) => (this.friendsList = res as Friends[]));
  }
}
