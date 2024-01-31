import { Injectable} from '@angular/core';
import { Client } from '../interfaces/client';
import { Contact } from '../interfaces/contact';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MongodbService {



  private baseUrl = `https://bcity.onrender.com`
  // private baseUrl = `http://localhost:3000`;
  private uris =
    {
      clients: `${this.baseUrl}/clients`,
      contacts: `${this.baseUrl}/contacts`
    }
  private headers = new HttpHeaders()
    .set('content-type', 'text/plain');

  constructor(private http: HttpClient) {

    

  }

  getContacts() {
    return this.http.get(this.uris.contacts, { headers: this.headers })
  }

  getClients() {
     return this.http.get(this.uris.clients, { headers: this.headers })
    // return this.http.get(this.uris.getClients, {headers: this.headers})
  }

  linkContactToClient(clientID: string, linkedContacts: any) {
    
    this.http.put(`${this.uris.clients}/${clientID}`, { linkedContacts: linkedContacts }).subscribe((response)=>{
      // console.log(response)
    })
  }

  linkClientToContact(contactID: string, linkedClients: any) {
    
    this.http.put(`${this.uris.contacts}/${contactID}`, { linkedClients: linkedClients }).subscribe((response)=>{
      // console.log(response)
    })
  }


  addClient(clientData:any)
  {
    return this.http.post(`${this.uris.clients}`, clientData)
  }

  addContact(contactData: any)
  {
    return this.http.post(`${this.uris.contacts}`, contactData)
  }

}
