'use strict'
var colorObject = initColorObject();

var selectors = {
    cardColumns: '.js-card-columns'
}

var cache = {
    cardColumns: document.querySelector(selectors.cardColumns)
}

function initColorObject() {
    var typeColors = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'poison', 'psychic', 'rock', 'steel', 'normal', 'water'];
    var colorObject = {}
    typeColors.forEach(function (color) {
        colorObject[color] = getComputedStyle(document.documentElement).getPropertyValue(`--${color}-type-color`);
    })
    return colorObject;
}

// Funcion ordenadora para usar con Array.sort()
function comparePokeIds(a, b) {
    if (a['id'] > b['id']) {
        return 1;
    }
    if (a['id'] < b['id']) {
        return -1;
    }
    return 0;
}

function createCard(types, name, imageUrl) {
    var card = document.createElement('div')
    card.classList.add('card');

    var cardImage = document.createElement('img');
    cardImage.classList.add('card-img-top');
    cardImage.src = imageUrl;
    cardImage.alt = name;
    if (types.length == 2) {
        cardImage.style = `background: linear-gradient(90deg, ${colorObject[types[0]]} 50%, ${colorObject[types[1]]} 50%)`
    } else if (types.length == 1) {
        cardImage.style = `background: ${colorObject[types[0]]}`
    } else {
        cardImage.style = `background: red`
    }
    card.appendChild(cardImage);

    var cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    var bodyTitle = document.createElement('h5');
    bodyTitle.classList.add('card-title');
    bodyTitle.innerHTML = name;

    cardBody.appendChild(bodyTitle);

    types.forEach(function (color) {
        var bodyBadge = document.createElement('span');
        bodyBadge.classList.add('badge');
        bodyBadge.innerHTML = color;
        cardBody.appendChild(bodyBadge);
    })


    card.appendChild(cardBody);
    return card;
}

function createAllCards(pokemonList) {
    console.log(pokemonList[0]);
    pokemonList.forEach(function (pokemon) {
        let types = []
        let imageUrl = pokemon.sprites.other.dream_world.front_default;
        let name = pokemon.name;
        pokemon.types.forEach(function (typeObject) {
            types.push(typeObject.type.name);
        });

        cache.cardColumns.appendChild(createCard(types, name, imageUrl))
    })
}


fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var allPokemon = [];
        var allPromises = [];
        for (var i = 0; i < data.results.length; i++) {
            var thisPromise;
            thisPromise = fetch(data.results[i].url)
                .then(function (response) {
                    return response.json()
                })
                .then(function (pokemon) {
                    allPokemon.push(pokemon);
                })
            allPromises.push(thisPromise);
        }
        // Uso el promise.all para hacer algo luego de que todas las promesas se hayan cumplido
        Promise
            .all(allPromises)
            .then(function () {
                allPokemon.sort(comparePokeIds)
                createAllCards(allPokemon);
                return allPokemon;
            })

    })