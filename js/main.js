;(function($) {

	// анимация навигации по лендингу
	$('.header__main-menu .menu__link').on('click', function(e) {
		var hash = e.target.hash;
		$('html, body').animate({
			scrollTop: $(hash).offset().top
		}, 700);
		e.preventDefault();
	});


	// аккордеон для подрядчиков на лендинге
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


	// компонент для табов
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


	// редактируемые поля
	;(function() {

		var $editButtons = $('[data-edit-target]');
		if (!$editButtons.length) return;

		$editButtons.closest('form').on('submit', function(e) {
			e.preventDefault();
		});

		$editButtons.each(function(index, editBtn) {
			var $trigger = $(editBtn);
			var isEditBlocked = editBtn.hasAttribute('data-edit-blocked');
			var $triggerContent = $trigger.find('.edit-trigger__value');
			var selector = $trigger.attr('data-edit-target');
			var $fields = $('[data-edit-selector=' + selector + ']');
			var $inputs = $fields.find('input');

			// изначально скрываем связанные поля
			$fields.hide();



			$trigger.on('click', function(e) {
				$trigger.hide();
				$fields.show();
				setTimeout(function() {
					$inputs.first().focus();
					$inputs.on('keyup', editEndHandler);
				}, 100);
			});

			function editEndHandler(e) {
				if (e.keyCode !== 13) return;
				if (!isEditBlocked) {
					$triggerContent.text(e.target.value);
				};
				$fields.hide();
				$trigger.show();
				$inputs.off('keyup', editEndHandler);
			}

		});


		// $(document).on('keyup', function(e) {
		// 	if (e.keyCode !== 13 && e.type === 'keyup') return;
		// 	if ($(e.target).closest('.editable-field__trigger').length > 0 && e.type == 'focusout') return;

		// 	var $target = $(e.target).closest('.editable-field input');
		// 	if (!$target.length) return;
		// 	var $field = $target.closest('.editable-field');
		// 	if ($field.length > 0) {
		// 		$field.removeClass('editable-field_is-edit');
		// 		$field.find('.editable-field__value').text($target.val());
		// 		$field.closest('form').off('submit', stopForm);
		// 	}
		// });
	})();


	// подсветка выбранного элемента в списке сообщений
	;(function() {
		var $list = $('.contractors-mail-list');
		if (!$list.length) return;

		$list.on('change', function(e) {
			var target = e.target;
			var action = target.checked ? 'add' : 'remove';
			$(target).closest('.message-preview')[action + 'Class']('message-preview_checked');
		})
	})();


	// подсветка выбранного элемента в списке предложений
	;(function() {
		var $list = $('.proposal-list');
		if (!$list.length) return;

		$list.on('change', function(e) {
			var target = e.target;
			var action = target.checked ? 'add' : 'remove';
			$(target).closest('.proposal')[action + 'Class']('proposal_checked');
		})
	})();


	// соврачивание блоков в таблицах
	(function() {
		if (!$('.data-grid__toggle-btn').length) return;

		$(document).on('click', '.data-grid__toggle-btn', function(e) {
			$(this)
				.closest('.data-grid__item')
				.toggleClass('data-grid__item_close');
		});
	})();


	// слайдер для галереи
	(function() {
		function GallerySlider(rootElement) {
			var self = this;
			this.root = rootElement;
			this.$root = $(this.root);
			this.$track = this.$root.find('.profile-image-gallery__track');
			this.$slides = this.$root.find('.profile-image-gallery__item');
			this.len = this.$slides.length;
			this.$nav = this.$root.find('.media-nav');
			this.$navItems = this.$nav.find('.media-nav__item');

			['goTo', 'onNavClickHandler', 'onResizeHandler'].forEach(function(method) {
				self[method] = self[method].bind(self);
			});

			this.mq = window.matchMedia(GallerySlider.breakPoint);
			this.mq.addListener(this.onResizeHandler);

			this.onResizeHandler();
		}

		GallerySlider.prototype.init = function() {
			this.$root.removeClass('profile-image-gallery_fallback');
			this.setSize();
			this.bindEvents();
		};

		GallerySlider.prototype.destroy = function() {
			this.$root.addClass('profile-image-gallery_fallback');
			this.unSetSize();
			this.unBindEvents();
		}

		GallerySlider.prototype.setSize = function() {
			this.$track.css('width', this.len * 100 + '%');
			this.$slides.css('width', 100 / this.len + '%');
		};

		GallerySlider.prototype.unSetSize = function() {
			this.$track.get(0).style = '';
			this.$slides.css('width', '');
		};

		GallerySlider.prototype.bindEvents = function() {
			var self = this;
			this.$nav.on('click', this.onNavClickHandler);
		};

		GallerySlider.prototype.unBindEvents = function() {
			var self = this;
			this.$nav.off('click', this.onNavClickHandler);
		};

		GallerySlider.prototype.onNavClickHandler = function(e) {
			var self = this;
			var $item = $(e.target).closest('.media-nav__item');
			if (!$item.length) return;
			var index = $item.index();

			self.goTo(index);
			self.$navItems.removeClass('media-nav__item_active');
			$item.addClass('media-nav__item_active');
		};

		GallerySlider.prototype.goTo = function(index) {
			this.$track.css({
				'-ms-transform': 'translateX(' + (-index / this.len * 100)+ '%)',
				    'transform': 'translateX(' + (-index / this.len * 100)+ '%)'
			})
		};

		GallerySlider.prototype.onResizeHandler = function() {
			var self = this;
			var method = self.mq.matches ? 'destroy' : 'init';
			typeof self[method] === 'function' && self[method]();
		};

		GallerySlider.breakPoint = '(max-width: 768px)';


		var galleryRoot = document.querySelector('.profile-image-gallery');
		if (galleryRoot) {
			new GallerySlider(galleryRoot);
		}
	})();


	// числовые поля ввода
	(function() {
		var step = 1;
		var min = 0;

		function normalize(value, step) {
			var value = parseInt(value || 0) + step;
			return value < min ? min : value;
		}

		$(document).on('click', '.number-spinner__btn', function(e) {
			var $btn = $(this);
			var sign = $btn.hasClass('number-spinner__btn_inc') ? 1 : -1;
			var $input = $btn.closest('.number-spinner').find('input');
			$input.val(normalize($input.val(), sign * step));
		})
	})()

})(jQuery);
