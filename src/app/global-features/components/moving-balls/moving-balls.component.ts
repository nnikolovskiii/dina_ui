import { Component, ElementRef, OnInit, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Point {
  x: number;
  y: number;
  size: number;
  colorType: 'purple' | 'cyan';
  velocityX: number;
  velocityY: number;
  originalSize: number;
}

@Component({
  selector: 'app-moving-points',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moving-balls.component.html',
  styleUrls: ['./moving-balls.component.css']
})
export class MovingBallsComponent implements OnInit, AfterViewInit {
  @ViewChild('container') containerRef!: ElementRef;

  points: Point[] = [];
  private containerWidth = 0;
  private containerHeight = 0;
  private containerInitialized = false;
  private mousePosX = 0;
  private mousePosY = 0;
  private animationFrameId: number | null = null;

  constructor() {
    // Initialize with the original 3 points
    this.points = [
      { x: 100, y: 100, size: 40, colorType: 'purple', velocityX: 0.2, velocityY: 0.3, originalSize: 40 },
      { x: 200, y: 150, size: 30, colorType: 'cyan', velocityX: -0.3, velocityY: 0.2, originalSize: 30 },
      { x: 300, y: 200, size: 50, colorType: 'purple', velocityX: 0.1, velocityY: -0.3, originalSize: 50 }
    ];
  }

  ngOnInit() {
    // Add more points for a better visual effect
    this.addMorePoints(12);
  }

  ngAfterViewInit() {
    // Set container dimensions and reposition points after view is initialized
    setTimeout(() => {
      if (this.containerRef && this.containerRef.nativeElement) {
        this.containerWidth = this.containerRef.nativeElement.clientWidth;
        this.containerHeight = this.containerRef.nativeElement.clientHeight;
        this.containerInitialized = true;

        // Reposition all points within container bounds
        this.points.forEach(point => {
          point.x = Math.random() * (this.containerWidth - point.size);
          point.y = Math.random() * (this.containerHeight - point.size);
        });

        // Start animation loop
        this.startAnimation();
      }
    });
  }

  private startAnimation() {
    const animate = () => {
      this.updatePointsPosition();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    animate();
  }

  private updatePointsPosition() {
    if (!this.containerInitialized) return;

    this.points.forEach(point => {
      // Apply slight natural movement
      point.x += point.velocityX;
      point.y += point.velocityY;

      // Handle wall collisions
      if (point.x <= 0 || point.x >= this.containerWidth - point.size) {
        point.velocityX *= -1;
        point.x = Math.max(0, Math.min(this.containerWidth - point.size, point.x));
      }

      if (point.y <= 0 || point.y >= this.containerHeight - point.size) {
        point.velocityY *= -1;
        point.y = Math.max(0, Math.min(this.containerHeight - point.size, point.y));
      }

      // Apply mouse influence if mouse has been moved
      if (this.mousePosX > 0 && this.mousePosY > 0) {
        const dx = this.mousePosX - (point.x + point.size/2);
        const dy = this.mousePosY - (point.y + point.size/2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
          // Close to mouse - move away
          const repelStrength = (200 - distance) / 200;
          const angle = Math.atan2(dy, dx);

          // Move away from mouse with smooth acceleration
          point.velocityX -= Math.cos(angle) * repelStrength * 0.3;
          point.velocityY -= Math.sin(angle) * repelStrength * 0.3;

          // Limit max velocity
          const maxVelocity = 3;
          const currentVelocity = Math.sqrt(point.velocityX * point.velocityX + point.velocityY * point.velocityY);
          if (currentVelocity > maxVelocity) {
            point.velocityX = (point.velocityX / currentVelocity) * maxVelocity;
            point.velocityY = (point.velocityY / currentVelocity) * maxVelocity;
          }

          // Change size based on proximity to mouse
          point.size = point.originalSize * (1 - repelStrength * 0.2);
        } else if (distance < 400) {
          // Medium distance - gently attracted to mouse
          const attractStrength = (400 - distance) / 400 * 0.05;
          const angle = Math.atan2(dy, dx);

          point.velocityX += Math.cos(angle) * attractStrength;
          point.velocityY += Math.sin(angle) * attractStrength;

          // Gradually return to original size
          point.size = point.originalSize * (0.8 + (distance - 200) / 200 * 0.2);
        } else {
          // Far from mouse - slowly return to original size
          point.size += (point.originalSize - point.size) * 0.05;

          // And slow down
          point.velocityX *= 0.98;
          point.velocityY *= 0.98;
        }
      }
    });
  }

  private addMorePoints(count: number) {
    const colorTypes: ('purple' | 'cyan')[] = ['purple', 'cyan'];

    for (let i = 0; i < count; i++) {
      const size = Math.random() * 30 + 20; // Random size between 20 and 50
      this.points.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: size,
        originalSize: size,
        colorType: colorTypes[i % 2], // Alternate between the two colors
        velocityX: (Math.random() - 0.5) * 0.6, // Random velocity between -0.3 and 0.3
        velocityY: (Math.random() - 0.5) * 0.6
      });
    }
  }

  onMouseMove(event: MouseEvent) {
    if (!this.containerInitialized || !this.containerRef) return;

    // Get container position
    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    this.mousePosX = event.clientX - rect.left;
    this.mousePosY = event.clientY - rect.top;
  }

  @HostListener('window:resize')
  onResize() {
    if (this.containerRef && this.containerRef.nativeElement) {
      this.containerWidth = this.containerRef.nativeElement.clientWidth;
      this.containerHeight = this.containerRef.nativeElement.clientHeight;

      // Make sure points stay within bounds after resize
      this.points.forEach(point => {
        point.x = Math.min(this.containerWidth - point.size, point.x);
        point.y = Math.min(this.containerHeight - point.size, point.y);
      });
    }
  }

  ngOnDestroy() {
    // Clean up animation frame when component is destroyed
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
