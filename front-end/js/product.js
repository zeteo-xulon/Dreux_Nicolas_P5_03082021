//==========================================
// Variables

let urlParameter = new URLSearchParams(window.location.search);
let id = urlParameter.get("_id");
console.log(urlParameter);
const fetchAdress = "http://localhost:3000/api/teddies" + "/" + id;
const mainProduct = document.querySelector('main');
let optionColor = "";


//=====================================
//Console log for checking data
console.log(fetchAdress);
console.log(id);
console.log(mainProduct);


//=====================================
//Display the teddie with it's information and specificities. 

const display = () => {
	fetch(fetchAdress)
		.then((res) => res.json())
		.then((product) => {
      console.log(product);

      //playing the loop to get the color before injecting HTML. | (1)
      loopColor(product);

      //Injecting HTML here. | (2)
      mainProduct.innerHTML = teddieDisplayInfo(product);
    })
		.catch((err) => {
			console.log(err);
			mainProduct.innerHTML = `
    <h2>Veuillez réessayer utltérieumenent, une erreur s'est produite.</h2>
    `;
		});
};

//=====================================================
// (1) | A loop for to go throught all the color in the list and add it.
const loopColor = (param) => {
  
  for(let color of param.colors) {
    optionColor += `<option value="${color}">${color}</option>`;
  };

};

//=====================================================
// (2) | Display all information of the teddie in the card
const teddieDisplayInfo = (product) => {
      return `
      <section class="product-card">

      <div class="product__img-box" >
        <img class="product__img" src="${product.imageUrl}" alt="Image du nounours ${product.name}" />
      </div>

      <article class="product__informations">

          <h2 class="product__name">${product.name}</h2>
          <p class="product__id">Référence : ${product._id}</p>
          <label for="option__color">Choisissez votre couleur de peluche</label>
              <select id="option__color">
                ${optionColor}
                </select>
          <input type="number" name="product__quantity" id="productQuantity" min="0" max="9">
        
          <aside class="product__description">
            <h3 class="product__title">Description</h3>
            <p class="product__description__paragraph">${product.description}</p>
          </aside>

          <div class="center-box">
            <p class="product__price">${product.price} RS</p>
            <button>Ajouter au panier</button>
          </div>

      </article>
    
    </section>
      `;
};
//=======================================

display();

