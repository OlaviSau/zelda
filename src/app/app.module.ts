import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule, MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatOptionModule,
  MatSelectModule, MatSnackBarModule,
  MatTabsModule,
  MatTooltipModule
} from "@angular/material";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ProjectComponent} from "./project/project.component";
import {TerminalComponent} from "./terminal/terminal.component";
import {LernaService} from "./lerna/lerna.service";
import {ConfigService} from "./config/config.service";
import { NgScrollbarModule } from "ngx-scrollbar";
import {ReactiveFormsModule} from "@angular/forms";

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
    MatTooltipModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
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
