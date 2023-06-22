import { getProjects, getCategories } from "./fetcher.js"

// 👇 Fct générale pour exploiter les datas
async function fetchData(datas) {
	try {
		const response = await datas //récupération des datas
		return response
	} catch (error) {
		console.error(
			"Une erreur s'est produite lors de la récupération des données : ",
			error
		)
	}
}

// 👇 Fct pour créer un bouton (filtres)
function createCategoriesBtn(categories, projectDB) {
	const cat = ["Tous", ...categories] //nvx tableau avec l'ajout du bouton "Tous"

	//association des éléments enfants aux éléments parent du DOM
	const galleryContainer = document.querySelector(".gallery")
	const filters = document.createElement("filters")
	const figure = document.createElement("figure")

	galleryContainer.appendChild(filters)

	projectDB.forEach((project) => {
		//création des éléments du DOM avec les datas reçues
		const picture = document.createElement("img")
		picture.setAttribute("src", project.imageUrl)
		picture.setAttribute("alt", project.alt)
		const subtitle = document.createElement("figcaption")
		subtitle.textContent = project.title

		//association des éléments enfants aux éléments parent du DOM
		galleryContainer.appendChild(figure)
		figure.appendChild(picture)
		figure.appendChild(subtitle)
	})

	cat.forEach((nameCat) => {
		//création du bouton
		const btnCategory = document.createElement("button")
		btnCategory.type = "button"
		btnCategory.innerText = nameCat
		btnCategory.classList.add = "btn-filters"
		btnCategory.addEventListener("click", () => {
			alert("You clicked the button!")
		})
		//association des btns à la div "filters"
		filters.appendChild(btnCategory)
	})

	console.log(filters)

	return createCategoriesBtn
}

// 👇 Fct pour créer un projet (DOM)
// function createProject(projectDB) {
// 	projectDB.forEach((project) => {
// 		//création des éléments du DOM avec les datas reçues
// 		const galleryContainer = document.querySelector(".gallery")
// 		const figure = document.createElement("figure")
// 		const picture = document.createElement("img")
// 		picture.setAttribute("src", project.imageUrl)
// 		picture.setAttribute("alt", project.alt)
// 		const subtitle = document.createElement("figcaption")
// 		subtitle.textContent = project.title

// 		//association des éléments enfants aux éléments parent du DOM
// 		galleryContainer.appendChild(figure)
// 		figure.appendChild(picture)
// 		figure.appendChild(subtitle)
// 	})

// 	return createProject
// }

// 👇 Fct pour créer les projets et les boutons(filtre) avec les datas reçues
async function displayProjects() {
	const projects = await fetchData(getProjects())
	const categories = await fetchData(getCategories())

	// await createProject(projects)
	await createCategoriesBtn(categories, projects)
}

displayProjects() //appel de la fct
