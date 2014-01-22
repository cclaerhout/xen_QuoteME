tinymce.PluginManager.add('xenquoteme', function(ed) {
	var quoteme = 'quoteme',
		$toggleMeMenu = $('#toggleMeMenu'),
		self = this;
		
	//Prevent bbm message alert
	ed.buttons['quoteme'] = false;
	
	if(!$toggleMeMenu.length || $toggleMeMenu.is(':hidden')){
		return false;
	}

	self.firstInit = true;
		
	function onClick(e){
		$toggleMeMenu.trigger('click');
		this.active($toggleMeMenu.hasClass('on'));
		
		if(self.firstInit){
			//ed.windowManager.alert('test');
			self.firstInit = false;
		}
	}

	function extBtnState(e){
		 var ctrl = this;

		 $toggleMeMenu.click(function(e){
		 	ctrl.active($toggleMeMenu.hasClass('on'));
		 	
		 	var args = {
				skip_focus: true
			};
			ed.execCommand('resetFright', false, false, args);
		 });
	}

	ed.addButton('quoteme', {
		name: quoteme,
		icon: quoteme,
		onclick: onClick,
		onPostRender: extBtnState,
		xenfright: true
	});
});