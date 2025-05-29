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

      // Make sure video is not paused and ready to play
      videoElement.onloadeddata = () => {
        this.playVideo(videoElement);
      };

      // If the video is already loaded, try to play it immediately
      if (videoElement.readyState >= 2) {
        this.playVideo(videoElement);
      }

      // Add event listener for when video ends to ensure looping works properly
      videoElement.onended = () => {
        this.playVideo(videoElement);
      };
    } else {
      console.error('Video element not found!');
    }
  }

  private playVideo(videoElement: HTMLVideoElement) {
    // Attempt to play programmatically
    const playPromise = videoElement.play();

    if (playPromise !== undefined) {
      playPromise.then(_ => {
        // Autoplay started or video.play() was successful!
        console.log('Video playback initiated successfully.');
      }).catch(error => {
        // Autoplay was prevented.
        console.error('Error attempting to play video:', error);
      });
    }
  }
}
