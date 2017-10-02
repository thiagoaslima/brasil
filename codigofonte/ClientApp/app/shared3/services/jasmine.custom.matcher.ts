const arrayMatcher : jasmine.CustomMatcherFactories = {
    contemPropriedades:  (util: jasmine.MatchersUtil, customEqualityTesters: Array<jasmine.CustomEqualityTester>)=> {
        
        return {
            
            compare: (objeto:any, propriedades:any) : jasmine.CustomMatcherResult=>{
                var falha = [];
                let result: jasmine.CustomMatcherResult = {
                    pass: false,
                    message: ''
                };
                for (var i=0;i<propriedades.length;i++) {
                    
                    if (!objeto.hasOwnProperty(propriedades[i])) {
                        falha.push(propriedades[i]);
                        //break;
                    }
                }

                if (falha.length>0) {
                    result.message = function() {
                        return 'O objeto não possue as seguintes propriedades obrigatórias: ['+ falha.join(',')+"]";
                    };
                    return result;
                }
                result.pass = true;
                result.message = 'PASS';
                return result;
            }
       }
    }
};

export {arrayMatcher};

