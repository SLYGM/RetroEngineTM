import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SceneTabComponent } from './scene-tab/scene-tab.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    FileManagerComponent,
    NavbarComponent,
    SceneTabComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
