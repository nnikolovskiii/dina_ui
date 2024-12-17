export class Process {
  finished: boolean
  end: number
  curr: number
  process_type: string
  url: string
  type: string

  constructor(finished: boolean, end: number, curr: number, process_type: string, url: string, type: string) {
    this.finished = finished;
    this.end = end;
    this.curr = curr;
    this.process_type = process_type;
    this.url = url;
    this.type = type;
  }
}
