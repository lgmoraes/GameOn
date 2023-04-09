// CONST
const NAME_LEN_MIN = 2;
const TEXTS = {
	required: {
		text: "Veuillez compléter ce champs.",
		radio: "Veuillez selectionner une des réponses.",
		termsOfUse: "Veuillez accepter les conditions d'utilisation.",
	},
	invalid: {
		first: "Veuillez saisir un prénom valide.",
		last: "Veuillez saisir un prénom valide.",
		tooShort: `Trop court. Veuillez entrer au moins ${NAME_LEN_MIN} caractères`,
		email: "Veuillez saisir un email valide.",
		birthdate: "Veuillez saisir une date valide.",
		quantity: "Veuillez saisir un nombre valide.",
	},
};
const DATE = 0;
const YEAR = 1;
const MONTH = 2;
const DAY = 3;

// DOM Elements
const header = document.querySelector(".header");
const navbar = document.querySelector(".header__navbar");
const modalbg = document.querySelector(".modal");
const modalContent = document.querySelector(".modal__content");
const modalThanksPage = document.querySelector(".modal__thanksPage");
const modalThanksPageBtn = document.querySelector(".modal__thanksPage .btn-primary");
const modalBtn = document.querySelector(".btn-signup");
const modalclose = document.querySelector(".close");
const formData = document.querySelectorAll(".formData");
const form = document.querySelector(".modal__form");
const textInputs = document.querySelectorAll(
	"input[type=text], input[type=email], input[type=date], input[type=number]"
);
const radios = Array.from(document.querySelectorAll("input[name=location]"));
const requiredCheckbox = document.querySelector("#checkbox1");
const navBarBtn = document.querySelector('.header__navbar .icon');

// EVENTS
modalBtn.addEventListener("click", toggleModal);
modalclose.addEventListener("click", toggleModal);

textInputs.forEach((input) =>
	input.addEventListener("blur", () => {
		input.value = input.value.trim();

		if (input.value === "" || validateInput(input)) {
			clearError(input);
		} else {
			setError(input, TEXTS.invalid[input.name]);
		}
	})
);

radios.forEach((radio) => {
	radio.addEventListener("click", () => clearError(radio));
});

requiredCheckbox.addEventListener("change", () => clearError(requiredCheckbox));

form.addEventListener("submit", (e) => {
	e.preventDefault();

	if (validateForm()) {
		form.classList.remove("visible");
		modalThanksPage.classList.add("visible");
		form.reset();
	}
});

modalThanksPageBtn.addEventListener("click", () => {
	toggleModal();
});

navBarBtn.addEventListener("click", () => toggleNav());

// FUNCTIONS

function validateForm() {
	const radioChecked = radios.find((r) => r.checked === true);

	let result = true;

	textInputs.forEach((input) => {
		if (input.value === "") {
			setError(input, TEXTS.required["text"]);
			result = false;
		} else if (["first", "last"].includes(input.name) && input.value.length < NAME_LEN_MIN) {
			setError(input, TEXTS.invalid.tooShort);
			result = false;
		} else if (!validateInput(input)) {
			setError(input, TEXTS.invalid[input.name]);
			result = false;
		}
	});

	if (!radioChecked) {
		setError(radios[0], TEXTS.required.radio);
		result = false;
	}
	if (!requiredCheckbox.checked) {
		setError(requiredCheckbox, TEXTS.required.termsOfUse);
		result = false;
	}

	return result;
}

function validateInput(input) {
	var type = input.getAttribute("type");
	var regex = null;
	var number = null;

	switch (type) {
		case "text":
			regex = new RegExp(/^[A-Za-zÀ-ÖØ-öø-ÿs-]{2,}$/g);
			return regex.test(input.value);

		case "number":
			number = parseFloat(input.value);
			return Number.isInteger(number) && number > -1;

		case "email":
			regex = new RegExp(/^[\w.]+@\w+\.\w{2,6}$/g);
			return regex.test(input.value);

		case "date":
			const today = new Date();
			var result;
			
			regex = new RegExp(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/g);
			result = regex.exec(input.value);

			if (result === null)
				return false;
			else if (result[DATE] >= today.toISOString().substring(0,10))
				return false;
			else if (result[YEAR] < 1900 || result[YEAR] > today.getFullYear())
				return false;
			else if (result[MONTH] < 1 || result[MONTH] > 12)
				return false;
			else if (result[DAY] < 1 || result[DAY] > 31)
				return false;

			return true;
	}
}

function setError(input, message) {
	input.parentElement.setAttribute("data-error", message);
	input.parentElement.setAttribute("data-error-visible", true);
}

function clearError(input) {
	input.parentElement.setAttribute("data-error-visible", false);
}

// launch or close modal form
function toggleModal() {
	var html = document.querySelector("html");

	// Control modal display
	if (!modalbg.classList.contains("visible")) {
		// Reset tabs
		form.classList.add("visible");
		modalThanksPage.classList.remove("visible");
	}

	modalbg.classList.toggle("visible");

	// Prevent double scroll
	html.classList.toggle("noScroll");
	html.scrollTop = 0;
}

// launch or close navbar
function toggleNav() {
	header.classList.toggle('expended');
	navbar.classList.toggle("open");
}