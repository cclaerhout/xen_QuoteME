/*QuoteME (2.0.5.2) by Cedric CLAERHOUT - Licence: CC by*/
if(typeof Sedo === 'undefined') var Sedo = {};

!function($, window, document, undefined)
{    
	Sedo.QuoteME = 
	{
		isOn: true,
		isTrans: false,
		QM: '#QuoteMe',
		QMT: '#QuoteMeTrigger',
		QME: '#QuoteMeEl',
		editorID: 'ctrl_message_html',
		allowContent: '.messageContent',
		isRte: false,
		isRteBbCode: false,
		isTinyMCE: false,
		isRedactor: false,
		editorType: 'notRte', //notRte rteBB rteFull
		redactor: '',
		srcType: 'txt',
		init: function($element)
		{
			var self = Sedo.QuoteME;
			
			var $QM = $(self.QM),
				pressDown = $.proxy(self, '_initPressDown'),
				pressUp = $.proxy(self, '_initPressUp'),
				qmClick = $.proxy(self, '_initQmClick');

			self.$element = $element;
			
			/***
			 * Hide QuoteME + Get selection
			 **/
			self.eventTypeDown = null;
			var downEvents = 'mousedown'; //Default event
			$('body:not('+self.QM+')').unbind(downEvents, pressDown).bind(downEvents, pressDown);

			/***
			 * Display QuoteME
			 **/
			self.eventTypeUp = null;
			var upEvents ='qm_ready mouseup';
			$element.not(self.QM).unbind(upEvents, pressUp).bind(upEvents, pressUp);
			
			/***
			 * Execute QuoteME
			 **/
			var exeEvents ='click';
			$QM.unbind(exeEvents, qmClick).bind(exeEvents, qmClick);
		},
		_bindTouch: function(status)
		{
			var self = this, 
				downEvents = 'touchstart', 
				pressDown = $.proxy(self, '_initPressDown'),
				$target = $('body:not('+self.QM+')');
				
			if(status == undefined || status)
				$target.unbind(downEvents, pressDown).bind(downEvents, pressDown);
			else
				$target.unbind(downEvents, pressDown);
		},
		_initPressDown: function(e)
		{
			var self = this,
				isInsideAllowContent = $(e.target).parents(self.allowContent).length;

			if(!self.isOn)
				return;

			/* Need to use the element to check if click element is QuoteMe div box */
			if (e.target.id == 'QuoteMe')
				return;

			/* Prevent the two events to be executed at the same time */
			if(self.eventTypeDown != undefined && self.eventTypeDown != e.type){
				return;
			}

			self.eventTypeDown = e.type;

			var $QM = $(self.QM), 
				isMousedown = (e.type == 'mousedown'),
				isTouchEv = (e.type == 'touchstart'),
				isMousedownLeftClick = (isMousedown && e.which == 1),
				isMousedownOtherClick = (isMousedown && e.which != 1);

			/* Check if there is already some selected text (after a right click) */
			self.getSelectedText();

			if(self.SelectedText && (isMousedownLeftClick || isTouchEv) )
				self.unSelect(); //If there is => unselect

			/* Touch management */
			if(isTouchEv && self.addEventSupport && isInsideAllowContent){
				/**
				 * The addEventListener can't be activated on a single element.
				 * It must be use with the document 
				 **/
				
				self._moveReset();
				self.lastTouch = e;
				
				if(self.selChangeActivated == undefined || !self.selChangeActivated){
					document.addEventListener('selectionchange', self._touchSelec, false);
					self.selChangeActivated = true;
				}
			}

			if($QM.is(":visible") && (isMousedownLeftClick || isTouchEv) ) {
				self.unSelect();
				$QM.hide();
				return;
			}
				
			if(isMousedownOtherClick) {
				$QM.hide();
				return;					
			}			
		},
		_initPressUp: function(e)
		{
			var self = this;

      			if(!self.isOn)
      				return;
	
			var $QM = $(self.QM),
				isMouseup = (e.type == 'mouseup'),
				isQmReady = (e.type == 'qm_ready'),
				isMouseupLeftClick = (isMouseup && e.which == 1),
				isMouseupOtherClick = (isMouseup && e.which != 1),
				modePos = $QM.data('pos'),
				touch = 'touch';

			//Prevent the two events to be executed at the same time
			if(self.eventTypeUp != undefined && self.eventTypeUp != e.type){
				return;
			}
					
			self.eventTypeUp = e.type;

			//Touch management
			if(isQmReady && self.addEventSupport){
				var selectionHasChanged = self.selectionHasChanged,
					lastTouch = self.lastTouch;

				/***
				 * Since the addEventListener binds functions on the document,
				 * we must check if we're inside the quoteme activation zone
				 ***/
				 if(!lastTouch || lastTouch.target == undefined)
				 	return;
				
				var isInsideAllowContent = $(lastTouch.target).parents(self.allowContent).length;
				
				if(!isInsideAllowContent)
					return;

				modePos = touch;

				//self._moveReset(true);//Not sure if useful

				if(!selectionHasChanged || self.SelectedText == undefined){
					$QM.hide();
					return;
				};
			}
      				
      			if($QM.is(":hidden") && (isMouseupLeftClick || isQmReady) ) {
      				var CheckCb = self.config(e.currentTarget); //We're in a proxy, do not use 'this' 

      				if(CheckCb === false) {
      					$QM.hide();
      					return;
      				}

     				if(modePos == 'absfix'){
      					var pos = $(e.target).parents(self.allowContent).position(),
      					off = $(e.target).parents(self.allowContent).offset();
      					
      					if(off == null || pos == null){
      						modePos = 'fb';
      					}else {
	      					var top = Math.round(e.pageY - (off.top - pos.top))+1 + 'px', // the incrementation of 1 is to solve the Bug of year on old versions of IE
      							left = e.pageX + 'px';
      
      						$QM.show().css({'position':'absolute', 'left':left, 'top':top});
      						return;
      					}							
      				}

      				if(modePos == 'abs') {
      					$QM.css({'position':'absolute', 'left':e.pageX+1+'px','top':e.pageY+1+'px'});
      				} else if(modePos == touch) {
      					$QM.addClass(touch);
      				} else {
      					$QM.css({'position':'fixed', 'left':e.clientX+1+'px','top':e.clientY+1+'px'});
      				}

				$QM.show();
      				return;
      			}
      
			if(isMouseupOtherClick) {
				return;					
			}
		},
		_initQmClick: function(e)
		{
			e.preventDefault(); //needed for fixed position if an element is below

			var self = this, $QM = $(self.QM);

      			if(!self.isOn)
      				return;

			if (self.SelectedMode == 'txt') {
				self.execute(self.SelectedText);
			} else{
				if(self.SelectedText){
					XenForo.ajax(
						'index.php?quoteme/to-tiny',
						{ htmlraw:self.SelectedText },
						$.proxy(self, 'rawHtml2cleanHtml')
					);
				}
			}
			
			if($QM.is(":visible")){
				$QM.hide();
			}
		},
		_touchSelec: function(e)
		{
			var self = Sedo.QuoteME, 
				$QM = $(self.QM),
				backupSelection = self.SelectedText;

			self.getSelection();			

			if($QM.is(':visible')){
				/***
				 * Trick to allow to use the click event on the QM box with touch devices
				 * Explanation: a click on the QM box will also trigger the selectionchange event
				 * which will trigger the getSelection() function, will will reset the SelectedText 
				 * 
				 * To deal with this problem, use the below function and prevent the qm_ready to be
				 * triggered which would reset one more time the SelectedText
				 **/
				if(!self.SelectedText && backupSelection){
					self.SelectedText = backupSelection;
					return;
				}
			}

			$QM.hide();

			if(self.SelectedText && self.SelectedText.length > 1){
				self.selectionHasChanged = true;
				self.$element.trigger('qm_ready');
			}
		},
		_moveReset: function(removeEvent)
		{
			var self = this;
			
			if(removeEvent == true){
				document.removeEventListener('selectionchange', self._touchSelec ,false);
				self.selChangeActivated = false;		
			}
			
			self.selectionHasChanged = false;
		},
		getParams: function()
		{
			var self = this,
				$editor = $('#'+self.editorID),
				redactor = $editor.data('redactor');

			self.addEventSupport = (document.addEventListener != undefined);

			/*Editor datas*/
			if (typeof tinyMCE !== 'undefined') {
				this.isTinyMCE = true;
				this.isRte = true;
			}
			
			if (redactor !== undefined && redactor !== null) {
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
					self.editor = 'rteBB';
				else
					self.editor = 'rteFull';
      			}
      			
			/*Selection Mode*/
      			var $QM = $(self.QM); 
			self.Mode = $QM.data('mode');

			/*Html Mode*/
			self.HtmlMode = 0;
			if( self.Mode != 'QmText'){
				self.HtmlMode = parseInt($QM.data('html'));
			}
			
			/*Trans Mode*/	
			self.isTrans = (parseInt($QM.data('trans'))) ? true : false;
      			
		},
		config: function(this_button)
		{
			//Init is done after mouseup event on .messageContent
			var self = this;
			
			//Prepare key coponents
			self.getParams();
			
			switch (self.Mode) {
				case 'QmText': 
					//The Mode must be setup first!!!
					self.Mode = 'txt';
					self.checkHtml = false;
					break;
				case 'QmHtml': 
					self.Mode = 'html';
					self.checkHtml = true;
					
					break;
				default : 
					self.Mode = 'htmlwrap';
					self.checkHtml = true;
					break;
			}

			self.getSelection();
			
			//Check if selection (text-mode) is empty
			if(!self.SelectedText)
				return false;
	
			//Check if selection (html-mode) is empty or if the content has a <embed> tag => disable flash
			if ( self.Mode != 'txt' && self.SelectedText.match(/<(\w+)(?:[^>]+?)?><\/\1>|<embed[^>]+?>/i) )
				return false;
			
			//Get Author & MessageID 
			var $targetParent =  $(this_button).parents('.message');
			
			self.Author = $targetParent.data('author');
			self.MessageID = $targetParent.attr('id');
			
			//Get AuthorID (Message template must have been modified)
			self.AuthorID = $targetParent.attr('data-author-id');
	
			if(self.AuthorID)
				self.AuthorID = ', member: '+self.AuthorID;
			else
				self.AuthorID = '';
			
			//Are we in messages or conversations?
			if (self.MessageID == undefined){
				self.MessageType = '';
				self.MessageID = '';
			} else if( self.MessageID.match(/post-/i) ) { //We are in messages
				self.MessageType = 'post';
				self.MessageID = self.MessageID.replace(/post-/i, '');
			} else if ( self.MessageID.match(/message-/i) ) { //We are in conversation
				self.MessageType = 'convMessage';
				self.MessageID = self.MessageID.replace(/message-/i, '');
			}
			
			return true;
		},
		getSelection: function()
		{
			var self = this;
			
			if(self.checkHtml === true && self.editorType == 'rteFull'){
				self.SelectedMode = 'html';
				self.SelectedText = self.getSelectedTextHtml();
			} else{
				self.SelectedMode = 'txt';
				self.SelectedText = self.getSelectedText();
			}
		},
		execute: function(SelectedText)
		{
			var self = this;
						
			//Avoid extra breaklines if clean parsed html is activated)
			if(self.HtmlMode == 1)
				SelectedText = SelectedText.replace(/^<p>([\s\S]+)<\/p>$/i, '$1');
			
			//Format quotation
			if(self.Author && self.MessageID && self.MessageType)
				SelectedText = '[quote="'+self.Author+', '+self.MessageType+': '+self.MessageID+self.AuthorID+'"]' + SelectedText + '[/quote]';
			else
				SelectedText = '[quote]' + SelectedText + '[/quote]';
	      
			//Put in global variable
			self.SelectedText = SelectedText;
			
			//To which editor should it be sent ?
			if(self.isTrans){
				self.transMode();
			}else{
				self.prepareSel();
				self.edDispatcher();
			}
		},
		edDispatcher: function()
		{
			var self = this;
			console.info('Editor mode: '+self.editorType+', Text mode: '+self.Mode);
			switch (self.editorType) {
				case 'rteBB':
					self.RTE_BBcodeEditor();
				break;
				case 'rteFull':
					self.RTE_Wysiwyg();
				break;
				case 'notRte':
					self.notRTE_BBcodeEditor();
				break;
			}		
		},
		transMode: function()
		{
			/* Send object to Memory */
			var self = this,
				objQM = self.getObjQM(),
				data = self.SelectedText,
				i = 1,
				mode = (self.editorType == 'rteFull') ? 'html' : 'txt';
			
			if(!objQM){
				var objQM = {};
			} else {
				i = self.getObjIdx(objQM);
			}

			objQM[i] = {
				data: data,
				type: self.srcType
			};

			self.setObjQM(objQM);

			$(self.QMT).parent().show();
			$(self.QME).text(i);
		},
		transAction:function()
		{
			/* Once Get Quotes Trigger called */
			var self = this;
			self.getParams();
			
			var objQM = self.getObjQM(),
			text = '';

			if(!objQM){
				alert($(self.QMT).data('timeup'));
				$(self.QMT).hide();
				return;
			}
			
			$.each( objQM, function(k, v) {
				self.SelectedText = v.data; 
				self.prepareSel(v.type);
				text += self.SelectedText;
			});

			self.SelectedText = text;
			self.edDispatcher();
			
			$(self.QMT).parent().hide();
			self.killObjQM();
		},
		prepareSel: function(chk)
		{
			var self = this, selText = self.SelectedText, mode = self.srcType, breakOpen, breakEnd, hasContent;
			
			if(chk === undefined)
				chk = mode; // if the chk is undefined it means transpage is not activated, let's copy mode to chk then
			
			/*Bb Code Editor*/		
				if(mode == 'txt'){
					if(chk != 'txt'){ //The active editor is a BbCode editor but the text has been saved with the html format
						selText = selText.replace(/<[^>]+>/ig,'');	 //=> strip tags
						selText = self.unescapeHtml(selText); 			//=> unescape tinyMce escaped html
					}

					$editor = self.getBbCodeEditor();
					hasContent = $editor.val();
					breakOpen = (hasContent) ? '\r\n' : '';

					self.SelectedText = breakOpen + selText + '\r\n';
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
	
				if(self.HtmlMode == 0 && chk == 'html'){//Src Mode: text || Output Mode: Html (wysiwyg Editor)
					selText = self.escapeHtml(selText);
				}
	
				if(chk != 'html'){ //The active editor is RTE but the text has been saved with the text format
					selText = self.escapeHtml(selText);
				}
	
				self.SelectedText = breakOpen+'<p>'+selText+'</p>'+breakEnd;
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
			var self = this, 
				editorID = self.editorID,
				selectedText = self.SelectedText;
			
			if(self.isTinyMCE){
				if(tinyMCE.majorVersion > 3){
					var args = {
						skip_focus: true
					};

					tinyMCE.EditorManager.get(editorID).execCommand('mceInsertContent', false, selectedText, args);
				}else{
					tinyMCE.getInstanceById(editorID).execCommand('mceInsertContent', false, selectedText);
				}
			}else if(self.isRedactor){
				self.redactor.focus(true); //workaround to fix Redactor bug
				self.redactor.insertHtml(selectedText);//bug on IE (the last quote is preprend instead of being append to the content
			}
		},
		getBbCodeEditor: function(manual)
		{
			var self = this, edType = (manual || self.editorType);
			
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
			var self = this;

			//Src: http://stackoverflow.com/questions/5222814/window-getselection-return-html
			if (window.getSelection != undefined){
				var sel;
				sel = window.getSelection();
	
				if (sel.rangeCount){
					var container;
					container = document.createElement('div');
	
					for (var i = 0, len = sel.rangeCount; i < len; ++i) {
						container.appendChild(sel.getRangeAt(i).cloneContents());
	          			}
	
					if(self.Mode == 'htmlwrap' && sel.anchorNode.parentNode.outerHTML) {
						//Fix to try to get the above element styling (bold, italic, etc.)
						//Tested on Firefox (last version), Opera, IE9
						var parent = sel.anchorNode.parentNode.parentElement.outerHTML.replace(/(^<[^>]+?>)([\s\S]+)(<[^>]+?>$)/, '$1{target}$3');
						return parent.replace('{target}', container.innerHTML);
					}
					
					return container.innerHTML
				}
			}
			else if (document.selection != undefined){
				// IE < 9
				if (document.selection.type == "Text") {
					if(self.Mode == 'htmlwrap' && document.selection.createRange().parentElement().outerHTML )	{
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
			this.execute(ajaxdata.tinyCode);
			return;
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
			var self = Sedo.QuoteME, txt,
				onText = $e.data('title'),
				offText = $e.data('off');
			
			/*Init params - will enable to get editor config*/
			self.getParams();
			self.disableXenQuote($e);
					
			if($e.data('show') || XenForo.isTouchBrowser()){
				self.isOn = false;
				$(window).load($.proxy(self, 'redactorTouchFix'));
			}else{
				return;
			}

			$e.show().click(function(e){
				e.preventDefault();

				if($e.hasClass('off')){
					$e.removeClass('off').addClass('on');
					self.isOn = true;
					self._bindTouch();
				}else{
					$e.removeClass('on').addClass('off');
					self.isOn = false;
					self._bindTouch(false);
				}
				//e.stopImmediatePropagation();
			});
			
			var tooltip = $e.data('tooltip');
			
			if(tooltip !== undefined){
				tooltip.onBeforeShow(function(e){
					if($e.hasClass('off'))
						txt = onText;
					else
						txt = offText;
					
					this.getTip().text(txt);
				});
			}
		},
		disableXenQuote: function($QmMenu)
		{
			var disableXenQuote = function(e){
				e.preventDefault();
				$('#QuickReply').data('QuickReply').scrollAndFocus();
			}
			
			if($QmMenu.attr('dxq')){
				$('a.ReplyQuote, a.MultiQuote').unbind('click').bind('click', disableXenQuote);

				XenForo.QuickReplyTrigger = function($trigger){ 
					$trigger.click(function(e){ 
						disableXenQuote(e);
					});
				};
			}
		},
		redactorTouchFix: function(self)
		{
			var self = this;
			if(!self.isRedactor) return;
			
			var ed = self.redactor, $ed = ed.$editor, blurTimeout;
			
			$ed.on('focus click', function(e) {
				if (blurTimeout)
				{
					clearTimeout(blurTimeout);
					blurTimeout = null;
				}
				self._bindTouch(false);
			})
			.on('blur', function(e) {
				blurTimeout = setTimeout(function() {
					if(self.isOn){
						self._bindTouch();
					}
				}, 200);
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
			var self = Sedo.QuoteME;

			$QM = $(self.QM); 
			self.isTrans = (parseInt($QM.data('trans')));
			
			if(!self.isTrans) return;
				
			var objQM = self.getObjQM();
			
			if(objQM !== false){
				$e.trigger('click');

				var activeMenu = function(){ 
					$('#toggleMeMenu').trigger('click');
				};
				
				$(window).load(activeMenu);
				
				var i = self.getObjIdx(objQM);

				$e.parent().show();
				$(self.QME).text(i-1)
			}
				
			$e.click(function(e){
				e.preventDefault();
				self.transAction();
			});		
		}
	}

	function r(a,b){
		XenForo.register(a, b);
	}
	var sedoQuoteME = 'Sedo.QuoteME';

	r('#toggleMeMenu', sedoQuoteME+'.menuInit');
	r('#QuoteMeTrigger', sedoQuoteME+'.transTrigger');
	r('.messageContent', sedoQuoteME+'.init');
	r('.quoteMeContent', sedoQuoteME+'.init');
}
(jQuery, this, document);