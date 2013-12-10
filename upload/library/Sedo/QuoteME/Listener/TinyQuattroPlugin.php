<?php
class Sedo_QuoteME_Listener_TinyQuattroPlugin
{
	public static function addExtraPlugin(&$plugins)
	{
		if(XenForo_Application::get('options')->get('quoteme_activation'))
		{
			$plugins[] = 'xenquoteme';
		}
	}
}