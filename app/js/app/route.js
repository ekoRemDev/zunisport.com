/* DOCUMENT INFORMATION
	- Document: ZuniSport Web Project
	- Version:  1.0
	- Author:   Azeroglu Emin
*/

switch (Help.Url(1)) {

    /* Soccer Controller */
    case "soccer":
        Controller.Soccer();
    break;
    /* Soccer Controller End */

    /* Default Controller */
    case "default":
        Controller.Default();
        break;
    /* Default Controller End */

}


/* Mobile Link */
if ( DV == 'mobile' ) {
    $('footer .nav-link').removeClass('active');
    if ( Help.Url(2) == 'live' || Help.Url(2) == 'favorite' || Help.Url(2) == 'leagues' || Help.Url(2) == 'prediction' ) {
        $('footer .nav-link[data-link='+Help.Url(2)+']').addClass('active');
    }
    else {
        $('footer .nav-link:eq(0)').addClass('active');
    }
}