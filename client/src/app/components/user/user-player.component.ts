import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-user-player',
  templateUrl: './user-player.component.html',
  styleUrls: ['./user-player.component.css'],
})
export class UserPlayerComponent implements OnChanges {
  trackIndex: number = 0;
  @Input() trackUrl!: string;
  IFrameHTMLContainer!: HTMLElement;
  IFrameHTMLElement!: HTMLIFrameElement;
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trackUrl'] && this.trackUrl != undefined) {
      this.createIFrame();
    }
    if (changes['trackUrl'] && !changes['trackUrl'].firstChange) {
      this.changeTrack();
    }
  }

  async createIFrame() {
    const iFrameScript = document.createElement('script');
    iFrameScript.src = 'https://open.spotify.com/embed-podcast/iframe-api/v1';
    iFrameScript.addEventListener('load', (e) => {
      this.initializePlayer();
    });
    document.head.appendChild(iFrameScript);
  }
  initializePlayer() {
    // @ts-ignore
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      const iframeContainer = document.getElementById('embed-iframe');
      this.IFrameHTMLContainer = iframeContainer!;
      const iframeElement = document.createElement('iframe');
      const options = {
        uri: `${this.trackUrl}`,
        height: 100,
        width: 340,
      };
      iframeElement.src = `https://open.spotify.com/embed/track/${options.uri}`;
      iframeElement.width = `${options.width}`;
      iframeElement.height = `${options.height}`;
      iframeElement.frameBorder = '0';
      iframeElement.allow = 'encrypted-media';
      this.IFrameHTMLElement = iframeElement;
      iframeContainer!.appendChild(iframeElement);

      // @ts-ignore
      const callback = (EmbedController) => {
        EmbedController.addListener('playback_update', (e: any) => {
          console.log(e);
        });
        EmbedController.addListener('ready', () => {
          console.log('ready');
        });
        IFrameAPI.createController(iframeElement, options, callback);
        console.log('controller created');
      };
    };
  }

  changeTrack() {
    this.IFrameHTMLElement.remove();
    const iframeElement = document.createElement('iframe');
    const options = {
      uri: `${this.trackUrl}`,
      height: 100,
      width: 340,
    };
    iframeElement.src = `https://open.spotify.com/embed/track/${options.uri}`;
    iframeElement.width = `${options.width}`;
    iframeElement.height = `${options.height}`;
    iframeElement.frameBorder = '0';
    iframeElement.allow = 'encrypted-media';
    this.IFrameHTMLElement = iframeElement;
    this.IFrameHTMLContainer.appendChild(iframeElement);
  }
}
