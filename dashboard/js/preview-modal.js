$(document).on("click", ".preview-modal", function () {
	const thisEl = $(this);
	const divModal = document.createElement("div");
	divModal.innerHTML = `
	<div class="modal fade" tabindex="-1" id="preview-with-modal" aria-labelledby="previewImageLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered modal-xl">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-4">Preview</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					${thisEl[0].outerHTML}
				</div>
			</div>
		</div>
	</div>
	`;

	document.body.appendChild(divModal);
	$("#preview-with-modal").modal("show");
	$("#preview-with-modal").on("hidden.bs.modal", function (e) {
		$("#preview-with-modal").remove();
	});
});