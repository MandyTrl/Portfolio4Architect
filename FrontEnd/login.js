import { loginPageUrl, homePageUrl, loginApiUrl } from "./links.js"

const loginForm = document.getElementById("login-form") //récupération des éléments du DOM
const submitBtn = document.getElementById("submit-button")

loginForm.addEventListener("submit", (e) => {
	e.preventDefault() //empêche le chargement d'une nouvvelle page par le navigateur
	authentification() //appelle la fct d'authent
})

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
		console.log(rawResp.ok, rawResp.status, rawResp.statusText)

		if (!rawResp.ok) {
			throw new Error("Failed to fetch user")
		}

		window.location.href = homePageUrl

		const user = await rawResp.json() //désérialisation

		console.log(user)

		if (!user) {
			const alerteMSG = document.createElement("div")
			alerteMSG.className = "alerte-msg"
			alerteMSG.innerText = "Erreur dans l'identifiant ou le mot de passe"
			loginForm.appendChild(alerteMSG)
		} else {
			window.location.href = homePageUrl
		}

		return user
	} catch (error) {
		console.log("Error message:", error.message)
	}
}

//actionne la soumission du formulaire au click du bouton
submitBtn.addEventListener("click", () => {
	loginForm.submit()
})
