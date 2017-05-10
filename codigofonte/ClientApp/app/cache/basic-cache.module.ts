import { NgModule } from '@angular/core';

import { CacheFactory } from './cacheFactory.service';

@NgModule({
    providers: [
        { provide: 'CacheService', useFactory: CacheFactory }
    ]
})
export class BasicCacheModule {

}