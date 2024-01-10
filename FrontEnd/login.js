const userEmail = document.getElementById("email")
const userPassword = document.getElementById("password")
const form = document.querySelector("form")
const errorMessage = document.getElementById("error-message") /* récupère les infos */


form.addEventListener('submit', async function (e) {
    e.preventDefault()/* empeche que la page se recharge */


    const chargeUtile = JSON.stringify({
        email: userEmail.value,
        password: userPassword.value
    }) /* Données qu'on récupère et qui vont être envoyé au serveur */

   


        const response = await fetch("http://localhost:5678/api/users/login", { /* envoi des données du formulaire ver l'Api via fetch */
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        })
        console.log(response)
    
        if (response.ok) {  /* si la réponse est OK */
            const data = await response.json()
            localStorage.setItem("token", data.token) /* on stock le token de l'utilisateur  */
            window.location.href = "index.html" /* l'utilisateur est redirigé vers ... */
            console.log(localStorage);

        }else if(response.status === 401 || response.status === 404){ /* sis il y a une erreur 401 ou 404 j'aoute des class et donc des modifs css */
/* ces écouteurs d'événements sont conçus pour fournir une rétroaction visuelle immédiate à l'utilisateur en supprimant la classe de mise en surbrillance lorsqu'il commence à corriger la saisie dans les champs d'e-mail et de mot de passe. Cela contribue à améliorer l'expérience utilisateur en mettant à jour dynamiquement les indices visuels liés à la correction de leur saisie. */
                userEmail.classList.add('erreurco') /* ajout nouvelle class */
                userPassword.classList.add('erreurco')
        
                userEmail.addEventListener('input', function (){ /* la class et donc les modifs css         disparaissent quand l'utilisateur retape ses infos */
                userEmail.classList.remove('erreurco')
                })
                userPassword.addEventListener('input', function (){
                    userPassword.classList.remove('erreurco')
                })
        
        
                if (response.status === 401) { /* si l'utilisateur n'a pas été trouvé */
                    errorMessage.innerText = 'Mauvaise adresse mail ou mot de passe' /* message si le mdp ou l'email est faux */
                }
                else{
                    errorMessage.innerText = 'Utilisateur inconnu' /* sinon c'est que l'utilisateur n'a pas été trouve ou n'est pas présent dans le serveur */
                }
           }
        })


        function connexion() {
            /* si le token est stocké, alors je peux passer de login a logout */
            let token = localStorage.getItem('token')
            console.log('token',token);
            let loginLien = document.getElementById('login')
            let modalEdition = document.querySelector('.modal-edition')
            let modalModifier = document.querySelector('.modal-modifier')
            let filterBar = document.querySelector ('.filter-bar')

            if (token){
                console.log("l'utilisateur est connecté");
                loginLien.innerText = 'logout'
                loginLien.setAttribute('href','login.html')
                loginLien.addEventListener('click', deconnexion)
                modalEdition.style.display ="flex" /* tester avec null */
                modalModifier.style.display = "flex"
                filterBar.style.visibility = "hidden"
            }else{
                console.log("l'utilisateur n'est pas connecté");
            }

                return token
        }
       
     function deconnexion() {
        localStorage.removeItem('token')
        window.location.href = "index.html"
     }
     window.onload = function() {
            connexion()
        }

