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
import { ProjectComponent } from "./project/project.component";
import { TerminalComponent } from "./terminal/terminal.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ConfigComponent } from "./config/config.component";
import { ComplexDependencyComponent } from "./dependency/complex-dependency.component";
import { PackageDependencyComponent } from "./dependency/package-dependency.component";
import { ProcessState } from "./process/process.state";
import { ProjectState } from "./project/project.state";
import { DependencyState } from "./dependency/dependency.state";
import { CommandContainerComponent } from "./command-container/command-container.component";
import { LongHoverDirective } from "./long-hover/long-hover.directive";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { IconPickerDialogComponent } from "./icon-picker/icon-picker-dialog.component";
import { IconPickerComponent } from "./icon-picker/icon-picker.component";
import { AngularProjectSelectorComponent } from "./project/angular/angular-project-selector.component";
import { Config } from "./config/config";
import { ProcessService } from "./process/process.service";
import { TabsComponent } from "./tabs/tabs.component";
import { TabComponent } from "./tabs/tab.component";
import { DragDropModule } from "@angular/cdk/drag-drop";

@NgModule({
  declarations: [
    AppComponent,
    ProjectComponent,
    ConfigComponent,
    TerminalComponent,
    ComplexDependencyComponent,
    PackageDependencyComponent,
    CommandContainerComponent,
    LongHoverDirective,
    IconPickerDialogComponent,
    IconPickerComponent,
    AngularProjectSelectorComponent,
    TabsComponent,
    TabComponent
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
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    NoopAnimationsModule,
    DragDropModule
  ],
  providers: [
    ProcessState,
    ProjectState,
    DependencyState,
    ProcessService,
    Config
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
