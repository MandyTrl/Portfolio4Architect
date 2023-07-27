import { getProjects } from "./fetcher.js"
import { projectsApiUrl } from "./links.js"
import { fetchData } from "./projects.js"

const projects = await fetchData(getProjects()) //besoin du await pour avoir la réponse dans les fct async sinon ça renvoie la promesse
const pictures = projects.map((el) => {
	return {
		id: el.id,
		url: el.imageUrl,
	}
})
const token = localStorage.getItem("Token")

// Fct pour supprimer un projet
async function deleteProject(id) {
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

//récupération des éléments du DOM
const modal = document.getElementById("modal")
const closeBtn = document.getElementById("close-modal")
const openModal = document.getElementById("open-modal")
const content = document.getElementById("content")

// Fct pour générer la galerie d'images
function createPicturesGallery() {
	pictures.forEach((img) => {
		//création des éléments (DOM) avec les datas reçues
		const pictureContainer = document.createElement("div")
		pictureContainer.className = "picture-container"

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
		const containerIconeT = document.createElement("div")
		containerIconeT.className = "container-iconeT"
		containerIconeT.addEventListener("click", () => {
			deleteProject(img.id)
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

// Display de la modal
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

//ferme la modal qd le clic se fait en-dehors de celle-ci
window.addEventListener("mousedown", (e) => {
	const targetElement = e.target
	const isInsideModal = modal.contains(targetElement) //check si le user click dans la modal

	if (!isInsideModal && targetElement !== openModal) {
		closeModalHandler()
	}
})
