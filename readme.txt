**********************************
* QuoteME v.1.5                  *
* by Cédric CLAERHOUT            *
**********************************

**********************************
*      Addon Presentation        *
**********************************
This addon allows you to select some text in a message and quote it into the editor with a little popup
I had this addon on vBulletin and my members and I loved it. So now here it is on XenForo :)

Works with 
> the TinyMCE editor
> the normal 'editor' (textarea) being used with TinyMCE
> the normal 'editor' (textarea) used alone
> Markitup Integrator addon

Tested on
Firefox, Opera, Chrome, IE9, IE8, IE7
Disable on Mobile device by php detection => When enabled, it was impossible to select some text on ipad
=>This php detection will use the default Xenforo method OR will automatically the one provided by the following addon once activated:
http://xenforo.com/community/resources/browser-detection-mobile-msie.1098/


**********************************
*         Installation           *
**********************************
1) Upload the files on your forum directory
2) Import xml file


**********************************
*        Configuration           *
**********************************
>[OLD VERSION] If you're using a custom theme, you will certain have to configurate the 'margin-top'.
I might have missed something but I didn't find a way to automatically correct this margin in the javascript file.

So to proceed, it's extremely simple, just go to AdminCp=>Appearance=>Style properties=>(Select your style)=>QuoteME
Then change here the margin-top (negative value) (default:-10px)

>[NEW VERSION] If you have positionning problems with the QuoteMe Box, go here to configure this:
AdminCp=>Appearance=>Style properties=>(Select your style)=>QuoteME

>This addon has also options you can configurate, just go here:
AdminCp=>Home=>Options=>QuoteME



