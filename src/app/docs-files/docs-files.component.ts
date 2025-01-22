import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CommonModule, Location, NgOptimizedImage} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {catchError, filter, forkJoin, interval, Observable, of, Subscription} from 'rxjs';
import {Link} from '../models/link';
import {ProcessService} from '../process.service';
import {FormsModule} from '@angular/forms';
import {LinksService} from '../links.service';
import {Process} from '../models/process';

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
  hoveredCard: any = null;
  isFinished: boolean = false;
  processMap: Map<string, [boolean, number]> = new Map();
  isSelectDocs: boolean = false;
  loadingSortedProcess: boolean = false;
  currentProcess: Process | null = null;
  radius = 45; // Radius of the circular progress bar
  circumference = 2 * Math.PI * this.radius; // Calculate the circumference
  private autoRefreshSubscription: Subscription | null = null;

  get progressPercentage(): number {

    return ((this.currentProcess?.curr ?? 0) / (this.currentProcess?.end ?? 1)) * 100;
  }

  get strokeDashoffset(): number {

    return this.circumference - (this.progressPercentage / 100) * this.circumference;
  }


  constructor(
    private linksService: LinksService,
    private processService: ProcessService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.prevLink = params['prevLink'] || '';
      this.docs_url = params['docs_url'] || '';

      this.links$ = this.linksService.getLinksFromParent(this.prevLink);
      console.log("lol")
      this.getProcessesFromUrl()
      this.startAutoRefresh(); // Start the auto-refresh process
    });
  }

  private startAutoRefresh(): void {
    if(this.isFinished) {
      this.autoRefreshSubscription = interval(3000).subscribe(() => {
        this.getProcessesFromUrl();
      });
    }
  }

  private stopAutoRefresh(): void {
    // Unsubscribe from the interval to prevent memory leaks
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
    }
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
    this.isSelectDocs = true
    this.linksService.activateAllLinksFromParent(this.prevLink, activeStatus).subscribe(
      (response) => {
        this.isSelectDocs = false
      }
    )
  }


  selectByParentRecursively(activeStatus: boolean, prevLink: string): void {
    this.isSelectDocs = true
    this.linksService.activateAllLinksFromParentRecursively(prevLink, activeStatus).subscribe(
      (response) => {
        this.isSelectDocs = false
      }
    )
  }

  selectAllLinks(activeStatus: boolean): void {
    this.isSelectDocs = true
    this.linksService.activateAllLinksFromDocsUrl(this.docs_url, activeStatus).subscribe(
      (response) => {
        this.isSelectDocs = false
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
        } else {
          acc += link
        }
        breadcrumbs.push([link, acc]);
      }
      counter += 1
    }

    return breadcrumbs;
  }

  getColor(link: Link) {
    let color = null
    if (link.processed) {
      color = "#BA55D3"
    }

    if (link.active && !link.processed) {
      color = "#98FB98"
    }

    return color
  }


  navigateBack() {
    this.location.back();
  }


  ngOnDestroy(): void {
    this.stopAutoRefresh(); // Clean up when the component is destroyed
  }

  getLinks(is_parent: boolean, links: Link[]): Link[] {
    return links.filter(link => link.is_parent == is_parent);
  }

  navigateToFinish(): void {
    this.router.navigate(['/finish'], {queryParams: {url: this.docs_url, type: "docs"}});
  }

  getSortedProcesses(): [string, [boolean, number]][] {
    return Array.from(this.processMap.entries())
      .filter(([key, value]) => value[1] !== 0)
      .sort((a, b) => a[1][1] - b[1][1]);
  }

  getLastProcessType(): string {
    let li = Array.from(this.processMap.entries())
      .sort((a, b) => a[1][1] - b[1][1]);
    return li[li.length - 1][0]
  }

  refresh() {
    this.loadingSortedProcess = false;
    this.getProcessesFromUrl()
  }

  getProcessesFromUrl(): void {
    console.log("Fetching process data...");
    this.processService.getProcessesFromUrl(this.docs_url, "pre").subscribe(
      response => {
        this.isFinished = response.get("main")?.[0] ?? true;
        this.processMap = response;

        let lastProcessType = this.getLastProcessType();
        this.processService.getProcess(this.docs_url, lastProcessType, "pre").subscribe(
          response => {
            this.currentProcess = response;
            this.cdr.detectChanges(); // Force Angular to detect changes
          },
        );
        this.loadingSortedProcess = true;
      },
    );
  }


  protected readonly of = of;

  navigateToDisplayContent(base_url: string, link: string) {
    this.router.navigate(['/collection-data'], {queryParams: {baseUrl: base_url, link: link}});
  }


}
