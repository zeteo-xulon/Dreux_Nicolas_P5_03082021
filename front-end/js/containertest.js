
let arrayTest = [];
let teddie1 = {id : 1234, name : "Nein", color : "yellow", quantity : 5};
let teddie2 = {id : 7656, name : "Pproli", color : "white", quantity : 2};
let teddie3 = {id : 5635, name : "Houl", color : "green", quantity : 1};


// Check la quantité de nounours dans le localStorage
function checker (teddieSubmitParam) {
  if(localStorage.length === 0){
    bbb();
  }
  if (localStorage.length > 0) {
    aaa();
    bbb();
  }
};


// Fonction qui attrape ce qu'il y a dans le storage, et le retourne a arrayTest.

function aaa(teddieSubmitParam) {
  arrayTest = [];
  arrayTest = localStorage.getItem('testProduct');
  arrayTest = JSON.parse(arrayTest);
};


// Fonction qui prend ce qu'il y a dans arrayTest, et l'envois dans le localStorage. (clean arrayTest ? )
function bbb(teddieSubmitParam) {
  arrayTest.unshift(teddieSubmitParam);
  arrayTest = JSON.stringify(arrayTest);
  localStorage.setItem('product', arrayTest);
  return arrayTest = [];
};