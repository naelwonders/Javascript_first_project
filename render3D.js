import * as THREE from 'three';

console.log(THREE)

// factory function: comment creer des objets sans faire des classes (avec une fonction génératrice)
var createCharacter = function (name, lives, tex){
    var self = {}
    self.name = name
    self.lives = lives
    var texture = tex
    var pos = {x:0,y:0}

    var getDamage = function (howMany) {
        self.lives = self.lives - howMany
        if (lives<=0) {
            alert("Aaaargh")
        }
        return lives
    }

    var getLives = function () {
        return lives
    }

    var setPosition = function (x, y){
        pos.x  = x
        pos.y = y
    }

    var translate = function (x) {
        pos.x += x
    }

    var getPosition = function () {
        return pos
    }

    var getTexture = function () {
        return texture
    }

    self.getDamage = getDamage;
    self.getLives = getLives;
    self.getPosition = setPosition
    self.translate = translate;
    self.setPosition = setPosition;
    self.getTexture = getTexture; 
    return self
}

var createRenderEngine3d = function (canvasTarget) {
    var self = {}
    var posInit = 50
    var posY = 200
    var state = undefined
    var is_jumping = false
    var is_falling = false
    var speed = 1
    var jumping_speed = 5
    var img = new Image() // fonction qui fabrique une image
    img.src = "./img/terre.png"

    //valiables globales threejs
    var scene = undefined
    var camera = undefined
    var lamp = undefined
    var mesh = undefined // une boite dans laquelle tu les geometries et le materiel (et textures)
    var renderer = undefined
    var cube = undefined

    var createEnv = function() {
        //creer une scene THREE JS
        scene = new THREE.Scene()// instentier un element sur base d'une fonction, mettre une majuscule car c'est une class
        camera = new THREE.PerspectiveCamera(75, window.innerWidth, window.innerHeight, 0.1, 1000) // ratio entre la largeur et hauteur de ma vue
        renderer = new THREE.WebGLRenderer()
        renderer.setSize(window.innerWidth,window.innerHeight) // le nombre de pixels de notre renderer
        document.body.appendChild(renderer.domElement) // pour ajouter un element HTML, notre renderer
        
        
        //create the cube
        var geometry = new THREE.BoxGeometry(1,1,1) //on fait une boite
        var material = new THREE.MeshBasicMaterial({color: 0x00ff00}) //argument est sous forme d'objet
        cube = new THREE.Mesh(geometry,material)
        scene.add(cube)
        
        //position de la camera
        camera.position.z = 5
        //renderer.render(scene, camera) //on le met dans la fonction render pour qu'il s'update a chaque frame
    }

    // recupere l'element html (class du canva: "render2d")
    var init = function () {
        var canvas = document.querySelector(canvasTarget)
        var ctx = canvas.getContext('2d') 
        
        createEnv()
        

        var onKeyDown = function(event){
            console.log(event)
            if (event.key == "d") {
                state = "right"
                cube.rotation.x += 0.1
            }
            
            if (event.key == "q") {
                state = "left"
            }
            if (event.key == "z" && !is_jumping && !is_falling) {
                is_jumping = true
            }
        }

        var onKeyUp = function(event) {
            if (event.key == "d" || event.key == "q") {
                state = undefined
            }
        }

        var render = function() {
            ctx.clearRect(0,0,canvas.width, canvas.height)
            ctx.drawImage(img,posInit,posY) 
            //rectangle: fillRect(x,y,width,height) 
            //ctx.fillStyle = "blue" //a partir de mtn, remplit de cette couleur

            renderer.render(scene, camera)
        }

        var process = function() {
            // definir une mise a jour de posInit selon le state du cube, right ou left (opération sur les elements)
            //quand state = left, notre pos init est changé pour que ca se déplace a gauche, same pour right
            // il faut clear avant le dessin, sinon tu effaces ce que tu dessines
            if (state == "right") {
                posInit += 5
            }
            if (state == "left") {
                posInit -= 5
            }
            if (is_jumping) {
                posY -= jumping_speed
                // pour qu'il arrete de sauter a 50 pixels
                if (posY < 50) {
                    is_jumping = false
                    is_falling = true
                }
            }
            if (is_falling) {
                posY = posY + jumping_speed
                if (posY > 200) {
                    is_falling = false
                }
            }
        }

        //variable qui pointe vers une fonction (fonction anonyme), elle aura un "site effect", pas de retour
        //c'est window parce que c'est tout le navigateur, pas juste le canvas (a chaque refraichissement de page, il se passera quelque chose)
        //fonction comme argument: c'est une recursion: une boucle de rendu: pour rafaichir a l'infini (jeu)
        var renderFrame = function(){
            render()
            process()
            console.log("hello")
            window.requestAnimationFrame(renderFrame)
        }

        renderFrame()

        document.addEventListener("keydown", onKeyDown) //onKeyDown est placé dans une variable et on a pas de return (on veut just qu'il execute la fonction)
        document.addEventListener("keyup", onKeyUp)
    }
    
    init()
    return self
}

export {createRenderEngine3d}