
!function (jQuery) {

	"use strict"; // jshint ;_;

	var Modal = function (element, options) {
		this.options = options;
		this.$element = jQuery(element);
		this.$element.delegate('[data-dismiss="modal"]', 'click.dismiss.modal', jQuery.proxy(this.hide, this));
	};

	Modal.prototype = {
		constructor: Modal,

		toggle: function () {
			return this[!this.isShown ? 'show' : 'hide']();
		},

		show: function () {
			var e = jQuery.Event('show');
			this.$element.trigger(e);

			if (this.isShown || e.isDefaultPrevented()) {
				return;
			}

			this.isShown = true;

			this.escape();

			this.$backdrop = jQuery('<div class="overlay-container" />');
			jQuery("body").append(this.$backdrop[0]);
			this.$backdrop.click(jQuery.proxy(this.hide, this));

			if (!this.$element.parent().length) {
				this.$element.appendTo(document.body); //don't move modals dom position
			}

			this.$element.center().show();
			this.$element.focus();
			this.enforceFocus();
			this.$element.trigger('shown');

		},

		hide: function (e) {
			e && e.preventDefault();
			e = jQuery.Event('hide');
			this.$element.trigger(e);

			if (!this.isShown || e.isDefaultPrevented()) return;

			this.isShown = false;

			//jQuery('body').removeClass('modal-open');

			this.escape();

			jQuery(document).unbind('focusin.modal');

			//this.$element.removeClass('in').attr('aria-hidden', true);

			this.$element.hide().trigger('hidden');

			this.removeBackdrop();
		},

		enforceFocus: function () {
			var that = this;
			jQuery(document).bind('focusin', function (e) {
				if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
					that.$element.focus();
				}
			});
		},

		escape: function () {
			var that = this;
			if (this.isShown && this.options.keyboard) {
				this.$element.bind('keyup.dismiss.modal', function (e) {
					e.which == 27 && that.hide();
				});
			}
			else if (!this.isShown) {
				this.$element.unbind('keyup.dismiss.modal');
			}
		},

		removeBackdrop: function () {
			this.$backdrop.remove();
			this.$backdrop = null;
		}

	};

	jQuery.fn.modal = function (option) {
		return this.each(function () {
			var $this = jQuery(this);
			var data = $this.data('modal');
			var options = jQuery.extend({}, jQuery.fn.modal.defaults, $this.data(), typeof option == 'object' && option);
			if (!data) $this.data('modal', (data = new Modal(this, options)));
			if (typeof option == 'string') data[option]();
			else if (options.show) data.show();
		});
	};

	jQuery.fn.modal.defaults = { backdrop: true, keyboard: true, show: true };

	jQuery.fn.modal.Constructor = Modal;


	/* MODAL DATA-API
	* ============== */
	/*
	jQuery(function () {
	jQuery('body').on('click.modal.data-api', '[data-toggle="modal"]', function ( e ) {
	var $this = jQuery(this)
	, href = $this.attr('href')
	, $target = jQuery($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
	, option = $target.data('modal') ? 'toggle' : jQuery.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

	e.preventDefault()

	$target
	.modal(option)
	.one('hide', function () {
	$this.focus()
	})
	})
	})
	*/
} (window.jQuery);
