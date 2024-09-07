import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TestComponent} from "./components/test/test.component";
import {ChatComponent} from "./components/chat/chat.component";

const routes: Routes = [
  { path: '', component: TestComponent},
  { path: 'chat', component: ChatComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
