import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatInputModule,
  MatListModule,
  MatOptionModule,
  MatSelectModule,
  MatTabsModule
} from "@angular/material";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ProjectComponent} from "./project/project.component";
import {TerminalComponent} from "./terminal/terminal.component";
import {InViewportModule} from "ng-in-viewport";

@NgModule({
  declarations: [
    AppComponent,
    ProjectComponent,
    TerminalComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    InViewportModule,
    MatCheckboxModule,
    MatCardModule,
    MatTabsModule,
    MatListModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    BrowserAnimationsModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
