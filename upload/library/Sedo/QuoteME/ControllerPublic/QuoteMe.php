<?php
class Sedo_QuoteME_ControllerPublic_QuoteMe extends XenForo_ControllerPublic_Abstract
{
	public function actionToTiny()
	{
		$options = XenForo_Application::get('options');
		
		$htmlraw = $this->_input->filterSingle('htmlraw', XenForo_Input::STRING);
		$output = $this->getHelper('Editor')->convertEditorHtmlToBbCode($htmlraw, $this->_input);

		if($options->quoteme_htmlmode_parseme)
		{
			$bbCodeParser = new XenForo_BbCode_Parser(XenForo_BbCode_Formatter_Base::create('Wysiwyg'));
			$output = $bbCodeParser->render($output); //Clean html
		}
		
		return $this->responseView('Sedo_QuoteME_ViewPublic_ToTiny', '', array(
			'tinyCode' => $output
		));
	}
}
