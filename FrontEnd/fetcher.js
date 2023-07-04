import { projectsApiUrl, categoriesApiUrl } from "./links.js"

// Fct pour appeler les projets
export async function getProjects() {
	try {
		const rawResp = await fetch(projectsApiUrl)
		if (!rawResp.ok) {
			throw new Error("Failed to fetch projects")
		} //check si le statut de la rep est successed

		const projects = await rawResp.json() //désérialisation

		if (!projects || projects.length === 0) throw new Error("No data found") //check si les datas ne sont pas vides

		return projects
	} catch (error) {
		if (error.message === "Failed to fetch") {
			throw new Error("Error connecting to database")
		} else console.log("Error message:", error.message)
	}
}

// Fct pour appeler les catégories
export async function getCategories() {
	try {
		const rawResp = await fetch(categoriesApiUrl)
		if (!rawResp.ok) {
			throw new Error("Failed to fetch categories")
		}
		const response = await rawResp.json()

		const categories = response.map((category) => category.name) //nvx tableau pour ne récupérer que les noms des catégories

		return categories
	} catch (error) {
		if (error.message === "Failed to fetch") {
			throw new Error("Error connecting to database")
		} else console.log("Error message:", error.message)
	}
}
