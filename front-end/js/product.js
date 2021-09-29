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
          <input type="number" name="product__quantity" id="productQuantity" min="0" max="9" value="1" />
        
          <aside class="product__description">
            <h3 class="product__title">Description</h3>
            <p class="product__description__paragraph">${
							product.description
						}</p>
          </aside>

          <div class="center-box">
            <p class="product__price">${parseInt(product.price) / 100} €</p>
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
	const productColor = document.getElementById("optionColor").value;
	const productQuantity = document.getElementById("productQuantity").value;
	const submitButton = document.getElementById("productSubmit");
	//on click, it will collect all the data
	submitButton.onclick = function (data) {
		let productItem = {
			id: id,
			color: productColor,
			quantity: productQuantity,
		};
		let productSerialized = JSON.stringify(productItem);
		localStorage.setItem("productItem", productSerialized);
	};
}

//=======================================
