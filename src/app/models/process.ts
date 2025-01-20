export class Process {
  id: string;
  finished: boolean = false;
  end: number | null = null;
  curr: number | null = null;
  status: string | null = "";
  process_type: string;
  url: string;
  type: string;
  order: number | null = null;
  group: string | null = null;

  constructor(
    id: string,
    process_type: string,
    url: string,
    type: string,
    finished: boolean = false,
    end: number | null = null,
    curr: number | null = null,
    status: string | null = "",
    order: number | null = null,
    group: string | null = null
  ) {
    this.id = id;
    this.finished = finished;
    this.end = end;
    this.curr = curr;
    this.status = status;
    this.process_type = process_type;
    this.url = url;
    this.type = type;
    this.order = order;
    this.group = group;
  }
}
