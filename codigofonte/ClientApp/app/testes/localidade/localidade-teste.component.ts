import { Component, OnInit, OnDestroy, Renderer, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Localidade } from '../../shared2/localidade/localidade.model';
import { LocalidadeService } from '../../shared2/localidade/localidade.service';

import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'localidade-teste',
    templateUrl: 'localidade-teste.template.html'
})
export class LocalidadeTesteComponent implements OnInit, OnDestroy {
    pais: Localidade
    routeFragmentSubscription

    @ViewChildren('anchor', {read: ElementRef}) anchors: QueryList<ElementRef>

    constructor(
        private _route: ActivatedRoute,
        private _localidadeService: LocalidadeService,
        private _renderer: Renderer
    ) { }

    ngOnInit() {
        this.pais = this._localidadeService.getRoot();

        this.routeFragmentSubscription = this._route.fragment
            .subscribe(fragment => {
                if (fragment) {
                    let elementRef = this.anchors.toArray().find(elem => elem.nativeElement.id === fragment);
                    if (elementRef) {
                        this._renderer.invokeElementMethod(elementRef.nativeElement, 'scrollIntoView');
                    }
                }
            });
    }

    ngOnDestroy() {
        this.routeFragmentSubscription.unsubscribe();
    }
}



