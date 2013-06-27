/*! jQuery JSON plugin 2.4.0 | code.google.com/p/jquery-json */
(function($){"use strict";var escape=/["\\\x00-\x1f\x7f-\x9f]/g,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},hasOwn=Object.prototype.hasOwnProperty;$.toJSON=typeof JSON=="object"&&JSON.stringify?JSON.stringify:function(n){var u,i,c,l,t;if(n===null)return"null";if(t=$.type(n),t==="undefined")return undefined;if(t==="number"||t==="boolean")return String(n);if(t==="string")return $.quoteString(n);if(typeof n.toJSON=="function")return $.toJSON(n.toJSON());if(t==="date"){var s=n.getUTCMonth()+1,h=n.getUTCDate(),a=n.getUTCFullYear(),o=n.getUTCHours(),e=n.getUTCMinutes(),f=n.getUTCSeconds(),r=n.getUTCMilliseconds();return s<10&&(s="0"+s),h<10&&(h="0"+h),o<10&&(o="0"+o),e<10&&(e="0"+e),f<10&&(f="0"+f),r<100&&(r="0"+r),r<10&&(r="0"+r),'"'+a+"-"+s+"-"+h+"T"+o+":"+e+":"+f+"."+r+'Z"'}if(u=[],$.isArray(n)){for(i=0;i<n.length;i++)u.push($.toJSON(n[i])||"null");return"["+u.join(",")+"]"}if(typeof n=="object"){for(i in n)if(hasOwn.call(n,i)){if(t=typeof i,t==="number")c='"'+i+'"';else if(t==="string")c=$.quoteString(i);else continue;t=typeof n[i],t!=="function"&&t!=="undefined"&&(l=$.toJSON(n[i]),u.push(c+":"+l))}return"{"+u.join(",")+"}"}},$.evalJSON=typeof JSON=="object"&&JSON.parse?JSON.parse:function(str){return eval("("+str+")")},$.secureEvalJSON=typeof JSON=="object"&&JSON.parse?JSON.parse:function(str){var filtered=str.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"");if(/^[\],:{}\s]*$/.test(filtered))return eval("("+str+")");throw new SyntaxError("Error parsing JSON, source is not valid.");},$.quoteString=function(n){return n.match(escape)?'"'+n.replace(escape,function(n){var t=meta[n];return typeof t=="string"?t:(t=n.charCodeAt(),"\\u00"+Math.floor(t/16).toString(16)+(t%16).toString(16))})+'"':'"'+n+'"'}})(jQuery);

/* JSTORAGE (0.4.3), Copyright (c) 2010 - 2012 Andris Reinman, MIT-style license */
(function(){function C(){var a="{}";if("userDataBehavior"==h){d.load("jStorage");try{a=d.getAttribute("jStorage")}catch(b){}try{r=d.getAttribute("jStorage_update")}catch(c){}g.jStorage=a}D();x();E()}function u(){var a;clearTimeout(F);F=setTimeout(function(){if("localStorage"==h||"globalStorage"==h)a=g.jStorage_update;else if("userDataBehavior"==h){d.load("jStorage");try{a=d.getAttribute("jStorage_update")}catch(b){}}if(a&&a!=r){r=a;var k=l.parse(l.stringify(c.__jstorage_meta.CRC32)),p;C();p=l.parse(l.stringify(c.__jstorage_meta.CRC32));
var e,y=[],f=[];for(e in k)k.hasOwnProperty(e)&&(p[e]?k[e]!=p[e]&&"2."==String(k[e]).substr(0,2)&&y.push(e):f.push(e));for(e in p)p.hasOwnProperty(e)&&(k[e]||y.push(e));s(y,"updated");s(f,"deleted")}},25)}function s(a,b){a=[].concat(a||[]);if("flushed"==b){a=[];for(var c in j)j.hasOwnProperty(c)&&a.push(c);b="deleted"}c=0;for(var p=a.length;c<p;c++){if(j[a[c]])for(var e=0,d=j[a[c]].length;e<d;e++)j[a[c]][e](a[c],b);if(j["*"]){e=0;for(d=j["*"].length;e<d;e++)j["*"][e](a[c],b)}}}function v(){var a=
(+new Date).toString();"localStorage"==h||"globalStorage"==h?g.jStorage_update=a:"userDataBehavior"==h&&(d.setAttribute("jStorage_update",a),d.save("jStorage"));u()}function D(){if(g.jStorage)try{c=l.parse(String(g.jStorage))}catch(a){g.jStorage="{}"}else g.jStorage="{}";z=g.jStorage?String(g.jStorage).length:0;c.__jstorage_meta||(c.__jstorage_meta={});c.__jstorage_meta.CRC32||(c.__jstorage_meta.CRC32={})}function w(){if(c.__jstorage_meta.PubSub){for(var a=+new Date-2E3,b=0,k=c.__jstorage_meta.PubSub.length;b<
k;b++)if(c.__jstorage_meta.PubSub[b][0]<=a){c.__jstorage_meta.PubSub.splice(b,c.__jstorage_meta.PubSub.length-b);break}c.__jstorage_meta.PubSub.length||delete c.__jstorage_meta.PubSub}try{g.jStorage=l.stringify(c),d&&(d.setAttribute("jStorage",g.jStorage),d.save("jStorage")),z=g.jStorage?String(g.jStorage).length:0}catch(p){}}function q(a){if(!a||"string"!=typeof a&&"number"!=typeof a)throw new TypeError("Key name must be string or numeric");if("__jstorage_meta"==a)throw new TypeError("Reserved key name");
return!0}function x(){var a,b,k,d,e=Infinity,g=!1,f=[];clearTimeout(G);if(c.__jstorage_meta&&"object"==typeof c.__jstorage_meta.TTL){a=+new Date;k=c.__jstorage_meta.TTL;d=c.__jstorage_meta.CRC32;for(b in k)k.hasOwnProperty(b)&&(k[b]<=a?(delete k[b],delete d[b],delete c[b],g=!0,f.push(b)):k[b]<e&&(e=k[b]));Infinity!=e&&(G=setTimeout(x,e-a));g&&(w(),v(),s(f,"deleted"))}}function E(){var a;if(c.__jstorage_meta.PubSub){var b,k=A;for(a=c.__jstorage_meta.PubSub.length-1;0<=a;a--)if(b=c.__jstorage_meta.PubSub[a],
b[0]>A){var k=b[0],d=b[1];b=b[2];if(t[d])for(var e=0,g=t[d].length;e<g;e++)t[d][e](d,l.parse(l.stringify(b)))}A=k}}var n=window.jQuery||window.$||(window.$={}),l={parse:window.JSON&&(window.JSON.parse||window.JSON.decode)||String.prototype.evalJSON&&function(a){return String(a).evalJSON()}||n.parseJSON||n.evalJSON,stringify:Object.toJSON||window.JSON&&(window.JSON.stringify||window.JSON.encode)||n.toJSON};if(!l.parse||!l.stringify)throw Error("No JSON support found, include //cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2.js to page");
var c={__jstorage_meta:{CRC32:{}}},g={jStorage:"{}"},d=null,z=0,h=!1,j={},F=!1,r=0,t={},A=+new Date,G,B={isXML:function(a){return(a=(a?a.ownerDocument||a:0).documentElement)?"HTML"!==a.nodeName:!1},encode:function(a){if(!this.isXML(a))return!1;try{return(new XMLSerializer).serializeToString(a)}catch(b){try{return a.xml}catch(c){}}return!1},decode:function(a){var b="DOMParser"in window&&(new DOMParser).parseFromString||window.ActiveXObject&&function(a){var b=new ActiveXObject("Microsoft.XMLDOM");b.async=
"false";b.loadXML(a);return b};if(!b)return!1;a=b.call("DOMParser"in window&&new DOMParser||window,a,"text/xml");return this.isXML(a)?a:!1}};n.jStorage={version:"0.4.3",set:function(a,b,d){q(a);d=d||{};if("undefined"==typeof b)return this.deleteKey(a),b;if(B.isXML(b))b={_is_xml:!0,xml:B.encode(b)};else{if("function"==typeof b)return;b&&"object"==typeof b&&(b=l.parse(l.stringify(b)))}c[a]=b;for(var g=c.__jstorage_meta.CRC32,e=l.stringify(b),j=e.length,f=2538058380^j,h=0,m;4<=j;)m=e.charCodeAt(h)&255|
(e.charCodeAt(++h)&255)<<8|(e.charCodeAt(++h)&255)<<16|(e.charCodeAt(++h)&255)<<24,m=1540483477*(m&65535)+((1540483477*(m>>>16)&65535)<<16),m^=m>>>24,m=1540483477*(m&65535)+((1540483477*(m>>>16)&65535)<<16),f=1540483477*(f&65535)+((1540483477*(f>>>16)&65535)<<16)^m,j-=4,++h;switch(j){case 3:f^=(e.charCodeAt(h+2)&255)<<16;case 2:f^=(e.charCodeAt(h+1)&255)<<8;case 1:f^=e.charCodeAt(h)&255,f=1540483477*(f&65535)+((1540483477*(f>>>16)&65535)<<16)}f^=f>>>13;f=1540483477*(f&65535)+((1540483477*(f>>>16)&
65535)<<16);g[a]="2."+((f^f>>>15)>>>0);this.setTTL(a,d.TTL||0);s(a,"updated");return b},get:function(a,b){q(a);return a in c?c[a]&&"object"==typeof c[a]&&c[a]._is_xml?B.decode(c[a].xml):c[a]:"undefined"==typeof b?null:b},deleteKey:function(a){q(a);return a in c?(delete c[a],"object"==typeof c.__jstorage_meta.TTL&&a in c.__jstorage_meta.TTL&&delete c.__jstorage_meta.TTL[a],delete c.__jstorage_meta.CRC32[a],w(),v(),s(a,"deleted"),!0):!1},setTTL:function(a,b){var d=+new Date;q(a);b=Number(b)||0;return a in
c?(c.__jstorage_meta.TTL||(c.__jstorage_meta.TTL={}),0<b?c.__jstorage_meta.TTL[a]=d+b:delete c.__jstorage_meta.TTL[a],w(),x(),v(),!0):!1},getTTL:function(a){var b=+new Date;q(a);return a in c&&c.__jstorage_meta.TTL&&c.__jstorage_meta.TTL[a]?(a=c.__jstorage_meta.TTL[a]-b)||0:0},flush:function(){c={__jstorage_meta:{CRC32:{}}};w();v();s(null,"flushed");return!0},storageObj:function(){function a(){}a.prototype=c;return new a},index:function(){var a=[],b;for(b in c)c.hasOwnProperty(b)&&"__jstorage_meta"!=
b&&a.push(b);return a},storageSize:function(){return z},currentBackend:function(){return h},storageAvailable:function(){return!!h},listenKeyChange:function(a,b){q(a);j[a]||(j[a]=[]);j[a].push(b)},stopListening:function(a,b){q(a);if(j[a])if(b)for(var c=j[a].length-1;0<=c;c--)j[a][c]==b&&j[a].splice(c,1);else delete j[a]},subscribe:function(a,b){a=(a||"").toString();if(!a)throw new TypeError("Channel not defined");t[a]||(t[a]=[]);t[a].push(b)},publish:function(a,b){a=(a||"").toString();if(!a)throw new TypeError("Channel not defined");
c.__jstorage_meta||(c.__jstorage_meta={});c.__jstorage_meta.PubSub||(c.__jstorage_meta.PubSub=[]);c.__jstorage_meta.PubSub.unshift([+new Date,a,b]);w();v()},reInit:function(){C()}};a:{n=!1;if("localStorage"in window)try{window.localStorage.setItem("_tmptest","tmpval"),n=!0,window.localStorage.removeItem("_tmptest")}catch(H){}if(n)try{window.localStorage&&(g=window.localStorage,h="localStorage",r=g.jStorage_update)}catch(I){}else if("globalStorage"in window)try{window.globalStorage&&(g=window.globalStorage[window.location.hostname],
h="globalStorage",r=g.jStorage_update)}catch(J){}else if(d=document.createElement("link"),d.addBehavior){d.style.behavior="url(#default#userData)";document.getElementsByTagName("head")[0].appendChild(d);try{d.load("jStorage")}catch(K){d.setAttribute("jStorage","{}"),d.save("jStorage"),d.load("jStorage")}n="{}";try{n=d.getAttribute("jStorage")}catch(L){}try{r=d.getAttribute("jStorage_update")}catch(M){}g.jStorage=n;h="userDataBehavior"}else{d=null;break a}D();x();"localStorage"==h||"globalStorage"==
h?"addEventListener"in window?window.addEventListener("storage",u,!1):document.attachEvent("onstorage",u):"userDataBehavior"==h&&setInterval(u,1E3);E();"addEventListener"in window&&window.addEventListener("pageshow",function(a){a.persisted&&u()},!1)}})();


/*QuoteME (1.7.0) by C�dric CLAERHOUT - Licence: CC by*/
if(typeof Sedo=="undefined")var Sedo={};!function(n,t,i){Sedo.QuoteME={isOn:!0,isTrans:!1,QM:"#QuoteMe",QMT:"#QuoteMeTrigger",QME:"#QuoteMeEl",editorID:"ctrl_message_html",isRte:!1,isRteBbCode:!1,isTinyMCE:!1,isRedactor:!1,editorType:"notRte",redactor:"",srcType:"txt",init:function(t){var i=Sedo.QuoteME;$QM=n(i.QM),n("body:not("+i.QM+")").unbind("mousedown").bind("mousedown",function(n){if(i.isOn&&(i.getSelectedText(),i.SelectedText&&n.which==1&&i.unSelect(),n.target.id!="QuoteMe")){if($QM.is(":visible")&&n.which==1){i.unSelect(),$QM.hide();return}if(n.which!=1){$QM.hide();return}}}),t.not(i.QM).unbind("mouseup").bind("mouseup",function(t){var s,f,r,u,o,e;if(i.isOn){if($QM.is(":hidden")&&t.which==1){if(s=i.config(this),s===!1){$QM.hide();return}if(f=$QM.data("pos"),f=="absfix"){if(r=n(t.target).parents(".messageContent").position(),u=n(t.target).parents(".messageContent").offset(),u==null||r==null)return;o=Math.round(t.pageY-(u.top-r.top))+1+"px",e=t.pageX+"px",$QM.show().css({position:"absolute",left:e,top:o})}else f=="abs"?$QM.show().css({position:"absolute",left:t.pageX+1+"px",top:t.pageY+1+"px"}):$QM.show().css({position:"fixed",left:t.clientX+1+"px",top:t.clientY+1+"px"});return}t.which!=1}}),$QM.unbind("click").bind("click",function(){i.SelectedMode=="text"?i.execute(i.SelectedText):i.SelectedText&&XenForo.ajax("index.php?quoteme/to-tiny",{htmlraw:i.SelectedText},i.rawHtml2cleanHtml),$QM.hide();return})},getParams:function(){$editor=n("#"+this.editorID);var t=this,i=$editor.data("redactor");typeof tinyMCE!="undefined"&&(this.isTinyMCE=!0,this.isRte=!0),typeof i!="undefined"&&(this.isRedactor=!0,this.redactor=i,this.isRte=!0),this.isRte==!0&&$editor.attr("disabled")&&(this.isRteBbCode=!0),this.isRte==!0&&(this.editorType=this.isRteBbCode==!0?"rteBB":"rteFull"),this.srcType=this.editorType=="rteBB"?"text":"html",$QM=n(t.QM),t.Mode=$QM.data("mode"),t.Mode!="QmText"&&(t.HtmlMode=parseInt($QM.data("html"))),t.isTrans=parseInt($QM.data("trans"))?!0:!1},config:function(t){var i=this;i.getParams();switch(i.Mode){case"QmText":i.Mode="text",i.checkHtml=!1;break;case"QmHtml":i.Mode="html",i.checkHtml=!0;break;default:i.Mode="htmlwrap",i.checkHtml=!0}if((i.checkHtml===!0&&i.editorType=="rteFull"?(i.SelectedMode="html",i.SelectedText=i.getSelectedTextHtml()):(i.SelectedMode="text",i.SelectedText=i.getSelectedText()),!i.SelectedText)||i.Mode!="text"&&i.SelectedText.match(/<(\w+)(?:[^>]+?)?><\/\1>|<embed[^>]+?>/i))return!1;i.Author=n(t).parents(".message").data("author"),i.MessageID=n(t).parents(".message").attr("id"),i.AuthorID=n(t).parents(".message").attr("data-author-id"),i.AuthorID=i.AuthorID?", member: "+i.AuthorID:"",i.MessageID.match(/post-/i)?(i.MessageType="post",i.MessageID=i.MessageID.replace(/post-/i,"")):i.MessageID.match(/message-/i)&&(i.MessageType="convMessage",i.MessageID=i.MessageID.replace(/message-/i,""))},execute:function(n){var t=Sedo.QuoteME;t.HtmlMode==1&&(n=n.replace(/^<p>([\s\S]+)<\/p>$/i,"$1")),n=t.Author&&t.MessageID&&t.MessageType?'[quote="'+t.Author+", "+t.MessageType+": "+t.MessageID+t.AuthorID+'"]'+n+"[/quote]":"[quote]"+n+"[/quote]",t.SelectedText=n,t.isTrans?t.transMode():(t.prepareSel(),t.edDispatcher())},edDispatcher:function(){var n=this;console.info("Editor mode: "+n.editorType+", Text mode: "+n.Mode);switch(n.editorType){case"rteBB":n.RTE_BBcodeEditor();break;case"rteFull":n.RTE_Wysiwyg();break;case"notRte":n.notRTE_BBcodeEditor()}},transMode:function(){var t=this,i=t.getObjQM(),u=t.SelectedText,r=1,f=t.editorType=="rteFull"?"html":"txt";i?r=t.getObjIdx(i):i={},i[r]={data:u,type:t.srcType},t.setObjQM(i),n(t.QMT).parent().show(),n(t.QME).text(r)},transAction:function(){var t=this,r,i;(t.getParams(),r=t.getObjQM(),i="",r)&&(n.each(r,function(n,r){t.SelectedText=r.data,t.prepareSel(r.type),i+=t.SelectedText}),t.SelectedText=i,t.edDispatcher(),n(t.QMT).parent().hide(),t.killObjQM())},prepareSel:function(n){var i=this,t=i.SelectedText,u=i.srcType;if(typeof n=="undefined"&&(n=u),u=="txt"){n!="txt"&&(t=t.replace(/<[^>]+>/ig,""),t=i.unescapeHtml(t)),i.SelectedText="\r\n"+t+"\r\n";return}if(this.isTinyMCE)var r=tinyMCE.isIE?"<p>&nbsp;</p>":"<p><br /></p>",e=r,f=tinyMCE.activeEditor.getContent();if(this.isRedactor)var r=this.redactor.browser("msie")?"<p>&nbsp;</p>":"<p><br /></p>",e=r,f=this.redactor.getCode();f||(r=""),i.HtmlMode==0&&n=="html"&&(t=i.escapeHtml(t)),n!="html"&&(t=i.escapeHtml(t)),i.SelectedText=r+"<p>"+t+"</p>"+e},notRTE_BBcodeEditor:function(){$editor=n(".textCtrl.MessageEditor"),$editor.val($editor.val()+this.SelectedText)},RTE_BBcodeEditor:function(){$editor=n(".bbCodeEditorContainer").find("textarea.textCtrl"),$editor.val($editor.val()+this.SelectedText)},RTE_Wysiwyg:function(){var n=this;this.isTinyMCE?tinyMCE.majorVersion>3?tinyMCE.get("ctrl_message_html").execCommand("mceInsertContent",!1,n.SelectedText):tinyMCE.getInstanceById("ctrl_message_html").execCommand("mceInsertContent",!1,n.SelectedText):this.isRedactor&&this.redactor.insertHtml(n.SelectedText)},unSelect:function(){i.selection?i.selection.empty():t.getSelection&&t.getSelection().removeAllRanges()},getSelectedText:function(){return t.getSelection?t.getSelection().toString():i.getSelection?i.getSelection():i.selection?i.selection.createRange().text:void 0},getSelectedTextHtml:function(){var e=this,n,f,r,o,u;if(typeof t.getSelection!="undefined"){if(n=t.getSelection(),n.rangeCount){for(f=i.createElement("div"),r=0,o=n.rangeCount;r<o;++r)f.appendChild(n.getRangeAt(r).cloneContents());return e.Mode=="htmlwrap"&&n.anchorNode.parentNode.outerHTML?(u=n.anchorNode.parentNode.parentElement.outerHTML.replace(/(^<[^>]+?>)([\s\S]+)(<[^>]+?>$)/,"$1{target}$3"),u.replace("{target}",f.innerHTML)):f.innerHTML}}else if(typeof i.selection!="undefined"&&i.selection.type=="Text")return e.Mode=="htmlwrap"&&i.selection.createRange().parentElement().outerHTML?(u=i.selection.createRange().parentElement().outerHTML.replace(/(<[^>]+?>)([\s\S]+)(<[^>]+?>)/,"$1{target}$3"),u.replace("{target}",i.selection.createRange().htmlText)):i.selection.createRange().htmlText},rawHtml2cleanHtml:function(n){return Sedo.QuoteME.execute(n.tinyCode),!1},unescapeHtml:function(n,t){n=n.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#039;/g,"'"),t=="noBlank"&&(n=n.replace(/	/g,"\t").replace(/&nbsp;/g,"  ").replace(/<\/p>\n<p>/g,"\n"));var i=new RegExp("^<p>([\\s\\S]+)</p>$","i");return i.test(n)&&(n=n.match(i),n=n[1]),n},escapeHtml:function(n,t){return t!=="onlyBlank"&&(n=n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")),t!=="noBlank"&&(n=n.replace(/\t/g,"\t").replace(/ /g,"&nbsp;").replace(/\n/g,"</p>\n<p>")),n},menuInit:function(n){var t=Sedo.QuoteME,i;t.menuOn=n.data("title"),t.menuOff=n.data("off"),t.isOn=!1;n.show().click(function(){n.hasClass("off")?(n.removeClass("off").addClass("on"),t.isOn=!0):(n.removeClass("on").addClass("off"),t.isOn=!1)}).data("tooltip").onBeforeShow(function(){i=n.hasClass("off")?t.menuOn:t.menuOff,this.getTip().text(i)})},getObjQM:function(){return n.jStorage.get("quoteme",!1)},setObjQM:function(t){n.jStorage.set("quoteme",t,{TTL:6e5})},killObjQM:function(){n.jStorage.deleteKey("quoteme")},getObjIdx:function(t){var i=1;return n.each(t,function(){i++}),i},transTrigger:function(t){var i=Sedo.QuoteME,r,u;($QM=n(i.QM),i.isTrans=parseInt($QM.data("trans"))?!0:!1,i.isTrans)&&(r=i.getObjQM(),r!==!1&&(t.trigger("click"),u=i.getObjIdx(r),t.parent().show(),n(i.QME).text(u)),t.click(function(){i.transAction()}))}},XenForo.isTouchBrowser()||(XenForo.register("#toggleMeMenu","Sedo.QuoteME.menuInit"),XenForo.register("#QuoteMeTrigger","Sedo.QuoteME.transTrigger"),XenForo.register(".messageContent","Sedo.QuoteME.init"))}(jQuery,this,document);