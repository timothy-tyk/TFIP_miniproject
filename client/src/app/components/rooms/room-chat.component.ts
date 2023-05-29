import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { ChatMessage } from 'src/app/models/chatmessage-model';
import { Friends } from 'src/app/models/friends-model';
import { Room } from 'src/app/models/room-model';
import { User } from 'src/app/models/user-model';
import { RoomService } from 'src/app/services/room/room.service';
import { UserService } from 'src/app/services/user/user.service';
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
  @Output() showPlaylist: Subject<string> = new Subject<string>();
  selectedUserEmail!: string;

  msgSubscription!: Subscription;

  // Dialog
  userDialogVisible: boolean = false;
  userDialogInfo!: User;

  constructor(
    private fb: FormBuilder,
    private roomSvc: RoomService,
    private websocketSvc: WebsocketService,
    private userSvc: UserService
  ) {}
  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo')!) as User;
    this.websocketSvc.initializeConnection().subscribe((connected) => {
      if (connected) {
        this.initChatRoom();
        this.msgSubscription = this.websocketSvc.messageAdded.subscribe(
          () =>
            (this.chatlog = this.websocketSvc.messages.get(
              this.currentLocation
            )!)
        );
      }
    });
    this.initializeChatForm();
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

  onShowPlaylistClick() {
    this.showPlaylist.next('');
  }

  showUserDialog(email: string) {
    this.selectedUserEmail = email;
  }
  closeUserDialog() {
    this.selectedUserEmail = null!;
  }

  addFriend(email: string) {
    const friends: Friends = {
      id: null,
      userEmail: this.userInfo.email,
      friendEmail: email,
    };
    this.userSvc.addFriend(friends).then((res: any) => console.log(res));
  }
}
