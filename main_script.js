// Importando el resto de archivos js

const container = document.querySelector(".container");
const container2 = document.getElementById("container2")
var load = true;
const container_dialg = document.querySelector(".container_dialg")
var position = 0

// Esta funcion permite carga mas pokemones a partir de la posicion actual 
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
                    console.log(element)
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

// Permite crear la estructura basico de un div de un pokemon

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
    pokemon.appendChild(container_img);
    pokemon.appendChild(name_pokemon);

    pokemon.setAttribute("data-value", urlImg);
    name_pokemon.textContent = `${num + "-" + capitaliceFirstLetter(name)}`;
    img.setAttribute("src", "source/pokeball.png")
    img.setAttribute("alt", urlImg);

    return pokemon
}
const capitaliceFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Crea la primera carga de toda la informacion
const firstLoad = () => {
    axios.get("https://pokeapi.co/api/v2/pokemon?limit=40").then(
        response => {
            position += 40
            let result = response.data.results;
            const fragment = document.createDocumentFragment();
            let pokemon = null;
            result.forEach(element => {
                let parts = element.url.split("/");
                let num = parts[parts.length - 2];
                pokemon = getPokemon(element.url, num, capitaliceFirstLetter(element.name));
                fragment.appendChild(pokemon)
            });
            observer.observe(pokemon)
            container.appendChild(fragment);
            loadImg();
            addEventDialg()
        })
}
firstLoad();
// Realiza la carga 
// TODO corregir que no carge todo desde el principio
const loadImg = async () => {
    const img_pokemons = document.querySelectorAll(".img_pokemon");

    img_pokemons.forEach((element) => {
        axios.get(element.alt).then(response => {
            element.src = (response.data.sprites.other.dream_world.front_default)
            load = true

        })
    })
}

// Añade el evento de click para todos los pokemones
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

// Bar Search ////////////////////////////////////////

const formSearch = document.getElementById("barSearch_form");
const input_search = formSearch.elements["input_filter"];
const btn_submit = formSearch.elements["btn_submit"];
const btn_cancel = document.getElementById("btn_cancel");

// Agregar el evento de submit al formulario
formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    doSearch();
    showCancel();

})

btn_cancel.addEventListener("click", () => {
    showSubmit();
    showContainer();
    input_search.value = "";
})

const doSearch = () => {
    var text = input_search.value;
    if (text && text.trim().length > 0) {
        showContainer2();
        container2.innerHTML = "";
        position = 0;
        console.log(text)
        const url = `https://pokeapi.co/api/v2/pokemon/${text.toLowerCase()}/`
        axios.get(url).then((response) => {
            const data = response.data
            console.log(data)
            container2.appendChild(getPokemon(url, data.id, data.name));
            loadImg();
            addEventDialg();
        }).catch((err) => {
            container2.innerHTML = `
            <span style=" font-size: 40px; margin: auto;">Pokemon no encontrado 😓</span>
            `
        });

    }
}

const showSubmit = () => {
    btn_submit.classList.remove("hide");
    btn_cancel.classList.add("hide");
}

const showCancel = () => {
    btn_submit.classList.add("hide");
    btn_cancel.classList.remove("hide");
}

const showContainer = () => {
    container2.classList.add("hide");
    container.classList.remove("hide");
}
const showContainer2 = () => {
    container2.classList.remove("hide");
    container.classList.add("hide");
}


const menu = document.querySelector(".menu");
const menu_burger = document.querySelector(".menu_burger")

menu_burger.addEventListener("click",(e)=>{
    menu.classList.add("menu_appear")
})

const close_menu = document.querySelector(".close_menu");
close_menu.addEventListener("click", ()=>{
    menu.classList.remove("menu_appear")
})
const content_menu = document.querySelector(".container_menu")

const content_menu_mobile = document.querySelector(".content_menu_mobile")
const handleResize = (mq)=> {
    if(mq.matches){
        content_menu_mobile.appendChild(document.getElementById("barSearch_form"))
        content_menu_mobile.appendChild(document.querySelector(".bar"))
    }else{
        content_menu.appendChild(document.getElementById("barSearch_form"))
        content_menu.appendChild(document.querySelector(".bar"))
    }
}
const mediaQueryMobile = window.matchMedia("(max-width:900px");

handleResize(mediaQueryMobile);
mediaQueryMobile.addEventListener("change", handleResize)
