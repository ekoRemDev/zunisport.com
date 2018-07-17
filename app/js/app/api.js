/* DOCUMENT INFORMATION
	- Document: ZuniSport Web Project
	- Version:  1.0
	- Author:   Azeroglu Emin
*/

var Help = {};
var Controller = {};
var Methods = {};
var Request = {};
var Language = {};
var LanguageCode = {};
var Events = {};
var Handler = {};
var ApiPath = {};
var SportData = {};
var UrlPath = {};
var ContainerBlock = $('#app-container');
var Loading = $('.loading-gif');
var Path = null;
var Device = new MobileDetect(window.navigator.userAgent);
var ApiUrl = 'https://api.zunisport.com';
var PortalPath = 'https://api.zunisport.com/admin/photo';
var DefaultUserAvatar = 'https://zunisport.com/style/path/img/user.svg';
var UserParams  =   {};
var LiveViewLink = 'https://api.zunisport.com/match/{matchId}/lmt/{token}';

/* Api Path */
ApiPath = {

    /* General */
    General: {
        appData: '/v2/appData',
        terms: '/terms',
        matchStatuses: '/match/statuses',
        userFeedback: '/user/feedback',
        handleEvent: '/handle/event',
        topics: '{token}/rel/topics/{topic}',
        search: '/search',
        userSubscription: 'user/subscription'
    },
    /* General End */

    /* Match */
    Match: {
        matchDetails: '/match/{matchId}',
        matchLineups: '/match/{matchId}/lineups',
        matchGolas: '/match/{matchId}/goals',
        matchCards: '/match/{matchId}/cards',
        matchSubstitutions: '/match/{matchId}/substitutions',
        matchStatistics: '/match/{matchId}/statistics',
        matchH2h: '/match/{matchId}/h2h',

        LiveOnline: '/match/live/{sportId}/online',
        LiveTeam: '/match/live/{sportId}/team',
        LiveTournament: '/match/live/{sportId}/tournament',

        matchOfTournament: '/v2/match/list/{sportId}/tournament',
        tournamentStandings: '/tournament/leagueTable',
        matchByDate: '/v2/match/list/{sportId}/home',
        matchOfTeam: '/v2/match/list/{sportId}/team',
        matchOnline: '/v2/match/list/{sportId}/online',

        leaguesList: '/leagues/{sportId}',
        search: '/search?q={text}',
        championships: '/championships',
        championshipMatches: '/match/list/{sportId}/championship',
        categoryLogo: '/category/logo/{categoryCode}.png',
        teamLogo: '/team/logo/{teamId}',
        matchDetailsByIdList: '/match/{sportId}/details',
        matchShortInfo: '/match/live'
    },
    /* Match End */

    /* Predictions */
    Predictions: {
        add: '/prediction/add',
        delete: '/prediction/delete',
        archive: '/prediction/archive',
        list: '/prediction/list',
        odds: '/match/{matchId}/odds'
    },
    /* Predictions End */

    /* User */
    User: {
        setLang: '/user/setLang',
        me: '/user/me',
        setAvatar: '/user/setAvatar',
        firebase: '/user/register/firebase',
        register: '/v2/user/register',
        sms: '/v2/user/verify/sms',
        login: '/user/login',
        username: '/user/setUsername',
        activate: '/user/activate',
        logout: '/user/logout',
        start: '/v2/user/login/start',
        end: '/user/login/end',
        auto: '/user/login/auto',
        status: '/v2/user/status',
    },
    /* User End */

    /* Favorites */
    Favorites: {
        add: '/favorite/add',
        delete: '/favorite/delete',
        list: '/favorite/list',
        favorites: '/user/favorites'
    },
    /* Favorites End */

    /* Contents */
    Contents: {
        list: '/match/contents',
        view: '/match/content/{newsId}'
    }
    /* Contents End */

};
/* Api Path End */

/* Sport Data */
SportData = {
    'soccer': {id: 1, name: 'Soccer', url: 'soccer'},
    'basketball': {id: 2, name: 'Basketball', url: 'basketball'},
    'ice-hockey': {id: 4, name: 'Ice Hockey', url: 'ice-hockey'},
    'tennis': {id: 5, name: 'Tennis', url: 'tennis'}
};
/* Sport Data End */

/* Url Path */
UrlPath = {
    Module: {
        'home': '/home',
        'match': '/match/{matchId}',
        'team': '/team/{teamId}',
        'tournament': '/tournament/{tournamentId}'
    }
}
/* Url Path End */


/* Redirect Folder */
if (Device.mobile()) {
    Path = 'public/mobile';
    PathDir = 'public/mobile';
    DV = 'mobile';
}
else {
    Path = 'public/desktop';
    PathDir = 'public/desktop';
    DV = 'desktop';
}
