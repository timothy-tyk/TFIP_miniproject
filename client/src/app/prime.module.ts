import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabMenuModule } from 'primeng/tabmenu';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  declarations: [],
  imports: [
    CommonModule,
    MenubarModule,
    ButtonModule,
    AccordionModule,
    AvatarModule,
    InputTextModule,
    InputTextareaModule,
    TabMenuModule,
    BadgeModule,
    DialogModule,
    TableModule,
    TreeTableModule,
  ],
  exports: [
    MenubarModule,
    ButtonModule,
    AccordionModule,
    AvatarModule,
    InputTextModule,
    InputTextareaModule,
    TabMenuModule,
    BadgeModule,
    DialogModule,
    TableModule,
    TreeTableModule,
  ],
})
export class PrimeModule {}
