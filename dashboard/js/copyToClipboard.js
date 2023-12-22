$(document).ready(function () {
	$(document).on('click', '.copyToClipboard', function () {
		var copyText = $(this).attr('data-copy');
		var $temp = $("<input>");
		$("body").append($temp);
		$temp.val(copyText).select();
		document.execCommand("copy");
		$temp.remove();
		$.createToast({
			message: 'Copied to clipboard',
			type: 'success'
		});
	});
});