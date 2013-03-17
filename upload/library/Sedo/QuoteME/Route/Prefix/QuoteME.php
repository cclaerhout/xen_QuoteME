<?php

class Sedo_QuoteME_Route_Prefix_QuoteME implements XenForo_Route_Interface
{
	public function match($routePath, Zend_Controller_Request_Http $request, XenForo_Router $router)
	{
		return $router->getRouteMatch('Sedo_QuoteME_ControllerPublic_QuoteMe', $routePath);
	}
}