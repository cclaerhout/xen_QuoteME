<?php
class Sedo_QuoteME_Listener_TinyQuattroPlugin
{
	public static function addExtraPlugin($mceConfigObj)
	{
		if(is_array($mceConfigObj))
		{
			return;
		}
		
		$options = XenForo_Application::get('options');
		
		if($mceConfigObj->isMobile() && $options->quoteme_debug_mobileoff)
		{
			return;
		}
		
		$mceConfigObj->addMcePlugin('xenquoteme');
		$mceConfigObj->addMenuItem('quoteme', 'tools');
	}
}