import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Contact } from 'src/app/interfaces/contact';
import { MongodbService } from 'src/app/services/mongodb.service';



@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})


export class ClientsComponent implements OnInit{

  public clientForm = new FormGroup({
    Name: new FormControl('', {validators: [Validators.required]}),
    ClientCode: new FormControl({value: '', disabled:true})
  })


  public clients:any = []
  public contacts: Array<Contact> = []
  constructor(public db: MongodbService)
  {
    
  }
  ngOnInit(): void {
    
    this.getClients()
  }


  getClients()
  {
    this.db.getClients().subscribe((response)=>{
      this.clients = response
    })
  }

  createNewClient()
  {

    let clientData = this.clientForm.value
    this.db.addClient({Name: clientData.Name!, ClientCode: this.genereateClientCode(clientData.Name!), linkedContacts: []})
    .subscribe((response)=>{
      
      this.getClients()
      if(response == 200)
      {
        alert("Client created successfully!")
      }
    })
    this.clientForm.reset();
  }

  genereateClientCode(clientName: string) 
  { 

    // count number of words in name

    let clientNameArray = clientName.split(" ");
    let clientCode = "";
    let clientCharacters = "";

    
    for(let index=0; index <= clientNameArray.length - 1; index++)
    {
      clientCharacters+=`${clientNameArray[index].charAt(0)}`
    }

    // if characters are more than 3, slice from 0 to 2

    clientCharacters.slice(0, 2)
   
    // Ensure text is at least 3 characters long
    while (clientCharacters.length < 3) {
      // Append characters from 'A' to 'Z'
      clientCharacters += String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }    
    
   
    // get length of clients array and add 1 
    const clientArrayLength = this.clients.length+1

    // make client digits string of length 3
    const clientDigits = clientArrayLength.toString().padStart(3, '0');

    clientCode = clientCharacters.toUpperCase()+clientDigits
    return clientCode;
  }

}
