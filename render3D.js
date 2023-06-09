import * as THREE from 'three';
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js" // pour blender
// attention, sur blender, il faut ajouter un materiel sinon rien ne se voit :)

console.log(THREE)

var createRenderEngine3d = function (canvasTarget) {
    var self = {}
    var posInit = 50
    var posY = 200
    var state = undefined
    var is_jumping = false
    var is_falling = false
    var speed = 1 // unité en pixel
    var speed_3D = 0.1 //unité en fonction de la taille du cube !!! donc c'est plus vite (three js)
    var jumping_speed = 5
    var jumping_speed_3D = 0.3
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
        camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000) // ratio entre la largeur et hauteur de ma vue
        renderer = new THREE.WebGLRenderer({alpha:true}) //alpha : afficher l'arrèire plan, plutot que du noir
        renderer.setSize(window.innerWidth,window.innerHeight) // le nombre de pixels de notre renderer
        document.body.appendChild(renderer.domElement) // pour ajouter un element HTML, notre renderer
        
        
        //create the cube
        var geometry = new THREE.BoxGeometry(1,1,1) //on fait une boite
        var material = new THREE.MeshBasicMaterial({color: 0x00ff00}) //argument est sous forme d'objet
        cube = new THREE.Mesh(geometry,material)
        
        
        const map = new THREE.TextureLoader().load('./img/terre.png')
        //const map = new THREE.TextureLoader().load('./img/terre.png') pour faire un autre coté
        const materialSprite = new THREE.SpriteMaterial({map:map})

        cube = new THREE.Sprite(materialSprite)
        
        scene.add(cube)

        //  ajouter une lumiere (il import pas la lumiere de blender)
        var light = new THREE.AmbientLight(0x404040)
        scene.add(light)
        
        //position de la camera
        camera.position.z = 5
        //renderer.render(scene, camera) //on le met dans la fonction render pour qu'il s'update a chaque frame

        importScene() // bien mettre après car on doit recevoir scene avant
    }
    
    //on a importer fichier blender en format gltf (extended) dans notre fichier img
    // on va importer notre scene blender
    // callback: on attend que quelque chose soit terminé pour faire les prochaines étapes
    var importScene = function () {
        var loader = new GLTFLoader() // importer la scene
        
        //focntion qui fait une action: ajouter a notre scene
        var onImport = function (gltf) {
            gltf.scene.position.y = -0.5 // on peut utiliser les propriété de la scene car on a mis de gltf dessus
            gltf.scene.rotation.y = (3.1416/2)
            gltf.scene.scale.set(0.5,0.5,0.5) //2x plus petit
            console.log(gltf)
            scene.add(gltf.scene) // la scene existe dans la propriété de gltf mais on l'a pas invoqué (donc ca fait encore rien)
        }
        loader.load("./img/tjs.gltf", onImport)
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
            }
            
            if (event.key == "q") {
                state = "left"
            }
            if (event.key == "z" && !is_jumping && !is_falling) {
                is_jumping = true
            }
            if (event.key == "r") {
                cube.rotation.x += 0.1
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
                cube.position.x += speed_3D
                //la camera suit l'objet
                camera.position.x = cube.position.x
            }
            if (state == "left") {
                cube.position.x -= speed_3D
                camera.position.x = cube.position.x
            }
            if (is_jumping) {
                cube.position.y += jumping_speed_3D
                // pour qu'il arrete de sauter a 50 pixels
                if (cube.position.y > 2) {
                    is_jumping = false
                    is_falling = true
                }
            }
            if (is_falling) {
                cube.position.y = cube.position.y - jumping_speed_3D
                // la position zero est calibrée en fonction de comment les element sont placés initialement
                if (cube.position.y < 0) {
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