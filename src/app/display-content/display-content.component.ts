import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonModule, Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {CollectionDataService} from '../collection-data.service';

@Component({
  selector: 'app-display-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-content.component.html',
  styleUrl: './display-content.component.css'
})
export class DisplayContentComponent implements OnInit{
  @Input() baseUrl: string = "";
  @Input() link: string = "";
  response: any[] = [];
  currentPage: number = 0;

  constructor(
    private http: HttpClient,
    private collectionDataService: CollectionDataService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,

  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      this.baseUrl = params['baseUrl'] || '';
      this.link = params['link'] || '';

      if (this.link === ""){
        this.collectionDataService.getAllContentData(this.baseUrl).subscribe(
          (data) => {
            this.response = data;
            console.log("lol",this.response);
          }
        )
      }else{
        this.collectionDataService.getContentDataByLink(this.baseUrl, this.link).subscribe(
          (data) => {
            this.response = data;
          }
        )
      }
    });
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  navigateBack() {
    this.location.back();
  }


}
