import "../scss/style.scss"
const Waves = require('node-waves');
const fetch = require('node-fetch');


let waves_config = {
   duration: 500,
   delay: 150
}
Waves.init(waves_config)
Waves.attach('.ripple', ['waves-light'])

const _$ = document.querySelector.bind(document)

const console_style = `
   color:white;
   padding: 1px;
   font-weight: 400;
   background: linear-gradient(215deg, rgba(7,51,194,1) 0%, rgba(56,255,102,1) 78%);
   font-size: 1rem; border-radius: 5px;
`;

let pokemon_list = [];
let user_list = [];
let url_list = [];

const listSort = list => {
   list.sort((a, b) => (a.id > b.id ? 1 : -1))
   return list
}

const listRemoveDuplicates = list => {
   list = Array.from(new Set(list.map(a => a.id))).map(id => list.find(a => a.id === id))
   return list
}

const appendToList = rawData => {
   let new_list = []
   try {
      rawData.map(pokemon => {
         const newPokemon = {
            id: pokemon.id,
            name: pokemon.name,
            height: pokemon.height,
            weight: pokemon.weight,
            image: pokemon.sprites.other.dream_world.front_default,
            stats: [
               {
                  name: pokemon.stats[0].stat.name,
                  stat_points: pokemon.stats[0].base_stat
               },
               {
                  name: pokemon.stats[1].stat.name,
                  stat_points: pokemon.stats[1].base_stat
               },
               {
                  name: pokemon.stats[2].stat.name,
                  stat_points: pokemon.stats[2].base_stat
               },
               {
                  name: pokemon.stats[3].stat.name,
                  stat_points: pokemon.stats[3].base_stat
               },
               {
                  name: pokemon.stats[4].stat.name,
                  stat_points: pokemon.stats[4].base_stat
               },
               {
                  name: pokemon.stats[5].stat.name,
                  stat_points: pokemon.stats[5].base_stat
               }
            ],
            info: `https://pokemondb.net/pokedex/${pokemon.name}`,
            dream_world: true
         }
         if (newPokemon.image === null || newPokemon.image === undefined) {
            newPokemon.image = pokemon['sprites']['other']['official-artwork']['front_default']
            newPokemon.dream_world = false
         }
         pokemon_list.push(newPokemon)
         new_list.push(newPokemon)
      })
   } catch (err) {
      console.log('New Pokemon write failed:', err)
   }
   pokemon_list = [...listSort(pokemon_list)]
   pokemon_list = [...listRemoveDuplicates(pokemon_list)]
   return new_list
}

const fetchPokemon = async urls => {
   try {
      const res = await Promise.all(urls.map(pokemon_id => fetch(pokemon_id)))
      const resJson = await Promise.all(res.map(pokemon => pokemon.json()))
      let pushToList
      if (resJson.length === urls.length) {
         pushToList = await appendToList(resJson)
         _$('.lds-ellipsis').style.display = 'none'
         _$('.home__load-more').style.display = 'grid'
      }
      const pushedList = await displayPokemonList(pushToList)
   }
   catch (err) {
      console.log('Fetch Failed: ' + err)
   }
}

const loadPokemon = (start, end) => {
   url_list = []
   for (let i = start; i <= end; i++) {
      url_list.push(`https://pokeapi.co/api/v2/pokemon/${i}`)
   }
   fetchPokemon(url_list)
}


// INITIAL LOAD
let start = 1
let end = 50

loadPokemon(start, end)

_$('.home__load-more').addEventListener('click', (e) => {
   start = end+1
   end += 50
   if (end > 898) end = 898
   loadPokemon(start, end)
   _$('.home__load-more').style.display = 'none'
   _$('.lds-ellipsis').style.display = 'inline-block'
})

const displayPokemonList = (pokemons) => {
   pokemons.map(pokemon => {
      let pCard = document.createElement('pokemon-card')
      pCard.setAttribute('id', pokemon.id)
      pCard.setAttribute('name', pokemon.name)
      pCard.setAttribute('height', pokemon.height)
      pCard.setAttribute('weight', pokemon.weight)
      pCard.setAttribute('image', pokemon.image)
      pokemon.stats.map(stat => {
         pCard.setAttribute(stat.name, stat.stat_points)
      })
      pCard.setAttribute('info', pokemon.info)
      if (pokemon.dream_world) pCard.setAttribute('dream_world', '')
      document.querySelector('.home__content').appendChild(pCard);
   })
}

const displayUserPokemonList = (pokemons) => {
   document.querySelector('.list__content').innerHTML = ''
   pokemons.map(pokemon => {
      let pCard = document.createElement('pokemon-card')
      pCard.setAttribute('id', pokemon.id)
      pCard.setAttribute('name', pokemon.name)
      pCard.setAttribute('height', pokemon.height)
      pCard.setAttribute('weight', pokemon.weight)
      pCard.setAttribute('image', pokemon.image)
      pokemon.stats.map(stat => {
         pCard.setAttribute(stat.name, stat.stat_points)
      })
      pCard.setAttribute('info', pokemon.info)
      if (pokemon.dream_world) pCard.setAttribute('dream_world', '')
      document.querySelector('.list__content').appendChild(pCard);
   })
}

const displayPokemon = (pokemon) => {
   document.querySelector('.list__search-result').innerHTML = ''
   let pCard = document.createElement('pokemon-card')
   pCard.setAttribute('id', pokemon.id)
   pCard.setAttribute('name', pokemon.name)
   pCard.setAttribute('height', pokemon.height)
   pCard.setAttribute('weight', pokemon.weight)
   pCard.setAttribute('image', pokemon.image)
   pokemon.stats.map(stat => {
      pCard.setAttribute(stat.name, stat.stat_points)
   })
   pCard.setAttribute('info', pokemon.info)
   if (pokemon.dream_world) pCard.setAttribute('dream_world', '')
   document.querySelector('.list__search-result').appendChild(pCard);
}

/**
 * Template can also be called from existing template within html document
 * 
 * const cardTemplate = document.querySelector('#pokemon-card-template');
*/
const cardTemplate = document.createElement('template');
cardTemplate.innerHTML = `
   <div part="container">
      <img id="img" part="img">
      <ul part="col">
         <li part="row">
            <span part="row-title">Name:</span>
            <span id="name" part="row-stat"></span>
         </li>
         <li part="row">
            <span part="row-title">Height:</span>
            <span id="height" part="row-stat"></span>
         </li>
         <li part="row">
            <span part="row-title">Weight:</span>
            <span id="weight" part="row-stat"></span>
         </li>
         <li part="row">
            <span part="row-title">HP:</span>
            <span id="hp" part="row-stat"></span>
         </li>
         <li part="row">
            <span part="row-title">Attack:</span>
            <span id="att" part="row-stat"></span>
         </li>
      </ul>
      <ul part="col">
         <li part="row">
            <span  part="row-title">Defense:</span>
            <span id="def" part="row-stat"></span>
         </li>
         <li part="row">
            <span part="row-title">Special-Attack:</span>
            <span id="specAtt" part="row-stat"></span>
         </li>
         <li part="row">
            <span part="row-title">Special-Defense:</span>
            <span id="specDef" part="row-stat"></span>
         </li>
         <li part="row">
            <span part="row-title">Speed:</span>
            <span id="speed" part="row-stat"></span>
         </li>
         <li part="row">
            <a id="info" role="button" part="row-info ripple" target="_blank">
               More Info
               <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-right" part="row-info-svg" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path fill="currentColor" d="M0 384.662V127.338c0-17.818 21.543-26.741 34.142-14.142l128.662 128.662c7.81 7.81 7.81 20.474 0 28.284L34.142 398.804C21.543 411.404 0 402.48 0 384.662z"></path></svg>
            </a>
         </li>
      </ul>
   </div>
`;

class Card extends HTMLElement {
   constructor() {
      super();
      this._root = this.attachShadow({mode: 'open'})
      this._$ = this._root.querySelector.bind(this._root)
      this._root.appendChild(cardTemplate.content.cloneNode(true))
   }

   connectedCallback() {
      this._$('#img').setAttribute('src', this.image)
      this._$('#name').innerText = this.name.charAt(0).toUpperCase() + this.name.slice(1)
      this._$('#height').innerText = this.height
      this._$('#weight').innerText = this.weight
      this._$('#hp').innerText = this.hp
      this._$('#att').innerText = this.attack
      this._$('#def').innerText = this.defense
      this._$('#specAtt').innerText = this.spec_attack
      this._$('#specDef').innerText = this.spec_defense
      this._$('#speed').innerText = this.speed
      this._$('#info').setAttribute('href', this.info)
      if (!this.hasAttribute('dream_world')) {
         this._$('#img').setAttribute('style', 'transform: scale(1.1);')
      }
   }

   get image() {
      return this.getAttribute('image');
   }
   get name() {
      return this.getAttribute('name');
   }
   get height() {
      return this.getAttribute('height');
   }
   get weight() {
      return this.getAttribute('weight');
   }
   get hp() {
      return this.getAttribute('hp');
   }
   get attack() {
      return this.getAttribute('attack');
   }
   get defense() {
      return this.getAttribute('defense');
   }
   get spec_attack() {
      return this.getAttribute('special-attack');
   }
   get spec_defense() {
      return this.getAttribute('special-defense');
   }
   get speed() {
      return this.getAttribute('speed');
   }
   get info() {
      return this.getAttribute('info');
   }
   get dream_world() {
      return this.getAttribute('dream_world');
   }
}
customElements.define('pokemon-card', Card)


const home = document.getElementById('home')
const list = document.getElementById('list')
const docs = document.getElementById('docs')
const home_page = document.querySelector('.home__container')
const list_page = document.querySelector('.list__container')
const docs_page = document.querySelector('.docs__container')

const list_search = document.querySelector('.list__search-submit')
const list_input = document.querySelector('.list__search')
const list_add = document.querySelector('.list__option--add')
const list_remove = document.querySelector('.list__option--remove')
let current;

home.addEventListener('click', () => {
   if (!home.classList.contains('active')) {
      setTimeout(() => {
         home.classList.remove('waves-effect', 'waves-light')
         home_page.classList.add('active')
      }, 500)
      home.classList.add('active')
      
      list.classList.remove('active')
      list.classList.add('waves-effect', 'waves-light')
      list_page.classList.remove('active')
      docs.classList.remove('active')
      docs.classList.add('waves-effect', 'waves-light')
      docs_page.classList.remove('active')
   }
})

list.addEventListener('click', () => {
   if (!list.classList.contains('active')) {
      setTimeout(() => {
         list.classList.remove('waves-effect', 'waves-light')
         list_page.classList.add('active')
      }, 500)
      list.classList.add('active')
      
      home.classList.remove('active')
      home.classList.add('waves-effect', 'waves-light')
      home_page.classList.remove('active')
      docs.classList.remove('active')
      docs.classList.add('waves-effect', 'waves-light')
      docs_page.classList.remove('active')
   }
})

docs.addEventListener('click', () => {
   if (!docs.classList.contains('active')) {
      setTimeout(() => {
         docs.classList.remove('waves-effect', 'waves-light')
         docs_page.classList.add('active')
      }, 500)
      docs.classList.add('active')
      
      list.classList.remove('active')
      list.classList.add('waves-effect', 'waves-light')
      list_page.classList.remove('active')
      home.classList.remove('active')
      home.classList.add('waves-effect', 'waves-light')
      home_page.classList.remove('active')
   }      
})

list_search.addEventListener('click', e => {
   e.preventDefault()
   let val = list_input.value
   if (val === null || val === '') return
   let result = pokemon_list.filter(pokemon => pokemon.name === val.toLowerCase().trim())
   if (result.length === 0) return
   else displayPokemon(result[0])
   current = result[0]
   result = []
})

list_add.addEventListener('click', () => {
   if (current === undefined || current === null) return
   let result = user_list.filter(pokemon => pokemon.name === current.name.toLowerCase().trim())
   if (result.length !== 0) return
   if (result.length === 0) user_list.push(current)
   result = []
   displayUserPokemonList(user_list)
   console.log(user_list)
})

list_remove.addEventListener('click', () => {
   if (current === undefined || current === null) return
   let result = user_list.filter(pokemon => pokemon.name === current.name.toLowerCase())
   if (result.length === 0) return
   if (result.length !== 0) {
      let pos = user_list.findIndex(pokemon => {
         return pokemon.name === current.name.toLowerCase().trim()
      })
      console.log(pos)
      user_list.splice(pos, 1)
   } 
   result = []
   displayUserPokemonList(user_list)
   console.log(user_list)
})
