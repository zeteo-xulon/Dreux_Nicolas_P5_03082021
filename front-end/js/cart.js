//=============================
//      VARIABLE
//=============================
const cartArticleContainer = document.getElementById("cartArticleList");
const items = localStorage.productItem;
const itemQuantity = parseInt(items.quantity);
const messageBox = document.getElementById("display__message");
const totalPrice = document.getElementById("totalPrice");
const cartButton = document.getElementById("cartButton");
const shadeContainer = document.getElementById("formDisplay");

let incartProduct = JSON.parse(localStorage.getItem("productItem"));
let productInCart = false;
let priceList = [];
let totalQuantity = 0;

//regex
let regexName = new RegExp(/^[a-zA-Z\-]+$/);
// let regexEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/); c'est pas un peu trop ça ?
let regexEmail = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
let regexAddress = new RegExp(/^[a-zA-Z0-9\s,.'-]{3,}$/);
let regexCity = new RegExp(/^[a-zA-Z',.\s-]{1,25}$/);

//=============================
//      SCENARIO
//=============================
/*
 * Begin by a loop of all the product in the localStorage,
 * It will inject the HTML relative to all the elements
 * it will check the quantity, and correct what could be wrong
 * then it will calculate the price, and begin to listen what
 * happen on screen, to delete, or go to command information step.
 */

for (let i = 0; i < incartProduct.length; i++) {
	let item = incartProduct[i];
	htmlInjector(item);
	localStorageQuantityCheck(item);
}
priceCalculator();
listenEvent();

//=============================
//      FUNCTION
//=============================

function listenEvent() {
	document.addEventListener("click", (e) => {
		let totalPrice = parseInt(document.getElementById("totalPrice").innerText);
		if (e.target.matches(".fa-trash-alt")) {
			removeLocal("productItem", e);
			e.path[2].remove();
			priceCalculator();
		}
		if (e.target.matches("#cartButton")) {
			totalPrice <= 0
				? alert("Le panier est vide")
				: (priceCalculator(), formPopUp());
		}
	});
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function localStorageQuantityCheck(item) {
	if (item.quantity > 0) {
		if (itemQuantity > 9) {
			itemQuantity = 9;
			displayQuantityWarningMessage();
			return (productInCart = true);
		}
	}
	item.quantity === 0 ? (productInCart = false) : (productInCart = true);
}

function priceCalculator() {
	let quantityProductList = document.querySelectorAll(
		".cart__product__quantity"
	);
	let allPrice = document.querySelectorAll(".cart__product__price");
	let total = 0;

	for (let i = 0; i < quantityProductList.length; i++) {
		let quantity = quantityProductList[i].valueAsNumber;
		let price = parseInt(allPrice[i].textContent);
		let sum = quantity * price;
		total += sum;
	}
	totalPrice.innerHTML = formatter.format(total);
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

function formPopUp() {
	shadeContainer.innerHTML = injectForm();

	const shade = document.querySelector(".shade-screen");
	const exit = document.getElementById("formExit");
	const submit = document.getElementById("submitForm");
	const errorBox = document.querySelector(".display__error-text");

	exit.addEventListener("click", (r) => shade.remove());
	
	submit.addEventListener("click", (e) => {
		e.preventDefault();
		let firstName = document.getElementById("firstname").value;
		let lastName = document.getElementById("name").value;
		let address = document.getElementById("adress").value;
		let city = document.getElementById("city").value;
		let email = document.getElementById("email").value;

		// reset eventual old error message to dodge possible stack
		errorBox.innerHTML = "";

		// check every input, if it's not good, it don't go forward, and will display and error message for each situation.
		if (regexName.exec(firstName) === null) {
			errorBox.innerHTML += `<p>La syntaxe du prénom n'est pas valide.</p>`;
		}
		if (regexName.exec(lastName) === null) {
			errorBox.innerHTML += `<p>La syntaxe du nom de famille n'est pas valide.</p>`;
		}
		if (regexAddress.exec(address) === null) {
			errorBox.innerHTML += `<p>La syntaxe de l'adresse n'est pas valide.</p>`;
		}
		if (regexCity.exec(city) === null) {
			errorBox.innerHTML += `<p>La syntaxe de la ville n'est pas valide.</p>`;
		}
		if (regexEmail.exec(email) === null) {
			errorBox.innerHTML += `<p>La syntaxe de l'adresse email n'est pas valide.</p>`;
		}
		if (
			regexName.exec(firstName) !== null &&
			regexName.exec(lastName) !== null &&
			regexAddress.exec(address) !== null &&
			regexCity.exec(city) !== null &&
			regexEmail.exec(email) !== null
		) {
			let contact = {
				firstName: firstName,
				lastName: lastName,
				address: address,
				city: city,
				email: email,
			};

			let products = productArray();
			let payload = { contact, products };

			fetch("http://localhost:3000/api/teddies/order", {
				method: "POST",
				body: JSON.stringify(payload),
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((e) => {
					console.log(e);
					localStorage.removeItem("productItem");
					return (document.location.href =
						"./confirmation.html?orderId=" +
						e.orderId +
						"&firstName=" +
						e.contact.firstName +
						"&lastName=" +
						e.contact.lastName +
						"&total=" +
						parseInt(totalPrice.innerText));
				})
				.catch((err) => console.log(err));
		}

		
	});
}

function htmlInjector(item) {
	cartArticleContainer.innerHTML += injectTeddies(item);
}

function injectForm() {
	return `
	<div class="shade-screen">
	<article class="form__card">
		<form action="" method="get" class="form">
				<p class="form__exit" id="formExit">x</p>
				<p class="form__title">Veuillez remplir vos informations de livraison</p>
				<label for="firstname">Entrez votre prénom : </label>
				<input type="text" name="name" id="firstname" required>
				<label for="name">Entrez votre nom :</label>
				<input type="text" name="name" id="name" required>
				<label for="address">Entrez votre adresse :</label>
				<input type="text" name="name" id="adress" required>
				<label for="city">Ville :</label>
				<input type="text" name="name" id="city" required>
				<label for="email">Entrez votre adresse mail: </label>
				<input type="email" name="email" id="email" required>
				<div class="display__error-text"></div>
				<div class="form__button">
					<input type="submit" value="Commander" class="form__btn btn" id="submitForm">
				</div>
		</form>
	</article>
</div>
	`;
}
function injectTeddies(item) {
	return `
	<li class="cart__article">
		<a class="cart__link__product" href="./product.html?_id=${item.id}">
		<img class="cart__product__img" src="${item.imgUrl}" alt="image de la peluche ${
		item.name
	}">
		</a>

		<div class="cart__product__box">
			<h2 class="cart__product__name">${item.name}</h2>
			<h3 class="cart__product__id">${item.id}</h3>
			<p class="cart__product__color">${item.color}</p>
		</div>

		<div class="cart__product__number__box">
			<input type="number" name="product__quantity" class="cart__product__quantity" min="0" max="9" value='${
				item.quantity
			}' onchange='priceCalculator()'>
			<p class="cart__product__price">${formatter.format(
				parseInt(item.price) / 100
			)}</p>
			<i class="far fa-trash-alt"></i>
		</div>
	</li>
  
  `;
}

function get(key) {
	return JSON.parse(localStorage.getItem(key));
}
function store(key, array) {
	return localStorage.setItem(key, JSON.stringify(array));
}

/* Function to remove the selected product from localStorage
 *  @param key is the localStorage key
 *  @param caller is the info received from the eventlistener
 */
function removeLocal(key, caller) {
	let selectedId = caller.path[2].childNodes[3].childNodes[3].innerText;
	let selectedColor = caller.path[2].childNodes[3].childNodes[5].innerText;
	let arrayClip = get(key);
	let arrayWithoutProduct = arrayClip.filter(
		(e) => e.id != selectedId && e.color != selectedColor
	);
	store(key, arrayWithoutProduct);
}

function producArray() {
	let a = get("productItem");
	let b = [];
	a.forEach((data) => b.push(data.id));
	return b;
}

function productArray() {
	let array = [];
	let local = JSON.parse(localStorage.getItem("productItem"));
	local.forEach((element) => array.push(element.id));
	return array;
}
