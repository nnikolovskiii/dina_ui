import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessInquiryService {
  private apiUrl = 'http://localhost:8081/start-now';

  constructor(private http: HttpClient) { }

  /**
   * Submit a business inquiry form
   * @param name The name of the person submitting the form
   * @param email The email address of the person submitting the form
   * @param businessNeeds The business needs of the person submitting the form
   * @returns An Observable with the response from the API
   */
  submitInquiry(name: string, email: string, businessNeeds: string): Observable<any> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('business_needs', businessNeeds);

    return this.http.post(this.apiUrl, formData);
  }
}
