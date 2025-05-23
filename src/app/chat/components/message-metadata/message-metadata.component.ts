import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-message-metadata',
  standalone: true,
  imports: [],
  templateUrl: './message-metadata.component.html',
  styleUrl: './message-metadata.component.css'
})
export class MessageMetadataComponent {
  @Input() timestamp = '14:21';
  @Input() userLabel = 'you';
  @Input() avatar = '../../../../assets/p2.jpeg';

}
