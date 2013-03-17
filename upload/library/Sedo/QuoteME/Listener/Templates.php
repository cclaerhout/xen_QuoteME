<?php
class Sedo_QuoteME_Listener_Templates
{
	public static function postrender($templateName, &$content, array &$containerData, XenForo_Template_Abstract $template)
	{
		if($templateName == 'editor')
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
			
			//Proceed if not mobile
			if(!$isMobile)
			{
				$Params = array(
						'javaScriptSource' => XenForo_Application::$javaScriptUrl,
						'mode' => $options->quoteme_mode,
						'htmlmode' => $options->quoteme_htmlmode_parseme
				);
				$content .= $template->create('quoteME', $Params);
			}
		}
	}
}
//Zend_Debug::dump($abc);