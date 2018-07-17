/* DOCUMENT INFORMATION
	- Document: ZuniSport Web Project
	- Version:  1.0
	- Author:   Azeroglu Emin
*/

localStorage.setItem('Loading', '');
/* Default Language Add Local Storage */
if (!localStorage.getItem('Language')) {
    localStorage.setItem('Language', 1);
}
if (!localStorage.getItem('LanguageCode')) {
    localStorage.setItem('LanguageCode', 'en');
}
if (!localStorage.getItem('Lang_') && DV != 'mobile') {
    localStorage.setItem('Lang_', 1);
    Help.Redirect('/');
}
/* Default Language Add Local Storage End */

if (localStorage.getItem('userToken')) {
    localStorage.removeItem('number');
}

/* Time Zone Add Local Storage */
var _isFirefox = typeof InstallTrigger !== 'undefined';
if (!localStorage.getItem('TimeZone')) {
    var tz = moment().format('Z');
    if (tz.indexOf('0') == 0) {
        tz = '+' + tz;
    }
    localStorage.setItem('TimeZone', tz);
} else {

    
    var TimeZone    =   Help.CurrentTime();

    console.log(TimeZone);

    $('.et-current-default')
        .text(TimeZone)
        .attr('data-value', TimeZone);

    var todayTime_ = moment();
    todayTime_.utcOffset(TimeZone);
    $('#current-today-time').text(todayTime_.format('DD.MM.YYYY HH:mm'));

}
/* Time Zone Add Local Storage End */

/* Client Token Control */
if (!localStorage.getItem('clientToken')) {
    localStorage.setItem('clientToken', Help.Unique());
}
/* Client Token Control End */

/* News Block */
Handler.NewsBlock();
/* News Block End */

/* App Data and Portal Selection */
Request.AppData(function () {

    /* Language Handler */
    Handler.Language();
    /* Language Handler End */

    if (!localStorage.getItem('portalId')) {
        Request.PortalSelection();
    }

    if (RequestApp.appData.androidAppVersion == 1) {
        $('#google-play').removeClass('display-none');
    }

    /* Sport Handler */
    Handler.SportMenu();
    /* Sport Handler End */

    /* Favorite List */
    Handler.FavoriteList(['tournament', 'team', 'match']);
    /* Favorite List End */

    Events.CurrentTimeList();

    $('#home-page-date')
        .find('.date')
        .text(moment().format('DD-MM-YYYY'));

});
/* App Data and Portal Selection End */

/* User Login Control */
Request.Login(function () {
    Handler.Login();
});
/* User Login Control End */

/* Category */
Request.Category(function () {
    /* Category List */
    Handler.CategoryList();
    /* Category List End */

    /* Favorite */
    Handler.Favorite('tournament');
    /* Favorite End */

    /* Prediction List */
    Handler.PredictionList();
    /* Prediction List End */
});
/* Category End */

/* Match */
if (Help.Url(2) == '' || Help.Url(2) == 'home') {

    if (Help.Token()) {
        Request.Favorites(function () {
            Request.Match(0, function () {
                /* Match List */
                if (DV == 'mobile') {
                    Handler.MatchListMobile('all');
                } else {
                    Handler.MatchList();
                }
                /* Match List End */

                Handler.FavoriteList(['match']);
            });
        });
    } else {
        Request.Match(0, function () {
            /* Match List */
            if (DV == 'mobile') {
                Handler.MatchListMobile('all');
            } else {
                Handler.MatchList();
            }
            /* Match List End */
        });
    }

}
/* Match End */

/* Match Live Mobile */
if (Help.Url(2) == 'live' && DV == 'mobile') {
    if (Help.Token()) {
        Request.Favorites(function () {
            Request.Match(0, function () {
                Handler.MatchListMobile('live');
            });
        });
    } else {
        Request.Match(0, function () {
            Handler.MatchListMobile('live');
        });
    }
}
/* Match Live Mobile End */


/* Match Leagues Mobile */
if (Help.Url(2) == 'leagues' && DV == 'mobile') {
    Request.Category(function () {
        Handler.CategoryListMobile();
    });
}
/* Match Leagues Mobile End */

/* Match Page */
if (Help.Url(2) == 'match') {

    /* Match Details */
    Request.MathcDetails(function () {
        Handler.MatchDetails(RequestMatch.Details);
    });
    /* Match Subsitutions */
    if (Help.Token()) {
        Request.Favorites(function () {
            Request.MatchInfo(function () {
                Handler.MatchInfo();
            }, ['Subsitutions', 'Goal', 'Card']);
        });
    } else {
        Request.MatchInfo(function () {
            Handler.MatchInfo();
        }, ['Subsitutions', 'Goal', 'Card']);
    }

}
/* Match Page End */

/* Team Page */
if (Help.Url(2) == 'team') {
    Request.Team(function () {
        Handler.Team();
        /* Favorite */
        Handler.Favorite('team');
        /* Favorite End */
        /* Favorite */
        Handler.Favorite('match');
        /* Favorite End */
    });
}
/* Team Page End */

/* Tournament Page */
if (Help.Url(2) == 'tournament') {
    Request.Tournament(function () {
        Handler.Tournament();
    });
}
/* Tournament Page End */

/* News Page */
if (Help.Url(2) == 'contents') {
    Request.News(function () {
        Handler.NewsList();
    });
}
/* News Page End */

/* Link Route Listener */
$("body").on('click', 'a[data-router]', function (e) {
    Help.Loading('show');
});
/* Link Route Listener End */

LanguageChange();




