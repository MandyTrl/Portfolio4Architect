import { getProjects } from "./fetcher.js"
import { fetchData } from "./projects.js"

const projects = await fetchData(getProjects()) //besoin du await pour avoir la réponse dans les fct async sinon ça renvoie la promesse
const pictures = projects.map((el) => el.imageUrl) //tblx des url (img)

//récupération des éléments du DOM
const modal = document.getElementById("modal-content")
const modalBtn = document.getElementById("modal-btn")
const content = document.getElementById("content")

// Fct pour générer la galerie d'images
function createPicturesGallery() {
	pictures.forEach((img) => {
		//création des éléments (DOM) avec les datas reçues
		const pictureContainer = document.createElement("div")
		pictureContainer.className = "picture-container"

		const picture = document.createElement("img")
		picture.setAttribute("src", img)
		picture.setAttribute("alt", "picture-to-edit")
		const span = document.createElement("span")
		span.className = "edit-text"
		span.innerText = "éditer"

		const containerIconeM = document.createElement("div")
		containerIconeM.className = "container-iconeM"

		const containerIconeT = document.createElement("div")
		containerIconeT.className = "container-iconeT"

		const moveIcone = document.createElement("i")
		moveIcone.className =
			"fa-solid a-arrows-up-down-left-right fa-xs move-icone"
		moveIcone.style.color = "#ffff"

		const trashIcone = document.createElement("i")
		trashIcone.className = "fa-solid fa-trash-can fa-xs trash-icone"

		//association des éléments enfants aux éléments parents du DOM
		content.appendChild(pictureContainer)
		pictureContainer.appendChild(picture)
		pictureContainer.appendChild(span)
		pictureContainer.appendChild(containerIconeM)
		pictureContainer.appendChild(containerIconeM)
		containerIconeM.appendChild(moveIcone)
		containerIconeT.appendChild(trashIcone)
	})
}

createPicturesGallery()
