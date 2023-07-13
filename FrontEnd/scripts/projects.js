import { getProjects, getCategories } from "./fetcher.js"

// Fct générale pour exploiter les datas
export async function fetchData(datas) {
	try {
		const response = await datas //récupération des datas
		return response
	} catch (error) {
		return errorMsg(error)
	}
}

// Fct pour déterminer le type d'erreur
function errorMsg(error) {
	let errorMSG = ""
	if (error.message === "No data found") {
		errorMSG = "Oops.. Aucun projet trouvé"
	} else if (error.message === "Error connecting to database") {
		errorMSG = "Oops.. Une erreur technique est survenue"
	} else console.log("Error message:", error.message)

	return createErrorMsg(errorMSG)
}

// Fct pour créer le message d'erreur côté front/client
function createErrorMsg(err) {
	const galleryContainer = document.querySelector(".gallery")
	const existingErrorMsg = galleryContainer.querySelector(".error-message")

	if (existingErrorMsg) {
		if (existingErrorMsg.innerText === err) {
			//si un msg d'erreur identique existe déjà -> on n'en créé pas de nvx
			return galleryContainer
		}
	}

	const errorDiv = document.createElement("div")
	errorDiv.innerText = err
	errorDiv.className = "error-message"
	galleryContainer.appendChild(errorDiv)

	return galleryContainer
}

// Fct pour générer la gallerie
function createGallery(categoriesDB, projectDB) {
	const cat = ["Tous", ...categoriesDB] //nvx tableau avec l'ajout du bouton "Tous"

	//association + création des éléments globaux du DOM
	const galleryContainer = document.querySelector(".gallery")
	const filters = document.createElement("div")
	filters.className = "filters" //ajoute une classe à la div "filters"
	const figure = document.createElement("figure")
	figure.className = "figure"

	galleryContainer.appendChild(filters)
	galleryContainer.appendChild(figure)

	// Création des projets
	const projectsDiv = [] //tableau pour stocker les div de chaque projet

	projectDB.forEach((project) => {
		//création des éléments (DOM) avec les datas reçues
		const projectContainer = document.createElement("div")
		projectContainer.className = "project-container"
		projectContainer.dataset.category = project.category.name //stock dans l'attribut data la catégorie du projet
		const picture = document.createElement("img")
		picture.setAttribute("src", project.imageUrl)
		picture.setAttribute("alt", project.alt)
		const subtitle = document.createElement("figcaption")
		subtitle.textContent = project.title

		//association des éléments enfants aux éléments parents du DOM
		projectContainer.appendChild(picture)
		projectContainer.appendChild(subtitle)
		figure.appendChild(projectContainer)

		projectsDiv.push(projectContainer) //ajoute le projet au tableau "projectsDiv"
	})

	// Création des boutons
	cat.forEach((nameCat) => {
		//création du btn (DOM)
		const btnCategory = document.createElement("button")
		btnCategory.type = "button"
		btnCategory.innerText =
			nameCat === "Hotels & restaurants" ? "Hôtels & restaurants" : nameCat
		btnCategory.className = "btn-filters"

		// Création du filtre au clic en fonction des catégories
		btnCategory.addEventListener("click", () => {
			// Afficher tous les projets si le bouton "Tous" est cliqué
			if (nameCat === "Tous") {
				projectsDiv.forEach((el) => {
					el.style.display = "block"
				})
			} else {
				// Filtrer les projets par catégorie
				projectsDiv.forEach((el) => {
					const projectCatName = el.dataset.category

					if (nameCat !== projectCatName) {
						el.style.display = "none"
					} else {
						el.style.display = "block"
					}
				})
			}
		})
		filters.appendChild(btnCategory) //association des btns à la div "filters"
	})

	return galleryContainer //retourne le contenu de la gallerie
}

// Fct pour créer les projets et les boutons (filtre) avec les datas reçues
async function displayProjects() {
	const projects = await fetchData(getProjects())
	const categories = await fetchData(getCategories())

	await createGallery(categories, projects)
}
displayProjects() //appel de la fct

// Récupération du token et affichage de l'edit bar
const editBar = document.getElementById("edit-bar")
const token = localStorage.getItem("Token")
if (token) {
	editBar.style.display = "flex" //affiche l'edit-bar sur la home page
}
