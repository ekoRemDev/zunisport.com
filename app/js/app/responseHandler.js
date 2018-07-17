/* DOCUMENT INFORMATION
	- Document: ZuniSport Web Project
	- Version:  1.0
	- Author:   Azeroglu Emin
*/

Handler = {
    /* Language Handler */
    Language: function () {
        /* Language Set Array */
        var Container = '.js-language-block',
            Element = '.option',
            Block = $(Container + " .sc-content").find(Element).clone(),
            LangId = localStorage.getItem('Language');
        LangCode = localStorage.getItem('LanguageCode');
        $(Container + " .sc-content").html('');

        if (RequestData.Language.length > 0 && DV != 'mobile') {
            $('#lang-container').removeClass('display-none');
            RequestData.Language.forEach(function (val) {
                LanguageCode[val.id] = val.id;
                LanguageCode[val.id] = val.code;
                LanguageCode[val.code] = val.name;

                Block.attr('data-value', val.id + '-' + val.code);
                Block.text(val.name);
                $(Container + " .sc-content").append(Block[0].outerHTML);
            });
            /* Language Set Array End */
            LangCode = LanguageCode[LangId];
            $(Container + ' .default .text').text(LanguageCode[LangCode]);
            $(Container + ' .default .text').attr('data-value', LangId + '-' + LangCode);
        }

        if (Help.Url(2) == 'profile') {
            var langContent = $('#form-user-lang');
            var langOption = $('#lang-option').clone().removeAttr('id').removeClass('display-none');

            RequestData.Language.forEach(function (val) {
                var finalLangOption = langOption.clone();
                LanguageCode[val.id] = val.id;
                LanguageCode[val.id] = val.code;
                LanguageCode[val.code] = val.name;

                finalLangOption.attr('value', val.id + '-' + val.code);
                finalLangOption.text(val.name);
                langContent.append(finalLangOption);
            });

            langContent.find('[value=' + Help.LangId() + '-' + Help.LangName() + ']').attr('selected', 'selected');
        }

    },
    /* Language Handler End */

    /* Sport Menu Handler */
    SportMenu: function () {
        var Container = '.navbar-block .content',
            Element = '.link',
            Block = $(Container).find(Element).clone(),
            icon = '';

        $(Container).html('');

        RequestData.Sports.forEach(function (val) {

            if (DV != 'mobile') {
                if (val.id == 1) {
                    icon = 'icon icon-football';
                    href = '/soccer/';
                } else if (val.id == 2) {
                    icon = 'icon icon-basketball';
                    href = '/basketball/';
                } else if (val.id == 4) {
                    icon = 'icon icon-ice-hockey';
                    href = '/ice-hockey/';
                } else if (val.id == 5) {
                    icon = 'icon icon-tennisball';
                    href = '/tennis/';
                }

                Block.find('span').text(val.name);
                Block.find('i').attr('class', icon);
                Block.attr({
                    'href': href,
                    'data-route': href,
                });
                $(Container).append(Block[0].outerHTML);
            }

        })
    },
    /* Sport Menu Handler End */

    /* Category List */
    CategoryList: function () {

        /* Continent Variables */
        var Parent = $('#categoryBlock');
        var CategoryList = $('#app-category-list').clone().removeAttr('id').removeClass('display-none');
        var SubCategoryList = $('#app-category-sub-list').clone().removeAttr('id').removeClass('display-none');
        var TournamentLink = '/' + Help.Sport('url') + UrlPath.Module.tournament;

        RequestLeagues.forEach(function (val) {

            var categoryListHolder = Parent.find('[data-country=' + Help.Seo(val.cI) + ']');

            if (!categoryListHolder.length) {
                var categoryListHolder = CategoryList.clone();
                categoryListHolder.attr('data-country', Help.Seo(val.cI));
                /* Name */
                categoryListHolder
                    .find('.head .name')
                    .attr('title', val.cN)
                    .text(val.cN);
                /* Photo */
                categoryListHolder
                    .find('.head .photo')
                    .attr('src', ApiUrl + ApiPath.Match.categoryLogo.replace('{categoryCode}', val.cC));
                Parent.append(categoryListHolder);
            }

            var finalSubList = SubCategoryList.clone();
            finalSubList
                .attr('data-tournamentid', val.tI);
            finalSubList
                .find('.sub-link')
                .text(val.tN)
                .attr('href', TournamentLink.replace('{tournamentId}', val.tI));
            finalSubList
                .find('.star')
                .attr('data-id', val.tI);
            categoryListHolder.find('.sub-category').append(finalSubList);

        });
    },
    /* Category List End */

    /* Category List Mobile */
    CategoryListMobile: function () {
        var parent = $('#app-parent');
        var country = $('#app-content').clone().removeAttr('id').removeClass('display-none');
        var leagues = $('#app-list').clone().removeAttr('id').removeClass('display-none');
        var TournamentLink = '/' + Help.Sport('url') + UrlPath.Module.tournament;

        $.each(RequestMobileLeagues, function (val, data) {

            var categoryHolder = parent.find('[data-category=' + data.cI + ']');

            if (categoryHolder.length < 1) {
                var categoryHolder = country.clone();
                categoryHolder.attr('data-category', data.cI);
                categoryHolder.find('.photo').attr('src', ApiUrl + (ApiPath.Match.categoryLogo.replace('{categoryCode}', data.cC)));
                categoryHolder.find('.name').html(data.cN);
                parent.append(categoryHolder);
            }

            var tournamentHolder = leagues.clone();
            tournamentHolder
                .attr('href', TournamentLink.replace('{tournamentId}', data.tI));
            tournamentHolder
                .find('.name')
                .html(data.tN);
            categoryHolder.find('.sub-tournament').append(tournamentHolder);

        });

    },
    /* Category List Mobile End */

    /* Match List */
    MatchList: function () {

        var Parent = $('.app-match-container');
        Parent.find('.tab-block').html('');
        var TableHead = Parent.find('.tab-content-head');
        var TableList = Parent.find('.app-match-table-clone .match-list-content');
        var MatchElement = Parent.find('.app-match-table-clone .list-container');
        var AllGameContent = $('.app-match-all-games');
        var FinishedGameContent = $('.app-match-finished-games');
        var LiveGameContent = $('.app-match-live-games');
        var ScheduledGameContent = $('.app-match-scheduled-games');

        var PhotoLink = ApiUrl + ApiPath.Match.categoryLogo;

        var MatchLink = '/' + Help.Sport('url') + UrlPath.Module.match;
        var TournamentLink = '/' + Help.Sport('url') + UrlPath.Module.tournament;

        //todo match object building move to method

        /* All Game Loop */
        Events.DesktopListMatch({
            Name: 'All',
            Lists: RequestMatch.All,
            Content: AllGameContent,
            FavoriteList: FavoriteList,
            Parent: Parent,
            TableList: TableList,
            PhotoLink: PhotoLink,
            TournamentLink: TournamentLink,
            MatchLink: MatchLink,
            MatchElement: MatchElement
        });
        /* All Game Loop End */

        /* Finished Game Loop */
        Events.DesktopListMatch({
            Name: 'Finished',
            Lists: RequestMatch.Finished,
            Content: FinishedGameContent,
            FavoriteList: FavoriteList,
            Parent: Parent,
            TableList: TableList,
            PhotoLink: PhotoLink,
            TournamentLink: TournamentLink,
            MatchLink: MatchLink,
            MatchElement: MatchElement
        });
        /* Finished Game Loop End */

        /* Live Game Loop */
        Events.DesktopListMatch({
            Name: 'Live',
            Lists: RequestMatch.Live,
            Content: LiveGameContent,
            FavoriteList: FavoriteList,
            Parent: Parent,
            TableList: TableList,
            PhotoLink: PhotoLink,
            TournamentLink: TournamentLink,
            MatchLink: MatchLink,
            MatchElement: MatchElement
        });
        /* Live Game Loop End */


        /* Scheduled Game Loop */
        Events.DesktopListMatch({
            Name: 'Scheduled',
            Lists: RequestMatch.Scheduled,
            Content: ScheduledGameContent,
            FavoriteList: FavoriteList,
            Parent: Parent,
            TableList: TableList,
            PhotoLink: PhotoLink,
            TournamentLink: TournamentLink,
            MatchLink: MatchLink,
            MatchElement: MatchElement
        });
        /* Scheduled Game Loop End */
        LanguageChange([
            'tabAllGames',
            'tabFinished',
            'tabScheduled',
            'tabLive',
            'tabMyGames',
        ]);
    },
    /* Match List End */

    /* Match List Mobile */
    MatchListMobile: function (type) {
        var photoLink = ApiUrl + ApiPath.Match.categoryLogo;
        var matchLink = '/' + Help.Sport('url') + UrlPath.Module.match;
        var tournamentLink = '/' + Help.Sport('url') + UrlPath.Module.tournament;
        var parent = $('#app-list-content');
        parent.html('');
        var tournamentBlock = $('#app-list-block').clone().removeAttr('id').removeClass('display-none');
        var matchBlock = $('#app-list').clone().removeAttr('id').removeClass('display-none');

        if (type == 'live') {
            var Requiest = RequestMatch.Live;
        }
        else {
            var Requiest = RequestMatch.All;
        }

        Events.MobileListMatch({
            Requiest: Requiest,
            tournamentBlock: tournamentBlock,
            photoLink: photoLink,
            tournamentLink: tournamentLink,
            parent: parent,
            matchBlock: matchBlock,
            matchLink: matchLink,
        });

    },
    /* Match List Mobile End */

    /* Match Details */
    MatchDetails: function () {

        var Data = RequestMatch.Details;

        var TournamentLink = '/' + Help.Sport('url') + UrlPath.Module.tournament;

        HeadParent = $('.app-match-details-head'),
            TeamHome = HeadParent.find('.team-home'),
            TeamAway = HeadParent.find('.team-away');

        HeadParent
            .find('.tournament-head a')
            .text(Data.tournamentName)
            .attr('href', TournamentLink.replace('{tournamentId}', Data.tournamentId));

        if (Data.categoryCode) {
            HeadParent
                .find('.tournament-head .t-photo')
                .removeClass('display-none')
                .attr('src', ApiUrl + ApiPath.Match.categoryLogo.replace('{categoryCode}', Data.categoryCode));
        }

        /* Team Logo */
        if (DV == 'mobile') {
            $('.mobile-mathc-head')
                .find('.name')
                .text(Data.tournamentName);
            $('.mobile-mathc-head')
                .find('.photo')
                .attr('src', ApiUrl + (ApiPath.Match.categoryLogo.replace('{categoryCode}', Data.categoryCode)));
            $('.mobile-mathc-head')
                .find('.link')
                .attr('href', TournamentLink.replace('{tournamentId}', Data.tournamentId));
        }
        TeamHome.find('.img').css('background-image', 'url(' + ApiUrl + ApiPath.Match.teamLogo.replace('{teamId}', Data.team1Id) + ')');
        TeamHome.find('.name').text(Data.team1Name);
        TeamHome.find('.t-home-name').text(Data.team1Name);
        TeamHome.find('.link').attr({'href': '/' + Help.Sport('url') + UrlPath.Module.team.replace('{teamId}', Data.team1Id)});
        TeamHome.find('.t-home-link').attr({'href': '/' + Help.Sport('url') + UrlPath.Module.team.replace('{teamId}', Data.team1Id)});
        TeamAway.find('.img').css('background-image', 'url(' + ApiUrl + ApiPath.Match.teamLogo.replace('{teamId}', Data.team2Id) + ')');
        TeamAway.find('.name').text(Data.team2Name);
        TeamAway.find('.t-away-name').text(Data.team2Name);
        TeamAway.find('.link').attr({'href': '/' + Help.Sport('url') + UrlPath.Module.team.replace('{teamId}', Data.team2Id)});
        TeamAway.find('.t-away-link').attr({'href': '/' + Help.Sport('url') + UrlPath.Module.team.replace('{teamId}', Data.team2Id)});
        if (Help.MatchStatus({NotStarted: 'Yes'}).indexOf(Data.mstatus) < 0) {
            HeadParent.find('.score .score-home').removeClass('display-none').text(Data.score.split('-')[0]);
            HeadParent.find('.score .score-away').removeClass('display-none').text(Data.score.split('-')[1]);
        }
        HeadParent.find('.score .text')
            .text(Help.GetMatchTime({
                preidoTime: Data.periodStartTime,
                startTime: Data.starttime,
                currentStatus: Data.mstatus
            }));

        console.log(Data.mstatus);
        HeadParent.find('.score .periodTime').text(Data.scores.Period1 ? Data.scores.Period1 : '');
        HeadParent.find('.score .date').text(Help.DateFormat({Data: Data.starttime, Type: 'default'}));

        if (Help.Token()) {
            if (DV == 'mobile') {
                $('.live-block')
                    .find('a')
                    .removeClass('js-login-modal')
                    .attr({
                        'href': LiveViewLink.replace('{matchId}', Data.id).replace('{token}', Help.Token()),
                        'target': '_blank'
                    });
            }
            else {
                $('.live-block')
                    .find('a')
                    .removeClass('js-login-modal')
                    .addClass('js-match-live-view')
                    .attr('data-terms', 'open');
                $('#_match-live-block')
                    .find('iframe')
                    .attr('src', LiveViewLink.replace('{matchId}', Data.id).replace('{token}', Help.Token()))
            }
        }

        /* Team Logo End */
        $('.app-match-line-up').find('.info-tab-head .link').text('');
        $('.app-match-line-up').find('.t-home').text(Data.team1Name);
        $('.app-match-line-up').find('.t-away').text(Data.team2Name);
        $('.app-match-line-up').find('.t-home-formation').text(Data.team1Formation);
        $('.app-match-line-up').find('.t-away-formation').text(Data.team2Formation);
        $('.app-mathc-info').find('.m-stadium .text').text(Data.stadiumName ? Data.stadiumName : '-');
        if (Data.refereeName) {
            $('.app-mathc-info').find('.m-referee .text').text(Help.PlayerName(Data.refereeName) ? Help.PlayerName(Data.refereeName) : '');
        }

    },
    /* Match Details End */

    /* Match Info */
    MatchInfo: function () {

        var tabLinkCount = $('#tab-head-block').find('.tab-link.display-none').length;

        if (tabLinkCount == 1) {

            if (DV == 'mobile') {
                var width = '20%';
            }
            else {
                var width = '20%';
            }
            $('#tab-head-block').find('.tab-link').css('width', width);
        }
        else if (tabLinkCount == 2) {
            if (DV == 'mobile') {
                var width = '33.3%';
            }
            else {
                var width = '226px';
            }
            $('#tab-head-block').find('.tab-link').css('width', width);
        }

        $('#match-form-id').val(Help.Url(3));

        var InfoContainer = '.app-mathc-info';
        var StaticsContainer = '.app-match-statics';
        var LineUpContainer = '.app-match-line-up';
        var TableContainer = '.app-match-table';
        var H2hContainer = '.app-match-h2h';

        /* Match Info */
        var InfoCloneBlockSet = $('.app-match-info-clone').clone();
        InfoCloneBlockSet.removeClass('display-none');
        var InfoContent = $(InfoContainer).find('.tab-block-container');
        var BlockContent = $(InfoContainer).find('.app-match-info-list-content');
        var BlockListClone = BlockContent.find('.list').clone();
        BlockListClone.removeClass('display-none');
        var BlockMatchInfoClone = $('.app-mathc-info .match-info-clone').clone();
        BlockMatchInfoClone.removeClass('display-none');

        InfoContent.html('');

        Help.Sort(RequestMatch.Info);

        console.log(RequestMatch.Info);

        if (RequestMatch.Details.hasLeagueTable == true) {
            $('.app-match-table').removeClass('display-none');
            $('.tab-table').removeClass('display-none');
            /* Match Table */
            var TablePost = ApiUrl + (ApiPath.Match.tournamentStandings).replace('{matchId}', Help.Url(3));
            var TableData = {
                token: Help.Token(),
                lang: Help.LangId(),
                tournamentId: RequestMatch.Details.tournamentId,
                seasonId: RequestMatch.Details.seasonId
            };
            $.post(TablePost, TableData, function (response) {

                var Standing = response.standings;

                console.log(Standing);

                if (Standing.length > 0) {

                    var TableContent = $('#table-content').clone().removeClass('display-none').removeAttr('id');
                    var TableList = $('#table-list').clone().removeClass('display-none').removeAttr('id');

                    Standing.forEach(function (list) {

                        var finalTableList = TableList.clone();
                        var groupElementOver = $('[data-groupnameover=' + (Help.Seo(list.groupName)) + ']');
                        var groupElementHome = $('[data-groupnamehome=' + (Help.Seo(list.groupName)) + ']');
                        var groupElementAway = $('[data-groupnameaway=' + (Help.Seo(list.groupName)) + ']');

                        TableContent
                            .find('.tr-head .groupname')
                            .text(list.groupName);

                        if (!groupElementOver.length) {
                            if (list.standingType == 'overall') {
                                var finalTableContent = TableContent.clone();
                                finalTableContent.attr('data-groupnameover', (Help.Seo(list.groupName)));
                                $('.app-match-table-overall').append(finalTableContent);
                            }
                            groupElementOver = $('[data-groupnameover=' + (Help.Seo(list.groupName)) + ']');
                        }

                        if (!groupElementHome.length) {
                            if (list.standingType == 'home') {
                                var finalTableContent = TableContent.clone();
                                finalTableContent.attr('data-groupnamehome', (Help.Seo(list.groupName)));
                                $('.app-match-table-home').append(finalTableContent);
                            }
                            groupElementHome = $('[data-groupnamehome=' + (Help.Seo(list.groupName)) + ']');
                        }

                        if (!groupElementAway.length) {
                            if (list.standingType == 'away') {
                                var finalTableContent = TableContent.clone();
                                finalTableContent.attr('data-groupnameaway', (Help.Seo(list.groupName)));
                                $('.app-match-table-away').append(finalTableContent);
                            }
                            groupElementAway = $('[data-groupnameaway=' + (Help.Seo(list.groupName)) + ']');
                        }


                        finalTableList.attr('id', list.teamId);
                        finalTableList.find('.team-name').text(list.teamName);
                        finalTableList.find('.team-name').attr({'href': '/' + Help.Sport('url') + UrlPath.Module.team.replace('{teamId}', list.teamId)});
                        finalTableList.find('.position').text(list.position);
                        finalTableList.find('.gameCount').text(list.gameCount);
                        finalTableList.find('.win').text(list.win);
                        finalTableList.find('.draw').text(list.draw);
                        finalTableList.find('.lose').text(list.lose);
                        finalTableList.find('.goalScored').text(list.goalScored);
                        finalTableList.find('.goalAgainst').text(list.goalAgainst);
                        finalTableList.find('.point').text(list.point);

                        if (list.standingType == 'overall') {
                            if (!groupElementOver.find('.tr-body [data-id=' + list.teamId + ']').length) {
                                finalTableList.attr('data-id', list.teamId);
                                groupElementOver.find('.tr-body').append(finalTableList);
                            }
                        }
                        if (list.standingType == 'home') {
                            if (!groupElementHome.find('.tr-body [data-id=' + list.teamId + ']').length) {
                                finalTableList.attr('data-id', list.teamId);
                                groupElementHome.find('.tr-body').append(finalTableList);
                            }
                        }
                        if (list.standingType == 'away') {
                            if (!groupElementAway.find('.tr-body [data-id=' + list.teamId + ']').length) {
                                finalTableList.attr('data-id', list.teamId);
                                groupElementAway.find('.tr-body').append(finalTableList);
                            }
                        }

                        $('.tr[data-id=' + RequestMatch.Details.team1Id + ']').addClass('active');
                        $('.tr[data-id=' + RequestMatch.Details.team2Id + ']').addClass('active');

                    });

                }

            });
            /* Match Table End */
        }

        if (RequestMatch.Details.predictable == true && Help.Token()) {
            $('#tab-prediction').removeClass('display-none');
            $('#tab-statistic').remove();
            $('.app-match-statics').remove();
            /* Match Prediction Info */
            Events.MatchPredictionInfo(RequestMatch.Details, function () {
                Events.MatchPredictionAdd(RequestMatch.Details);
            });
        }
        else {
            $('#prediction-tab-content').remove();
            $('#tab-prediction').remove();
            $('#tab-statistic').removeClass('display-none');
        }

        if (RequestMatch.Info.length > 0) {
            RequestMatch.Info.forEach(function (data) {

                if (!$('.app-mathc-info .tab-block-container').find('[data-set=set1]').length) {
                    InfoCloneBlockSet.attr('data-set', 'set1');
                    InfoContent.append(InfoCloneBlockSet[0].outerHTML);
                    $('.tab-block-container .app-match-info-clone[data-set=set1] .head').hide();
                }
                else if (!$('.app-mathc-info .tab-block-container').find('[data-set=set2]').length) {
                    InfoCloneBlockSet.attr('data-set', 'set2');
                    InfoContent.append(InfoCloneBlockSet[0].outerHTML);
                    $('.tab-block-container .app-match-info-clone[data-set=set2] .head').hide();
                }
                else if (!$('.app-mathc-info .tab-block-container').find('[data-set=ex]').length) {
                    InfoCloneBlockSet.attr('data-set', 'ex');
                    InfoContent.append(InfoCloneBlockSet[0].outerHTML);
                    $('.tab-block-container .app-match-info-clone[data-set=ex] .head').hide();
                }
                else if (!$('.app-mathc-info .tab-block-container').find('[data-set=info]').length) {
                    InfoCloneBlockSet.attr('data-set', 'info');
                    InfoContent.append(InfoCloneBlockSet[0].outerHTML);
                }

                if (data.Team == 'Home') {
                    BlockListClone.addClass('team-home');
                }
                else {
                    BlockListClone.removeClass('team-home');
                }
                if (data.Team == 'Away') {
                    BlockListClone.addClass('team-away');
                }
                else {
                    BlockListClone.removeClass('team-away');
                }

                if (data.cardType == "Red")
                    BlockListClone.find('.l-red').removeClass('display-none');
                else
                    BlockListClone.find('.l-red').addClass('display-none');
                if (data.cardType == "Yellow")
                    BlockListClone.find('.l-yellow').removeClass('display-none');
                else
                    BlockListClone.find('.l-yellow').addClass('display-none');
                if (data.cardType == "YellowRed")
                    BlockListClone.find('.l-yellowred').removeClass('display-none');
                else
                    BlockListClone.find('.l-yellowred').addClass('display-none');

                if (data.scorerPlayerName)
                    BlockListClone.find('.l-goal').removeClass('display-none');
                else
                    BlockListClone.find('.l-goal').addClass('display-none');

                if (data.inPlayerId && data.outPlayerId) {
                    BlockListClone.find('.l-refresh').removeClass('display-none');
                    BlockListClone.find('.name').html(Help.PlayerName(data.inFootballer) + ' &nbsp; <span>(' + Help.PlayerName(data.outFootballer) + ')</span>');
                } else
                    BlockListClone.find('.l-refresh').addClass('display-none');

                BlockListClone.find('.time').text(data.time);

                var dataFrom;
                if (data.from == 'owngoal')
                    dataFrom = Language[Help.LangName()]['txtOwnGoal'];
                else if (data.from == 'penalty')
                    dataFrom = Language[Help.LangName()]['txtPenaltyGoal'];
                else
                    dataFrom    =   '';

                if (data.footballer) {
                    BlockListClone.find('.name').text(Help.PlayerName(data.footballer) + (dataFrom ? ' ('+dataFrom+')' : ''));
                } else {
                    BlockListClone.find('.name').html(Help.PlayerName(data.inFootballer) + ' &nbsp; <span>(' + Help.PlayerName(data.outFootballer) + ')</span>');
                }

                if (data.time <= 45) {
                    $('.tab-block-container .app-match-info-clone[data-set=set1] .head').show().text(Language[Help.LangName()].matchSet1);
                    $('.tab-block-container .app-match-info-clone[data-set=set1] .app-match-info-list-content').append(BlockListClone[0].outerHTML);
                }
                else if (data.time > 45 && data.time <= 90) {
                    $('.tab-block-container .app-match-info-clone[data-set=set2] .head').show().text(Language[Help.LangName()].matchSet2);
                    $('.tab-block-container .app-match-info-clone[data-set=set2] .app-match-info-list-content').append(BlockListClone[0].outerHTML);
                }
                else if (data.time > 90) {
                    $('.tab-block-container .app-match-info-clone[data-set=ex] .head').show().text(Language[Help.LangName()].matchExtra);
                    $('.tab-block-container .app-match-info-clone[data-set=ex] .app-match-info-list-content').append(BlockListClone[0].outerHTML);
                }
                else {
                    $('.tab-block-container .app-match-info-clone[data-set=set1] .app-match-info-list-content').hide();
                    $('.tab-block-container .app-match-info-clone[data-set=set1] .head').hide();
                    $('.tab-block-container .app-match-info-clone[data-set=set2] .app-match-info-list-content').hide();
                    $('.tab-block-container .app-match-info-clone[data-set=set2] .head').hide();

                }

                if (data.time <= 90) {
                    $('.tab-block-container .app-match-info-clone[data-set=ex] .app-match-info-list-content').hide();
                    $('.tab-block-container .app-match-info-clone[data-set=ex] .head').hide();
                }

            });
        }
        else {
            $(InfoContainer).find('.tab-block-container').html('<div class="no-data mt-0">' + Language[Help.LangName()].noDataText + '</div>');
        }

        $('.tab-block-container .app-match-info-clone[data-set=info] .head').text(Language[Help.LangName()].matchInfo);
        $('.tab-block-container .app-match-info-clone[data-set=info] .app-match-info-list-content').append(BlockMatchInfoClone[0].outerHTML);
        /* Match Info End */

        /* Match Statics */
        var StatisticClone = $(StaticsContainer).find('.app-match-statics-clone');
        var StatisticPost = ApiUrl + (ApiPath.Match.matchStatistics).replace('{matchId}', Help.Url(3));
        var StatisticData = {token: Help.Token(), lang: Help.LangId(), timezone: Help.TimeZone()};

        $.post(StatisticPost, StatisticData, function (response) {

            $(StaticsContainer).find('.tab-block-container').html('');
            var BlockClone = StatisticClone.clone();
            BlockClone.removeClass('app-match-statics-clone display-none');

            if (response.statistics.length > 0) {
                response.statistics.forEach(function (data, index) {
                    var finalBlockClone = BlockClone.clone();
                    finalBlockClone.find('.head').text(data.statistics);
                    finalBlockClone.find('.t-home').text(data.team1Value + (index == 0 ? '%' : ''));
                    finalBlockClone.find('.t-away').text(data.team2Value + (index == 0 ? '%' : ''));
                    var rate = Math.round(data.team1Value / (data.team1Value + data.team2Value) * 100);
                    finalBlockClone.find('.progresbar ._2').css('width', rate + '%');
                    $(StaticsContainer).find('.tab-block-container').append(finalBlockClone);
                });
            }
            else {
                $(StaticsContainer).find('.tab-block-container').html('<div class="no-data mt-0">' + Language[Help.LangName()].statisticNodata + '</div>');
            }

        });
        /* Match Statics End */

        /* Match H2h */
        var H2hClone = $(H2hContainer).find('.app-match-h2h-clone');
        var H2hPost = ApiUrl + (ApiPath.Match.matchH2h).replace('{matchId}', Help.Url(3));
        var H2hData = {token: Help.Token(), lang: Help.LangId(), timezone: Help.TimeZone()};
        var MatchLink = '/' + Help.Sport('url') + UrlPath.Module.match;

        $.post(H2hPost, H2hData, function (response) {

            $(H2hContainer).find('.tab-block-container').html('');
            var BlockClone = H2hClone.clone();
            BlockClone.removeClass('app-match-statics-clone display-none');

            if (response.matches.length > 0) {
                response.matches.forEach(function (data) {
                    BlockClone.find('.list').attr('data-matchid', data.id);
                    BlockClone.find('.star').attr({
                        'data-id': data.id
                    });
                    BlockClone.find('.head').text(Help.DateFormat({Data: data.starttime, Type: 'date'}));
                    BlockClone.find('.t-home .n').text(data.team1Name);
                    BlockClone.find('.t-home .number').text(data.score.split('-')[0]);
                    BlockClone.find('.t-away .n').text(data.team2Name);
                    BlockClone.find('.t-away .number').text(data.score.split('-')[1]);
                    BlockClone.find('.link').attr({
                        'href': MatchLink.replace('{matchId}', data.id),
                        'data-router': MatchLink.replace('{matchId}', data.id)
                    });
                    BlockClone.find('.score').text(Help.GetMatchTime({
                        preidoTime: data.periodStartTime,
                        startTime: data.starttime,
                        currentStatus: data.mstatus
                    }));

                    Help.GetMatchTime({
                        preidoTime: data.periodStartTime,
                        startTime: data.starttime,
                        currentStatus: data.mstatus,
                        callback: function (data) {
                            var _data = data.replace("'", "");
                            if (_data > 0 || _data == 'HT') {
                                BlockClone.find('.score').addClass('live');
                            }
                            else {
                                BlockClone.find('.score').removeClass('live');
                            }
                        }
                    });


                    $(H2hContainer).find('.tab-block-container').append(BlockClone[0].outerHTML);
                });
            }
            else {
                $(StaticsContainer).find('.tab-block-container').html('<div class="no-data mt-0">' + Language[Help.LangName()].noDataText + '</div>');
            }
        });
        /* Match H2h End */

        /* Match Line Up */
        var LineUpClone = $(LineUpContainer).find('.app-match-line-up-clone');
        var LineUpPost = ApiUrl + (ApiPath.Match.matchLineups).replace('{matchId}', Help.Url(3));
        var LineUpData = {token: Help.Token(), lang: Help.LangId(), timezone: Help.TimeZone()};

        $.post(LineUpPost, LineUpData, function (response) {

            $(LineUpContainer).find('.tab-block-container').html('');
            var BlockClone = LineUpClone.clone();
            BlockClone.removeClass('app-match-line-up-clone display-none');
            var FormatHomeContent = BlockClone.find('.team-home-format-content');
            var FormatAwayContent = BlockClone.find('.team-away-format-content');
            var FormatHomeBlock = FormatHomeContent.find('.list').clone();
            var FormatAwayBlock = FormatAwayContent.find('.list').clone();

            FormatHomeContent.html('');
            FormatAwayContent.html('');

            var SubstitedHomeContent = $(LineUpContainer).find('.team-home-substited-content');
            var SubstitedAwayContent = $(LineUpContainer).find('.team-away-substited-content');
            var SubstitedHomeClone = SubstitedHomeContent.find('.list').clone();
            SubstitedHomeClone.removeClass('display-none');
            var SubstitedAwayClone = SubstitedAwayContent.find('.list').clone();
            SubstitedAwayClone.removeClass('display-none');
            SubstitedHomeContent.html('');
            SubstitedAwayContent.html('');

            if (response.lineups.length > 0) {
                response.lineups.forEach(function (data) {

                    if (data.playerTeam == 1) {
                        if ((data.playerPosition > 0 || data.playerPosition == 0) && data.substitute == 0) {
                            FormatHomeBlock.find('.name').text(Help.PlayerName(data.playerName));
                            FormatHomeBlock.find('.number').text(data.shirtNumber);
                            FormatHomeContent.append(FormatHomeBlock[0].outerHTML);
                        }
                        else if (data.playerPosition == 0 && data.substitute == 1) {
                            SubstitedHomeClone.find('.number').text(data.shirtNumber);
                            SubstitedHomeClone.find('.text').text(Help.PlayerName(data.playerName));
                            SubstitedHomeContent.append(SubstitedHomeClone[0].outerHTML);
                        }
                    }
                    else if (data.playerTeam == 2) {
                        if ((data.playerPosition > 0 || data.playerPosition == 0) && data.substitute == 0) {
                            FormatAwayBlock.find('.name').text(Help.PlayerName(data.playerName));
                            FormatAwayBlock.find('.number').text(data.shirtNumber);
                            FormatAwayContent.append(FormatAwayBlock[0].outerHTML);
                        }
                        else if (data.playerPosition == 0 && data.substitute == 1) {
                            SubstitedAwayClone.find('.number').text(data.shirtNumber);
                            SubstitedAwayClone.find('.text').text(Help.PlayerName(data.playerName));
                            SubstitedAwayContent.append(SubstitedAwayClone[0].outerHTML);
                        }
                    }
                });


                /* Match Substitutions */
                Help.Sort(RequestMatch.Info, 'time');
                var SubstitionsHomeContent = $(LineUpContainer).find('.team-home-substitutions-content');
                var SubstitionsAwayContent = $(LineUpContainer).find('.team-away-substitutions-content');
                var SubstitionsHomeClone = SubstitionsHomeContent.find('.list').clone();
                var SubstitionsAwayClone = SubstitionsAwayContent.find('.list').clone();
                SubstitionsHomeContent.html('');
                SubstitionsAwayContent.html('');

                $('.team-home-substitutions-head').hide();
                $('.team-away-substitutions-head').hide();

                RequestMatch.Info.forEach(function (data) {

                    if (data.playerTeam == 1) {
                        SubstitionsHomeClone.find('.time').text(data.time);
                        if (data.inPlayerName) {
                            $('.team-home-substitutions-head').show();
                            SubstitionsHomeClone.show();
                            SubstitionsHomeClone.find('.outplayer').show();
                            SubstitionsHomeClone.find('.outplayer').text('(' + Help.PlayerName(data.outPlayerName) + ')');
                            SubstitionsHomeClone.find('.name').text(Help.PlayerName(data.inPlayerName));
                        }
                        else {
                            SubstitionsHomeClone.hide();
                        }
                        SubstitionsHomeContent.append(SubstitionsHomeClone[0].outerHTML);

                    }
                    else if (data.playerTeam == 2) {
                        SubstitionsAwayClone.find('.time').text(data.time);
                        if (data.inPlayerName) {
                            $('.team-away-substitutions-head').show();
                            SubstitionsAwayClone.show();
                            SubstitionsAwayClone.find('.outplayer').show();
                            SubstitionsAwayClone.find('.outplayer').text('(' + data.outPlayerName + ')');
                            SubstitionsAwayClone.find('.name').text(data.inPlayerName);
                        }
                        else {
                            SubstitionsAwayClone.hide();
                        }
                        SubstitionsAwayContent.append(SubstitionsAwayClone[0].outerHTML);
                    }

                });
                /* Match Substitutions End */

                $(LineUpContainer).find('.tab-block-container').html(BlockClone[0].outerHTML);
            }
            else {
                $(LineUpContainer).find('.tab-block-container').html('<div class="no-data mt-0">' + Language[Help.LangName()].noDataText + '</div>');
            }
        });
        /* Match Line Up End */

        LanguageChange([
            'txtInfo',
            'txtLineUp',
            'txtStatistics',
            'txtTable',
            'txtReferee',
            'txtStadium',
            'txtFormations',
            'txtSubstitutions',
            'txtPrediction',
            'txtSubstitedPlayers',
            'txtOverall',
            'txtHome',
            'txtAway',
            'txtTeam',
            'txtPrHt',
            'txtPrFt',
            'txtPrHead',
            'txtPrButton',
            'txtPrMatchInfo',
            'txtWin',
            'txtAmount',
            'txtGain',
        ]);

    },
    /* Match Info End */

    /* Team */
    Team: function () {

        var TeamId = RequestData.Team.teamId;
        var TeamName = RequestData.Team.teamName;
        var PhotoLink = ApiUrl + ApiPath.Match.teamLogo;
        var DataLoop = RequestData.Team.matches;
        var PageCover = '.main-cover';
        var PageContent = '.tab-content';

        if (RequestData.Team.code == 200) {

            $(PageCover)
                .find('.found')
                .removeClass('display-none');

            var BlockList = $('#block-list')
                .clone()
                .removeAttr('id')
                .removeClass('display-none');
            $(PageContent).html('');

            $('.load-more').removeClass('display-none');

            /* Cover */
            $(PageCover).find('.team-away').attr('data-teamid', TeamId);
            $(PageCover).find('.team-away .img').css('background-image', 'url(' + PhotoLink.replace('{teamId}', TeamId) + ')');
            $(PageCover).find('.team-away .name').text(TeamName);
            $(PageCover).find('.team-away .star').attr('data-id', TeamId);
            var MatchLink = '/' + Help.Sport('url') + UrlPath.Module.match;
            /* Cover End */

            /* Content */
            DataLoop.forEach(function (val) {

                var FinalBlockList = BlockList.clone();

                FinalBlockList.find('.list').attr('data-matchid', val.id);

                FinalBlockList.find('.b-date').text(Help.DateFormat({Type: 'date', Data: val.starttime}));
                FinalBlockList.find('.star').attr('data-id', val.id);
                FinalBlockList.find('.link').attr({
                    'href': MatchLink.replace('{matchId}', val.id),
                    'data-router': MatchLink.replace('{matchId}', val.id)
                });
                FinalBlockList.find('.t-home').text(val.team1Name);
                FinalBlockList.find('.s-home').text(val.mstatus != 0 ? val.score.split('-')[0] : '');
                FinalBlockList.find('.t-away').text(val.team2Name);
                FinalBlockList.find('.s-away').text(val.mstatus != 0 ? val.score.split('-')[1] : '');

                Help.GetMatchTime({
                    preidoTime: val.periodStartTime,
                    startTime: val.starttime,
                    currentStatus: val.mstatus,
                    callback: function (minute) {
                        var _minute = minute.replace("'", "");
                        if (_minute > 0 || _minute == "HT") {
                            FinalBlockList.find('.score').text(minute).addClass('live');
                        }
                        else {
                            FinalBlockList.find('.score').removeClass('live');
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
                        }

                    }
                });


                FinalBlockList.find('.scheduled').text(Help.DateFormat({Data: val.starttime, Type: 'time'}));


                $(PageContent).append(FinalBlockList);
            });
            /* Content End */
        }
        else if (RequestData.Team.code == 404) {

            $(PageCover)
                .find('.not-found')
                .removeClass('display-none');

        }

        LanguageChange([
            'txtNotTeamHead',
            'txtNotTeamText',
            'txtLoadmore',
        ]);

    },
    /* Team End */

    /* Tournament */
    Tournament: function () {
        var CloneBlock = $('#clone-block').clone().removeAttr('id').removeClass('display-none');
        var PageHead = $('.app-page-head');
        var MatchElement = $('#match-element').clone().removeAttr('id').removeClass('display-none');
        var PageContainer = $('.app-page-container');
        var MatchLink = '/' + Help.Sport('url') + UrlPath.Module.match;
        var TournamentLink = '/' + Help.Sport('url') + UrlPath.Module.tournament;
        var PhotoLink = ApiUrl + ApiPath.Match.categoryLogo;

        /* Page Head Edit */
        if (RequestData.Tournament.matches.length > 0) {
            var Logo = ApiUrl + (ApiPath.Match.categoryLogo.replace('{categoryCode}', RequestData.Tournament.matches[0].categoryCode));
            PageHead
                .find('.photo')
                .attr('src', Logo);
        }
        PageHead
            .find('.name')
            .text(RequestData.Tournament.tournamentName);
        PageHead
            .find('.star')
            .attr('data-id', RequestData.Tournament.tournamentId);
        PageHead
            .attr('data-tournamentid', RequestData.Tournament.tournamentId);
        /* Page Head Edit End */

        /* Match List */
        if (RequestData.Tournament.matches.length > 0) {
            $('#app-result-content').removeClass('display-none');

            var tourData = RequestData.Tournament.matches;

            tourData.forEach(function (val) {

                var DateLine = Help.DateFormat({Data: val.starttime, Type: 'dateLine'});
                var Date = Help.DateFormat({Data: val.starttime, Type: 'date'});

                if (!PageContainer.find('[data-date=' + DateLine + ']').length) {
                    var FinalBlock = CloneBlock.clone().attr('data-date', DateLine);
                    PageContainer.append(FinalBlock);
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
                FinalMatchElement
                    .find('.score')
                    .find('.home')
                    .text(val.mstatus != 0 ? val.score.split('-')[0] : '');
                FinalMatchElement
                    .find('.score')
                    .find('.away')
                    .text(val.mstatus != 0 ? val.score.split('-')[1] : '');

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
        else {
            $('#app-error').removeClass('display-none');
            //todo lanugage
        }
        /* Match List End */

        if (RequestData.Tournament.hasLeagueTable == true) {
            $('.app-match-table').removeClass('display-none');
            $('.app-table-tab').removeClass('display-none');
            $('.tab-table').removeClass('display-none');

            /* Match Table */
            var TablePost = ApiUrl + (ApiPath.Match.tournamentStandings).replace('{matchId}', Help.Url(3));
            var TableData = {
                token: Help.Token(),
                lang: Help.LangId(),
                tournamentId: RequestData.Tournament.tournamentId
            };

            $.post(TablePost, TableData, function (response) {

                var Data = response.standings;

                if (Data.length > 0) {
                    var TableContent = $('#table-content').clone().removeClass('display-none').removeAttr('id');
                    var TableList = $('#table-list').clone().removeClass('display-none').removeAttr('id');

                    var teamPositionOverall = 0;
                    var teamPositionHome = 0;
                    var teamPositionAway = 0;

                    Data.forEach(function (list) {

                        var finalTableList = TableList.clone();
                        var groupElementOver = $('[data-groupnameover=' + (Help.Seo(list.groupName)) + ']');
                        var groupElementHome = $('[data-groupnamehome=' + (Help.Seo(list.groupName)) + ']');
                        var groupElementAway = $('[data-groupnameaway=' + (Help.Seo(list.groupName)) + ']');

                        TableContent
                            .find('.tr-head .groupname')
                            .text(list.groupName);

                        if (!groupElementOver.length) {
                            if (list.standingType == 'overall') {
                                var finalTableContent = TableContent.clone();
                                finalTableContent.attr('data-groupnameover', (Help.Seo(list.groupName)));
                                $('.app-match-table-overall').append(finalTableContent);
                                teamPositionOverall = 0;
                            }
                            groupElementOver = $('[data-groupnameover=' + (Help.Seo(list.groupName)) + ']');
                        }

                        if (!groupElementHome.length) {
                            if (list.standingType == 'home') {
                                var finalTableContent = TableContent.clone();
                                finalTableContent.attr('data-groupnamehome', (Help.Seo(list.groupName)));
                                $('.app-match-table-home').append(finalTableContent);
                                teamPositionHome = 0;
                            }
                            groupElementHome = $('[data-groupnamehome=' + (Help.Seo(list.groupName)) + ']');
                        }

                        if (!groupElementAway.length) {
                            if (list.standingType == 'away') {
                                var finalTableContent = TableContent.clone();
                                finalTableContent.attr('data-groupnameaway', (Help.Seo(list.groupName)));
                                $('.app-match-table-away').append(finalTableContent);
                                teamPositionAway = 0;
                            }
                            groupElementAway = $('[data-groupnameaway=' + (Help.Seo(list.groupName)) + ']');
                        }


                        finalTableList.attr('id', list.teamId);
                        finalTableList.find('.team-name').text(list.teamName);
                        finalTableList.find('.team-name').attr({'href': '/' + Help.Sport('url') + UrlPath.Module.team.replace('{teamId}', list.teamId)});
                        // finalTableList.find('.position').text(list.position);

                        finalTableList.find('.gameCount').text(list.gameCount);
                        finalTableList.find('.win').text(list.win);
                        finalTableList.find('.draw').text(list.draw);
                        finalTableList.find('.lose').text(list.lose);
                        finalTableList.find('.goalScored').text(list.goalScored);
                        finalTableList.find('.goalAgainst').text(list.goalAgainst);
                        finalTableList.find('.point').text(list.point);

                        if (list.standingType == 'overall') {
                            if (!groupElementOver.find('.tr-body [data-id=' + list.teamId + ']').length) {
                                finalTableList.attr('data-id', list.teamId);
                                groupElementOver.find('.tr-body').append(finalTableList);
                                finalTableList.find('.position').text(++teamPositionOverall);
                            }
                        }
                        if (list.standingType == 'home') {
                            if (!groupElementHome.find('.tr-body [data-id=' + list.teamId + ']').length) {
                                finalTableList.attr('data-id', list.teamId);
                                groupElementHome.find('.tr-body').append(finalTableList);
                                finalTableList.find('.position').text(++teamPositionHome);
                            }
                        }
                        if (list.standingType == 'away') {
                            if (!groupElementAway.find('.tr-body [data-id=' + list.teamId + ']').length) {
                                finalTableList.attr('data-id', list.teamId);
                                groupElementAway.find('.tr-body').append(finalTableList);

                                finalTableList.find('.position').text(++teamPositionAway);
                            }
                        }

                    });

                }

            });
        }

        LanguageChange([
            'txtResults',
            'txtTable',
            'txtLoadmore',
            'txtAway',
            'txtHome',
            'txtOverall',
            'txtTeam',
            'txtNotPage404',
        ])
    },
    /* Tournament End */

    /* Login */
    Login: function () {
        var loginContent = $('#app-login-block');

        /* Login */
        if (Help.Token() && UserParams) {

            localStorage.removeItem('myGames');

            $('.prediction-container').removeClass('display-none');

            $('#user-token').val(Help.Token());

            /* Coins */
            if (UserParams.score > 10000) {
                var score = parseInt(UserParams.score / 1000) + 'K';
            }
            else {
                var score = UserParams.score;
            }


            loginContent
                .find('.coins')
                .find('span')
                .text(score);
            $('.user-coins')
                .removeClass('display-none')
                .find('.c-span')
                .text(score);

            /* Username */
            if (UserParams.username) {
                loginContent
                    .find('.name')
                    .text(UserParams.username);
                $('#form-user-name').val(UserParams.username);

                if (DV == 'mobile') {
                    $('.mobile-user-name').text(UserParams.username);
                }
            }
            else {
                if (Help.Url(2) != 'profile') {
                    Help.Redirect('/soccer/profile');
                }
            }

            /* Avatar */
            if (UserParams.avatar) {
                $('figure')
                    .find('.user-photo')
                    .css('background-size', 'contain')
                    .css('background-image', 'url(' + ApiUrl + '/user/avatar/' + UserParams.avatar + ')');

            }
            else {
                $('figure')
                    .find('.user-photo')
                    .css('background-image', 'url(' + DefaultUserAvatar + ')');
            }
            /* Button */
            loginContent
                .find('#login-button')
                .removeClass('js-login-modal button display-none')
                .attr('href', '/soccer/profile')
                .addClass('profile-button');

            if (DV == 'mobile') {
                $('.mobile-login-button')
                    .removeClass('js-login-modal')
                    .attr('href', '/soccer/profile');
            }

            /* Language */
            // Request.AppData(function () {
            //     if (Help.LangId() != UserParams.langId) {
            //         LangCode = LanguageCode[UserParams.langId];
            //         localStorage.setItem('Language', UserParams.langId);
            //         localStorage.setItem('LanguageCode', LangCode);
            //         Help.Redirect();
            //     }
            // });

        }
        /* Log Out */
        else {

            if (DV == 'mobile') {
                $('#mobile-nav-prediction')
                    .removeAttr('href')
                    .addClass('js-login-modal');
            }

            $('.prediction-container').remove();

            if (Help.Token() != "") {
                localStorage.removeItem('userToken');
            }

            $('#no-team').removeClass('display-none');
            $('#no-tournament').removeClass('display-none');

            /* Coins */
            loginContent
                .find('.coins')
                .find('span')
                .text(0);
            /* Username */
            loginContent
                .find('.name')
                .text('Guest');
            /* Avatar */
            $('figure')
                .find('.user-photo')
                .css('background-image', 'url(' + DefaultUserAvatar + ')');
            /* Button */
            loginContent
                .find('#login-button')
                .removeClass('display-none')
                .text(DV != 'mobile' ? 'Login' : '')
                .removeAttr('href');

            if (DV == 'mobile') {
                $('.mobile-login-button')
                    .removeAttr('href');
                $('.mobile-user-name')
                    .css({'height': '15vw', 'line-height': '15vw', 'margin-top': '0'})
                    .text(Language[Help.LangName()].txtSingBtn);
            }

            if (localStorage.getItem('myGames')) {
                $('#favorite-text').find('span').text(1);
                if (DV == 'desktop') {
                    $('#favorite-text').removeClass('display-none');
                }
            }


        }

    },
    /* Login End */

    /* Favorite */
    Favorite: function (type) {
        if (Help.Token()) {
            var PostUrl = ApiUrl + ApiPath.Favorites.favorites;
            var Value = {token: Help.Token()};

            $.post(PostUrl, Value, function (response) {

                var Lists = response;

                /* Match */
                if (Lists.matches.length && type == 'match') {
                    Lists.matches.forEach(function (List) {
                        $('[data-matchid=' + List + ']')
                            .find('.star')
                            .attr('data-terms', 0)
                            .addClass('active')
                            .find('.icon')
                            .removeClass('icon-top-favourite-selected')
                            .addClass('icon-top-favourite-selected');
                    });
                }

                /* Tournament */
                if (Lists.tournaments.length && type == 'tournament') {
                    Lists.tournaments.forEach(function (List) {
                        $('[data-tournamentid=' + List + '] .favorite-head')
                            .find('.star')
                            .attr('data-terms', 0)
                            .addClass('active')
                            .find('.icon')
                            .removeClass('icon-top-favourite-selected')
                            .addClass('icon-top-favourite-selected');
                    });

                    Lists.matches.forEach(function (List) {
                        $('[data-matchid=' + List + ']')
                            .find('.star')
                            .attr('data-terms', 0)
                            .addClass('active')
                            .find('.icon')
                            .removeClass('icon-top-favourite-selected')
                            .addClass('icon-top-favourite-selected');
                    });

                }

                /* Team */
                if (Lists.teams.length && type == 'team') {
                    Lists.teams.forEach(function (List) {
                        $('[data-teamid=' + List + ']')
                            .find('.star')
                            .attr('data-terms', 0)
                            .addClass('active')
                            .find('.icon')
                            .removeClass('icon-top-favourite-selected')
                            .addClass('icon-top-favourite-selected');
                    });
                }

            });

        }

        LanguageChange([
            'txtMatch',
            'txtTournament',
            'txtTeam',
            'txtNoAvaible',
            'txtRegisterBtn',
        ]);
    },
    /* Favorite End */

    /* Favorite List */
    FavoriteList: function (favoriteArray) {

        var myGames = localStorage.getItem('myGames');

        if (Help.Token()) {
            favoriteArray.forEach(function (val) {
                var PostUrl = ApiUrl + ApiPath.Favorites.list;
                var Value = {token: Help.Token(), type: val, timezone: Help.TimeZone()};

                /* User Login */
                if (Help.Token()) {
                    $.post(PostUrl, Value, function (response) {

                        response = response ? response : 0;

                        /* Match */
                        if (val == 'match') {

                            if (DV == 'desktop') {
                                $('#favorite-text').removeClass('display-none').find('span').text(response.favorites.length);
                            }

                            Events.MyGamesList({
                                Lists: response.favorites,
                                Login: 'Yes'
                            });
                        }

                        /* Tournament */
                        if (val == 'tournament') {
                            var tournament = $('#app-round-tournament');

                            if (DV == 'mobile') {
                                var list = $('#app-list-tournament').clone().removeAttr('id').removeClass('display-none');
                            }
                            else {
                                var list = $('#app-round-list').clone().removeAttr('id').removeClass('display-none');
                            }


                            tournament.html('');

                            if (response.favorites.length > 0) {

                                $('#app-round-tournament').removeClass('display-none');

                                response.favorites.forEach(function (val) {
                                    var data = val.payload;
                                    var finalList = list.clone();
                                    var photo = ApiUrl + ApiPath.Match.categoryLogo.replace('{categoryCode}', data.categoryCode);

                                    finalList
                                        .attr({'data-tournamentid': data.id});
                                    finalList
                                        .find('.photo')
                                        .attr('src', photo);

                                    if (DV == 'mobile') {
                                        finalList
                                            .find('.name')
                                            .text(data.name);
                                        finalList
                                            .find('.subname')
                                            .text(data.categoryName);
                                    }
                                    else {
                                        finalList
                                            .find('.name')
                                            .text(data.name);
                                    }

                                    finalList
                                        .find('.link')
                                        .attr({
                                            'href': '/' + Help.Sport('url') + UrlPath.Module.tournament.replace('{tournamentId}', data.id)
                                        });
                                    finalList
                                        .find('.star')
                                        .attr({
                                            'data-terms': 0,
                                            'data-type': 'tournament',
                                            'data-id': data.id,
                                            'data-mygames': 'yes'
                                        });

                                    if (DV == 'mobile') {
                                        finalList
                                            .find('.star')
                                            .addClass('active');
                                        finalList
                                            .find('.star')
                                            .find('.icon')
                                            .removeClass('icon-top-favourite-selected')
                                            .addClass('icon-top-favourite-selected')
                                    }

                                    tournament.append(finalList);
                                });
                            }
                            else {
                                if (DV == 'mobile') {
                                    tournament.html('<div class="error-default">No Favorite Tournament</div>');
                                }
                                else {
                                    $('#no-tournament').removeClass('display-none');
                                }
                            }
                        }

                        /* Team */
                        if (val == 'team') {
                            var team = $('#app-round-team');
                            var list = $('#app-round-list').clone().removeAttr('id').removeClass('display-none');

                            team.html('');

                            if (response.favorites.length > 0) {

                                $('#app-round-team').removeClass('display-none');

                                response.favorites.forEach(function (val) {
                                    var data = val.payload;
                                    var finalList = list.clone();
                                    var photo = ApiUrl + ApiPath.Match.teamLogo.replace('{teamId}', val.elementId);

                                    finalList
                                        .attr({'data-teamid': val.elementId});
                                    finalList
                                        .find('.photo')
                                        .attr('src', photo);
                                    finalList
                                        .find('.name')
                                        .text(data.name);
                                    finalList
                                        .find('.link')
                                        .attr({
                                            'href': '/' + Help.Sport('url') + UrlPath.Module.team.replace('{teamId}', val.elementId)
                                        });

                                    if (DV == 'mobile') {
                                        finalList
                                            .find('.star')
                                            .addClass('active');
                                        finalList
                                            .find('.star')
                                            .find('.icon')
                                            .removeClass('icon-top-favourite-selected')
                                            .addClass('icon-top-favourite-selected')
                                    }

                                    finalList
                                        .find('.star')
                                        .attr({
                                            'data-terms': 0,
                                            'data-type': 'team',
                                            'data-id': val.elementId,
                                            'data-mygames': 'yes'
                                        });

                                    team.append(finalList);
                                });
                            }
                            else {
                                if (DV == 'mobile') {
                                    team.html('<div class="error-default">No Favorite Team</div>');
                                }
                                else {
                                    $('#no-team').removeClass('display-none');
                                }
                            }
                        }

                    });
                }
                else {

                }
                /* User Login End */
            });
        }
        else {
            if (myGames) {

                var PostUrl = ApiUrl + ApiPath.Match.matchDetailsByIdList.replace('{sportId}', Help.Sport('id'));
                var Value = {lang: Help.LangId(), uniqueIds: myGames, timezone: Help.TimeZone()};

                $.post(PostUrl, Value, function (response) {
                    Events.MyGamesList({
                        Lists: response.matches,
                        Login: 'No'
                    });

                });

            }
        }


    },
    /* Favorite List End */

    /* Prediction List */
    PredictionList: function (type) {
        type = type ? type : '';
        var Container = $('#pr-container');
        var List = $('#pr-list').clone().removeAttr('id').removeClass('display-none');
        var PostUrl = ApiUrl + ApiPath.Predictions.list;
        var Value = {token: Help.Token(), result: 0};
        var PhotoLink = ApiUrl + ApiPath.Match.teamLogo;
        var matchLink = '/' + Help.Sport('url') + UrlPath.Module.match;

        $('#pr-page-link').attr('href', '/' + Help.Sport('url') + '/prediction');

        $.post(PostUrl, Value, function (response) {
            var postResponse = response.predictions ? response.predictions : 0;

            if (postResponse.length) {
                Container.removeClass('display-none');

                var i = 1;
                postResponse.forEach(function (val) {

                    if (val.predictionResult == 0 && i <= 4) {
                        if (!Container.find('[data-predictionid=' + val.predictionId + ']').length) {
                            var finalList = List.clone();
                            var match = val.match;

                            finalList.attr('data-predictionid', val.predictionId);

                            finalList
                                .find('.link')
                                .attr('href', matchLink.replace('{matchId}', match.id));
                            finalList
                                .find('.home .photo')
                                .attr('src', PhotoLink.replace('{teamId}', match.team1Id));
                            finalList
                                .find('.away .photo')
                                .attr('src', PhotoLink.replace('{teamId}', match.team2Id));
                            finalList
                                .find('.home .name')
                                .text(match.team1Name);
                            finalList
                                .find('.away .name')
                                .text(match.team2Name);
                            finalList
                                .find('.result span:eq(0)')
                                .text(val.predictionType == 'ft_win' ? 'FT' : 'HT');

                            if (val.predictionValue == 'home') {
                                var value = 1;
                            }
                            else if (val.predictionValue == 'away') {
                                var value = 2;
                            }
                            else if (val.predictionValue == 'draw') {
                                var value = 'x';
                            }

                            finalList
                                .find('.result span:eq(1)')
                                .text(value);
                            finalList
                                .find('.result span:eq(2)')
                                .text(val.predictionFactor);

                            if (type != "") {
                                Container.prepend(finalList);
                            }
                            else {
                                Container.append(finalList);
                            }
                        }

                        i++;
                    }
                });
            }
            else {
                Container.html('<div class="n-text">' + Language[Help.LangName()].txtNotPredictionMatch + '</div>');
            }

        });

    },
    /* Prediction List End */

    /* Prediction Page List */
    PredictionPageList: function () {
        var PostUrl = ApiUrl + ApiPath.Predictions.list;
        var Value = {token: Help.Token()};
        var matchLink = '/' + Help.Sport('url') + UrlPath.Module.match;

        var NewCountain = $('#pr-new-contain');
        var WinCountain = $('#pr-win-contain');
        var LoseCountain = $('#pr-lose-contain');
        var List = $('#app-pr-list-match').clone().removeAttr('id').removeClass('display-none');


        $.post(PostUrl, Value, function (response) {

            var postResponse = response.predictions ? response.predictions : 0;

            if (postResponse.length > 0) {

                postResponse.forEach(function (val) {

                    var match = val.match;
                    var finalList = List.clone();
                    finalList
                        .attr('data-productid', val.predictionId);
                    finalList
                        .find('.link')
                        .attr('href', matchLink.replace('{matchId}', match.id));
                    finalList
                        .find('.score')
                        .html(val.predictionResult > 0 ? ('<span>' + match.score.split('-')[0] + '</span> <span>-</span> <span>' + match.score.split('-')[1]) + '</span>' : '-');
                    finalList
                        .find('.home')
                        .text(match.team1Name);
                    finalList
                        .find('.away')
                        .text(match.team2Name);

                    if (val.predictionValue == 'home') {
                        var value = val.predictionType == 'ht_win' ? 'HT(1)' + val.predictionFactor : 'FT(1)' + val.predictionFactor;
                    }
                    else if (val.predictionValue == 'away') {
                        var value = val.predictionType == 'ht_win' ? 'HT(2)' + val.predictionFactor : 'FT(2)' + val.predictionFactor;
                    }
                    else if (val.predictionValue == 'draw') {
                        var value = val.predictionType == 'ht_win' ? 'HT(x)' + val.predictionFactor : 'FT(x)' + val.predictionFactor;
                    }

                    finalList
                        .find('.predict p:eq(1) strong')
                        .text(Language[Help.LangName()].txtAmount);
                    finalList
                        .find('.predict p:eq(2) strong')
                        .text(Language[Help.LangName()].txtGain);

                    finalList
                        .find('.predict p:eq(0)')
                        .text(value);
                    finalList
                        .find('.predict p:eq(1) span')
                        .text(val.predictionAmount);
                    finalList
                        .find('.predict p:eq(2) span')
                        .text(Math.ceil(val.predictionAmount * val.predictionFactor));

                    if (val.predictionResult == 0 && !NewCountain.find('[data-productid=' + val.predictionId + ']').length) {
                        finalList
                            .find('.remove')
                            .addClass('icon-cancel js-pr-remove')
                            .attr({'data-id': val.predictionId, 'data-parent': '#pr-new-contain'});

                        NewCountain.find('.no-data').addClass('display-none');
                        NewCountain.find('._cont').append(finalList);
                    }
                    else if (NewCountain.find('.pr-match-list').length < 1) {
                        NewCountain.find('.no-data').removeClass('display-none');
                    }


                    if (val.predictionResult == 1 && !WinCountain.find('[data-productid=' + val.predictionId + ']').length) {

                        finalList
                            .find('.remove')
                            .addClass('icon-cancel js-pr-remove')
                            .attr({
                                'data-id': val.predictionId,
                                'data-parent': '#pr-win-contain',
                                'data-terms': 'archive'
                            });

                        WinCountain.find('.no-data').addClass('display-none');
                        WinCountain.find('._cont').append(finalList);
                    }
                    else if (WinCountain.find('.pr-match-list').length < 1) {
                        WinCountain.find('.no-data').removeClass('display-none');
                    }

                    if (val.predictionResult == 2 && !LoseCountain.find('[data-productid=' + val.predictionId + ']').length) {
                        finalList
                            .find('.remove')
                            .addClass('icon-cancel js-pr-remove')
                            .attr({
                                'data-id': val.predictionId,
                                'data-parent': '#pr-lose-contain',
                                'data-terms': 'archive'
                            });

                        LoseCountain.find('.no-data').addClass('display-none');
                        LoseCountain.find('._cont').append(finalList);
                    }
                    else if (LoseCountain.find('.pr-match-list').length < 1) {
                        LoseCountain.find('.no-data').removeClass('display-none');
                    }

                });

            }
            else {
                NewCountain.find('.no-data').removeClass('display-none');
                WinCountain.find('.no-data').removeClass('display-none');
                LoseCountain.find('.no-data').removeClass('display-none');
            }

        });
    },
    /* Prediction Page List End */

    /* News Block */
    NewsBlock: function () {
        if (Help.PortalId() == 5) {
            $('#news-block').removeClass('display-none');
            if (Help.Token()) {
                $('#contentsLink')
                    .removeClass('js-login-modal')
                    .attr('href', '/' + Help.Sport('url') + '/contents');
            }
        }
    },
    /* News Block End */

    /* News List End */
    NewsList: function () {
        var container = $('#news-content');
        var list = $('#news-list').clone().removeClass('display-none').removeAttr('id');

        if (RequestNews.length > 0) {
            RequestNews.forEach(function (val) {
                var finalList = list.clone();
                if (val.hasVideo == true) {
                    finalList
                        .find('.play-icon')
                        .removeClass('display-none');
                }
                finalList
                    .find('.img')
                    .css('background-image', 'url(' + ApiUrl + '/photo/' + val.photoPath + ')');
                finalList
                    .find('.name')
                    .text(val.title);
                finalList
                    .find('.link')
                    .attr('href', '/' + Help.Sport('url') + '/content/' + val.id)
                container.append(finalList);
            });
        }
        else {
            Help.Redirect('/');
        }
    },
    /* News List End */

    /* News View */
    NewsView: function () {
        var PostUrl = ApiUrl + ApiPath.Contents.view.replace('{newsId}', Help.Url(3));
        var Value = {token: Help.Token()};
        var Content = $('#news-content');
        $.post(PostUrl, Value, function (response) {
            console.log(response);
            var data = response.content;
            Content
                .find('.img')
                .css('background-image', 'url(' + ApiUrl + '/photo/' + data.photoPath + ')');
            Content
                .find('.title')
                .text(data.title);
            Content
                .find('.content')
                .html(data.text);

            if (data.videoPath) {
                Content
                    .find('.video')
                    .removeClass('display-none')
                    .find('video')
                    .attr('src', ApiUrl + '/video/' + data.videoPath);
            }
        });
    },
    /* News View End */


};