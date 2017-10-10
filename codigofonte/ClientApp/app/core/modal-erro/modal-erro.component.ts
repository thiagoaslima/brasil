import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ModalErrorService } from './modal-erro.service';


@Component({
    selector: 'modal-erro',
    templateUrl: './modal-erro.component.html',
    styleUrls: ['./modal-erro.component.css']
})
export class ModalErroComponent implements OnInit{

    public showError: boolean = false;

    constructor(
        private modalErrorService: ModalErrorService
    ){  }

    ngOnInit(){

        this.modalErrorService.hasError().subscribe(hasError => {

            this.showError = hasError;
        });
    }

}
