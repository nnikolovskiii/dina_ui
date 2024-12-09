export class Folder {
  id: string;
  prev: string;
  next: string;
  is_folder: boolean;
  url: string;
  color: string;

  constructor(id: string, prev: string, next: string, is_folder: boolean, url: string, color: string) {
    this.id = id;
    this.prev = prev;
    this.next = next;
    this.is_folder = is_folder;
    this.url = url;
    this.color = color;
  }
}
