import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SharedModule } from '../shared/shared.module';

import { CoreServices } from './services/index';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    HttpModule,
  ],
  declarations: [

  ],
  providers: [
    ...CoreServices,
  ],
  exports: [

  ],
})
export class CoreModule { }
