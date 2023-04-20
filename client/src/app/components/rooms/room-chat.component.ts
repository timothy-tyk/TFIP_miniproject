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
import { User } from 'src/app/models/user-model';
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
    const msg = {
      email: this.userInfo.email,
      message: this.chatForm.get('message')?.value,
      location: this.roomId,
      timestamp: new Date().getTime(),
    };

    this.websocketSvc.sendMessage(JSON.stringify(msg));
    this.initializeChatForm();
  }

  ngOnDestroy(): void {
    console.log('disconnecting from room');
    this.websocketSvc.disconnect(location.pathname);
  }
}
