function getModificators ($el) {
	return $el.attr('class').split(' ').slice(1)
}

function removeModificators () {
	let $modalDefault = $('.modals-container')

	getModificators($modalDefault).forEach(function (mod) {
		$modalDefault.removeClass(mod)
	})
}

function stopVideo () {
	let $modalDefault = $('.modals-container')

	let iframes = $modalDefault.find('iframe')
	iframes[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*')
}

function loadVideo (videoId) {
	let $modalDefault = $('.modals-container')

	let $videoWrapper = $modalDefault.find('.video-wrapper')
	$videoWrapper.find('iframe').remove()
	$('<iframe frameborder="0" allowfullscreen=></iframe>')
		.attr('src', `https://www.youtube.com/embed/${videoId}?enablejsapi=1`)
		.appendTo($videoWrapper)
}

function closeModal () {
	let $modalDefault = $('.modals-container')
	$('body').removeClass('overflow-hidden')

	if ($modalDefault.hasClass('_video')) {
		stopVideo($modalDefault)
	}
	$modalDefault.removeClass('_show')
	removeModificators($modalDefault)
}

function openModal (modelClass) {
	let $modalDefault = $('.modals-container')
	$('body').addClass('overflow-hidden')
	removeModificators($modalDefault)
	$modalDefault.addClass('_show')
	$modalDefault.addClass('_' + modelClass)
}

$(function () {
	let $modalDefault = $('.modals-container')

	$('[data-video]').on('click.openVideoModal', function (e) {
		e.preventDefault()
		loadVideo($(this).data('video'))
		openModal('video')
	})
	$('[data-modal]').on('click.openModal', function (e) {
		e.preventDefault()
		openModal($(this).data('modal'))
	})
	$modalDefault.on('click.closeModal', function (e) {
		e.preventDefault()
		closeModal()
	})
	$modalDefault.on('click.closeModal', '.modal__outer', function (e) {
		e.stopPropagation()
	})
	$('.modal__close').on('click.closeModal', function (e) {
		e.preventDefault()
		closeModal()
	})
	$modalDefault.on('click.closeModal', '.modal-default__inner', function (e) {
		e.stopPropagation()
	})
})

// Handle modal closing with `esc` button

$(document).keyup(function (e) {
	if (e.keyCode === 27) {
		closeModal($('.modal-default'))
	}
})
