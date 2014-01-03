<?php
class Sedo_QuoteME_Listener_PreloadTemplates
{
	public static function template_preload($templateName, array &$params, XenForo_Template_Abstract $template)
	{
		if ($templateName == 'editor')
		{
			$template->preloadTemplate('quoteME');
		}
	}
}
