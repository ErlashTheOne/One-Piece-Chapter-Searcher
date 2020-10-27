window.onload = function() {
    let button = document.querySelector("#searchButton");
    let search = document.querySelector("input[type='search']");
    search.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
          // Cancel the default action, if needed
          event.preventDefault();
          // Trigger the button element with a click
          button.click();
        }
      });
    button.addEventListener("click", searchPokemon);
    
}; 

function searchPokemon(){
    let ficha = document.querySelectorAll(".fichaPokemon");
    if(ficha){
        for (let j = 0; j < ficha.length; j++) {
            ficha[j].remove();   
        }
    }
    console.clear();
    let search = document.querySelector("input[type='search']").value.toLowerCase();
    let div = document.querySelector("#data");
    axios.get('https://pokeapi.co/api/v2/pokemon/' + search)
    .then(function (response){
        console.log(response.data);

        if(response.data.name){

            let newDiv = document.createElement("div");
            let frontImage = document.createElement("img"); 
            let backImage = document.createElement("img"); 
            let shinyFront = document.createElement("img"); 
            let shinyBack = document.createElement("img");
            let h1 = document.createElement("h1");
            let nPkdx = document.createElement("p");
            let pShiny = document.createElement("p");
            let pTypes = document.createElement("p");
            
            newDiv.className = "fichaPokemon";

            frontImage.src = response.data.sprites.front_default;
            backImage.src = response.data.sprites.back_default;
            shinyFront.src = response.data.sprites.front_shiny;
            shinyBack.src = response.data.sprites.back_shiny;


            const name = response.data.name
            const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1)    
            let title = document.createTextNode(nameCapitalized);
            h1.appendChild(title);

            let textNPkdx = document.createTextNode(`Nº Pkdx: ${response.data.id}`);
            nPkdx.appendChild(textNPkdx);

            let shinyText = document.createTextNode("Shiny:");
            pShiny.appendChild(shinyText);


            let types = "Tipo(s): ";
            response.data.types.forEach(element => {
                types += element.type.name + " ";
            }); 

            let typesText = document.createTextNode(types);
            pTypes.appendChild(typesText);

            newDiv.appendChild(h1);
            newDiv.appendChild(nPkdx);
            newDiv.appendChild(frontImage); 
            newDiv.appendChild(backImage); 
            newDiv.appendChild(pShiny);
            newDiv.appendChild(shinyFront);
            newDiv.appendChild(shinyBack);
            newDiv.appendChild(pTypes);
            div.appendChild(newDiv);

            //Local storage
            // localStorage.setItem("pokeImg", response.data.sprites.front_default);
            // let img = localStorage.getItem("pokeImg");
            // console.log(img);
        }
        else {
            showError("Introduce algun valor.", div);
        }
    })
    .catch(function (error){
        console.log(error);
        showError("No existe ningun pokemon con ese nombre.", div);
    })
}

function showError(string, div){
    let newDiv = document.createElement("div");
    newDiv.className = "fichaPokemon";
    let pError = document.createElement("p");
    let errorMsg = document.createTextNode(string);
    pError.appendChild(errorMsg);
    pError.style.color = "red";
    newDiv.appendChild(pError);
    div.appendChild(newDiv);
}