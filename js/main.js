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

})(jQuery);
