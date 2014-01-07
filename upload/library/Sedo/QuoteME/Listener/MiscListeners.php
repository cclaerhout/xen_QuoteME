<?php
class Sedo_QuoteME_Listener_MiscListeners
{
	public static function extendViewPublicPostQuote($class, array &$extend)
	{
		if ($class == 'XenForo_ViewPublic_Post_Quote')
        	{
			$extend[] = 'Sedo_QuoteME_ViewPublic_Post_Quote';
		}	
	}
}
