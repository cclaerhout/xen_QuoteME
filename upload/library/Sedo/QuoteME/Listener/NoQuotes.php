<?php
class Sedo_QuoteME_Listener_NoQuotes
{
	public static function extend($class, array &$extend)
	{
		$xenOptions = XenForo_Application::get('options');

		if ($class == 'XenForo_ViewPublic_Post_Quote' && $xenOptions->quoteme_disable_default_quotes)
		{
			$extend[] = 'Sedo_QuoteME_ViewPublic_NoQuotes';
		}
	}
}