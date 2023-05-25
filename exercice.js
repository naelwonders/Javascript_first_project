// utiliser le guillemet special (alt gr £), pour pouvoir aller à la ligne 
var monTexte =`Hello
Comment vas tu vas
*bien ->sibien
*super bien ->sisuperbien

===sibien===
Ma reponse si bien

===sisuperbien===
Ma reponse si super bien
`

//assigner à splited avec un liste [Hello, Comment va tu]
//à partir du texte


//transformer splited en une liste de la forme
// var dic =[
//     {type:"paragraph", text:"Hello"},
//     {type:"paragraph", text:"Hello"},
//     {type:"question", text:"bien"},
//     {type:"question", text:"super bien"},
// ]
var splited = monTexte.split("\n")
console.log(splited)

var dic = []
for (let i = 0; i < splited.length; i++)
{
    // déclaration du l'objet en dehors du if sinon c'est local
    var obj = undefined
    
    // on fait des choses différentes en fonction de si on a une étoile ou non (paragraph vs question)
    if (splited[i][0] == "*") {
        var question_text = splited[i].split("->")[0]
        var question_target = splited[i].split("->")[1]
        // affectation de valeur à l'objet
        obj = {
            type: "question",
            text: question_text,
            goTo: question_target,
        };
    }
    else if (splited[i][0] == "=") {
        obj = {
            type: "chapitre",
            text: splited[i],   
        };
    }
    else {
        obj = {
            type: "paragraph",
            text: splited[i],
        };
    }
    // a chaque itération, quoi qu'il arrive, on ajoute mes objects dans la liste
    dic.push(obj) 
    
}

// Parcourire la liste avec une
//  boucle for et afficher chaque élement dans la page
//les question doivent être clicable 
// quand on clique dessus lancer un message d'alert

function createElementInPage(text, question){
    //creation d'un nouvel element dans ma page web mais elle n'est pas encore dans l'arbre que représente la page web (appendChild)
    var newElement = document.createElement("p")
    //ajouter un element dans mon HTML
    newElement.innerHTML = text

    //Element cliquable
    //on peut éccrire une focntion directement dans mon listener 


    if (question){
        var onClick = function (){
            var chapterStart = findChapter(dic,"===" + question + "===")
            // pour qu'il débute à la ligne apres le "===" sinon le programme s'arrete
            reader(dic, chapterStart + 1)
        }
        newElement.addEventListener("click", onClick) //sans parenthese a onClick car c'est une fonction stockée dans une variable, c'est mieux sinon il lance la fonction qui n'a pas de return donc ce fera rien en cas de click (return undefined)
    }
        
    //retrouver un element dans la page web
    var target = document.querySelector(".target_area")
    target.appendChild(newElement)
    console.log(newElement)
    console.log(target)
}

//230515-3//ajouter un dernier parametre permetant de démarrer la lecture sur base du nom d'un chapitre

var findChapter = function (dic, chapterName){
    var chapterStartAtLine = null // pour que ca renvoit quelque chose
    for (let i = 0; i < dic.length; i++){
        if (dic[i].text == chapterName){
            chapterStartAtLine = i
        }
    }
    return chapterStartAtLine
}

//230515-1// intégrer la boucle dans une fonction avec comme pram
//d'entrée la liste (dic)
//230515-2//ajouter un second parametre permetant de démarer la lecture de n'importe ou

// lire le texte à partir de la ligne définie (start line)
var reader = function (dic, startLine){
    var startAt = 0
    if (startLine) {
        startAt = startLine
    }
    for (var i = startAt; i < dic.length; i++) 
    {
        // creation des balises HTML
        console.log(dic[i])
        if (dic[i].type == "question") {
            createElementInPage(dic[i].text, dic[i].goTo)
        }  
        else if (dic[i].type == "paragraph")
        {
            createElementInPage(dic[i].text)
        }
        else if (dic[i].type == "chapitre")
        {
            break
        }
    }
}

var startDialogue = function () {
    reader(dic, 0)
}

export {startDialogue}
