import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TestComponent} from "./components/test/test.component";
import {SimpleChatComponent} from "./components/simple-chat/simple-chat.component";
import {PrivateChatComponent} from "./components/private-chat/private-chat.component";

const routes: Routes = [
  { path: '', component: TestComponent},
  { path: 'simple-chat', component: SimpleChatComponent},
  { path: 'private-chat', component: PrivateChatComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
