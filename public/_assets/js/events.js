/* Vairables */
var Form,
    Element;

$(function () {

    /* All Element Click */
    function ClickElement(object) {

        $('*').on('click', function (e) {
            if (!$(e.target).is(object.child) && !$(e.target).is(object.child + " *") && !$(e.target).is(object.parent + " " + object.button) && !$(e.target).is(object.parent + " " + object.button + " *")) {
                switch (object.type) {
                    case "fade":
                        $(object.child).fadeOut(100);
                        break;

                    case "hide":
                        $(object.child).hide();
                        break;
                }
                $(object.button).attr('data-terms', 'open');
                $('.form-selectbox').find('.options').scrollTop(0);
            }
        });

    }

    /* All Element Click End */

    /* [ Form Object ] */
    Form = {

        /* Variables */
        Variables: {
            Parent: '.js-parent',
            Child: '.js-child',
            Button: '.js-button',
            TabParent: '.js-tab-parent',
            TabChild: '.js-tab-child',
        },
        /* Variables End */

        /* Select Box Open */
        SelectBoxOpen: function (object) {
            var terms = object.attr('data-terms');

            $("body " + Form.Variables.Button).attr('data-terms', 'open');
            $("body " + Form.Variables.Parent + " " + Form.Variables.Child).fadeOut(100);

            if (terms == 'open') {
                object.attr('data-terms', 'close');
                object.parents(Form.Variables.Parent).find(Form.Variables.Child).fadeIn(100);
                var top = object.parents('.form-selectbox').find('.option.active').offset().top;
                var windowHeight = object.parents('.form-selectbox').offset().top;
                var scroll  =   top-windowHeight-90;
                object.parents('.form-selectbox').find('.options').scrollTop(scroll);
            }
            else if (terms == 'close') {
                object.attr('data-terms', 'open');
                object.parents(Form.Variables.Parent).find(Form.Variables.Child).hide();
                object.parents('.form-selectbox').find('.options').scrollTop(0);
            }


            ClickElement({
                parent: Form.Variables.Parent,
                child: Form.Variables.Child,
                button: Form.Variables.Button,
                type: 'fade'
            });

        },
        SelectBoxSelected: function (object) {
            var text = object.text(),
                val = object.data('value');
            object.parents(Form.Variables.Parent).find(Form.Variables.Button).attr('data-terms', 'open');
            object.parents(Form.Variables.Parent).find(Form.Variables.Button + " .text").text(text);
            object.parents(Form.Variables.Parent).find(Form.Variables.Button + " .text").attr('data-value', val);
            object.parents(Form.Variables.Parent).find(Form.Variables.Child).fadeOut(100);
        },
        /* Select Box End */
    };
    /* [ Form Object End ] */

    /* [ Element Object ] */
    Element = {

        /* Main Tab */
        MainTab: function (object) {
            var index = object.index(),
                type = object.data('type');
            tabBlock = '.tab-block';

            if (type == 'my-games') {
                $('#home-page-date').hide();
            }
            else if (type == 'live') {
                $('.app-match-live-games .soccer-list .list').removeClass('live');
            }
            else {
                $('#home-page-date').show();
            }

            object.parents(Form.Variables.TabParent).find(Form.Variables.TabChild).removeClass('active');
            object.addClass('active');
            object.parents(Form.Variables.TabParent).find(tabBlock).hide();
            object.parents(Form.Variables.TabParent).find(tabBlock + ":eq(" + index + ")").show();
        },
        /* Main Tab End */

        /* Dropdown */
        Dropdown: function (object) {
            var parent = '.dropdown-block',
                content = '.dropdown-content',
                link = '.dropdown-link',
                terms = object.attr('data-terms');

            $(parent + " " + content).slideUp(200);
            $(parent + " " + link).attr('data-terms', 'open');

            if (terms == 'open') {
                object.attr('data-terms', 'close');
                object.parents(parent).find(content).stop().slideDown(200);
                object.find('.icon').removeClass('icon-arrow-right');
                object.find('.icon').addClass('icon-arrow-bottom');
            }
            else if (terms == 'close') {
                object.attr('data-terms', 'open');
                object.parents(parent).find(content).stop().slideUp(200);
                object.find('.icon').removeClass('icon-arrow-bottom');
                object.find('.icon').addClass('icon-arrow-right');
            }
        },
        /* Dropdown End */

        /* Match Info Tab */
        MatchInfoTab: function (object) {
            var parent = '.js-match-info-tab',
                content = '.js-match-info-child',
                link = '.js-match-info-link',
                index = object.index();

            object.parents(parent).find(link).removeClass('active');
            object.addClass('active');
            object.parents(parent).find(content).hide();
            object.parents(parent).find(content + ":eq(" + index + ")").show();


        },
        /* Match Info Tab End */

        /* Favorite */
        Favorite: function (object, e) {
            var value = object.attr('data-terms'),
                type = object.data('type'),
                id = object.data('id');
            mygames = object.data('mygames') ? object.data('mygames') : 'no';
            parent = '.js-element',
                link = '.js-favorite';

            if (value == 1) {
                object.attr('data-terms', 0);
                object.addClass('active');
                object.find('.icon').removeClass('icon-star');
                object.find('.icon').addClass('icon-star');
            }
            else if (value == 0) {
                object.attr('data-terms', 1);
                object.removeClass('active');
                if (mygames == 'no') {
                    object.find('.icon').removeClass('icon-star');
                    object.find('.icon').addClass('icon-star');
                }
            }

            Events.Favorite({
                event: e,
                element: object,
                elementType: type,
                elementId: id,
                elementTerms: value,
                elementMyGames: mygames
            });

        },
        /* Favorite End */

        /* Search */
        SearchModal: function () {
            Help.Modal('show');
            $('body .js-modal-block .block-container').html('');
            $('body .js-modal-block .block-container').load("/" + PathDir + "/_parts/searchModal.html", function () {
                Help.Loading('hide');
                $('.search-modal')
                    .find('.head')
                    .find('.input')
                    .find('input')
                    .focus();
                $('.search-modal')
                    .find('.head')
                    .find('.input')
                    .find('input')
                    .attr('placeholder',Language[Help.LangName()].txtSearchPlaceholder);
            });
        },
        /* Search End */

        /* Mobile Calendar */
        MobileCalendar: function (object) {
            $('.calendar-modal').fadeIn(200);

            $('.calendar-modal').click(function (e) {
                if (!$(e.target).is('.calendar-modal *') &&
                    !$(e.target).is('.calendar-modal .ui-widget-header a') &&
                    !$(e.target).is('.calendar-modal .ui-widget-header a *') &&
                    !$(e.target).is('.ui-widget-header .ui-icon')
                ) {
                    console.log($(e.target));
                    $(this).fadeOut(200);
                }
            });
        },
        /* Mobile Calendar End */

        /* Mobile Menu */
        MobileMenu: function (object, swipe) {
            object  =   object ? object : '';
            var terms   =   swipe ? swipe : object.data('terms');

            if ( terms == 'open' ) {
                $('body').addClass('overflow-hidden');
                $('#menu-block').css('left','0');
            }
            else if ( terms == 'close' ) {
                $('body').removeClass('overflow-hidden');
                $('#menu-block').css('left','-120vw');
            }

        },
        /* Mobile Menu End */

        /* Match Live View */
        MatchLiveView: function (object) {
            var terms   =   object.attr('data-terms');
            if ( terms == 'open' ) {
                $('#_match-detalis-block').hide();
                $('#_match-live-block').fadeIn(100);
            }
            else if ( terms == 'close' ) {
                $('#_match-live-block').hide();
                $('#_match-detalis-block').fadeIn(100);
            }
        },
        /* Match Live View End */

    }
    /* [ Element Object End ] */

});