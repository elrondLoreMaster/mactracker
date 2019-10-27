import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { TableListComponent } from '../../table-list/table-list.component';
import { TreemapComponent} from '../../treemap/treemap.component';
import { IconsComponent } from '../../icons/icons.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatDatepickerModule,MatNativeDateModule} from '@angular/material';
import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatSliderModule,
      MatDatepickerModule,
      MatNativeDateModule
  ],
  declarations: [
    TableListComponent,
    TreemapComponent,
    IconsComponent,
  ]
})

export class AdminLayoutModule {}
