//==========================================
// Variables List
//==========================================
const url = "http://localhost:3000/api/teddies";

//Pointer
const mainProduct = document.querySelector("main");

// Get the id from the url
let urlParameter = new URLSearchParams(window.location.search);
let id = urlParameter.get("_id");

// Use for stack the color option data.
let optionColor = "";
let getColor = "";

//Variable for checking algorithm
let productArray = [];

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
		mainProduct.innerHTML = teddieDisplayInfo(product);
		submitChecker();
	})
	.catch((err) => {
		console.log(err);
		displayErrorMessage();
	});

/*=====================================================
 *       FUNCTION LIST
 *====================================================*/

// will display a H2 information message for the user if fetch catch an error.
const displayErrorMessage = () => {
	mainProduct.innerHTML = `
    <h2>Veuillez réessayer utltérieumenent, une erreur s'est produite.</h2>
    `;
};

// | A loop for to go throught all the color in the list and add it.
function loopColor(param) {
	for (let color of param.colors) {
		optionColor += `<option value="${color}">${color}</option>`;
	}
}

/*--------------------------------------------------------------------------------
 *																		SUBMIT
 *---------------------------------------------------------------------------------
 * Send to localStorage the information of the product, id, color and quantity.
 */
function submitChecker() {
	const submitButton = document.getElementById("productSubmit");
	submitButton.onclick = (data) => {
		const colorPointer = document.getElementById("optionColor").value;
		const QuantityPointer = document.getElementById("productQuantity").value;
		let objectToAdd = {
			id: id,
			color: colorPointer,
			quantity: QuantityPointer,
		};

		if (localStorage.length > 0) {
			storageToArray();

			let firstFiltredArray = productArray.filter(
				(e) => e.id === objectToAdd.id
			);
			let secondFiltreddArray = firstFiltredArray.filter(
				(e) => e.color === objectToAdd.color
			);
			if (secondFiltreddArray.length === 0) {
				arrayToStorage(objectToAdd);
			}
			if (secondFiltreddArray.length === 1) {
				/* 1 ajouter la quantité du produit filtré restant
				 * parseInt(productArray[0].quantity) + parseInt(objectToAdd.quantity)
				 * Si quantityA + quantityB >=9, quantityB = 9; et affichage d'un message
				 * quantité maximum en stock atteinte.
				 * si quantityA + quantityB < 9, quantityB = quantityA + quantityB;
				 * Puis construire un premier tableau avec tous les éléments qui n'ont
				 * ni l'id, ni la couleur du produit => arrayWithoutNewProduct;
				 * Puis il faut tout combiner.
				 * Donc arrayWithNewProduct = arrayWithoutNewProduct.unshiftt(objectToAdd);
				 * Puis productArray = JSON.stringify(arrayWithNewProduct);
				 */
				let quantityA = parseInt(productArray[0].quantity);
				let quantityB = parseInt(objectToAdd.quantity);

				//Recreate an array with all the products excepts the one submitted
				let arrayWithoutProduct = productArray.filter(
					(e) => e.id !== objectToAdd.id
				);
				let b = productArray.filter((e) => e.id === objectToAdd.id);
				let c = b.filter((e) => e.color !== objectToAdd.color);

				for (let i = 0; i < c.length; i++) {
					arrayWithoutProduct.unshift(c[i]);
				}

				quantityB = quantityA + quantityB;
				if (quantityB >= 9) {
					document.getElementById("productQuantity").value = 9;
					quantityB = 9;
					objectToAdd.quantity = "9";
					arrayWithoutProduct.unshift(objectToAdd);
					arrayWithProduct = JSON.stringify(arrayWithoutProduct)
					localStorage.setItem("productItem", arrayWithProduct);
					displayMaxQuantityMessage();
				}
				if (quantityB < 9){
					objectToAdd.quantity = quantityB;
					arrayWithoutProduct.unshift(objectToAdd);
					arrayWithProduct = JSON.stringify(arrayWithoutProduct)
					localStorage.setItem("productItem", arrayWithProduct);
				}
			}
			return (productArray = []);
		}
		if (localStorage.length === 0) {
			arrayToStorage(objectToAdd);
			return (productArray = []);
		}

		// document.location.href = "./cart.html";
	};
}

//======  =======  =======  =======  =======

function foundId(item, check) {
	return (item.id = check.id);
}

function storageToArray() {
	let getToArray = localStorage.getItem("productItem");
	let parseToArray = JSON.parse(getToArray);
	productArray = parseToArray;
	return productArray;
}

function arrayToStorage(teddieObject) {
	productArray.unshift(teddieObject);
	console.log(productArray);
	productArray = JSON.stringify(productArray);
	localStorage.setItem("productItem", productArray);
	productArray = JSON.parse(productArray);
	return productArray;
}
// ---------------------------------------------------------------------------------

function quantityChecker() {
	let quantity = document.getElementById("productQuantity").value;

	quantity.addEventListener("change", (val) => {
		if (val > 9) {
			displayMaxQuantityMessage();
		}
	});
}

function displayMaxQuantityMessage() {
	const quantityBox = document.querySelector(".product__quantity__box");
	quantityBox.innerHTML += `<p class="product__quantity--error-message">La quantité maximale est atteinte</p>`;
}

//- - - - - - - - - - - - - - - - - -
function teddieDisplayInfo(product) {
	return `
      <section class="product-card">

      <div class="product__img-box" >
        <img class="product__img" src="${
					product.imageUrl
				}" alt="Image du nounours ${product.name}" />
      </div>

      <article class="product__informations">

          <h2 class="product__name">${product.name}</h2>
          <p class="product__id">Référence : ${product._id}</p>
          <label for="option__color">Choisissez votre couleur de peluche</label>
          <select id="optionColor">
            ${optionColor}
          </select>
					<div class="product__quantity__box">
          	<input type="number" name="product__quantity" class ="product__quantity" id="productQuantity" min="0" max="9" value="1" />
					</div>
          <aside class="product__description">
            <h3 class="product__title">Description</h3>
            <p class="product__description__paragraph">${
							product.description
						}</p>
          </aside>

          <div class="center-box">
            <p class="product__price">${formatter.format(
							parseInt(product.price) / 100
						)}</p>
            <button class="btn" id="productSubmit">Ajouter au panier</button>
          </div>

      </article>
    
    </section>
      `;
}
