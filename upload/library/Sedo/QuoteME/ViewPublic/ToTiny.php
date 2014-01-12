<?php

class Sedo_QuoteME_ViewPublic_ToTiny extends XenForo_ViewPublic_Base
{
	public function renderJson()
	{
		$output = $this->filterOutput($this->_params['tinyCode']);

		return array(
			'tinyCode' => $output
		);
	}

	public function filterOutput($string)
	{
		$clickToExpandPhrase = new XenForo_Phrase('click_to_expand');

		$search[] = $this->wrapIntoParagraph($clickToExpandPhrase);
		
		$string = str_replace($search, '', $string);
	
		return $string;
	}
	
	public function wrapIntoParagraph($string)
	{
		return "<p>{$string}</p>";
	}
}