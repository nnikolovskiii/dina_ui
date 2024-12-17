export class Link {
  id: string;
  prev_link: string;
  link: string;
  base_url: string;
  color: string;
  is_parent: boolean;


  constructor(
    id: string,
    prev_link: string,
    link: string,
    base_url: string,
    color: string,
    is_parent: boolean
) {
    this.id = id;
    this.prev_link = prev_link;
    this.link = link;
    this.base_url = base_url;
    this.color = color;
    this.is_parent = is_parent;
  }
}
