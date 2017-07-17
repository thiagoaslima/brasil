import { IMyDate, IMyMarkedDate, IMyMarkedDates } from 'mydatepicker/dist';
import { Observable, Subscription } from 'rxjs/Rx';
import { Component, ElementRef, Inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { PageScrollInstance, PageScrollService, PageScrollConfig } from 'ng2-page-scroll';
import { DOCUMENT } from '@angular/platform-browser';

import { isBrowser, isNode } from 'angular2-universal';

import { Aniversario } from './aniversario';
import { AniversarioService } from './aniversario.service';


@Component({
    selector: 'aniversario',
    templateUrl: 'aniversario.component.html',
    styleUrls: ['aniversario.component.css']
})
export class AniversarioComponent implements OnInit {

    public isPrerender = isNode;
    public isBrowser = isBrowser;

    aniversariantes: Aniversario[] = [];

    codigoUFSelecionada: string;
    diaSelecionado;
    mesSelecionado;

    myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy',
        inline: true,
        showWeekNumbers: true,
        selectorHeight: '232px',
        selectorWidth: '252px'
    };

    model: Object = {};

    isVisible = false;

    private subscription: Subscription;

    @ViewChild('container')
    private container: ElementRef;

    constructor(
        private aniversarioService: AniversarioService,
        private pageScrollService: PageScrollService,
        @Inject(DOCUMENT) private document: any
    ) { }


    ngOnInit() { 

        this.codigoUFSelecionada = '0';
        this.diaSelecionado = new Date().getDate();
        this.mesSelecionado = new Date().getMonth() + 1;
        this.model = { date: { year: new Date().getFullYear(), month: this.mesSelecionado, day: this.diaSelecionado } };
    }

    ngOnDestroy(){

        this.subscription.unsubscribe();
    }

    onUFChange(event){

        this.codigoUFSelecionada = event.target.value;
        this.getAniversariantes();
    }

    onDateChanged(event: IMyDateModel) {

        this.diaSelecionado = event.date.day;
        this.mesSelecionado = event.date.month;
        this.getAniversariantes();
    }

    public goToDay(day: string):void {

        let pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({
            document: this.document,
            scrollTarget: `#${day}`,
            scrollingViews: [this.container.nativeElement],
            advancedInlineOffsetCalculation: true,
            verticalScrolling: true,
            pageScrollOffset: 150
        });

        this.pageScrollService.start(pageScrollInstance);
    }

    toggleVisible(){

        this.isVisible = !this.isVisible;

        if(this.isVisible){

            this.getAniversariantes()
        }
    }

    private getAniversariantes(){

        this.subscription = this.aniversarioService.getAniversariantes(this.codigoUFSelecionada, this.mesSelecionado)
            .subscribe(aniversariantes => {

                this.aniversariantes = this.groupByDiaAniversario(aniversariantes);

                if (this.isBrowser) {

                    this.goToDay(this.diaSelecionado);
                }   
            });
    }

    private groupByDiaAniversario(aniversarios: Aniversario[]){

        let aniversariosPorDia = [];

        aniversarios.forEach(aniversario => {

            if(!aniversariosPorDia[aniversario.dia]){

                aniversariosPorDia[aniversario.dia] = [aniversario];

            } else{

                 aniversariosPorDia[aniversario.dia].push(aniversario);
            }
        });

        return aniversariosPorDia;
    }

}
