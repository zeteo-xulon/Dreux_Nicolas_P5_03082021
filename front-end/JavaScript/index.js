async function fetching() {
	await fetch("http://localhost:3000/api/teddies")
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
		})
		.then((data) => {

			console.log(data);
      
      //Boucle de récupération des images de chaque objet du tableau
      for(teddie of data){
        document.querySelector(".teddie__list").innerHTML += `
        <a class="teddie__card" href="./pages/product.html">
        <img src="${teddie.imageUrl}" alt="Image d'ours en peluche">
      </a>
        `;
      }

		})
		.catch((err) => console.log(err));
}


fetching();

// pour rappel du HTML
	/* <h3 class="teddie__id"></h3>
<h4 class="teddie__name"></h4>
<p class="teddie__description"></p>
<h5 class="teddie__price"></h5> */

