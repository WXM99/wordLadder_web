"use strict"



// WL is an object including methods in wordLadder.js
// Make sure your jQuery and http-server on
// to initialize this.dictionary and dic_obj

function WL()
{
    this.dictionary = [""];
    this.dic_obj = new Array({'0':'0'});

    this.init = function() {
        let xmlhttp;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            //if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let dic = xmlhttp.responseText;
            this.dictionary = eval("(" + dic + ")");
            //}
        };
        xmlhttp.open("GET", "../dictionary.json", true);
        xmlhttp.send();
        return true;
    };

    this.generate = function() {
        for (let i = 0; i < this.dictionary.length; i++) {
            let key = this.dictionary[i];
            this.dic_obj[key] = '1';
        }
        return true;
    };

    this.inDic = function(w1) {
        let inDic = this.dic_obj[w1];
        return (inDic === '1');

    };

    this.neibors = function(word) {
        const alp = "abcdefghijklmnopqrstuvwxyz";
        let len = word.length;
        let set = [];
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < alp.length; j++) {
                let nw = word.substr(0, i);
                nw += alp[j];
                nw += word.substr(i + 1,);
                if (this.inDic(nw) && nw !== word) set.push(nw);
            }
        }
        return set;
    };

    this.chains = function(w1, w2) {
        let repeteWords = new Array("");
        let path = new Array(w1);
        let playground = new Array(path);
        while (playground.length !== 0) {
            let headst = playground.shift();
            let neib = this.neibors(headst[headst.length - 1]);

            for (let i = 0; i < neib.length; i++) {
                let word = neib[i];
                if (this.dic_obj[word] !== '2') {
                    if (word === w2) {
                        headst.push(word);
                        for (let j = 0; j < repeteWords.length; j++) {
                            this.dic_obj[repeteWords[j]] = '1';
                        }
                        return headst;
                    } else {
                        let cpy = new Array("");
                        for (let j = 0; j < headst.length; j++) {
                            cpy.push(headst[j]);
                        }
                        cpy.push(word);
                        playground.push(cpy);
                        this.dic_obj[word] = '2';
                        repeteWords.push(word);
                    }
                }
            }
        }
        for (let i = 0; i < repeteWords.length; i++) {
            this.dic_obj[repeteWords[i]] = '1';
        }
        return null;
    }
}

let tset = new WL();
let expect = require('chai').expect;

describe('Test of Word Ladder: ', function() {
    it('Test open dictionary.json: ', function() {
        expect(tset.init()).to.be.ok;
    });
    it('Test create dictionary Obj by json: ',function () {
        expect(tset.generate()).to.be.ok;
    });
    it('Test "dode" in dictionary: ',function () {
        expect(tset.inDic("code")).to.be.ok;
    });
    it('Test "xxxx" not in dictionary: ',function () {
        expect(tset.inDic("xxxx")).to.be.not.ok;
    });
    it('Test "cade" is neighbor of "code": ',function () {
        expect(tset.neibors("code")).to.be.include("cade");
    });
    it('Test "xxx" has no neighbor: ',function () {
        expect(tset.neibors("xxx")).to.be.empty;
    });
    it('Test a chain form "cat" to "cot": ',function () {
        expect(tset.chains("cat","cot")).to.be.equal(["cat","cot"]);
    });
    it('Test a chain from "xx" to "yy": ',function () {
        expect(tset.chains("xx","yy")).to.be.equal(null);
    });
});
