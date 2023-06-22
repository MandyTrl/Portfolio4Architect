// 👇 Fct pour appeler les projets
export async function getProjects() {
	const reponse = await fetch("http://localhost:5678/api/works")
	const projects = await reponse.json() //désérialisation

	return projects
}

fetch("http://localhost:5678/api/works")
	.then((resp) => resp.json())
	.catch(function (error) {
		console.log(error)
	})

// 👇 Fct pour appeler les catégories
export async function getCategories() {
	const rawResp = await fetch("http://localhost:5678/api/categories")
	const response = await rawResp.json() //désérialisation

	const categories = response.map((category) => category.name) //nvx tableau pour ne récupérer que les noms des catégories

	return categories
}

//TO DO >> pbm technique si API coupé côté fetch + aucun projet si datas vide
