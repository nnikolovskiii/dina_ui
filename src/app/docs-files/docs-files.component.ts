import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CommonModule, Location, NgOptimizedImage} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {catchError, filter, forkJoin, Observable, of, Subscription} from 'rxjs';
import {Link} from '../models/link';
import {ProcessService} from '../process.service';
import {FormsModule} from '@angular/forms';
import {LinksService} from '../links.service';

@Component({
  selector: 'app-docs-files',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage, FormsModule],
  templateUrl: './docs-files.component.html',
  styleUrl: './docs-files.component.css'
})
export class DocsFilesComponent implements OnInit, OnDestroy {
  @Input() prevLink: string = '';
  @Input() docs_url: string = '';
  links$: Observable<Link[]> | null = null;
  subscription: Subscription | null = null;
  hoveredCard: any = null;
  isFinished: boolean = false;
  processMap: Map<string, [boolean, number]> = new Map();
  isSelectDocs: boolean = false;


  constructor(
    private linksService: LinksService,
    private processService: ProcessService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.prevLink = params['prevLink'] || '';
      this.docs_url = params['docs_url'] || '';

      this.links$ = this.linksService.getLinksFromParent(this.prevLink);

      this.processService.getPreProcesses(this.docs_url).subscribe(
        (response) => {
          this.loadingSortedProcess = false;
          this.isFinished = response.get("main")?.[0] ?? false;
          console.log(response)
          console.log(this.isFinished)
          this.processMap = response;
          let lastProcessType = this.getLastProcessType()
          this.processService.getPreProcess(this.docs_url, lastProcessType).subscribe(
            (response) => {
              this.processStatus = response["status"] ?? 'Unknown';
              console.log(response)
              this.loadingSortedProcess = true;
            },
            (error) => {
              console.error('Error:', error);
            }
          )
        },
        (error) => {
          console.error('Error:', error);
        }
      )
    });
  }

  navigateToLink(link: string): void {
    if (link) {
      window.open(link, '_blank');
    } else {
      console.error('Invalid link:', link);
    }
  }

  selectCard(card: any): void {
    this.hoveredCard = card;
  }

  deselectCard(): void {
    this.hoveredCard = null
  }

  isCardHovered(card: any): boolean {
    return this.hoveredCard === card;
  }

  toggleLinkSelection(event: Event, link: Link): void {
    const checkbox = event.target as HTMLInputElement;
    this.linksService.activateLink(link.link, checkbox.checked).subscribe(
      (response) => {
        link.active = checkbox.checked;
      }
    );
  }

  getLabel(link: Link): string {
    return link.link.split("//")[1];
  }

  selectPage(activeStatus: boolean): void {
    this.isSelectDocs=true
    this.linksService.activateAllLinksFromParent(this.prevLink, activeStatus).subscribe(
      (response) => {
        this.isSelectDocs=false
      }
    )
  }

  selectByParentRecursively(activeStatus: boolean, prevLink: string): void {
    this.isSelectDocs=true
    this.linksService.activateAllLinksFromParentRecursively(prevLink, activeStatus).subscribe(
      (response) => {
        this.isSelectDocs=false
      }
    )
  }

  selectAllLinks(activeStatus: boolean): void {
    this.isSelectDocs=true
    this.linksService.activateAllLinksFromDocsUrl(this.docs_url, activeStatus).subscribe(
      (response) => {
        this.isSelectDocs=false
      }
    )
  }

  getBreadcrumbs(): [string, string][] {
    const breadcrumbs: [string, string][] = [];

    if (!this.prevLink) {
      console.warn('prevLink is not defined.');
      return breadcrumbs;
    }

    let li = this.prevLink.split("//")
    let acc = li[0] + '//'
    let counter = 0

    for (const link of li[1].split('/')) {
      if (link !== '') {
        if (counter > 0) {
          acc += "/" + link
        }else{
          acc += link
        }
        breadcrumbs.push([link, acc]);
      }
      counter+=1
    }

    return breadcrumbs;
  }

  getColor(link: Link) {
    let color = null
    if(link.processed){
      color = "#BA55D3"
    }

    if(link.active && !link.processed){
      color = "#98FB98"
    }

    return color
  }


  navigateBack() {
    this.location.back();
  }


  ngOnDestroy(): void {
  }

  getLinks(is_parent: boolean, links: Link[]): Link[] {
    return links.filter(link => link.is_parent == is_parent);
  }

  navigateToFinish(): void {
    this.router.navigate(['/finish'], { queryParams: { url: this.docs_url, type: "docs" } });
  }

  getSortedProcesses(): [string, [boolean, number]][] {
    return Array.from(this.processMap.entries())
      .filter(([key, value]) => value[1] !== 0)
      .sort((a, b) => a[1][1] - b[1][1]);
  }

  getLastProcessType(): string {
    let li = Array.from(this.processMap.entries())
      .sort((a, b) => a[1][1] - b[1][1]);
    return li[li.length-1][0]
  }

  loadingSortedProcess: boolean = false;
  processStatus: string = 'Initial Status';
  refresh(){
    this.loadingSortedProcess = false;
    this.processService.getPreProcesses(this.docs_url).subscribe(
      (response) => {
        this.isFinished = response.get("main")?.[0] ?? false;
        this.processMap = response;
        let lastProcessType = this.getLastProcessType()
        this.processService.getPreProcess(this.docs_url, lastProcessType).subscribe(
          (response) => {
            this.processStatus = response["status"] ?? 'Unknown';
          },
          (error) => {
            console.error('Error:', error);
          }
        )
        this.loadingSortedProcess = true;
      },
      (error) => {
        console.error('Error:', error);
      }
    )
  }

  protected readonly of = of;

  navigateToDisplayContent(base_url: string, link: string) {
    this.router.navigate(['/collection-data'], { queryParams: { baseUrl: base_url, link: link } });
  }
}
