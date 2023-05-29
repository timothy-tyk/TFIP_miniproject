import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatMessage } from 'src/app/models/chatmessage-model';
import { Friends } from 'src/app/models/friends-model';
import { User } from 'src/app/models/user-model';
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
  selectedUserEmail!: string;

  // Dialog
  dialogVisible: boolean = false;
  dialogInfo!: User;
  searchDialogVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private websocketSvc: WebsocketService,
    private userSvc: UserService
  ) {}
  ngOnInit(): void {
    this.websocketSvc.initializeConnection().subscribe((connected) => {
      this.msgSubscription = this.websocketSvc.messageAdded.subscribe(
        () => (this.chatlog = this.websocketSvc.messages.get('/lobby')!)
      );
      this.websocketSvc.onJoinLobby(this.userInfo);
    });
    this.initializeChatForm();
  }
  ngOnDestroy(): void {
    this.websocketSvc.disconnect(this.currentLocation);
  }

  initializeChatForm() {
    this.chatForm = this.fb.group({
      message: this.fb.control('', [Validators.required]),
    });
  }
  onSubmitMessage() {
    const msg: ChatMessage = {
      email: this.userInfo.email,
      message: this.chatForm.get('message')?.value,
      location: 'lobby',
      timestamp: new Date().getTime(),
      type: 'CHAT',
      display: true,
    };

    this.websocketSvc.sendMessage(msg);
    this.initializeChatForm();
  }

  showDialog(email: string) {
    this.selectedUserEmail = email;
  }
  closeDialog() {
    this.selectedUserEmail = null!;
  }

  addFriend(email: string) {
    const friends: Friends = {
      id: null,
      userEmail: this.userInfo.email,
      friendEmail: email,
    };
    this.userSvc
      .addFriend(friends)
      .then((res: any) => (this.friendsList = res as Friends[]));
  }

  onSearchClick() {
    this.searchDialogVisible = true;
  }
  onSearchClose() {
    this.searchDialogVisible = false;
  }
}
