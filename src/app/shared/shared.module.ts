import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DIRECTIVES } from './directives/index';
import { PIPES } from './pipes/index';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ...DIRECTIVES,
    ...PIPES
  ],
  exports: [
    ...DIRECTIVES,
    ...PIPES,
  ]
})
export class SharedModule { }
