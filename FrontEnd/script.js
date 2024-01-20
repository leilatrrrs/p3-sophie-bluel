const apiWorks = "http://localhost:5678/api/works"
const apiCategories = "http://localhost:5678/api/categories";
const sectionGallery = document.querySelector(".gallery")
let getPhotos;  /* Stocke les photos récupérées avec la requête API */


/****************************************Afficher Projet**********************************************/
fetch(apiWorks)
    .then( data => data.json()) /* récupère les données brut */
    .then( jsonlistPhotos => {
        getPhotos = jsonlistPhotos
        console.log("les photos :",getPhotos)
        afficherPhotos(getPhotos, sectionGallery)
    }
)

function afficherPhotos(array,sectionGallery, isModal = false) {
    if (!sectionGallery) {
        console.error("Le conteneur n'est pas défini.")
        return;
    }
    sectionGallery.innerHTML =""
    for (let i = 0; i < array.length; i++) {                    /* boucle for pour itéré chaque élément */
        const figurePhotos = document.createElement('figure')   /* création élément figure */
        const imgPhotos = document.createElement('img')         /* création de 'l'image */
        imgPhotos.src = array[i].imageUrl                       /* récuperer via l'url  */
        figurePhotos.appendChild(imgPhotos)                     /* rattache l'image à la figure */
        figurePhotos.dataset.id = array[i].id
        console.log("l'id de la photo :",figurePhotos)

        if (!isModal){ /* Si pas modal */
        const figureDesc = document.createElement('figcaption') /* création élément figureDesc pour le texte */
        figureDesc.innerHTML = array[i].title                   /* ajout texte dans figureDesc */
        figureDesc.classList.add("fig-desc")
        figurePhotos.appendChild(figureDesc)                    /* ajout figureDesc sous l'image dans figure */ 
        }
        if(isModal){ /* Si modal, ajout icon trash */
        const trashContainer = document.createElement('div')
        const trash = document.createElement('i')
        trashContainer.classList.add(`trash-${i}`)              /* ajout d'une classe "dynamique", selon la valeur de i */
        trash.classList.add('fa-solid', 'fa-trash-can')
        trashContainer.appendChild(trash)                       /* rattache l'icone au conteneur */
        figurePhotos.appendChild(trashContainer)                /* rattache le conteneur à la photo */

        trashContainer.addEventListener('click', function () {  /* au clic, on execute la fonction anonyme qui appelle la fonction "supprimerPhoto" */
            deletePhoto(getPhotos[i].id, i)
        })
        }    
    
    sectionGallery.appendChild(figurePhotos)/* ajoute tout dans le conteneur */
    }
}


/*************************************Afficher filter-bar*********************************************/

const sectionFilterBar = document.querySelector(".filter-bar")
let getCategories; /* stocke les catégories récupérées avec la requête API */
let categoryId; /* stocke les Id */

fetch(apiCategories) /* récupère + traite les données brut */
    .then( data => data.json()) /* converti les données brut en format JSON */
    .then( jsonlistCategories => {
        getCategories = jsonlistCategories  /* les catégories récupérées sont assingées à la variable getCategories */
        console.log("les catégories :",getCategories)
        afficherFiltre(getCategories, sectionFilterBar)
    }
)

function afficherFiltre(getCategories, sectionFilterBar) {
        const buttonAll = document.createElement("button")  /* création d'un bouton */ 
        buttonAll.innerText = "Tous"                        /* bouton affichera "tous" */
        buttonAll.classList.add("button-categories")
        sectionFilterBar.appendChild(buttonAll)             /* ajout du bouton dans le container */

        buttonAll.addEventListener("click", function () {   /* ajout ecouteur d'évenements au btn "tous" */
            afficherPhotos(getPhotos, sectionGallery)
        })

        for (let i = 0; i < getCategories.length; i++) {    /* parcourt toutes les catégories récupérées */

        const filterButton = document.createElement('button') /* création des boutons */
        filterButton.innerText = getCategories[i].name        /* récupere les infos via le name */
        filterButton.classList.add("button-categories")
        sectionFilterBar.appendChild(filterButton)            /* ajoute les boutons dans le container */
       
        filterButton.addEventListener("click", function () {  /* ajout ecouteur d'évenements aux btns */
            categoryId = getCategories[i].id                  /* extraire l'id de la catégorie du btn qu'on a cliqué, stock dans variable categoryId */
            console.log("filtrer par catégorie :", categoryId)
            const photosFiltrer = getPhotos.filter(photo => photo.categoryId === categoryId) /* récupere les photos qui ont l'ID qui est = a l'ID de la catégorie sur laquelle on a cliqué */
            console.log("Photos filtrées :", photosFiltrer)
            afficherPhotos(photosFiltrer, sectionGallery) /* Affiche les photos filtrées dans la galerie */
        })  
    }
} 


/**************************************Faire apparaitre fenetre Modale********************************************/  

let closeBtn;

const openModal = function (e){  /* utilisé comme gestionnaire d'évènements quand il y au clic sur un élément avec "js-modal" */
    e.preventDefault()           /* empêche un rechargement de la page */
  
    const target = document.querySelector(e.target.getAttribute('href')) /* récupère élément cible du modal grâce à la valeur de l'attribut href */
        if (!target) { /*  vérifie si l'élément ciblé existe */
            console.error('Modal non trouvé.')
            return
        }

        target.style.display = null                /* permet au modal d'apparaître */
        target.removeAttribute ('aria-hidden')
        target.setAttribute('aria-modal', 'true')  /* ajoute l'attribut aria-modal avec la valeur true */
        modal = target                             /* la modal est sotcké dans "modal" */

        if (modal){
            modal.addEventListener('click',closeModal) /* écouteur d'évenements pour fermer la modal */
            closeBtn = modal.querySelector('.close')
            if (closeBtn){
                closeBtn.addEventListener('click', closeModal)
            }

            const stopBtn = modal.querySelector('.js-modal-stop')
            if (stopBtn){
            stopBtn.addEventListener('click', stopPropagation)
            }
        }
}

const closeModal = function (e) {       /* fermer la modal */
    console.log("fermeture de la modale")
    if (modal === null) return          /* vérifie si la modal existe */
    
    if (e){
    e.preventDefault()
    }
    
    modal.style.display = 'none' /* fait l'inverse de l'ouverture de la modale */
    modal.setAttribute ('aria-hidden', true)
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)

    modal = null
}

const stopPropagation = function (e) { /* évite la propagation d'évènement à d'autres éléments dans le DOM */
    e.stopPropagation()
}


document.querySelectorAll('.js-modal').forEach(a => { /* ajoute un écouteur d'évènement à tous les éléments qui ont la classe "js-modal" */
    a.addEventListener('click', openModal)  /* au clic la modal s'ouvre */
})
 

/***********************************Afficher photos dans la fenêtre modale******************************************/ 

let modalBtn;
let modalLigne; 
let modalPhoto;
let modalTitle;
let modalCloseSpan;
const modalWrapper = document.querySelector('.modal-wrapper') /* container global de la modal */
let isModalOpen = false;

async function afficherGaleriePhoto() {
    modalCloseSpan = document.createElement("span")
    modalTitle = document.createElement('h1')
    modalPhoto = document.createElement('div') /* création des éléments */
    modalLigne = document.createElement('div')
    modalBtn = document.createElement('div')
    
    modalCloseSpan.classList.add("fa-solid","fa-xmark","fa-xl","close")
    modalTitle.classList.add("modal-title")
    modalTitle.innerText="Galerie Photo"
    modalPhoto.classList.add('modal-photos') /* ajout des classes */
    modalLigne.classList.add('modal-ligne')
    modalBtn.classList.add('modal-btn')
    modalBtn.innerText ='Ajouter une photo'
    
    
    modalWrapper.appendChild(modalCloseSpan)
    modalWrapper.appendChild(modalTitle)
    modalWrapper.appendChild(modalPhoto) /* éléments ajoutés comme enfant à modalWrapper */
    modalWrapper.appendChild(modalLigne)
    modalWrapper.appendChild(modalBtn)
 
    fetch(apiWorks) /* réucpération des photos */
    .then(data => data.json())
    .then(jsonlistPhotos => {
        getPhotos = jsonlistPhotos 
            const photoContainer = document.querySelector('.modal-photos')
            afficherPhotos(getPhotos, photoContainer, true)
    })

    modalBtn.addEventListener('click', async (e) =>{ /* au clic  */
        e.preventDefault()                          /* empêche le comportement par défaut */
        hideModalContent()                          /* cache la fenetre modal */
        console.log("clic sur le bouton d'ajoutd de photo", modalBtn)
        createForm(modalWrapper, getCategories)     /*création du formulaire */
    })
}
afficherGaleriePhoto() /* affiche la galerie de photos dans la modal  */


/**************************************Ajout de la fonction deletePhoto*****************************************/

function deletePhoto(photoId, index) { 
    const modalPhoto = document.querySelector('.modal-photos')
    const modalTrash = document.querySelector(`.trash-${index}`) /* récupère dynamiquement l'élément trash avec son Id */
    modalPhoto.removeChild(modalTrash.parentElement)             /* Supprime photo de la galerie modale */
    
    const galleryPhoto = document.querySelector(`[data-id="${photoId}"]`) /* récupère l'élément qui a l'attribut data-id qui est égal à l'id de la photo qui est dans les paramètres */
    galleryPhoto.parentElement.removeChild(galleryPhoto)                  /* supprime photo de la page principale */

    getPhotos = getPhotos.filter(photo => photo.id !== photoId)
    
    const apiWorksDelete = `http://localhost:5678/api/works/${photoId}`
    const token = localStorage.getItem('token')

    fetch(apiWorksDelete, { /* Envoi d'une demande de suppression à l'API */
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,  /* autorisation qui contient le token stocké localement */
        },
    })
    .then(response => {
        if (response.ok) {
            console.log(`Photo avec l'ID ${photoId} a été supprimée de la base de données.`)
        } else {
            console.error("La photo n'a pas été supprimée de la base de données.")
        }
    })
    .catch(error => {
        console.error("la communication avec le serveur a échoué:", error)
    })
}

/*********************************Outils hide/show******************************************/


function hideModalContent() {
    modalLigne.style.display = 'none'
    modalBtn.style.display = 'none'
    modalPhoto.style.display = 'none'
    modalTitle.style.display = 'none'
    closeBtn.style.display = "none"
    modalCloseSpan.style.display  = "none"
}


function showAllModalContent() {
    modalLigne.style.display = null
    modalBtn.style.display = null
    modalPhoto.style.display = null
    modalTitle.style.display = null
    modalCloseSpan.style.display = null
}

function showCreateForm() {
    modalForm.style.display = "block";
    resetForm(); // Ajoutez cet appel pour réinitialiser le formulaire
    // ...
}
function resetForm() {
    console.log('resetForm called');
    const titleInput = document.querySelector("input[name='title']");
    console.log('titleInput found:', titleInput);
    
    setTimeout(() => {
        console.log('After timeout, titleInput value:', titleValue);
    }, 1000);

    if (titleInput) {
        titleInput.value = ''; // Réinitialise la valeur du champ titre
        console.log('After reset, titleInput value:', titleInput.value);
    }
}


function hideCreateForm() {
    resetForm()
    modalForm.style.display = "none"
    modalBackBtn.style.display = "none"
    modalCloseBtn.style.display = "none"
    modalTitre.style.display = "none"
    modalButton.style.display = "none"
    modalCloseSpan.style.display = 'none'
    const modalWrapper = document.querySelector('.modal-wrapper');
    if (modalWrapper) {
        modalWrapper.classList.remove('show-modal');
    }
    formErrors = []; // Réinitialise les erreurs

    const errorContainer = modalWrapper.querySelector('.error-container');
    if (errorContainer) {
        errorContainer.innerHTML = ''; // Efface les erreurs dans le conteneur
    }

    showAllModalContent();
}


/************************************Création du Form****************************************************/

let modalForm;
let modalBackBtn;
let modalCloseBtn;
let modalTitre;
let modalButton;
let modalCategorieSelect

let titleValue
function createForm(modalWrapper, getCategories) {


    modalBackBtn = document.createElement("button")/*création btn retour*/
    modalBackBtn.classList.add("js-form-back")
    const modalBackMark = document.createElement("i")
    modalBackMark.classList.add("fa-solid", "fa-arrow-left", "modal-back")
    modalBackBtn.appendChild(modalBackMark)
    modalBackBtn.addEventListener("click", function (){
        console.log("Bouton de retour cliqué")
        
        hideCreateForm()
        showAllModalContent()
        const fakeEvent = {
            preventDefault: function () {},  /*Fonction pour rien pour simuler preventDefault*/
            target: document.querySelector('.js-modal'),  /*cible similaire à celle du clic sur la target*/
        }
        openModal(fakeEvent)
    })

    modalCloseBtn = document.createElement("button")/*création btn fermeture*/
    modalCloseBtn.classList.add('js-form-close')
    const modalCloseMark = document.createElement("i")
    modalCloseMark.classList.add("fa-solid", "fa-xmark")
    modalCloseBtn.appendChild(modalCloseMark)
    modalCloseBtn.addEventListener("click", function () {
    
        hideCreateForm()
        showAllModalContent()
        const fakeEvent = {
            preventDefault: function () {},
            target: document.querySelector('.js-modal'),
        }
        closeModal(fakeEvent)
    })
    
    modalTitre = document.createElement("h1")
    modalTitre.innerText ="Ajout photo"

    modalForm = document.createElement("form")/*création formulaire*/
    modalForm.classList.add("modal-form")
    modalForm.setAttribute("action", "#")
    modalForm.setAttribute("method", "post")
    modalForm.setAttribute("enctype", "multipart/form-data") /*pour la transmission de fichier via un formulaire HTML, car un fichier joint va etre transféré */
 

    const modalImageLabel = document.createElement("label")
    modalImageLabel.classList.add("modal-image-label")
    const modalImageIcon = document.createElement('i')
    modalImageIcon.classList.add("fa-regular", "fa-image")
    const modalImageInput = document.createElement("input")
    modalImageInput.type = "file"
    modalImageInput.name = "image"
    modalImageInput.setAttribute('accept', 'image/jpeg, image/jpg, image/png')

    const modalImageContainer = document.createElement("div") /*création une div pour contenir le label et l'input*/
    modalImageContainer.appendChild(modalImageLabel)
    modalImageContainer.appendChild(modalImageInput)
    modalForm.appendChild(modalImageContainer)


    const ModalBtnAdd = document.createElement("p") /* Btn d'ajout de photo, déclenche le sélecteur de fichiers */
    ModalBtnAdd.classList.add('modal-btn-add')
    ModalBtnAdd.innerText = '+ Ajouter photo'
    const modalText = document.createElement('p')
    modalText.classList.add('modal-text')
    modalText.innerText ='jpg, png: 4mo max'

    const modalTitleLabel = document.createElement("label") /* champ d'entrée de type de fichier pour selectionner une photo */
    modalTitleLabel.setAttribute("for", "title")
    modalTitleLabel.innerText = "Titre"
    const modalTitleInput = document.createElement("input") /* champ pour saisir le titre */
    modalTitleInput.type = "text"
    modalTitleInput.name = "title"

    const modalCategorieLabel = document.createElement("label") /* création d'un label pour la liste déroulante */
    modalCategorieLabel.setAttribute("for", "category")
    modalCategorieLabel.innerText= "Catégorie"
    
    modalCategorieSelect = document.createElement("select") /* créer la liste déroulante de catégories */
    modalCategorieSelect.name = "category"
    modalCategorieSelect.classList.add("modal-hide-text")
    
    const emptyOption = document.createElement("option")
    emptyOption.value = ""
    modalCategorieSelect.appendChild(emptyOption)

    getCategories.forEach(category=>{                       /* pour chaque catégorie dans l'array getCategories */
        const modalOption = document.createElement("option")/* une option est créée */
        modalOption.value = category.id                     /* avec la valeur de l'ID */
        modalOption.textContent = category.name             /* et le texte égal au nom de la catégorie */
        modalCategorieSelect.appendChild(modalOption)       /* ajout à la liste déroulante */
    })

    modalCategorieSelect.addEventListener("change", function () {
        const categoryContainer = modalCategorieSelect.parentElement
    
        if (modalCategorieSelect.value) {
            /*si une catégorie est sélectionnée, ajoute la classe "category-selected" et retire "modal-hide-text"*/
            categoryContainer.classList.add("category-selected")
            categoryContainer.classList.remove("modal-hide-text")
        } else {
            /* si aucune catégorie n'est sélectionnée, retire la classe "category-selected" et ajoute "modal-hide-text"*/
            categoryContainer.classList.remove("category-selected")
            categoryContainer.classList.add("modal-hide-text")
        }
        modalCategorieSelect.classList.toggle("category-selected", modalCategorieSelect.value !== "")
        modalCategorieSelect.classList.toggle("modal-hide-text", modalCategorieSelect.value === "")
    })

    const modalLine = document.createElement('div') /* ligne séparatrice */
    modalLine.classList.add('modal-ligne')

    modalButton = document.createElement("button") /* bouton de validation qui soumet le formulaire */
    modalButton.type = "submit"
    modalButton.innerText = "Valider"
    modalButton.classList.add("form-btn")
    
    modalButton.addEventListener('click', async function (e) {
        e.preventDefault();
        const titleInput = document.querySelector("input[name='title']");
         titleValue = titleInput ? titleInput.value : ''

        console.log('Before validateForm');
    
        const result = validateForm(titleValue);
        const errorContainer = modalWrapper.querySelector('.error-container');
    
        console.log('After validateForm');
        console.log('Title input value:', titleValue);

        if (result.isValid) {
            console.log('Before sendFormData');
            await sendFormData(e, modalImageInput, modalWrapper);
            console.log('After sendFormData');
    
            hideCreateForm();
            showAllModalContent();
            closeModal(e);
        } else {
            displayErrors(result.errors, errorContainer);
        }
    });
    
    modalImageLabel.appendChild(modalImageIcon); /* tout rattaché au modalWrapper*/
    modalImageLabel.appendChild(modalImageInput);
    modalImageLabel.appendChild(ModalBtnAdd);
    modalImageLabel.appendChild(modalText);
    modalForm.appendChild(modalImageLabel);
    modalForm.appendChild(modalTitleLabel);
    modalForm.appendChild(modalTitleInput);
    modalForm.appendChild(modalCategorieLabel);
    modalForm.appendChild(modalCategorieSelect);
    modalForm.appendChild(modalLine);
    modalForm.appendChild(modalButton);
    modalWrapper.appendChild(modalBackBtn);
    modalWrapper.appendChild(modalCloseBtn);
    modalWrapper.appendChild(modalTitre);
    modalWrapper.appendChild(modalForm); 
  
    modalImageInput.addEventListener("change", function (e){ /* vérification taille Img */
        checkSizePhoto(e, modalImageLabel)
    })

    const errorContainer = document.createElement('div');
    errorContainer.classList.add('error-container');
    modalWrapper.appendChild(errorContainer);

    modalForm.addEventListener("submit", function(e){
        e.preventDefault();
        const result = validateForm(); // Appeler la fonction de validation
        if (result.isValid) {
        sendFormData(e, modalImageInput, modalWrapper) /* envoi les données du Form */
        hideCreateForm()
        showAllModalContent()  
        }else{
            displayErrors(result.errors, errorContainer)
        }
    })
}

document.addEventListener('DOMContentLoaded', function () {  /* Attend que le DOM soit complétement chargé avant d'exécuter le code */
    const modalWrapper = document.querySelector('.modal-wrapper')
    console.log("c'est", modalWrapper)
})

function validateForm(titleValue) {
    const errors = [];
    const catId = modalCategorieSelect.value;
    console.log('Title input value:', titleValue);
    console.log('Category ID:', catId);

    if (!titleValue.trim()) {
        errors.push("Veuillez entrer un titre.");
    }

    if (!catId) {
        errors.push("Veuillez sélectionner une catégorie.");
    }

    console.log('Validation result:', errors);
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}
function displayErrors(errors, errorContainer) {
    // Efface les erreurs précédentes
    errorContainer.innerHTML = '';

    if (errors.length > 0) {
        // Affiche les nouvelles erreurs
        const errorList = document.createElement('ul');
        errors.forEach(error => {
            const errorItem = document.createElement('li');
            errorItem.textContent = error;
            errorList.appendChild(errorItem);
        });
        errorContainer.appendChild(errorList);
        errorContainer.style.display = 'block'; // Affiche le conteneur d'erreur
    } else {
        errorContainer.style.display = 'none'; // Cache le conteneur d'erreur s'il est vide
    }
}





/*********************************************Envoi données du formulaire**********************************/

async function sendFormData(e,modalImageInput) {
    e.preventDefault()
    if (!modalWrapper || !modalImageInput) {
        console.error("Les éléments nécessaires ne sont pas définis.");
        return;
    }
    const apiWorks = "http://localhost:5678/api/works" /* récupère l'url */
    const token = localStorage.getItem('token')        /* récupère le token */
    console.log("le token du form", token)
    const imgResult = modalImageInput.files[0]          /* récup img sélectionnée dans le champ de fichier */
    console.log("l'image result", imgResult)
    let title = document.querySelector("input[name='title']").value /* récup du titre dans le champ de texte */
    const errorContainer = modalWrapper.querySelector('.error-container');
    if (!errorContainer) {
        console.error("Le conteneur d'erreurs n'est pas défini.");
        return;
    }
    if (!title.trim()) {
        const errorMessage = "Veuillez entrer un titre.";
        displayError(errorMessage, errorContainer);
        return;
    }
    const titleInput = document.querySelector("input[name='title']")
    titleInput.addEventListener('change', function() {
        console.log('Titre modifié :', titleInput.value)
    title = titleInput.value
    })
   
   let catId = modalCategorieSelect.value
    // Remise à zéro du contenu du conteneur d'erreur
    errorContainer.innerHTML = '';

    
    if (modalCategorieSelect.value !== "") {
         catId = modalCategorieSelect.value;
        console.log('Catégorie sélectionnée :', catId)
    } else {
        console.log("Aucune catégorie sélectionnée")
    }
   
    if (!imgResult) {
        errorContainer.innerHTML = '<p>Veuillez sélectionner un fichier.</p>';

        return
    }

      if (!title) {
        errorContainer.innerHTML = '<p>Veuillez entrer un titre.</p>';
        return;
    }

    if (!catId) {
        errorContainer.innerHTML = '<p>Veuillez sélectionner une catégorie.</p>';
        return;
    } 
    
    const formData = new FormData() /* création objet FormData pour envoyer les données */
    formData.append('title', title)
    formData.append('image', imgResult)
    formData.append('category', catId)

    try {
        const response = await fetch(apiWorks, { /* Envoi de la requête POST avec les données du form */
          method: "POST",
          headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${token}`
          },
          body: formData
        })

        if (response.ok) {                        /* Vérification de la réponse du serveur */
            const newWork = await response.json() /* conversion en JSON */
            getPhotos.push(newWork)               /* ajout de la nouvelle photo à getPhotos */
            sectionGallery.innerHTML = ""
            afficherPhotos(getPhotos, sectionGallery)
            modalWrapper.innerHTML = ""
            afficherGaleriePhoto(getPhotos)
            console.log("Fermeture de la modale après ajout")
         
    } else {
      console.log("Une erreur est survenue lors de l'ajout de l'élément dans la galerie")
    }
    
  } catch (error) {
    console.log("La communication avec le serveur à échoué", error)
  }

}
function displayError(message, errorContainer) {
    // Efface les erreurs précédentes
    errorContainer.innerHTML = '';

    // Affiche la nouvelle erreur
    const errorList = document.createElement('ul');
    const errorItem = document.createElement('li');
    errorItem.textContent = message;
    errorList.appendChild(errorItem);
    errorContainer.appendChild(errorList);
    errorContainer.style.display = 'block'; // Affiche le conteneur d'erreur
}

/**********************************************Vérification taille photo*****************************************************/

function checkSizePhoto(e, modalImageLabel) {
    const file = e.target.files[0] /* Récupère le fichier sélectionné */
    if (file.size > 4 * 1024 * 1024) {
      alert("La taille de l'image ne doit pas dépasser 4 Mo.")
      e.target.value = ""                                   /*remise a 0 de la valeur de l'input pour que l'utilisateur  sélectionne à nouveau un fichier*/
    } else {                                                /* La taille du fichier est valide*/
        const imgPreview = document.createElement("img")    /*création d'un élément img pour la prévisualisation de l'image*/
        imgPreview.classList.add("preview-img")
        imgPreview.src = URL.createObjectURL(file)          /* attribution de l'URL */
  
        modalImageLabel.innerHTML = ""                      /*remplace les éléments dans modalImgLabel par l'image sélectionnée*/
        modalImageLabel.appendChild(imgPreview)
    
        modalImageLabel.innerHTML = ""                      /*change la couleur du bouton*/
        modalImageLabel.appendChild(imgPreview)
        modalButton.style.backgroundColor = "#1d6154"
      }
}
  