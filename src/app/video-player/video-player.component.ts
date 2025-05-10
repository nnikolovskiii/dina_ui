import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Import CommonModule for *ngIf etc.
import {YouTubePlayer, YouTubePlayerModule} from '@angular/youtube-player'; // <-- Import YouTubePlayerModule

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [
    YouTubePlayer,
    CommonModule,
  ],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent {

  @Input() youtubeLink: string = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  @Input() previewImageUrl: string = 'https://via.placeholder.com/800x450/cccccc/eeeeee?text=Video+Thumbnail';

  // Change type from 'string | null' to 'string | undefined'
  videoId: string | undefined = undefined; // Initialize with undefined
  showPreview = true;

  playerVars = {
    autoplay: 1,
    modestbranding: 1,
    rel: 0
  };
  playerWidth: number = 870;
  playerHeight: number = 500;

  private apiLoaded = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Assign the result (which is now string | undefined)
    this.videoId = this.extractVideoId(this.youtubeLink);
    this.loadYouTubeApi();
  }

  ngOnDestroy(): void {
    // Cleanup if necessary
  }

  loadYouTubeApi(): void {
    if (typeof document !== 'undefined' && !this.apiLoaded && !window['YT']) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    } else if (typeof window !== 'undefined' && window['YT']) {
      this.apiLoaded = true;
    }
  }

  // Change return type annotation and return value
  extractVideoId(url: string): string | undefined { // <-- Change return type here
    if (!url) return undefined; // <-- Return undefined instead of null
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    // Return the ID (string) or undefined if no match
    return (match && match[2].length === 11) ? match[2] : undefined; // <-- Return undefined instead of null
  }

  playVideo(): void {
    // No change needed here, check for truthiness still works (undefined is falsy)
    if (this.videoId) {
      this.showPreview = false;
      this.cdr.markForCheck();
    } else {
      console.error("Cannot play video: Invalid or missing YouTube link.");
    }
  }
}
