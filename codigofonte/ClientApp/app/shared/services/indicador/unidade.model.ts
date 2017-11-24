export class Unidade {
     nome: string
     classe: string
     multiplicador: number

     constructor({nome = '', classe = '', multiplicador = 1}) {
         this.nome = nome
         this.classe = classe
         this.multiplicador = multiplicador
     }

     toString() {
         if (this.multiplicador === 0 || this.multiplicador === 1) {
            return this.nome;
         }
         return this.nome + ' (×' + this.multiplicador + ')';
     }
}