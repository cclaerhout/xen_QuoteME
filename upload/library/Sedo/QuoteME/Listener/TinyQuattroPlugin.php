<?php
class Sedo_QuoteME_Listener_TinyQuattroPlugin
{
	public static function addExtraPlugin(&$plugins)
	{
		$options = XenForo_Application::get('options');
		$visitor = XenForo_Visitor::getInstance();
	
		//Check if mobile
		if( class_exists('Sedo_DetectBrowser_Listener_Visitor') && isset($visitor->getBrowser['isMobile']))
		{
			//External Addon
			$isMobile = $visitor->getBrowser['isMobile'];
		}
		else
		{
			//XenForo
			$isMobile =  XenForo_Visitor::isBrowsingWith('mobile');
		}
			
		if($isMobile && $options->quoteme_debug_mobileoff)
		{
			return;
		}
		
		$plugins[] = 'xenquoteme';
	}
}