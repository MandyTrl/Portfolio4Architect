import { loginPageUrl, homePageUrl, loginApiUrl } from "./links.js"

const loginForm = document.getElementById("login-form") //récupération des éléments du DOM
const alerteMSG = document.getElementById("alert-msg")

loginForm.onsubmit = (e) => {
	e.preventDefault() //empêche le chargement d'une nouvelle page par le navigateur
	authentification() //appelle la fct d'authent
}

async function authentification() {
	const userForm = JSON.stringify({
		email: email.value, //récupération des valeurs des inputs
		password: password.value,
	}) //sérialisation

	console.log(userForm)

	try {
		const rawResp = await fetch(loginApiUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: userForm,
		})

		if (!rawResp.ok) {
			alerteMSG.innerText = "Erreur dans l'identifiant ou le mot de passe"
			throw new Error("Failed to fetch user")
		} else {
			window.location.href = homePageUrl
		}

		const user = await rawResp.json() //désérialisation

		return user
	} catch (error) {
		console.log("Error message:", error.message)
	}
}
