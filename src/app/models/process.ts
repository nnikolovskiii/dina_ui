export class Process {
  id: string
  finished: boolean
  end: number
  curr: number
  process_type: string
  url: string
  type: string

  constructor(id:string, finished: boolean, end: number, curr: number, process_type: string, url: string, type: string) {
    this.id = id
    this.finished = finished;
    this.end = end;
    this.curr = curr;
    this.process_type = process_type;
    this.url = url;
    this.type = type;
  }
}
