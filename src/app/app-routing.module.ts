import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from './components/clients/clients.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ClientComponent } from './components/client/client.component';
import { ContactComponent } from './components/contact/contact.component';

const routes: Routes = [
  {path:"", redirectTo: "clients", pathMatch:"full"},
  {
    path: 'clients', component: ClientsComponent
  },
  {
    path: 'contacts', component: ContactsComponent
  },
  {
    path: 'client/:clientCode', component: ClientComponent
  },
  {
    path: 'contact/:emailAddress', component: ContactComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
