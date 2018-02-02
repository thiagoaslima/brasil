import { NgModule } from '@angular/core';

import { CacheFactory } from './cacheFactory.service';

import { SharedModule3 } from '../shared3/shared3.module';

@NgModule({
    imports: [
        SharedModule3.forRoot()
    ],
    declarations: [
    ],
    providers: [
        { provide: 'CacheService', useFactory: CacheFactory }
    ],
    exports: [
    ]
})
export class BasicCacheModule {

}