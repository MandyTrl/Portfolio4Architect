import { homePageUrl, loginApiUrl } from "./links.js"

const loginForm = document.getElementById("login-form") //récupération des éléments du DOM
const alerteMSG = document.getElementById("alert-msg")
const img = document.getElementById("alert-icon")

loginForm.onsubmit = (e) => {
	e.preventDefault() //empêche le chargement d'une nouvelle page par le navigateur
	authentification() //appelle la fct d'authent
}

async function authentification() {
	const userForm = JSON.stringify({
		email: email.value, //récupération des valeurs des inputs
		password: password.value,
	}) //sérialisation

	try {
		const rawResp = await fetch(loginApiUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: userForm,
		})

		if (!rawResp.ok) {
			alerteMSG.innerText = "Erreur dans l'identifiant ou le mot de passe"
			img.src = "./assets/icons/alert.png"
			img.style.display = "block"

			throw new Error("Failed to fetch user")
		} else {
			alerteMSG.style.color = "#1d6154"
			alerteMSG.innerText = "Bienvenue !"
			img.src = "./assets/icons/welcome.png"
			img.style.display = "block"

			setTimeout(() => {
				window.location.href = homePageUrl
			}, 2500)
		}

		const user = await rawResp.json() //désérialisation

		return user
	} catch (error) {
		console.log("Error message:", error.message)
	}
}
