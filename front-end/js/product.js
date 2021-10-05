//==========================================
// Variables List
//==========================================
const url = "http://localhost:3000/api/teddies";

//Pointer
const mainProduct = document.querySelector("main");

// Get the id from the url
let urlParameter = new URLSearchParams(window.location.search);
let id = urlParameter.get("_id");
let reachedMaxQuantity = false;

// Use for stack the color option data.
let optionColor = "";
let getColor = "";

//=====================================
//        SCENARIO
//=====================================

//Display the teddie with it's information and specificities.
function fetchData() {
	fetch(url + "/" + id)
		.then((res) => res.json())
		.then((product) => {
			// (1) | playing the loop to get the color before injecting HTML.
			loopColor(product);

			// (2) | Injecting HTML here.
			mainProduct.innerHTML = teddieDisplayInfo(product);

			// (2) | Initialize the listener to store data in the LocalStorage for the cart page.
			submit();
		})
		.catch((err) => {
			console.log(err);
			//Display an information for the user that teddies could not load.
			displayErrorMessage();
		});
}
fetchData();

/*=====================================================
 *       FUNCTION LIST
 *====================================================*/

// (1) | A loop for to go throught all the color in the list and add it.
function loopColor(param) {
	for (let color of param.colors) {
		optionColor += `<option value="${color}">${color}</option>`;
	}
}

//----------------
// (2) | Display all information of the teddie in the html main__product
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

//----------------
// will display a H2 information message for the user if fetch catch an error.
const displayErrorMessage = () => {
	mainProduct.innerHTML = `
    <h2>Veuillez réessayer utltérieumenent, une erreur s'est produite.</h2>
    `;
};

//----------------
// Send to localStorage the information of the product, id, color and quantity.
async function submit() {
	const submitButton = document.getElementById("productSubmit");

	submitButton.onclick = (data) => {
		const productColor = document.getElementById("optionColor").value;
		const productQuantityPointer =
			document.getElementById("productQuantity").value;
		let productItem = {
			id: id,
			color: productColor,
			quantity: productQuantityPointer,
		};
		let productSerialized = JSON.stringify(productItem);
		localStorage.setItem("productItem", productSerialized);
	};
}

async function quantityChecker() {
	let quantity = document.getElementById("productQuantity").value;

	quantity.addEventListener("change", (val) => {
		if (val > 9) {
			reachedMaxQuantity = true;
			displayMaxQuantityMessage();
		}
	});
}

function displayMaxQuantityMessage() {
	const quantityBox = document.querySelector(".product__quantity__box");

	if (reachedMaxQuantity === true) {
		quantityBox.innerHTML += `<p class="">La quantité maximale est atteinte</p>`;
	}
}
//=======================================
/*LOGIQUE DE LA FUNCTION DE VERIF
 * - - - - - - - - - - - - - - - -
 * Si l'id n'est pas déjà dans le tableau
 *	 push du produit dans le tableau du localStorage
 *	Si l'id est dans le tableau
 *			Si la couleur n'est pas la même
 * 		push du produit dans le tableau du localStorage
 *			Si la couleur et l'id sont les même
 *					Si la quantité est >= a 9
 *					message d'alerte "La quantité maximal est atteinte."
 *					Si la quantité est < 9 && si la quantité à push + quantité déjà dans l'objet >= 9
 *					quantité === 9
 *					sinon quantité de l'objet + quantité à push
 *
 *- - - - - - - - - - - - - - - - - - - - - - - - - -
 *	function pour checker, pour insérér, pour modifier la quantité.
 *	Donc 3 fonctions ?
 * Est ce que j
 *
 */
function checkLocalStorage() {
	let array = localStorage();
}
