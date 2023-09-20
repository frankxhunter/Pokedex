const container = document.querySelector(".container")
load = true;
const container_dialg = document.querySelector(".container_dialg")
var position = 0


axios.get("https://pokeapi.co/api/v2/pokemon?limit=40").then(
    response => {
        position+= 40
        let result = response.data.results;
        let html = "";
        result.forEach(element => {
            let parts = element.url.split("/");
            let num = parts[parts.length - 2];
            html += `
            <div class="pokemon" data-value="${element.url}" >
            <span class="name_pokemon">${num + "-" + element.name}</span>
            <div class="container_img"><img class="img_pokemon" alt="${element.url}" src="source/pokebola.png" ></div>
        </div>
            `
        });
        container.innerHTML = html
        loadImg();
        addEventDialg()
    })

 loadImg= async ()=> {
    const img_pokemons = document.querySelectorAll(".img_pokemon");

    img_pokemons.forEach((element)=>{
        axios.get(element.alt).then(response=>{
            element.src = (response.data.sprites.other.dream_world.front_default)
            load = true
            
        })
    })
}

window.addEventListener("scroll",()=>{
    if(load && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100){
        load= false
        axios.get(`https://pokeapi.co/api/v2/pokemon?limit=40&offset=${position}`).then(
            response => {
                position+= 40
                let result = response.data.results;
                let html = "";
                result.forEach(element => {
                    let parts = element.url.split("/");
                    let num = parts[parts.length - 2];
                    html += `
                    <div class="pokemon" data-value="${element.url}" >
                    <span class="name_pokemon">${num + "-" + element.name}</span>
                    <div class="container_img"><img class="img_pokemon" alt="${element.url}" src="source/pokebola.png" ></div>
                </div>
                    `
                });
                container.innerHTML += html
                loadImg();
                load = true
                addEventDialg()
            })
    }
})


function addEventDialg(){
    let pokemons = document.querySelectorAll(".pokemon");
    pokemons.forEach((e)=>{
        e.addEventListener("click",()=>{
             axios.get(e.getAttribute("data-value")).then((response)=>{
                axios.get(response.data.species.url).then((response2)=>{
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
                            <span class="name_info">N*${response.data.id +" "+ (response.data.name).toUpperCase()}</span>
                            <span class="type_info">${response2.data.genera[7].genus}</span>
                            <span>ALT.</span>
                            <span>2.0m</span>
                            <span>PESO </span>
                            <span>${response.data.height+".0kg"}</span>
                        </div>

                    </div>
                    <div class="description">
                       ${response2.data.flavor_text_entries[0].flavor_text.replace("", " ")}
                    </div>
                </div>

            </div>
                `
                    document.querySelector(".exit").addEventListener("click", ()=>{
                        container_dialg.innerHTML=""
                    })
                })
                
             })
        })
    })
}