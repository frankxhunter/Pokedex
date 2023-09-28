const container = document.querySelector(".container")
load = true;
const container_dialg = document.querySelector(".container_dialg")
var position = 0


const loadMore = (entries) => {
    load = false
    if (entries[0].isIntersecting) {
        observer.unobserve(entries[0].target)
        axios.get(`https://pokeapi.co/api/v2/pokemon?limit=40&offset=${position}`).then(
            response => {
                position += 40
                let result = response.data.results;
                const fragment = document.createDocumentFragment();
                let pokemon = null;
                result.forEach(element => {
                    let parts = element.url.split("/");
                    let num = parts[parts.length - 2];
                    pokemon = getPokemon(element.url, num, element.name);
                    fragment.appendChild(pokemon)
                });
                observer.observe(pokemon);
                container.appendChild(fragment);
                loadImg();
                load = true
                addEventDialg()
            })
    }
}

const observer = new IntersectionObserver(loadMore);

const getPokemon = (urlImg, num, name) => {
    const pokemon = document.createElement("DIV");
    const name_pokemon = document.createElement("span");
    const container_img = document.createElement("DIV");
    const img = document.createElement("img");

    pokemon.classList.add("pokemon")
    name_pokemon.classList.add("name_pokemon")
    container_img.classList.add("container_img")
    img.classList.add("img_pokemon")

    container_img.appendChild(img);
    pokemon.appendChild(name_pokemon);
    pokemon.appendChild(container_img);

    pokemon.setAttribute("data-value", urlImg);
    name_pokemon.textContent=`${num + "-" + name}`;
    img.setAttribute("src", "source/pokebola.png")
    img.setAttribute("alt", urlImg);

    return pokemon
}
// axios.get("https://pokeapi.co/api/v2/pokemon?limit=40").then(
//     response => {
//         position+= 40
//         let result = response.data.results;
//         let html = "";
//         result.forEach(element => {
//             let parts = element.url.split("/");
//             let num = parts[parts.length - 2];
//             html += `
//             <div class="pokemon" data-value="${element.url}" >
//             <span class="name_pokemon">${num + "-" + element.name}</span>
//             <div class="container_img"><img class="img_pokemon" alt="${element.url}" src="source/pokebola.png" ></div>
//         </div>
//             `
//         });
//         container.innerHTML = html
//         loadImg();
//         addEventDialg()
//     })
axios.get("https://pokeapi.co/api/v2/pokemon?limit=40").then(
    response => {
        position += 40
        let result = response.data.results;
        const fragment = document.createDocumentFragment();
        let pokemon = null;
        result.forEach(element => {
            let parts = element.url.split("/");
            let num = parts[parts.length - 2];
            pokemon = getPokemon(element.url, num, element.name);
            fragment.appendChild(pokemon)
        });
        observer.observe(pokemon)
        container.appendChild(fragment);
        loadImg();
        addEventDialg()
    })

loadImg = async () => {
    const img_pokemons = document.querySelectorAll(".img_pokemon");

    img_pokemons.forEach((element) => {
        axios.get(element.alt).then(response => {
            element.src = (response.data.sprites.other.dream_world.front_default)
            load = true

        })
    })
}


function addEventDialg() {
    let pokemons = document.querySelectorAll(".pokemon");
    pokemons.forEach((e) => {
        e.addEventListener("click", () => {
            axios.get(e.getAttribute("data-value")).then((response) => {
                axios.get(response.data.species.url).then((response2) => {
                    container_dialg.innerHTML =
                        `
                <div class="background">
                <div class="dialg">
                    <div class="title_dialg">
                        <span></span>
                        <span class="title">DATOS DE LA POKEDEX</span>
                        <button class="exit">X</button>
                    </div>
                    <div class="info">
                        <div class="div_img_dialg">
                            <img src="${response.data.sprites.other.dream_world.front_default}" alt="" class="img_dialog">
                        </div>
                        <div class="text_info">
                            <span class="name_info">N*${response.data.id + " " + (response.data.name).toUpperCase()}</span>
                            <span class="type_info">${response2.data.genera[7].genus}</span>
                            <span>ALT.</span>
                            <span>2.0m</span>
                            <span>PESO </span>
                            <span>${response.data.height + ".0kg"}</span>
                        </div>

                    </div>
                    <div class="description">
                       ${response2.data.flavor_text_entries[0].flavor_text.replace("", " ")}
                    </div>
                </div>

            </div>
                `
                    document.querySelector(".exit").addEventListener("click", () => {
                        container_dialg.innerHTML = ""
                    })
                })

            })
        })
    })
}