import { getProjects } from "./fetcher.js"

// 👇 Fct pour exploiter les datas
async function fetchData() {
	try {
		const projects = await getProjects() // Utilisation des projets récupérés
		return projects
	} catch (error) {
		console.error(
			"Une erreur s'est produite lors de la récupération des données : ",
			error
		)
	}
}

// 👇 Fct pour créer un projet (DOM)
function createProject(projectDB) {
	projectDB.forEach((project) => {
		//création des éléments du DOM avec les datas reçues
		const gallery = document.querySelector(".gallery")
		const figure = document.createElement("figure")
		const picture = document.createElement("img")
		picture.setAttribute("src", project.imageUrl)
		picture.setAttribute("alt", project.alt)
		const subtitle = document.createElement("figcaption")
		subtitle.textContent = project.title

		//association des éléments enfants aux éléments parent du DOM
		gallery.appendChild(figure)
		figure.appendChild(picture)
		figure.appendChild(subtitle)
	})

	return createProject
}

// 👇 Fct pour créer les projets avec les datas reçues
async function displayProjects() {
	const projects = await fetchData()
	await createProject(projects)
}

displayProjects() //appel de la fct
