"use strict";

/*  Two global vars:
 *----------------------------------
 *  {dictionary} is an Array contains
 *  all words in json.
 *  {dic_obj} is an Object stored all
 *  words as key and value '1';
 */

let dictionary;
let dic_obj = new Object({"dictionary":"0"});

/*  function init():
 *----------------------------------
 *  init() fill the global var dictionary
 *  by the method of XMLHttpRequest;
 *  eval(dic) makes string dic to an array.
 */

function init(){

    // object and api in Ajax
    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200)
        // to ensure a valid state to read file in server
        {
            let dic = xmlhttp.responseText;
            dictionary = eval("(" + dic + ")");
        }
    };

    // method and path to file
    xmlhttp.open("GET","./dictionary.txt",true);

    // send request to server
    xmlhttp.send();
    return true;
}

/*  function generate():
 *----------------------------------
 *  generate() fills global dic_obj
 *  up with words in dictionary as
 *  an array, the key in a word and
 *  value is '1' represents hasn't
 *  been searched;
 */

function generate(){

    for(let i = 0; i < dictionary.length; i++){

        // in the array dic_obj, key is a word
        let key  = dictionary[i] ;

        // value is '1' represents hasn't been searched.
        dic_obj[key] = '1';
    }

    return true;
}

/*  function inDic():
 *----------------------------------
 *  inDic() check if a word had been
 *  put into the array dic_obj and
 *  hasn't been searched. If word's
 *  value changed, inDic() won't find
 *  it.
 */

function inDic(w1){
    let inDic = dic_obj[w1];
    return (inDic === '1')
}


/*  function neibors(word):
 *----------------------------------
 *  neibors(word) return an array that
 *  contains words only differ one letter
 *  to the given word and in dictionary.
 *  this process doesn't change the value
 *  of each searched word in dic_obj.
 */

function neibors(word){

    // all letters
    const alp = "abcdefghijklmnopqrstuvwxyz";

    // used in travers
    let len = word.length;

    // the array to store neighbors
    let set = [];

    for(let i = 0; i < len; i++){
        for(let j = 0; j<alp.length; j++){

            // replace word[i] with alp[j]
            let nw = word.substr(0,i);
            nw += alp[j];
            nw += word.substr(i+1,);

            // check and push
            if(inDic(nw) && nw!==word) set.push(nw);
        }
    }
    return set;
}


/*  function chains():
 *----------------------------------
 *  chains() return the ladder in the
 *  form of array. it use the algorithm
 *  of BFS to ensure the shortest ladder.
 */

function chains(w1, w2){

    // an array to install those words who
    // had been visited to avoid visit twice
    let repeteWords = [];

    // an array that keeps each path
    let path = new Array(w1);

    // a big array contains every paths
    let playground = new Array(path);

    // the process of BFS
    while(playground.length !== 0){

        // first path in playground
        let headst = playground.shift();

        // neighbors of the last-in words in path
        let neib = neibors(headst[headst.length-1]);

        // visit each neighbors
        for(let i = 0; i < neib.length; i++){
            let word = neib[i];

            // skip the words that has been visited
            if(dic_obj[word] !== '2'){

                // find the target.
                if(word === w2){
                    headst.push(word);

                    // before the end, each visited word
                    // should be forgotten for next process
                    for(let j=0;j<repeteWords.length;j++){
                        dic_obj[repeteWords[j]] = '1';
                    }
                    return headst;

                }else{

                    // a deep copy of present path
                    let cpy = [];
                    for(let j = 0 ; j < headst.length;j++){
                        cpy.push(headst[j]);
                    }

                    // add the neighbor
                    cpy.push(word);

                    // add new path to playground
                    playground.push(cpy);

                    // remember the visited words
                    // to avoid visit twice
                    dic_obj[word] = '2';
                    repeteWords.push(word);
                }
            }
        }
    }

    // if no path between two words
    // visited words shall also be forgotten
    for(let i = 0 ; i < repeteWords.length; i++){
        dic_obj[repeteWords[i]] = '1';
    }
    return null;
}





/*
 * Below are functions used in HTML =================
 * to bind functions above with events ==============
 */






// global bool to show if its the beginning
let first_time = true;


// check if first word is in dictionary and
// give out result as prompt
function check_w1(){

    // init dictionary
    if(first_time){
        generate();
        first_time = false;
    }

    let c1 =  document.getElementById("check1");
    let w1 = document.getElementById("w1").value;

    if(!inDic(w1)){
        c1.style = ("color: rgb(224, 109, 109)");
        c1.innerHTML = "  Not find in dictionary.";
        return false;
    }else{
        c1.style = ("color: rgb(109, 207, 131)");
        c1.innerHTML = "  Okay.";
        return true;
    }
}



// check if the second word is in dictionary
// and the same length as the first word, then
// give out result as prompt
function check_w2(){
    if(first_time){
        generate();
        first_time = false;
    }

    let c2 =  document.getElementById("check2");
    let w2 = document.getElementById("w2").value;
    let w1 = document.getElementById("w1").value;
    let w1_size = w1.length;
    if(!inDic(w2)){
        c2.style = ("color: rgb(224, 109, 109)");
        c2.innerHTML = " Not find in dictionary. ";
        return false;
    }else{
        if(w2.length !== w1_size){
            c2.style = ("color: rgb(224, 109, 109)");
            c2.innerHTML = "  Not in the same length.";
            return false;
        }else{
            c2.style = ("color: rgb(109, 207, 131)");
            c2.innerHTML = "  Okay.";
            return true;
        }
    }
}


// show the result out
function showRes(){


    if(first_time){
        generate();
        first_time = false;
    }


    let w1 = document.getElementById("w1").value;
    let w2 = document.getElementById("w2").value;
    let right1 = check_w1();
    let right2 = check_w2();

    // make word1 and word2 in dic and in the same length
    if( !( right1 && right2) ) {
        alert("invalid input!");
    }else{
        let p2 = document.getElementById("prompt2");
        let pre = document.getElementById("preResult");

        p2.innerHTML = "Sorry !";
        pre.innerHTML = "No word Ladder from \""+w1+"\" to \""+w2+"\".";

        
        let line = chains(w1,w2);
        // fill the chain in a string
        let res_str = "";
        for(let i = 0; i<line.length;i++){
            res_str += line[i];
            if(i !== line.length-1) res_str+= " -- ";
        }


        if(res_str !== ""){
            p2.innerHTML = "A word Ladder from \""+w1+"\" to \""+w2+"\":";
            pre.innerHTML = res_str;
        }else{
            p2.innerHTML = "Sorry";
            pre.innerHTML = "there is not a word ladder from \""+w1+"\" to \""+w2+"\":";
        }
    }
}

