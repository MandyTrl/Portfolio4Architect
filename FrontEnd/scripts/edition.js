import { getProjects, getCategories } from "./fetcher.js"
import { projectsApiUrl } from "./links.js"
import { fetchData } from "./projects.js"

const projects = await fetchData(getProjects()) //besoin du await pour avoir la réponse dans les fct async sinon ça renvoie la promesse
const categories = await fetchData(getCategories())

const pictures = projects.map((el) => {
	return {
		id: el.id,
		url: el.imageUrl,
	}
})
const token = localStorage.getItem("Token")

//récupération des éléments du DOM
const modal = document.getElementById("modal")
const modalContent = document.getElementById("content")
const modalContainer = document.getElementById("modal-content")
const closeBtn = document.getElementById("close-modal")
const openModal = document.getElementById("open-modal")
const content = document.getElementById("content")
const btnModal = document.getElementById("btn-modal")
const deleteGalleryBtn = document.getElementById("delete-all")
const line = document.getElementById("line")

//Générer la galerie d'images
function createPicturesGallery() {
	pictures.forEach((img) => {
		//création des éléments (DOM) avec les datas reçues
		const pictureContainer = document.createElement("div")
		pictureContainer.className = "picture-container"

		//display de l'icône "move" au survol
		pictureContainer.addEventListener("mouseover", () => {
			containerIconeM.style.display = "flex"
		})
		pictureContainer.addEventListener("mouseout", () => {
			containerIconeM.style.display = "none"
		})

		const picture = document.createElement("img")
		picture.setAttribute("src", img.url)
		picture.setAttribute("alt", "picture-to-edit")
		const span = document.createElement("span")
		span.className = "edit-text"
		span.innerText = "éditer"
		const containerIcones = document.createElement("div")
		containerIcones.className = "container-icones"

		const containerIconeM = document.createElement("div")
		containerIconeM.className = "container-iconeM"
		containerIconeM.style.display = "none"
		const containerIconeT = document.createElement("div")
		containerIconeT.className = "container-iconeT"
		containerIconeT.addEventListener("click", (e) => {
			openModalHandler()
			e.preventDefault()
			deleteProject(e, img.id)
		})

		const moveIcone = document.createElement("i")
		moveIcone.className =
			"fa-solid fa-arrows-up-down-left-right fa-xs move-icone"
		moveIcone.style.color = "#ffff"
		const trashIcone = document.createElement("i")
		trashIcone.className = `fa-solid fa-trash-can fa-xs trash-icone-${img.id}`
		trashIcone.style.color = "#ffff"

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

createPicturesGallery()

//Display de la modal
//fcts pour ouvrir/fermer la modal
function openModalHandler() {
	modal.style.display = "block"
}
function closeModalHandler() {
	modal.style.display = "none"
}

//ajout des écouteurs d'événements "click"
openModal.addEventListener("click", openModalHandler)
closeBtn.addEventListener("click", closeModalHandler)
deleteGalleryBtn.addEventListener("click", generteAlert)

//ferme la modal qd le clic se fait en-dehors de celle-ci
window.addEventListener("mousedown", (e) => {
	const targetElement = e.target
	const isInsideModal = modal.contains(targetElement) //check si le user click dans la modal

	if (!isInsideModal && targetElement !== openModal) {
		closeModalHandler()
	}
})

//Supprimer un projet
async function deleteProject(e, id) {
	e.preventDefault()
	try {
		const response = await fetch(`${projectsApiUrl}/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`, //envoi du token à l'appel de la route pr (accès autorisé)
			},
		})

		if (!response.ok) {
			throw new Error("Error deleting project")
		} else {
			console.log("Project successfully deleted !")
		}
	} catch (error) {
		console.error(error.message)
	}
}

//Supprimer tous les projets
async function deleteAllProjects() {
	try {
		const response = await fetch(`${projectsApiUrl}/test`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`, //envoi du token à l'appel de la route pr (accès autorisé)
			},
		})

		if (!response.ok) {
			throw new Error("Error deleting projects")
		} else {
			console.log("Projects successfully deleted !")
		}
	} catch (error) {
		console.error(error.message)
	}
}

btnModal.addEventListener("click", () => {
	modalContent.innerHTML = ""
	generateProjectForm()
})

//Confirmation de la suppression de tous les projets
function generteAlert() {
	modalContent.innerHTML = ""
	line.remove()
	btnModal.remove()
	deleteGalleryBtn.remove()
	document.querySelector("h3").remove()

	modal.style.backgroundColor = "#d65353"
	modal.style.padding = "8px 25px"
	content.style.flexDirection = "column"
	modalContainer.style.margin = "margin: 0 70px 20px 70px;"

	const confirm = document.createElement("div")
	confirm.className = "alert"
	confirm.innerHTML =
		"Êtes-vous sûr de vouloir supprimer tous vos projets ? <br><br> Cette action est définitive."
	confirm.style.marginBottom = "30px"

	const btnConfirmDelete = document.createElement("div")
	btnConfirmDelete.className = "btn-confirm-delete"
	btnConfirmDelete.innerHTML = "Oui"

	content.appendChild(confirm)
	content.appendChild(btnConfirmDelete)

	btnConfirmDelete.addEventListener("click", (e) => {
		e.preventDefault()
		deleteAllProjects()
		closeModalHandler()
	})
}

function generateProjectForm() {
	//modifie/mets à jour les éléments (DOM) nécessaires
	document.querySelector("h3").innerHTML = "Ajout photo"
	line.style.marginBottom = "75px"
	btnModal.innerHTML = "Valider"
	btnModal.setAttribute("type", "submit")
	btnModal.style.position = "fixed"
	btnModal.style.bottom = "28px"
	btnModal.style.left = "195px"
	deleteGalleryBtn.remove()

	//création des éléments (DOM)
	const projectForm = document.createElement("form")
	projectForm.className = "project-form"
	projectForm.setAttribute("enctype", "multipart/form-data")

	const containerImg = document.createElement("div")
	containerImg.className = "container-img"

	const imgIcone = document.createElement("i")
	imgIcone.className = "fa-regular fa-image fa-5x"
	imgIcone.style.color = "#b9c5cc"

	const inputImg = document.createElement("input")
	inputImg.className = "input-img"
	inputImg.name = "input-img"
	inputImg.setAttribute("type", "file")
	inputImg.style.opacity = 0
	inputImg.setAttribute("accept", "image/png, image/jpeg")

	//ajouter d'un écouteur d'événement de changement d'img
	inputImg.addEventListener("change", (event) => {
		const selectedFile = event.target.files[0]

		console.log(selectedFile)
	})

	const imgLabel = document.createElement("label")
	imgLabel.className = "btn-add-img"
	imgLabel.innerHTML = "+ Ajouter photo"
	imgLabel.setAttribute("for", "input-img")

	//permet de gérer le click de l'input sur le label
	imgLabel.addEventListener("click", () => {
		inputImg.click()
	})

	const spanImg = document.createElement("span")
	spanImg.innerHTML = "jpg, png : 4mo max"

	const inputTitle = document.createElement("input")
	inputTitle.type = "text"
	inputTitle.name = "Titre"
	inputTitle.className = "title"
	const titleLabel = document.createElement("label")
	titleLabel.innerHTML = "Titre"
	titleLabel.setAttribute("for", "title")

	const selectCategory = document.createElement("select")
	const categoryLabel = document.createElement("label")
	categoryLabel.innerHTML = "Catégorie"
	categoryLabel.setAttribute("for", "category")
	const opt = ["", ...categories]
	selectCategory.name = "Catégorie"
	selectCategory.className = "category"
	opt.forEach((el, key) => {
		selectCategory[key] = new Option(el, key)
	})

	//association des éléments enfants aux éléments parents du DOM
	modalContent.appendChild(projectForm)
	projectForm.appendChild(btnModal)
	projectForm.appendChild(containerImg)
	projectForm.appendChild(inputTitle)
	projectForm.insertBefore(titleLabel, inputTitle)
	projectForm.appendChild(selectCategory)
	projectForm.insertBefore(categoryLabel, selectCategory)
	containerImg.appendChild(imgIcone)
	containerImg.appendChild(inputImg)
	containerImg.insertBefore(imgLabel, inputImg)
	containerImg.appendChild(spanImg)

	//Gère l'envoi du formulaire d'ajout de nvx projet
	if (projectForm) {
		// Ajout de l'écouteur d'événement au bouton de validation
		btnModal.addEventListener("click", async () => {
			await addProject() //appelle la fct d'authent
		})
	}

	//Ajouter un nvx projet
	async function addProject() {
		const selectedOpt = selectCategory.selectedIndex

		if (selectedOpt === 0) {
			console.log("Veuillez sélectionner une catégorie")
			return
		}

		const newProject = new FormData()
		newProject.append("image", inputImg.files[0])
		newProject.append("title", inputTitle.value)
		newProject.append("category", selectedOpt)

		try {
			const response = await fetch(projectsApiUrl, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`, //envoi du token à l'appel de la route pr (accès autorisé)
				},
				body: newProject,
			})

			if (!response.ok) {
				throw new Error("Error add new project")
			} else {
				console.log("Project successfully added !")
			}
		} catch (error) {
			console.error(error.message)
		}
	}
}
