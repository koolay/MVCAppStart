;/*!
 * Bootstrap v3.0.1 by @fat and @mdo
 * Copyright 2013 Twitter, Inc.
 * Licensed under http://www.apache.org/licenses/LICENSE-2.0
 *
 * Designed and built with all the love in the world by @mdo and @fat.
 */

if (typeof jQuery === "undefined") { throw new Error("Bootstrap requires jQuery") }

/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.0.0
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
        .prop('checked', !this.$element.hasClass('active'))
        .trigger('change')
      if ($input.prop('type') === 'radio') $parent.find('.active').removeClass('active')
    }

    this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.0.0
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.0.0
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    var $el = $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('dropdown')

      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.0.0
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.0.0
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.0.0
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.0
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#\w/.test(href) && $(href)

        return ($href
          && $href.length
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.0.0
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.0.0
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(window.jQuery);

;/*!
 * iCheck v1.0.1, http://git.io/arlzeA
 * ===================================
 * Powerful jQuery and Zepto plugin for checkboxes and radio buttons customization
 *
 * (c) 2013 Damir Sultanov, http://fronteed.com
 * MIT Licensed
 */

(function($) {

  // Cached vars
  var _iCheck = 'iCheck',
    _iCheckHelper = _iCheck + '-helper',
    _checkbox = 'checkbox',
    _radio = 'radio',
    _checked = 'checked',
    _unchecked = 'un' + _checked,
    _disabled = 'disabled',a
    _determinate = 'determinate',
    _indeterminate = 'in' + _determinate,
    _update = 'update',
    _type = 'type',
    _click = 'click',
    _touch = 'touchbegin.i touchend.i',
    _add = 'addClass',
    _remove = 'removeClass',
    _callback = 'trigger',
    _label = 'label',
    _cursor = 'cursor',
    _mobile = /ipad|iphone|ipod|android|blackberry|windows phone|opera mini|silk/i.test(navigator.userAgent);

  // Plugin init
  $.fn[_iCheck] = function(options, fire) {

    // Walker
    var handle = 'input[type="' + _checkbox + '"], input[type="' + _radio + '"]',
      stack = $(),
      walker = function(object) {
        object.each(function() {
          var self = $(this);

          if (self.is(handle)) {
            stack = stack.add(self);
          } else {
            stack = stack.add(self.find(handle));
          }
        });
      };

    // Check if we should operate with some method
    if (/^(check|uncheck|toggle|indeterminate|determinate|disable|enable|update|destroy)$/i.test(options)) {

      // Normalize method's name
      options = options.toLowerCase();

      // Find checkboxes and radio buttons
      walker(this);

      return stack.each(function() {
        var self = $(this);

        if (options == 'destroy') {
          tidy(self, 'ifDestroyed');
        } else {
          operate(self, true, options);
        }

        // Fire method's callback
        if ($.isFunction(fire)) {
          fire();
        }
      });

    // Customization
    } else if (typeof options == 'object' || !options) {

      // Check if any options were passed
      var settings = $.extend({
          checkedClass: _checked,
          disabledClass: _disabled,
          indeterminateClass: _indeterminate,
          labelHover: true
        }, options),

        selector = settings.handle,
        hoverClass = settings.hoverClass || 'hover',
        focusClass = settings.focusClass || 'focus',
        activeClass = settings.activeClass || 'active',
        labelHover = !!settings.labelHover,
        labelHoverClass = settings.labelHoverClass || 'hover',

        // Setup clickable area
        area = ('' + settings.increaseArea).replace('%', '') | 0;

      // Selector limit
      if (selector == _checkbox || selector == _radio) {
        handle = 'input[type="' + selector + '"]';
      }

      // Clickable area limit
      if (area < -50) {
        area = -50;
      }

      // Walk around the selector
      walker(this);

      return stack.each(function() {
        var self = $(this);

        // If already customized
        tidy(self);

        var node = this,
          id = node.id,

          // Layer styles
          offset = -area + '%',
          size = 100 + (area * 2) + '%',
          layer = {
            position: 'absolute',
            top: offset,
            left: offset,
            display: 'block',
            width: size,
            height: size,
            margin: 0,
            padding: 0,
            background: '#fff',
            border: 0,
            opacity: 0
          },

          // Choose how to hide input
          hide = _mobile ? {
            position: 'absolute',
            visibility: 'hidden'
          } : area ? layer : {
            position: 'absolute',
            opacity: 0
          },

          // Get proper class
          className = node[_type] == _checkbox ? settings.checkboxClass || 'i' + _checkbox : settings.radioClass || 'i' + _radio,

          // Find assigned labels
          label = $(_label + '[for="' + id + '"]').add(self.closest(_label)),

          // Check ARIA option
          aria = !!settings.aria,

          // Set ARIA placeholder
          ariaID = _iCheck + '-' + Math.random().toString(36).substr(2,6),

          // Parent & helper
          parent = '<div class="' + className + '" ' + (aria ? 'role="' + node[_type] + '" ' : ''),
          helper;

        // Set ARIA "labelledby"
        if (aria) {
          label.each(function() {
            parent += 'aria-labelledby="';

            if (this.id) {
              parent += this.id;
            } else {
              this.id = ariaID;
              parent += ariaID;
            }

            parent += '"';
          });
        }

        // Wrap input
        parent = self.wrap(parent + '/>')[_callback]('ifCreated').parent().append(settings.insert);

        // Layer addition
        helper = $('<ins class="' + _iCheckHelper + '"/>').css(layer).appendTo(parent);

        // Finalize customization
        self.data(_iCheck, {o: settings, s: self.attr('style')}).css(hide);
        !!settings.inheritClass && parent[_add](node.className || '');
        !!settings.inheritID && id && parent.attr('id', _iCheck + '-' + id);
        parent.css('position') == 'static' && parent.css('position', 'relative');
        operate(self, true, _update);

        // Label events
        if (label.length) {
          label.on(_click + '.i mouseover.i mouseout.i ' + _touch, function(event) {
            var type = event[_type],
              item = $(this);

            // Do nothing if input is disabled
            if (!node[_disabled]) {

              // Click
              if (type == _click) {
                if ($(event.target).is('a')) {
                  return;
                }
                operate(self, false, true);

              // Hover state
              } else if (labelHover) {

                // mouseout|touchend
                if (/ut|nd/.test(type)) {
                  parent[_remove](hoverClass);
                  item[_remove](labelHoverClass);
                } else {
                  parent[_add](hoverClass);
                  item[_add](labelHoverClass);
                }
              }

              if (_mobile) {
                event.stopPropagation();
              } else {
                return false;
              }
            }
          });
        }

        // Input events
        self.on(_click + '.i focus.i blur.i keyup.i keydown.i keypress.i', function(event) {
          var type = event[_type],
            key = event.keyCode;

          // Click
          if (type == _click) {
            return false;

          // Keydown
          } else if (type == 'keydown' && key == 32) {
            if (!(node[_type] == _radio && node[_checked])) {
              if (node[_checked]) {
                off(self, _checked);
              } else {
                on(self, _checked);
              }
            }

            return false;

          // Keyup
          } else if (type == 'keyup' && node[_type] == _radio) {
            !node[_checked] && on(self, _checked);

          // Focus/blur
          } else if (/us|ur/.test(type)) {
            parent[type == 'blur' ? _remove : _add](focusClass);
          }
        });

        // Helper events
        helper.on(_click + ' mousedown mouseup mouseover mouseout ' + _touch, function(event) {
          var type = event[_type],

            // mousedown|mouseup
            toggle = /wn|up/.test(type) ? activeClass : hoverClass;

          // Do nothing if input is disabled
          if (!node[_disabled]) {

            // Click
            if (type == _click) {
              operate(self, false, true);

            // Active and hover states
            } else {

              // State is on
              if (/wn|er|in/.test(type)) {

                // mousedown|mouseover|touchbegin
                parent[_add](toggle);

              // State is off
              } else {
                parent[_remove](toggle + ' ' + activeClass);
              }

              // Label hover
              if (label.length && labelHover && toggle == hoverClass) {

                // mouseout|touchend
                label[/ut|nd/.test(type) ? _remove : _add](labelHoverClass);
              }
            }

            if (_mobile) {
              event.stopPropagation();
            } else {
              return false;
            }
          }
        });
      });
    } else {
      return this;
    }
  };

  // Do something with inputs
  function operate(input, direct, method) {
    var node = input[0],
      state = /er/.test(method) ? _indeterminate : /bl/.test(method) ? _disabled : _checked,
      active = method == _update ? {
        checked: node[_checked],
        disabled: node[_disabled],
        indeterminate: input.attr(_indeterminate) == 'true' || input.attr(_determinate) == 'false'
      } : node[state];

    // Check, disable or indeterminate
    if (/^(ch|di|in)/.test(method) && !active) {
      on(input, state);

    // Uncheck, enable or determinate
    } else if (/^(un|en|de)/.test(method) && active) {
      off(input, state);

    // Update
    } else if (method == _update) {

      // Handle states
      for (var each in active) {
        if (active[each]) {
          on(input, each, true);
        } else {
          off(input, each, true);
        }
      }

    } else if (!direct || method == 'toggle') {

      // Helper or label was clicked
      if (!direct) {
        input[_callback]('ifClicked');
      }

      // Toggle checked state
      if (active) {
        if (node[_type] !== _radio) {
          off(input, state);
        }
      } else {
        on(input, state);
      }
    }
  }

  // Add checked, disabled or indeterminate state
  function on(input, state, keep) {
    var node = input[0],
      parent = input.parent(),
      checked = state == _checked,
      indeterminate = state == _indeterminate,
      disabled = state == _disabled,
      callback = indeterminate ? _determinate : checked ? _unchecked : 'enabled',
      regular = option(input, callback + capitalize(node[_type])),
      specific = option(input, state + capitalize(node[_type]));

    // Prevent unnecessary actions
    if (node[state] !== true) {

      // Toggle assigned radio buttons
      if (!keep && state == _checked && node[_type] == _radio && node.name) {
        var form = input.closest('form'),
          inputs = 'input[name="' + node.name + '"]';

        inputs = form.length ? form.find(inputs) : $(inputs);

        inputs.each(function() {
          if (this !== node && $(this).data(_iCheck)) {
            off($(this), state);
          }
        });
      }

      // Indeterminate state
      if (indeterminate) {

        // Add indeterminate state
        node[state] = true;

        // Remove checked state
        if (node[_checked]) {
          off(input, _checked, 'force');
        }

      // Checked or disabled state
      } else {

        // Add checked or disabled state
        if (!keep) {
          node[state] = true;
        }

        // Remove indeterminate state
        if (checked && node[_indeterminate]) {
          off(input, _indeterminate, false);
        }
      }

      // Trigger callbacks
      callbacks(input, checked, state, keep);
    }

    // Add proper cursor
    if (node[_disabled] && !!option(input, _cursor, true)) {
      parent.find('.' + _iCheckHelper).css(_cursor, 'default');
    }

    // Add state class
    parent[_add](specific || option(input, state) || '');

    // Set ARIA attribute
    if (!!parent.attr('role') && !indeterminate) {
      parent.attr('aria-' + (disabled ? _disabled : _checked), 'true');
    }

    // Remove regular state class
    parent[_remove](regular || option(input, callback) || '');
  }

  // Remove checked, disabled or indeterminate state
  function off(input, state, keep) {
    var node = input[0],
      parent = input.parent(),
      checked = state == _checked,
      indeterminate = state == _indeterminate,
      disabled = state == _disabled,
      callback = indeterminate ? _determinate : checked ? _unchecked : 'enabled',
      regular = option(input, callback + capitalize(node[_type])),
      specific = option(input, state + capitalize(node[_type]));

    // Prevent unnecessary actions
    if (node[state] !== false) {

      // Toggle state
      if (indeterminate || !keep || keep == 'force') {
        node[state] = false;
      }

      // Trigger callbacks
      callbacks(input, checked, callback, keep);
    }

    // Add proper cursor
    if (!node[_disabled] && !!option(input, _cursor, true)) {
      parent.find('.' + _iCheckHelper).css(_cursor, 'pointer');
    }

    // Remove state class
    parent[_remove](specific || option(input, state) || '');

    // Set ARIA attribute
    if (!!parent.attr('role') && !indeterminate) {
      parent.attr('aria-' + (disabled ? _disabled : _checked), 'false');
    }

    // Add regular state class
    parent[_add](regular || option(input, callback) || '');
  }

  // Remove all traces
  function tidy(input, callback) {
    if (input.data(_iCheck)) {

      // Remove everything except input
      input.parent().html(input.attr('style', input.data(_iCheck).s || ''));

      // Callback
      if (callback) {
        input[_callback](callback);
      }

      // Unbind events
      input.off('.i').unwrap();
      $(_label + '[for="' + input[0].id + '"]').add(input.closest(_label)).off('.i');
    }
  }

  // Get some option
  function option(input, state, regular) {
    if (input.data(_iCheck)) {
      return input.data(_iCheck).o[state + (regular ? '' : 'Class')];
    }
  }

  // Capitalize some string
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Executable handlers
  function callbacks(input, checked, callback, keep) {
    if (!keep) {
      if (checked) {
        input[_callback]('ifToggled');
      }

      input[_callback]('ifChanged')[_callback]('if' + capitalize(callback));
    }
  }
})(window.jQuery || window.Zepto);

;(function( $ ){

	var createdElements = [];

	var defaults = {
		options: {
			prependExistingHelpBlock: false,
			sniffHtml: true, // sniff for 'required', 'maxlength', etc
			preventSubmit: true, // stop the form submit event from firing if validation fails
			submitError: false, // function called if there is an error when trying to submit
			submitSuccess: false, // function called just before a successful submit event is sent to the server
            semanticallyStrict: false, // set to true to tidy up generated HTML output
            bindEvents: [],
			autoAdd: {
				helpBlocks: true
			},
      filter: function () {
        // return $(this).is(":visible"); // only validate elements you can see
        return true; // validate everything
      }
		},
    methods: {
      init : function( options ) {

        // Get a clean copy of the defaults for extending
        var settings = $.extend(true, {}, defaults);
        // Set up the options based on the input
        settings.options = $.extend(true, settings.options, options);

        var $siblingElements = this;

        var uniqueForms = $.unique(
          $siblingElements.map( function () {
            return $(this).parents("form")[0];
          }).toArray()
        );

        $(uniqueForms).bind("submit.validationSubmit", function (e) {
          var $form = $(this);
          var warningsFound = 0;
          // Get all inputs
          var $allInputs = $form.find("input,textarea,select").not("[type=submit],[type=image]").filter(settings.options.filter);
          var $allControlGroups = $form.find(".control-group");
          
          // Only trigger validation on the ones that actually _have_ validation
          var $inputsWithValidators = $allInputs.filter(function () {
            return $(this).triggerHandler("getValidatorCount.validation") > 0;
          });
          $inputsWithValidators.trigger("submit.validation");
          
          // But all of them are out-of-focus now, because we're submitting.
          $allInputs.trigger("validationLostFocus.validation");

          // Okay, now check each controlgroup for errors (or warnings)
          $allControlGroups.each(function (i, el) {
            var $controlGroup = $(el);
            if ($controlGroup.hasClass("warning") || $controlGroup.hasClass("error")) {
              $controlGroup.removeClass("warning").addClass("error");
              warningsFound++;
            }
          });

          if (warningsFound) {
            // If we found any warnings, maybe we should prevent the submit
            // event, and trigger 'submitError' (if they're set up)
            if (settings.options.preventSubmit) {
              e.preventDefault();
              e.stopImmediatePropagation();
            }
            $form.addClass("error");
            if ($.isFunction(settings.options.submitError)) {
              settings.options.submitError($form, e, $inputsWithValidators.jqBootstrapValidation("collectErrors", true));
            }
          } else {
            // Woo! No errors! We can pass the submit event to submitSuccess
            // (if it has been set up)
            $form.removeClass("error");
            if ($.isFunction(settings.options.submitSuccess)) {
              settings.options.submitSuccess($form, e);
            }
          }
        });

        return this.each(function(){

          // Get references to everything we're interested in
          var $this = $(this),
            $controlGroup = $this.parents(".control-group").first(),
            $helpBlock = $controlGroup.find(".help-block").first(),
            $form = $this.parents("form").first(),
            validatorNames = [];

          // create message container if not exists
          if (!$helpBlock.length && settings.options.autoAdd && settings.options.autoAdd.helpBlocks) {
              $helpBlock = $('<div class="help-block" />');
              $controlGroup.find('.controls').append($helpBlock);
							createdElements.push($helpBlock[0]);
          }

          // =============================================================
          //                                     SNIFF HTML FOR VALIDATORS
          // =============================================================

          // *snort sniff snuffle*

          if (settings.options.sniffHtml) {
            var message;
            // ---------------------------------------------------------
            //                                                   PATTERN
            // ---------------------------------------------------------
            if ($this.data("validationPatternPattern")) {
              $this.attr("pattern", $this.data("validationPatternPattern"));
            }
            if ($this.attr("pattern") !== undefined) {
              message = "Not in the expected format<!-- data-validation-pattern-message to override -->";
              if ($this.data("validationPatternMessage")) {
                message = $this.data("validationPatternMessage");
              }
              $this.data("validationPatternMessage", message);
              $this.data("validationPatternRegex", $this.attr("pattern"));
            }
            // ---------------------------------------------------------
            //                                                       MAX
            // ---------------------------------------------------------
            if ($this.attr("max") !== undefined || $this.attr("aria-valuemax") !== undefined) {
              var max = ($this.attr("max") !== undefined ? $this.attr("max") : $this.attr("aria-valuemax"));
              message = "Too high: Maximum of '" + max + "'<!-- data-validation-max-message to override -->";
              if ($this.data("validationMaxMessage")) {
                message = $this.data("validationMaxMessage");
              }
              $this.data("validationMaxMessage", message);
              $this.data("validationMaxMax", max);
            }
            // ---------------------------------------------------------
            //                                                       MIN
            // ---------------------------------------------------------
            if ($this.attr("min") !== undefined || $this.attr("aria-valuemin") !== undefined) {
              var min = ($this.attr("min") !== undefined ? $this.attr("min") : $this.attr("aria-valuemin"));
              message = "Too low: Minimum of '" + min + "'<!-- data-validation-min-message to override -->";
              if ($this.data("validationMinMessage")) {
                message = $this.data("validationMinMessage");
              }
              $this.data("validationMinMessage", message);
              $this.data("validationMinMin", min);
            }
            // ---------------------------------------------------------
            //                                                 MAXLENGTH
            // ---------------------------------------------------------
            if ($this.attr("maxlength") !== undefined) {
              message = "Too long: Maximum of '" + $this.attr("maxlength") + "' characters<!-- data-validation-maxlength-message to override -->";
              if ($this.data("validationMaxlengthMessage")) {
                message = $this.data("validationMaxlengthMessage");
              }
              $this.data("validationMaxlengthMessage", message);
              $this.data("validationMaxlengthMaxlength", $this.attr("maxlength"));
            }
            // ---------------------------------------------------------
            //                                                 MINLENGTH
            // ---------------------------------------------------------
            if ($this.attr("minlength") !== undefined) {
              message = "Too short: Minimum of '" + $this.attr("minlength") + "' characters<!-- data-validation-minlength-message to override -->";
              if ($this.data("validationMinlengthMessage")) {
                message = $this.data("validationMinlengthMessage");
              }
              $this.data("validationMinlengthMessage", message);
              $this.data("validationMinlengthMinlength", $this.attr("minlength"));
            }
            // ---------------------------------------------------------
            //                                                  REQUIRED
            // ---------------------------------------------------------
            if ($this.attr("required") !== undefined || $this.attr("aria-required") !== undefined) {
              message = settings.builtInValidators.required.message;
              if ($this.data("validationRequiredMessage")) {
                message = $this.data("validationRequiredMessage");
              }
              $this.data("validationRequiredMessage", message);
            }
            // ---------------------------------------------------------
            //                                                    NUMBER
            // ---------------------------------------------------------
            if ($this.attr("type") !== undefined && $this.attr("type").toLowerCase() === "number") {
              message = settings.validatorTypes.number.message; // TODO: fix this
              if ($this.data("validationNumberMessage")) {
                message = $this.data("validationNumberMessage");
              }
              $this.data("validationNumberMessage", message);
              
              var step = settings.validatorTypes.number.step; // TODO: and this
              if ($this.data("validationNumberStep")) {
                  step = $this.data("validationNumberStep");
              }
              $this.data("validationNumberStep", step);
              
              var decimal = settings.validatorTypes.number.decimal;
              if ($this.data("validationNumberDecimal")) {
                  decimal = $this.data("validationNumberDecimal");
              }
              $this.data("validationNumberDecimal", decimal);
            }
            // ---------------------------------------------------------
            //                                                     EMAIL
            // ---------------------------------------------------------
            if ($this.attr("type") !== undefined && $this.attr("type").toLowerCase() === "email") {
              message = "Not a valid email address<!-- data-validation-email-message to override -->";
              if ($this.data("validationEmailMessage")) {
                message = $this.data("validationEmailMessage");
              }
              $this.data("validationEmailMessage", message);
            }
            // ---------------------------------------------------------
            //                                                MINCHECKED
            // ---------------------------------------------------------
            if ($this.attr("minchecked") !== undefined) {
              message = "Not enough options checked; Minimum of '" + $this.attr("minchecked") + "' required<!-- data-validation-minchecked-message to override -->";
              if ($this.data("validationMincheckedMessage")) {
                message = $this.data("validationMincheckedMessage");
              }
              $this.data("validationMincheckedMessage", message);
              $this.data("validationMincheckedMinchecked", $this.attr("minchecked"));
            }
            // ---------------------------------------------------------
            //                                                MAXCHECKED
            // ---------------------------------------------------------
            if ($this.attr("maxchecked") !== undefined) {
              message = "Too many options checked; Maximum of '" + $this.attr("maxchecked") + "' required<!-- data-validation-maxchecked-message to override -->";
              if ($this.data("validationMaxcheckedMessage")) {
                message = $this.data("validationMaxcheckedMessage");
              }
              $this.data("validationMaxcheckedMessage", message);
              $this.data("validationMaxcheckedMaxchecked", $this.attr("maxchecked"));
            }
          }

          // =============================================================
          //                                       COLLECT VALIDATOR NAMES
          // =============================================================

          // Get named validators
          if ($this.data("validation") !== undefined) {
            validatorNames = $this.data("validation").split(",");
          }

          // Get extra ones defined on the element's data attributes
          $.each($this.data(), function (i, el) {
            var parts = i.replace(/([A-Z])/g, ",$1").split(",");
            if (parts[0] === "validation" && parts[1]) {
              validatorNames.push(parts[1]);
            }
          });

          // =============================================================
          //                                     NORMALISE VALIDATOR NAMES
          // =============================================================

          var validatorNamesToInspect = validatorNames;
          var newValidatorNamesToInspect = [];
          
          var uppercaseEachValidatorName = function (i, el) {
            validatorNames[i] = formatValidatorName(el);
          };
      
          var inspectValidators = function(i, el) {
            if ($this.data("validation" + el + "Shortcut") !== undefined) {
              // Are these custom validators?
              // Pull them out!
              $.each($this.data("validation" + el + "Shortcut").split(","), function(i2, el2) {
                newValidatorNamesToInspect.push(el2);
              });
            } else if (settings.builtInValidators[el.toLowerCase()]) {
              // Is this a recognised built-in?
              // Pull it out!
              var validator = settings.builtInValidators[el.toLowerCase()];
              if (validator.type.toLowerCase() === "shortcut") {
                $.each(validator.shortcut.split(","), function (i, el) {
                  el = formatValidatorName(el);
                  newValidatorNamesToInspect.push(el);
                  validatorNames.push(el);
                });
              }
            }
          };

          do // repeatedly expand 'shortcut' validators into their real validators
          {
            // Uppercase only the first letter of each name
            $.each(validatorNames, uppercaseEachValidatorName);

            // Remove duplicate validator names
            validatorNames = $.unique(validatorNames);

            // Pull out the new validator names from each shortcut
            newValidatorNamesToInspect = [];
            $.each(validatorNamesToInspect, inspectValidators);

            validatorNamesToInspect = newValidatorNamesToInspect;

          } while (validatorNamesToInspect.length > 0);

          // =============================================================
          //                                       SET UP VALIDATOR ARRAYS
          // =============================================================
          
          /* We're gonna generate something like 
           * 
           * {
           *   "regex": [
           *     { -- a validator object here --},
           *     { -- a validator object here --}
           *   ],
           *   "required": [
           *     { -- a validator object here --},
           *     { -- a validator object here --}
           *   ]
           * }
           * 
           * with a few more entries.
           * 
           * Because we only add a few validators to each field, most of the 
           * keys will be empty arrays with no validator objects in them, and 
           * thats fine.
           */

          var validators = {};

          $.each(validatorNames, function (i, el) {
            // Set up the 'override' message
            var message = $this.data("validation" + el + "Message");
            var hasOverrideMessage = !!message;
            var foundValidator = false;
            if (!message) {
              message = "'" + el + "' validation failed <!-- Add attribute 'data-validation-" + el.toLowerCase() + "-message' to input to change this message -->";
            }

            $.each(
              settings.validatorTypes,
              function (validatorType, validatorTemplate) {
                if (validators[validatorType] === undefined) {
                  validators[validatorType] = [];
                }
                if (!foundValidator && $this.data("validation" + el + formatValidatorName(validatorTemplate.name)) !== undefined) {
                  var initted = validatorTemplate.init($this, el);
                  if (hasOverrideMessage) {
                    initted.message = message;
                  }
                  
                  validators[validatorType].push(
                    $.extend(
                      true,
                      {
                        name: formatValidatorName(validatorTemplate.name),
                        message: message
                      },
                      initted
                    )
                  );
                  foundValidator = true;
                }
              }
            );

            if (!foundValidator && settings.builtInValidators[el.toLowerCase()]) {

              var validator = $.extend(true, {}, settings.builtInValidators[el.toLowerCase()]);
              if (hasOverrideMessage) {
                validator.message = message;
              }
              var validatorType = validator.type.toLowerCase();

              if (validatorType === "shortcut") {
                foundValidator = true;
              } else {
                $.each(
                  settings.validatorTypes,
                  function (validatorTemplateType, validatorTemplate) {
                    if (validators[validatorTemplateType] === undefined) {
                      validators[validatorTemplateType] = [];
                    }
                    if (!foundValidator && validatorType === validatorTemplateType.toLowerCase()) {
                      $this.data(
                        "validation" + el + formatValidatorName(validatorTemplate.name),
                        validator[validatorTemplate.name.toLowerCase()]
                      );
                      validators[validatorType].push(
                        $.extend(
                          validator,
                          validatorTemplate.init($this, el)
                        )
                      );
                      foundValidator = true;
                    }
                  }
                );
              }
            }

            if (! foundValidator) {
              $.error("Cannot find validation info for '" + el + "'");
            }
          });

          // =============================================================
          //                                         STORE FALLBACK VALUES
          // =============================================================

          $helpBlock.data(
            "original-contents",
            (
              $helpBlock.data("original-contents") ?
                $helpBlock.data("original-contents") : 
                $helpBlock.html()
            )
          );

          $helpBlock.data(
            "original-role",
            (
              $helpBlock.data("original-role") ?
                $helpBlock.data("original-role") :
                $helpBlock.attr("role")
            )
          );

          $controlGroup.data(
            "original-classes",
            (
              $controlGroup.data("original-clases") ?
                $controlGroup.data("original-classes") :
                $controlGroup.attr("class")
            )
          );

          $this.data(
            "original-aria-invalid",
            (
              $this.data("original-aria-invalid") ?
                $this.data("original-aria-invalid") :
                $this.attr("aria-invalid")
            )
          );

          // =============================================================
          //                                                    VALIDATION
          // =============================================================

          $this.bind(
            "validation.validation",
            function (event, params) {

              var value = getValue($this);

              // Get a list of the errors to apply
              var errorsFound = [];

              $.each(validators, function (validatorType, validatorTypeArray) {
                if (
                    value || // has a truthy value
                    value.length || // not an empty string
                    ( // am including empty values
                      (
                        params && 
                        params.includeEmpty 
                      ) ||
                      !!settings.validatorTypes[validatorType].includeEmpty
                    ) ||
                    ( // validator is blocking submit
                      !!settings.validatorTypes[validatorType].blockSubmit &&
                      params &&
                      !!params.submitting
                    )
                  )
                {
                  $.each(
                    validatorTypeArray,
                    function (i, validator) {
                      if (settings.validatorTypes[validatorType].validate($this, value, validator)) {
                        errorsFound.push(validator.message);
                      }
                    }
                  );
                }
              });

              return errorsFound;
            }
          );

          $this.bind(
            "getValidators.validation",
            function () {
              return validators;
            }
          );
            
          var numValidators = 0;
          
          $.each(validators, function (i, el) {
            numValidators += el.length;
          });
          
          $this.bind("getValidatorCount.validation", function () {
            return numValidators;
          });

          // =============================================================
          //                                             WATCH FOR CHANGES
          // =============================================================
          $this.bind(
            "submit.validation",
            function () {
              return $this.triggerHandler("change.validation", {submitting: true});
            }
          );
          $this.bind(
            (
                settings.options.bindEvents.length > 0 ?
                settings.options.bindEvents :
                [
                    "keyup",
                    "focus",
                    "blur",
                    "click",
                    "keydown",
                    "keypress",
                    "change"
                ]
            ).concat(["revalidate"]).join(".validation ") + ".validation",
            function (e, params) {

              var value = getValue($this);

              var errorsFound = [];
              
              if (params && !!params.submitting) {
                $controlGroup.data("jqbvIsSubmitting", true);
              } else if (e.type !== "revalidate") {
                $controlGroup.data("jqbvIsSubmitting", false);
              }
              
              var formIsSubmitting = !!$controlGroup.data("jqbvIsSubmitting");

              $controlGroup.find("input,textarea,select").each(function (i, el) {
                var oldCount = errorsFound.length;
                $.each($(el).triggerHandler("validation.validation", params), function (j, message) {
                  errorsFound.push(message);
                });
                if (errorsFound.length > oldCount) {
                  $(el).attr("aria-invalid", "true");
                } else {
                  var original = $this.data("original-aria-invalid");
                  $(el).attr("aria-invalid", (original !== undefined ? original : false));
                }
              });

              $form.find("input,select,textarea").not($this).not("[name=\"" + $this.attr("name") + "\"]").trigger("validationLostFocus.validation");

              errorsFound = $.unique(errorsFound.sort());

              // Were there any errors?
              if (errorsFound.length) {
                // Better flag it up as a warning.
                $controlGroup.removeClass("success error warning").addClass(formIsSubmitting ? "error" : "warning");

                // How many errors did we find?
                if (settings.options.semanticallyStrict && errorsFound.length === 1) {
                  // Only one? Being strict? Just output it.
                  $helpBlock.html(errorsFound[0] + 
                    ( settings.options.prependExistingHelpBlock ? $helpBlock.data("original-contents") : "" ));
                } else {
                  // Multiple? Being sloppy? Glue them together into an UL.
                  $helpBlock.html("<ul role=\"alert\"><li>" + errorsFound.join("</li><li>") + "</li></ul>" +
                    ( settings.options.prependExistingHelpBlock ? $helpBlock.data("original-contents") : "" ));
                }
              } else {
                $controlGroup.removeClass("warning error success");
                if (value.length > 0) {
                  $controlGroup.addClass("success");
                }
                $helpBlock.html($helpBlock.data("original-contents"));
              }

              if (e.type === "blur") {
                $controlGroup.removeClass("success");
              }
            }
          );
          $this.bind("validationLostFocus.validation", function () {
            $controlGroup.removeClass("success");
          });
        });
      },
      destroy : function( ) {

        return this.each(
          function() {

            var
              $this = $(this),
              $controlGroup = $this.parents(".control-group").first(),
              $helpBlock = $controlGroup.find(".help-block").first(),
              $form = $this.parents("form").first();

            // remove our events
            $this.unbind('.validation'); // events are namespaced.
            $form.unbind(".validationSubmit");
            // reset help text
            $helpBlock.html($helpBlock.data("original-contents"));
            // reset classes
            $controlGroup.attr("class", $controlGroup.data("original-classes"));
            // reset aria
            $this.attr("aria-invalid", $this.data("original-aria-invalid"));
            // reset role
            $helpBlock.attr("role", $this.data("original-role"));
            // remove all elements we created
            if ($.inArray($helpBlock[0], createdElements) > -1) {
                $helpBlock.remove();
            }

          }
        );

      },
      collectErrors : function(includeEmpty) {

        var errorMessages = {};
        this.each(function (i, el) {
          var $el = $(el);
          var name = $el.attr("name");
          var errors = $el.triggerHandler("validation.validation", {includeEmpty: true});
          errorMessages[name] = $.extend(true, errors, errorMessages[name]);
        });

        $.each(errorMessages, function (i, el) {
          if (el.length === 0) {
            delete errorMessages[i];
          }
        });

        return errorMessages;

      },
      hasErrors: function() {

        var errorMessages = [];

        this.find('input,select,textarea').add(this).each(function (i, el) {
          errorMessages = errorMessages.concat(
            $(el).triggerHandler("getValidators.validation") ? $(el).triggerHandler("validation.validation", {submitting: true}) : []
          );
        });

        return (errorMessages.length > 0);
      },
      override : function (newDefaults) {
        defaults = $.extend(true, defaults, newDefaults);
      }
    },
		validatorTypes: {
      callback: {
                name: "callback",
                init: function($this, name) {
                    var result = {
                        validatorName: name,
                        callback: $this.data("validation" + name + "Callback"),
                        lastValue: $this.val(),
                        lastValid: true,
                        lastFinished: true
                    };

                    var message = "Not valid";
                    if ($this.data("validation" + name + "Message")) {
                        message = $this.data("validation" + name + "Message");
                    }
                    result.message = message;

                    return result;
                },
                validate: function($this, value, validator) {
                    if (validator.lastValue === value && validator.lastFinished) {
                        return !validator.lastValid;
                    }

                    if (validator.lastFinished === true)
                    {
                        validator.lastValue = value;
                        validator.lastValid = true;
                        validator.lastFinished = false;

                        var rrjqbvValidator = validator;
                        var rrjqbvThis = $this;
                        executeFunctionByName(
                            validator.callback,
                            window,
                            $this,
                            value,
                            function(data) {
                                if (rrjqbvValidator.lastValue === data.value) {
                                    rrjqbvValidator.lastValid = data.valid;
                                    if (data.message) {
                                        rrjqbvValidator.message = data.message;
                                    }
                                    rrjqbvValidator.lastFinished = true;
                                    rrjqbvThis.data(
                                        "validation" + rrjqbvValidator.validatorName + "Message", 
                                        rrjqbvValidator.message
                                    );
                                    
                                    // Timeout is set to avoid problems with the events being considered 'already fired'
                                    setTimeout(function() {
                                        if (!$this.is(":focus") && $this.parents("form").first().data("jqbvIsSubmitting")) {
                                            rrjqbvThis.trigger("blur.validation");
                                        } else {
                                            rrjqbvThis.trigger("revalidate.validation");
                                        }
                                    }, 1); // doesn't need a long timeout, just long enough for the event bubble to burst
                                }
                            }
                        );
                    }

                    return false;

                }
      },
      ajax: {
        name: "ajax",
        init: function ($this, name) {
          return {
            validatorName: name,
            url: $this.data("validation" + name + "Ajax"),
            lastValue: $this.val(),
            lastValid: true,
            lastFinished: true
          };
        },
        validate: function ($this, value, validator) {
          if (""+validator.lastValue === ""+value && validator.lastFinished === true) {
            return validator.lastValid === false;
          }

          if (validator.lastFinished === true)
          {
            validator.lastValue = value;
            validator.lastValid = true;
            validator.lastFinished = false;
            $.ajax({
              url: validator.url,
              data: "value=" + encodeURIComponent(value) + "&field=" + $this.attr("name"),
              dataType: "json",
              success: function (data) {
                if (""+validator.lastValue === ""+data.value) {
                  validator.lastValid = !!(data.valid);
                  if (data.message) {
                    validator.message = data.message;
                  }
                  validator.lastFinished = true;
                  $this.data("validation" + validator.validatorName + "Message", validator.message);
                  // Timeout is set to avoid problems with the events being considered 'already fired'
                  setTimeout(function () {
                    $this.trigger("revalidate.validation");
                  }, 1); // doesn't need a long timeout, just long enough for the event bubble to burst
                }
              },
              failure: function () {
                validator.lastValid = true;
                validator.message = "ajax call failed";
                validator.lastFinished = true;
                $this.data("validation" + validator.validatorName + "Message", validator.message);
                // Timeout is set to avoid problems with the events being considered 'already fired'
                setTimeout(function () {
                  $this.trigger("revalidate.validation");
                }, 1); // doesn't need a long timeout, just long enough for the event bubble to burst
              }
            });
          }

          return false;

        }
      },
			regex: {
				name: "regex",
				init: function ($this, name) {
          var result = {};
          var regexString = $this.data("validation" + name + "Regex");
          result.regex = regexFromString(regexString);
          if (regexString === undefined) {
            $.error("Can't find regex for '" + name + "' validator on '" + $this.attr("name") + "'");
          }
          
          var message = "Not in the expected format";
          if ($this.data("validation" + name + "Message")) {
            message = $this.data("validation" + name + "Message");
          }
        
          result.message = message;
        
          result.originalName = name;
					return result;
				},
				validate: function ($this, value, validator) {
					return (!validator.regex.test(value) && ! validator.negative) || 
						(validator.regex.test(value) && validator.negative);
				}
			},
			email: {
				name: "email",
				init: function ($this, name) {
          var result = {};
          result.regex = regexFromString('[a-zA-Z0-9.!#$%&\u2019*+/=?^_`{|}~-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}');
          
          var message = "Not a valid email address";
          if ($this.data("validation" + name + "Message")) {
            message = $this.data("validation" + name + "Message");
          }
        
          result.message = message;
        
          result.originalName = name;
					return result;
				},
				validate: function ($this, value, validator) {
					return (!validator.regex.test(value) && ! validator.negative) || 
						(validator.regex.test(value) && validator.negative);
				}
			},
			required: {
				name: "required",
				init: function ($this, name) {
          var message = "This is required";
          if ($this.data("validation" + name + "Message")) {
            message = $this.data("validation" + name + "Message");
          }
          
					return {message: message, includeEmpty: true};
				},
				validate: function ($this, value, validator) {
					return !!(
            (value.length === 0  && !validator.negative) ||
						(value.length > 0 && validator.negative)
          );
				},
        blockSubmit: true
			},
			match: {
				name: "match",
				init: function ($this, name) {
          var elementName = $this.data("validation" + name + "Match");
          var $form = $this.parents("form").first();
					var $element = $form.find("[name=\"" + elementName + "\"]").first();
					$element.bind("validation.validation", function () {
						$this.trigger("revalidate.validation", {submitting: true});
					});
          var result = {};
          result.element = $element;
          
          if ($element.length === 0) {
            $.error("Can't find field '" + elementName + "' to match '" + $this.attr("name") + "' against in '" + name + "' validator");
          }
        
          var message = "Must match";
          var $label = null;
          if (($label = $form.find("label[for=\"" + elementName + "\"]")).length) {
            message += " '" + $label.text() + "'";
          } else if (($label = $element.parents(".control-group").first().find("label")).length) {
            message += " '" + $label.first().text() + "'";
          }
        
          if ($this.data("validation" + name + "Message")) {
            message = $this.data("validation" + name + "Message");
          }
        
          result.message = message;
        
					return result;
				},
				validate: function ($this, value, validator) {
					return (value !== validator.element.val() && ! validator.negative) || 
						(value === validator.element.val() && validator.negative);
				},
        blockSubmit: true,
        includeEmpty: true
			},
			max: {
				name: "max",
				init: function ($this, name) {
          var result = {};
          
          result.max = $this.data("validation" + name + "Max");
          
          result.message = "Too high: Maximum of '" + result.max + "'";
          if ($this.data("validation" + name + "Message")) {
            result.message = $this.data("validation" + name + "Message");
          }
          
					return result;
				},
				validate: function ($this, value, validator) {
					return (parseFloat(value, 10) > parseFloat(validator.max, 10) && ! validator.negative) ||
						(parseFloat(value, 10) <= parseFloat(validator.max, 10) && validator.negative);
				}
			},
			min: {
				name: "min",
				init: function ($this, name) {
					var result = {};
          
          result.min = $this.data("validation" + name + "Min");
          
          result.message = "Too low: Minimum of '" + result.min + "'";
          if ($this.data("validation" + name + "Message")) {
            result.message = $this.data("validation" + name + "Message");
          }
          
					return result;
				},
				validate: function ($this, value, validator) {
					return (parseFloat(value) < parseFloat(validator.min) && ! validator.negative) ||
						(parseFloat(value) >= parseFloat(validator.min) && validator.negative);
				}
			},
			maxlength: {
				name: "maxlength",
				init: function ($this, name) {
          var result = {};
          
          result.maxlength = $this.data("validation" + name + "Maxlength");
          
          result.message = "Too long: Maximum of '" + result.maxlength + "' characters";
          if ($this.data("validation" + name + "Message")) {
            result.message = $this.data("validation" + name + "Message");
          }
          
					return result;
				},
				validate: function ($this, value, validator) {
					return ((value.length > validator.maxlength) && ! validator.negative) ||
						((value.length <= validator.maxlength) && validator.negative);
				}
			},
			minlength: {
				name: "minlength",
				init: function ($this, name) {
					var result = {};
          
          result.minlength = $this.data("validation" + name + "Minlength");
          
          result.message = "Too short: Minimum of '" + result.minlength + "' characters";
          if ($this.data("validation" + name + "Message")) {
            result.message = $this.data("validation" + name + "Message");
          }
          
					return result;
				},
				validate: function ($this, value, validator) {
					return ((value.length < validator.minlength) && ! validator.negative) ||
						((value.length >= validator.minlength) && validator.negative);
				}
			},
			maxchecked: {
				name: "maxchecked",
				init: function ($this, name) {
          var result = {};
          
					var elements = $this.parents("form").first().find("[name=\"" + $this.attr("name") + "\"]");
					elements.bind("change.validation click.validation", function () {
						$this.trigger("revalidate.validation", {includeEmpty: true});
					});
          
          result.elements = elements;
          result.maxchecked = $this.data("validation" + name + "Maxchecked");
          
          var message = "Too many: Max '" + result.maxchecked + "' checked";
          if ($this.data("validation" + name + "Message")) {
            message = $this.data("validation" + name + "Message");
          }
          result.message = message;
          
					return result;
				},
				validate: function ($this, value, validator) {
					return (validator.elements.filter(":checked").length > validator.maxchecked && ! validator.negative) ||
						(validator.elements.filter(":checked").length <= validator.maxchecked && validator.negative);
				},
        blockSubmit: true
			},
			minchecked: {
				name: "minchecked",
				init: function ($this, name) {
          var result = {};
          
					var elements = $this.parents("form").first().find("[name=\"" + $this.attr("name") + "\"]");
					elements.bind("change.validation click.validation", function () {
						$this.trigger("revalidate.validation", {includeEmpty: true});
					});
          
          result.elements = elements;
          result.minchecked = $this.data("validation" + name + "Minchecked");
          
          var message = "Too few: Min '" + result.minchecked + "' checked";
          if ($this.data("validation" + name + "Message")) {
            message = $this.data("validation" + name + "Message");
          }
          result.message = message;
          
					return result;
				},
				validate: function ($this, value, validator) {
					return (validator.elements.filter(":checked").length < validator.minchecked && ! validator.negative) ||
						(validator.elements.filter(":checked").length >= validator.minchecked && validator.negative);
				},
        blockSubmit: true,
        includeEmpty: true
			},
      number: {
        name: "number",
        init: function ($this, name) {
          var result = {};
          result.step = 1;
          if ($this.attr("step")) {
            result.step = $this.attr("step");
          }
          if ($this.data("validation" + name + "Step")) {
            result.step = $this.data("validation" + name + "Step");
          }
        
          result.decimal = ".";
          if ($this.data("validation" + name + "Decimal")) {
            result.decimal = $this.data("validation" + name + "Decimal");
          }
        
          result.thousands = "";
          if ($this.data("validation" + name + "Thousands")) {
            result.thousands = $this.data("validation" + name + "Thousands");
          }
        
          result.regex = regexFromString("([+-]?\\d+(\\" + result.decimal + "\\d+)?)?");
          
          result.message = "Must be a number";
          var dataMessage = $this.data("validation" + name + "Message");
          if (dataMessage) {
            result.message = dataMessage;
          }
                  
          return result;
        },
        validate: function ($this, value, validator) {
          var globalValue = value.replace(validator.decimal, ".").replace(validator.thousands, "");
          var multipliedValue = parseFloat(globalValue);
          var multipliedStep = parseFloat(validator.step);
          while (multipliedStep % 1 !== 0) {
            /* thanks to @jkey #57 */
            multipliedStep = parseFloat(multipliedStep.toPrecision(12)) * 10;
            multipliedValue = parseFloat(multipliedValue.toPrecision(12)) * 10;
          }
          var regexResult = validator.regex.test(value);
          var stepResult = parseFloat(multipliedValue) % parseFloat(multipliedStep) === 0;
          var typeResult = !isNaN(parseFloat(globalValue)) && isFinite(globalValue);
          var result = !(regexResult && stepResult && typeResult);
          return result;
        },
        message: "Must be a number"
      }
		},
		builtInValidators: {
			email: {
				name: "Email",
				type: "email"
			},
			passwordagain: {
				name: "Passwordagain",
				type: "match",
				match: "password",
				message: "Does not match the given password<!-- data-validator-paswordagain-message to override -->"
			},
			positive: {
				name: "Positive",
				type: "shortcut",
				shortcut: "number,positivenumber"
			},
			negative: {
				name: "Negative",
				type: "shortcut",
				shortcut: "number,negativenumber"
			},
			integer: {
				name: "Integer",
				type: "regex",
				regex: "[+-]?\\d+",
				message: "No decimal places allowed<!-- data-validator-integer-message to override -->"
			},
			positivenumber: {
				name: "Positivenumber",
				type: "min",
				min: 0,
				message: "Must be a positive number<!-- data-validator-positivenumber-message to override -->"
			},
			negativenumber: {
				name: "Negativenumber",
				type: "max",
				max: 0,
				message: "Must be a negative number<!-- data-validator-negativenumber-message to override -->"
			},
			required: {
				name: "Required",
				type: "required",
				message: "This is required<!-- data-validator-required-message to override -->"
			},
			checkone: {
				name: "Checkone",
				type: "minchecked",
				minchecked: 1,
				message: "Check at least one option<!-- data-validation-checkone-message to override -->"
			},
      number: {
        name: "Number",
        type: "number",
        decimal: ".",
        step: "1"
			},
      pattern: {
        name: "Pattern",
        type: "regex",
        message: "Not in expected format"
      }
		}
	};

	var formatValidatorName = function (name) {
		return name
			.toLowerCase()
			.replace(
				/(^|\s)([a-z])/g ,
				function(m,p1,p2) {
					return p1+p2.toUpperCase();
				}
			)
		;
	};

	var getValue = function ($this) {
		// Extract the value we're talking about
    var value = null;
		var type = $this.attr("type");
		if (type === "checkbox") {
      value = ($this.is(":checked") ? value : "");
      var checkboxParent = $this.parents("form").first() || $this.parents(".control-group").first();
      if (checkboxParent) {
        value = checkboxParent.find("input[name='" + $this.attr("name") + "']:checked").map(function (i, el) { return $(el).val(); }).toArray().join(",");
      }
		}
		else if (type === "radio") {
			value = ($('input[name="' + $this.attr("name") + '"]:checked').length > 0 ? $this.val() : "");
      var radioParent = $this.parents("form").first() || $this.parents(".control-group").first();
      if (radioParent) {
        value = radioParent.find("input[name='" + $this.attr("name") + "']:checked").map(function (i, el) { return $(el).val(); }).toArray().join(",");
      }
		}
    else {
      value = $this.val();
    }
		return value;
	};

  function regexFromString(inputstring) {
		return new RegExp("^" + inputstring + "$");
	}

  /**
   * Thanks to Jason Bunting / Alex Nazarov via StackOverflow.com
   *
   * http://stackoverflow.com/a/4351575
  **/
function executeFunctionByName(functionName, context /*, args */) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
}

$.fn.jqBootstrapValidation = function( method ) {

	if ( defaults.methods[method] ) {
		return defaults.methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	} else if ( typeof method === 'object' || ! method ) {
		return defaults.methods.init.apply( this, arguments );
	} else {
	$.error( 'Method ' +  method + ' does not exist on jQuery.jqBootstrapValidation' );
		return null;
	}

};

  $.jqBootstrapValidation = function (options) {
    $(":input").not("[type=image],[type=submit]").jqBootstrapValidation.apply(this,arguments);
  };

})( jQuery );
;// Copyright 2013 Mauricio Santos. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//
// Some documentation is borrowed from the official Java API
// as it serves the same porpose.
/**
 * @namespace Top level namespace for Buckets, a JavaScript data structure library.
 */
var buckets = {};
(function() {
    'use strict';

    /**
     * Default function to compare element order.
     * @function
     * @private
     */
    buckets.defaultCompare = function(a, b) {
        if (a < b) {
            return -1;
        }
        if (a === b) {
            return 0;
        }
        return 1;
    };
    /**
     * Default function to test equality.
     * @function
     * @private
     */
    buckets.defaultEquals = function(a, b) {
        return a === b;
    };

    /**
     * Default function to convert an object to a string.
     * @function
     * @private
     */
    buckets.defaultToString = function(item) {
        if (item === null) {
            return 'BUCKETS_NULL';
        }
        if (buckets.isUndefined(item)) {
            return 'BUCKETS_UNDEFINED';
        }
        if (buckets.isString(item)) {
            return item;
        }
        return item.toString();
    };

    /**
     * Checks if the given argument is a function.
     * @function
     * @private
     */
    buckets.isFunction = function(func) {
        return (typeof func) === 'function';
    };

    /**
     * Checks if the given argument is undefined.
     * @function
     * @private
     */
    buckets.isUndefined = function(obj) {
        return (typeof obj === 'undefined');
    };

    /**
     * Checks if the given argument is a string.
     * @function
     * @private
     */
    buckets.isString = function(obj) {
        return Object.prototype.toString.call(obj) === '[object String]';
    };

    /**
     * Reverses a compare function.
     * @function
     * @private
     */
    buckets.reverseCompareFunction = function(compareFunction) {
        if (!buckets.isFunction(compareFunction)) {
            return function(a, b) {
                if (a < b) {
                    return 1;
                }
                if (a === b) {
                    return 0;
                }
                return -1;
            };
        }
        return function(d, v) {
            return compareFunction(d, v) * -1;
        };

    };

    /**
     * Returns an equal function given a compare function.
     * @function
     * @private
     */
    buckets.compareToEquals = function(compareFunction) {
        return function(a, b) {
            return compareFunction(a, b) === 0;
        };
    };

    /**
     * @namespace Contains various functions for manipulating arrays.
     */
    buckets.arrays = {};

    /**
     * Returns the index of the first occurrence of the specified item
     * within the specified array.
     * @param {*} array The array to search.
     * @param {Object} item The array in which to search the element.
     * @param {function(Object,Object):boolean=} equalsFunction Optional function to
     * check equality between two elements. Receives two arguments and returns true if they are equal.
     * @return {number} The index of the first occurrence of the specified element
     * or -1 if not found.
     */
    buckets.arrays.indexOf = function(array, item, equalsFunction) {
        var equals = equalsFunction || buckets.defaultEquals;
        var length = array.length;
        for (var i = 0; i < length; i++) {
            if (equals(array[i], item)) {
                return i;
            }
        }
        return -1;
    };

    /**
     * Returns the index of the last occurrence of the specified element
     * within the specified array.
     * @param {*} array The array in which to search the element.
     * @param {Object} item The element to search.
     * @param {function(Object,Object):boolean=} equalsFunction Optional function to
     * check equality between two elements. Receives two arguments and returns true if they are equal.
     * @return {number} The position of the last occurrence of the specified element
     * within the specified array or -1 if not found.
     */
    buckets.arrays.lastIndexOf = function(array, item, equalsFunction) {
        var equals = equalsFunction || buckets.defaultEquals;
        var length = array.length;
        for (var i = length - 1; i >= 0; i--) {
            if (equals(array[i], item)) {
                return i;
            }
        }
        return -1;
    };

    /**
     * Returns true if the array contains the specified element.
     * @param {*} array The array in which to search the element.
     * @param {Object} item The element to search.
     * @param {function(Object,Object):boolean=} equalsFunction Optional function to
     * check equality between two elements. Receives two arguments and returns true if they are equal.
     * @return {boolean} True if the specified array contains the specified element.
     */
    buckets.arrays.contains = function(array, item, equalsFunction) {
        return buckets.arrays.indexOf(array, item, equalsFunction) >= 0;
    };


    /**
     * Removes the first ocurrence of the specified element from the specified array.
     * @param {*} array The array in which to remove the element.
     * @param {Object} item The element to remove.
     * @param {function(Object,Object):boolean=} equalsFunction Optional function to
     * check equality between two elements. Receives two arguments and returns true if they are equal.
     * @return {boolean} True If the array changed after this call.
     */
    buckets.arrays.remove = function(array, item, equalsFunction) {
        var index = buckets.arrays.indexOf(array, item, equalsFunction);
        if (index < 0) {
            return false;
        }
        array.splice(index, 1);
        return true;
    };

    /**
     * Returns the number of elements in the array equal
     * to the specified item.
     * @param {Array} array The array in which to determine the frequency of the element.
     * @param {Object} item The element whose frequency is to be determined.
     * @param {function(Object,Object):boolean=} equalsFunction Optional function to
     * check equality between two elements. Receives two arguments and returns true if they are equal.
     * @return {number} The number of elements in the specified array.
     * equal to the specified object.
     */
    buckets.arrays.frequency = function(array, item, equalsFunction) {
        var equals = equalsFunction || buckets.defaultEquals;
        var length = array.length;
        var freq = 0;
        for (var i = 0; i < length; i++) {
            if (equals(array[i], item)) {
                freq++;
            }
        }
        return freq;
    };

    /**
     * Returns true if the two arrays are equal to one another.
     * Two arrays are considered equal if both arrays contain the same number
     * of elements, all corresponding pairs of elements in the two
     * arrays are equal and are in the same order.
     * @param {Array} array1
     * @param {Array} array2
     * @param {function(Object,Object):boolean=} equalsFunction Optional function to
     * check equality between two elements. Receives two arguments and returns true if they are equal.
     * @return {boolean} True if the two arrays are equal.
     */
    buckets.arrays.equals = function(array1, array2, equalsFunction) {
        var equals = equalsFunction || buckets.defaultEquals;

        if (array1.length !== array2.length) {
            return false;
        }
        var length = array1.length;
        for (var i = 0; i < length; i++) {
            if (!equals(array1[i], array2[i])) {
                return false;
            }
        }
        return true;
    };

    /**
     * Returns a shallow copy of the specified array.
     * @param {*} array The array to copy.
     * @return {Array} A copy of the specified array.
     */
    buckets.arrays.copy = function(array) {
        return array.concat();
    };

    /**
     * Swaps the elements at the specified positions in the specified array.
     * @param {Array} array The array in which to swap elements.
     * @param {number} i The index of one element to be swapped.
     * @param {number} j The index of the other element to be swapped.
     * @return {boolean} True if the array is defined and the indexes are valid.
     */
    buckets.arrays.swap = function(array, i, j) {
        if (i < 0 || i >= array.length || j < 0 || j >= array.length) {
            return false;
        }
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        return true;
    };

    /**
     * Executes a provided function once per array element.
     * @param {Array} array The array in which to iterate.
     * @param {function(Object):*} Callback function to execute, it is
     * invoked with one argument: the element value. To break the iteration you can
     * optionally return false inside the callback.
     */
    buckets.arrays.forEach = function(array, callback) {
        var lenght = array.length;
        for (var i = 0; i < lenght; i++) {
            if (callback(array[i]) === false) {
                return;
            }
        }
    };

    /**
     * Creates an empty Linked List.
     * @class A linked list is a data structure consisting of a group of nodes
     * which together represent a sequence.
     * @constructor
     */
    buckets.LinkedList = function() {

        /**
         * First node in the list
         * @type {Object}
         * @private
         */
        this.firstNode = null;

        /**
         * Last node in the list
         * @type {Object}
         * @private
         */
        this.lastNode = null;

        /**
         * Number of elements in the list
         * @type {number}
         * @private
         */
        this.nElements = 0;
    };


    /**
     * Adds an element to this list.
     * @param {Object} item Element to be added.
     * @param {number=} index Optional index to add the element. If no index is specified
     * the element is added to the end of this list.
     * @return {boolean} True if the element was added or false if the index is invalid
     * or if the element is undefined.
     */
    buckets.LinkedList.prototype.add = function(item, index) {
        if (buckets.isUndefined(index)) {
            index = this.nElements;
        }
        if (index < 0 || index > this.nElements || buckets.isUndefined(item)) {
            return false;
        }
        var newNode = this.createNode(item);
        if (this.nElements === 0) {
            // First node in the list.
            this.firstNode = newNode;
            this.lastNode = newNode;
        } else if (index === this.nElements) {
            // Insert at the end.
            this.lastNode.next = newNode;
            this.lastNode = newNode;
        } else if (index === 0) {
            // Change first node.
            newNode.next = this.firstNode;
            this.firstNode = newNode;
        } else {
            var prev = this.nodeAtIndex(index - 1);
            newNode.next = prev.next;
            prev.next = newNode;
        }
        this.nElements++;
        return true;
    };

    /**
     * Returns the first element in this list.
     * @return {*} The first element of the list or undefined if the list is
     * empty.
     */
    buckets.LinkedList.prototype.first = function() {
        if (this.firstNode !== null) {
            return this.firstNode.element;
        }
        return undefined;
    };

    /**
     * Returns the last element in this list.
     * @return {*} The last element in the list or undefined if the list is
     * empty.
     */
    buckets.LinkedList.prototype.last = function() {
        if (this.lastNode !== null) {
            return this.lastNode.element;
        }
        return undefined;
    };


    /**
     * Returns the element at the specified position in this list.
     * @param {number} index Desired index.
     * @return {*} The element at the given index or undefined if the index is
     * out of bounds.
     */
    buckets.LinkedList.prototype.elementAtIndex = function(index) {

        var node = this.nodeAtIndex(index);
        if (node === null) {
            return undefined;
        }
        return node.element;
    };

    /**
     * Returns the index of the first occurrence of the
     * specified element, or -1 if the List does not contain this element.
     * <p>If the elements inside this list are
     * not comparable with the === operator a custom equals function should be
     * provided to perform searches, the function must receive two arguments and
     * return true if they are equal, false otherwise. Example:</p>
     *
     * <pre>
     * var petsAreEqualByName = function(pet1, pet2) {
     *  return pet1.name === pet2.name;
     * }
     * </pre>
     * @param {Object} item Element to search for.
     * @param {function(Object,Object):boolean=} equalsFunction Optional
     * function used to check if two elements are equal.
     * @return {number} The index in this list of the first occurrence
     * of the specified element, or -1 if this list does not contain the
     * element.
     */
    buckets.LinkedList.prototype.indexOf = function(item, equalsFunction) {

        var equalsF = equalsFunction || buckets.defaultEquals;
        if (buckets.isUndefined(item)) {
            return -1;
        }
        var currentNode = this.firstNode;
        var index = 0;
        while (currentNode !== null) {
            if (equalsF(currentNode.element, item)) {
                return index;
            }
            index++;
            currentNode = currentNode.next;
        }
        return -1;
    };

    /**
     * Returns true if this list contains the specified element.
     * <p>If the elements inside the list are
     * not comparable with the === operator a custom equals function should be
     * provided to perform searches, the function must receive two arguments and
     * return true if they are equal, false otherwise. Example:</p>
     *
     * <pre>
     * var petsAreEqualByName = function(pet1, pet2) {
     *  return pet1.name === pet2.name;
     * }
     * </pre>
     * @param {Object} item Element to search for.
     * @param {function(Object,Object):boolean=} equalsFunction Optional
     * function used to check if two elements are equal.
     * @return {boolean} True if this list contains the specified element, false
     * otherwise.
     */
    buckets.LinkedList.prototype.contains = function(item, equalsFunction) {
        return (this.indexOf(item, equalsFunction) >= 0);
    };

    /**
     * Removes the first occurrence of the specified element in this list.
     * <p>If the elements inside the list are
     * not comparable with the === operator a custom equals function should be
     * provided to perform searches, the function must receive two arguments and
     * return true if they are equal, false otherwise. Example:</p>
     *
     * <pre>
     * var petsAreEqualByName = function(pet1, pet2) {
     *  return pet1.name === pet2.name;
     * }
     * </pre>
     * @param {Object} item Element to be removed from this list, if present.
     * @return {boolean} True if the list contained the specified element.
     */
    buckets.LinkedList.prototype.remove = function(item, equalsFunction) {
        var equalsF = equalsFunction || buckets.defaultEquals;
        if (this.nElements < 1 || buckets.isUndefined(item)) {
            return false;
        }
        var previous = null;
        var currentNode = this.firstNode;
        while (currentNode !== null) {

            if (equalsF(currentNode.element, item)) {

                if (currentNode === this.firstNode) {
                    this.firstNode = this.firstNode.next;
                    if (currentNode === this.lastNode) {
                        this.lastNode = null;
                    }
                } else if (currentNode === this.lastNode) {
                    this.lastNode = previous;
                    previous.next = currentNode.next;
                    currentNode.next = null;
                } else {
                    previous.next = currentNode.next;
                    currentNode.next = null;
                }
                this.nElements--;
                return true;
            }
            previous = currentNode;
            currentNode = currentNode.next;
        }
        return false;
    };

    /**
     * Removes all the elements from this list.
     */
    buckets.LinkedList.prototype.clear = function() {
        this.firstNode = null;
        this.lastNode = null;
        this.nElements = 0;
    };

    /**
     * Returns true if this list is equal to the given list.
     * Two lists are equal if they have the same elements in the same order.
     * @param {buckets.LinkedList} other The other list.
     * @param {function(Object,Object):boolean=} equalsFunction Optional
     * function to check if two elements are equal. If the elements in the lists
     * are custom objects you should provide a function, otherwise
     * the === operator is used to check equality between elements.
     * @return {boolean} true if this list is equal to the given list.
     */
    buckets.LinkedList.prototype.equals = function(other, equalsFunction) {
        var eqF = equalsFunction || buckets.defaultEquals;
        if (!(other instanceof buckets.LinkedList)) {
            return false;
        }
        if (this.size() !== other.size()) {
            return false;
        }
        return this.equalsAux(this.firstNode, other.firstNode, eqF);
    };

    /**
     * @private
     */
    buckets.LinkedList.prototype.equalsAux = function(n1, n2, eqF) {
        while (n1 !== null) {
            if (!eqF(n1.element, n2.element)) {
                return false;
            }
            n1 = n1.next;
            n2 = n2.next;
        }
        return true;
    };

    /**
     * Removes the element at the specified position in this list.
     * @param {number} index Given index.
     * @return {*} Removed element or undefined if the index is out of bounds.
     */
    buckets.LinkedList.prototype.removeElementAtIndex = function(index) {

        if (index < 0 || index >= this.nElements) {
            return undefined;
        }
        var element;
        if (this.nElements === 1) {
            //First node in the list.
            element = this.firstNode.element;
            this.firstNode = null;
            this.lastNode = null;
        } else {
            var previous = this.nodeAtIndex(index - 1);
            if (previous === null) {
                element = this.firstNode.element;
                this.firstNode = this.firstNode.next;
            } else if (previous.next === this.lastNode) {
                element = this.lastNode.element;
                this.lastNode = previous;
            }
            if (previous !== null) {
                element = previous.next.element;
                previous.next = previous.next.next;
            }
        }
        this.nElements--;
        return element;
    };

    /**
     * Executes the provided function once per  element present in this list in order.
     * @param {function(Object):*} callback Function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false inside the callback.
     */
    buckets.LinkedList.prototype.forEach = function(callback) {
        var currentNode = this.firstNode;
        while (currentNode !== null) {
            if (callback(currentNode.element) === false) {
                break;
            }
            currentNode = currentNode.next;
        }
    };

    /**
     * Reverses the order of the elements in this linked list (makes the last
     * element first, and the first element last).
     */
    buckets.LinkedList.prototype.reverse = function() {
        var previous = null;
        var current = this.firstNode;
        var temp = null;
        while (current !== null) {
            temp = current.next;
            current.next = previous;
            previous = current;
            current = temp;
        }
        temp = this.firstNode;
        this.firstNode = this.lastNode;
        this.lastNode = temp;
    };


    /**
     * Returns an array containing all of the elements in this list in proper
     * sequence.
     * @return {Array.<*>} An array containing all of the elements in this list,
     * in proper sequence.
     */
    buckets.LinkedList.prototype.toArray = function() {
        var array = [];
        var currentNode = this.firstNode;
        while (currentNode !== null) {
            array.push(currentNode.element);
            currentNode = currentNode.next;
        }
        return array;
    };
    /**
     * Returns the number of elements in this list.
     * @return {number} the number of elements in this list.
     */
    buckets.LinkedList.prototype.size = function() {
        return this.nElements;
    };

    /**
     * Returns true if this list contains no elements.
     * @return {boolean} true if this list contains no elements.
     */
    buckets.LinkedList.prototype.isEmpty = function() {
        return this.nElements <= 0;
    };

    /**
     * @private
     */
    buckets.LinkedList.prototype.nodeAtIndex = function(index) {

        if (index < 0 || index >= this.nElements) {
            return null;
        }
        if (index === (this.nElements - 1)) {
            return this.lastNode;
        }
        var node = this.firstNode;
        for (var i = 0; i < index; i++) {
            node = node.next;
        }
        return node;
    };
    /**
     * @private
     */
    buckets.LinkedList.prototype.createNode = function(item) {
        return {
            element: item,
            next: null
        };
    };


    /**
     * Creates an empty dictionary.
     * @class <p>Dictionaries map keys to values; each key can map to at most one value.
     * This implementation accepts any kind of objects as keys.</p>
     *
     * <p>If the keys are custom objects a function which converts keys to unique
     * strings must be provided. Example:</p>
     * <pre>
     * function petToString(pet) {
     *  return pet.name;
     * }
     * </pre>
     * @constructor
     * @param {function(Object):string=} toStrFunction Optional function used
     * to convert keys to strings. If the keys aren't strings or if toString()
     * is not appropriate, a custom function which receives a key and returns a
     * unique string must be provided.
     */
    buckets.Dictionary = function(toStrFunction) {

        /**
         * Object holding the key-value pairs.
         * @type {Object}
         * @private
         */
        this.table = {};

        /**
         * Number of elements in the list.
         * @type {number}
         * @private
         */
        this.nElements = 0;

        /**
         * Function used to convert keys to strings.
         * @type {function(Object):string}
         * @private
         */
        this.toStr = toStrFunction || buckets.defaultToString;
    };

    /**
     * Returns the value to which this dictionary maps the specified key.
     * Returns undefined if this dictionary contains no mapping for this key.
     * @param {Object} key Key whose associated value is to be returned.
     * @return {*} The value to which this dictionary maps the specified key or
     * undefined if the map contains no mapping for this key.
     */
    buckets.Dictionary.prototype.get = function(key) {

        var pair = this.table[this.toStr(key)];
        if (buckets.isUndefined(pair)) {
            return undefined;
        }
        return pair.value;
    };
    /**
     * Associates the specified value with the specified key in this dictionary.
     * If the dictionary previously contained a mapping for this key, the old
     * value is replaced by the specified value.
     * @param {Object} key Key with which the specified value is to be
     * associated.
     * @param {Object} value Value to be associated with the specified key.
     * @return {*} Previous value associated with the specified key, or undefined if
     * there was no mapping for the key or if the key/value are undefined.
     */
    buckets.Dictionary.prototype.set = function(key, value) {

        if (buckets.isUndefined(key) || buckets.isUndefined(value)) {
            return undefined;
        }

        var ret;
        var k = this.toStr(key);
        var previousElement = this.table[k];
        if (buckets.isUndefined(previousElement)) {
            this.nElements++;
            ret = undefined;
        } else {
            ret = previousElement.value;
        }
        this.table[k] = {
            key: key,
            value: value
        };
        return ret;
    };
    /**
     * Removes the mapping for this key from this dictionary if it is present.
     * @param {Object} key Key whose mapping is to be removed from the
     * dictionary.
     * @return {*} Previous value associated with specified key, or undefined if
     * there was no mapping for key.
     */
    buckets.Dictionary.prototype.remove = function(key) {
        var k = this.toStr(key);
        var previousElement = this.table[k];
        if (!buckets.isUndefined(previousElement)) {
            delete this.table[k];
            this.nElements--;
            return previousElement.value;
        }
        return undefined;
    };
    /**
     * Returns an array containing all of the keys in this dictionary.
     * @return {Array} An array containing all of the keys in this dictionary.
     */
    buckets.Dictionary.prototype.keys = function() {
        var array = [];
        for (var name in this.table) {
            if (this.table.hasOwnProperty(name)) {
                array.push(this.table[name].key);
            }
        }
        return array;
    };
    /**
     * Returns an array containing all of the values in this dictionary.
     * @return {Array} An array containing all of the values in this dictionary.
     */
    buckets.Dictionary.prototype.values = function() {
        var array = [];
        for (var name in this.table) {
            if (this.table.hasOwnProperty(name)) {
                array.push(this.table[name].value);
            }
        }
        return array;
    };

    /**
     * Executes the provided function once per key-value pair
     * present in this dictionary.
     * @param {function(Object,Object):*} Callback function to execute, it is
     * invoked with two arguments: key and value. To break the iteration you can
     * optionally return false inside the callback.
     */
    buckets.Dictionary.prototype.forEach = function(callback) {
        for (var name in this.table) {
            if (this.table.hasOwnProperty(name)) {
                var pair = this.table[name];
                var ret = callback(pair.key, pair.value);
                if (ret === false) {
                    return;
                }
            }
        }
    };

    /**
     * Returns true if this dictionary contains a mapping for the specified key.
     * @param {Object} key Key whose presence in this dictionary is to be
     * tested.
     * @return {boolean} True if this dictionary contains a mapping for the
     * specified key.
     */
    buckets.Dictionary.prototype.containsKey = function(key) {
        return !buckets.isUndefined(this.get(key));
    };
    /**
     * Removes all mappings from this dictionary.
     * @this {buckets.Dictionary}
     */
    buckets.Dictionary.prototype.clear = function() {

        this.table = {};
        this.nElements = 0;
    };
    /**
     * Returns the number of keys in this dictionary.
     * @return {number} The number of key-value mappings in this dictionary.
     */
    buckets.Dictionary.prototype.size = function() {
        return this.nElements;
    };

    /**
     * Returns true if this dictionary contains no mappings.
     * @return {boolean} True if this dictionary contains no mappings.
     */
    buckets.Dictionary.prototype.isEmpty = function() {
        return this.nElements <= 0;
    };

    /**
     * Creates an empty multi dictionary.
     * @class <p>A multi dictionary is a special kind of dictionary that holds
     * multiple values against each key. Setting a value into the dictionary will
     * add the value to an array at that key. Getting a key will return an array
     * holding all of the values set to that key.
     * This implementation accepts any kind of objects as keys.</p>
     *
     * <p>If the keys are custom objects a function which converts keys to unique strings must be
     * provided. Example:</p>
     *
     * <pre>
     * function petToString(pet) {
     *  return pet.type + ' ' + pet.name;
     * }
     * </pre>
     * <p>If the values are custom objects a function to check equality between values
     * must be provided. Example:</p>
     *
     * <pre>
     * function petsAreEqualByAge(pet1,pet2) {
     *  return pet1.age===pet2.age;
     * }
     * </pre>
     * @constructor
     * @param {function(Object):string=} toStrFunction optional function
     * to convert keys to strings. If the keys aren't strings or if toString()
     * is not appropriate, a custom function which receives a key and returns a
     * unique string must be provided.
     * @param {function(Object,Object):boolean=} valuesEqualsFunction optional
     * function to check if two values are equal.
     *
     */
    buckets.MultiDictionary = function(toStrFunction, valuesEqualsFunction) {
        // Call the parent's constructor
        this.parent = new buckets.Dictionary(toStrFunction);
        this.equalsF = valuesEqualsFunction || buckets.defaultEquals;
    };

    /**
     * Returns an array holding the values to which this dictionary maps
     * the specified key.
     * Returns an empty array if this dictionary contains no mappings for this key.
     * @param {Object} key Key whose associated values are to be returned.
     * @return {Array} An array holding the values to which this dictionary maps
     * the specified key.
     */
    buckets.MultiDictionary.prototype.get = function(key) {
        var values = this.parent.get(key);
        if (buckets.isUndefined(values)) {
            return [];
        }
        return buckets.arrays.copy(values);
    };

    /**
     * Adds the value to an array associated with the specified key, if
     * it is not already present.
     * @param {Object} key Key which the specified value is to be
     * associated.
     * @param {Object} value The value to add to the array at the key.
     * @return {boolean} True if the value was not already associated with that key.
     */
    buckets.MultiDictionary.prototype.set = function(key, value) {

        if (buckets.isUndefined(key) || buckets.isUndefined(value)) {
            return false;
        }
        if (!this.containsKey(key)) {
            this.parent.set(key, [value]);
            return true;
        }
        var array = this.parent.get(key);
        if (buckets.arrays.contains(array, value, this.equalsF)) {
            return false;
        }
        array.push(value);
        return true;
    };

    /**
     * Removes the specified value from the array of values associated with the
     * specified key. If a value isn't given, all values associated with the specified
     * key are removed.
     * @param {Object} key Key whose mapping is to be removed from the
     * dictionary.
     * @param {Object=} value Optional argument to specify the value to remove
     * from the array associated with the specified key.
     * @return {*} True if the dictionary changed, false if the key doesn't exist or
     * if the specified value isn't associated with the specified key.
     */
    buckets.MultiDictionary.prototype.remove = function(key, value) {
        if (buckets.isUndefined(value)) {
            var v = this.parent.remove(key);
            if (buckets.isUndefined(v)) {
                return false;
            }
            return true;
        }
        var array = this.parent.get(key);
        if (buckets.arrays.remove(array, value, this.equalsF)) {
            if (array.length === 0) {
                this.parent.remove(key);
            }
            return true;
        }
        return false;
    };

    /**
     * Returns an array containing all of the keys in this dictionary.
     * @return {Array} an array containing all of the keys in this dictionary.
     */
    buckets.MultiDictionary.prototype.keys = function() {
        return this.parent.keys();
    };

    /**
     * Returns an array containing all of the values in this dictionary.
     * @return {Array} An array containing all of the values in this dictionary.
     */
    buckets.MultiDictionary.prototype.values = function() {
        var values = this.parent.values();
        var array = [];
        for (var i = 0; i < values.length; i++) {
            var v = values[i];
            for (var j = 0; j < v.length; j++) {
                array.push(v[j]);
            }
        }
        return array;
    };

    /**
     * Returns true if this dictionary has at least one value associatted the specified key.
     * @param {Object} key Key whose presence in this dictionary is to be
     * tested.
     * @return {boolean} True if this dictionary has at least one value associatted
     * the specified key.
     */
    buckets.MultiDictionary.prototype.containsKey = function(key) {
        return this.parent.containsKey(key);
    };

    /**
     * Removes all mappings from this dictionary.
     */
    buckets.MultiDictionary.prototype.clear = function() {
        return this.parent.clear();
    };

    /**
     * Returns the number of keys in this dictionary.
     * @return {number} The number of key-value mappings in this dictionary.
     */
    buckets.MultiDictionary.prototype.size = function() {
        return this.parent.size();
    };

    /**
     * Returns true if this dictionary contains no mappings.
     * @return {boolean} True if this dictionary contains no mappings.
     */
    buckets.MultiDictionary.prototype.isEmpty = function() {
        return this.parent.isEmpty();
    };

    /**
     * Creates an empty Heap.
     * @class
     * <p>A heap is a binary tree, where the nodes maintain the heap property:
     * each node is smaller than each of its children.
     * This implementation uses an array to store elements.</p>
     * <p>If the inserted elements are custom objects a compare function must be provided,
     *  at construction time, otherwise the <=, === and >= operators are
     * used to compare elements. Example:</p>
     *
     * <pre>
     * function compare(a, b) {
     *  if (a is less than b by some ordering criterion) {
     *     return -1;
     *  } if (a is greater than b by the ordering criterion) {
     *     return 1;
     *  }
     *  // a must be equal to b
     *  return 0;
     * }
     * </pre>
     *
     * <p>If a Max-Heap is wanted (greater elements on top) you can a provide a
     * reverse compare function to accomplish that behavior. Example:</p>
     *
     * <pre>
     * function reverseCompare(a, b) {
     *  if (a is less than b by some ordering criterion) {
     *     return 1;
     *  } if (a is greater than b by the ordering criterion) {
     *     return -1;
     *  }
     *  // a must be equal to b
     *  return 0;
     * }
     * </pre>
     *
     * @constructor
     * @param {function(Object,Object):number=} compareFunction Optional
     * function used to compare two elements. Must return a negative integer,
     * zero, or a positive integer as the first argument is less than, equal to,
     * or greater than the second.
     */
    buckets.Heap = function(compareFunction) {

        /**
         * Array used to store the elements od the heap.
         * @type {Array.<Object>}
         * @private
         */
        this.data = [];

        /**
         * Function used to compare elements.
         * @type {function(Object,Object):number}
         * @private
         */
        this.compare = compareFunction || buckets.defaultCompare;
    };
    /**
     * Returns the index of the left child of the node at the given index.
     * @param {number} nodeIndex The index of the node to get the left child
     * for.
     * @return {number} The index of the left child.
     * @private
     */
    buckets.Heap.prototype.leftChildIndex = function(nodeIndex) {
        return (2 * nodeIndex) + 1;
    };
    /**
     * Returns the index of the right child of the node at the given index.
     * @param {number} nodeIndex The index of the node to get the right child
     * for.
     * @return {number} The index of the right child.
     * @private
     */
    buckets.Heap.prototype.rightChildIndex = function(nodeIndex) {
        return (2 * nodeIndex) + 2;
    };
    /**
     * Returns the index of the parent of the node at the given index.
     * @param {number} nodeIndex The index of the node to get the parent for.
     * @return {number} The index of the parent.
     * @private
     */
    buckets.Heap.prototype.parentIndex = function(nodeIndex) {
        return Math.floor((nodeIndex - 1) / 2);
    };
    /**
     * Returns the index of the smaller child node (if it exists).
     * @param {number} leftChild left child index.
     * @param {number} rightChild right child index.
     * @return {number} the index with the minimum value or -1 if it doesn't
     * exists.
     * @private
     */
    buckets.Heap.prototype.minIndex = function(leftChild, rightChild) {

        if (rightChild >= this.data.length) {
            if (leftChild >= this.data.length) {
                return -1;
            } else {
                return leftChild;
            }
        } else {
            if (this.compare(this.data[leftChild], this.data[rightChild]) <= 0) {
                return leftChild;
            } else {
                return rightChild;
            }
        }
    };
    /**
     * Moves the node at the given index up to its proper place in the heap.
     * @param {number} index The index of the node to move up.
     * @private
     */
    buckets.Heap.prototype.siftUp = function(index) {

        var parent = this.parentIndex(index);
        while (index > 0 && this.compare(this.data[parent], this.data[index]) > 0) {
            buckets.arrays.swap(this.data, parent, index);
            index = parent;
            parent = this.parentIndex(index);
        }
    };
    /**
     * Moves the node at the given index down to its proper place in the heap.
     * @param {number} nodeIndex The index of the node to move down.
     * @private
     */
    buckets.Heap.prototype.siftDown = function(nodeIndex) {

        //smaller child index
        var min = this.minIndex(this.leftChildIndex(nodeIndex), this.rightChildIndex(nodeIndex));

        while (min >= 0 && this.compare(this.data[nodeIndex], this.data[min]) > 0) {
            buckets.arrays.swap(this.data, min, nodeIndex);
            nodeIndex = min;
            min = this.minIndex(this.leftChildIndex(nodeIndex), this.rightChildIndex(nodeIndex));
        }
    };
    /**
     * Retrieves but does not remove the root element of this heap.
     * @return {*} The value at the root of the heap. Returns undefined if the
     * heap is empty.
     */
    buckets.Heap.prototype.peek = function() {

        if (this.data.length > 0) {
            return this.data[0];
        } else {
            return undefined;
        }
    };
    /**
     * Adds the given element into the heap.
     * @param {*} element The element.
     * @return True if the element was added or false if it is undefined.
     */
    buckets.Heap.prototype.add = function(element) {
        if (buckets.isUndefined(element)) {
            return undefined;
        }
        this.data.push(element);
        this.siftUp(this.data.length - 1);
        return true;
    };

    /**
     * Retrieves and removes the root element of this heap.
     * @return {*} The value removed from the root of the heap. Returns
     * undefined if the heap is empty.
     */
    buckets.Heap.prototype.removeRoot = function() {

        if (this.data.length > 0) {
            var obj = this.data[0];
            this.data[0] = this.data[this.data.length - 1];
            this.data.splice(this.data.length - 1, 1);
            if (this.data.length > 0) {
                this.siftDown(0);
            }
            return obj;
        }
        return undefined;
    };
    /**
     * Returns true if this heap contains the specified element.
     * @param {Object} element Element to search for.
     * @return {boolean} True if this Heap contains the specified element, false
     * otherwise.
     */
    buckets.Heap.prototype.contains = function(element) {
        var equF = buckets.compareToEquals(this.compare);
        return buckets.arrays.contains(this.data, element, equF);
    };
    /**
     * Returns the number of elements in this heap.
     * @return {number} The number of elements in this heap.
     */
    buckets.Heap.prototype.size = function() {
        return this.data.length;
    };
    /**
     * Checks if this heap is empty.
     * @return {boolean} True if and only if this heap contains no items; false
     * otherwise.
     */
    buckets.Heap.prototype.isEmpty = function() {
        return this.data.length <= 0;
    };
    /**
     * Removes all of the elements from this heap.
     */
    buckets.Heap.prototype.clear = function() {
        this.data.length = 0;
    };

    /**
     * Executes the provided function once per element present in this heap in
     * no particular order.
     * @param {function(Object):*} callback Function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false.
     */
    buckets.Heap.prototype.forEach = function(callback) {
        buckets.arrays.forEach(this.data, callback);
    };

    /**
     * Creates an empty Stack.
     * @class A Stack is a Last-In-First-Out (LIFO) data structure, the last
     * element added to the stack will be the first one to be removed. This
     * implementation uses a linked list as a container.
     * @constructor
     */
    buckets.Stack = function() {

        /**
         * List containing the elements.
         * @type buckets.LinkedList
         * @private
         */
        this.list = new buckets.LinkedList();
    };
    /**
     * Pushes an item onto the top of this stack.
     * @param {Object} elem The element to be pushed onto this stack.
     * @return {boolean} True if the element was pushed or false if it is undefined.
     */
    buckets.Stack.prototype.push = function(elem) {
        return this.list.add(elem, 0);
    };
    /**
     * Pushes an item onto the top of this stack.
     * @param {Object} elem The element to be pushed onto this stack.
     * @return {boolean} true If the element was pushed or false if it is undefined.
     */
    buckets.Stack.prototype.add = function(elem) {
        return this.list.add(elem, 0);
    };
    /**
     * Removes the object at the top of this stack and returns that object.
     * @return {*} The object at the top of this stack or undefined if the
     * stack is empty.
     */
    buckets.Stack.prototype.pop = function() {
        return this.list.removeElementAtIndex(0);
    };
    /**
     * Looks at the object at the top of this stack without removing it from the
     * stack.
     * @return {*} The object at the top of this stack or undefined if the
     * stack is empty.
     */
    buckets.Stack.prototype.peek = function() {
        return this.list.first();
    };
    /**
     * Returns the number of elements in this stack.
     * @return {number} The number of elements in this stack.
     */
    buckets.Stack.prototype.size = function() {
        return this.list.size();
    };

    /**
     * Returns true if this stack contains the specified element.
     * <p>If the elements inside this stack are
     * not comparable with the === operator, a custom equals function must be
     * provided to perform searches, the function must receive two arguments and
     * return true if they are equal, false otherwise. Example:</p>
     *
     * <pre>
     * var petsAreEqualByName = function(pet1, pet2) {
     *  return pet1.name === pet2.name;
     * }
     * </pre>
     * @param {Object} elem Element to search for.
     * @param {function(Object,Object):boolean=} equalsFunction Optional
     * function to check if two elements are equal.
     * @return {boolean} True if this stack contains the specified element,
     * false otherwise.
     */
    buckets.Stack.prototype.contains = function(elem, equalsFunction) {
        return this.list.contains(elem, equalsFunction);
    };
    /**
     * Checks if this stack is empty.
     * @return {boolean} True if and only if this stack contains no items; false
     * otherwise.
     */
    buckets.Stack.prototype.isEmpty = function() {
        return this.list.isEmpty();
    };
    /**
     * Removes all of the elements from this stack.
     */
    buckets.Stack.prototype.clear = function() {
        this.list.clear();
    };

    /**
     * Executes the provided function once per element present in this stack in
     * LIFO order.
     * @param {function(Object):*} callback Function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false inside the callback.
     */
    buckets.Stack.prototype.forEach = function(callback) {
        this.list.forEach(callback);
    };

    /**
     * Creates an empty queue.
     * @class A queue is a First-In-First-Out (FIFO) data structure, the first
     * element added to the queue will be the first one to be removed. This
     * implementation uses a linked list as a container.
     * @constructor
     */
    buckets.Queue = function() {

        /**
         * List containing the elements.
         * @type buckets.LinkedList
         * @private
         */
        this.list = new buckets.LinkedList();
    };
    /**
     * Inserts the specified element into the end of this queue.
     * @param {Object} elem The element to insert.
     * @return {boolean} True if the element was inserted, or false if it is undefined.
     */
    buckets.Queue.prototype.enqueue = function(elem) {
        return this.list.add(elem);
    };
    /**
     * Inserts the specified element into the end of this queue. Equivalent to enqueue.
     * @param {Object} elem The element to insert.
     * @return {boolean} True if the element was inserted, or false if it is undefined.
     */
    buckets.Queue.prototype.add = function(elem) {
        return this.list.add(elem);
    };
    /**
     * Retrieves and removes the head of this queue.
     * @return {*} The head of this queue, or undefined if this queue is empty.
     */
    buckets.Queue.prototype.dequeue = function() {
        if (this.list.size() !== 0) {
            var el = this.list.first();
            this.list.removeElementAtIndex(0);
            return el;
        }
        return undefined;
    };
    /**
     * Retrieves, but does not remove, the head of this queue.
     * @return {*} The head of this queue, or undefined if this queue is empty.
     */
    buckets.Queue.prototype.peek = function() {

        if (this.list.size() !== 0) {
            return this.list.first();
        }
        return undefined;
    };

    /**
     * Returns the number of elements in this queue.
     * @return {number} The number of elements in this queue.
     */
    buckets.Queue.prototype.size = function() {
        return this.list.size();
    };

    /**
     * Returns true if this queue contains the specified element.
     * <p>If the elements inside this stack are
     * not comparable with the === operator, a custom equals function should be
     * provided to perform searches, the function must receive two arguments and
     * return true if they are equal, false otherwise. Example:</p>
     *
     * <pre>
     * var petsAreEqualByName = function(pet1, pet2) {
     *  return pet1.name === pet2.name;
     * }
     * </pre>
     * @param {Object} elem Element to search for.
     * @param {function(Object,Object):boolean=} equalsFunction Optional
     * function to check if two elements are equal.
     * @return {boolean} True if this queue contains the specified element,
     * false otherwise.
     */
    buckets.Queue.prototype.contains = function(elem, equalsFunction) {
        return this.list.contains(elem, equalsFunction);
    };

    /**
     * Checks if this queue is empty.
     * @return {boolean} True if and only if this queue contains no items; false
     * otherwise.
     */
    buckets.Queue.prototype.isEmpty = function() {
        return this.list.size() <= 0;
    };

    /**
     * Removes all the elements from this queue.
     */
    buckets.Queue.prototype.clear = function() {
        this.list.clear();
    };

    /**
     * Executes the provided function once for each element present in this queue in
     * FIFO order.
     * @param {function(Object):*} callback Function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false inside the callback.
     */
    buckets.Queue.prototype.forEach = function(callback) {
        this.list.forEach(callback);
    };

    /**
     * Creates an empty priority queue.
     * @class <p>In a priority queue each element is associated with a "priority",
     * elements are dequeued in highest-priority-first order (the elements with the
     * highest priority are dequeued first). Priority Queues are implemented as heaps.
     * If the inserted elements are custom objects a compare function must be provided,
     * otherwise the <=, === and >= operators are used to compare object priority.</p>
     * <pre>
     * function compare(a, b) {
     *  if (a is less than b by some ordering criterion) {
     *     return -1;
     *  } if (a is greater than b by the ordering criterion) {
     *     return 1;
     *  }
     *  // a must be equal to b
     *  return 0;
     * }
     * </pre>
     * @constructor
     * @param {function(Object,Object):number=} compareFunction Optional
     * function used to compare two element priorities. Must return a negative integer,
     * zero, or a positive integer as the first argument is less than, equal to,
     * or greater than the second.
     */
    buckets.PriorityQueue = function(compareFunction) {
        this.heap = new buckets.Heap(buckets.reverseCompareFunction(compareFunction));
    };

    /**
     * Inserts the specified element into this priority queue.
     * @param {Object} element The element to insert.
     * @return {boolean} True if the element was inserted, or false if it is undefined.
     */
    buckets.PriorityQueue.prototype.enqueue = function(element) {
        return this.heap.add(element);
    };

    /**
     * Inserts the specified element into this priority queue, it is equivalent to enqueue.
     * @param {Object} Element the element to insert.
     * @return {boolean} True if the element was inserted, or false if it is undefined.
     */
    buckets.PriorityQueue.prototype.add = function(element) {
        return this.heap.add(element);
    };

    /**
    * Retrieves and removes the highest priority element of this queue.
    * @return {*} The highest priority element of this queue,
    or undefined if this queue is empty.
    */
    buckets.PriorityQueue.prototype.dequeue = function() {
        if (this.heap.size() !== 0) {
            var el = this.heap.peek();
            this.heap.removeRoot();
            return el;
        }
        return undefined;
    };


    /**
     * Retrieves, but does not remove, the highest priority element of this queue.
     * @return {*} The highest priority element of this queue, or undefined if this queue is empty.
     */
    buckets.PriorityQueue.prototype.peek = function() {
        return this.heap.peek();
    };

    /**
     * Returns true if this priority queue contains the specified element.
     * @param {Object} element Element to search for.
     * @return {boolean} True if this priority queue contains the specified element,
     * false otherwise.
     */
    buckets.PriorityQueue.prototype.contains = function(element) {
        return this.heap.contains(element);
    };

    /**
     * Checks if this priority queue is empty.
     * @return {boolean} True if and only if this priority queue contains no items; false
     * otherwise.
     */
    buckets.PriorityQueue.prototype.isEmpty = function() {
        return this.heap.isEmpty();
    };

    /**
     * Returns the number of elements in this priority queue.
     * @return {number} The number of elements in this priority queue.
     */
    buckets.PriorityQueue.prototype.size = function() {
        return this.heap.size();
    };

    /**
     * Removes all elements from this priority queue.
     */
    buckets.PriorityQueue.prototype.clear = function() {
        this.heap.clear();
    };

    /**
     * Executes the provided function once per element present in this queue in
     * no particular order.
     * @param {function(Object):*} callback Function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false inside the callback.
     */
    buckets.PriorityQueue.prototype.forEach = function(callback) {
        this.heap.forEach(callback);
    };


    /**
     * Creates an empty set.
     * @class <p>A set is a data structure that contains no duplicate items.</p>
     * <p>If the inserted elements are custom objects a function
     * which converts elements to unique strings must be provided. Example:</p>
     *
     * <pre>
     * function petToString(pet) {
     *  return pet.type + ' ' + pet.name;
     * }
     * </pre>
     *
     * @constructor
     * @param {function(Object):string=} toStringFunction Optional function used
     * to convert elements to unique strings. If the elements aren't strings or if toString()
     * is not appropriate, a custom function which receives a onject and returns a
     * unique string must be provided.
     */
    buckets.Set = function(toStringFunction) {
        this.dictionary = new buckets.Dictionary(toStringFunction);
    };

    /**
     * Returns true if this set contains the specified element.
     * @param {Object} element Element to search for.
     * @return {boolean} True if this set contains the specified element,
     * false otherwise.
     */
    buckets.Set.prototype.contains = function(element) {
        return this.dictionary.containsKey(element);
    };

    /**
     * Adds the specified element to this set if it is not already present.
     * @param {Object} element The element to insert.
     * @return {boolean} True if this set did not already contain the specified element.
     */
    buckets.Set.prototype.add = function(element) {
        if (this.contains(element) || buckets.isUndefined(element)) {
            return false;
        } else {
            this.dictionary.set(element, element);
            return true;
        }
    };

    /**
     * Performs an intersection between this and another set.
     * Removes all values that are not present in this set and the given set.
     * @param {buckets.Set} otherSet Other set.
     */
    buckets.Set.prototype.intersection = function(otherSet) {
        var set = this;
        this.forEach(function(element) {
            if (!otherSet.contains(element)) {
                set.remove(element);
            }
        });
    };

    /**
     * Performs a union between this and another set.
     * Adds all values from the given set to this set.
     * @param {buckets.Set} otherSet Other set.
     */
    buckets.Set.prototype.union = function(otherSet) {
        var set = this;
        otherSet.forEach(function(element) {
            set.add(element);
        });
    };

    /**
     * Performs a difference between this and another set.
     * Removes from this set all the values that are present in the given set.
     * @param {buckets.Set} otherSet other set.
     */
    buckets.Set.prototype.difference = function(otherSet) {
        var set = this;
        otherSet.forEach(function(element) {
            set.remove(element);
        });
    };

    /**
     * Checks whether the given set contains all the elements of this set.
     * @param {buckets.Set} otherSet Other set.
     * @return {boolean} True if this set is a subset of the given set.
     */
    buckets.Set.prototype.isSubsetOf = function(otherSet) {

        if (this.size() > otherSet.size()) {
            return false;
        }

        var isSub = true;
        this.forEach(function(element) {
            if (!otherSet.contains(element)) {
                isSub = false;
                return false;
            }
        });
        return isSub;
    };

    /**
     * Removes the specified element from this set if it is present.
     * @return {boolean} True if this set contained the specified element.
     */
    buckets.Set.prototype.remove = function(element) {
        if (!this.contains(element)) {
            return false;
        } else {
            this.dictionary.remove(element);
            return true;
        }
    };

    /**
     * Executes the provided function once per element
     * present in this set.
     * @param {function(Object):*} callback Function to execute, it is
     * invoked with one argument: the element. To break the iteration you can
     * optionally return false inside the callback.
     */
    buckets.Set.prototype.forEach = function(callback) {
        this.dictionary.forEach(function(k, v) {
            return callback(v);
        });
    };

    /**
     * Returns an array containing all the elements in this set in arbitrary order.
     * @return {Array} An array containing all the elements in this set.
     */
    buckets.Set.prototype.toArray = function() {
        return this.dictionary.values();
    };

    /**
     * Returns true if this set contains no elements.
     * @return {boolean} True if this set contains no elements.
     */
    buckets.Set.prototype.isEmpty = function() {
        return this.dictionary.isEmpty();
    };

    /**
     * Returns the number of elements in this set.
     * @return {number} The number of elements in this set.
     */
    buckets.Set.prototype.size = function() {
        return this.dictionary.size();
    };

    /**
     * Removes all the elements from this set.
     */
    buckets.Set.prototype.clear = function() {
        this.dictionary.clear();
    };

    /**
     * Creates an empty bag.
     * @class <p>A bag is a special kind of set in which members are
     * allowed to appear more than once.</p>
     * <p>If the inserted elements are custom objects a function
     * that maps elements to unique strings must be provided at construction time. Example:</p>
     *
     * <pre>
     * function petToUniqueString(pet) {
     *  return pet.type + ' ' + pet.name;
     * }
     * </pre>
     *
     * @constructor
     * @param {function(Object):string=} toStrFunction Optional function used
     * to convert elements to strings. If the elements aren't strings or if toString()
     * is not appropriate, a custom function which receives an object and returns a
     * unique string must be provided.
     */
    buckets.Bag = function(toStrFunction) {
        this.toStrF = toStrFunction || buckets.defaultToString;
        this.dictionary = new buckets.Dictionary(this.toStrF);
        this.nElements = 0;
    };

    /**
     * Adds nCopies of the specified object to this bag.
     * @param {Object} element Element to add.
     * @param {number=} nCopies The number of copies to add, if this argument is
     * undefined 1 copy is added.
     * @return {boolean} True unless element is undefined.
     */
    buckets.Bag.prototype.add = function(element, nCopies) {

        if (isNaN(nCopies) || buckets.isUndefined(nCopies)) {
            nCopies = 1;
        }
        if (buckets.isUndefined(element) || nCopies <= 0) {
            return false;
        }

        if (!this.contains(element)) {
            var node = {
                value: element,
                copies: nCopies
            };
            this.dictionary.set(element, node);
        } else {
            this.dictionary.get(element).copies += nCopies;
        }
        this.nElements += nCopies;
        return true;
    };

    /**
     * Counts the number of copies of the specified object in this bag.
     * @param {Object} element The object to search for.
     * @return {number} The number of copies of the object, 0 if not found.
     */
    buckets.Bag.prototype.count = function(element) {

        if (!this.contains(element)) {
            return 0;
        } else {
            return this.dictionary.get(element).copies;
        }
    };

    /**
     * Returns true if this bag contains the specified element.
     * @param {Object} element Rlement to search for.
     * @return {boolean} True if this bag contains the specified element,
     * false otherwise.
     */
    buckets.Bag.prototype.contains = function(element) {
        return this.dictionary.containsKey(element);
    };

    /**
     * Removes nCopies of the specified object in this bag.
     * If the number of copies to remove is greater than the actual number
     * of copies in the bag, all copies are removed.
     * @param {Object} element Element to remove.
     * @param {number=} nCopies The number of copies to remove, if this argument is
     * undefined 1 copy is removed.
     * @return {boolean} True if at least 1 element was removed.
     */
    buckets.Bag.prototype.remove = function(element, nCopies) {

        if (isNaN(nCopies) || buckets.isUndefined(nCopies)) {
            nCopies = 1;
        }
        if (buckets.isUndefined(element) || nCopies <= 0) {
            return false;
        }

        if (!this.contains(element)) {
            return false;
        } else {
            var node = this.dictionary.get(element);
            if (nCopies > node.copies) {
                this.nElements -= node.copies;
            } else {
                this.nElements -= nCopies;
            }
            node.copies -= nCopies;
            if (node.copies <= 0) {
                this.dictionary.remove(element);
            }
            return true;
        }
    };

    /**
     * Returns an array containing all of the elements in this bag in arbitrary order,
     * including multiple copies.
     * @return {Array} An array containing all of the elements in this bag.
     */
    buckets.Bag.prototype.toArray = function() {
        var a = [];
        var values = this.dictionary.values();
        var vl = values.length;
        for (var i = 0; i < vl; i++) {
            var node = values[i];
            var element = node.value;
            var copies = node.copies;
            for (var j = 0; j < copies; j++) {
                a.push(element);
            }
        }
        return a;
    };

    /**
     * Returns a set of unique elements in this bag.
     * @return {buckets.Set} A set of unique elements in this bag.
     */
    buckets.Bag.prototype.toSet = function() {
        var set = new buckets.Set(this.toStrF);
        var elements = this.dictionary.values();
        var l = elements.length;
        for (var i = 0; i < l; i++) {
            var value = elements[i].value;
            set.add(value);
        }
        return set;
    };

    /**
     * Executes the provided function once per element
     * present in this bag, including multiple copies.
     * @param {function(Object):*} callback Function to execute, it is
     * invoked with one argument: the element. To break the iteration you can
     * optionally return false inside the callback.
     */
    buckets.Bag.prototype.forEach = function(callback) {
        this.dictionary.forEach(function(k, v) {
            var value = v.value;
            var copies = v.copies;
            for (var i = 0; i < copies; i++) {
                if (callback(value) === false) {
                    return false;
                }
            }
            return true;
        });
    };
    /**
     * Returns the number of elements in this bag.
     * @return {number} The number of elements in this bag.
     */
    buckets.Bag.prototype.size = function() {
        return this.nElements;
    };

    /**
     * Returns true if this bag contains no elements.
     * @return {boolean} true If this bag contains no elements.
     */
    buckets.Bag.prototype.isEmpty = function() {
        return this.nElements === 0;
    };

    /**
     * Removes all the elements from this bag.
     */
    buckets.Bag.prototype.clear = function() {
        this.nElements = 0;
        this.dictionary.clear();
    };

    /**
     * Creates an empty binary search tree.
     * @class <p>Formally, a binary search tree is a node-based binary tree data structure which
     * has the following properties:</p>
     * <ul>
     * <li>The left subtree of a node contains only nodes with elements less
     * than the node's element.</li>
     * <li>The right subtree of a node contains only nodes with elements greater
     * than the node's element.</li>
     * <li>Both the left and right subtrees must also be binary search trees.</li>
     * </ul>
     * <p>If the inserted elements are custom objects a compare function must
     * be provided at construction time, otherwise the <=, === and >= operators are
     * used to compare elements. Example:</p>
     * <pre>
     * function compare(a, b) {
     *  if (a is less than b by some ordering criterion) {
     *     return -1;
     *  } if (a is greater than b by the ordering criterion) {
     *     return 1;
     *  }
     *  // a must be equal to b
     *  return 0;
     * }
     * </pre>
     * @constructor
     * @param {function(Object,Object):number=} compareFunction Optional
     * function used to compare two elements. Must return a negative integer,
     * zero, or a positive integer as the first argument is less than, equal to,
     * or greater than the second.
     */
    buckets.BSTree = function(compareFunction) {
        this.root = null;
        this.compare = compareFunction || buckets.defaultCompare;
        this.nElements = 0;
    };

    /**
     * Adds the specified element to this tree if it is not already present.
     * @param {Object} Element the element to insert.
     * @return {boolean} true If this tree did not already contain the specified element.
     */
    buckets.BSTree.prototype.add = function(element) {
        if (buckets.isUndefined(element)) {
            return false;
        }

        if (this.insertNode(this.createNode(element)) !== null) {
            this.nElements++;
            return true;
        }
        return false;
    };

    /**
     * Removes all the elements from this tree.
     */
    buckets.BSTree.prototype.clear = function() {
        this.root = null;
        this.nElements = 0;
    };

    /**
     * Returns true if this tree contains no elements.
     * @return {boolean} True if this tree contains no elements.
     */
    buckets.BSTree.prototype.isEmpty = function() {
        return this.nElements === 0;
    };

    /**
     * Returns the number of elements in this tree.
     * @return {number} The number of elements in this tree.
     */
    buckets.BSTree.prototype.size = function() {
        return this.nElements;
    };

    /**
     * Returns true if this tree contains the specified element.
     * @param {Object} element Element to search for.
     * @return {boolean} True if this tree contains the specified element,
     * false otherwise.
     */
    buckets.BSTree.prototype.contains = function(element) {
        if (buckets.isUndefined(element)) {
            return false;
        }
        return this.searchNode(this.root, element) !== null;
    };

    /**
     * Removes the specified element from this tree if it is present.
     * @return {boolean} True if this tree contained the specified element.
     */
    buckets.BSTree.prototype.remove = function(element) {
        var node = this.searchNode(this.root, element);
        if (node === null) {
            return false;
        }
        this.removeNode(node);
        this.nElements--;
        return true;
    };

    /**
     * Executes the provided function once per element present in this tree in in-order.
     * @param {function(Object):*} Callback function to execute, it is invoked with one
     * argument: the element value, to break the iteration you can optionally return false inside the calback.
     */
    buckets.BSTree.prototype.inorderTraversal = function(callback) {
        this.inorderTraversalAux(this.root, callback, {
            stop: false
        });
    };

    /**
     * Executes the provided function once per element present in this tree in pre-order.
     * @param {function(Object):*} callback function to execute, it is invoked with one
     * argument: the element value, to break the iteration you can optionally return false inside the calback.
     */
    buckets.BSTree.prototype.preorderTraversal = function(callback) {
        this.preorderTraversalAux(this.root, callback, {
            stop: false
        });
    };

    /**
     * Executes the provided function once per element present in this tree in post-order.
     * @param {function(Object):*} Callback function to execute, it is invoked with one
     * argument: the element value, to break the iteration you can optionally return false.
     */
    buckets.BSTree.prototype.postorderTraversal = function(callback) {
        this.postorderTraversalAux(this.root, callback, {
            stop: false
        });
    };

    /**
     * Executes the provided function once per element present in this tree in
     * level-order.
     * @param {function(Object):*} Callback function to execute, it is invoked with one
     * argument: the element value, to break the iteration you can optionally return false inside the calback..
     */
    buckets.BSTree.prototype.levelTraversal = function(callback) {
        this.levelTraversalAux(this.root, callback);
    };

    /**
     * Returns the minimum element of this tree.
     * @return {*} The minimum element of this tree or undefined if this tree is
     * is empty.
     */
    buckets.BSTree.prototype.minimum = function() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.minimumAux(this.root).element;
    };

    /**
     * Returns the maximum element of this tree.
     * @return {*} The maximum element of this tree or undefined if this tree is
     * is empty.
     */
    buckets.BSTree.prototype.maximum = function() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.maximumAux(this.root).element;
    };

    /**
     * Executes the provided function once per element present in this tree in in-order.
     * Equivalent to inorderTraversal.
     * @param {function(Object):*} Callback function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false.
     */
    buckets.BSTree.prototype.forEach = function(callback) {
        this.inorderTraversal(callback);
    };

    /**
     * Returns an array containing all of the elements in this tree in in-order.
     * @return {Array} An array containing all of the elements in this tree in in-order.
     */
    buckets.BSTree.prototype.toArray = function() {
        var array = [];
        this.inorderTraversal(function(element) {
            array.push(element);
        });
        return array;
    };

    /**
     * Returns the height of this tree.
     * @return {number} The height of this tree or -1 if is empty.
     */
    buckets.BSTree.prototype.height = function() {
        return this.heightAux(this.root);
    };

    /**
     * @private
     */
    buckets.BSTree.prototype.searchNode = function(node, element) {
        var cmp = null;
        while (node !== null && cmp !== 0) {
            cmp = this.compare(element, node.element);
            if (cmp < 0) {
                node = node.leftCh;
            } else if (cmp > 0) {
                node = node.rightCh;
            }
        }
        return node;
    };


    /**
     * @private
     */
    buckets.BSTree.prototype.transplant = function(n1, n2) {
        if (n1.parent === null) {
            this.root = n2;
        } else if (n1 === n1.parent.leftCh) {
            n1.parent.leftCh = n2;
        } else {
            n1.parent.rightCh = n2;
        }
        if (n2 !== null) {
            n2.parent = n1.parent;
        }
    };


    /**
     * @private
     */
    buckets.BSTree.prototype.removeNode = function(node) {
        if (node.leftCh === null) {
            this.transplant(node, node.rightCh);
        } else if (node.rightCh === null) {
            this.transplant(node, node.leftCh);
        } else {
            var y = this.minimumAux(node.rightCh);
            if (y.parent !== node) {
                this.transplant(y, y.rightCh);
                y.rightCh = node.rightCh;
                y.rightCh.parent = y;
            }
            this.transplant(node, y);
            y.leftCh = node.leftCh;
            y.leftCh.parent = y;
        }
    };
    /**
     * @private
     */
    buckets.BSTree.prototype.inorderTraversalAux = function(node, callback, signal) {
        if (node === null || signal.stop) {
            return;
        }
        this.inorderTraversalAux(node.leftCh, callback, signal);
        if (signal.stop) {
            return;
        }
        signal.stop = callback(node.element) === false;
        if (signal.stop) {
            return;
        }
        this.inorderTraversalAux(node.rightCh, callback, signal);
    };

    /**
     * @private
     */
    buckets.BSTree.prototype.levelTraversalAux = function(node, callback) {
        var queue = new buckets.Queue();
        if (node !== null) {
            queue.enqueue(node);
        }
        while (!queue.isEmpty()) {
            node = queue.dequeue();
            if (callback(node.element) === false) {
                return;
            }
            if (node.leftCh !== null) {
                queue.enqueue(node.leftCh);
            }
            if (node.rightCh !== null) {
                queue.enqueue(node.rightCh);
            }
        }
    };

    /**
     * @private
     */
    buckets.BSTree.prototype.preorderTraversalAux = function(node, callback, signal) {
        if (node === null || signal.stop) {
            return;
        }
        signal.stop = callback(node.element) === false;
        if (signal.stop) {
            return;
        }
        this.preorderTraversalAux(node.leftCh, callback, signal);
        if (signal.stop) {
            return;
        }
        this.preorderTraversalAux(node.rightCh, callback, signal);
    };
    /**
     * @private
     */
    buckets.BSTree.prototype.postorderTraversalAux = function(node, callback, signal) {
        if (node === null || signal.stop) {
            return;
        }
        this.postorderTraversalAux(node.leftCh, callback, signal);
        if (signal.stop) {
            return;
        }
        this.postorderTraversalAux(node.rightCh, callback, signal);
        if (signal.stop) {
            return;
        }
        signal.stop = callback(node.element) === false;
    };

    /**
     * @private
     */
    buckets.BSTree.prototype.minimumAux = function(node) {
        while (node.leftCh !== null) {
            node = node.leftCh;
        }
        return node;
    };

    /**
     * @private
     */
    buckets.BSTree.prototype.maximumAux = function(node) {
        while (node.rightCh !== null) {
            node = node.rightCh;
        }
        return node;
    };

    /**
     * @private
     */
    buckets.BSTree.prototype.successorNode = function(node) {
        if (node.rightCh !== null) {
            return this.minimumAux(node.rightCh);
        }
        var successor = node.parent;
        while (successor !== null && node === successor.rightCh) {
            node = successor;
            successor = node.parent;
        }
        return successor;
    };

    /**
     * @private
     */
    buckets.BSTree.prototype.heightAux = function(node) {
        if (node === null) {
            return -1;
        }
        return Math.max(this.heightAux(node.leftCh), this.heightAux(node.rightCh)) + 1;
    };

    /*
     * @private
     */
    buckets.BSTree.prototype.insertNode = function(node) {

        var parent = null;
        var position = this.root;
        var cmp = null;
        while (position !== null) {
            cmp = this.compare(node.element, position.element);
            if (cmp === 0) {
                return null;
            } else if (cmp < 0) {
                parent = position;
                position = position.leftCh;
            } else {
                parent = position;
                position = position.rightCh;
            }
        }
        node.parent = parent;
        if (parent === null) {
            // tree is empty
            this.root = node;
        } else if (this.compare(node.element, parent.element) < 0) {
            parent.leftCh = node;
        } else {
            parent.rightCh = node;
        }
        return node;
    };

    /**
     * @private
     */
    buckets.BSTree.prototype.createNode = function(element) {
        return {
            element: element,
            leftCh: null,
            rightCh: null,
            parent: null
        };
    };

    // Make it a NodeJS module.
    if (typeof module !== 'undefined') {
        module.exports = buckets;
    }
}());

;
