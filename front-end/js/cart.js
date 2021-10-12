//=============================
//      VARIABLE
//=============================

const cartArticleContainer = document.getElementById("cartArticleList");
const items = localStorage.productItem;
const itemQuantity = parseInt(items.quantity);
const messageBox = document.getElementById("display__message");

let incartProduct = JSON.parse(localStorage.getItem("productItem"));
let productInCart = false;
let priceList = [];
let totalQuantity = 0;

//=============================
//      SCENARIO
//=============================

for (let i = 0; i < incartProduct.length; i++) {
	let item = incartProduct[i];
	htmlInjector(item);
	localStorageQuantityCheck(item);
}
cartQuantityCalculator();

//=============================
//      FUNCTION
//=============================

function localStorageQuantityCheck(item) {
	if (item.quantity > 0) {
		if (itemQuantity > 9) {
			itemQuantity = 9;
			displayQuantityWarningMessage();
			return (productInCart = true);
		}
	}
	if (item.quantity === 0) {
		return (productInCart = false);
	}
	return (productInCart = true);
}

function cartQuantityCalculator(item) {
	let quantityProductList = document.querySelectorAll(
		".cart__product__quantity"
	);
	for (let i = 0; i < quantityProductList.length; i++) {
		priceList.push(quantityProductList[i].valueAsNumber);
	}
	for (let i = 0; i < priceList.length; i++) {
		totalQuantity += priceList[i];
	}
}

function cartInjection(item) {
	productInCart ? htmlInjector(item) : displayEmptyCartMessage();
}

//-----------------------------------------

function displayEmptyCartMessage() {
	cartArticleContainer.innerHTML = `<p class="empty__cart">Le panier est vide.</p>`;
}

function displayQuantityWarningMessage() {
	messageBox.innerHTML = `<p class="message__text">La quantité maximal est de 9.</p>`;
}

function htmlInjector(item) {
	cartArticleContainer.innerHTML += injectTeddies(item);
}

function injectTeddies(item) {
	return `
	<li class="cart__article">
		<a class="cart__link__product" href="./product.html?_id=${item.id}">
		<img class="cart__product__img" src="${item.imgUrl}">
		</a>

		<div class="cart__product__box">
			<h2 class="cart__product__name">${item.name}</h2>
			<h3 class="cart__product__id">${item.id}</h3>
			<p class="cart__product__color">${item.color}</p>
		</div>

		<div class="cart__product__number__box">
			<input type="number" name="product__quantity" class="cart__product__quantity" min="0" max="9" value='${
				item.quantity
			}'>
			<p class="cart__product__price">${formatter.format(
				parseInt(item.price) / 100
			)}</p>
		</div>
	</li>
  
  `;
}
