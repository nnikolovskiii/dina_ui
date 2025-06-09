import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-video-screen',
  standalone: true,
  imports: [],
  templateUrl: './video-screen.component.html',
  styleUrl: './video-screen.component.css'
})
export class VideoScreenComponent implements AfterViewInit {
  @ViewChild('myVideoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      const videoElement = this.videoPlayer.nativeElement;

      // Ensure video is muted for autoplay
      videoElement.muted = true;

      // Set loop
      videoElement.loop = true;

      // Attempt to play the video
      const playPromise = videoElement.play();

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Autoplay was prevented:', error);
          // Optionally, you could show a play button here for the user to initiate playback.
        });
      }
    } else {
      console.error('Video element not found!');
    }
  }
}
