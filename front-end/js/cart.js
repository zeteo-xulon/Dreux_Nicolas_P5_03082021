//=============================
//      VARIABLE
//=============================
const url = "http://localhost:3000/api/teddies";
const cartArticleContainer = document.getElementById("cartArticle");
const items = localStorage.productItem;
const itemQuantity = parseInt(items.quantity);
const messageBox = document.getElementById("display__message");

let incartProduct = JSON.parse(localStorage.getItem("productItem"));
let productId = incartProduct.id;
let productInCart = false;

//=============================
//      SCENARIO
//=============================
function display() {
	fetch(url + "/" + productId)
		.then((res) => res.json())
		.then((e) => {
      // (1) check the quantity of product in the cart
      LocalStorageQuantityCheck();

			// (2) | Injecting HTML here.
			cartInjection(e);
		});
}
display();

//=============================
//      FUNCTION
//=============================

/*
 *Fonction qui va inspecter ce qu'il y a dans le LocalStorage
 *
 * Si il y a quelque chose, alors elle va afficher les produits
 *   Si la quantité est > 9 alors quantité du produit === 9
 *   Ajout d'un texte "La quantité maximal est atteinte."
 *
 *Si il n'y a rien, alors afficher un message
 * "votre panier est vide."
 *
 */

const LocalStorageQuantityCheck = (param) => {
	if (items.length > 0) {
		if (itemQuantity > 9) {
			itemQuantity = 9;
			displayQuantityWarningMessage();
      return productInCart = true;
		}
	}
  if(items.length === 0){
    return productInCart = false;
  }
  return productInCart = true;
};

/* Fonction conditionnel qui vérifie que le panier à quelque chose
* Si c'est vrai
*   lancer la fonction d'injection de HTML.
*/

function cartInjection(param) {
  if (productInCart === true) {
    htmlInjector(param);
  }
  if (productInCart === false){
    displayEmptyCartMessage();
  }
}



//-----------------------------------------

const htmlInjector = (param) => {
  cartArticleContainer.innerHTML = injectTeddiesInCartList(param);
}

function injectTeddiesInCartList(param) {
	return `
  <a class="cart__link__product" href="./front-end/pages/product.html?_id=${
		param._id
	}">
  <img class="cart__product__img" src="${param.imageUrl}">
  </a>

  <div class="cart__product__box">
    <h2 class="cart__product__name">${param.name}</h2>
    <h3 class="cart__product__id">${param._id}</h3>
    <p class="cart__product__color">${incartProduct.color}</p>
  </div>

  

  <div class="cart__product__number__box">
    <input type="number" name="product__quantity" class="cart__product__quantity" id="cartProductQuantity" min="0" max="9" value='${
			incartProduct.quantity
		}'>
    <p class="cart__product__price">${formatter.format(
			parseInt(param.price) / 100
		)}</p>
  </div>

  
  `;
}

const displayQuantityWarningMessage = () => {
	messageBox.innerHTML = `<p class="message__text">La quantité maximal est de 9.</p>`;
};

const displayEmptyCartMessage = () => {
  cartArticleContainer.innerHTML = `<p class="empty__cart">Le panier est vide.</p>`;
}