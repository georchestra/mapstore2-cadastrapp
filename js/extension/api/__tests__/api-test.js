import expect from 'expect';
import MockAdapter from 'axios-mock-adapter';
import axios from '@mapstore/libs/ajax';
import { getParcelleByCompteCommunal } from '../api';

describe('cadastrapp AJAX api', () => {
    let mockAxios;
    beforeEach(() => {
        mockAxios = new MockAdapter(axios);

    });
    afterEach(() => {
        mockAxios.restore();
    });
    describe('getParcelleByCompteCommunal', () => {
        beforeEach(() => {
            mockAxios = new MockAdapter(axios);

        });
        afterEach(() => {
            mockAxios.restore();
        });
        it('single value', (done) => {
            const comptecommunal = "abc";
            mockAxios.onPost().reply(function(config) {
                // `config` is the axios config and contains things like the url
                expect(config.data).toEqual("comptecommunal=abc");
                // return an array in the form of [status, data, headers]
                return [
                    200,
                    [{ "parcelle": "abc" }]
                ];
            });
            getParcelleByCompteCommunal({ comptecommunal }).then(data => {
                expect(data[0].parcelle).toEqual("abc");
                done();
            });
        });
        it('multiple values', (done) => {
            const comptecommunal = ["abc", "def"];
            mockAxios.onPost().reply(function(config) {
                // `config` is the axios config and contains things like the url
                expect(config.data).toEqual("comptecommunal=abc&comptecommunal=def");
                // return an array in the form of [status, data, headers]
                return [
                    200,
                    [{ "parcelle": "abc" }],
                    [{ "parcelle": "efg" }]
                ];
            });
            getParcelleByCompteCommunal({ comptecommunal }).then(data => {
                expect(data[0].parcelle).toEqual("abc");
                done();
            });
        });

    });
});