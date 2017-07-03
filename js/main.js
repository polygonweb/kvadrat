;(function($) {

	$('.header__main-menu .menu__link').on('click', function(e) {
		var hash = e.target.hash;
		$('html, body').animate({
			scrollTop: $(hash).offset().top
		}, 700);
		e.preventDefault();
	});


	$('.contractor').addClass('contractor_state_close');

	$(document).on('click', '.contractor__btn', function(e) {
		var $contractor = $(e.target).closest('.contractor');
		if ($contractor.hasClass('contractor_state_close')) {
			$contractor
				.find('.contractor__body')
				.slideDown(function() {
					$contractor.removeClass('contractor_state_close')
				});
		} else {
			$contractor
				.find('.contractor__body')
				.slideUp(function() {
					$contractor.addClass('contractor_state_close')
				});
		}
	});


	function Tabs(rootElement) {
		this.DOM = {};
		this.DOM.rootElement = rootElement;
		this.DOM.$rootElement = $(rootElement);
		this.DOM.$nav = this.DOM.$rootElement.find('.tabs-nav').first();
		this.DOM.$links = this.DOM.$nav.find('.tabs-nav__item');
		this.DOM.$panes = this.DOM.$rootElement.find('.tabs-content__pane');

		this.bindEvents();
	}

	Tabs.prototype.bindEvents = function() {
		var self = this;
		this.setActiveTab = this.setActiveTab.bind(this);
		this.DOM.$nav.on('click', function(e) {
			var $target = $(e.target).closest('.tabs-nav__item');
			var index = self.DOM.$links.index($target);
			self.setActiveTab(index);
			e.preventDefault();
		});
	}

	Tabs.prototype.setActiveTab = function(index) {
		this.DOM.$links
			.eq(index)
			.addClass(Tabs.activeLinkClass)
			.siblings()
			.removeClass(Tabs.activeLinkClass);
		this.DOM.$panes
			.eq(index)
			.addClass(Tabs.activePaneClass)
			.siblings()
			.removeClass(Tabs.activePaneClass);
	}

	Tabs.activeLinkClass = 'tabs-nav__item_active';
	Tabs.activePaneClass = 'tabs-content__pane_active';

	Array.prototype.slice.call(document.querySelectorAll('.tabs'))
		.forEach(function(elem) {
			new Tabs(elem);
		})


	var contactsForm = document.getElementById('contacts-form');
	var formMessage = document.getElementById('form-message');

	$(contactsForm).on('submit', function(e) {
		$(formMessage).addClass('modal_show');
		e.preventDefault();
	});

	$('.modal').on('click', function(e) {
		var modal = this;
		var dialog = modal.querySelector('.modal__dialog');
		var target = e.target;
		if (!dialog.contains(target)) {
			$(modal).removeClass('modal_show');
		}
	});

	$('.modal__close').on('click', function(e) {
		$(e.target)
			.closest('.modal')
			.removeClass('modal_show');
	});
})(jQuery);