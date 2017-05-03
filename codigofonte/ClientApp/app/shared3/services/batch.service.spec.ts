import { FooService } from './batch.service';
import 'rxjs/RX'

describe('Batch Service', () => {
    let service: FooService;

    beforeEach(() => {
        service = new FooService();
        service.passingThrough(1).subscribe(val => console.log('through 1', val));
        service.batch(1).subscribe(val => console.log('batch 1', val));
    })

    jest.useFakeTimers();

    it('deve retornar o mesmo valor', next => {
       setTimeout(() => {
           expect(true).toBe(false)
        }, 100)

        jest.runAllTimers();
    })

})