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
		const span = document.createElement("edit-txt")
		span.innerText = "Editer"

		//association des éléments enfants aux éléments parents du DOM
		content.appendChild(pictureContainer)
		pictureContainer.appendChild(picture)
		pictureContainer.appendChild(span)
	})
}

createPicturesGallery()
