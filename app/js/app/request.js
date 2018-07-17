/* DOCUMENT INFORMATION
	- Document: ZuniSport Web Project
	- Version:  1.0
	- Author:   Azeroglu Emin
*/
var RequestData = {},
    RequestApp = {},
    FavoriteList = {
        matches: [],
        teams: [],
        tournaments: []
    },
    RequsetNews = {},
    RequestLeagues = {},
    RequestMobileLeagues = {},
    RequestMatch = {
        All: {},
        Finished: {},
        Scheduled: {},
        Live: {},
        Details: {},
        Info: [],
    };
Request = {

    /* Variables */
    Variables: {},
    /* Variables End */

    /* [ Portal Selection ] */
    PortalSelection: function () {
        var modal = '.js-modal-block',
            modalHead = '.portal-select .head',
            modalContent = '.block-content';

        if ( RequestData.Portals.length > 1 ) {
            $(modal + " " + modalContent).load("/" + PathDir + "/_parts/portalSelection.html", function () {
                Help.Modal('show');
                $(modal + " " + modalHead).text(Help.Translate('portalSelectionHead'));
                var Container = '.portal-selection .content',
                    Element = '.list',
                    Block = $(Container + ' ' + Element);

                $(Container).html('');

                RequestData.Portals.forEach(function (val) {
                    Block.attr('data-id', val.id);
                    Block.attr('data-prefered', val.params.preferedCountry);
                    Block.find('figure .img').css('background-image', 'url(' + PortalPath + '/' + val.params.portal_logo + ')');
                    Block.find('.name').text(val.name);
                    $(Container).append(Block[0].outerHTML);
                })

            });
        }
        else {
            var id    = RequestData.Portals[0].id;
            var prefered    = RequestData.Portals[0].params.preferedCountry;
            if (!localStorage.getItem('portalId')) {
                localStorage.setItem('portalId', id);
                localStorage.setItem('prefered', prefered);
                Help.Redirect('/');
            }
        }

    },
    /* [ Portal Selection End ] */

    /* [ App Data ] */
    AppData: function (callback) {
        this.Variables.Data = {lang: Help.LangId(), portalId: Help.PortalId(), token: Help.Token()};
        this.Variables.PostUrl = ApiUrl + ApiPath.General.appData;
        $.post(this.Variables.PostUrl, this.Variables.Data, function (response) {
            RequestData = {
                Language: response.appData.languages,
                Sports: response.appData.sports,
                Portals: response.portals,
            };
            RequestApp = response;
                localStorage.setItem('Loading', 1);
            callback(response);
        });
    },
    /* [ App Data End ] */

    Favorites: function (callback) {
        if (Help.Token() && Help.Token().length > 0) {
            var PostUrl = ApiUrl + ApiPath.Favorites.favorites;
            var Value = {token: Help.Token(), timezone: Help.TimeZone()};
            $.post(PostUrl, Value, function (response) {
                if (response.code == 200) {
                    FavoriteList = {
                        matches: response.matches,
                        teams: response.teams,
                        tournaments: response.tournaments
                    }
                } else if (response.code == 401) {
                    //todo logout and refresh
                }
                callback();
            });
        }
    },


    /* [ Category List ] */
    Category: function (callback) {
        var Path = ApiPath.Match.leaguesList,
            Path = Path.replace('{sportId}', Help.Sport('id'));
        this.Variables.Data = {lang: Help.LangId(), portalId: Help.PortalId(), token: Help.Token()};
        this.Variables.PostUrl = ApiUrl + Path;

        $.post(this.Variables.PostUrl, this.Variables.Data, function (response) {

            Help.Loading('hide');
            RequestLeagues = response.leagues;
            RequestMobileLeagues = response.leagues;
            callback();
        });

    },
    /* [ Category List End ] */

    /* [ Login ] */
    Login: function (callback) {
        this.Variables.Data = {token: Help.Token()};
        this.Variables.PostUrl = ApiUrl + ApiPath.User.me;
        if (!UserParams.user) {
            $.post(this.Variables.PostUrl, this.Variables.Data, function (response) {
                UserParams = response.user;
                callback();
            });
        }
    },
    /* [ Login End ] */

    /* Match List */
    Match: function (page, callback) {
        var Path = ApiPath.Match.matchByDate,
            Path = Path.replace('{sportId}', Help.Sport('id')),
            finishedCode = Help.MatchStatus({FinishedCode: 'Yes'}),
            scheduledCode = Help.MatchStatus({ScheduledCode: 'Yes'}),
            liveCode = Help.MatchStatus({LiveCode: 'Yes'});

        this.Variables.Data = {
            lang: Help.LangId(),
            portalId: Help.PortalId(),
            date: page,
            timezone: Help.TimeZone()
        };
        this.Variables.PostUrl = ApiUrl + Path;

        $.post(this.Variables.PostUrl, this.Variables.Data, function (response) {
            Help.Loading('hide');
            var Data = response.matches;
            if (Data.length > 0) {
                Data.forEach(function (val, key) {
                    // Finished
                    if (finishedCode.indexOf(val.mstatus) >= 0) {
                        RequestMatch.Finished[key] = val;
                    }
                    // Scheduled
                    else if (scheduledCode.indexOf(val.mstatus) >= 0) {
                        RequestMatch.Scheduled[key] = val;
                    }
                    // Live
                    else if (liveCode.indexOf(val.mstatus) < 0) {
                        RequestMatch.Live[key] = val;
                    }
                    // All
                    RequestMatch.All[key] = val;


                });
            }
            // todo Error Modal

            callback();
        });
    },
    /* Match List End */

    /* Match Details */
    MathcDetails: function (callback) {
        var MatchId = parseInt(Help.Url(3));
        Path = ApiPath.Match.matchDetails,
            Path = Path.replace('{matchId}', MatchId);
        this.Variables.Data = {
            lang: Help.LangId(),
            portalId: Help.PortalId(),
            token: Help.Token(),
            timezone: Help.TimeZone()
        };
        this.Variables.PostUrl = ApiUrl + Path;

        $.post(this.Variables.PostUrl, this.Variables.Data, function (response) {
            Help.Loading('hide');
            RequestMatch.Details = response.match;
            callback();
        });

    },
    /* Match Details End */

    /* Match Info Info */
    MatchInfo: function (callback, type) {

        var MatchId = parseInt(Help.Url(3));

        type.forEach(function (index) {
            if (index == 'Subsitutions') {
                var PostUrl = ApiPath.Match.matchSubstitutions;
            }
            else if (index == 'Goal') {
                var PostUrl = ApiPath.Match.matchGolas;
            }
            else if (index == 'Card') {
                var PostUrl = ApiPath.Match.matchCards;
            }
            var Path = PostUrl.replace('{matchId}', MatchId);
            Request.Variables.Data = {
                token: Help.Token()
            };
            Request.Variables.PostUrl = ApiUrl + Path;

            $.post(Request.Variables.PostUrl, Request.Variables.Data, function (response) {
                Help.Loading('hide');
                var data;
                if (index == 'Subsitutions') {
                    data = response.substitutions;
                }
                else if (index == 'Goal') {
                    data = response.goals;
                }
                else if (index == 'Card') {
                    data = response.cards;
                }
                data.forEach(function (val) {
                    if (index == 'Card') {
                        val.time = val.cardTime;
                    }
                    else if (index == 'Goal') {
                        val.time = val.minute;
                    }

                    if (val.playerName)
                        val.footballer = val.playerName;
                    if (val.scorerPlayerName)
                        val.footballer = val.scorerPlayerName;
                    if (val.inPlayerName)
                        val.inFootballer = val.inPlayerName;
                    if (val.outPlayerName)
                        val.outFootballer = val.outPlayerName;


                    if (val.playerTeam == 1)
                        val.Team = 'Home';
                    else if (val.playerTeam == 2)
                        val.Team = 'Away';
                    if (val.teamScored == 1)
                        val.Team = 'Home';
                    else if (val.teamScored == 2)
                        val.Team = 'Away';

                    RequestMatch.Info.push(val);
                });

                callback();
            });

        });
    },
    /* Match Info End */

    /* Team Info */
    Team: function (callback) {
        var TeamId = Help.Url(3);
        Path = ApiPath.Match.matchOfTeam;
        Path = Path.replace('{sportId}', Help.Sport('id'));
        this.Variables.Data = {
            id: TeamId,
            page: 0,
            lang: Help.LangId(),
            portalId: Help.PortalId(),
            token: Help.Token(),
            timezone: Help.TimeZone()
        };
        this.Variables.PostUrl = ApiUrl + Path;

        $.post(this.Variables.PostUrl, this.Variables.Data, function (response) {
            Help.Loading('hide');
            RequestData.Team = response;
            callback();
        });
    },
    /* Team Info End */

    /* Tournament Info */
    Tournament: function (callback) {
        var TournameId = Help.Url(3);
        Path = ApiPath.Match.matchOfTournament;
        Path = Path.replace('{sportId}', Help.Sport('id'));
        this.Variables.Data = {
            id: TournameId,
            page: 0,
            lang: Help.LangId(),
            portalId: Help.PortalId(),
            token: Help.Token(),
            timezone: Help.TimeZone()
        };
        this.Variables.PostUrl = ApiUrl + Path;

        $.post(this.Variables.PostUrl, this.Variables.Data, function (response) {
            Help.Loading('hide');
            RequestData.Tournament = response;
            callback();
        });
    },
    /* Tournament Info End */

    /* News Request */
    News: function (callback) {
        var Path = ApiPath.Contents.list;
        this.Variables.Data = {
            page: 1,
            token: Help.Token(),
        };
        this.Variables.PostUrl = ApiUrl + Path;

        $.post(this.Variables.PostUrl, this.Variables.Data, function (response) {
            Help.Loading('hide');
            if (response.code == 200) {
                RequestNews = response.contents;
            }
            else {
                RequestNews = {};
            }
            callback();
        });
    },
    /* News Request End */

};