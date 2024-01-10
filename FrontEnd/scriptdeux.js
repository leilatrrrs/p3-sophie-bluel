let token = localStorage.getItem('token')
    console.log('token',token);

const trashIconIds = [];
const modalWrapper = document.querySelector('.modal-wrapper')
console.log("c'est", modalWrapper);
const apiCategories = "http://localhost:5678/api/categories"



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
        console.log("l'id, c'est",figurePhotos);

        if (!isModal){
        const figureDesc = document.createElement('figcaption')/* création élément figureDesc pour le texte */
        figureDesc.innerHTML = array[i].title /* ajout texte dans figureDesc */
        figureDesc.classList.add("fig-desc")
        figurePhotos.appendChild(figureDesc)/* ajout figureDesc sous l'image dans figure */ 
    }
    }
    container.appendChild(figurePhotos)/* on ajoute tout dans le conteneur */
    }


/** Afficher filter-bar**/


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


/**Faire apparaitre fenetre Modale **/  

const openModal = function (e){
    e.preventDefault()     
    const target = document.querySelector(e.target.getAttribute('href'))
    if (!target) {
        console.error('Modal non trouvé.');
        return
    }

    target.style.display = null
    target.removeAttribute ('aria-hidden')
    target.setAttribute('aria-modal', 'true')
    modal = target

    if (modal){
        modal.addEventListener('click',closeModal)
        const closeBtn = modal.querySelector('.close')
        if (closeBtn){
            closeBtn.addEventListener('click', closeModal)
        }

        const stopBtn = modal.querySelector('.js-modal-stop')
        if (stopBtn){
        stopBtn.addEventListener('click', stopPropagation)
        }
    }
}

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
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


/**Afficher photos dans la fenetre modale**/ 

let modalBtn;

function afficherGaleriePhoto() {
    const modalPhoto = document.createElement('div')
    const modalLigne = document.createElement('div')
    modalBtn = document.createElement('div')


    modalPhoto.classList.add('modal-photos')
    modalLigne.classList.add('modal-ligne')
    modalBtn.classList.add('modal-btn')
    modalBtn.innerText ='Ajouter une photo'

    modalWrapper.appendChild(modalPhoto)
    modalWrapper.appendChild(modalLigne)
    modalWrapper.appendChild(modalBtn)
 
    fetch("http://localhost:5678/api/works")
    .then(data => data.json())
    .then(jsonlistPhotos => {
        getPhotos = jsonlistPhotos;
        const photoContainer = document.querySelector('.modal-photos')
        afficherPhotos(getPhotos, photoContainer, true);


        const figureDescs = photoContainer.querySelectorAll('.figcaption')
        figureDescs.forEach(figureDesc => {
            figureDesc.remove()
        })    
    })
}


  /* supprimer au clic l'image de la galerie et de la base de données */

async function deletePhotos(e) {

        const trashIcon = e.currentTarget
        const id = trashIcon.dataset.id
            console.log("l'id qui me saoule", id)

            const init = {
                method: 'DELETE', 
                headers: { 'Authorization': `Bearer ${token}`},
            }
            fetch("http://localhost:5678/api/works/" +id,init)
            .then((response) =>{
                if(!response.ok){
                    console.log("le delete n'a pas marché")
                    throw new Error(`Erreur HTTP : ${response.status}`)
                }
                
            })
            .then((data)=>{
                console.log("le delete a réussi voila la data", data)
                
               
            })
            .catch(error => {
                console.error("Erreur lors de la suppression :", error);
        })
    
}
afficherGaleriePhoto()

modalBtn.addEventListener('click', async (e) =>{
    e.preventDefault()
    console.log('clic sur modalBtn');
    createForm(modalWrapper, apiCategories)
})
   


function createForm(modalWrapper, apiCategories) {
  

    /***création btn retour***/
    const modalBackBtn = document.createElement("button")
    modalBackBtn.classList.add("js-modal-close")
    const modalBackMark = document.createElement("i")
    modalBackMark.classList.add("fa-solid", "fa-arrow-left", "modal-back")
    modalBackBtn.appendChild(modalBackMark)
    modalBackBtn.addEventListener("click", function (){
        modalWrapper.innerHTML = ""
        afficherPhotos(apiWorks )/* pzs sur */
    })

    /***création btn fermeture***/
    const modalCloseBtn = document.createElement("button")
    modalCloseBtn.classList.add('js-modal-close')
    const modalCloseMark = document.createElement("i")
    modalCloseMark.classList.add("fa-solid", "fa-xmark")
    modalCloseBtn.appendChild(modalCloseMark)
    modalCloseBtn.addEventListener("click",closeModal)

    /***création formulaire***/
    const modalTitle = document.createElement("h1")
    modalTitle.innerText ="Ajout photo"

    const modalForm = document.createElement("form")
    modalForm.classList.add("modal-form")
    modalForm.setAttribute("action", "#")
    modalForm.setAttribute("method", "post")
    modalForm.setAttribute("enctype", "multipart/form-data") /* Pour la trasmission de fichier via un formualire HTML, car un fichier joint va etre transféré */

    const modalImageLabel = document.createElement("label")
    modalImageLabel.classList.add("modal-image-label")
    const modalImageIcon = document.createElement('i')
    modalImageIcon.classList.add("fa-regular", "fa-image")
    const modalImageInput = document.createElement("input")
    modalImageInput.type = "file"
    modalImageInput.name = "image"
    modalImageInput.setAttribute('accept', 'image/jpeg, image/jpg, image/png')
    const ModalBtnAdd = document.createElement("p")
    ModalBtnAdd.classList.add('modal-btn-add')
    ModalBtnAdd.innerText = '+ Ajouter photo'
    const modalText = document.createElement('p')
    modalText.classList.add('modal-text')
    modalText.innerText ='jpg, png: 4mo max'

    const modalTitleLabel = document.createElement("label")
    modalTitleLabel.setAttribute("for", "title")
    modalTitleLabel.innerText = "Titre"
    const modalTitleInput = document.createElement("input")
    modalTitleInput.type = "text"
    modalTitleInput.name = "title"

    const modalCategorieLabel = document.createElement("label")
    modalCategorieLabel.setAttribute("for", "category")
    modalCategorieLabel.innerText= "Catégorie"
    
    const modalCategorieSelect = document.createElement("select")
    modalCategorieSelect.name = "category"
    apiCategories.forEach(category =>{
        const modalOption = document.createElement("option")
        modalOption.value = category.id
        modalOption.textContent = category.name
        modalCategorieSelect.appendChild(modalOption)
    })

    const modalLigne = document.createElement('div')

    const modalBtn = document.createElement("button")
    modalBtn.type = "submit"
    modalBtn.innerText = "valider"
    modalBtn.classList.add("modal-btn")

    modalImageLabel.appendChild(modalImageIcon);
    modalImageLabel.appendChild(modalImageInput);
    modalImageLabel.appendChild(ModalBtnAdd);
    modalImageLabel.appendChild(modalText);
    modalForm.appendChild(modalImageLabel);
    modalForm.appendChild(modalTitleLabel);
    modalForm.appendChild(modalTitleInput);
    modalForm.appendChild(modalCategorieLabel);
    modalForm.appendChild(modalCategorieSelect);
    modalForm.appendChild(modalLigne);
    modalForm.appendChild(modalBtn);
    modalWrapper.appendChild(modalBackBtn);
    modalWrapper.appendChild(modalCloseBtn);
    modalWrapper.appendChild(modalTitle);
    modalWrapper.appendChild(modalForm);
}


document.addEventListener('DOMContentLoaded', function () {
    const modalWrapper = document.querySelector('.modal-wrapper');
    console.log("c'est", modalWrapper);
})



/* envoi données du formulaire */

async function sendFormData() {
    e.preventDefault()

    const token = localStorage.getItem('token')
    const imgResult = modalImageInput
    const title = document.querySelector("input[name='modalTitle']").value
    const modalCategorieSelect = document.querySelector("select[name='category']")
    const catId = modalCategorieSelect.options[modalCategorieSelect.selectedIndex].value

    if (!imgResult.files || imgResult.files.length === 0) {
        alert("Aucun fichier sélectionné");
        return
    }

      if (!modalTitle) {
        alert("Veuillez entrer un titre");
        return;  
    }

    if (!catId) {
        alert("Veuillez sélectionner une catégorie");
        return;
    }

    const formData = new FormData();
    formData.append('title', modalTitle);
    formData.append('image', imgResult.files[0]);
    formData.append('category', catId);


    try {
        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "accept": "application/json"
          },
          body: formData
        })

        if (response.ok) {
            const newWork = await response.json();
            works.push(newWork);
            afficherPhotos(works);
            modalWrapper.innerHTML = "";
            afficherGaleriePhoto(works);
        
        e.target.reset();
    } else {
      console.log("Une erreur s'est produite lors de l'ajout de l'élément dans la galerie.");
    }
  } catch (error) {
    console.log("Une erreur s'est produite lors de la communication avec le serveur.", error);
  }
}