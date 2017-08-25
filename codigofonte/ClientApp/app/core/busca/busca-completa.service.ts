import { Injectable } from '@angular/core';
import { isBrowser, isNode } from 'angular2-universal/browser';

import { brasil } from '../../../api/brasil';
import { ufs } from '../../../api/ufs';
import { municipios } from '../../../api/municipios';
import { links } from '../../../api/links'; //links metadata

@Injectable()
export class BuscaCompletaService {

    constructor(){
        //transform link's keywords
        for(var i = 0; i < links.length; i++){
            for(var k = 0; k < links[i].keywords.length; k++){
                links[i].keywords[k] = this.transformText(links[i].keywords[k]);
            }
        }
    }

    private transformText(text){
        var a = "áàãâä";
        var e = "éèêë";
        var i = "íìîï";
        var o = "óòõôö";
        var u = "úùûü";
        var newText = "";
        text = text.toLowerCase().trim();
        for(var k = 0; k < text.length; k++){
            var c = text.charAt(k);
            if((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')){
                newText += c;
            }else{
                if(c == ' ' && k - 1 >= 0 && text.charAt(k - 1) == ' ') continue; //ignore multiple consecutive spaces
                else if(c == ' ') newText += '-';
                else if(c == 'ç') newText += 'c';
                else if(a.indexOf(c) >= 0) newText += 'a';
                else if(e.indexOf(c) >= 0) newText += 'e';
                else if(i.indexOf(c) >= 0) newText += 'i';
                else if(o.indexOf(c) >= 0) newText += 'o';
                else if(u.indexOf(c) >= 0) newText += 'u';
            }
        }
        return newText;
    }

    private findPlaces(transformedText, places){
        var i;
        var placesFound = [];
        //find exactly places
        for(i = 0; i < places.length; i++){
            if(placesFound.indexOf(places[i]) >= 0) continue; //dont push twice
            var index = transformedText.indexOf(places[i].slug);
            var length = places[i].slug.length;
            if((index == 0 || transformedText.charAt(index - 1) == '-') && 
                (index + length == transformedText.length || transformedText.charAt(index + length) == '-')) //match whole word
                placesFound.push(places[i]);
        }
        //big matches first
        placesFound.sort(function(a, b){return (b.slug.split('-').length * b.slug.length) - (a.slug.split('-').length * a.slug.length)});
        //suggest a place (pick last 4, 3, 2 and 1 words and try to match to a place)
        var textWords = transformedText.split('-');
        var words4, words3, words2, words1;
        var sug4 = [], sug3 = [], sug2 = [], sug1 = [];
        if(textWords.length >= 4) words4 = textWords[textWords.length - 4] + '-' + textWords[textWords.length - 3] + '-' + textWords[textWords.length - 2] + '-' + textWords[textWords.length - 1];
        if(textWords.length >= 3) words3 = textWords[textWords.length - 3] + '-' + textWords[textWords.length - 2] + '-' + textWords[textWords.length - 1];
        if(textWords.length >= 2) words2 = textWords[textWords.length - 2] + '-' + textWords[textWords.length - 1];
        if(textWords.length >= 1 && textWords[textWords.length - 1].length >= 3) words1 = textWords[textWords.length - 1];
        for(i = 0; i < places.length; i++){
            if(placesFound.indexOf(places[i]) >= 0) continue; //dont push twice
            if(words4 && places[i].slug.indexOf(words4) == 0)
                sug4.push(places[i]);
            else if(words3 && places[i].slug.indexOf(words3) == 0)
                sug3.push(places[i]);
            else if(words2 && places[i].slug.indexOf(words2) == 0)
                sug2.push(places[i]);
            else if(words1 && places[i].slug.indexOf(words1) == 0)
                sug1.push(places[i]);
        }
        //pick suggetions that matches the biggest names only (the best matches)
        if(sug4.length) placesFound = placesFound.concat(sug4);
        else if(sug3.length) placesFound = placesFound.concat(sug3);
        else if(sug2.length) placesFound = placesFound.concat(sug2);
        else if(sug1.length) placesFound = placesFound.concat(sug1);
        //result
        return placesFound;
    }
    
    public search(text){
        var places = [], link, year;
        var i;
        text = this.transformText(text);
        //find country
        if(text.indexOf("brasil") >= 0)
            places.push(brasil);
        //find state
        if(text.indexOf("cidade") < 0 && text.indexOf("municipio") < 0)
            places = places.concat(this.findPlaces(text, ufs));
        //find city
        if(text.indexOf("estado") < 0)
            places = places.concat(this.findPlaces(text, municipios));
        //pick only first results
        places = places.slice(0, 6);
        //find keywords
        for(i = 0; i < links.length; i++){
            links[i]["points"] = 0; //reset points
            var keywords = links[i].keywords;
            for(var k = 0; k < keywords.length; k++){
                var index;
                var keywordInPlaceName = false;
                //jump keywords in place name
                for(var j = 0; j < places.length; j++){
                    index = places[j].slug.indexOf(keywords[k]);
                    if((index == 0 || places[j].slug.charAt(index - 1) == '-') && text.indexOf(keywords[k]) == text.lastIndexOf(keywords[k])){
                        keywordInPlaceName = true;
                        break;
                    }
                }
                if(keywordInPlaceName) continue;
                //---
                index = text.indexOf(keywords[k]);
                if(index == 0 || text.charAt(index - 1) == '-') //must match with the start of a word (spaces are replaced by '-')
                    links[i]["points"] += 1; //give a point to the link every time it matches a keyword
            }
        }
        links.sort(function(a, b){return b["points"] - a["points"]}); //sort links by points
        //find year
        var textWords = text.split('-');
        for(i = 0; i < textWords.length; i++){
            if(textWords[i].length == 4 && !isNaN(textWords[i])){
                year = parseInt(textWords[i]);
                if(year < 1900 || year > 2999)
                    year = undefined;
            }
        }
        //result-----------------------------------------------------
        var result = [];
        //places only
        if(places.length > 0){
            for(i = 0; i < places.length; i++){
                var type = places[i].codigo == 0 ? "pais" : ((places[i].codigo >= 10 && places[i].codigo) <= 99 ? "uf" : "municipio");
                var parent;
                if(type == "municipio"){
                    for(var k = 0; k < ufs.length; k++){
                        if(ufs[k].codigo == places[i].codigoUf)
                            parent = ufs[k];
                    }
                }
                var link;
                if(type == "municipio")
                    link = "/brasil/" + parent.sigla.toLowerCase() + '/' + places[i].slug;
                else if(type == "uf")
                    link = "/brasil/" + places[i].sigla.toLowerCase();
                else if(type == "pais")
                    link = "/brasil";
                result.push({
                    type: type,
                    name: places[i].nome,
                    parent: parent ? parent.sigla : null,
                    id: places[i].codigo,
                    link: link
                });
            }
        }
        //complete result
        if(places.length > 0 && links[0]["points"] > 0){
            for(i = 0; i < result.length; i++){
                result[i].type = "pesquisa";
                result[i].name = links[0].name + ((year && links[0].tipo == "pesquisa") ? (" (" + year + ")") : '') + " - " + result[i].name;
                result[i].link = result[i].link + links[0].link;
                result[i].year = (year && links[0].tipo == "pesquisa") ? year : undefined;
            }
        }
        //ask for a place
        if(places.length == 0 && links[0]["points"] > 0){
            result.push({
                type: "mensagem",
                name: "De onde?",
            });
        }
        //nothing found
        if(places.length == 0 && links[0]["points"] == 0){
            result.push({
                type: "mensagem",
                name: "Nenhum resultado foi encontrado!",
            });
        }
        return result;
    }

}