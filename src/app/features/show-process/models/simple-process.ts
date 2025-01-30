export class SimpleProcess {
  id: string
  finished: boolean
  process_type: string
  url: string
  type: string
  order: number
  status: string | null = null


  constructor(id: string, finished: boolean, process_type: string, url: string, type: string, order: number, status: string | null) {
    this.id = id;
    this.finished = finished;
    this.process_type = process_type;
    this.url = url;
    this.type = type;
    this.order = order;
    this.status = status;
  }
}
