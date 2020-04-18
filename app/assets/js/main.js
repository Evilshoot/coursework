$.fn.isInViewport = function () {
  var elementTop = $(this).offset().top
  var elementBottom = elementTop + $(this).outerHeight()

  var viewportTop = $(window).scrollTop()
  var viewportBottom = viewportTop + $(window).height()

  return elementBottom > viewportTop && elementTop < viewportBottom
}

// Add parameters from URL and custom params from 'url_add_params' object to href attribute
function addParamsOnLink($elem) {
  let url_destination = $elem.attr('href')
  if (url_destination === undefined || url_destination.length <= 0 || url_destination.indexOf('#') === 0)
    return

  let url_current = new URL(window.location.href)
  let params = ''


  if (typeof url_add_params !== 'undefined') {
    Object.entries(url_add_params).forEach(function (param) {
      params += param[0] + '=' + param[1] + '&'
    })
  }

  url_current.searchParams.forEach(function (value, key) {
    if (typeof url_add_params === 'undefined' || !url_add_params.hasOwnProperty(key))
      params += key + '=' + value + '&'
  })

  if (params.length > 0)
    url_destination += (url_destination.indexOf('?') > 0 ? '&' : '?') + params.substring(0, params.length - 1)

  $elem.attr('href', url_destination)
}

$(function () {
  const $nav = $('#navigation'),
    $toggler = $('.js-navbar-toggle'),
    $root = $('html, body'),
    $body = $('body')


  // Add class to nav if page is scrolled
  $(window).on('scroll', toggleNavScrolled)
  toggleNavScrolled()

  function toggleNavScrolled() {
    $nav.toggleClass('nav-scrolled', $(window).scrollTop() < 5)
  }

  //hamburger button open/close navbars
  $toggler.click(function () {
    $nav.hasClass('navigation--opened') ? closeNav() : openNav()
  })

  function closeNav() {
    $toggler.removeClass('is-active')
    $nav.removeClass('navigation--opened')
    $body.removeClass('overflow-hidden-navbar')
  }

  function openNav() {
    $toggler.addClass('is-active')
    $nav.addClass('navigation--opened')
    $body.addClass('overflow-hidden-navbar')
  }

  //smooth anchor links
  $('a[href]').click(function () {
    let href = $.attr(this, 'href')
    // check if anchor (starts with #) is in href
    if (href.split('#').length <= 1) return

    let anchor_name = href.split('#')[1].split('?')[0]
    if (anchor_name.length === 0)
      return

    let $anchor = $("#" + anchor_name)
    // check if there is object with id
    if ($anchor.length === 0)
      return

    $root.animate({
      scrollTop: $anchor.offset().top - $nav.outerHeight()
    }, 500)

    closeNav()
    return false
  })

  $('.js-pass-params').each(function () {
    addParamsOnLink($(this))
  })
})
