import { Component, OnInit, Renderer } from '@angular/core';

import { SinteseService } from '../sintese.service';
import { LocalidadeService } from '../../shared/localidade/localidade.service';
import { ScrollDirective } from '../../shared/window-events/scroll.directive';


import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'fotos',
    templateUrl: './fotos.template.html',
    styleUrls: ['./fotos.style.css']
})
export class FotosComponent implements OnInit {
   
    private servicoImagem = "http://servicodados.ibge.gov.br/api/v1/resize/image?maxwidth=600&maxheight=600&caminho=www.biblioteca.ibge.gov.br/visualizacao/fotografias/GEBIS%20-%20RJ/";
    private servicoThumbs = "http://servicodados.ibge.gov.br/api/v1/resize/image?maxwidth=200&maxheight=200&caminho=www.biblioteca.ibge.gov.br/visualizacao/fotografias/GEBIS%20-%20RJ/";
    private urlDetalhes = "http://www.biblioteca.ibge.gov.br/index.php/biblioteca-catalogo?view=detalhes&id=4";
    private urlDownload = "http://servicodados.ibge.gov.br/Download/Download.ashx?http=1&u=biblioteca.ibge.gov.br/visualizacao/fotografias/GEBIS%20-%20RJ/";

    private mostraGaleria = false;
    private mostraDetalhe = false;

    private fotos;
    private index = 0;

    private imagem = "";
    private preview1 = "";
    private preview2 = "";
    private preview3 = "";
    private titulo = "";
    private detalhes = "";
    private downloadLink = "";
    private downloadNome = "";

    //variável estática que guarda a referencia para o timer, precisa ser estática para evitar que dois timers sobrevivam ao mesmo tempo, criando um bug de flicking
    public static timer = null;

    constructor(
        private renderer: Renderer,
        private _sinteseService: SinteseService,
        private _localidadeService: LocalidadeService
    ) {
        //destroi o timer anterior
        // if(FotosComponent.timer != null){
        //     clearInterval(FotosComponent.timer);
        // }
        //cria novo timer para verificar se precisa carregar novas fotos a cada segundo
        // FotosComponent.timer = setInterval(
        //     () => this.lazyLoad(),
        //     1000
        // );
    }



    ngOnInit() {

        this._localidadeService.selecionada$
            .flatMap(localidade => this._sinteseService.getFotografias(localidade.codigo))
            .subscribe((fotos) => {
                this.fotos = fotos;
                if(fotos.length >= 3){
                    //mostra as 3 fotos de preview
                    this.preview1 = this.servicoImagem + fotos[0].LINK;
                    this.preview2 = this.servicoImagem + fotos[1].LINK;
                    this.preview3 = this.servicoImagem + fotos[2].LINK;
                } else if(fotos.length > 0 && fotos.length <= 2){
                    //mostra apenas 1 foto de preview
                    this.preview1 = this.servicoImagem + fotos[0].LINK;
                    this.preview2 = '';
                    this.preview3 = '';
                } else{
                    //não mostra o preview
                    this.preview1 = '';
                    this.preview2 = '';
                    this.preview3 = '';
                }
            });
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
            //this.renderer.setElementAttribute(element, 'src', this.servicoThumbs + this.fotos[index].LINK);
            this.renderer.setElementStyle(element, 'backgroundImage', 'url(' + this.servicoThumbs + this.fotos[index].LINK + ')');
        }
    }

}