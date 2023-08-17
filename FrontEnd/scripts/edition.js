import { fetchData } from './projects.js'
import { projectsApiUrl } from './links.js'
import { getProjects, getCategories } from './fetcher.js'
import { deleteProject, deleteAllProjects } from './deleteProjects.js'

const projects = await fetchData(getProjects()) //besoin du await pour avoir la réponse dans les fct async sinon ça renvoie la promesse
const categories = await fetchData(getCategories())

const pictures = projects.map((el) => {
	return {
		id: el.id,
		url: el.imageUrl,
	}
})

const token = localStorage.getItem('Token')

//récupération des éléments du DOM
const body = document.body
const h2Intro = document.querySelector('#introduction h2')
const h2Projects = document.querySelector('#portfolio h2')
const profilPicture = document.getElementById('profil-picture')
const editContainers = document.querySelectorAll('.edit')
const modal = document.getElementById('modal')
const bgModal = document.getElementById('bg-modal')
const modalContent = document.getElementById('content')
const modalContainer = document.getElementById('modal-container')
const closeBtn = document.getElementById('close-modal')
const openModal = document.getElementById('open-modal')
const previousBtn = document.getElementById('previous')
const content = document.getElementById('content')
const modalBtn = document.getElementById('btn-modal')
const deleteGalleryBtn = document.getElementById('delete-all')
const line = document.getElementById('line')

//Génère le style d'édition
function generateEditMode() {
	h2Intro.style.marginTop = '35px'
	h2Projects.style.marginRight = '31px'
	profilPicture.style.marginBottom = '13px'

	for (const editContainer of editContainers) {
		editContainer.style.display = 'flex'
	}
}

if (token) {
	generateEditMode()
}

//Génère la galerie d'images
function generatePicturesGallery() {
	pictures.forEach((img) => {
		//création des éléments (DOM) avec les datas reçues
		const pictureContainer = document.createElement('div')
		pictureContainer.className = 'picture-container'

		//display de l'icône "move" au survol
		pictureContainer.addEventListener('mouseover', () => {
			containerIconeM.style.display = 'flex'
		})
		pictureContainer.addEventListener('mouseout', () => {
			containerIconeM.style.display = 'none'
		})

		const picture = document.createElement('img')
		picture.setAttribute('src', img.url)
		picture.setAttribute('alt', 'picture-to-edit')
		const span = document.createElement('span')
		span.className = 'edit-text'
		span.innerText = 'éditer'
		const containerIcones = document.createElement('div')
		containerIcones.className = 'container-icones'

		const containerIconeM = document.createElement('div')
		containerIconeM.className = 'container-iconeM'
		containerIconeM.style.display = 'none'
		const containerIconeT = document.createElement('div')
		containerIconeT.className = 'container-iconeT'
		containerIconeT.addEventListener('click', (e) => {
			deleteProject(e, img.id)
		})

		const moveIcone = document.createElement('i')
		moveIcone.className =
			'fa-solid fa-arrows-up-down-left-right fa-xs move-icone'
		moveIcone.style.color = '#ffff'
		const trashIcone = document.createElement('i')
		trashIcone.className = `fa-solid fa-trash-can fa-xs trash-icone-${img.id}`
		trashIcone.style.color = '#ffff'

		//association des éléments enfants aux éléments parents du DOM
		content.appendChild(pictureContainer)
		pictureContainer.appendChild(picture)
		pictureContainer.appendChild(span)
		pictureContainer.appendChild(containerIcones)
		containerIcones.appendChild(containerIconeM)
		containerIcones.appendChild(containerIconeT)
		containerIconeM.appendChild(moveIcone)
		containerIconeT.appendChild(trashIcone)
	})
}

generatePicturesGallery()

//Display de la modal
function openModalHandler() {
	modal.style.display = 'block'
	body.style.overflow = 'hidden'
}
function closeModalHandler() {
	modal.style.display = 'none'
	body.style.overflow = 'unset'
	modalContent.innerHTML = ''
}

//Ajout des écouteurs d'événements "click"
openModal.addEventListener('click', openModalHandler)
closeBtn.addEventListener('click', closeModalHandler)
deleteGalleryBtn.addEventListener('click', generateAlert)
previousBtn.addEventListener('click', (e) => {
	initialStyle(e)
})

modalBtn.addEventListener('click', (e) => {
	e.preventDefault()
	modalContent.innerHTML = ''
	generateProjectForm()
})

//Ferme la modal qd le clic se fait en-dehors de celle-ci
bgModal.addEventListener('mousedown', (e) => {
	const targetElement = e.target
	const isInsideModal = modalContainer.contains(targetElement) //check si le user click dans la modal

	if (!isInsideModal && targetElement !== openModal) {
		closeModalHandler()
	}
})

//Génère le formulaire
function generateProjectForm() {
	//modifie/mets à jour les éléments (DOM) nécessaires
	modalBtn.disabled = false
	document.querySelector('h3').innerHTML = 'Ajout photo'
	previousBtn.style.display = 'unset'
	deleteGalleryBtn.style.display = 'none'
	line.style.marginBottom = '135px'
	modalBtn.innerHTML = 'Valider'
	modalBtn.setAttribute('type', 'submit')
	modalBtn.style.position = 'fixed'
	modalBtn.style.bottom = '40px'
	modalBtn.style.left = '195px'
	modalBtn.disabled = true

	//création des éléments (DOM)
	const projectForm = document.createElement('form')
	projectForm.className = 'project-form'
	projectForm.setAttribute('enctype', 'multipart/form-data')

	const containerImg = document.createElement('div')
	containerImg.className = 'container-img'

	const imgIcone = document.createElement('i')
	imgIcone.className = 'fa-regular fa-image fa-5x'
	imgIcone.id = 'icone-fontAwesome'
	imgIcone.style.color = '#b9c5cc'

	const inputImg = document.createElement('input')
	inputImg.className = 'input-img'
	inputImg.name = 'input-img'
	inputImg.setAttribute('type', 'file')
	inputImg.style.opacity = 0
	inputImg.setAttribute('accept', 'image/png, image/jpeg')
	inputImg.addEventListener('change', (event) => {
		const imageLoaded = event.target.files[0]

		//Génère la prévisualisation de l'img s'il y a un fichier dans la listeFiles
		if (imageLoaded) {
			generatePicturePreview(imageLoaded)
		}
	})

	const imgLabel = document.createElement('label')
	imgLabel.className = 'btn-add-img'
	imgLabel.innerHTML = '+ Ajouter photo'
	imgLabel.setAttribute('for', 'input-img')

	//permet de gérer le click de l'input sur le label
	imgLabel.addEventListener('click', () => {
		inputImg.click()
	})

	const spanImg = document.createElement('span')
	spanImg.innerHTML = 'jpg, png : 4mo max'

	const inputTitle = document.createElement('input')
	inputTitle.type = 'text'
	inputTitle.name = 'Titre'
	inputTitle.className = 'title'
	const titleLabel = document.createElement('label')
	titleLabel.innerHTML = 'Titre'
	titleLabel.setAttribute('for', 'title')

	const selectCategory = document.createElement('select')
	const categoryLabel = document.createElement('label')
	categoryLabel.innerHTML = 'Catégorie'
	categoryLabel.setAttribute('for', 'category')
	const opt = ['', ...categories]
	selectCategory.name = 'Catégorie'
	selectCategory.className = 'category'
	opt.forEach((el, key) => {
		selectCategory[key] = new Option(el, key)
	})

	//association des éléments enfants aux éléments parents du DOM
	modalContent.appendChild(projectForm)
	projectForm.appendChild(modalBtn)
	projectForm.appendChild(containerImg)
	projectForm.appendChild(inputTitle)
	projectForm.insertBefore(titleLabel, inputTitle)
	projectForm.appendChild(selectCategory)
	projectForm.insertBefore(categoryLabel, selectCategory)
	containerImg.appendChild(imgIcone)
	containerImg.appendChild(inputImg)
	containerImg.insertBefore(imgLabel, inputImg)
	containerImg.appendChild(spanImg)

	//Génère la prévisualisation de l'img
	function generatePicturePreview(imageLoaded) {
		spanImg.remove()
		imgLabel.remove()
		imgIcone.remove()
		const iconeI = document.getElementById('icone-fontAwesome')
		iconeI.remove()

		inputImg.style.display = 'none'

		const analyseurImg = new FileReader()

		const previewImg = document.createElement('img')
		previewImg.className = 'preview-img'
		previewImg.src = ''
		previewImg.alt = 'preview-img'

		containerImg.appendChild(previewImg)

		analyseurImg.readAsDataURL(imageLoaded)

		analyseurImg.addEventListener('load', function () {
			previewImg.setAttribute('src', analyseurImg.result)
		})

		//Gère l'envoi du formulaire d'ajout de nvx projet
		function checkFormValidity() {
			const selectedOpt = selectCategory.selectedIndex
			const imageLoaded = inputImg.files[0]

			if (selectedOpt !== 0 && imageLoaded && inputTitle.value.trim() !== '') {
				modalBtn.disabled = false

				modalBtn.addEventListener('click', async () => {
					await addProject()
				})
			} else {
				modalBtn.disabled = true
			}
		}

		inputImg.addEventListener('change', (event) => {
			const imageLoaded = event.target.files[0]

			if (imageLoaded) {
				generatePicturePreview(imageLoaded)
			}
			checkFormValidity()
		})

		inputTitle.addEventListener('input', () => {
			checkFormValidity()
		})

		selectCategory.addEventListener('change', () => {
			checkFormValidity()
		})

		checkFormValidity()
	}

	//Ajouter un nvx projet
	async function addProject() {
		if (selectedOpt === 0) {
			console.log('Veuillez sélectionner une catégorie')
			return
		}

		const newProject = new FormData()
		newProject.append('image', inputImg.files[0])
		newProject.append('title', inputTitle.value)
		newProject.append('category', selectedOpt)

		try {
			const response = await fetch(projectsApiUrl, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`, //envoi du token à l'appel de la route pr (accès autorisé)
				},
				body: newProject,
			})

			if (!response.ok) {
				throw new Error('Error add new project')
			} else {
				console.log('Project successfully added !')
				selectCategory.selectedIndex = 0
			}
		} catch (error) {
			console.error(error.message)
		}
	}
}

//Confirmation de la suppression de tous les projets
function generateAlert() {
	modalContent.innerHTML = ''
	line.style.display = 'none'
	modalBtn.style.display = 'none'
	deleteGalleryBtn.style.display = 'none'
	document.querySelector('h3').style.display = 'none'

	modal.style.backgroundColor = '#d65353'
	modal.style.padding = '8px 25px'
	content.style.flexDirection = 'column'
	modalContainer.style.margin = 'margin: 0 70px 20px 70px;'

	const alertIcone = document.createElement('i')
	alertIcone.className = 'fa-solid fa-triangle-exclamation fa-xl'
	alertIcone.style.color = '#d65353'
	alertIcone.style.paddingTop = '38px'
	alertIcone.style.paddingBottom = '18px'

	const btnContainer = document.createElement('div')
	btnContainer.className = 'btn-container'

	const confirm = document.createElement('div')
	confirm.className = 'alert'
	confirm.innerHTML =
		'Êtes-vous sûr de vouloir supprimer tous vos projets ? <br><br> Cette action est définitive.'
	confirm.style.marginBottom = '20px'

	const btnConfirmDelete = document.createElement('div')
	btnConfirmDelete.className = 'btn-confirm-delete'
	btnConfirmDelete.innerHTML = 'Oui'

	const btnNo = document.createElement('div')
	btnNo.className = 'btn-no'
	btnNo.innerHTML = 'Non'

	content.appendChild(alertIcone)
	content.appendChild(confirm)
	content.appendChild(btnContainer)
	btnContainer.appendChild(btnConfirmDelete)
	btnContainer.appendChild(btnNo)

	btnConfirmDelete.addEventListener('click', (e) => {
		e.preventDefault()
		deleteAllProjects()
		closeModalHandler()
	})

	btnNo.addEventListener('click', (e) => {
		document.querySelector('h3').style.display = 'unset'
		line.style.display = 'unset'
		content.style.display = 'flex'
		content.style.flexDirection = 'row'
		content.style.flexWrap = 'wrap'

		initialStyle(e)
	})
}

function initialStyle(e) {
	e.preventDefault()

	//remise du style par default
	modalContent.innerHTML = ''
	previousBtn.style.display = 'none'
	deleteGalleryBtn.style.display = 'unset'
	modalBtn.disabled = false
	modalBtn.style.display = 'unset'
	modalBtn.innerHTML = 'Ajouter une photo'
	modalBtn.removeAttribute('type', 'submit')
	modalBtn.style.position = null
	modalBtn.style.bottom = null
	modalBtn.style.left = null
	line.style.marginBottom = '37px'

	modalContainer.appendChild(modalBtn)
	modalContainer.insertBefore(modalBtn, deleteGalleryBtn)

	generatePicturesGallery()
}
