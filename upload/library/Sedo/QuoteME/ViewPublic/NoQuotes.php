<?php

class Sedo_QuoteME_ViewPublic_NoQuotes extends XFCP_Sedo_QuoteME_ViewPublic_NoQuotes
{
	public function renderJson()
	{
		parent::renderJson();

		return XenForo_ViewRenderer_Json::jsonEncodeForOutput(array(
			'quote' => '',
			'quoteHtml' => ''
		));
	}
}