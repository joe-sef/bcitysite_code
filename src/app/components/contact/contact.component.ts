import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Contact } from 'src/app/interfaces/contact';
import { MongodbService } from 'src/app/services/mongodb.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit{


  public emailAddress : any;
  public contactData: Contact = 
  {
    Name: '',
    Surname: '',
    EmailAddress: '',
    linkedClients: []
  }
  public clients: any = [] 
  constructor(public db: MongodbService, private aroute: ActivatedRoute)
  {
    
    
  }
  ngOnInit(): void
  {
    this.aroute.paramMap.subscribe((params)=>
    {
        this.emailAddress = params.get("emailAddress");
        
        this.db.getContacts().pipe(
          map((contacts:any)=>{            
              return contacts.filter((contact:any)=>{
                return contact["EmailAddress"]===this.emailAddress})
            
          })
        ).subscribe(contact=>this.contactData=contact[0])
    })

    this.db.getClients().subscribe((response)=>{
      this.clients = Array(response)[0]
    })
  }

  clientIsLinked(ClientCode: string):boolean 
  {    
    
    return (this.contactData.linkedClients || []).indexOf(ClientCode) !== -1;
  }

  unlinkClient(ClientCode: string)
  {
    const indexToRemove = this.contactData.linkedClients?.indexOf(ClientCode)!;
    this.contactData.linkedClients?.splice(indexToRemove, 1);

    this.db.linkClientToContact(this.contactData["_id"]!, this.contactData.linkedClients)

  }

  linkClient(ClientCode: string)
  {
    const linkedClients = this.contactData.linkedClients || []
    this.contactData.linkedClients = [...linkedClients, ClientCode]
    this.db.linkClientToContact(this.contactData["_id"]!, this.contactData.linkedClients)
  }

  

}
