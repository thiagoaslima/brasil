import { Component, OnInit, OnDestroy, Renderer } from '@angular/core';
import { Http } from '@angular/http';

import { AppState } from '../../shared2/app-state';
import { SinteseService } from '../sintese.service';
import { ScrollDirective } from '../../shared/window-events/scroll.directive';


import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';

@Component({
    selector: 'fotos',
    templateUrl: './fotos.template.html',
    styleUrls: ['./fotos.style.css']
})
export class FotosComponent implements OnInit, OnDestroy {
   
    private servicoImagem = "https://servicodados.ibge.gov.br/api/v1/resize/image?maxwidth=600&maxheight=600&caminho=www.biblioteca.ibge.gov.br/visualizacao/fotografias/GEBIS%20-%20RJ/";
    private servicoThumbs = "https://servicodados.ibge.gov.br/api/v1/resize/image?maxwidth=200&maxheight=200&caminho=www.biblioteca.ibge.gov.br/visualizacao/fotografias/GEBIS%20-%20RJ/";
    private urlDetalhes = "http://www.biblioteca.ibge.gov.br/index.php/biblioteca-catalogo?view=detalhes&id=4";
    private urlDownload = "https://servicodados.ibge.gov.br/Download/Download.ashx?http=1&u=biblioteca.ibge.gov.br/visualizacao/fotografias/GEBIS%20-%20RJ/";

    private mostraGaleria = false;
    private mostraDetalhe = false;

    private fotos;
    private index = 0;

    private imagem = "";
    private preview1 = "";
    private preview2 = "";
    private preview3 = "";
    private preview4 = "";
    private preview5 = "";
    private preview6 = "";
    private alt_preview1 = "";
    private alt_preview2 = "";
    private alt_preview3 = "";
    private alt_preview4 = "";
    private alt_preview5 = "";
    private alt_preview6 = "";
    private titulo = "";
    private detalhes = "";
    private downloadLink = "";
    private downloadNome = "";
    private _subscription: Subscription;

    //variável estática que guarda a referencia para o timer, precisa ser estática para evitar que dois timers sobrevivam ao mesmo tempo, criando um bug de flicking
    public static timer = null;

    localidade;

    constructor(
        private renderer: Renderer,
        private _sinteseService: SinteseService,
        private _appState: AppState,
        private http: Http
    ) {

    }

    ngOnInit() {

        // this.http
        //     .get('https://servicodados.ibge.gov.br/api/v1/resize/image?maxwidth=600&maxheight=600&caminho=www.biblioteca.ibge.gov.br/visualizacao/fotografias/GEBIS%20-%20RJ/RJ15339.jpg')
        //     .map(res => {
        //         // If request fails, return false
        //         // console.log(res.status);
        //        return (res.status < 200 || res.status >= 300) ? false : true;
        //     })
        //     .subscribe( (retornaServico) => {
        //         this.servicoImagem = retornaServico ? "https://servicodados.ibge.gov.br/api/v1/resize/image?maxwidth=600&maxheight=600&caminho=www.biblioteca.ibge.gov.br/visualizacao/fotografias/GEBIS%20-%20RJ/" : "https://www.biblioteca.ibge.gov.br/visualizacao/fotografias/GEBIS%20-%20RJ/";
        //         this.servicoThumbs = retornaServico ? "https://servicodados.ibge.gov.br/api/v1/resize/image?maxwidth=200&maxheight=200&caminho=www.biblioteca.ibge.gov.br/visualizacao/fotografias/GEBIS%20-%20RJ/" : "https://www.biblioteca.ibge.gov.br/visualizacao/fotografias/GEBIS%20-%20RJ/";
        //      }); // Reach true if res.status >= 200 && <= 299 // Reach false if fails

        this._subscription = this._appState.observable$
            .filter( ({localidade}) => Boolean(localidade))
            .map(state => state.localidade)
            .flatMap(localidade => {
                this.localidade = localidade;
                return this._sinteseService.getFotografias(localidade.tipo == 'uf' ? localidade.capital.codigo : localidade.codigo);
            })
            .subscribe((fotos) => {
                this.fotos = fotos;

                this.preview1 = '';
                this.preview2 = '';
                this.preview3 = '';
                this.preview4 = '';
                this.preview5 = '';
                this.preview6 = '';

                this.alt_preview1 = '';
                this.alt_preview2 = '';
                this.alt_preview3 = '';
                this.alt_preview4 = '';
                this.alt_preview5 = '';
                this.alt_preview6 = '';
                
                if(fotos.length >= 3){
                    //mostra as 3 fotos de preview
                    this.preview1 = this.servicoImagem + fotos[0].LINK;
                    this.preview2 = this.servicoImagem + fotos[1].LINK;
                    this.preview3 = this.servicoImagem + fotos[2].LINK;
                    this.alt_preview1 = fotos[0].TITULO + ' - ' + fotos[0].ANO;
                    this.alt_preview2 = fotos[1].TITULO + ' - ' + fotos[1].ANO;
                    this.alt_preview3 = fotos[2].TITULO + ' - ' + fotos[2].ANO;
                    //preview extra para telas gigantes
                    if(fotos.length >= 6){
                        this.preview4 = this.servicoImagem + fotos[3].LINK;
                        this.preview5 = this.servicoImagem + fotos[4].LINK;
                        this.preview6 = this.servicoImagem + fotos[5].LINK;
                        this.alt_preview4 = fotos[3].TITULO + ' - ' + fotos[3].ANO;
                        this.alt_preview5 = fotos[4].TITULO + ' - ' + fotos[4].ANO;
                        this.alt_preview6 = fotos[5].TITULO + ' - ' + fotos[5].ANO;
                    }
                } else if(fotos.length > 0 && fotos.length <= 2){
                    //mostra apenas 1 foto de preview
                    this.preview1 = this.servicoImagem + fotos[0].LINK;
                    this.preview2 = '';
                    this.preview3 = '';
                    this.alt_preview1 = fotos[0].TITULO + ' - ' + fotos[0].ANO;
                }
            });
    }

    ngOnDestroy(){

        this._subscription.unsubscribe();
    }


    mostrar(){
        //so abre a galeria se houver alguma foto para exibir
        if(this.preview1 != '' || this.preview2 != '' || this.preview3 != ''){
            if(this.fotos.length > 1){
                this.mostraGaleria = true;
            }else{
                this.detalhe(this.fotos[0]); 
            }
        }
    }

    esconder(){
        if(this.mostraDetalhe){
            this.mostraDetalhe = false;
        }else{
            this.mostraGaleria = false;
        }
    }

    detalhe(index){
        //this.mostraDetalhe = !this.mostraDetalhe;
        this.mostraDetalhe = true;
        this.index = index;
        let foto = this.fotos[index]
        if(this.mostraDetalhe){
            this.imagem =  this.servicoImagem + foto.LINK;
            this.titulo = foto.TITULO + " - " + foto.ANO;
            this.detalhes = this.urlDetalhes + foto.ID;
            this.downloadLink = this.urlDownload + foto.LINK;
            this.downloadNome = foto.LINK;
        }
    }

    anterior(){
        this.index -= this.index - 1 >= 0 ? 1 : 0;
        this.detalhe(this.index);
    }

    posterior(){
        this.index += this.index + 1 < this.fotos.length ? 1 : 0;
        this.detalhe(this.index);
    }

    //lazy load---------------------------------------------

    inViewport (el) {
        /*
        var r, html;
        if ( !el || 1 !== el.nodeType ) { return false; }
        html = document.documentElement; //usar angular para fazer essa pesquisa ???
        r = el.getBoundingClientRect();

        return ( !!r 
            && r.bottom >= 0 
            && r.right >= 0 
            && r.top <= html.clientHeight 
            && r.left <= html.clientWidth 
        );
        */
    }

    lazyLoad({element, value}, index){
       if (value && element && !element['src']) {
            this.renderer.setElementAttribute(element, 'src', this.servicoThumbs + this.fotos[index].LINK);
            //this.renderer.setElementStyle(element, 'backgroundImage', 'url(' + this.servicoThumbs + this.fotos[index].LINK + ')');
        }
    }

}