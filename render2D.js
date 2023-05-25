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

var createRenderEngine = function (canvasTarget) {
    var self = {}
    var posInit = 50
    var state = undefined

    // recupere l'element html (class du canva: "render2d")
    var init = function () {
        var canvas = document.querySelector(canvasTarget)
        var ctx = canvas.getContext('2d') //context c'est pour dessiner dans un canvas, on peut dessiner en 2d et 3d
        
        // ca c'est un rectangle de (25,25) et (100,100) fillRect(x,y,width,height) 
        // ctx.fillStyle = "blue"
        // ctx.fillRect(100,100,100,100) 

        // ctx.fillStyle = "red"
        // ctx.fillRect(200,100,100,100)

        var onKeyDown = function(event){
            console.log(event)
            if (event.key == "d"){
                self.state = "right"
            }
            
            if (event.key == "q") {
                self.state = "left"
            }

            if (event.key == "s") {
                ctx.clearRect(0,0,canvas.width, canvas.height)
                posInit += 1
                ctx.fillStyle = "green" //a partir de mtn, remplit de cette couleur
                ctx.fillRect(100,posInit,100,100) // position (1,50) à la position (5,50)
            }
            
            if (event.key == "z") {
                ctx.clearRect(0,0,canvas.width, canvas.height)
                posInit -= 1
                ctx.fillStyle = "pink"
                ctx.fillRect(100,posInit,100,100)
            }
        }

        var render = function() {
            ctx.clearRect(0,0,canvas.width, canvas.height)
            ctx.fillStyle = "blue" //a partir de mtn, remplit de cette couleur
            ctx.fillRect(posInit,100,100,100) // position (1,50) à la position (5,50)
        }

        var process = function() {
            // definir une mise a jour de posInit selon le state du cube, right ou left (opération sur les elements)
            //quand state = left, notre pos init est changé pour que ca se déplace a gauche, same pour right
            // il faut clear avant le dessin, sinon tu effaces ce que tu dessines
            if (self.state == "right") {
                posInit += 1
            }
            if (self.state == "left") {
                posInit -= 1
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
    }
    
    init()
    return self
}

export {createCharacter, createRenderEngine}