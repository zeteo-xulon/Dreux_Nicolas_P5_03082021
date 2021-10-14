//==========================================
// Variables List
//==========================================
const url = "http://localhost:3000/api/teddies";

//Pointer
const mainProduct = document.querySelector("main");

// Get the id from the url
let urlParameter = new URLSearchParams(window.location.search);
let id = urlParameter.get("_id");

// stocker
let optionColor = "";
let getColor = "";

//=====================================
//        SCENARIO
//=====================================

/*Display the teddie with it's information and specificities.
 * (1) | playing the loop to get the color before injecting HTML.
 * (2) | Injecting HTML.
 * (3) | Initialize submit button that will check each time the product and localStorage object(s).
 * (!) | In case of error, it display an information for the user that teddies could not load.
 */
fetch(url + "/" + id)
	.then((res) => res.json())
	.then((product) => {
		loopColor(product);
		injectHtml(product);
		submitChecker(product);
	})
	.catch((err) => {
		console.log(err);
		displayErrorMessage();
	});

/*=====================================================
 *       FUNCTION LIST
 *====================================================*/
function displayErrorMessage() {
	mainProduct.innerHTML = `<h2>Veuillez réessayer utltérieumenent, une erreur s'est produite.</h2>`;
}

function displayMaxQuantityMessage() {
	const quantityBox = document.querySelector(".product__quantity__box");
	quantityBox.innerHTML += `<p class="product__quantity--error-message">La quantité maximale est atteinte</p>`;
}

function displayTeddieInfo(product) {
	return `
  	<section class="product-card">

      <div class="product__img-box" >
        <img class="product__img" src="${product.imageUrl}" alt="Image du nounours ${product.name}" />
      </div>

      <article class="product__informations">

          <h2 class="product__name">${product.name}</h2>
          <p class="product__id">Référence : ${product._id}</p>
          <label for="option__color">Choisissez votre couleur de peluche</label>
          <select id="optionColor">${optionColor}</select>
					<div class="product__quantity__box">
          	<input type="number" name="product__quantity" class ="product__quantity" id="productQuantity" min="0" max="9" value="1" />
					</div>
          <aside class="product__description">
            <h3 class="product__title">Description</h3>
            <p class="product__description__paragraph">${product.description}</p>
          </aside>

          <div class="center-box">
            <p class="product__price">${formatter.format(parseInt(product.price) / 100)}</p>
            <button class="btn" id="productSubmit">Ajouter au panier</button>
          </div>

      </article>
    
    </section>
      `;
}

function injectHtml(product) {
	mainProduct.innerHTML = displayTeddieInfo(product);
}

function loopColor(param) {
	for (let color of param.colors) {
		optionColor += `<option value="${color}">${color}</option>`;
	}
}

/*-----------------------------------------------------
 *											SUBMIT
 *-----------------------------------------------------
 * Create an object to add in the local storage
 * check the local Storage, if its not empty
 * it create 2 array, one with the object and then update it
 * one with all the objects except the actual one
 * then it create a last array with everything and
 * send it to localStorage.
 */
function submitChecker(product) {
	const submitButton = document.getElementById("productSubmit");
	submitButton.onclick = (data) => {
		const colorPointer = document.getElementById("optionColor").value;
		const QuantityPointer = document.getElementById("productQuantity").value;

		let objectToAdd = {
			id: id,
			color: colorPointer,
			quantity: QuantityPointer,
			name: product.name,
			imgUrl: product.imageUrl,
			price: product.price,
		};
		let array = [];
		if (localStorage.length > 0) {
			array = get("productItem");

			let filtredArray = []
			let arrayWithoutProduct = [];
			filtredArray = array.filter(
				(e) => e.id == objectToAdd.id && e.color == objectToAdd.color
			);
			arrayWithoutProduct = array.filter(
				(e) => e.id != objectToAdd.id && e.color != objectToAdd.color
			);
			if (filtredArray.length === 0) {
				arrayToStorage(objectToAdd, array, "productItem");
			}
			if (filtredArray.length === 1) {
				let quantityA = parseInt(filtredArray[0].quantity);
				let quantityB = parseInt(objectToAdd.quantity);
				quantityB = quantityA + quantityB;
				if (quantityB >= 9) {
					document.getElementById("productQuantity").value = 9;
					quantityB = 9;
					objectToAdd.quantity = "9";
					arrayToStorage(objectToAdd, arrayWithoutProduct, 'productItem');
					displayMaxQuantityMessage();
				}
				if (quantityB < 9) {
					objectToAdd.quantity = quantityB;
					arrayToStorage(objectToAdd, arrayWithoutProduct, 'productItem');
				}
			}
			return (document.location.href = "./cart.html");
		}
		if (localStorage.length === 0) {
			arrayToStorage(objectToAdd, array, "productItem");
			return (document.location.href = "./cart.html");
		}
	};
}

function get(key) {
	return JSON.parse(localStorage.getItem(key));
}

function store(key, material) {
	localStorage.setItem(key, JSON.stringify(material));
}

function arrayToStorage(teddieObject, param, key) {
	param.unshift(teddieObject);
	store(key, param);
	return param;
}
