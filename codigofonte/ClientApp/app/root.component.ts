import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './shared/analytics.service';

@Component({
    selector: 'root',
    templateUrl: './root.template.html',
    styles: []
})
export class RootComponent implements OnInit {
    constructor(
        private _analytics: AnalyticsService
    ) { }

    ngOnInit() {
        this._analytics.listenRouterChanges();
    }
}
