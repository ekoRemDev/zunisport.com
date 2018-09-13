/* DOCUMENT INFORMATION
 - Document: ZuniSport Web Project
 - Version:  1.0
 - Author:   Azeroglu Emin
 */

/* [ Help Object ] */
Help = {

    /* Seo */
    Seo: function ( url ) {
        // make the url lowercase
        var encodedUrl = url.toString ().toLowerCase ();

        // replace & with and
        encodedUrl = encodedUrl.split ( /\&+/ ).join ( "-and-" )

        // remove invalid characters
        encodedUrl = encodedUrl.split ( /[^a-z0-9]/ ).join ( "-" );

        // remove duplicates
        encodedUrl = encodedUrl.split ( /-+/ ).join ( "-" );

        // trim leading & trailing characters
        encodedUrl = encodedUrl.trim ( '-' );

        return encodedUrl;
    },
    /* Seo End */

    /* User Token */
    Token: function () {
        var token = localStorage.getItem ( 'userToken' );
        if ( token )
            return token;
        return null;
    },
    /* User Token End */

    /* Client Token */
    TokenClient: function () {
        var token = localStorage.getItem ( 'clientToken' );
        if ( token )
            return token;
        return null;
    },
    /* Client Token End */

    /* Onyl Number Value */
    InputValue: function ( evt, object, type ) {
        object = object ? object : '';
        type = type ? type : '';
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode ( key );
        var regex = /[0-9+]|\./;
        if ( !regex.test ( key ) && evt.which != 13 && evt.which != 8 ) {
            theEvent.returnValue = false;
            if ( theEvent.preventDefault ) theEvent.preventDefault ();
        }
        else if ( evt.which == 13 && type == '' ) {
            object.parents ( '.f-element' ).find ( 'button' ).trigger ( 'click' );
        }

        if ( type != '' && object.val () > UserParams.score ) {
            object.val ( UserParams.score );
        }
    },
    /* Onyl Number Value End */

    /* Portal Id */
    PortalId: function () {
        var portal = localStorage.getItem ( 'portalId' );
        if ( portal )
            return portal;
        return null;
    },
    /* Portal Id End */

    /* Lang Id */
    LangId: function () {
        var lang = localStorage.getItem ( 'Language' );
        if ( lang )
            return lang;
        return null;
    },
    /* Lang Id End */

    /* Lang Name */
    LangName: function () {
        var lang = localStorage.getItem ( 'LanguageCode' );

        if ( Language[ lang ] )
            return lang;
        return 'en';
    },
    /* Lang Name End */

    /* DateFormat */
    Date: function ( day ) {
        day = day ? day : '';
        var date = new Date ();
        if ( day == 7 ) {
            var d = date.getDate () + 7;
            if ( d < 10 ) d = '0' + d;
            var m = date.getMonth () + 1;
            if ( m < 10 ) m = '0' + m;
            var y = date.getFullYear ();
            return m + '/' + d + '/' + y;
        }
        else if ( day == 0 ) {
            var d = date.getDate ();
            if ( d < 10 ) d = '0' + d;
            var m = date.getMonth () + 1;
            if ( m < 10 ) m = '0' + m;
            var y = date.getFullYear ();
            var h = date.getHours ();
            if ( h < 10 ) h = '0' + h;
            var min = date.getMinutes ();
            if ( min < 10 ) min = '0' + min;
            return d + '.' + m + '.' + y + ' ' + h + ':' + min;
        }
        else {
            var d = date.getDate ();
            if ( d < 10 ) d = '0' + d;
            var m = date.getMonth () + 1;
            if ( m < 10 ) m = '0' + m;
            var y = date.getFullYear ();
            return d + '.' + m + '.' + y;
        }

    },
    /* DateFormat End */

    /* DateFormat */
    DateFormat: function ( object ) {
        var date = object.Data.split ( ' ' ),
            year = date[ 0 ].split ( "-" )[ 0 ],
            month = date[ 0 ].split ( "-" )[ 1 ],
            day = date[ 0 ].split ( "-" )[ 2 ],
            hour = date[ 1 ].split ( ":" )[ 0 ],
            minute = date[ 1 ].split ( ":" )[ 1 ];

        if ( object.Type == "default" ) {
            return year + "." + month + "." + day + " " + hour + ":" + minute;
        }
        else if ( object.Type == "date" ) {
            return day + "." + month + "." + year;
        }
        else if ( object.Type == "dateLine" ) {
            return day + "-" + month + "-" + year;
        }
        else if ( object.Type == "shortDate" ) {
            return day + "-" + month;
        }
        else if ( object.Type == 'time' ) {
            return hour + ':' + minute;
        }
    },
    /* DateFormat End */

    /* Live Minute */
    LiveMinute: function () {
        var currentTz = moment ().format ( 'Z' );
        var momentDate = moment ();
        momentDate.utcOffset ( currentTz );
        return momentDate;
    },
    /* Live Minute End */

    /* Diffrent Date */
    GetMatchTime: function ( object ) {
        var timeZone = Help.CurrentTime ();
        ;
        var callback = object.callback ? object.callback : '';
        var startTimeMoment = moment ( object.startTime );
        var minute = startTimeMoment.format ( "HH:mm" );
        var diff = 0;
        var a = Help.LiveMinute ();
        var b = moment ( object.preidoTime + timeZone );
        b = moment ( b ).format ();

        if ( [ 0, 60, 100, 120, 110 ].indexOf ( object.currentStatus ) < 0 ) {
            diff = a.diff ( b, 'minutes' ) + 1;
            diff = moment ( diff )
        }

        switch ( object.currentStatus ) {

            case 0:
                var d1 = startTimeMoment.format ( 'yyyy MM dd' );
                var d2 = a.format ( 'yyyy MM dd' );
                if ( d1 !== d2 ) {
                    if ( Help.Url ( 2 ) == 'match' ) {
                        minute = 'Not started';
                    }
                    else {
                        if ( DV == 'desktop' ) {
                            minute = startTimeMoment.format ( 'dd MM HH:mm' );
                        }
                        else {
                            minute = startTimeMoment.format ( 'HH:mm' );
                        }
                    }
                }
                break;

            /* show counter */
            case 6:
            case 20:
                if ( diff >= 45 ) {
                    minute = "45'+";
                }
                else {
                    minute = diff + "'";
                }
                break;

            case 7:
                if ( diff >= 45 ) {
                    minute = "90'+";
                }
                else {
                    minute = ( 45 + diff ) + "'";
                }
                break;

            case 41:
                if ( diff >= 60 ) {
                    minute = "105'+";
                }
                else {
                    minute = ( 90 + diff ) + "'";
                }
                break;

            case 42:
                if ( diff >= 75 ) {
                    minute = "120'+";
                }
                else {
                    minute = ( 90 + diff ) + "'";
                }
                break;

            /* End Of Game */
            case 100:
            case 110:
            case 120:
                minute = 'FT';
                break;

            /* Postponed */
            case 60:
                minute = 'POS';
                break;

            case 31:
                minute = 'HT';
                break;

            case 32:
                minute = 'WET';
                break;

            case 33:
                minute = 'ET';
                break;

            case 34:
                minute = 'WPN';
                break;

            case 50:
                minute = 'PN';
                break;

            /* Delayed */
            case 61:
                minute = startTimeMoment.format ( 'HH:mm' );
                break;

            /* Delayed */
            case 70:
                minute = 'CNL';
                break;

            /* suspended */
            case 81:
                minute = 'SSP';
                break;

            /* abandoned */
            case 90:
                minute = 'ABD';
                break;

            default:
                minute = diff;
        }

        if ( object.callback ) {
            callback ( minute );
        }


        return minute;

    },
    /* Diffrent Date End */

    /* TimeZone Id */
    TimeZone: function () {
        var zone = Help.CurrentTime ();
        ;
        if ( zone )
            return zone;
        return null;
    },
    /* TimeZone Id End */

    /* Sort Object */
    Sort: function ( object, par ) {
        par = par ? par : '';
        object.sort ( function ( a, b ) {
            if ( par ) {
                return a[ par ] - b[ par ];
            }
            else {
                return a.time - b.time;
            }
        } );
    },
    /* Sort Object End */

    /* Player Name */
    PlayerName: function ( data ) {
        var name = data.split ( ',' );
        if ( name[ 1 ] && name[ 0 ] ) {
            return name[ 1 ] + ' ' + name[ 0 ];
        }
        else {
            return data;
        }

    },
    /* Player Name End */

    /* Sport */
    Sport: function ( param ) {
        var sport = '';
        if ( SportData[ Help.Url ( 1 ) ] )
            sport = SportData[ Help.Url ( 1 ) ][ param ];
        else
            sport = '';
        return sport;
    },
    /* Sport End */

    /* Match Status */
    MatchStatus: function ( object ) {
        var finishedCode = [ 100, 110, 120 ],
            scheduledCode = [ 0, 60, 70, 61, 80, 90, 81 ],
            liveCode = [ 0, 60, 61, 70, 80, 81, 90, 100, 110, 120 ],
            notStarted = [ 0, 60, 61, 70 ];

        if ( object.FinishedCode == 'Yes' ) {
            return finishedCode;
        }
        else if ( object.ScheduledCode == 'Yes' ) {
            return scheduledCode;
        }
        else if ( object.LiveCode == 'Yes' ) {
            return liveCode;
        }
        else if ( object.NotStarted == 'Yes' ) {
            return notStarted;
        }
        else if ( object.Type == 'status' ) {

            if ( finishedCode.indexOf ( object.Status ) >= 0 ) {
                return 'FT';
            }
            else {
                var time = object.StartTime.split ( ' ' )[ 1 ],
                    time = time.split ( ':' );
                return time[ 0 ] + ":" + time[ 1 ];
            }
        }
        else {
            /* Live Status */
            if ( liveCode.indexOf ( object.Live ) < 0 ) {
                return 'yes';
            }
            else {
                return 'no';
            }
        }

    },
    /* Match Status End */

    /* Url Method */
    Url: function ( $par ) {
        var url = window.location.pathname,
            url = url.split ( '/' );
        url[ 1 ] = url[ 1 ] ? url[ 1 ].toLowerCase () : 'soccer';
        url[ 2 ] = url[ 2 ] ? url[ 2 ].toLowerCase () : '';
        return url[ $par ];
    },
    /* Url Method End */

    /* Modal Display */
    Modal: function ( param, callback ) {
        callback = callback ? callback : '';
        if ( param == 'show' ) {
            $ ( '.js-modal-block' ).show ();
            $ ( 'body' ).addClass ( 'overflow-hidden' );
        }
        else if ( param == 'hide' ) {
            $ ( '.js-modal-block' ).hide ();
            $ ( 'body' ).removeClass ( 'overflow-hidden' );
        }
        if ( callback != '' ) {
            callback ();
        }
    },
    /* Modal Display End */

    /* Translate Return Data */
    Translate: function ( param ) {
        var id = localStorage.getItem ( 'LanguageCode' );
        return Language[ id ][ param ];
    },
    /* Translate Return Data End */

    /* Redirect */
    Redirect: function ( url, time ) {
        url = url ? url : '';
        time = time ? time : 0;
        if ( url != "" ) {
            if ( time > 0 ) {
                setTimeout ( function () {
                    window.location.href = url;
                }, time );
            }
            else {
                window.location.href = url;
            }
        }
        else {
            window.location.reload ();
        }
    },
    /* Redirect End */

    /* Loading Gif */
    Loading: function ( param ) {
        if ( param == 'show' )
            $ ( '.loading-gif' ).fadeIn ( 100 )
        else if ( param == 'hide' )
            $ ( '.loading-gif' ).fadeOut ( 100 )
    },
    /* Loading Gif End */

    /* Unique Id */
    Unique: function () {
        var id = 'web_' + Math.random ().toString ( 36 ).substr ( 2, 9 );
        ;
        return id;
    },
    /* Unique Id End */


    CurrentTime: function () {
        var tz = moment ().format ( 'Z' );
        var _timeZone = localStorage.getItem ( 'TimeZone' );

        if ( _isFirefox == true ) {
            var TimeZone = _timeZone;
        }
        else {
            var TimeZone = tz;
        }

        return TimeZone;
    },

    /* ======= [ Request ] ======= */
    requset: params => {
        const { type, value, url, callback } = params;
        let req;
        if ( type == "post" ) {
            req = $.post ( url, value );
            req.done ( response => {
                callback ( response );
            } ).fail ( err => {
                callback ( err );
            } );
        }
        else if ( type == "get" ) {
            req = $.get ( url );
            req.done ( response => {
                callback ( response );
            } ).fail ( err => {
                callback ( response );
            } );
        }
    },
    /* ======= [ Request End ] ======= */

    /* ======= [ Event ] ======= */
    event: params => {
        $ ( "body" ).on ( params.event, "[data-event=" + params.dom + "]", e => {
            if ( params.prevent == "yes" ) {
                e.preventDefault ();
            }
            params.callback ( $ ( e.currentTarget ) );
        } );
    },
    /* ======= [ Event End ] ======= */

    /* ======= [ Notfication ] ======= */
    notfication: params => {
        Help.Modal ( params.terms, () => {
            const modal = $ ( '[data-dom=modal]' );
            const container = modal.find ( '[data-dom=container]' ).css ( 'width', ( params.width ? params.width : '500px' ) );
            container.load ( "/" + PathDir + "/_parts/notficationModal.html", () => {
                const content = $ ( '[data-dom=notfication-content]' );
                content.find ( '[data-dom=head]' ).html ( params.headTxt );
                content.find ( '[data-dom=text]' ).html ( params.contentTxt );
                content.find ( '[data-dom=confirm]' ).html ( params.confirmButtonTxt ).attr ( ( params.confirmButtonAttr ? params.confirmButtonAttr : '' ) );
                content.find ( '[data-dom=cancel]' ).html ( params.cancelButtonTxt );
                console.log ( params );
                if ( params.callback ) {
                    params.callback ();
                }
            } );
        } );
    },
    /* ======= [ Notfication End ] ======= */

    dom: object => {
        let callback = object.callback ? object.callback : "";
        let tags = object.tags;
        let dom;

        tags.forEach(item => {
            if (item.child) {
                dom = $(object.parent)
                .find(item.name)
                .find(item.child);
            } else if (item.name) {
                dom = $(object.parent).find(item.name);
            } else {
                dom = $(object.parent);
            }

            /* Attr */
            if (item.attr) {
                dom.attr(item.attr);
            }

            /* Css */
            if (item.css) {
                dom.css(item.css);
            }

            /* FadeIn */
            if (item.fadeIn) {
                dom.fadeIn(item.fadeIn);
            }

            /* FadeOut */
            if (item.fadeOut) {
                dom.fadeOut(item.fadeOut);
            }

            /* Text */
            if (item.text) {
                dom.text(item.text);
            }

            /* Add Class */
            if (item.addClass) {
                dom.addClass(item.addClass);
            }

            /* Remove Class */
            if (item.removeClass) {
                dom.removeClass(item.removeClass);
            }

            /* Remove Attribute */
            if (item.removeAttr) {
                dom.removeAttr(item.removeAttr);
            }

            /* Html */
            if (item.html) {
                dom.html(item.html);
            }

            /* Land */
            if (item.lang) {
                dom.attr({
                    "data-lang": item.lang
                });
            }
        });

        if (callback) object.callback();
    }


};
/* [ Help Object End ] */