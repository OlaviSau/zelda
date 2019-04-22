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
import {LernaService} from "./lerna/lerna.service";
import {ConfigService} from "./config/config.service";
import { NgScrollbarModule } from "ngx-scrollbar";

@NgModule({
  declarations: [
    AppComponent,
    ProjectComponent,
    TerminalComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    MatCheckboxModule,
    MatCardModule,
    MatTabsModule,
    MatListModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    BrowserAnimationsModule,
    MatInputModule,
    NgScrollbarModule
  ],
  providers: [
    LernaService,
    ConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
