/*QuoteME (2.0.2) by Cedric CLAERHOUT - Licence: CC by*/
if(typeof Sedo=="undefined")var Sedo={};!function(n,t,i,r){function f(n,t){XenForo.register(n,t)}Sedo.QuoteME={isOn:!0,isTrans:!1,QM:"#QuoteMe",QMT:"#QuoteMeTrigger",QME:"#QuoteMeEl",editorID:"ctrl_message_html",isRte:!1,isRteBbCode:!1,isTinyMCE:!1,isRedactor:!1,editorType:"notRte",redactor:"",srcType:"txt",init:function(t){var i=Sedo.QuoteME,h=n(i.QM),o=n.proxy(i,"_initPressDown"),e=n.proxy(i,"_initPressUp"),s=n.proxy(i,"_initQmClick"),r,u,f;i.$element=t,i.eventTypeDown=null,r="mousedown",n("body:not("+i.QM+")").unbind(r,o).bind(r,o),i.eventTypeUp=null,u="qm_ready mouseup",t.not(i.QM).unbind(u,e).bind(u,e),f="touchstart click",h.unbind(f,s).bind(f,s)},_initPressDown:function(t){var u=this,c=n(t.target).parents(".messageContent").length;if(u.isOn&&c){var e=n(u.QM),s=t.type=="mousedown",f=t.type=="touchstart",o=s&&t.which==1,h=s&&t.which!=1;if((u.eventTypeDown==r||u.eventTypeDown==t.type)&&(u.eventTypeDown=t.type,u.getSelectedText(),u.SelectedText&&(o||f)&&u.unSelect(),t.target.id!="QuoteMe")){if(f&&u.addEventSupport&&(u._moveReset(),u.lastTouch=t,u.selChangeActivated!=r&&u.selChangeActivated||(i.addEventListener("selectionchange",u._touchSelec,!1),u.selChangeActivated=!0)),e.is(":visible")&&(o||f)){u.unSelect(),e.hide();return}if(h){e.hide();return}}}},_initPressUp:function(t){var i=this,a,l,h,s,c,p;if(i.isOn){var u=n(i.QM),v=t.type=="mouseup",y=t.type=="qm_ready",k=v&&t.which==1,b=v&&t.which!=1,f=u.data("pos");if(i.eventTypeUp==r||i.eventTypeUp==t.type){if(i.eventTypeUp=t.type,y&&i.addEventSupport){var w=i.selectionHasChanged,o=i.lastTouch,e="touch";if(!o||o.target==r)return;if(a=n(o.target).parents(".messageContent").length,!a)return;if(f=e,!w||i.SelectedText==r){u.hide();return}}if(u.is(":hidden")&&(k||y)){if(l=i.config(t.currentTarget),l===!1){u.hide();return}if(f=="absfix")if(h=n(t.target).parents(".messageContent").position(),s=n(t.target).parents(".messageContent").offset(),s==null||h==null)f="fb";else{c=Math.round(t.pageY-(s.top-h.top))+1+"px",p=t.pageX+"px",u.show().css({position:"absolute",left:p,top:c});return}f=="abs"?u.css({position:"absolute",left:t.pageX+1+"px",top:t.pageY+1+"px"}):f==e?u.addClass(e):u.css({position:"fixed",left:t.clientX+1+"px",top:t.clientY+1+"px"}),u.show();return}b}}},_initQmClick:function(t){t.preventDefault();var i=this,r=n(i.QM);i.isOn&&(i.SelectedMode=="txt"?i.execute(i.SelectedText):i.SelectedText&&XenForo.ajax("index.php?quoteme/to-tiny",{htmlraw:i.SelectedText},n.proxy(i,"rawHtml2cleanHtml")),r.is(":visible")&&r.hide())},_touchSelec:function(){var r=Sedo.QuoteME,u=n(r.QM);u.hide(),r.getSelection(),r.SelectedText&&r.SelectedText.length>1&&(r.selectionHasChanged=!0,r.$element.trigger("qm_ready"))},_moveReset:function(n){var t=this;n==!0&&(i.removeEventListener("selectionchange",t._touchSelec,!1),t.selChangeActivated=!1),t.selectionHasChanged=!1},getParams:function(){var t=this,e=n("#"+t.editorID),f=e.data("redactor"),u;t.addEventSupport=i.addEventListener!=r,typeof tinyMCE!="undefined"&&(this.isTinyMCE=!0,this.isRte=!0),f!==r&&f!==null&&(this.isRedactor=!0,this.redactor=f,this.isRte=!0),this.isRteBbCode=this.isRte==!0&&e.attr("disabled")?!0:!1,this.isRte==!0&&(this.editorType=this.isRteBbCode==!0?"rteBB":"rteFull"),this.srcType=this.editorType=="rteFull"?"html":"txt",u=n(t.QM),t.Mode=u.data("mode"),t.HtmlMode=0,t.Mode!="QmText"&&(t.HtmlMode=parseInt(u.data("html"))),t.isTrans=parseInt(u.data("trans"))?!0:!1},config:function(t){var i=this,u;i.getParams();switch(i.Mode){case"QmText":i.Mode="txt",i.checkHtml=!1;break;case"QmHtml":i.Mode="html",i.checkHtml=!0;break;default:i.Mode="htmlwrap",i.checkHtml=!0}return(i.getSelection(),!i.SelectedText)?!1:i.Mode!="txt"&&i.SelectedText.match(/<(\w+)(?:[^>]+?)?><\/\1>|<embed[^>]+?>/i)?!1:(u=n(t).parents(".message"),i.Author=u.data("author"),i.MessageID=u.attr("id"),i.AuthorID=u.attr("data-author-id"),i.AuthorID=i.AuthorID?", member: "+i.AuthorID:"",i.MessageID==r?(i.MessageType="",i.MessageID=""):i.MessageID.match(/post-/i)?(i.MessageType="post",i.MessageID=i.MessageID.replace(/post-/i,"")):i.MessageID.match(/message-/i)&&(i.MessageType="convMessage",i.MessageID=i.MessageID.replace(/message-/i,"")),!0)},getSelection:function(){var n=this;n.checkHtml===!0&&n.editorType=="rteFull"?(n.SelectedMode="html",n.SelectedText=n.getSelectedTextHtml()):(n.SelectedMode="txt",n.SelectedText=n.getSelectedText())},execute:function(n){var t=this;t.HtmlMode==1&&(n=n.replace(/^<p>([\s\S]+)<\/p>$/i,"$1")),n=t.Author&&t.MessageID&&t.MessageType?'[quote="'+t.Author+", "+t.MessageType+": "+t.MessageID+t.AuthorID+'"]'+n+"[/quote]":"[quote]"+n+"[/quote]",t.SelectedText=n,t.isTrans?t.transMode():(t.prepareSel(),t.edDispatcher())},edDispatcher:function(){var n=this;console.info("Editor mode: "+n.editorType+", Text mode: "+n.Mode);switch(n.editorType){case"rteBB":n.RTE_BBcodeEditor();break;case"rteFull":n.RTE_Wysiwyg();break;case"notRte":n.notRTE_BBcodeEditor()}},transMode:function(){var t=this,i=t.getObjQM(),u=t.SelectedText,r=1,f=t.editorType=="rteFull"?"html":"txt";i?r=t.getObjIdx(i):i={},i[r]={data:u,type:t.srcType},t.setObjQM(i),n(t.QMT).parent().show(),n(t.QME).text(r)},transAction:function(){var t=this,r,i;(t.getParams(),r=t.getObjQM(),i="",r)&&(n.each(r,function(n,r){t.SelectedText=r.data,t.prepareSel(r.type),i+=t.SelectedText}),t.SelectedText=i,t.edDispatcher(),n(t.QMT).parent().hide(),t.killObjQM())},prepareSel:function(n){var i=this,t=i.SelectedText,o=i.srcType,u,e,f;if(n===r&&(n=o),o=="txt"){n!="txt"&&(t=t.replace(/<[^>]+>/ig,""),t=i.unescapeHtml(t)),$editor=i.getBbCodeEditor(),f=$editor.val(),u=f?"\r\n":"",i.SelectedText=u+t+"\r\n";return}this.isTinyMCE&&(u=tinyMCE.isIE?"<p>&nbsp;</p>":"<p><br /></p>",e=u,f=tinyMCE.activeEditor.getContent()),this.isRedactor&&(u=this.redactor.browser("msie")?"<p>&nbsp;</p>":"<p><br /></p>",e=u,f=this.redactor.getCode()),f=f.replace(/<[^>]+>|&nbsp;/ig,""),f||(u=""),i.HtmlMode==0&&n=="html"&&(t=i.escapeHtml(t)),n!="html"&&(t=i.escapeHtml(t)),i.SelectedText=u+"<p>"+t+"</p>"+e},notRTE_BBcodeEditor:function(){$editor=this.getBbCodeEditor(),$editor.val($editor.val()+this.SelectedText)},RTE_BBcodeEditor:function(){$editor=this.getBbCodeEditor(),$editor.val($editor.val()+this.SelectedText)},RTE_Wysiwyg:function(){var n=this,r=n.editorID,t=n.SelectedText,i;n.isTinyMCE?tinyMCE.majorVersion>3?(i={skip_focus:!0},tinyMCE.EditorManager.get(r).execCommand("mceInsertContent",!1,t,i)):tinyMCE.getInstanceById(r).execCommand("mceInsertContent",!1,t):n.isRedactor&&n.redactor.insertHtml(t)},getBbCodeEditor:function(t){var r=this,i=t||r.editorType;switch(i){case"rteBB":return n(".bbCodeEditorContainer").find("textarea.textCtrl");case"notRte":return n(".textCtrl.MessageEditor");default:return console.info("Bb Editor not found"),n()}},unSelect:function(){i.selection?i.selection.empty():t.getSelection&&t.getSelection().removeAllRanges()},getSelectedText:function(){return t.getSelection?t.getSelection().toString():i.getSelection?i.getSelection():i.selection?i.selection.createRange().text:void 0},getSelectedTextHtml:function(){var o=this,n,e,u,s,f;if(t.getSelection!=r){if(n=t.getSelection(),n.rangeCount){for(e=i.createElement("div"),u=0,s=n.rangeCount;u<s;++u)e.appendChild(n.getRangeAt(u).cloneContents());return o.Mode=="htmlwrap"&&n.anchorNode.parentNode.outerHTML?(f=n.anchorNode.parentNode.parentElement.outerHTML.replace(/(^<[^>]+?>)([\s\S]+)(<[^>]+?>$)/,"$1{target}$3"),f.replace("{target}",e.innerHTML)):e.innerHTML}}else if(i.selection!=r&&i.selection.type=="Text")return o.Mode=="htmlwrap"&&i.selection.createRange().parentElement().outerHTML?(f=i.selection.createRange().parentElement().outerHTML.replace(/(<[^>]+?>)([\s\S]+)(<[^>]+?>)/,"$1{target}$3"),f.replace("{target}",i.selection.createRange().htmlText)):i.selection.createRange().htmlText},rawHtml2cleanHtml:function(n){this.execute(n.tinyCode);return},unescapeHtml:function(n,t){n=n.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#039;/g,"'"),t=="noBlank"&&(n=n.replace(/	/g,"\t").replace(/&nbsp;/g,"  ").replace(/<\/p>\n<p>/g,"\n"));var i=new RegExp("^<p>([\\s\\S]+)</p>$","i");return i.test(n)&&(n=n.match(i),n=n[1]),n},escapeHtml:function(n,t){return t!=="onlyBlank"&&(n=n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")),t!=="noBlank"&&(n=n.replace(/\t/g,"\t").replace(/ /g,"&nbsp;").replace(/\n/g,"</p>\n<p>")),n},menuInit:function(t){var i=Sedo.QuoteME,f,e=t.data("title"),o=t.data("off"),u;if(i.getParams(),i.disableXenQuote(t),t.data("show")||XenForo.isTouchBrowser())i.isOn=!1;else return;if(t.show().click(function(r){r.preventDefault();var f="touchstart",u=n.proxy(i,"_initPressDown");t.hasClass("off")?(t.removeClass("off").addClass("on"),i.isOn=!0,n("body:not("+i.QM+")").unbind(f,u).bind(f,u)):(t.removeClass("on").addClass("off"),i.isOn=!1,n("body:not("+i.QM+")").unbind(f,u)),r.stopImmediatePropagation()}),u=t.data("tooltip"),u!==r)u.onBeforeShow(function(){f=t.hasClass("off")?e:o,this.getTip().text(f)})},disableXenQuote:function(t){var i=function(t){t.preventDefault(),n("#QuickReply").data("QuickReply").scrollAndFocus()};t.attr("dxq")&&(n("a.ReplyQuote, a.MultiQuote").unbind("click").bind("click",i),XenForo.QuickReplyTrigger=function(n){n.click(function(n){i(n)})})},getObjQM:function(){return n.jStorage.get("quoteme",!1)},setObjQM:function(t){n.jStorage.set("quoteme",t,{TTL:6e5})},killObjQM:function(){n.jStorage.deleteKey("quoteme")},getObjIdx:function(t){var i=1;return n.each(t,function(){i++}),i},transTrigger:function(t){var i=Sedo.QuoteME,r,u;($QM=n(i.QM),i.isTrans=parseInt($QM.data("trans")),i.isTrans)&&(r=i.getObjQM(),r!==!1&&(t.trigger("click"),u=i.getObjIdx(r),t.parent().show(),n(i.QME).text(u-1)),t.click(function(n){n.preventDefault(),i.transAction()}))}};var u="Sedo.QuoteME";f("#toggleMeMenu",u+".menuInit"),f("#QuoteMeTrigger",u+".transTrigger"),f(".messageContent",u+".init"),f(".quoteMeContent",u+".init")}(jQuery,this,document);