import {Component, Input} from '@angular/core';
import {MessageMetadataComponent} from '../message-metadata/message-metadata.component';

@Component({
  selector: 'app-user-message',
  standalone: true,
  templateUrl: './user-message.html',
  imports: [
    MessageMetadataComponent
  ],
  styleUrls: ['./user-message.css']
})
export class UserMessage {
  @Input() messageText = `Здраво, се мислам да земам Каско осигурување за мојот велосипед. Сакам да знам, доколку велосипедот ми биде украден додека е оставен заклучен пред кафуле, дали Каско осигурувањето ќе ја покрие штетата?`;
  @Input() timestamp = '14:21';
  @Input() userLabel = 'you';


  constructor() { }
}
