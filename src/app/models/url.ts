export class Url {
  id: string;
  url: string;
  active: boolean;
  loaded: boolean = true;

  constructor(id: string, url: string, active: boolean) {
    this.id = id;
    this.url = url;
    this.active = active;
  }
}
