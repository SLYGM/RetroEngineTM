import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SceneTabComponent } from './scene-tab/scene-tab.component';

const routes: Routes = [
  {path: 'first-tab', component: SceneTabComponent},
  //  This is what path for tab2 would look like
  // {path: 'first-tab', component: Tab1Component},
  {path: '', redirectTo: '/first-tab', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
