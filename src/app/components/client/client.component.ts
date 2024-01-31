import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'src/app/interfaces/client';
import { MongodbService } from 'src/app/services/mongodb.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit{

  public clientCode:any;
  public clientData: Client = {
    Name: '',
    ClientCode: '',
    linkedContacts: []
  }
  public contacts: any = [] 
  constructor(public db: MongodbService, private aroute: ActivatedRoute)
  {
    
    
  }
  ngOnInit(): void
  {
    this.aroute.paramMap.subscribe((params)=>
    {
        this.clientCode = params.get("clientCode");
        
        this.db.getClients().pipe(
          map((clients:any)=>{            
              return clients.filter((client:any)=>{
                return client["ClientCode"]===this.clientCode})
            
          })
        ).subscribe(client=>this.clientData=client[0])
    })

    this.db.getContacts().subscribe((response)=>{
      this.contacts = Array(response)[0]
    })
  }

  contactIsLinked(emailAddress: string):boolean 
  {    
    return this.clientData.linkedContacts?.indexOf(emailAddress) !== -1;
  }

  unlinkContact(emailAddress: string)
  {
    const indexToRemove = this.clientData.linkedContacts?.indexOf(emailAddress)!;
    this.clientData.linkedContacts?.splice(indexToRemove, 1);

    this.db.linkContactToClient(this.clientData["_id"]!,  this.clientData.linkedContacts)

  }

  linkContact(emailAddress: string)
  {
    this.clientData.linkedContacts.push(emailAddress)
    this.db.linkContactToClient(this.clientData["_id"]!, this.clientData.linkedContacts)
  }

}
