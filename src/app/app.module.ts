import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatOptionModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTooltipModule
} from "@angular/material";
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ProjectComponent } from "./project/project.component";
import { TerminalComponent } from "./terminal/terminal.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ConfigComponent } from "./config/config.component";
import { ComplexDependencyComponent } from "./dependency/complex-dependency.component";
import { PackageDependencyComponent } from "./dependency/package-dependency.component";
import { TasksComponent } from "./task/tasks.component";
import { ProcessState } from "./process/process.state";
import { ProjectState } from "./project/project.state";
import { DependencyState } from "./dependency/dependency.state";

@NgModule({
  declarations: [
    AppComponent,
    ProjectComponent,
    ConfigComponent,
    TerminalComponent,
    ComplexDependencyComponent,
    PackageDependencyComponent,
    TasksComponent
  ],
  entryComponents: [
    TasksComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
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
    MatDialogModule,
    MatIconModule
  ],
  providers: [
    ProcessState,
    ProjectState,
    DependencyState
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
