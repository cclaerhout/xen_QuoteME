<?php
class Sedo_QuoteME_Listener_Templates
{
	public static function postrender($templateName, &$content, array &$containerData, XenForo_Template_Abstract $template)
	{
		switch ($templateName) {
		   	case 'editor':
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
			
				//Do not proceed if not mobile
				if($isMobile)
				{
					break;
				}
				
				$params = $template->getParams();
				$params += array(
					'mode' => $options->quoteme_mode,
					'htmlmode' => $options->quoteme_htmlmode_parseme,
					'badIE' => self::_isBadIE()
				);
				
				$content .= $template->create('quoteME', $params);
	   		break;	
		}
	}

	protected static function _isBadIE($isBelow = 8)
	{
		$goTo = $isBelow-1;

		$visitor = XenForo_Visitor::getInstance();
		if(isset($visitor->getBrowser['IEis']))
		{
			//Browser Detection (Mobile/MSIE) Addon
			if($visitor->getBrowser['isIE'] && $visitor->getBrowser['IEis'] < $isBelow)
			{
				return true;
			}
		}
		else
		{
			//Manual helper
			if(Sedo_QuoteME_Helper_Sedo::isBadIE('target', "6-$goTo"))
			{
				return true;
			}
		}
		
		return false;
	}
}
//Zend_Debug::dump($abc);