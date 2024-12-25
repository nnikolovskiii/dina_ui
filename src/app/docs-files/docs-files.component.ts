import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CommonModule, Location, NgOptimizedImage} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {catchError, filter, forkJoin, Observable, of, Subscription} from 'rxjs';
import {Link} from '../models/link';
import {DocsFilesService} from '../docs-files.service';
import {ProcessService} from '../process.service';

@Component({
  selector: 'app-docs-files',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './docs-files.component.html',
  styleUrl: './docs-files.component.css'
})
export class DocsFilesComponent implements OnInit, OnDestroy {
  @Input() prevLink: string = '';
  @Input() docs_url: string = '';
  links$: Observable<Link[]> | null = null;
  selectedLinks = new Map<string, boolean>();
  private subscription: Subscription | null = null;
  hoveredCard: any = null;
  isFinished: boolean = false;
  processMap: Map<string, [boolean, number]> = new Map();

  constructor(
    private docsFilesService: DocsFilesService,
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

      const storedData = localStorage.getItem('selectedLinks');
      if (storedData) {
        let selectedLinks: Map<string, boolean> = new Map(JSON.parse(storedData));
        this.saveCurrLinks(selectedLinks);
      }
      this.clearLocal()

      this.links$ = this.docsFilesService.getLinks(this.prevLink);
      this.selectedLinks = new Map();

      this.processService.getPreProcesses(this.docs_url).subscribe(
        (response) => {
          this.isFinished = response.get("main")?.[0] ?? false;
          this.processMap = response;
        },
        (error) => {
          console.error('Error:', error);
        }
      )

      this.subscription = this.links$.subscribe({
        next: links => {
          for (const link of links) {
            if (link.color == "green" || link.color == "blue") {
              this.selectedLinks.set(link.link, true);
            }
          }
        },
        error: err => {
          console.error('Error fetching links:', err);
        }
      });
    });
  }

  navigateToLink(link: string): void {
    if (link) {
      // Open the link in a new tab
      window.open(link, '_blank');
    } else {
      console.error('Invalid link:', link);
    }
  }

  selectCard(card: any): void {
    this.hoveredCard = card; // Set the hovered card
  }

  deselectCard(): void {
    this.hoveredCard = null; // Clear the hovered card
  }

  isCardHovered(card: any): boolean {
    return this.hoveredCard === card; // Check if the card is being hovered
  }
  toggleLinkSelection(event: Event, link: Link): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.onLinkSelect(event, link);
    } else {
      this.onLinkUnselect(link);
    }
    localStorage.setItem('selectedLinks', JSON.stringify(Array.from(this.selectedLinks.entries())));
  }

  onLinkSelect(event: Event, link: Link): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedLinks.set(link.link, true);
    }
  }

  onLinkUnselect(link: Link): void {
    this.selectedLinks.set(link.link, false);
  }

  // i dont understand this
  checkForParent(link: Link): boolean {
    if (link.is_parent) {
      return false
    }

    const isSelected = this.selectedLinks.get(link.link);
    if (typeof isSelected === 'boolean') {
      return isSelected;
    } else {
      return false;
    }
  }

  clearLocal(): void {
    localStorage.removeItem('selectedLinks');
  }

  getLabel(link: Link): string {
    return link.link.split("//")[1];
  }

  selectAllLinks(links: Link[]): void {
    this.selectedLinks = new Map(links.filter(link => !link.is_parent).map(link => [link.link, true]));
    localStorage.setItem('selectedLinks', JSON.stringify(Array.from(this.selectedLinks.entries())));
  }

  deselectAllLinks(links: Link[]): void {
    this.selectedLinks = new Map(links.filter(link => !link.is_parent).map(link => [link.link, false]));
    localStorage.setItem('selectedLinks', JSON.stringify(Array.from(this.selectedLinks.entries())));

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

  saveCurrLinks(selectedLinks: Map<string, boolean> = this.selectedLinks): void {
    if (selectedLinks.size > 0) {
      const saveObservables = Array.from(selectedLinks.entries()).map(
        ([key, value]) => this.docsFilesService.updateLink(key, value)
      );

      forkJoin(saveObservables)
        .pipe(
          catchError((error) => {
            console.error('Error saving links:', error);
            return [];
          })
        )
        .subscribe({
          complete: () => console.log('Links saved successfully'),
        });
    }
  }

  get_color(link: Link): string {
    let color = "white";
    if (this.selectedLinks.has(link.link)) {
      if (link.color == "green") {
        if (!this.selectedLinks.get(link.link)) {
          color = "white"
        } else {
          color = link.color;
        }
      }
      if (link.color == "blue") {
        if (!this.selectedLinks.get(link.link)) {
          color = "red"
        } else {
          color = link.color;
        }
      }
      if (link.color == "red") {
        if (this.selectedLinks.get(link.link)) {
          color = "blue"
        } else {
          color = link.color;
        }
      }
      if (link.color == "white") {
        if (this.selectedLinks.get(link.link)) {
          color = "green"
        } else {
          color = link.color;
        }
      }
    } else {
      color = link.color;
    }

    if (color == "green") {
      color = "#98FB98"
    }
    if (color == "blue") {
      color = "#6495ED"
    }
    if (color == "red") {
      color = "#FF0800"
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
    this.saveCurrLinks()
    this.router.navigate(['/finish'], { queryParams: { url: this.docs_url, type: "docs" } });
  }

  selectAll(prev_link: string, select: boolean){
    this.docsFilesService.selectAllLinks(prev_link, select).subscribe(
      (response) => {
        console.log('Response:', response);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  isSelectDocs: boolean = false;

  selectDocs(docsUrl: string, select: boolean){
    this.isSelectDocs = true
    this.docsFilesService.selectDocs(docsUrl, select).subscribe(
      (response) => {
        window.location.reload();
        },
      (error) => {
        console.error('Error:', error);
      }
    );
  }


  getSortedProcesses(): [string, [boolean, number]][] {
    return Array.from(this.processMap.entries())
      .filter(([key, value]) => value[1] !== 0)
      .sort((a, b) => a[1][1] - b[1][1]);
  }

  protected Link = Link;
  protected readonly of = of;
  protected readonly filter = filter;
}
