import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Client } from 'src/app/interfaces/client';
import { Contact } from 'src/app/interfaces/contact';
import { MongodbService } from 'src/app/services/mongodb.service';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit{

  public contactForm = new FormGroup({
    Name: new FormControl('', {validators: [Validators.required]}),
    Surname: new FormControl('', {validators: [Validators.required]}),
    EmailAddress: new FormControl('', {validators: [Validators.required, Validators.email]}),
    linkedClients: new FormControl([])
  })
 
  clientsObservable$ = new BehaviorSubject([])
  
  public contacts: any = []
  constructor(public db: MongodbService)
  {
    
  }

  ngOnInit(): void {
    
    this.getContacts()
    
  }

  getContacts()
  {
    this.db.getContacts().subscribe((response)=>{
      this.contacts = Array(response)[0]
      
    })
  }

  createNewContact()
  {

    let contactData = this.contactForm.value;
    contactData.linkedClients = []

    /**check if email is unique */
    if( this.contacts.find((obj:any) => obj["EmailAddress"] === contactData.EmailAddress))
    {
      alert("email already exists")
      return
    }
  
    this.db.addContact(contactData)
    .subscribe((response)=>{
      
      this.getContacts()
      if(response == 200)
      {        
        alert("Contact created successfully!")
      }
    })

    this.contactForm.reset();
  }
}
