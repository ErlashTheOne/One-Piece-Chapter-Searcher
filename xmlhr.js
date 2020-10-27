window.onload = function() {
    let button = document.querySelector("#searchButton");
    var umbreon;
    searchPokemons();

    button.addEventListener("click", showPokemon);
};

function searchPokemons(){
    let request = new XMLHttpRequest();
    request.open("get", "https://pokeapi.co/api/v2/pokemon/rayquaza");
    request.onreadystatechange = function(){
        if(request.readyState === 4 && request.status === 200){
            response = JSON.parse(request.response);
            umbreon = response;
            //console.log(umbreon);
        }
    }
    request.send();
}

function showPokemon(){
    console.log(umbreon);
    document.querySelector("#image").innerHTML = `<img src="${umbreon.sprites.front_shiny}">`;
}