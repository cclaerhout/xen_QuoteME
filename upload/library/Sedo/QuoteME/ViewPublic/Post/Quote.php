<?php
class Sedo_QuoteME_ViewPublic_Post_Quote extends XFCP_Sedo_QuoteME_ViewPublic_Post_Quote
{
        public function renderJson()
        {
                $parent = parent::renderJson();

		$xenOptions = XenForo_Application::get('options');

		if($xenOptions->quoteme_disable_default_quotes){
	                return XenForo_ViewRenderer_Json::jsonEncodeForOutput(array(
	                        'quote' => ' ',
	                        'quoteHtml' => ' '
	                ));
		}
		
		return $parent;
        }
}