$.createToast = function ({
	title = "",
	message = "",
	type = "success",
	duration = 3000
}) {
	const parentToast = document.getElementById("toast");
	const div = document.createElement("div");

	const autoRemoveId = setTimeout(function () {
		parentToast.removeChild(div);
	}, duration + 1000);

	type == "danger" && (type = "error"); // "danger" is not a valid type, so we change it to "error

	const icons = {
		success: {
			icon: "fas fa-check-circle",
			color: "#00d68f"
		},
		info: {
			icon: "fas fa-info-circle",
			color: "#2770ff"
		},
		warning: {
			icon: "fas fa-exclamation-circle",
			color: "#ff9f43"
		},
		error: {
			icon: "fas fa-exclamation-circle",
			color: "#ff5b5b"
		}
	};

	const getInfo = icons[type];
	const delay = (duration / 1000).toFixed(2);

	div.classList.add("toast");
	div.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;
	div.style.border = `1px solid ${getInfo.color}`;

	const className = 'progress_' + Date.now();
	div.innerHTML = `
		<div class="toast-content">
			<i class="${getInfo.icon} ${type}"></i>
			<div class="message">
				${title ? `<span class="text text-1 text-${type === "error" ? "danger" : type}">${title}</span>` : ''}
				<span class="text text-2 text-${type === "error" ? "danger" : type}">${message}</span>
			</div>
		</div>
		<i class="fa-solid fa-xmark close"></i>

		<div class="progress ${className}"></div>
	`;
	const iClose = div.querySelector('.close');
	iClose.addEventListener("click", function () {
		clearTimeout(autoRemoveId);
		parentToast.removeChild(div);
	});
	const styleTag = document.createElement("style");

	styleTag.innerHTML = `
		.progress.${className}:before {
			background: ${getInfo.color};
			animation: progress ${delay}s linear forwards;
		}
		.toast .progress .${className}:before {
			background: ${getInfo.color};
		}
	`;
	div.appendChild(styleTag);
	parentToast.appendChild(div);
};