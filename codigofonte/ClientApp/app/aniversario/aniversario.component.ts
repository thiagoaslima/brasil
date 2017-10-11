import { TraducaoService } from '../traducao/traducao.service';
import { Component, ElementRef, Inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { isBrowser, isNode } from 'angular2-universal';
import { Observable, Subscription } from 'rxjs/Rx';
import { PageScrollInstance, PageScrollService, PageScrollConfig } from 'ng2-page-scroll';

import { Aniversario } from './aniversario';
import { AniversarioService } from './aniversario.service';
import { ModalErrorService } from '../core/modal-erro/modal-erro.service';

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


    isVisible = false;

    private subscription: Subscription;

    @ViewChild('container')
    private container: ElementRef;

    public get lang() {
        return this._traducaoServ.lang;
    }

    constructor(
        private aniversarioService: AniversarioService,
        private pageScrollService: PageScrollService,
        private modalErrorService: ModalErrorService,
        private _traducaoServ: TraducaoService,
        @Inject(DOCUMENT) private document: any
    ) { 

        PageScrollConfig.defaultScrollOffset = 175;
     }


    ngOnInit() { 

        this.codigoUFSelecionada = '0';
        this.diaSelecionado = new Date().getDate();
        this.mesSelecionado = new Date().getMonth() + 1;
    }

    ngOnDestroy(){
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onUFChange(event){

        this.codigoUFSelecionada = event.target.value;
        this.getAniversariantes();
    }

    setDia(dia: number){

        this.diaSelecionado = dia;
        this.goToDay(this.diaSelecionado.toString());
    }

    setMes(mes: number){
           
        this.mesSelecionado = mes;        
        this.getAniversariantes();
    }

    setHoje(){

            if(this.mesSelecionado != new Date().getMonth() + 1){
                
                this.diaSelecionado = new Date().getDate();
                this.setMes(new Date().getMonth() + 1);

            } else {

                this.setDia(new Date().getDate());
            }

            
    }

    public goToDay(day: string):void {

        let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInlineInstance(this.document, `#${day}`, this.container.nativeElement);

        this.pageScrollService.start(pageScrollInstance);
    }

    public pad(value: number, size: number) {

        var stringValue: string = value.toString();

        while (stringValue.length < size) {

            stringValue = "0" + stringValue;
        }

        return stringValue;
    }

    goToCidade(localidade){
        
         location.href = '/brasil/'+localidade.parent.sigla.toLowerCase()+'/'+localidade.slug;
    }  
    goToEstado(localidade){
        
       location.href = '/brasil/'+localidade.parent.sigla.toLowerCase();

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
            },
            error => {
                console.error(error);
                this.modalErrorService.showError();
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
