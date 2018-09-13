$ ( function () {

    /* Scrollbar */
    $ ( "body" ).ready ( function () {
        $ ( '.scrollContent' ).scrollbar ();
    } )
    $ ( 'body' ).on ( 'mouseover', '.scrollContent', function () {
        $ ( '.scrollContent' ).scrollbar ();
    } );
    /* Scrollbar End */

    $ ( 'body' ).on ( 'click', 'a', function () {
        var load = $ ( this ).data ( 'load' ) ? $ ( this ).data ( 'load' ) : 'yes';
        if ( load == 'yes' ) {
            Help.Loading ( 'show' );
        }
    } );

    /* Calendar */
    $ ( "#datepicker" ).datepicker ( {
        showOn: "button",
        buttonImage: "/style/path/img/calendar.svg",
        buttonImageOnly: true,
        maxDate: Help.Date ( 7 ),
        onSelect: function ( dateStr ) {
            Events.MatchDatePost ( {
                date: dateStr
            } );
            $ ( '.calendar-modal' ).hide ();
            $ ( '#body-cover' ).fadeOut ( 100 );
        }
    } );
    $ ( '.ui-datepicker-trigger' ).click ( function () {
        $ ( '#body-cover' ).fadeIn ( 100 );
    } );
    $ ( '#body-cover' ).click ( function () {
        $ ( this ).fadeOut ( 100 );
    } );
    /* Calendar End */

    /* Current time */
    $ ( 'body' ).on ( 'click', '.js-current-time .option', function () {
        var object = $ ( this );
        var val = object.data ( 'value' );
        localStorage.setItem ( 'TimeZone', val );
        localStorage.setItem ( 'TimeZone_change', 1 );
        Help.Loading ( 'show' );
        window.location.reload ();
    } );
    /* Current time End */

    /* Day Calendar */
    $ ( 'body' ).on ( 'click', '.js-day-calendar', function () {
        var object = $ ( this );
        var type = object.data ( 'type' );
        var day = parseInt ( object.parents ( '.date' ).attr ( 'data-num' ) );
        var editDay = '';
        if ( type == 'right' ) {
            day = day + 1;
        }
        else if ( type == 'left' ) {
            day = day - 1;
        }
        object.parents ( '.date' ).attr ( 'data-num', day );
        day = day.toString ();

        Events.MatchDatePost ( {
            day: day
        } );
    } );
    /* Day Calendar End */

    /* Mobile Calendar */
    $ ( 'body' ).on ( 'click', '.js-mobile-calendar', function () {
        var object = $ ( this );
        Element.MobileCalendar ( object );
    } );
    /* Mobile Calendar End */

    /* Modal Close */
    $ ( 'body' ).on ( 'click', '.js-modal-block', function ( e ) {
        if ( !$ ( e.target ).is ( '.block-container' ) && !$ ( e.target ).is ( '.block-container *' ) ) {
            Help.Modal ( 'hide' );
        }
    } );
    $ ( 'body' ).on ( 'click', '.js-modal-close', function ( e ) {
        Help.Modal ( 'hide' );
    } );
    /* Modal Close End */

    /* Form - Select Box */
    $ ( 'body' ).on ( 'click', '.form-selectbox .select .default', function () {
        var object = $ ( this );


        Form.SelectBoxOpen ( object );

    } );
    $ ( 'body' ).on ( 'click', '.form-selectbox .select .option', function () {
        var object = $ ( this );
        Form.SelectBoxSelected ( object );
    } );
    /* Form - Select Box End */

    /* Main Tab */
    $ ( 'body' ).on ( 'click', '.js-tab-parent .tab-link', function () {
        var object = $ ( this );
        Element.MainTab ( object );
    } );
    /* Main Tab End */

    /* Match Info Tab */
    $ ( 'body' ).on ( 'click', '.js-match-info-link', function () {
        var object = $ ( this );
        Element.MatchInfoTab ( object );
    } );
    /* Match Info Tab End */

    /* Dropdown Tab */
    $ ( 'body' ).on ( 'click', '.dropdown-block .dropdown-link', function () {
        var object = $ ( this );
        Element.Dropdown ( object );
    } );
    /* Dropdown Tab End */

    /* Dropdown Tab */
    $ ( "body" ).on ( 'click', '.js-element .js-favorite', function ( e ) {
        var object = $ ( this );
        Element.Favorite ( object, e );
    } );
    /* Dropdown Tab End */

    /* Portal Selection */
    $ ( 'body' ).on ( 'click', '.js-portal-event', function () {
        var object = $ ( this );
        Events.PortalSelect ( object );
    } );
    /* Portal Selection End */

    /* Language Change */
    $ ( 'body' ).on ( 'click', '.js-laguage .js-language-event', function () {
        var object = $ ( this );
        Events.LanguageChange ( object );
    } );
    /* Language Change End */

    /* Load More */
    $ ( 'body' ).on ( 'click', '.js-load-more', function () {
        var object = $ ( this );
        Events.LoadMore ( object );
    } );
    /* Load More End */

    /* Search Modal */
    $ ( 'body' ).on ( 'click', '.js-search-modal', function () {
        var object = $ ( this );
        Element.SearchModal ( object );
        $ ( 'body' ).keyup ( function ( e ) {
            if ( e.which == 27 ) {
                Help.Modal ( 'hide' );
            }
        } );
    } );
    /* Search Modal End */

    /* Search Post */
    $ ( 'body' ).on ( 'keyup', '.js-search-post', function ( e ) {
        var object = $ ( this );
        if ( e.which == 13 ) {
            Events.SearchPost ( object );
        }
    } );
    /* Search Post End */

    /* Login Modal */
    $ ( 'body' ).on ( 'click', '.js-login-modal', function () {
        var object = $ ( this );
        Events.LoginModal ();
        $ ( '#menu-block' ).css ( 'left', '-120vw' );
        $ ( 'body' ).keyup ( function ( e ) {
            if ( e.which == 27 ) {
                Help.Modal ( 'hide' );
            }
        } );
    } );
    /* Login Modal End */

    /* Match Link */
    $ ( 'body' ).on ( 'click', '.js-match-link', function ( e ) {
        var object = $ ( this );
        e.preventDefault ();
        Request.AppData ( function ( data ) {
            var params = data.portals[ 0 ].params;
            var link = object.attr ( 'href' );
            if ( params.restrict_to_login == 1 && params.login_over == 'pars' && !Help.Token () ) {
                Help.Loading ( 'show' );
                var blk = $ ( '<div data-type="' + params.login_over + '"></div>' );
                Events.Login ( blk );
            }
            else if ( params.restrict_to_login == 1 && params.login_over == 'own' && !Help.Token () ) {
                Events.LoginModal ();
            }
            else {
                window.location.href = link;
            }
        } );
    } );
    /* Match Link End */

    /* Login Method */
    $ ( 'body' ).on ( 'click', '.js-login-post', function () {
        var object = $ ( this );
        Events.Login ( object );
    } );
    /* Login Method End */

    /* Login Portal */
    $ ( 'body' ).on ( 'click', '.js-login-portal', function () {
        var object = $ ( this );
        Events.LoginPortal ( object );
    } );
    /* Login Portal End */

    /* Logout */
    $ ( 'body' ).on ( 'click', '.js-user-logout', function () {
        var object = $ ( this );
        Events.Logout ( object );
    } );
    /* Logout End */

    /* Images */
    $ ( 'body' ).on ( 'change', '.js-upload-images', function ( e ) {
        var object = $ ( this );
        Events.UploadImages ( e, object );
    } );
    /* Images End */
    /* Images End */

    /* Form End */
    $ ( 'body' ).on ( 'submit', '.js-form-submit', function ( e ) {
        e.preventDefault ();
        var object = $ ( this );
        Events.Form ( object );
    } );
    /* Form End */

    /* Mobile Menu */
    if ( DV == 'mobile' ) {
        $ ( 'body' ).on ( 'click', '.js-mobile-menu', function () {
            var object = $ ( this );
            Element.MobileMenu ( object );
        } );
        // $('#container')
        //     .touch({
        //         trackDocument: true,
        //         trackDocumentNormalize: true,
        //         preventDefault: {
        //             drag: false,
        //             swipe: true
        //         }
        //     })
        //     .on('swipeRight', function (e, o) {
        //         Element.MobileMenu('', 'open');
        //     })
        //     .on('swipeLeft', function (e, o) {
        //         Element.MobileMenu('', 'close');
        //     });
        $ ( 'body' ).on ( 'click', '.cover-bg', function () {
            Element.MobileMenu ( '', 'close' );
        } );
    }
    /* Mobile Menu End */

    /* Mobile Language */
    $ ( 'body' ).on ( 'click', '.js-mobile-language', function () {
        var object = $ ( this );
        $ ( '#menu-block' ).css ( 'left', '-120vw' );
        Events.MobileLanguage ( object );
    } );
    /* Mobile Language End */

    /* Mobile Settings */
    $ ( 'body' ).on ( 'click', '.js-mobile-settings', function () {
        var object = $ ( this );
        $ ( '#menu-block' ).css ( 'left', '-120vw' );
        Events.MobileSettings ( object );
    } );
    /* Mobile Settings End */

    /* Mobile Current Time */
    $ ( 'body' ).on ( 'click', '.js-mobile-current', function () {
        var object = $ ( this );
        $ ( '#menu-block' ).css ( 'left', '-120vw' );
        Events.MobileCurrentTime ( object );
    } );
    /* Mobile Current Time End */

    /* Active Element */
    $ ( 'body' ).on ( 'click', '.js-element-active', function () {
        var object = $ ( this );
        object.parents ( '.js-element' ).find ( '.js-element-active' ).removeClass ( 'active' );
        object.addClass ( 'active' );
    } );
    /* Active Element End */

    /* Prediction Form */
    $ ( 'body' ).on ( 'click', '.js-predition-button', function () {
        var object = $ ( this );
        Events.PredictionForm ( object );
    } );
    /* Prediction Form End */

    /* Prediction Remove */
    $ ( 'body' ).on ( 'click', '.js-pr-remove', function () {
        var object = $ ( this );
        Events.PredictionRemove ( object );
    } );
    /* Prediction Remove End */

    /* Match Live View */
    $ ( 'body' ).on ( 'click', '.js-match-live-view', function () {
        var object = $ ( this );
        Element.MatchLiveView ( object );
    } );
    /* Match Live View End */

    /* Predict Add Form */
    Help.event ( {
        event: 'click',
        dom: 'predictAddForm',
        callback: event => {
            const token = Help.Token ();
            const matchId = Help.Url ( 3 );
            const value = $ ( '[data-input=i1]' ).val () + '-' + $ ( '[data-input=i2]' ).val ();
            const timeZone = Help.TimeZone ();
            const dataValue = { token: token, matchId: matchId, predictionValue: value };

            Request.getPredictionBonus ( {
                value: dataValue,
                callback: res => {
                    console.log ( res );
                    Help.notfication ( {
                        terms: 'show',
                        width: '400px',
                        headTxt: Language[ Help.LangName () ][ 'txtPredictAddNotficationHead' ],
                        contentTxt: Language[ Help.LangName () ][ 'txtPredictAddNotficationText' ].replace('{point}', res.point).replace('{bonus}', res.bonus),
                        cancelButtonTxt: Language[ Help.LangName () ][ 'txtCancel' ] ,
                        confirmButtonTxt: Language[ Help.LangName () ][ 'txtConfirm' ],
                        confirmButtonAttr: {'data-event':'predictAdd', 'data-value': value},
                    } );
                }
            } );


        }
    } );

    /* Prediction Add */
    Help.event ( {
        event: 'click',
        dom: 'predictAdd',
        callback: event => {
            const value = {token: Help.Token(), matchId: Help.Url(3), predictionValue: event.attr('data-value')}
            Request.setPrediction({
                value: value,
                callback: res => {
                    const modal = $('[data-dom=modal]');
                    if (res.code == 200) {
                        Help.Redirect();
                    }
                }
            })
        }
    } );


    /* Live Match */
    if ( Help.Url ( 2 ) == 'match' ) {
        setInterval ( Events.LiveMatch, 20000 );
    }
    else {
        setInterval ( Events.LiveMatch, 20000 );
    }
    /* Live Match End */

    var isFirefox = typeof InstallTrigger !== 'undefined';

    if ( isFirefox == true ) {
        $ ( '[data-dom=current_time]' ).removeClass ( 'display-none' );
    }


} );
