import { projectsApiUrl } from './links.js'

const token = localStorage.getItem('Token')

//Supprimer un projet
export async function deleteProject(id) {
	try {
		const response = await fetch(`${projectsApiUrl}/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`, //envoi du token à l'appel de la route pr (accès autorisé)
			},
		})

		if (!response.ok) {
			throw new Error('Error deleting project')
		} else {
			console.log('Project successfully deleted !')
		}
	} catch (error) {
		console.error(error.message)
	}
}

//Supprimer tous les projets
export async function deleteAllProjects() {
	try {
		const response = await fetch(`${projectsApiUrl}/all`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`, //envoi du token à l'appel de la route pr (accès autorisé)
			},
		})

		if (!response.ok) {
			throw new Error('Error deleting projects')
		} else {
			console.log('Projects successfully deleted !')
			createErrorMsg()
		}
	} catch (error) {
		console.error(error.message)
	}
}
