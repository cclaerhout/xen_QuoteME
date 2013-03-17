!function($, window, document, _undefined)
{    
	XenForo.QuoteME = 
	{
		iC : 0,
		init : function($element)
		{
			var t = XenForo.QuoteME;
			/***
				Hide QuoteME
			*/
			$('body:not(#QuoteMe)').bind('mousedown', function(e) 
			{
				//Check if there is already some selected text (after a right click)
				XenForo.QuoteME.getSelectedText();
				if(t.SelectedText && e.which == 1)
				{
					XenForo.QuoteME.unSelect(); //If there is => unselect
				}
	
				//Need to use the element to check if click element is QuoteMe div box
				if (e.target.id == 'QuoteMe')
				{
					return;
				}
	
				if($('#QuoteMe').is(":visible") && e.which == 1) //left click
	         		{    
					XenForo.QuoteME.unSelect();
					$('#QuoteMe').hide();
					return;
				}
				
				if(e.which != 1) //other clicks
				{
					$('#QuoteMe').hide();
					return;					
				}
			});
	
			/***
				Display QuoteME
			*/
			$element.not('#QuoteMe').bind('mouseup', function(e) 
			{
				t.iC = 0;
				if($('#QuoteMe').is(":hidden") && e.which == 1) //left click
	          		{    
					var CheckCb = XenForo.QuoteME.config(this);
	
					if(CheckCb === false)
					{
						$('#QuoteMe').hide();
						return;
					}
	
					var ModePos = $('#QuoteMe').attr('data-pos');
					
					if(ModePos == 'absfix')
					{
						var pos = $(e.target).parents('.messageContent').position(),
						off = $(e.target).parents('.messageContent').offset(),
						top = Math.round(e.pageY - (off.top - pos.top))+1 + 'px', // the incrementation of 1 is to solve the Bug of year on old versions of IE
						left = e.pageX + 'px';
	
						$('#QuoteMe').show().css({'position':'absolute', 'left':left, 'top':top}); 							
					}
					else if(ModePos == 'abs')
					{
						$('#QuoteMe').show().css({'position':'absolute', 'left':e.pageX+1+'px','top':e.pageY+1+'px'});
					}
					else
					{
						$('#QuoteMe').show().css({'position':'fixed', 'left':e.clientX+1+'px','top':e.clientY+1+'px'});
					}
	
					return;
				}
	
				if(e.which != 1) //other clicks
				{
					return;
				}			
				
			});
			
			/***
				Execute QuoteME
			*/
	                $('#QuoteMe').bind('click', function(e)
	       	  	{
	      			//Need to perform that ugly check to avoid multi insertion (price to pay to reactive quoteme after a message has been post with AJAX) - useless...
	      			if(t.iC > 0)
	      			{
	      				return;
	      			}
	      			t.iC++;
	      			
	      			if (t.SelectedMode == 'text')
	      			{
	      				XenForo.QuoteME.execute(t.SelectedText);
	      			}
	      			else
	      			{
	      				if(t.SelectedText)
	      				{
	      					XenForo.ajax(
	      						'index.php?quoteme/to-tiny',
	      						{ htmlraw:t.SelectedText },
	      						XenForo.QuoteME.rawHtml2cleanHtml
	      					);
	      				}
	      			}
	
				$('#QuoteMe').hide();
				return;
			});
		},
		config : function(this_button)
		{
			//Init is done after mouseup event on .messageContent
			var t = this;
	      		t.editor = 'notRte';	      
	      		
	      		if (typeof tinyMCE !== 'undefined') {
	      			$bbcodeEditor = $('.bbCodeEditorContainer');
	      			
	      			if( $bbcodeEditor.length != 0 ){
	      				t.editor = 'isRte_Bbcode';
	      			}
	      			else{
	      				t.editor = 'isRte_Full';
	      			}
      			}

			//Get selected mode
			t.Mode = $('#QuoteMe').attr('data-mode');
			
			if( t.Mode != 'QmText')
		      	{
				t.HtmlMode = parseInt($('#QuoteMe').attr('data-html'));
			}
			
			switch (t.Mode) {
				case 'QmText': 
			      		//The Mode must be setup first!!!
			      		t.Mode = 'text';
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

			if(t.checkHtml === true && t.editor == 'isRte_Full'){
				t.SelectedMode = 'html';
				t.SelectedText = XenForo.QuoteME.getSelectedTextHtml();
			}
			else{
				t.SelectedMode = 'text';
		      		t.SelectedText = XenForo.QuoteME.getSelectedText();
			}
		      	//Check if selection (text-mode) is empty
		      	if(!t.SelectedText)
			{
				return false;
			}
	
		      	//Check if selection (html-mode) is empty or if the content has a <embed> tag => disable flash
		      	if ( t.Mode != 'text' && t.SelectedText.match(/<(\w+)(?:[^>]+?)?><\/\1>|<embed[^>]+?>/i) )
		      	{
		      		return false;
		      	}
		      	
			//Get Author & MessageID 
	      		t.Author = $(this_button).parents('.message').attr('data-author');
	      		t.MessageID = $(this_button).parents('.message').attr('id');
	      		
			//Get AuthorID (Message template must have been modified)
	      		t.AuthorID = $(this_button).parents('.message').attr('data-author-id');
	
			if(t.AuthorID){
	      			t.AuthorID = ', member: '+t.AuthorID;
	      		}
	      		else{
	      			t.AuthorID = '';
	      		}
	      		
	      		//Are we in messages or conversations?
	      		if ( t.MessageID.match(/post-/i) ) //We are in messages
	      		{
	      			t.MessageType = 'post';
	      			t.MessageID = t.MessageID.replace(/post-/i, '');
	      		}
	      		else if ( t.MessageID.match(/message-/i) ) //We are in conversation
	      		{
	      			t.MessageType = 'convMessage';
	      			t.MessageID = t.MessageID.replace(/message-/i, '');
	      		}
		},
		execute : function(SelectedText)
		{
			var t = XenForo.QuoteME;
						
			//Avoid extra breaklines if clean parsed html is activated)
			if(t.HtmlMode == 1)
			{		
				SelectedText = SelectedText.replace(/^<p>([\s\S]+)<\/p>$/i, '$1');
			}
			
			//Format quotation
	      		if(t.Author && t.MessageID && t.MessageType)
	      		{
	      			SelectedText = '[quote="'+t.Author+', '+t.MessageType+': '+t.MessageID+t.AuthorID+'"]' + SelectedText + '[/quote]';
	      		}
	      		else
	      		{
	      			SelectedText = '[quote]' + SelectedText + '[/quote]';
	      		}
	      
	      		//Put in global variable
	      		t.SelectedText = SelectedText;
	      		
			console.info('Editor mode: '+t.editor+', Text mode: '+t.Mode);
			switch (t.editor) {
				case 'isRte_Bbcode': t.RTE_BBcodeEditor();
				break;
				case 'isRte_Full':t.RTE_TinyMCE();
				break;
				case 'notRte': t.notRTE_BBcodeEditor();
				break;
			}
		},
		notRTE_BBcodeEditor : function()
		{
			var t = this;
			
			$editor = $('.textCtrl.MessageEditor');
			$editor.val( $editor.val() + '\r\n' + t.SelectedText);
		},
		RTE_BBcodeEditor : function()
		{
			var t = this;
			
			$editor = $('.bbCodeEditorContainer').find('textarea.textCtrl');
			$editor.val( $editor.val() + '\r\n' + t.SelectedText);
		},
		RTE_TinyMCE : function()		
		{
			var t = this, breakOpen = '<p><br /></p>', breakEnd;
			
			if(tinyMCE.isIE)
			{
				breakOpen = '<p>&nbsp;</p>';
			}
		
			breakEnd = breakOpen;
	
			if(!tinyMCE.activeEditor)
			{
				console.info("Error: TinyMCE is not loaded");
				return false; // Prevent error when TinyMCE is not loaded
			}
				
			t.Content = tinyMCE.activeEditor.getContent();
			if(!t.Content)
			{
				breakOpen = '';
			}
	
			if(t.HtmlMode == 0)
			{
				t.SelectedText = XenForo.QuoteME.escapeHtml(t.SelectedText, 'space');//Important!!! Even in html for carriage return ||no need if reparsed in html after
			}
	
			tinyMCE.execInstanceCommand('ctrl_message_html','mceInsertContent',false, breakOpen+'<p>'+t.SelectedText+'</p>'+breakEnd);
		},
		unSelect : function()
		{
			if ( document.selection )
			{
				document.selection.empty();
			}
			else if ( window.getSelection ) 
			{
				window.getSelection().removeAllRanges();
			}
		},
		getSelectedText : function()
		{
	      		if (window.getSelection) 
	      		{
	      			return window.getSelection().toString();
	      		}
	      		else if (document.getSelection)
	      		{
	      			return document.getSelection();
	      		}
	      		else if (document.selection) 
	      		{
	      			return document.selection.createRange().text;
	      		}
		},
		getSelectedTextHtml : function()		
		{		
			var t = this;

	      		//Src: http://stackoverflow.com/questions/5222814/window-getselection-return-html
	      		if (typeof window.getSelection != 'undefined')
	      		{
	      			var sel;
	      			sel = window.getSelection();
	
	      			if (sel.rangeCount)
	      			{
	      				var container;
	      				container = document.createElement('div');
	
	      				for (var i = 0, len = sel.rangeCount; i < len; ++i)
	      				{
	      					container.appendChild(sel.getRangeAt(i).cloneContents());
	          			}
	
					if(t.Mode == 'htmlwrap' && sel.anchorNode.parentNode.outerHTML)
					{
						//Fix to try to get the above element styling (bold, italic, etc.)
						//Tested on Firefox (last version), Opera, IE9
						var parent = sel.anchorNode.parentNode.parentElement.outerHTML.replace(/(^<[^>]+?>)([\s\S]+)(<[^>]+?>$)/, '$1{target}$3');
						return parent.replace('{target}', container.innerHTML);
					}
	      				
	      				return container.innerHTML
	      			}
	      		}
	      		else if (typeof document.selection != "undefined")
	      		{
	      			// IE < 9
	      			if (document.selection.type == "Text")
	      			{
					if(t.Mode == 'htmlwrap' && document.selection.createRange().parentElement().outerHTML )
					{
						//Fix to try to get the above element styling (bold, italic, etc.) || Regex is different than above cause it wasn't working with start (^) and end ($) anchors 
						//Tested on IE7 & IE8
						var parent = document.selection.createRange().parentElement().outerHTML.replace(/(<[^>]+?>)([\s\S]+)(<[^>]+?>)/, '$1{target}$3');
						return parent.replace('{target}', document.selection.createRange().htmlText);
					}
	
	      				return document.selection.createRange().htmlText;
	      			}
	  		}
		},
		rawHtml2cleanHtml : function(ajaxdata)
		{
			XenForo.QuoteME.execute(ajaxdata.tinyCode);
			return false;
		},	
		escapeHtml : function(string, options) 
		{
			if( options != 'onlyspace' )
			{
				string = string
					.replace(/&/g, "&amp;")
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;")
					.replace(/"/g, "&quot;")
					.replace(/'/g, "&#039;");
			}
			
			//Must be executed in second
			if(options == 'space' || options == 'onlyspace')
			{
				string = string
					.replace(/\t/g, '    ')
					.replace(/ /g, '&nbsp;')
					.replace(/\n/g, '</p>\n<p>');
			}
	
			return string;
		}
		
	}

	//Useless Ajax Reactivation is set on when targeting the XenForo page element .messageContent instead of the quoteme box
	 XenForo.register('.messageContent', 'XenForo.QuoteME.init');
}
(jQuery, this, document);