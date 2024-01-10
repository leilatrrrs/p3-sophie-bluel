//**Afficher Projet**/

const apiWorks = "http://localhost:5678/api/works"

const sectionGallery = document.querySelector(".gallery")
let getPhotos;
fetch(apiWorks)
    .then( data => data.json()) /* récupère les données brut */
    .then( jsonlistPhotos => {
        getPhotos = jsonlistPhotos
        console.log(jsonlistPhotos); /* affiche les éléments dans la console */
        afficherPhotos(jsonlistPhotos, sectionGallery)
    })

function afficherPhotos(array,container, isModal = false) {
    container.innerHTML =""
    for (let i = 0; i < array.length; i++) { /* boucle for pour itéré chaque élément */
        const figurePhotos = document.createElement('figure')/* création élément figure */
        
        const imgPhotos = document.createElement('img') /* création de 'l'image */
        imgPhotos.src = array[i].imageUrl/* récuperer via l'url  */
        figurePhotos.appendChild(imgPhotos) /* rattache l'iamge à la figure */
        figurePhotos.dataset.id = array[i].id;
        
        if (isModal){
            const trashIcon = document.createElement('i')
            trashIcon.classList.add ('fa-solid', 'fa-trash-can')
            figurePhotos.appendChild(trashIcon)
        }

        const figureDesc = document.createElement('figcaption')/* création élément figureDesc pour le texte */
        figureDesc.innerHTML = array[i].title /* ajout texte dans figureDesc */
        figureDesc.classList.add("fig-desc")
        figurePhotos.appendChild(figureDesc)/* ajout figureDesc sous l'image dans figure */

        container.appendChild(figurePhotos) /* on ajoute tout dans le conteneur */
    }
}

/** Afficher filter-bar**/

const apiCategories = "http://localhost:5678/api/categories"

const sectionFilterBar = document.querySelector(".filter-bar")

fetch(apiCategories)
    .then( data => data.json()) /* récupère les données brut */
    .then( jsonlistCategories => {
        console.log(jsonlistCategories); /* affiche les éléments dans la console */
        afficherFiltre(jsonlistCategories, sectionFilterBar)
    })

function afficherFiltre(categories, container) {
        const buttonAll = document.createElement("button") /* création d'un bouton */ 
        buttonAll.innerText = "Tous" /* bouton affichera "tous" */
        buttonAll.classList.add("button-categories")
        container.appendChild(buttonAll) /* ajout du bouton dans le container */

        buttonAll.addEventListener("click", function () { /* ajout ecouteur d'évenements au btn "tous" */
            afficherPhotos(getPhotos, sectionGallery)
        })

        for (let i = 0; i < categories.length; i++) {

        const filterButton = document.createElement('button') /* création des boutons */
        filterButton.innerText = categories[i].name /* récupere les infos via le name */
        filterButton.classList.add("button-categories")
        container.appendChild(filterButton) /* ajoute les boutons dans le container */
       
        filterButton.addEventListener("click", function () { /* ajout ecouteur d'évenements aux btns */
            const categoryId = categories[i].id; /* extraire l'id de la catégorie du btn qu'on a cliqué, stock dans variable categoryId */
            console.log("filtrer par catégorie :", categoryId);
            const photosFiltrer = getPhotos.filter(photo => photo.categoryId === categoryId); /* filter sur Array photos, on récupere les photos qui ont l'ID qui est = a l'ID de la catégorie sur laquelle on a cliqué */
            console.log("Photos filtrées :", photosFiltrer);

            afficherPhotos(photosFiltrer, sectionGallery);
        });
        
    }
    }



    /* Faire apparaitre la fenetre modale */

    let modal = null

const openModal = function (e){
    e.preventDefault() 
    const target = document.querySelector(e.target.getAttribute('href'))
    target.style.display = null
    target.removeAttribute ('aria-hidden')
    target.setAttribute('aria-modal', 'true')
    modal = target
    modal.addEventListener('click',closeModal)
    modal.querySelector('.close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)

    afficherGaleriePhoto()
}

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()

    const modalPhoto = modalWrapper.querySelector('.modal-photos')
    const modalLigne = modalWrapper.querySelector('.modal-ligne')
    const modalBtn = modalWrapper.querySelector('.modal-btn')
   
    if (modalPhoto) {
        modalPhoto.remove()
    }

    if (modalLigne) {
        modalLigne.remove()
    }

    if (modalBtn) {
        modalBtn.remove()
    }

    modal.style.display = 'none'
    modal.setAttribute ('aria-hidden', true)
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)

    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
   
}) 


/* Afficher les photos dans la fenetre */

const modalWrapper = document.querySelector('.modal-wrapper')

function afficherGaleriePhoto() {
    
    modalWrapper.innerHTML = ""

    const modalTitle = document.createElement('h1');
    modalTitle.textContent = "Galerie photo";
    
    getPhotos.forEach(photosFiltrer => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const span = document.createElement("span");
        const trash = document.createElement("i");
        trash.classList.add("fa-solid", "fa-trash-can");

        // Assigner l'ID ici
        trash.dataset.id = photosFiltrer.id;

        trash.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            console.log('ID à supprimer:', id);

            // Le reste de votre code pour supprimer la photo
        });

        img.src = photosFiltrer.imageUrl;
        span.appendChild(trash);
        figure.appendChild(span);
        figure.appendChild(img);
        modalWrapper.appendChild(figure);
    

    })
    
    const modalLigne = document.createElement('div')
    modalLigne.classList.add('modal-ligne')
    modalWrapper.appendChild(modalLigne)

    const modalBtn = document.createElement('div')
    modalBtn.classList.add('modal-btn')
    modalBtn.innerText ='Ajouter une photo'
    modalWrapper.appendChild(modalBtn)
  

    const photoContainer = document.querySelector('.modal-photos')
    afficherPhotos(getPhotos, photoContainer, true)

    const figureDescs = photoContainer.querySelectorAll('figcaption')
    figureDescs.forEach(figureDescs => {
        figureDescs.remove()
    })


  }

  /* supprimer au clic l'image de la galerie et de la base de données */


function trash() {
    for (let i = 0;  i< getPhotos.length; i++) {
        const trashIcon = document.querySelectorAll(`.trash-${i}`)
        trashIcon.addEventListener('click', async function () {
            const deletePhotos = await fetch(`http://localhost:5678/api/works/${projets[i].id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            
            
                getPhotos.splice(i,1)

        })
        
    }
}
trash()