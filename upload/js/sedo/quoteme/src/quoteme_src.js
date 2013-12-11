/*QuoteME (1.8.1) by Cédric CLAERHOUT - Licence: CC by*/
if(typeof Sedo == 'undefined') var Sedo = {};

!function($, window, document, _undefined)
{    
	Sedo.QuoteME = 
	{
		isOn: true,
		isTrans: false,
		QM: '#QuoteMe',
		QMT: '#QuoteMeTrigger',
		QME: '#QuoteMeEl',
		editorID: 'ctrl_message_html',
		isRte: false,
		isRteBbCode: false,
		isTinyMCE: false,
		isRedactor: false,
		editorType: 'notRte', //notRte rteBB rteFull
		redactor: '',
		srcType: 'txt',
		init: function($element)
		{
			var t = Sedo.QuoteME;
			$QM = $(t.QM);

			/***
				Hide QuoteME
			*/
			$('body:not('+t.QM+')').unbind('mousedown').bind('mousedown', function(e) {
				if(!t.isOn)
					return;

				//Check if there is already some selected text (after a right click)
				t.getSelectedText();
				
				if(t.SelectedText && e.which == 1)
					t.unSelect(); //If there is => unselect
	
				//Need to use the element to check if click element is QuoteMe div box
				if (e.target.id == 'QuoteMe')
					return;
	
				if($QM.is(":visible") && e.which == 1) { //left click
					t.unSelect();
					$QM.hide();
					return;
				}
				
				if(e.which != 1) { //other clicks
					$QM.hide();
					return;					
				}
			});
	
			/***
				Display QuoteME
			*/
			$element.not(t.QM).unbind('mouseup').bind('mouseup', function(e) 
			{
				if(!t.isOn)
					return;
					
				if($QM.is(":hidden") && e.which == 1) { //left click
					var CheckCb = t.config(this);
	
					if(CheckCb === false) {
						$QM.hide();
						return;
					}
	
					var ModePos = $QM.data('pos');
					
					if(ModePos == 'absfix'){
						var pos = $(e.target).parents('.messageContent').position(),
						off = $(e.target).parents('.messageContent').offset();
						
						if(off == null || pos == null)
							return;
						
						var top = Math.round(e.pageY - (off.top - pos.top))+1 + 'px', // the incrementation of 1 is to solve the Bug of year on old versions of IE
						left = e.pageX + 'px';
	
						$QM.show().css({'position':'absolute', 'left':left, 'top':top}); 							
					} else if(ModePos == 'abs') {
						$QM.show().css({'position':'absolute', 'left':e.pageX+1+'px','top':e.pageY+1+'px'});
					} else {
						$QM.show().css({'position':'fixed', 'left':e.clientX+1+'px','top':e.clientY+1+'px'});
					}
	
					return;
				}
	
				if(e.which != 1) //other clicks
					return;
			});
			
			/***
				Execute QuoteME
			*/
			$QM.unbind('click').bind('click', function(e)
	       	  	{
				if (t.SelectedMode == 'txt') {
					t.execute(t.SelectedText);
				} else{
					if(t.SelectedText){
						XenForo.ajax(
							'index.php?quoteme/to-tiny',
							{ htmlraw:t.SelectedText },
							t.rawHtml2cleanHtml
						);
					}
				}
	
				$QM.hide();
				return;
			});
		},
		getParams: function()
		{
			$editor = $('#'+this.editorID);

			var t = this,
			redactor = $editor.data('redactor');

			/*Editor datas*/
			
			if (typeof tinyMCE !== 'undefined') {
				this.isTinyMCE = true;
				this.isRte = true;
			}
			
			if (typeof redactor !== 'undefined' && redactor !== null) {
				this.isRedactor = true;
				this.redactor = redactor;
				this.isRte = true;
			}

			this.isRteBbCode = (this.isRte == true && $editor.attr('disabled')) ? true : false;

			if(this.isRte == true){
				this.editorType = (this.isRteBbCode == true) ? 'rteBB' : 'rteFull';
			}

			this.srcType = (this.editorType == 'rteFull') ? 'html' : 'txt';
		
			/*
			if (this.isTinyMCE || this.isRedactor) {
				$bbcodeEditor = $('.bbCodeEditorContainer');
				
				if( $bbcodeEditor.length != 0 )
					t.editor = 'rteBB';
				else
					t.editor = 'rteFull';
      			}
      			
			/*Selection Mode*/
      			$QM = $(t.QM); 
			t.Mode = $QM.data('mode');

			/*Html Mode*/
			t.HtmlMode = 0;
			if( t.Mode != 'QmText'){
				t.HtmlMode = parseInt($QM.data('html'));
			}
			
			/*Trans Mode*/	
			t.isTrans = (parseInt($QM.data('trans'))) ? true : false;
      			
		},
		config: function(this_button)
		{
			//Init is done after mouseup event on .messageContent
			var t = this;
			
			//Prepare key coponents
			t.getParams();
			
			switch (t.Mode) {
				case 'QmText': 
					//The Mode must be setup first!!!
					t.Mode = 'txt';
					t.checkHtml = false;
					break;
				case 'QmHtml': 
					t.Mode = 'html';
					t.checkHtml = true;
					
					break;
				default : 
					t.Mode = 'htmlwrap';
					t.checkHtml = true;
					break;
			}

			if(t.checkHtml === true && t.editorType == 'rteFull'){
				t.SelectedMode = 'html';
				t.SelectedText = t.getSelectedTextHtml();
			} else{
				t.SelectedMode = 'txt';
				t.SelectedText = t.getSelectedText();
			}
			//Check if selection (text-mode) is empty
			if(!t.SelectedText)
				return false;
	
			//Check if selection (html-mode) is empty or if the content has a <embed> tag => disable flash
			if ( t.Mode != 'txt' && t.SelectedText.match(/<(\w+)(?:[^>]+?)?><\/\1>|<embed[^>]+?>/i) )
				return false;
			
			//Get Author & MessageID 
			t.Author = $(this_button).parents('.message').data('author');
			t.MessageID = $(this_button).parents('.message').attr('id');
			
			//Get AuthorID (Message template must have been modified)
			t.AuthorID = $(this_button).parents('.message').attr('data-author-id');
	
			if(t.AuthorID)
				t.AuthorID = ', member: '+t.AuthorID;
			else
				t.AuthorID = '';
			
			//Are we in messages or conversations?
			if ( t.MessageID.match(/post-/i) ) { //We are in messages
				t.MessageType = 'post';
				t.MessageID = t.MessageID.replace(/post-/i, '');
			} else if ( t.MessageID.match(/message-/i) ) { //We are in conversation
				t.MessageType = 'convMessage';
				t.MessageID = t.MessageID.replace(/message-/i, '');
			}
		},
		execute: function(SelectedText)
		{
			var t = Sedo.QuoteME;
						
			//Avoid extra breaklines if clean parsed html is activated)
			if(t.HtmlMode == 1)
				SelectedText = SelectedText.replace(/^<p>([\s\S]+)<\/p>$/i, '$1');
			
			//Format quotation
			if(t.Author && t.MessageID && t.MessageType)
				SelectedText = '[quote="'+t.Author+', '+t.MessageType+': '+t.MessageID+t.AuthorID+'"]' + SelectedText + '[/quote]';
			else
				SelectedText = '[quote]' + SelectedText + '[/quote]';
	      
			//Put in global variable
			t.SelectedText = SelectedText;
			
			//To which editor should it be sent ?
			if(t.isTrans){
				t.transMode();
			}else{
				t.prepareSel();
				t.edDispatcher();
			}
		},
		edDispatcher: function()
		{
			var t = this;
			console.info('Editor mode: '+t.editorType+', Text mode: '+t.Mode);
			switch (t.editorType) {
				case 'rteBB':
					t.RTE_BBcodeEditor();
				break;
				case 'rteFull':
					t.RTE_Wysiwyg();
				break;
				case 'notRte':
					t.notRTE_BBcodeEditor();
				break;
			}		
		},
		transMode: function()
		{
			/* Send object to Memory */
			var t = this,
			objQM = t.getObjQM(),
			data = t.SelectedText,
			i = 1,
			mode = (t.editorType == 'rteFull') ? 'html' : 'txt';
			
			if(!objQM){
				var objQM = {};
			} else {
				i = t.getObjIdx(objQM);
			}

			objQM[i] = {
				data: data,
				type: t.srcType
			};

			t.setObjQM(objQM);

			$(t.QMT).parent().show();
			$(t.QME).text(i);
		},
		transAction:function()
		{
			/* Once Get Quotes Trigger called */
			var t = this;
			t.getParams();
			
			var objQM = t.getObjQM(),
			text = '';

			if(!objQM) return;
			
			$.each( objQM, function(k, v) {
				t.SelectedText = v.data; 
				t.prepareSel(v.type);
				text += t.SelectedText;
			});

			t.SelectedText = text;
			t.edDispatcher();
			
			$(t.QMT).parent().hide();
			t.killObjQM();
		},
		prepareSel: function(chk)
		{
			var src = this, selText = src.SelectedText, mode = src.srcType, breakOpen, breakEnd, hasContent;
			
			if(typeof chk === 'undefined')
				chk = mode; // if the chk is undefined it means transpage is not activated, let's copy mode to chk then
			
			/*Bb Code Editor*/		
				if(mode == 'txt'){
					if(chk != 'txt'){ //The active editor is a BbCode editor but the text has been saved with the html format
						selText = selText.replace(/<[^>]+>/ig,'');	 //=> strip tags
						selText = src.unescapeHtml(selText); 			//=> unescape tinyMce escaped html
					}

					$editor = src.getBbCodeEditor();
					hasContent = $editor.val();
					breakOpen = (hasContent) ? '\r\n' : '';

					src.SelectedText = breakOpen + selText + '\r\n';
					return;
				}

			/*RTE Editor*/
			
				/*TinyMCE*/
				if(this.isTinyMCE){
					breakOpen = (tinyMCE.isIE) ? '<p>&nbsp;</p>' : '<p><br /></p>', 
					breakEnd = breakOpen;
					 
					hasContent = tinyMCE.activeEditor.getContent();
				}
				
				/*Redactor*/
				if(this.isRedactor){
					breakOpen = (this.redactor.browser('msie')) ? '<p>&nbsp;</p>' : '<p><br /></p>';
					breakEnd = breakOpen;
					
					hasContent = this.redactor.getCode();
				}

				hasContent = hasContent.replace(/<[^>]+>|&nbsp;/ig,'');

				if(!hasContent)
					breakOpen = '';
	
				if(src.HtmlMode == 0 && chk == 'html'){//Src Mode: text || Output Mode: Html (wysiwyg Editor)
					selText = src.escapeHtml(selText);
				}
	
				if(chk != 'html'){ //The active editor is RTE but the text has been saved with the text format
					selText = src.escapeHtml(selText);
				}
	
				src.SelectedText = breakOpen+'<p>'+selText+'</p>'+breakEnd;
		},
		notRTE_BBcodeEditor: function()
		{
			$editor = this.getBbCodeEditor();
			$editor.val( $editor.val() + this.SelectedText);
		},
		RTE_BBcodeEditor: function()
		{
			$editor = this.getBbCodeEditor();
			$editor.val( $editor.val() + this.SelectedText);
		},
		RTE_Wysiwyg: function()		
		{
			var src = this, 
				editorID = src.editorID,
				selectedText = src.SelectedText;
				
			if(src.isTinyMCE){
				if(tinyMCE.majorVersion > 3){
					var args = {
						skip_focus: true
					};

					tinyMCE.EditorManager.get(editorID).execCommand('mceInsertContent', false, selectedText, args);
				}else{
					tinyMCE.getInstanceById(editorID).execCommand('mceInsertContent', false, selectedText);
				}
			}else if(src.isRedactor){
				src.redactor.insertHtml(selectedText);//bug on IE (the last quote is preprend instead of being append to the content
			}
		},
		getBbCodeEditor: function(manual)
		{
			var src = this, edType = (manual || src.editorType);
			
			switch (edType) {
				case 'rteBB': return $('.bbCodeEditorContainer').find('textarea.textCtrl');
				case 'notRte': return $('.textCtrl.MessageEditor');
				default: 
					console.info('Bb Editor not found');				
					return $();
			}
		},
		unSelect: function()
		{
			if ( document.selection ) {
				document.selection.empty();
			} else if ( window.getSelection ) {
				window.getSelection().removeAllRanges();
			}
		},
		getSelectedText: function()
		{
			if (window.getSelection) {
				return window.getSelection().toString();
			} else if (document.getSelection){
				return document.getSelection();
			} else if (document.selection) {
				return document.selection.createRange().text;
			}
		},
		getSelectedTextHtml: function()		
		{		
			var t = this;

			//Src: http://stackoverflow.com/questions/5222814/window-getselection-return-html
			if (typeof window.getSelection != 'undefined'){
				var sel;
				sel = window.getSelection();
	
				if (sel.rangeCount){
					var container;
					container = document.createElement('div');
	
					for (var i = 0, len = sel.rangeCount; i < len; ++i) {
						container.appendChild(sel.getRangeAt(i).cloneContents());
	          			}
	
					if(t.Mode == 'htmlwrap' && sel.anchorNode.parentNode.outerHTML) {
						//Fix to try to get the above element styling (bold, italic, etc.)
						//Tested on Firefox (last version), Opera, IE9
						var parent = sel.anchorNode.parentNode.parentElement.outerHTML.replace(/(^<[^>]+?>)([\s\S]+)(<[^>]+?>$)/, '$1{target}$3');
						return parent.replace('{target}', container.innerHTML);
					}
					
					return container.innerHTML
				}
			}
			else if (typeof document.selection != "undefined"){
				// IE < 9
				if (document.selection.type == "Text") {
					if(t.Mode == 'htmlwrap' && document.selection.createRange().parentElement().outerHTML )	{
						//Fix to try to get the above element styling (bold, italic, etc.) || Regex is different than above cause it wasn't working with start (^) and end ($) anchors 
						//Tested on IE7 & IE8
						var parent = document.selection.createRange().parentElement().outerHTML.replace(/(<[^>]+?>)([\s\S]+)(<[^>]+?>)/, '$1{target}$3');
						return parent.replace('{target}', document.selection.createRange().htmlText);
					}
	
					return document.selection.createRange().htmlText;
				}
	  		}
		},
		rawHtml2cleanHtml: function(ajaxdata)
		{
			Sedo.QuoteME.execute(ajaxdata.tinyCode);
			return false;
		},
		unescapeHtml: function(string, options) 
		{
			string = string
				.replace(/&amp;/g, "&")
				.replace(/&lt;/g, "<")
				.replace(/&gt;/g, ">")
				.replace(/&quot;/g, '"')
				.replace(/&#039;/g, "'");
				
			if(options == 'noBlank'){
				string = string
					.replace(/	/g, '\t')
					.replace(/&nbsp;/g, '  ')
					.replace(/<\/p>\n<p>/g, '\n');
			}
	      
			var regex_p = new RegExp("^<p>([\\s\\S]+)</p>$", "i");
			if(regex_p.test(string)){
				string = string.match(regex_p);
				string = string[1];
			}
				
			return string;
		},
		escapeHtml: function(string, options) 
		{
			if( options !== 'onlyBlank' ){
				string = string
					.replace(/&/g, "&amp;")
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;")
					.replace(/"/g, "&quot;")
					.replace(/'/g, "&#039;");
			}

			if( options !== 'noBlank' ){
				string = string
					.replace(/\t/g, '	')
					.replace(/ /g, '&nbsp;')
					.replace(/\n/g, '</p>\n<p>');
      			}

			return string;
		},	
		menuInit: function($e)
		{
			var t = Sedo.QuoteME, txt; 
			t.menuOn = $e.data('title');
			t.menuOff = $e.data('off');
			t.isOn = false;

			$e.show()
			.click(function(e){
				e.preventDefault();
				if($e.hasClass('off')){
					$e.removeClass('off').addClass('on');
					t.isOn = true;
				}else{
					$e.removeClass('on').addClass('off');
					t.isOn = false;
				}
			})			
			.data('tooltip').onBeforeShow(function(e){
				if($e.hasClass('off'))
					txt = t.menuOn;
				else
					txt = t.menuOff;
					
				this.getTip().text(txt);
			});
		},
		getObjQM: function(){
			return $.jStorage.get('quoteme', false);
		},
		setObjQM: function(objQM){
			$.jStorage.set('quoteme', objQM, {TTL: 600000});
		},
		killObjQM: function(){
			$.jStorage.deleteKey('quoteme');
		},
		getObjIdx: function(obj){
			var i = 1;
			$.each(obj, function() { i++; });
			return i;
		},
		transTrigger:function($e)
		{
			var t = Sedo.QuoteME;

			$QM = $(t.QM); 
			t.isTrans = (parseInt($QM.data('trans'))) ? true : false;
			
			if(!t.isTrans) return;
				
			var objQM = t.getObjQM();
			
			if(objQM !== false){
				$e.trigger('click');
				var i = t.getObjIdx(objQM);

				$e.parent().show();
				$(t.QME).text(i-1)
			}
				
			$e.click(function(e){
				e.preventDefault();
				t.transAction();
			});		
		}
	}

	if (!XenForo.isTouchBrowser()){
		XenForo.register('#toggleMeMenu', 'Sedo.QuoteME.menuInit');
		XenForo.register('#QuoteMeTrigger', 'Sedo.QuoteME.transTrigger');		
		XenForo.register('.messageContent', 'Sedo.QuoteME.init');
	}
}
(jQuery, this, document);