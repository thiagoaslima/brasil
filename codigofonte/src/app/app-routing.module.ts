import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeExampleComponent } from './home-example/home-example.component';

export const getChild = (function (isAOT) {
  if (isAOT) {
    return function (filename, moduleName) {
      return () => {
        return System.import(`./${filename}/${filename}.module.ngfactory`)
          .then(mod => mod[`${moduleName}NgFactory`]);
      }
    }
  } else {
    return function (filename, moduleName) {
      return () => {
        return System.import(`./${filename}/${filename}.module`)
          .then(mod => mod[moduleName]);
      }
    }
  }
} (process.env.AOT));

export const lazyLoad = getChild('lazy-example', 'LazyExampleModule');

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: HomeExampleComponent },
      //{ path: 'lazy', loadChildren: './lazy-example/lazy-example.module#LazyExampleModule' }
      { path: 'lazy', loadChildren: lazyLoad }
    ])
  ],
})
export class AppRoutingModule { }
