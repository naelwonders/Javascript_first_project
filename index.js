import {startDialogue} from "./exercice.js"
import {sayHi} from "./exo2.js"
import {createCharacter, createRenderEngine} from "./render2D.js"
import { createRenderEngine3d } from "./render3D.js"

startDialogue()
sayHi()

// create character est une factory function car elle est productrice
var martine = createCharacter("Martine", 5,"./img/terre.png") // return un objet vide
console.log (martine.getDamage(2))
console.log(martine.setPosition(100,200))
console.log(martine)

var lechiendemartine = createCharacter("Le chien de martine", 10) // return un objet vide
console.log(lechiendemartine.name)
console.log(lechiendemartine.lives)

// moteur de rendu en 2D qu'on était en train de creer (parametre)
createRenderEngine3d(".render2d")
