/* DOCUMENT INFORMATION
	- Document: ZuniSport Web Project
	- Version:  1.0
	- Author:   Azeroglu Emin
*/

/* [ Controller Object ] */
Controller = {

    /* [ - Soccer Controller - ] */
    Soccer: function () {

        switch (Help.Url(2)) {

            /* [ Home Page ] */
            case '':
                Methods.Soccer.Home();
                break;
            /* [ Home Page End ] */

            /* [ Home Page ] */
            case "home":
                Methods.Soccer.Home();
                break;
            /* [ Home Page End ] */

            /* [ Match Page ] */
            case "match":
                Methods.Soccer.Match();
                break;
            /* [ Match Page End ] */

            /* [ Tournament Page ] */
            case "tournament":
                Methods.Soccer.Tournament();
                break;
            /* [ Tournament Page End ] */

            /* [ Team Page ] */
            case "team":
                Methods.Soccer.Team();
                break;
            /* [ Team Page End ] */

            /* [ Live Page ] */
            case "live":
                Methods.Soccer.Home();
                break;
            /* [ Live Page End ] */

            /* [ Leagues Page ] */
            case "leagues":
                Methods.Soccer.Leagues();
                break;
            /* [ Leagues Page End ] */

            /* [ Search Page ] */
            case "search":
                Methods.Soccer.Search();
                break;
            /* [ Search Page End ] */

            /* [ Favorite Page ] */
            case "favorite":
                Methods.Soccer.Favorite();
                break;
            /* [ Favorite Page End ] */

            /* [ Profile Page ] */
            case "profile":
                Methods.Soccer.Profile();
                break;
            /* [ Profile Page End ] */

            /* [ Prediction Page ] */
            case "prediction":
                Methods.Soccer.Prediction();
                break;
            /* [ Prediction Page End ] */

            /* [ Contents Page ] */
            case "contents":
                Methods.Soccer.Contents();
                break;
            /* [ Contents Page End ] */

            /* [ Content Page ] */
            case "content":
                Methods.Soccer.Content();
                break;
            /* [ Content Page End ] */

            /* [ Default Page ] */
            default:
                Help.Redirect('/');
                break;
            /* [ Default Page End ] */

        }

    },
    /* [ - Soccer Controller End - ] */

}
/* [ Controller Object End ] */