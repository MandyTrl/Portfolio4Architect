export async function getProjects() {
	const reponse = await fetch("http://localhost:5678/api/works")
	const projects = await reponse.json() //désérialisation

	return projects
}
