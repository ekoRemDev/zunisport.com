/* DOCUMENT INFORMATION
	- Document: ZuniSport Web Project
	- Version:  1.0
	- Author:   Azeroglu Emin
*/

Methods = {

    /* [ - Soccer - ] */
    Soccer: {

        /* [ - Home - ] */
        Home: function () {
            ContainerBlock.load("/" + PathDir + "/page/soccer/home.html", function () {
            });
        },
        /* [ - Home End - ] */

        /* [ - Match - ] */
        Match: function () {
            ContainerBlock.load("/" + PathDir + "/page/soccer/match.html", function () {
                Request.AppData((data) => {
                    if (data.portals[0].params.restrict_to_login == 1 && !Help.Token()) {
                        LanguageChange([
                            'txtRestrictToLogin',
                            'loginButton',
                        ]);
                        $('.__restrict_to_login').removeClass('display-none');
                    }
                    else {
                        $('.__match-page').removeClass('display-none');
                    }
                });
            });
        },
        /* [ - Match End - ] */

        /* [ - Team - ] */
        Team: function () {
            ContainerBlock.load("/" + PathDir + "/page/soccer/team.html", function () {
            });
        },
        /* [ - Team End - ] */

        /* [ - Leagues - ] */
        Leagues: function () {
            if (DV == 'mobile') {
                ContainerBlock.load("/" + PathDir + "/page/soccer/leagues.html", function () {
                });
            }
            else {
                Help.Redirect('/');
            }
        },
        /* [ - Leagues End - ] */

        /* [ - Search - ] */
        Search: function () {
            if (DV == 'mobile') {
                ContainerBlock.load("/" + PathDir + "/page/soccer/search.html", function () {
                    $('.js-search-post').focus();
                });
            }
            else {
                Help.Redirect('/');
            }
        },
        /* [ - Search End - ] */

        /* [ - Favorite - ] */
        Favorite: function () {
            if (DV == 'mobile') {
                ContainerBlock.load("/" + PathDir + "/page/soccer/favorite.html", function () {
                    /* Favorite List */
                    Handler.FavoriteList(['match', 'team', 'tournament']);
                    /* Favorite List End */

                    /* Favorite */
                    Handler.Favorite('match');
                    /* Favorite End */
                });
            }
            else {
                Help.Redirect('/');
            }
        },
        /* [ - Favorite End - ] */

        /* [ - Tournament - ] */
        Tournament: function () {
            ContainerBlock.load("/" + PathDir + "/page/soccer/tournament.html", function () {
            });
        },
        /* [ - Tournament End - ] */

        /* [ - Profile - ] */
        Profile: function () {
            if (Help.Token()) {
                ContainerBlock.load("/" + PathDir + "/page/default/profile.html", function () {
                    Help.Loading('hide');

                    $('#form-user-name').attr('placeholder', Language[Help.LangName()].txtUsername);

                    LanguageChange([
                        'txtSave',
                        'txtLogout',
                        'txtUsername'
                    ]);
                });
            }
            else {
                Help.Redirect('/');
            }
        },
        /* [ - Profile End - ] */

        /* [ - Prediction - ] */
        Prediction: function () {
            if (Help.Token()) {
                ContainerBlock.load("/" + PathDir + "/page/default/prediction.html", function () {
                    Help.Loading('hide');

                    Handler.PredictionPageList();

                    LanguageChange([
                        'txtNew',
                        'txtWin',
                        'txtLose',
                        'txtPrNoNewMatch',
                        'txtPrNoWinMatch',
                        'txtPrNoLoseMatch',
                    ]);
                });
            }
            else {
                Help.Redirect('/');
            }
        },
        /* [ - Prediction End - ] */

        /* [ - Contents - ] */
        Contents: function () {
            if ((Help.PortalId() == 5) && Help.Token()) {
                ContainerBlock.load("/" + PathDir + "/page/default/contents.html", function () {

                    LanguageChange([
                        'txtNew',
                    ]);
                });
            }
            else {
                Help.Redirect('/');
            }
        },
        /* [ - Contents End - ] */

        /* [ - Content - ] */
        Content: function () {
            if ((Help.PortalId() == 5) && Help.Token()) {
                ContainerBlock.load("/" + PathDir + "/page/default/content.html", function () {
                    Handler.NewsView();
                });
            }
            else {
                Help.Redirect('/');
            }
        },
        /* [ - Content End - ] */

    },
    /* [ - Soccer End - ] */


}