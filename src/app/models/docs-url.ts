export class DocsUrl {
  id: string;
  url: string;
  active: boolean;

  constructor(id: string, url: string, active: boolean) {
    this.id = id;
    this.url = url;
    this.active = active;
  }
}
