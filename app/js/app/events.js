/* DOCUMENT INFORMATION
	- Document: ZuniSport Web Project
	- Version:  1.0
	- Author:   Azeroglu Emin
*/

Events = {

    /* Portal Select */
    PortalSelect: function (object) {
        Help.Loading('show');
        var id = object.data('id');
        var prefered = object.data('prefered');
        localStorage.setItem('portalId', id);
        localStorage.setItem('prefered', prefered);
        Help.Redirect('/');
    },
    /* Portal Select End */

    /* Language Change */
    LanguageChange: function (object) {
        Help.Loading('show');
        var lang = object.data('value').split('-');
        localStorage.setItem('Language', lang[0]);
        localStorage.setItem('LanguageCode', lang[1]);
        if (Help.Token()) {
            var PostUrl = ApiUrl + ApiPath.User.setLang;
            var Value = {token: Help.Token(), langId: lang[0]};
            $.post(PostUrl, Value, function (response) {
                Help.Redirect();
            });
        }
        else {
            Help.Redirect();
        }
    },
    /* Language Change End */

    /* Load More */
    LoadMore: function (object) {
        var Container = $('.js-load-more-content');
        var type = object.attr('data-type');
        var page = parseInt(object.attr('data-page'));

        Help.Loading('show');

        /* Tournament */
        if (type == 'tournament') {
            var TournameId = Help.Url(3);
            var Path = ApiPath.Match.matchOfTournament;
            Path = Path.replace('{sportId}', Help.Sport('id'));
            var Data = {
                id: TournameId,
                page: page,
                lang: Help.LangId(),
                portalId: Help.PortalId(),
                token: Help.Token(),
                timezone: Help.TimeZone()
            };
            var CloneBlock = $('#clone-block')
                .clone()
                .removeAttr('id')
                .removeClass('display-none');

            var MatchElement = $('#match-element').clone().removeAttr('id').removeClass('display-none');
            var MatchLink = '/' + Help.Sport('url') + UrlPath.Module.match;
        }
        /* Tournament End */

        /* Team */
        else if (type == 'team') {
            var TeamId = Help.Url(3);
            var MatchLink = '/' + Help.Sport('url') + UrlPath.Module.match;
            var Path = ApiPath.Match.matchOfTeam;
            Path = Path.replace('{sportId}', Help.Sport('id'));
            var Data = {
                id: TeamId,
                page: page,
                lang: Help.LangId(),
                portalId: Help.PortalId(),
                token: Help.Token(),
                timezone: Help.TimeZone()
            };
            var PageContent = '.tab-content';
            var BlockList = $('#block-list')
                .clone()
                .removeAttr('id')
                .removeClass('display-none');

        }
        /* Team End */

        var PostUrl = ApiUrl + Path;

        $.post(PostUrl, Data, function (response) {
            Help.Loading('hide');

            /* Tournament */
            if (type == 'tournament' && response.matches.length > 0) {

                response.matches.forEach(function (val) {

                    var DateLine = Help.DateFormat({Data: val.starttime, Type: 'dateLine'});
                    var Date = Help.DateFormat({Data: val.starttime, Type: 'date'});

                    if (!Container.find('[data-date=' + DateLine + ']').length) {
                        var FinalBlock = CloneBlock.clone().attr('data-date', DateLine);
                        Container.append(FinalBlock);
                        FinalBlock
                            .find('.tab-content-head')
                            .find('.date')
                            .text(Date);
                    }

                    var FinalMatchElement = MatchElement.clone();

                    /* Date */
                    FinalMatchElement
                        .find('.time')
                        .text(Help.MatchStatus({Status: val.mstatus, StartTime: val.starttime, Type: 'status'}));

                    /* Team */
                    FinalMatchElement
                        .find('.team-home')
                        .text(val.team1Name);
                    FinalMatchElement
                        .find('.team-away')
                        .text(val.team2Name);

                    /* Score */
                    if (Help.MatchStatus({NotStarted: 'Yes'}).indexOf(val.mstatus) < 0) {
                        FinalMatchElement
                            .find('.score')
                            .find('.home')
                            .text(val.score.split('-')[0]);
                        FinalMatchElement
                            .find('.score')
                            .find('.away')
                            .text(val.score.split('-')[1]);
                    }

                    /* Link */
                    FinalMatchElement
                        .find('.link')
                        .attr({
                            href: MatchLink.replace('{matchId}', val.id)
                        });

                    FinalMatchElement
                        .attr('data-matchid', val.id);

                    FinalMatchElement
                        .find('.star')
                        .attr('data-id', val.id);

                    FinalMatchElement.find('.time').text(Help.GetMatchTime({
                        preidoTime: val.periodStartTime,
                        startTime: val.starttime,
                        currentStatus: val.mstatus
                    }));

                    FinalMatchElement.find('.time').removeClass('live');
                    if (Help.MatchStatus({Live: val.mstatus}) == 'yes') {
                        FinalMatchElement.find('.time').addClass('live');
                    }

                    Events.FavoriteCheck({
                        FavoriteList: FavoriteList,
                        BlockClone: FinalMatchElement,
                        id: val.id
                    });


                    $('[data-date=' + DateLine + ']')
                        .find('.app-list-container')
                        .append(FinalMatchElement);

                });

            }
            /* Tournament End */

            /* Team */
            else if (type == 'team' && response.matches.length > 0) {

                response.matches.forEach(function (val) {

                    var FinalBlockList = BlockList.clone();

                    FinalBlockList.find('.link').attr({
                        'href': MatchLink.replace('{matchId}', val.id)
                    });
                    FinalBlockList.find('.b-date').text(Help.DateFormat({Type: 'date', Data: val.starttime}));
                    FinalBlockList.find('.star').attr('data-id', val.id);
                    FinalBlockList.find('.t-home').text(val.team1Name);
                    FinalBlockList.find('.s-home').text(val.mstatus != 0 ? val.score.split('-')[0] : '');
                    FinalBlockList.find('.t-away').text(val.team2Name);
                    FinalBlockList.find('.s-away').text(val.mstatus != 0 ? val.score.split('-')[1] : '');

                    /* Win */
                    if ((TeamId == val.team1Id && val.score.split('-')[0] > val.score.split('-')[1] && val.mstatus != 0) ||
                        (TeamId == val.team2Id && val.score.split('-')[1] > val.score.split('-')[0] && val.mstatus != 0)) {
                        FinalBlockList.find('.score').addClass('win');
                    }
                    else {
                        FinalBlockList.find('.score').removeClass('win').text('');
                    }
                    /* Win End */

                    /* Draw */
                    if ((TeamId == val.team1Id && val.score.split('-')[0] == val.score.split('-')[1] && val.mstatus != 0) ||
                        (TeamId == val.team2Id && val.score.split('-')[0] == val.score.split('-')[1] && val.mstatus != 0)) {
                        FinalBlockList.find('.score').addClass('draw');
                    }
                    else {
                        FinalBlockList.find('.score').removeClass('draw').text('');
                    }
                    /* Draw End */

                    /* Lose */
                    if ((TeamId == val.team1Id && val.score.split('-')[0] < val.score.split('-')[1] && val.mstatus != 0) ||
                        (TeamId == val.team2Id && val.score.split('-')[0] > val.score.split('-')[1] && val.mstatus != 0)) {
                        FinalBlockList.find('.score').addClass('lose');
                    }
                    else {
                        FinalBlockList.find('.score').removeClass('lose').text('');
                    }
                    /* Lose End */

                    /* Scheduled */
                    if (val.mstatus == 0) {
                        FinalBlockList.find('.score').addClass('scheduled');
                    }
                    else {
                        FinalBlockList.find('.score').removeClass('scheduled').text('');
                    }
                    /* Scheduled End */

                    FinalBlockList.find('.win').text('W');
                    FinalBlockList.find('.lose').text('L');
                    FinalBlockList.find('.draw').text('D');
                    FinalBlockList.find('.scheduled').text(Help.DateFormat({Data: val.starttime, Type: 'time'}));

                    Request.Favorites(function () {
                        Events.FavoriteCheck({
                            FavoriteList: FavoriteList,
                            BlockClone: FinalBlockList,
                            id: val.id
                        });
                    });

                    $(PageContent).append(FinalBlockList);
                });
            }
            /* Team End */

            else {
                object.hide();
            }

            object.attr('data-page', page + 1);

        });
    },
    /* Load More End */

    /* Search Post */
    SearchPost: function (object) {

        Help.Loading('show');
        var text = object.val();
        var PostUrl = ApiUrl + (ApiPath.Match.search).replace('{text}', text);
        var Data = {
            lang: Help.LangId(),
            token: Help.Token(),
            portalId: Help.PortalId(),
            sportId: Help.Sport('id'),
        };
        var MatchLink = '/' + Help.Sport('url');
        var BlockClone = $('#serach-element').clone().removeAttr('id').removeClass('display-none');
        var AllContent = $('#search-all-content');
        var TeamsContent = $('#search-teams-content');
        var CompetitionsContent = $('#search-competitions-content');

        AllContent.html('');
        TeamsContent.html('');
        CompetitionsContent.html('');

        $.post(PostUrl, Data, function (response) {
            Help.Loading('hide');
            $('#search-tab-parent').removeClass('display-none');
            if (response.results.length > 0) {
                $('#search-tab-link').removeClass('display-none');

                response.results.forEach(function (val) {

                    console.log(MatchLink);

                    var FinalBlockClone = BlockClone.clone();
                    var FinalAllBlockClone = BlockClone.clone();

                    if (val.type == 'tournament') {
                        var Link = '/tournament/';
                    }
                    else if (val.type == 'team') {
                        var Link = '/team/';
                    }

                    FinalAllBlockClone
                        .find('.link')
                        .attr('href', MatchLink + Link + val.id);

                    FinalAllBlockClone
                        .find('.name')
                        .text(val.name.split(':')[1]);

                    FinalAllBlockClone
                        .find('.sub')
                        .text(val.name.split(':')[0]);

                    AllContent.append(FinalAllBlockClone);

                    if (val.type == 'tournament') {

                        FinalBlockClone
                            .find('.name')
                            .attr('href', MatchLink + '/tournament/' + val.id)
                            .text(val.name.split(':')[1]);
                        FinalBlockClone
                            .find('.sub')
                            .text(val.name.split(':')[0]);

                        CompetitionsContent.append(FinalBlockClone);
                    }

                    else if (val.type == 'team') {

                        FinalBlockClone
                            .find('.name')
                            .attr('href', MatchLink + '/team/' + val.id)
                            .text(val.name.split(':')[1]);
                        FinalBlockClone
                            .find('.sub')
                            .text(val.name.split(':')[0]);

                        TeamsContent.append(FinalBlockClone);
                    }


                })
            }
            else {
                AllContent.html('<div class="no-data mt-0">' + Language[Help.LangName()].MatchNodata + '</div>');
            }

            LanguageChange([
                'txtAll',
                'txtTeams',
                'txtCompetitions',
            ]);

        });

    },
    /* Search Post End */

    /* Date Post */
    MatchDatePost: function (object) {

        if (object.day) {
            var currentTz = localStorage.getItem('TimeZone');
            var momentDate = moment();
            momentDate.utcOffset(currentTz);
            var diffDays = object.day;
            var calendar = moment(object.date).add('days', diffDays);
        }
        else {
            var currentTz = localStorage.getItem('TimeZone');
            var momentDate = moment();
            momentDate.utcOffset(currentTz);
            var calendar = moment(object.date);
            var today = momentDate;
            var diffDays = calendar.diff(today, 'days');
            diffDays = diffDays + 1;
        }

        Help.Loading('show');

        $('#home-page-date')
            .find('.date')
            .text(calendar.format('DD-MM-YYYY'));

        Request.Match(diffDays, function () {

            Help.Loading('hide');
            /* Match List */
            if (DV == 'mobile') {
                Handler.MatchListMobile('all');
            }
            else {
                Handler.MatchList();
            }
            /* Match List End */
        });

    },
    /* Date Post End */

    /* Login */
    LoginModal: function (object) {
        object  =   object ? object : '';
		var Portals = object.params ? object.params : RequestData.Portals[0];

        let serviceBannerEnabled = Portals.params.service_banner_enabled || 0;

        if ( serviceBannerEnabled == 1 || Portals.params.login_over == 'own') {
			Help.Modal('show');
			$('body .js-modal-block .block-container').html('');
			$('body .js-modal-block .block-container').load("/" + PathDir + "/_parts/loginModal.html", function () {

				Help.Loading('hide');
				$("#phone").intlTelInput({
					preferredCountries: [localStorage.getItem('prefered') ? localStorage.getItem('prefered') : 'us'],
					utilsScript: "/style/path/js/utils.js"
				});

				if (Portals.params.service_banner_enabled == 1) {
					$('.login-page .cover').removeClass('display-none');
					$('.login-page .cover figure .img').css('background-image', 'url(' + PortalPath + '/' + Portals.params.service_banner_path + ')');
				}

				if (Portals.params.login_over == 'pars') {
					$('.login-page')
						.find('.button-block')
						.removeClass('display-none');
				}
				else if (Portals.params.login_over == 'own') {
					$('.login-page')
						.find('.form-block.form-number')
						.removeClass('display-none');
				}

				LanguageChange([
					'txtNext',
					'loginButton',
				]);

			});
		} else {
			var obj = $('<div data-type="'+Portals.params.login_over+'"></div>');
			this.Login(obj);
		}
    },
    /* Login End */

    /* Login */
    Login: function (object) {
        var terms = object.attr('data-type');

        if (terms == 'pars') {
            Help.Loading('show');
            Events.LoginPars(object);
        }
        else if (terms == 'own') {
            Events.LoginOwn(object);
        }
        else if (terms == 'finish') {
            Events.LoginFinish(object);
        }

    },
    /* Login End */

    /* Login Pars */
    LoginPars: function (object) {
        var PostUrl = ApiUrl + ApiPath.User.start;
        var Value = {portalId: Help.PortalId()};
        $.post(PostUrl, Value, function (response) {
            Help.Loading('hide');

            if (response.code == 200) {
                window.location.href = response.redirectUrl;
            }
            else {
                if (response.code == 818) {
                    alert('Subscription system (PARS) error. Please try again later');
                }
                else {
                    $('.login-error')
                        .removeClass('display-none')
                        .text('System Error');
                }
            }
            //    todo Language
        });
    },
    /* Login Pars End */

    /* Login Own */
    LoginOwn: function (object) {
        object.parents('.f-element').find('.msisdn').removeClass('border-color29');
        var PostUrl = ApiUrl + ApiPath.User.status;

        if (!object.parents('.f-element').find('.msisdn').intlTelInput('isValidNumber')) {
            $('.login-error')
                .fadeIn()
                .removeClass('display-none')
                .text(Language[Help.LangName()].txtErrorPhoneNumber)
                .delay(2000)
                .fadeOut(100)
        }
        else {
            Help.Loading('show');

            var msisdn = object.parents('.f-element').find('.msisdn').intlTelInput("getNumber");
            msisdn = msisdn.replace('+', '');
            msisdn = $.trim(msisdn);
            var Value = {msisdn: msisdn, clientToken: Help.TokenClient()};

            if (msisdn != "") {
                $.post(PostUrl, Value, function (response) {
                    Help.Loading('hide');

                    localStorage.setItem('number', msisdn);

                    if (response.code == 200) {

                        localStorage.removeItem('transactionId');

                        $('.login-page')
                            .find('.form-block.form-number')
                            .addClass('display-none');
                        $('.login-page')
                            .find('.form-block.form-number-code')
                            .removeClass('display-none');
                    }
                    else if (response.code == 404) {

                        $('.login-page')
                            .find('.form-block.form-number')
                            .addClass('display-none');
                        $('.login-page')
                            .find('.cover')
                            .addClass('display-none');

                        if (response.portals.length > 1) {
                            var portalContainer = $('.login-page').find('#app-container');
                            var list = $('.login-page').find('#app-list').clone().removeAttr('id').removeClass('display-none');
                            portalContainer.removeClass('display-none');
                            portalContainer.removeClass('display-none');

                            LanguageChange(['portalSelectionHead']);
                            response.portals.forEach(function (val) {
                                var finalList = list.clone();
                                finalList
                                    .find('.img')
                                    .css('background-image', 'url(' + PortalPath + '/' + val.logo + ')');
                                finalList
                                    .find('.name')
                                    .text(val.name);
                                finalList
                                    .attr('data-id', val.id);

                                portalContainer.find('.content').append(finalList);
                            });
                        }
                        else {
                            var id = response.portals[0].id;
                            Events.LoginPortal({id: id});
                        }

                    }
                    else {
                        if (response.code == 818) {
                            alert('Subscription system (PARS) error. Please try again later');
                        }
                        else {
                            $('.login-error')
                                .removeClass('display-none')
                                .text('System Error');
                        }
                    }
                });
            }
            else {
                object.parents('.f-element').find('.msisdn').addClass('border-color29');
            }
        }
    },
    /* Login Own End */

    /* Login Finish */
    LoginFinish: function (object) {
        var code = object.parents('.f-element').find('input.number').val();
        var transactionId = localStorage.getItem('transactionId');
        var number = localStorage.getItem('number');
        var clientToken = localStorage.getItem('clientToken');

        if (number != "" && !transactionId) {
            var PostUrl = ApiUrl + ApiPath.User.login;
            var Value = {msisdn: number, otp: code, clientToken: clientToken};
        }
        else if (transactionId) {
            var PostUrl = ApiUrl + ApiPath.User.sms;
            var Value = {transactionId: transactionId, code: code, clientToken: clientToken};
        }

        Help.Loading('show');
        $.post(PostUrl, Value, function (response) {
            console.log(response);
            if (response.code == 200 && response.token) {
                localStorage.setItem('userToken', response.token);
                localStorage.removeItem('transactionId');

                // var PostUrl = ApiUrl + ApiPath.User.setLang;
                // var Value = {token: Help.Token(), langId: 12};
                // $.post(PostUrl, Value, function (response) {
                //
                // });

                window.location.reload();

            }
            else {
                Help.Loading('hide');
                $('.login-error')
                    .removeClass('display-none')
                    .fadeIn(100)
                    .text(Language[Help.LangName()].txtSubscriptionSystemError)
                    .delay(2000)
                    .fadeOut(100);
            }
            //    todo langugage
        });
    },
    /* Login Finish End */

    /* Login Portal */
    LoginPortal: function (object) {
        var portalId = object.id ? object.id : object.data('id');
        var number = localStorage.getItem('number');
        var PostUrl = ApiUrl + ApiPath.User.register;
        var Value = {msisdn: number, lang: Help.LangId(), portalId: portalId};

        Help.Loading('show');
        $.post(PostUrl, Value, function (response) {
            Help.Loading('hide');
            console.log(response);
            if (response.code == 200) {
                localStorage.setItem('transactionId', response.transactionId);
                $('.login-page')
                    .find('.portal-list-block')
                    .addClass('display-none');
                $('.login-page')
                    .find('.form-number-code')
                    .removeClass('display-none');
                $('.login-page')
                    .find('.cover')
                    .removeClass('display-none');
            }
            else {

            }
        });

    },
    /* Login Portal End */

    /* logout */
    Logout: function () {
        var PostUrl = ApiUrl + ApiPath.User.logout;
        var Value = {token: Help.Token()};
        $.post(PostUrl, Value, function (response) {
            if (response.code == 200) {
                Help.Loading('show');
                var Storage = ['userToken', 'transactionId', 'clientToken', 'Language', 'LanguageCode'];
                Storage.forEach(function (val) {
                    localStorage.removeItem(val);
                });
                window.location.replace('/');
            }
        });
    },
    /* logout End */

    /* Favorite */
    Favorite: function (object) {

        if (DV == 'desktop') {
            $('#favorite-text').removeClass('display-none');
        }
        var Value = {token: Help.Token(), elementType: object.elementType, elementId: object.elementId};
        var count = parseInt($('#favorite-text span').text());
        var myGames = parseInt(localStorage.getItem('myGames'));

        if (Help.Token()) {
            if (object.elementTerms == 1) {

                if (object.elementType == 'tournament') {
                    var tournamentCount = $('#app-round-tournament .list').length;
                    if (tournamentCount == 0) {
                        $('#app-round-tournament').removeClass('display-none');
                        $('#no-tournament').addClass('display-none');
                    }
                }

                if (object.elementType == 'team') {
                    var teamCount = $('#app-round-team .list').length;
                    if (teamCount == 0) {
                        $('#app-round-team').removeClass('display-none');
                        $('#no-team').addClass('display-none');
                    }
                }

                if (object.elementType == 'match') {
                    $('#favorite-text span').text(count + 1);
                }
                var PostUrl = ApiUrl + ApiPath.Favorites.add;
            }

            else if (object.elementTerms == 0) {

                if (object.elementType == 'match') {

                    if (object.elementMyGames == 'yes') {
                        $('[data-matchid=' + object.elementId + ']')
                            .stop()
                            .animate({
                                marginLeft: '-10px'
                            }, 100)
                            .fadeOut(100, function () {
                                $('[data-matchid=' + object.elementId + ']').remove();
                            });
                    }
                }
                else if (object.elementType == 'tournament') {

                    var tournamentCount = $('#app-round-tournament .list').length;

                    if (tournamentCount == 1) {
                        $('#app-round-tournament').addClass('display-none');
                        $('#no-tournament').removeClass('display-none');
                    }

                    $('#app-round-tournament [data-tournamentid=' + object.elementId + ']')
                        .stop()
                        .animate({
                            marginLeft: '-10px'
                        }, 100)
                        .fadeOut(100, function () {
                            $('#app-round-tournament [data-tournamentid=' + object.elementId + ']').remove();
                        });
                }
                else if (object.elementType == 'team') {

                    var teamCount = $('#app-round-team .list').length;

                    if (teamCount == 1) {
                        $('#app-round-team').addClass('display-none');
                        $('#no-team').removeClass('display-none');
                    }

                    $('#app-round-team [data-teamid=' + object.elementId + ']')
                        .stop()
                        .animate({
                            marginLeft: '-10px'
                        }, 100)
                        .fadeOut(100, function () {
                            $('#app-round-team [data-teamid=' + object.elementId + ']').remove();
                        });
                }

                if (object.elementType == 'match') {
                    $('#favorite-text span').text(count > 0 ? count - 1 : 0);
                }
                var PostUrl = ApiUrl + ApiPath.Favorites.delete;
            }

            $.post(PostUrl, Value, function (response) {
                if (object.elementTerms == 1) {
                    Handler.FavoriteList(['tournament', 'team', 'match']);
                }
            });
        }
        else {

            if (count < 1 && object.elementType == 'match') {
                if (object.elementTerms == 1) {
                    $('#favorite-text span').text(count + 1);
                    localStorage.setItem('myGames', object.elementId);
                }
                else if (object.elementTerms == 0) {
                    $('#favorite-text span').text(count > 0 ? count - 1 : 0);
                    localStorage.removeItem('myGames');
                }

                var PostUrl = ApiUrl + ApiPath.Match.matchDetailsByIdList.replace('{sportId}', Help.Sport('id'));
                var Value = {lang: Help.LangId(), uniqueIds: object.elementId, timezone: Help.TimeZone()};

                $.post(PostUrl, Value, function (response) {

                    Events.MyGamesList({
                        Lists: response.matches,
                        Login: 'No'
                    });

                });

            }
            else {

                if (object.elementTerms == 0) {
                    $('#favorite-text span').text(count > 0 ? count - 1 : 0);
                    localStorage.removeItem('myGames');
                }

                $('.app-match-my-games').html('');
                object.element.removeClass('active');
                object.element.find('.icon').removeClass('icon-top-favourite-selected');
                object.element.find('.icon').addClass('icon-top-favourite-selected');
                if (myGames != parseInt(object.elementId)) {
                    if (DV == 'mobile') {
                        $('.js-login-modal').trigger('click');
                    }
                    else {
                        $('#login-button').trigger('click');
                    }

                }

                console.log(localStorage.getItem('myGames') + ' ' + object.elementId);

            }


            // if ( count < 1 && object.elementType == 'match' ) {
            //     if ( object.elementTerms == 1 ) {
            //         $('#favorite-text span').text(count + 1);
            //         localStorage.setItem('myGames', object.elementId);
            //     }
            //     else if ( object.elementTerms == 0 ) {
            //         $('#favorite-text span').text(count > 0 ? count - 1 : 0);
            //         localStorage.removeItem('myGames');
            //     }
            //
            // }
            // else {
            //     alert(myGames +' '+ object.elementId);
            //     console.log(localStorage.getItem('myGames')+' '+object.elementId);
            //
            //     $('.app-match-my-games').html('');
            //
            //     object.element.removeClass('active');
            //     object.element.find('.icon').removeClass('icon-top-favourite-selected');
            //     object.element.find('.icon').addClass('icon-top-favourite-selected');
            //     if ( myGames !=  parseInt(object.elementId) ) {
            //         $('#login-button').trigger('click');
            //     }
            //
            //
            // }
        }
    },
    /* Favorite End */

    /* Uploads */
    UploadImages: function (e, object) {
        var content = $('.upload-images');
        var defaultImages = object.data('images');
        var imgVal = object.val();
        var imgExtension = ((/[.]/.exec(imgVal)) ? (/[^.]+$/.exec(imgVal)) : '');
        var acceptExtension = ["png", "PNG", "Png", "jpeg", "jpg", "JPG", "JPEG", "Jpeg", "Jpg"];
        var imgType = $.inArray("" + imgExtension + "", acceptExtension);

        if (imgType < 0) {
            content
                .find('.img')
                .css('background-image', 'url(' + defaultImages + ')');
        }
        else {
            var input = $(e.currentTarget);
            var file = input[0].files[0];
            reader = new FileReader();

            reader.onload = function (a) {
                image_base64 = a.target.result;
                if (image_base64.length > 500) {
                    content
                        .find('.img')
                        .css('background-image', 'url(' + image_base64 + ')');
                    $('.js-form-submit').attr('data-images', 1);
                    $('.js-form-submit').trigger('submit');
                }
            }
            reader.readAsDataURL(file);
        }
    },
    /* Uploads End */

    /* Form */
    Form: function (object) {
        var data = new FormData(object[0]);
        var images = object.attr('data-images') ? object.attr('data-images') : 0;
        var Value = data;
        object.find('input[name=username]').removeClass('_redBorder');
        Help.Loading('show');
        if (images == 1) {
            var PostUrl = ApiUrl + ApiPath.User.setAvatar;
            $.ajax({
                url: PostUrl,
                type: "POST",
                data: Value,
                contentType: false,
                processData: false,
                success: function (response) {
                    Help.Redirect();
                }
            });
        }
        else {

            var user_name = object.find('input[name=username]').val();
            user_name = $.trim(user_name);

            if (!user_name) {
                Help.Loading('hide');
                object.find('input[name=username]').addClass('_redBorder');
            } else {
                Events.setUsername(object, function (res) {
                    if (res.code == 300) {
                        Help.Loading('hide');
                        $('.__form_note').text(Language[Help.LangName()].txtUsernameUsed).fadeIn(100).delay(2000).fadeOut(100);
                    }
                    else {
                        Events.setUserLanguage(object);
                    }
                })
            }
        }
    },
    setUsername: function (object, callback) {
        var username = object.find('input[name=username]').val();
        var apiUrl = ApiUrl + ApiPath.User.username;
        var apiValue = {username: username, token: Help.Token()};
        $.post(apiUrl, apiValue, function (res) {
            callback(res);
        });
    },
    setUserLanguage: function (object) {
        var lang = object.find('select[name=langId]').val().split('-');
        var langId = lang[0];
        var langCode = lang[1];
        var apiUrl = ApiUrl + ApiPath.User.setLang;
        var apiValue = {langId: langId, token: Help.Token()};
        $.post(apiUrl, apiValue, function (res) {
            if (res.code == 200) {
                localStorage.setItem('Language', langId);
                localStorage.setItem('LanguageCode', langCode);
                Help.Loading('hide');
                Help.Redirect();
            }
        });
    },
    /* Form End */

    /* Mobile Language */
    MobileLanguage: function () {

        Help.Modal('show');
        $('body .js-modal-block .block-container').html('');
        $('body .js-modal-block .block-container').load("/" + PathDir + "/_parts/languageModal.html", function () {

            Request.AppData(function () {

                var langContent = $('#m-lang-content');
                var langOption = $('#m-lang-list').clone().removeAttr('id').removeClass('display-none');
                RequestData.Language.forEach(function (val) {
                    console.log(val);
                    var finalLangOption = langOption.clone();
                    finalLangOption.attr('data-value', val.id + '-' + val.code);
                    finalLangOption.text(val.name);
                    if (val.code == localStorage.getItem('LanguageCode')) {
                        finalLangOption.addClass('active');
                    }
                    langContent.append(finalLangOption);
                });

                LanguageChange([
                    'txtChangeLang'
                ]);

            });


        });

    },
    /* Mobile Language End */

    /* Mobile Settings */
    MobileSettings: (object) => {
        const terms = object.attr('data-terms');
        const contentSection = $('body .js-modal-block .block-container');
        Help.Modal('show');
        contentSection.html('');
        contentSection.load("/" + PathDir + "/_parts/settingText.html", () => {
            Help.requset({
                url: ApiUrl + ApiPath.General.portalPage,
                value: {
                    'portalId': Help.PortalId(),
                    'lang': Help.LangId(),
                    'pagePath': terms,
                },
                type: 'post',
                callback: res => {
                    const head  = res.title ? res.title : '';
                    const text = res.text ? res.text : '';
                    const section = $('[data-dom=setting]');
                    section.find('[data-dom=head]').html(head);
                    section.find('[data-dom=text]').html(text);
                }
            });
        });
    },
    /* Mobile Settings End */

    /* Mobile Current */
    MobileCurrentTime: function () {
        Help.Modal('show');
        $('body .js-modal-block .block-container').html('');
        $('body .js-modal-block .block-container').load("/" + PathDir + "/_parts/currentTimeModal.html", function () {
            Events.CurrentTimeList();

            $('#home-page-date')
                .find('.date')
                .text(moment().format('DD-MM-YYYY'));
            LanguageChange([
                'txtCurrentTime'
            ]);
        });
    },
    /* Mobile Current End */

    /* Favorite Checked */
    FavoriteCheck: function (object) {
        if (object.FavoriteList.matches.indexOf(object.id) > 0) {
            object.BlockClone.find('.star')
                .addClass('active')
                .attr('data-terms', 0);
            object.BlockClone.find('.star .icon')
                .removeClass('icon-top-favourite-selected')
                .addClass('icon-top-favourite-selected');
        }
        else {
            object.BlockClone.find('.star')
                .removeClass('active')
                .attr('data-terms', 1);
            object.BlockClone.find('.star .icon')
                .removeClass('icon-top-favourite-selected')
                .addClass('icon-top-favourite-selected');
        }
    },
    /* Favorite Checked End */

    /* Desktop List Match */
    DesktopListMatch: function (object) {

        object.Content.html('');

        if (Object.keys(object.Lists).length > 0) {
            Object.keys(object.Lists).forEach(function (val) {

                var Data = object.Lists[val];
                var TournamentHolder = object.Content.find('[data-tournamentId=' + Data.tournamentId + ']');

                if (!TournamentHolder.length) {
                    var BlockClone = object.TableList.clone();
                    BlockClone.attr('data-tournamentId', Data.tournamentId);
                    BlockClone.find('.list-head .photo').attr('src', object.PhotoLink.replace("{categoryCode}", Data.categoryCode));
                    BlockClone.find('.list-head .name span').html(Data.categoryName + ':&nbsp;');
                    BlockClone.find('.list-head .star').attr({'data-id': Data.tournamentId});


                    BlockClone.find('.list-head .name a').text(Data.tournamentName);
                    BlockClone.find('.list-head .name a').attr({
                        'href': object.TournamentLink.replace('{tournamentId}', Data.tournamentId),
                        'data-router': object.TournamentLink.replace('{tournamentId}', Data.tournamentId)
                    });

                    if (object.FavoriteList.tournaments.indexOf(Data.tournamentId) > -1) {
                        BlockClone.find('.list-head .star')
                            .attr('data-terms', 0)
                            .addClass('active');
                        BlockClone.find('.list-head .star .icon')
                            .removeClass('icon-top-favourite-selected')
                            .addClass('icon-top-favourite-selected');
                        object.Content.prepend(BlockClone);
                    } else {
                        BlockClone.find('.list-head .star')
                            .attr('data-terms', 1)
                            .removeClass('active');
                        BlockClone.find('.list-head .star .icon')
                            .removeClass('icon-top-favourite-selected')
                            .addClass('icon-top-favourite-selected');
                        object.Content.append(BlockClone);
                    }
                    TournamentHolder = BlockClone;
                }

                var MatchClone = object.MatchElement.clone();
                MatchClone.find('.__match_list_block').attr('data-matchId', Data.id);
                MatchClone.find('.list .link').attr({
                    'href': object.MatchLink.replace('{matchId}', Data.id),
                    'data-router': object.MatchLink.replace('{matchId}', Data.id)
                });

                MatchClone.find('.list .time').text(Help.GetMatchTime({
                    preidoTime: Data.periodStartTime,
                    startTime: Data.starttime,
                    currentStatus: Data.mstatus
                }));

                MatchClone.find('.list .time').removeClass('live');
                if (Help.MatchStatus({Live: Data.mstatus}) == 'yes') {
                    MatchClone.find('.list .time').addClass('live');
                }
                else {
                    MatchClone.find('.list .time').removeClass('live');
                }

                if (Help.MatchStatus({NotStarted: 'Yes'}).indexOf(Data.mstatus) < 0) {
                    MatchClone.find('.list .score .home').text(Data.score.split('-')[0]);
                    MatchClone.find('.list .score .away').text(Data.score.split('-')[1]);
                }

                MatchClone.find('.list .star').attr('data-id', Data.id);
                MatchClone.find('.list .team-home').text(Data.team1Name);
                MatchClone.find('.list .team-away').text(Data.team2Name);

                TournamentHolder.append(MatchClone);

                if (object.FavoriteList.matches.indexOf(Data.id) > -1) {
                    MatchClone.find('.list .star')
                        .attr('data-terms', 0)
                        .addClass('active');
                    MatchClone.find('.list .star .icon')
                        .removeClass('icon-top-favourite-selected')
                        .addClass('icon-top-favourite-selected')
                    object.Content.prepend(TournamentHolder);
                }
                else if (localStorage.getItem('myGames')) {
                    TournamentHolder.find('.__match_list_block[data-matchid=' + localStorage.getItem('myGames') + ']').find('.list .star')
                        .attr('data-terms', 0)
                        .addClass('active');
                    TournamentHolder.find('.__match_list_block[data-matchid=' + localStorage.getItem('myGames') + ']').find('.list .star .icon')
                        .removeClass('icon-top-favourite-selected')
                        .addClass('icon-top-favourite-selected')
                    object.Content.append(TournamentHolder);
                }
                else {
                    MatchClone.find('.list .star')
                        .attr('data-terms', 1)
                        .removeClass('active');
                    MatchClone.find('.list .star .icon')
                        .removeClass('icon-top-favourite-selected')
                        .addClass('icon-top-favourite-selected')
                }
            });
        }
        else {
            if (object.Name == 'Live') {
                langText = 'liveNodata';
            }
            else if (object.Name == 'MyGames') {
                langText = 'myGamesNodata';
            }
            else {
                langText = 'MatchNodata';
            }
            object.Content.html('<div class="no-data mt-0" data-lang="' + langText + '"></div>');

            LanguageChange(['liveNodata']);
        }
    },
    /* Desktop List Match End */

    /* Mobile List Match */
    MobileListMatch: function (object) {
        if (Object.keys(object.Requiest).length > 0) {
            Object.keys(object.Requiest).forEach(function (key) {
                var data = object.Requiest[key];

                var tournameHolder = object.parent.find('[data-tournameid=' + data.tournamentId + ']');

                if (!tournameHolder.length) {

                    var tournamentList = object.tournamentBlock.clone();

                    tournamentList
                        .attr('data-tournameid', data.tournamentId);

                    tournamentList
                        .find('.head .photo').attr('src', object.photoLink.replace("{categoryCode}", data.categoryCode));

                    tournamentList
                        .find('.h')
                        .text(data.categoryName + ": " + data.tournamentName)
                        .attr({
                            'href': object.tournamentLink.replace('{tournamentId}', data.tournamentId),
                            'data-router': object.tournamentLink.replace('{tournamentId}', data.tournamentId)
                        });

                    tournamentList
                        .find('.time')
                        .text(Help.DateFormat({
                            Data: object.Requiest[key].starttime,
                            Type: 'date'
                        }));

                    if (FavoriteList.tournaments.indexOf(data.tournamentId) > -1) {
                        tournamentList.find('.list-head .star')
                            .attr('data-terms', 0)
                            .addClass('active');
                        tournamentList.find('.list-head .star .icon')
                            .removeClass('icon-top-favourite-selected')
                            .addClass('icon-top-favourite-selected');
                        object.parent.prepend(tournamentList);
                    } else {
                        tournamentList.find('.list-head .star')
                            .attr('data-terms', 1)
                            .removeClass('active');
                        tournamentList.find('.list-head .star .icon')
                            .removeClass('icon-top-favourite-selected')
                            .addClass('icon-top-favourite-selected');
                        object.parent.append(tournamentList);
                    }

                    tournameHolder = tournamentList;
                }

                var finalMatchBlock = object.matchBlock.clone();

                finalMatchBlock.attr('data-matchid', data.id);

                /* Match Link */
                finalMatchBlock
                    .find('.link')
                    .attr({
                        'href': object.matchLink.replace('{matchId}', data.id),
                        'data-router': object.matchLink.replace('{matchId}', data.id)
                    });
                /* Match Star */
                finalMatchBlock
                    .find('.star')
                    .attr('data-id', data.id);

                /* Match Name */
                if (Help.MatchStatus({NotStarted: 'Yes'}).indexOf(data.mstatus) < 0) {
                    finalMatchBlock
                        .find('.teams .t-home .num')
                        .text(data.score.split('-')[0]);
                    finalMatchBlock
                        .find('.teams .t-away .num')
                        .text(data.score.split('-')[1] ? data.score.split('-')[1] : '');
                }
                finalMatchBlock
                    .find('.teams .t-home .name')
                    .text(data.team1Name);
                finalMatchBlock
                    .find('.teams .t-away .name')
                    .text(data.team2Name);

                /* Match Date */
                finalMatchBlock.find('.date').removeClass('live');
                if (Help.MatchStatus({Live: data.mstatus}) == 'yes') {
                    finalMatchBlock.find('.date').addClass('live');
                }
                else {
                    finalMatchBlock.find('.date').removeClass('live');
                }
                finalMatchBlock
                    .find('.date')
                    .text(Help.GetMatchTime({
                        preidoTime: data.periodStartTime,
                        startTime: data.starttime,
                        currentStatus: data.mstatus
                    }));

                tournameHolder.find('.block-content').append(finalMatchBlock);

                if (FavoriteList.matches.indexOf(data.id) > -1) {
                    finalMatchBlock.find('.star')
                        .attr('data-terms', 0)
                        .addClass('active');
                    finalMatchBlock.find('.star .icon')
                        .removeClass('icon-top-favourite-selected')
                        .addClass('icon-top-favourite-selected');
                    object.parent.prepend(tournameHolder);
                }
                else if (localStorage.getItem('myGames')) {
                    $('[data-matchid=' + localStorage.getItem('myGames') + ']').find('.star')
                        .attr('data-terms', 0)
                        .addClass('active');
                    $('[data-matchid=' + localStorage.getItem('myGames') + ']').find('.star .icon')
                        .removeClass('icon-top-favourite-selected')
                        .addClass('icon-top-favourite-selected')
                    object.parent.append(tournameHolder);
                }
                else {
                    finalMatchBlock.find('.star')
                        .attr('data-terms', 1)
                        .removeClass('active');
                    finalMatchBlock.find('.star .icon')
                        .removeClass('icon-top-favourite-selected')
                        .addClass('icon-top-favourite-selected')
                }

            });
        }
        else {
            object.parent.html('<div class="error-default">No matches found</div>');
        }
    },
    /* Mobile List Match End */

    /* My Games List */
    MyGamesList: function (object) {

        var MatchLink = '/' + Help.Sport('url') + UrlPath.Module.match;
        if (DV == 'mobile') {
            var MatchContent = $('#app-match-content');
            var MatchList = $('#app-match-list').clone().removeAttr('id').removeClass('display-none');
            MatchContent.html('');
        }
        else {
            var Container = $('.app-match-my-games');
            var MatchContent = $('#app-match-content').clone().removeAttr('id').removeClass('display-none');
            var MatchList = $('#app-match-list').clone().removeAttr('id').removeClass('display-none');
            Container.html('');
        }

        var Lists = object.Lists ? object.Lists : 0;

        if (Lists.length > 0) {

            object.Lists.forEach(function (val) {

                if (object.Login == 'Yes') {
                    var data = val.payload;
                }
                else {
                    var data = val;
                    data.team1 = data.team1Name;
                    data.team2 = data.team2Name;
                    data.status = data.mstatus;
                }

                var FinalMatchContent = MatchContent.clone();
                var FinalMatchList = MatchList.clone();
                FinalMatchContent
                    .find('.list-head')
                    .hide();

                FinalMatchList
                    .find('.list .link')
                    .attr({
                        'href': MatchLink.replace('{matchId}', data.id),
                        'data-router': MatchLink.replace('{matchId}', data.id)
                    });

                FinalMatchList.attr('data-matchid', data.id);
                FinalMatchList.find('.list .star')
                    .addClass('active')
                    .attr({
                        'data-id': 2,
                        'data-type': 'match',
                        'data-terms': 0,
                        'data-mygames': 'yes'
                    });
                FinalMatchList.find('.list .star .icon')
                    .removeClass('icon-top-favourite-selected')
                    .addClass('icon-top-favourite-selected');

                /* Match Date */
                FinalMatchList.find('.list .time').text(Help.GetMatchTime({
                    preidoTime: data.periodStartTime,
                    startTime: data.starttime,
                    currentStatus: parseInt(data.status)
                }));

                if (Help.MatchStatus({NotStarted: 'Yes'}).indexOf(parseInt(data.status)) < 0) {
                    FinalMatchList.find('.list .score .home').text(data.score.split('-')[0]);
                    FinalMatchList.find('.list .score .away').text(data.score.split('-')[1]);
                }

                FinalMatchList.find('.list .star').attr('data-id', data.id);
                FinalMatchList.find('.list .team-home').text(data.team1);
                FinalMatchList.find('.list .team-away').text(data.team2);

                FinalMatchList.find('.list .time').removeClass('live');
                if (Help.MatchStatus({Live: parseInt(data.status)}) == 'yes') {
                    FinalMatchList.find('.list .time').addClass('live');
                }
                else {
                    FinalMatchList.find('.list .time').removeClass('live');
                }

                if (DV == 'mobile') {
                    if (!MatchContent.find('[data-matchid=' + data.id + ']').length) {
                        MatchContent.append(FinalMatchList);
                    }
                }
                else {
                    if (!FinalMatchContent.find('[data-matchid=' + data.id + ']').length) {
                        FinalMatchContent.append(FinalMatchList);
                        Container.append(FinalMatchContent);
                    }
                }

            });
        }
        else {

            if (DV == 'mobile') {
                MatchContent.html('<div class="error-default" data-lang="myGamesNodata"></div>');
            }
            else {

                Container.html('<div class="no-data mt-0 mt-0" data-lang="myGamesNodata"></div>')
            }

            LanguageChange(['myGamesNodata']);
        }
    },
    /* My Games List End */

    /* Prediction Form */
    PredictionForm: function (object) {

        if (Help.Token()) {
            var form = object.parents('.js-prediction-form');
            var matchId = form.find('#match-form-id').val();
            var type = form.find('[data-name=prType].active').attr('data-value');
            var value = form.find('#' + type + ' [data-name=prValue].active').attr('data-value');
            var amount = form.find('#' + type + ' input[name=amount]').val();
            var data = {
                token: Help.Token(),
                matchId: matchId,
                predictionType: type,
                predictionValue: value,
                predictionAmount: amount
            };
            var PostUrl = ApiUrl + ApiPath.Predictions.add;


            if (!type) {
                form.find('#' + type + ' [data-name=prType]').parents('.js-element').fadeOut(100).fadeIn(100);
            }
            else if (!value) {
                form.find('#' + type + ' [data-name=prValue]').parents('.js-element').fadeOut(100).fadeIn(100);
            }
            else if (!amount) {
                form.find('#' + type + ' input[name=amount]').addClass('warning-bg');
                form.find('#' + type + ' input[name=amount]').parents('.js-element').fadeOut(100).fadeIn(100);
            }
            else {
                Help.Loading('show');

                $.post(PostUrl, data, function (response) {
                    if (response.code == 200) {
                        Help.Loading('hide');
                        $('#' + type).addClass('display-none');
                        $('#pr-container .n-text').remove();
                        $('#' + type + '_info').removeClass('display-none');
                        var Data = {id: matchId};
                        Events.MatchPredictionInfo(Data);
                        Handler.PredictionList('prepend');
                        Events.UserProfileReset({
                            coinsReset: true
                        });
                    }
                });
            }
        }
        else {
            $('.js-login-modal').trigger('click');
        }

    },
    /* Prediction Form End */

    /* Prediction Remove */
    PredictionRemove: function (object) {
        var id = object.attr('data-id');
        var type = object.data('type');
        var parent = object.data('parent') ? object.data('parent') : '';
        var terms = object.data('terms') ? object.data('terms') : '';
        if (terms == 'delete') {
            var PostUrl = ApiUrl + ApiPath.Predictions.delete;
        }
        else if (terms == 'archive') {
            var PostUrl = ApiUrl + ApiPath.Predictions.archive;
        }

        var Value = {token: Help.Token(), predictionId: id};


        if (terms == 'delete' || terms == 'archive') {
            Help.Modal('hide');
            Help.Loading('show');
            $.post(PostUrl, Value, function (response) {
                Help.Loading('hide');
                if (response.code == 200) {

                    Events.UserProfileReset({
                        coinsReset: true
                    });

                    if (parent) {
                        $(parent).find('[data-productid=' + id + ']').remove();
                        var listCount = $(parent).find('.pr-match-list').length;
                        if (listCount < 1) {
                            $(parent).find('.no-data').removeClass('display-none');
                        }

                        if (parent == '#pr-new-contain') {
                            $('#pr-container')
                                .find('[data-predictionid=' + id + ']').remove();
                            if (listCount < 1) {
                                $('#pr-container').html('<div class="n-text">' + Language[Help.LangName()].txtNotPredictionMatch + '</div>');
                            }
                        }
                        Handler.PredictionList();
                    }
                    else {
                        $('#' + type).removeClass('display-none');
                        $('#' + type + '_info').addClass('display-none');
                        var listCount = $('#pr-container').find('.list').length;

                        $('#pr-container')
                            .find('[data-predictionid=' + id + ']').remove();
                        if (listCount < 1) {
                            $('#pr-container').html('<div class="n-text">' + Language[Help.LangName()].txtNotPredictionMatch + '</div>');
                        }
                        Handler.PredictionList();
                    }
                }
            });
        }
        else {
            Help.Modal('show');
            $('body .js-modal-block .block-container').html('');
            $('body .js-modal-block .block-container').load("/" + PathDir + "/_parts/notficationModal.html", function () {
                $('.notfication-modal .head').html(Language[Help.LangName()].txtCnProdictionHead);
                $('.notfication-modal .text').html(Language[Help.LangName()].txtCnProdictionText);
                $('.notfication-modal .button-success')
                    .attr({'data-id': id, 'data-type': type, 'data-terms': 'delete', 'data-parent': parent})
                    .addClass('js-pr-remove')
                    .html(Language[Help.LangName()].txtYes);
                $('.notfication-modal .button-danger').html(Language[Help.LangName()].txtNo);
            });
        }

    },
    /* Prediction Remove End */

    /* User Profile Reset */
    UserProfileReset: function (object) {
        var apiUrl = ApiUrl + ApiPath.User.me;
        var apiValue = {token: Help.Token()};
        var request = $.post(apiUrl, apiValue);

        /* Success Request */
        request.done((response) => {
            var user    =   response.user;
            if ( object.coinsReset == true ) {
                $('.__user-coins').text(user.score);
            }
        });
        /* Error Request */
        request.fail((err) => {
            console.log('User Me Api:');
            console.log(err);
        });
    },
    /* User Profile Reset End */

    /* Live Match */
    LiveMatch: function () {
        var object = $('.__match_page_minutes').length ? $('.__match_page_minutes') : '';

        if (object) {
            var id = Help.Url(3);
            var PostUrl = ApiUrl + ApiPath.Match.LiveOnline.replace('{sportId}', Help.Sport('id'));
            var Value = {timezone: Help.TimeZone(), token: Help.Token()};
            $.post(PostUrl, Value, function (response) {
                var object = response.matches;

                object.forEach(function (val) {
                    if (val.id == id) {

                        var __matchId   =   $('.list[data-matchid='+val.id+']');
                        if (__matchId.length) {
                            __matchId.find('.__score').text(Help.GetMatchTime({
                                preidoTime: val.periodStartTime,
                                startTime: val.periodStartTime,
                                currentStatus: val.mstatus
                            }));
                        }

                        $('.__match_page_minutes').text(Help.GetMatchTime({
                            preidoTime: val.periodStartTime,
                            startTime: val.periodStartTime,
                            currentStatus: val.mstatus
                        }));

                        if (Help.MatchStatus({NotStarted: 'Yes'}).indexOf(val.mstatus) < 0) {
                            $('.__home-num').text(val.score.split('-')[0]);
                            $('.__away-num').text(val.score.split('-')[1]);
                        }
                    }
                })
            });
        }
        else {
            var PostUrl = ApiUrl + ApiPath.Match.LiveOnline.replace('{sportId}', Help.Sport('id'));
            var Value = {timezone: Help.TimeZone(), token: Help.Token()};
            $.post(PostUrl, Value, function (response) {

                response.matches.forEach(function (val) {

                    if (DV == 'mobile') {
                        var Block = $('.list[data-matchid=' + val.id + ']');
                        if (Help.MatchStatus({NotStarted: 'Yes'}).indexOf(val.mstatus) < 0) {
                            Block
                                .find('.teams .t-home .__t-home-num')
                                .text(val.score.split('-')[0]);
                            Block
                                .find('.teams .t-away .__t-away-num')
                                .text(val.score.split('-')[1] ? val.score.split('-')[1] : '');
                        }
                        Block.find('.__t-time').text(Help.GetMatchTime({
                            preidoTime: val.periodStartTime,
                            startTime: val.periodStartTime,
                            currentStatus: val.mstatus
                        }));
                    }
                    else {
                        var Block = $('.__match_list_block[data-matchid=' + val.id + ']');
                        if (Block.length) {
                            Block.find('.__t-time').text(Help.GetMatchTime({
                                preidoTime: val.periodStartTime,
                                startTime: val.periodStartTime,
                                currentStatus: val.mstatus
                            }));
                            if (Help.MatchStatus({NotStarted: 'Yes'}).indexOf(val.mstatus) < 0) {
                                Block.find('.score .__home-num').text(val.score.split('-')[0]);
                                Block.find('.score .__away-num').text(val.score.split('-')[1]);
                            }
                        }
                    }

                });

            });
        }
    },
    /* Live Match End */

    /* Match Prediction Add */
    MatchPredictionAdd: function (Data) {
        var PostUrl = ApiUrl + ApiPath.Predictions.odds.replace('{matchId}', Data.id);
        var Value = {token: Help.Token()};

        $.post(PostUrl, Value, function (response) {

            var odds = response.matchOdds ? response.matchOdds : 0;

            if (Data.mstatus == 0) {
                if (odds.length) {
                    var data = odds[0];

                    if (data.ftHome && data.ftDraw && data.ftAway) {
                        $('#ft_win .pr-content ._ftHome').text(data.ftHome);
                        $('#ft_win .pr-content ._ftDraw').text(data.ftDraw);
                        $('#ft_win .pr-content ._ftAway').text(data.ftAway);
                    }
                    else {
                        $('#ft_win').remove();
                        $('#ft_win_info').remove();
                    }

                    if (data.htHome && data.htDraw && data.htAway) {
                        $('#ht_win .pr-content ._htHome').text(data.htHome);
                        $('#ht_win .pr-content ._htDraw').text(data.htDraw);
                        $('#ht_win .pr-content ._htAway').text(data.htAway);
                    }
                    else {
                        $('#ht_win').remove();
                        $('#ht_win_info').remove();
                    }

                    if (!data.htHome && !data.htDraw && !data.htAway) {
                        $('.js-element-active[data-value=ht_win]').remove();
                        $('.js-element-active[data-value=ft_win]')
                            .css('width', '100%')
                            .addClass('active');
                        $('#ft_win').parents('.js-match-info-child').addClass('active');
                    }
                    else if (!data.htHome && !data.htDraw && !data.htAway) {
                        $('.js-element-active[data-value=ht_win]').remove();
                        $('.js-element-active[data-value=ft_win]')
                            .css('width', '100%')
                            .addClass('active');
                        $('#ft_win').parents('.js-match-info-child').addClass('active');
                    }
                }
            }
            else {
                $('#prediction-tab-content').remove();
                $('#tab-prediction').remove();
                $('#tab-statistic').removeClass('display-none');
            }


        });
    },
    /* Match Prediction Add End */

    /* Match Prediction Info */
    MatchPredictionInfo: function (Data, callback) {
        callback = callback ? callback : '';
        var PostUrl = ApiUrl + ApiPath.Predictions.list;
        var Value = {token: Help.Token(), matchId: Data.id};
        $.post(PostUrl, Value, function (response) {

            var postResponse = response.predictions ? response.predictions : 0;

            if (postResponse.length) {

                postResponse.forEach(function (val) {

                    $('#' + val.predictionType + '_info .pr-remove-id').attr('data-id', val.predictionId);

                    if (val.predictionType == 'ht_win') {
                        $('#ht_win_info').removeClass('display-none');
                        $('#ht_win').addClass('display-none');
                        var winText = Language[Help.LangName()].txtPrHt + '-' + val.predictionFactor;
                    }

                    if (val.predictionType == 'ft_win') {
                        $('#ft_win_info').removeClass('display-none');
                        $('#ft_win').addClass('display-none');
                        var winText = Language[Help.LangName()].txtPrFt + '-' + val.predictionFactor;
                    }

                    if (val.predictionValue == 'home') {
                        var winVal = 1;
                    }
                    else if (val.predictionValue == 'away') {
                        var winVal = 2;
                    }
                    else if (val.predictionValue == 'draw') {
                        var winVal = 'x';
                    }

                    var gain = Math.ceil(val.predictionAmount * val.predictionFactor);

                    $('#' + val.predictionType + '_info ._pr-factor').text(winVal + '-' + winText);
                    $('#' + val.predictionType + '_info ._pr-amount').text(val.predictionAmount);
                    $('#' + val.predictionType + '_info ._pr-gain').text(gain);
                });

            }
            else {

                // $('.pr-match-add').removeClass('display-none');

            }

            if (callback != '') {
                callback();
            }
        });
    },
    /* Match Prediction Info End */

    /* Current Time List */
    CurrentTimeList: function () {

        var time = [
            '-12:00', '-11:00', '-10:00', '-09:00', '-08:00', '-07:00', '-06:00', '-05:00', '-04:00', '-03:00', '-02:00', '-01:00',
            '+00:00', '+01:00', '+02:00', '+03:00', '+04:00', '+05:00', '+06:00', '+07:00', '+08:00', '+09:00', '+10:00', '+11:00',
            '+12:00'
        ];
        var select = $('#app-current-time-block');
        var option = $('#app-current-time-option').clone().removeAttr('id').removeClass('display-none');

        time.forEach(function (val) {

            var currentTz = val;
            var momentDate = moment();
            momentDate.utcOffset(currentTz);
            var time = momentDate.format('HH:mm');

            var finalOption = option.clone();
            finalOption.attr('data-value', val);
            finalOption
                .find('.tmzone')
                .text(val);
            finalOption
                .find('.time')
                .text(' (' + time + ')');
            select.append(finalOption);
        });

        if (DV == 'mobile') {
            $('#app-current-time-block')
                .find('.option[data-value="' + Help.TimeZone() + '"]')
                .addClass('active');
            $('#app-current-time-block')
                .find('.option[data-value="' + moment().format('Z') + '"]')
                .addClass('time-zone');
        }
        else {
            $('#currentSelection')
                .find('.options .option[data-value="' + Help.TimeZone() + '"]')
                .addClass('active');

            $('#currentSelection')
                .find('.options .option[data-value="' + moment().format('Z') + '"]')
                .addClass('time-zone');
        }

    },
    /* Current Time List End */

    /* Footer Link */
    FooterLink: () => {
        Help.Modal('show');
        let apiVal  =   {portalId: Help.PortalId(), lang: Help.LangId(), pagePath: 'terms'};
        let apiUrl  = ApiUrl + ApiPath.General.portalPage;
        let request = $.post(apiUrl, apiVal);
        let textDom =    $('.modal-block .block-container');
        textDom.html('');
        textDom.html('<div class="_termsAndConditions"></div>');
        textDom = textDom.find('._termsAndConditions');

        request.done((data)=>{
            Help.Loading('hide');
            textDom.html(data.text);
        }).fail((err)=>{
            Help.Loading('hide');
            console.log('Error: Footer Block');
            console.log(err);
        });
    }
    /* Footer Link End */

};
