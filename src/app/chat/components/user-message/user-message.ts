import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-user-message',
  standalone: true,
  templateUrl: './user-message.html',
  styleUrls: ['./user-message.css']
})
export class UserMessage {
  // Data for the component, can be made dynamic with @Input() if needed
  @Input() messageText = `Здраво, се мислам да земам Каско осигурување за мојот велосипед. Сакам да знам, доколку велосипедот ми биде украден додека е оставен заклучен пред кафуле, дали Каско осигурувањето ќе ја покрие штетата?`;
  timestamp = '14:21';
  userLabel = 'you';
  // Using a data URI for the avatar to keep the component self-contained for this example.
  // In a real app, this would likely come from an assets folder or a dynamic URL.

  constructor() { }
}
