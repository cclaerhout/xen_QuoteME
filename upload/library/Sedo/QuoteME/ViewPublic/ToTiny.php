<?php

class Sedo_QuoteME_ViewPublic_ToTiny extends XenForo_ViewPublic_Base
{
	public function renderJson()
	{
		return array(
			'tinyCode' => $this->_params['tinyCode']
		);
	}
}