import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatMessage } from 'src/app/models/chatmessage-model';
import { Room } from 'src/app/models/room-model';
import { User } from 'src/app/models/user-model';
import { RoomService } from 'src/app/services/room/room.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';

@Component({
  selector: 'app-room-chat',
  templateUrl: './room-chat.component.html',
  styleUrls: ['./room-chat.component.css'],
})
export class RoomChatComponent implements OnInit, AfterViewInit, OnDestroy {
  userInfo!: User;
  @Input() roomId!: string;
  chatForm!: FormGroup;
  currentLocation: string = location.pathname.replace('/rooms', '');
  chatlog: ChatMessage[] = this.websocketSvc.messages.get(
    this.currentLocation
  )!;

  msgSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private roomSvc: RoomService,
    private websocketSvc: WebsocketService
  ) {}
  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo')!) as User;
    this.initializeChat();
    this.initializeChatForm();
    this.msgSubscription = this.websocketSvc.messageAdded.subscribe(
      () =>
        (this.chatlog = this.websocketSvc.messages.get(this.currentLocation)!)
    );
    this.initChatRoom();
  }
  initializeChat() {
    this.websocketSvc.initializeConnection();
  }

  initializeChatForm() {
    this.chatForm = this.fb.group({
      message: this.fb.control('', [Validators.required]),
    });
  }
  ngAfterViewInit(): void {}

  onSubmitMessage() {
    const msg: ChatMessage = {
      email: this.userInfo.email,
      message: this.chatForm.get('message')?.value,
      location: this.roomId,
      timestamp: new Date().getTime(),
      type: 'CHAT',
      display: true,
    };
    this.websocketSvc.sendMessage(msg);
    this.initializeChatForm();
  }

  ngOnDestroy(): void {
    this.websocketSvc.onLeaveRoom(this.userInfo, this.roomId).then(() => {
      this.websocketSvc.disconnect(`/rooms/${this.roomId}`);
    });
  }

  initChatRoom() {
    this.roomSvc
      .getRoom(this.roomId)
      .then((res) => this.websocketSvc.initializeChatRoom(res as Room))
      .then(() => this.websocketSvc.onJoinRoom(this.userInfo));
  }
}
