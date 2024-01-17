const userEmail = document.getElementById("email")          /* récupère les infos */
const userPassword = document.getElementById("password")
const form = document.querySelector("form")
const errorMessage = document.getElementById("error-message") 


form.addEventListener('submit', async function (e) {
    e.preventDefault()  /* empêche que la page se recharge */

    const chargeUtile = JSON.stringify({ /* données qu'on récupère et qui vont être envoyé au serveur */
        email: userEmail.value,
        password: userPassword.value
    }) 

    const response = await fetch("http://localhost:5678/api/users/login", { /* envoi des données du formulaire vers l'Api via fetch */
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: chargeUtile
    })
       
    
    if (response.ok) {  /* si la réponse est OK */
        const data = await response.json()
            localStorage.setItem("token", data.token) /* on stock le token de l'utilisateur  */
            window.location.href = "index.html"       /* l'utilisateur est redirigé */
            console.log(localStorage)

    }else if(response.status === 401 || response.status === 404){ /* s'il y a une erreur 401/404 ajout des class + modifs css */
        userEmail.classList.add('erreurco') /* ajout nouvelle class */
        userPassword.classList.add('erreurco')
        
        userEmail.addEventListener('input', function (){ /* la class + modifs css disparaissent quand l'utilisateur retape ses infos */
        userEmail.classList.remove('erreurco')
        })
        userPassword.addEventListener('input', function (){
        userPassword.classList.remove('erreurco')
        })
        
        if (response.status === 401) { /* si l'utilisateur n'a pas été trouvé */
            errorMessage.innerText = 'Mauvaise adresse mail ou mot de passe' /* message si le mdp ou l'email est faux */
        }else{
            errorMessage.innerText = 'Utilisateur inconnu' /* sinon c'est que l'utilisateur n'a pas été trouvé/pas présent dans le serveur */
        }
    }
})


/************************************création de la fonction de connexion**********************************************/

function connexion() {
    let token = localStorage.getItem('token')/* si le token est stocké, alors je peux passer de login a logout */
    console.log('token',token);
    let loginLien = document.getElementById('login')
    let modalEdition = document.querySelector('.modal-edition')
    let modalModifier = document.querySelector('.modal-modifier')
    let filterBar = document.querySelector ('.filter-bar')

    if (token){
        console.log("l'utilisateur est connecté")
        loginLien.innerText = 'logout'
        loginLien.setAttribute('href','login.html')
        loginLien.addEventListener('click', deconnexion)
        modalEdition.style.display ="flex" 
        modalModifier.style.display = "flex"
        filterBar.style.visibility = "hidden"
        }else{
            console.log("l'utilisateur n'est pas connecté")
        }

        return token
}

/************************************création de la fonction de déconnexion****************************************************/
       
function deconnexion() {
    localStorage.removeItem('token')
    window.location.href = "index.html"
}
window.onload = function() {
    connexion()
}