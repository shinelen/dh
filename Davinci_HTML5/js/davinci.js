 (function($){
    	var $body = $("body");
    	var DVTYPES = {};
		DVTYPES.NORMAL = 1;
		DVTYPES.COMPARE = 2;
		DVTYPES.VIDEO = 3;
		/**
		 * @description 
		 * package 包
		 * supper 父类
		 * class 类
		 */
    	/**
    	 * [DavinciClass description]
    	 * @param dvtype{[string]} 1.nomal  2.compare  3.video
    	 * @param configArguments{[object]} 提供外部参数引入
    	 */
		function DavinciClass(DVTYPE,configArguments){
			//DavinciClass private
			var DVEleUtil = {},
		    	DVUtil = {},
		    	DVTestData = {},
		    	/**
				 * @Package
				 * @Description 画布图形包，用于提供画出各种图形的算法
				 */
		    	DVDrawerUtil = {},
		    	//DV Debug/Test Parameters
		    	DVTestMode = false,
		    	DVDebug = true,//控制控制台输出，true则显示调试内容，false不显示
		    	dv_config_default = {
		    		base_url:"",
				session_key:"",
				session_id:"",
				session_type:"",
				access_level:"",
				action_comment:"",
				proj_type:"",
				proj_id:"",
				cycle_id:"",
				task_id:"",
				item:"",
				checklist_id:"",
				is_open_checklist_tab:"",
				is_default_checklist_tab:"",
				dv_cycle_id:"",
				dv_item:"",
				use_ip:"",
				dateFormat:"",
				containerElement:null
			},

				/**
				 * @Package
				 * @Description 主工程包
				 */
		    	DVMain = {},
		    	//Classes
		    	DVClass,//super
		    	DVClientClass,
		    	DVCompareClass,
		    	DVVideoClass,

		    	/**
				 * @Package
				 * @Description Annotation包，用于各种Annotation生成，事件等
				 */
		    	DVAnnotation = {},
		    	//Classes	    	
		    	DVAnnotationsClass,
		    	DVAnnotationClass,//super
		    	DVNormalAnnoClass,
		    	DVRectangleAnnoClass,
		    	DVCircleAnnoClass,
		    	DVFreehandAnnoClass,
		    	DVArrowAnnoClass,

		    	/**
				 * @Package
				 * @Description Table List包，用于左边各种Tab（如：Anootation Table，Approvel Table...）生成，事件等
				 */
		    	DVTableList = {},		    	
		    	//Classes
		    	DVTabNavClass,
	    		DVTableListClass,//super
		    	DVAnnotationListClass,
		    	DVApprovalListClass,
		    	DVChecklistClass,


		    	/**
				 * @Package
				 * @Description Toolbar包，用于头部工具栏的生成，事件等
				 */
		    	DVToolbar = {},
		    	//Classes
		    	DVToolbarClass,
		    	DVToolBtnClass,//super
		    	DVCompareTabClass,
		    	DVSeparateClass,
		    	DVRotateClass,
		    	DVZoomClass,
		    	DVZoom100Class,
		    	DVFitWinClass,
		    	DVFullScreenClass,
		    	DVToggleAnnoClass,
		    	DVToolAnnoClass,
		    	DVMeasureClass,
		    	DVDensitometerClass,
		    	DVPreferenceClass,
		    	DVPrintClass,
		    	DVBackClass,
		    	DVToolApprovalClass,

		    	/**
				 * @Package
				 * @Description Bottom Toolbar包，用于底部工具栏的生成，事件等
				 */
		    	DVBottomToolbar = {},
		    	//Classes
		    	DVBottomToolbarClass,
		    	DVBottomToolBtnClass,//super
		    	DVBottomListTableClass,
		    	DVBottomPageNavClass,

		    	/**
				 * @Package
				 * @Description Page Navigate包，用于右边页数导航
				 */
		    	DVPageNavigate = {},
		    	//Classes
		    	DVPageNavigateClass,

		    	/**
				 * @Package
				 * @Description Canvas包，用于生成画布，工作区等主体界面
				 */
		    	DVCanva = {},
		    	//Classes
		    	DVCanvaClass,//super
		    	DVNormalCanvaClass,
		    	DVCompareCanvaClass,
		    	DVPageCanvaClass,

		    	
		    	//UI Elements
		    	_dvMain_layout,
			_dvToolbar_layout,
			_dvToolbar,
			_dvListTab_layout,
			_dvListTab,			
			_dvSliderIcon,
			_dvCanvas_layout,
			_dvCanvasContaiiner_layout,
			_dvCanvasSingle,
			_dvCanvas2pages,
			_dvCanvasStadCompare1,
			_dvCanvasStadCompare2,
			_dvCanvasStadCompare3,
			_dvBottomToolbar_layout,
			_dvPageNav_layout,
			_window = $(window),
			_document = $(document),
			_body = $("body"),
			//Share Data
			_dvClientType,
			
			dv_brand = "",
			dv_toolbar,
			dv_bottom_toolbar,
			dv_davinci,			
			dv_session,//[Object] for session by session type , you can get like clenable,accessLevels,enabledActions,status..
			dv_config_bean,
			dv_action_list,//[Array] for control toolbar button & functions show/hide
			//single client
			dv_image_info,//[Object] image info 
			dv_annotations = [],//[Array] 装载annotation的list
			dv_approvals=[],//[Array] 装载approval的list
			dv_page_info,//[Object] page info
			dv_page = {"page1":1,"page2":2},//[Object] 该对象表示当前页对象，page1默认代表当前页，page2为当双页显示，第二页显示的页数
			dv_viewer,//[openseadragon.viewer] openseadragon插件viewer
			dv_image_data,//纯图片底层，即没有任何annotations、shaps等在画布上，用于还原底层
			dv_annos_drawer,
			dv_annos_context = [],
			dv_user_preference,//[Object]user preference信息
			TOOL_NONE = "none",
			dv_toolbar_action = TOOL_NONE,//[String]toolbar button action 用于判断当前toolbar已经激活的button,主要参数对应TOOL_*
			dv_canvas,//[DVNormalCanvaClass]
			dv_jq_canvas,
			dv_jq_canvas1,
			dv_jq_canvas2,
			dv_jq_canvas_page,

			dv_viewer_page,
			dv_page_info_page,
			dv_image_data_page,//纯图片底层，即没有任何annotations、shaps等在画布上，用于还原底层
			dv_annos_drawer_page,

			//compare client
			dv_image_info1,
			dv_annotations1 = [],
			dv_annos_context1 = [],
			dv_approvals1=[],
			dv_page_info1,
			dv_page1 = {"page1":1,"page2":2},
			dv_viewer1,
			dv_image_data1,
			dv_annos_drawer1,
			dv_image_info2,
			dv_annotations2 = [],
			dv_annos_context2 = [],
			dv_approvals2=[],
			dv_page_info2,
			dv_page2 = {"page1":1,"page2":2},
			dv_viewer2,
			dv_image_data2,
			dv_annos_drawer2,
			dv_compare_mode=1,// 用于判断compare的模式,1为tab模式，2为compare模式
			dv_current_num=[1,2,3],//[Array]代表compare当前打开的为哪一图片，[1,2,3]代表3张同时打开，即compare mode，[1]或[2]代表只打开一张，即tab mode
			dv_canvas_compare,//[DVCompareCanvaClass]
			dv_anno_class_list = {},

			dv_doc_obj,
			dv_doc_obj_compare,
			dv_loading,
			//CONSTANT
			ICON_SLIDER = "css/images/slider-icon.png",		
			
			ICON_COMPARE_TAB = "css/icons/compare.png",
			ICON_COMPARE_STD = "css/icons/compare_exp.png",
			ICON_COMPARE_BTN = "css/icons/compare_btn.png",
			ICON_DIFFERENT = "css/icons/differences.gif",
			ICON_TOGGLE = "css/icons/toggle.gif",

			ICON_BACK = "css/icons/back.png",
			ICON_UNBACK = "css/icons/unback.png",
			ICON_PRINT = "css/icons/print.png",			
			ICON_DENSTIOMETER = "css/icons/densitometer.png",
			ICON_DEPANNOBTN = "css/icons/depannoBtn.png",
			ICON_ROTATE = "css/icons/rotate.png",
			ICON_RULER = "css/icons/ruler.png",
			ICON_TOGGLEANNO = "css/icons/toggleAnnotations.png",
			ICON_ZOOM = "css/icons/zoom.png",
			ICON_ZOOM100 = "css/icons/zoom100.png",			
			ICON_FITTO_WINDOW = "css/icons/fitToWindow.png",
			ICON_FULLSCREEN = "css/icons/fullscreen.png",
			ICON_APPROVAL = "css/icons/approve.png",
			
			ICON_EDIT = "css/icons/edit.png",

			ICON_ANNOTATION = "css/icons/postit.png",
			ICON_CIRCLE = "css/icons/ellipse.png",
			ICON_RECTANGLE = "css/icons/rectangle.png",
			ICON_ARROW = "css/icons/arrow.png",
			ICON_FREEHAND = "css/icons/pencil.png",
			ICON_PREFERENCES = "css/icons/preferences.gif",
			ICON_ACCEPT = "css/icons/accept.png",
			ICON_DELETE = "css/icons/delete.png",
			ICON_CLOSE = "css/icons/cross.png",

			TOOL_ZOOM = "zoom",
			TOOL_ZOOM100 = "zoom100",
			TOOL_ANNO = "anno",
			TOOL_ANNO_ECLIPSE = "anno eclipse",
			TOOL_ANNO_RECT = "anno rect",
			TOOL_ANNO_ARROW = "anno arrow",
			TOOL_ANNO_FREEHAND = "anno freehand",
			TOOL_RULER = "ruler",
			TOOL_DENSITOMETER = "densitometer",

			ANNO_ECLIPSE = "ellipse",
			ANNO_ARROW = "arrow",
			ANNO_RECT = "rectangle",
			ANNO_FREEHAND = "freehand",

			ANNO_ACTION_LOAD = "load",
			ANNO_ACTION_ADD = "annotate",
			ANNO_ACTION_DEL = "annodel",
			ANNO_ACTION_EDIT = "edit",
			ANNO_ACTION_COMMEDIT = "actionCommentEdit",
			ANNO_ACTION_CHK = "annocheck",

			ANNO_WIDTH = 25,
		 	ANNO_HEIGHT = 20,
		 	ANNO_ROUND = 4,
		 	ANNO_ALPHA = 0.8,
			
			ICON_PAGE_SINGLE = "css/icons/page1.gif";
			ICON_PAGE_COMPARE = "css/icons/page2.gif";
			ICON_PAGE_PREPAGE = "css/icons/prevPage.png";
			ICON_PAGE_NEXTPAGE = "css/icons/nextPage.png";

			SERIAL_NUMBER = "DV-"+Math.ceil(Math.random()*1000000000000),
			AJAX_ROOT_URL = "http://116.6.193.202:88/DVhtml5",
			DATA_TYPE = "json",
			DVSOL = 16384,
			BRAND = "Davinci",
			BRAND_COMPARE = "Davinci Compare",
			BRAND_VIDEO = "Davinci Video",
			VERSION  = "v1.0",
			PUBLIC_CONFIGS = $.extend(dv_config_default,configArguments);
			
			/**
			 * 封装常用的方法和控件
			 * @param  {[type]} eu [description]
			 * @return {[type]}    [description]
			 */
			(function(eu){
				function _addPara2Ele(ele,cssclass,attrs,csses){
					ele = cssclass ? ele.addClass(cssclass) : ele;
					ele = attrs ? ele.attr(attrs) : ele;
					ele = csses ? ele.css(csses) : ele;
				}
				eu.div = function(cssclass,attrs,csses){
					var div = $("<div>");
					_addPara2Ele(div,cssclass,attrs,csses);
					return div;
				}
				eu.img = function(cssclass,attrs,csses){
					var img = $("<img>");
					_addPara2Ele(img,cssclass,attrs,csses);
					return img;
				}
				eu.nav = function(cssclass,attrs,csses){
					var nav = $("<nav>");
					_addPara2Ele(nav,cssclass,attrs,csses);
					return nav;
				}
				eu.a = function(cssclass,attrs,csses){
					var a = $("<a>").attr({"href":"javascript:void(0)"});
					_addPara2Ele(a,cssclass,attrs,csses);
					return a;
				}
				eu.label = function(cssclass,attrs,csses){
					var label = $("<label>");
					_addPara2Ele(label,cssclass,attrs,csses);
					return label;
				}
				eu.select = function(cssclass,attrs,csses){
					var select = $("<select>");
					_addPara2Ele(select,cssclass,attrs,csses);
					return select;
				}
				eu.option = function(cssclass,attrs,csses,val,txt){
					var option = $("<option>").val(val).text(txt);
					_addPara2Ele(option,cssclass,attrs,csses);
					return option;
				}
				eu.input = function(cssclass,attrs,csses){
					var input = $("<input>");
					_addPara2Ele(input,cssclass,attrs,csses);
					return input;
				}
				eu.ul = function(cssclass,attrs,csses){
					var ul = $("<ul>");
					_addPara2Ele(ul,cssclass,attrs,csses);
					return ul;
				}
				eu.li = function(cssclass,attrs,csses){
					var li = $("<li>");
					_addPara2Ele(li,cssclass,attrs,csses);
					return li;
				}
				eu.span = function(cssclass,attrs,csses){
					var span = $("<span>");
					_addPara2Ele(span,cssclass,attrs,csses);
					return span;
				}
				eu.canvas = function(cssclass,attrs,csses){
					var canvas = $("<canvas>");
					_addPara2Ele(canvas,cssclass,attrs,csses);
					return canvas;
				}
				eu.table = function(cssclass,attrs,csses){
					var table = $("<table>");
					_addPara2Ele(table,cssclass,attrs,csses);
					return table;
				}
				eu.thead = function(cssclass,attrs,csses){
					var thead = $("<thead>");
					_addPara2Ele(thead,cssclass,attrs,csses);
					return thead;
				}
				eu.th = function(cssclass,attrs,csses){
					var th = $("<th>");
					_addPara2Ele(th,cssclass,attrs,csses);
					return th;
				}
				eu.tbody = function(cssclass,attrs,csses){
					var tbody = $("<tbody>");
					_addPara2Ele(tbody,cssclass,attrs,csses);
					return tbody;
				}
				eu.tr = function(cssclass,attrs,csses){
					var tr = $("<tr>");
					_addPara2Ele(tr,cssclass,attrs,csses);
					return tr;
				}
				eu.td = function(cssclass,attrs,csses){
					var td = $("<td>");
					_addPara2Ele(td,cssclass,attrs,csses);
					return td;
				}
				eu.h4 = function(cssclass,attrs,csses){
					var h4 = $("<h4>");
					_addPara2Ele(h4,cssclass,attrs,csses);
					return h4;
				}
				eu.button = function(cssclass,attrs,csses){
					var button = $("<button>");
					_addPara2Ele(button,cssclass,attrs,csses);
					return button;
				}
				eu.textarea = function(cssclass,attrs,csses){
					var textarea = $("<textarea>");
					_addPara2Ele(textarea,cssclass,attrs,csses);
					return textarea;
				}
				eu.progress = function(csses){
					return new progress(csses);
				}
				function progress(csses){
					var _this=this,
					_jq_progress,_jq_progress_bar;
					function _initElement(){
						csses = csses?csses:{
							"width":"30%",
							"margin":"auto",
							"margin-top":"15%"
						};
						_jq_progress = eu.div("progress",null,csses);
						_jq_progress_bar = eu.div("progress-bar",{
							"role":"progressbar",
							"aria-valuenow":0,
							"aria-valuemin":0,
							"aria-valuemax":100
						},{
							"width":"0%"
						});
						_jq_progress.append(_jq_progress_bar);
					}
					this.init = function(){
						_initElement();
					}
					this.getElement = function(){
						return _jq_progress;
					}
					this.setProgressPercent = function(percent,text){
						if(_jq_progress_bar){
							_jq_progress_bar.attr({
								"aria-valuenow":percent
							}).css({
								"width":percent+"%"
							}).text(text);
						}
					}
					this.destory = function(){
						_jq_progress?_jq_progress.remove():null;
						_this = null;
					}
					this.init();
				}
				/**
				 *  封装了boostrap的modal控件（即dialog）
				 *  此方法为打开控件
				 * @param  {[type]} id      [description]
				 * @param  {[type]} content [description]
				 * @param  {[type]} footer  [description]
				 * @return {[type]}         [description]
				 */
				eu.openDialog = function(id,content,footer){
					var dialog;
					dialog = new _dialogClass({
						id:id,
						tabindex:"-1",
						aria_labelledby:"myModalLabel",
						aria_hidden:"true",
						content:content,
						footer:footer,
						title:"Modal title",
						closeMode:true
					});
					return dialog;
				}
				eu.closeDialog = function(dialog){
					if(dialog){
						dialog.close();
					}else{
						DVUtil.error("eu.closeDialog() >> Argument 'dialog' is undefiined.")
					}
				}
				eu.openLoading = function(){
					if(!dv_loading){
						dv_loading = new _dialogClass({
							id:id,
							tabindex:"-1",
							aria_labelledby:"myModalLabel",
							aria_hidden:"true",
							content:content,
							footer:footer,
							title:"{0_M_J_Loading_Dialog_Tile}",
							closeMode:false
						});						
					}
					dv_loading.open()
					return dv_loading;		
				}
				eu.closeLoading = function(){
					if(dv_loading){
						dv_loading.hide();
					}else{
						DVUtil.error("eu.closeLoading() >> can not find dv_loading.")
					}					
				}
				eu.Dialog = function(conf){
					var _this = this,
					u = DVUtil,
					_defConf = {
						id:"myDialog",
						title:"Modal title",
						width:500,
						height:400,
						body:"",
						footer:""
					},
					_conf = $.extend(_defConf,conf),
					$container;
					this.destroy = function(){
						_destroyElement();
						_this = null;
					}
					this.element = $container;

					this.init = function(){
						_createElement();
						$("body").append($container);
					}
					function _destroyElement(){
						if($container&&$container.length>0){
							$container.remove();
						}

						_this.element = $container = null;
					}
					function _createElement(){
						_destroyElement();
						_this.element = $container = eu.div(null,null,{
							"position":"fixed",
							"top":"0px",
							"left":"0px",
							"width":_conf.width+"px",
							"height":_conf.height+"px",
							"z-index":9999
							
						});
						var $content = eu.div("modal-content"),
						$body = eu.div("modal-body").html(_conf.body),
						$header = eu.div("modal-header dvUnselected",null,{
							"cursor":"move"
						}),
						$footer = eu.div("modal-footer").html(_conf.footer),
						$title = eu.h4("modal-title").text(_conf.title),
						$closeBtn = eu.button("close",{
							"button":"button",
							"data-dismiss":"modal"
						})
						.append(
							eu.span(null,{
								"aria-hidden":"true"
							}).text("x")
						)
						.append(
							eu.span("sr-only").text("Close")
						),
						isMove = false;

						$header
						.append(
							$closeBtn
						)
						.append(
							$title
						);
						$content
						.append($header)
						.append($body)
						.append($footer);

						$container.html($content);

						$closeBtn.bind("click",function(e){
							u.stopEvent(e);
							$container.trigger("dialog-close",[_this]);
							_this.destroy();
						});
						function downEvent(e){
							u.stopEvent(e);
							isMove = true;
						}
						function moveEvent(e){
							u.stopEvent(e);
							if(isMove){
								var x = e.clientX,
								y = e.clientY,
								w = $container.width(),
								h = $container.height();
								$container.css({
									"top":y-20+"px",
									"left":(x-w/2)+"px"
								});
							}
						}
						function upEvent(e){
							u.stopEvent(e);
							isMove = false;
						}
						$header
						.bind("mousedown",downEvent)
						.bind("mousemove",moveEvent)
						.bind("mouseup",upEvent);

						if($header.get(0).addEventListener){
							$header.get(0).addEventListener("touchstart",downEvent);
							$header.get(0).addEventListener("touchmove",moveEvent);
							$header.get(0).addEventListener("touchend",upEvent);
						}

					}
					


				}
				function _dialogClass(config){
					var _dialogDiv,
					_modal_dialog,
					_modal_content,
					_modal_header,
					_modal_title,
					_modal_body,
					_modal_footer,
					_close_btn,
					_config_default = {
						id:"myDialog",
						tabindex:"-1",
						aria_labelledby:"myModalLabel",
						aria_hidden:"false",
						content:null,
						footer:null,
						title:"Modal title",
						closeMode:true
					},
					_config = $.extend(_config_default,config),
					_that = this;
					function _initElements(){
						
						_dialogDiv = eu.div("modal fade",{
							id:_config.id,
							tabindex:_config.tabindex,
							role:"dialog",
							"aria-labelledby":_config.aria_labelledby,
							"aria-hidden":_config.aria_hidden
						});
						_close_btn = eu.button("close",{"button":"button","data-dismiss":"modal"})
							.append(
								eu.span(null,{"aria-hidden":"true"}).html("&times;")
							)
							.append(
								eu.span("sr-only").text("Close")
							);
						_modal_dialog = eu.div("modal-dialog");
						_modal_content = eu.div("modal-content");
						_modal_header = eu.div("modal-header");
						_modal_title = eu.h4("modal-title",{id:_config.aria_labelledby});
						_modal_body = eu.div("modal-body");
						_modal_footer = eu.div("modal-footer");

						if(_config.closeMode){
							_modal_header.append(_close_btn);
						}
						_modal_header.append(_modal_title);
						if(_config.content){
							_modal_body.append(_config.content);
						}
						if(_config.footer){
							_modal_footer.append(_config.footer);
						}
						_modal_content
						.append(_modal_header)
						.append(_modal_body)
						.append(_modal_footer);

						_modal_dialog.append(_modal_content);
						_dialogDiv.append(_modal_dialog);
						$("body").append(_dialogDiv);
					}
					function _attachEvents(){
						_dialogDiv.on('show.bs.modal', _that.showEvent);
						_dialogDiv.on('shown.bs.modal', _that.shownEvent);
						_dialogDiv.on('hide.bs.modal', _that.hideEvent);
						_dialogDiv.on('hidden.bs.modal', _that.hiddenEvent);
					}
					this.open = function(){
						if(!_dialogDiv){
							_initElements();
							_attachEvents();
						}						
						_dialogDiv.modal();
					}
					this.close = function(){
						_that.closeEvent();
						_dialogDiv.remove();
					}
					this.hide = function(){
						_dialogDiv.modal('hide');
					}
					/*
					Events
					 */
					this.showEvent = function(e){}
					this.shownEvent = function(e){}
					this.closeEvent = function(e){}
					this.hideEvent = function(e){}
					this.hiddenEvent = function(e){}

					/*
					Setter
					 */
					this.setTabindex = function(index){
						_config.tabindex = index;
					}
					this.setTitle = function(title){
						_config.title = title;
					}
				}

			})(DVEleUtil);
		    	
		    	(function(u){
		    		u.extend = function(subClass,superClass){
		    			var F = function(){}
		    			F.prototype = superClass.prototype;
		    			subClass.prototype = new F();
		    			subClass.prototype.constructor = subClass;

		    			subClass.superClass = superClass.prototype;
		    			if(superClass.prototype.constructor==Object.prototype.constructor){
		    				superClass.prototype.constructor = superClass;
		    			}
		    		}
		    		u.getNum = function(){
		    			var num = 0;
						if(dv_brand==BRAND_COMPARE&&dv_current_num&&dv_current_num.length==1&&dv_current_num[0]==2){
							num = 1;
						}

						return num;
		    		}

		    		u.log = function(message){
		    			if(DVDebug&&this.chkObject(console)){
		    				console.log(message);
		    			}
		    		}
		    		u.error = function(message){
		    			if(DVDebug&&this.chkObject(console)){
		    				console.error(message);
		    			}
		    		}
		    		u.errorHandle = function(e,fn){
		    			this.error(e);
		    			fn();
		    		}
		    		
					u.stopEvent = function(e){
		    			if ( e && e.preventDefault ) {
	    					e.preventDefault(); 
	    				}
	    				if (window.event) {
						  e.cancelBubble=true;// ie下阻止冒泡
						} else {
						  e.stopPropagation();// 其它浏览器下阻止冒泡
						}
		    		}
				u.callJSON = function(url,params,async,successfn,failfn){
					var json,parameter,parameterArray,
					callNumber = "JSON_"+Math.ceil(Math.random()*1000000000000),
					success;
					if(!async||async!=true){
						async = false;
					}else{
						async = true;
					}
					if(this.chkObject(params)){
						parameter = "?";
						parameterArray = [];
						for(var key in params){
							parameterArray.push(key+"="+params[key]);							
						}
						parameterArray.push("callNumber="+callNumber);
						parameter += parameterArray.join("&");
					}
					if(DVTestMode){
						var urlMap = {
							"annotations.davinci_load":"annotations",
							"annotations.davinci_annotate":"annotations",
							"annotations.davinci_annodel":{result: "success"},
							"annotations.davinci_edit":"annotations",
							"annotations.davinci_actionCommentEdit":"annotations",
							"annotations.davinci_annocheck":{result: "success"},
							"approvals.davinci_approve":"approvals",
							"approvals.davinci_annocheck":"approvals",
							"imageinfo.davinci":"imageinfo",
							"getVideoInfo.davinci":"imageinfo",								
							"compareimagesinfo.davinci":"compareimagesinfo",
							"imagestatus.davinci":{
								  result: {
								    extendedStatus: "extendedStatus", 
								    status: "status", 
								    error: "error"
								  }
							},
							"getworkqueue.davinci":{result: 1},
							"pagestatus.davinci":{
								  result: {
								    extendedStatus: "extendedStatus", 
								    status: "status", 
								    error: "error"
								  }
							},
							"separation.davinci":{result: "cmyk,s0,s1,sn"},
							"userpreference.davinci":"userpreference",
							"pageinfo.davinci":"getPageInfo",
							"pageinfo.davinci_1":"getPageInfo1",
							"createpdf.davinci":"",
							"attachfile.davinci":"",
							"attachfile.davinci_r":{
								  result: [
									    {
									      fileId: null, 
									      annoProgressiveId: null, 
									      acid: null, 
									      fileName: null, 
									      filePath: null, 
									      uploadDate: null
									    }
								  ]
							},
							"getfont.davinci":"",
							"getZoomImg.davinci":"",
							"getThumber.davinci":"",
							"clientConfig.davinci":"clientConfig"
						},urlName = url.substring(url.lastIndexOf("/")+1,url.length),
						action,urlMapVal;
						if("annotations.davinci"==urlName){
							action = params["action"];
							switch(action){
								case 'load':
									urlName +="_load";
								break;
								case 'annotate':
									urlName +="_annotate";
								break;
								case 'annodel':
									urlName +="_annodel";
								break;
								case 'edit':
									urlName +="_edit";
								break;
								case 'actionCommentEdit':
									urlName +="_actionCommentEdit";
								break;
								case 'annocheck':
									urlName +="_annocheck";
								break;
							}
						}else if("approvals.davinci"==urlName){
							action = params["action"];
							switch(action){
								case 'approve':
									urlName +="_approve";
								break;
								case 'loadApp':
									urlName +="_loadApp";
								break;
							}
						}else if("attachfile.davinci"==urlName){
							action = params["action"];
							switch(action){
								case 'r':
									urlName +="_r";
								break;
							}
						}else if("pageinfo.davinci"==urlName){
							num = params["num"];

							if(dv_brand==BRAND_COMPARE){
								switch(num){
									case 0:
										urlName +="_1";
									break;
								}
							}
							
						}
						urlMapVal = urlMap[urlName];
						if(typeof urlMapVal == "string"&&urlMapVal!=""){
							json = testdata[urlMapVal];
						}else{
							json = urlMapVal;
						}
						
						DVUtil.log("CALL URL  :  "+PUBLIC_CONFIGS.base_url+url+parameter);
						if(json){
							
							if(json.result){
								successfn(json.result);
							}else{
								failfn(data.error);
								DVUtil.error(data.error);
							}
							
						}else{
							throw Error("No found '"+urlMap[urlName]+"'' Object, you must init this object to test.");
						}
						
					}else{
						// DVUtil.log(["async",async])
						DVUtil.log("CALL URL  :  "+PUBLIC_CONFIGS.base_url+url+parameter);
						

						jQuery.ajax({
							type : "get",
							async:false,
							url : PUBLIC_CONFIGS.base_url+url+parameter,
							dataType : "jsonp",
							jsonp: "callbackparam",//
							jsonpCallback:"success_jsonpCallback_"+callNumber,//
							success : function(data){
								DVUtil.log(["CALL BACK  :  "+PUBLIC_CONFIGS.base_url+url+parameter,
									data]);
								json = data;
								success = data.result;
								if(success){
									successfn(success);
								}else{

									failfn(data.error);
									//alert(data[0].errorMsg);
									DVUtil.error(data.error);
								}
							},
							error:function(XMLHttpRequest, textStatus, errorThrown) {
								failfn(errorThrown)
								DVUtil.error("call '"+(PUBLIC_CONFIGS.base_url+url+parameter)+"' >> error:"+errorThrown);
								//alert(errorThrown);
							}
						});
						
					}
					
					return json;
				}		

		    		u.isJQ = function(obj){
		    			if(obj&&obj instanceof $){
		    				return true;
		    			}
		    			return false;		    			
		    		}
		    		u.chkString = function(arg){
		    			if(arg&&typeof arg == "string"){
		    				return true;
		    			}
		    			return false;		    			
		    		}
		    		u.chkNumber = function(arg){
		    			if(arg&&typeof arg == "number"){
		    				return true;
		    			}
		    			return false;		    			
		    		}
		    		u.chkObject = function(arg){
		    			if(arg&&typeof arg == "object"){
		    				return true;
		    			}
		    			return false;	
		    		}
		    		u.chkArray = function(arg){
		    			if(arg&&typeof arg == "array"){
		    				return true;
		    			}
		    			return false;		    			
		    		}
		    		u.chkAction = function(action){
		    			var action_index;
		    			switch(action){
		    				case "Fit to Screen":
	    					action_index = "1";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Full Screen":
	    					action_index = "2";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Zoom in (rectangle)":
	    					action_index = "3";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Post it Note":
	    					action_index = "4";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Freehand Note":
	    					action_index = "5";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Circle Note":
	    					action_index = "6";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Square Note":
	    					action_index = "7";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Approval":
	    					action_index = "8";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Page Controls":
	    					action_index = "9";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Print":
	    					action_index = "10";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Toggle Annotation":
	    					action_index = "11";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Measurement":
	    					action_index = "12";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Rotation":
	    					action_index = "13";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Color Separation":
	    					action_index = "14";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Color densitometer":
	    					action_index = "15";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "User perferences":
	    					action_index = "16";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Threaded Discussion":
	    					action_index = "17";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Action Comments":
	    					action_index = "18";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Arrow Note":
	    					action_index = "19";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Compare Mode Tab":
	    					action_index = "20";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Drag Tool":
	    					action_index = "21";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Back Tool":
	    					action_index = "22";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Measurement and Save Annotation":
	    					action_index = "23";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Densitometer and Save Annotation":
	    					action_index = "24";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "Checkbox column":
	    					action_index = "25";
	    					return ($.inArray(action_index,dv_action_list)!=-1)

	    					case "":
	    					action_index = "26";
	    					return ($.inArray(action_index,dv_action_list)!=-1)
	    					case "Compare Mode":
	    					return dv_brand == BRAND_COMPARE;

		    				
		    			}
		    			return false;
		    		}

		    		u.convertBean = function(convertedBean,refArgs){		    			
		    			if(refArgs&&convertedBean){
		    				var returnBean = {};
		    				for(var key in refArgs){
		    					returnBean[key] = convertedBean[refArgs[key]];
		    				}
		    				return returnBean;
		    			}else{
		    				throw Error("DVUtil.convertObj() arguments undefined, please check it.  convertedBean="+convertedBean+";   refArgs="+refArgs);
		    				return null;
		    			}
		    		}

		    	})(DVUtil);

		    	(function(d){
		    		d.drawRoundRect = function(context,x, y, w, h, r) {
		    			
						if (w < 2 * r) r = w / 2;
						if (h < 2 * r) r = h / 2;
						context.beginPath();
						context.moveTo(x+r, y);
						context.arcTo(x+w, y, x+w, y+h, r);
						context.arcTo(x+w, y+h, x, y+h, r);
						context.arcTo(x, y+h, x, y, r);
						context.arcTo(x, y, x+w, y, r);
						// this.arcTo(x+r, y);
						context.closePath();
						return context;
					}

					d.drawEllipse = function(context, x, y, a, b,color){
						color = color?color:"#000000";
					   var step = (a > b) ? 1 / a : 1 / b;
					   context.beginPath();
					   context.strokeStyle=color;
					   context.moveTo(x + a, y); 
					   for (var i = 0; i < 2 * Math.PI; i += step)
					   {
					      context.lineTo(x + a * Math.cos(i), y + b * Math.sin(i));
					   }
					   context.closePath();
					   context.stroke();
					   return context;
					};

					d.drawArrow = function(viewport,context,shape){
						var shape_point = d.dvToViewportCor(shape.x,shape.y),
	    				shape_point2 = DVDrawerUtil.dvToViewportCor(
	    					Math.abs(parseFloat(shape.x)+parseFloat(shape.width*shape.scale)),
	    					Math.abs(parseFloat(shape.y)+parseFloat(shape.height*shape.scale))
	    				),
	    				shape_vpoint = viewport.imageToViewerElementCoordinates( shape_point ),
	    				shape_vpoint2 = viewport.imageToViewerElementCoordinates( shape_point2 ),
	    				lX = parseFloat(shape.width*shape.scale),
	    				lY = parseFloat(shape.height*shape.scale),
	    				Par = 180,//10.0*shape.scale,
						slopy = Math.atan2(-lY,-lX),
						cosy = Math.cos(slopy),
						siny = Math.sin(slopy),
	    				color = d.toColor(shape.color),
	    				shape_point3 = DVDrawerUtil.dvToViewportCor(
	    					Math.abs(parseFloat(shape.x)+parseFloat(lX + ( Par * cosy - ( Par / 2.0 * siny )))),
	    					Math.abs(parseFloat(shape.y)+parseFloat(lY + ( Par * siny + ( Par / 2.0 * cosy ))))
	    				),
	    				shape_point4 = DVDrawerUtil.dvToViewportCor(
	    					Math.abs(parseFloat(shape.x)+parseFloat(lX + ( Par * cosy + Par / 2.0 * siny ))),
	    					Math.abs(parseFloat(shape.y)+parseFloat(lY - ( Par / 2.0 * cosy - Par * siny )))
	    				),
	    				shape_vpoint3 = viewport.imageToViewerElementCoordinates( shape_point3 ),
	    				shape_vpoint4 = viewport.imageToViewerElementCoordinates( shape_point4 );

	    				context.beginPath();
	    				context.strokeStyle=color;
	    				context.fillStyle=color;
						context.moveTo(shape_vpoint.x,shape_vpoint.y);
						context.lineTo(shape_vpoint2.x,shape_vpoint2.y);
						context.lineTo(shape_vpoint3.x,shape_vpoint3.y);
						context.lineTo(shape_vpoint4.x,shape_vpoint4.y);
						context.lineTo(shape_vpoint2.x,shape_vpoint2.y);
						context.closePath();
						context.fill();
						context.stroke();


						return context;
					}

					d.drawFreehand = function(viewport,context,shape){
						var shape_point = d.dvToViewportCor(shape.x,shape.y),
						shapeData = shape.data,
		    				shape_vpoint = viewport.imageToViewerElementCoordinates( shape_point ),
		    				color = d.toColor(shape.color),
		    				index = 3;

		    				context.beginPath();
		    				context.strokeStyle=color;
						context.moveTo(shape_vpoint.x,shape_vpoint.y);
						for(var i=0;i<shapeData.length;i++){
							if(index==i){
								var shape_point3 = DVDrawerUtil.dvToViewportCor(
			    					Math.abs(parseFloat(shape.x)+parseFloat(shapeData[i])),
			    					Math.abs(parseFloat(shape.y)+parseFloat(shapeData[i+1]))
			    				),
			    				shape_vpoint3 = viewport.imageToViewerElementCoordinates( shape_point3 );
			    				context.lineTo(shape_vpoint3.x,shape_vpoint3.y);
							}
							if(shapeData[i]=="L"||shapeData[i]=="M"){
								index = i + 1;
							}
							
						}
						context.stroke();

						return context;
					}

					d.drawRect = function(context,x, y, w, h,color){
						color = color?color:"#000000";
						context.beginPath();
						context.strokeStyle=color;
						context.rect(x, y, w, h);
						context.stroke();
						// context.fill();
						return context;
					}
					d.toColor = function(color){
						var color_result = parseInt(color).toString(16);
						if(3381759==parseInt(color)){
							color_result = "DBEEF3";
						}
						if(16724787==parseInt(color)){
							color_result = "F2A3A7";
						}
						return "#"+color_result;
					}

					d.dvToViewportCor = function(x,y){
    			 		var hwobj = d.getDVHW(),vx,vy;
    			 		vx = x * (hwobj.oh/hwobj.h);
			 			vy = y * (hwobj.ow/hwobj.w);
			 			// u.log(hwobj);
			 			return {"x":vx,"y":vy};
    			 	}
    			 	d.dvToImageCor = function(x,y){
    			 		var hwobj = d.getDVHW(),vx,vy;
    			 		vx = x * (hwobj.h/hwobj.oh);
			 			vy = y * (hwobj.w/hwobj.ow);
			 			// u.log(hwobj);
			 			return {"x":vx,"y":vy};
    			 	}
    			 	d.getDVHW = function(num){
    			 		var returnObj = {},w,h,ow,oh;
    			 		if(dv_brand==BRAND){
    			 			if(dv_page_info.originalHeightPx<dv_page_info.originalWidthPx){
    			 				w = DVSOL;
    			 				h = DVSOL*(dv_page_info.originalHeightPx/dv_page_info.originalWidthPx);
    			 			}else{
    			 				w = DVSOL*(dv_page_info.originalWidthPx/dv_page_info.originalHeightPx);
    			 				h = DVSOL;
    			 			}
    			 			ow = dv_page_info.originalWidthPx;
    			 			oh = dv_page_info.originalHeightPx;
    			 		}else if(dv_brand==BRAND_COMPARE){
    			 			if(num==1){
    			 				if(dv_page_info1.originalHeightPx<dv_page_info1.originalWidthPx){
	    			 				w = DVSOL;
	    			 				h = DVSOL*(dv_page_info1.originalHeightPx/dv_page_info1.originalWidthPx);
	    			 			}else{
	    			 				w = DVSOL*(dv_page_info1.originalWidthPx/dv_page_info1.originalHeightPx);
	    			 				h = DVSOL;
	    			 			}
	    			 			ow = dv_page_info1.originalWidthPx;
    			 				oh = dv_page_info1.originalHeightPx;
    			 			}else{
    			 				if(dv_page_info2.originalHeightPx<dv_page_info2.originalWidthPx){
	    			 				w = DVSOL;
	    			 				h = DVSOL*(dv_page_info2.originalHeightPx/dv_page_info2.originalWidthPx);
	    			 			}else{
	    			 				w = DVSOL*(dv_page_info2.originalWidthPx/dv_page_info2.originalHeightPx);
	    			 				h = DVSOL;
	    			 			}
	    			 			ow = dv_page_info2.originalWidthPx;
    			 				oh = dv_page_info2.originalHeightPx;
    			 			}
    			 		}else if(dv_brand==BRAND_VIDEO){

    			 		}
    			 		returnObj = {"w":w,"h":h,"ow":ow,"oh":oh};
    			 		return returnObj;
    			 		
    			 	}
		    	})(DVDrawerUtil);

		    	(function(anno){
		    		anno.update = function(){
		    			var _num = 0;
		    			if(dv_brand==BRAND){
	    					dv_annos_drawer?dv_annos_drawer.updAnnoList(_num):DVTableList.TabNav.annolistUpdate();
	    				}else if(dv_brand==BRAND_COMPARE){
	    					if(dv_current_num&&dv_current_num.length==1&&dv_current_num[0]==1){
								dv_annos_drawer1?dv_annos_drawer1.updAnnoList():DVTableList.TabNav.annolistUpdate();
							}else if(dv_current_num&&dv_current_num.length==1&&dv_current_num[0]==2){
								_num = 1;
								dv_annos_drawer2?dv_annos_drawer2.updAnnoList(_num):DVTableList.TabNav.annolistUpdate();							
							}else if(dv_current_num&&dv_current_num.length==3){
								dv_annos_drawer1?dv_annos_drawer1.updAnnoList(0):DVTableList.TabNav.annolistUpdate();
								dv_annos_drawer2?dv_annos_drawer2.updAnnoList(1):DVTableList.TabNav.annolistUpdate();
							}

	    					// _annoTable.getData().update();
	    					// _annoTable2.getData().update();
	    				}
		    		}
		    		DVAnnotationsClass = function(viewer){
		    			var _that = this,
		    			_viewer = viewer,
	    			 	_drawer = _viewer.drawer,
	    			 	_canvas = _drawer.canvas,
	    			 	_context = _drawer.context,
	    			 	_viewport = _viewer.viewport,
	    			 	_anno = anno,
		    			_annotationList = [],
		    			_dv_canvas;
		    			if(viewer==dv_viewer){
		    				_dv_canvas = dv_jq_canvas;
		    			}else if(viewer==dv_viewer1){
		    				_dv_canvas = dv_jq_canvas1;
		    			}else if(viewer==dv_viewer2){
		    				_dv_canvas = dv_jq_canvas2;
		    			}else if(viewer==dv_viewer_page){
		    				_dv_canvas = dv_jq_canvas_page;
		    			}
		    			this.initAnnoList = function(annolist){
		    				var _annolist = annolist || _getAnnoList(),
		    				_viewer = viewer;
		    				//clear
		    				_dv_canvas.find(".dv-annotation").remove();
		    				_dv_canvas.find(".dv-annotation-view").remove();
		    				for(var i=0;i<_annotationList.length;i++){
		    			 		_annotationList[i].clearAnno();
		    			 		_annotationList[i] = null;
		    			 	}
		    				_annotationList = [];
		    				if(!_annolist){
		    					return;
		    				}
		    				
		    				for(var i=0;i<_annolist.length;i++){
		    			 		var anno = _annolist[i],
		    			 		shap = anno.shape,
		    			 		shaptype = (shap&&$.trim(shap.type)!="")?shap.type.split(" ")[0]:"nomal",
		    			 		annotation;
		    			 		switch(shaptype){
		    			 			case "nomal":
		    			 				var annoClass = new DVNormalAnnoClass(_viewer,anno);
		    			 				_annotationList.push(annoClass);
		    			 				dv_anno_class_list[anno.acid] = annoClass;
		    			 			break;
		    			 			case ANNO_ECLIPSE:
		    			 				// _annotationList.push(new DVCircleAnnoClass(_viewer,anno));
		    			 				var annoClass = new DVCircleAnnoClass(_viewer,anno);
		    			 				_annotationList.push(annoClass);
		    			 				dv_anno_class_list[anno.acid] = annoClass;
		    			 			break;
		    			 			case ANNO_RECT:
		    			 				// _annotationList.push(new DVRectangleAnnoClass(_viewer,anno));
		    			 				var annoClass = new DVRectangleAnnoClass(_viewer,anno);
		    			 				_annotationList.push(annoClass);
		    			 				dv_anno_class_list[anno.acid] = annoClass;
		    			 			break;
		    			 			case ANNO_FREEHAND:
		    			 				// _annotationList.push(new DVFreehandAnnoClass(_viewer,anno));
		    			 				var annoClass = new DVFreehandAnnoClass(_viewer,anno);
		    			 				_annotationList.push(annoClass);
		    			 				dv_anno_class_list[anno.acid] = annoClass;
		    			 			break;
		    			 			case ANNO_ARROW:
		    			 				// _annotationList.push(new DVArrowAnnoClass(_viewer,anno));
		    			 				var annoClass = new DVArrowAnnoClass(_viewer,anno);
		    			 				_annotationList.push(annoClass);
		    			 				dv_anno_class_list[anno.acid] = annoClass;
		    			 			break;
		    			 		}
		    			 	}

		    			}

		    			this.draw = function(){
		    				_clearAnnos();
		    			 	for(var i=0;i<_annotationList.length;i++){
		    			 		_annotationList[i].draw();
		    			 	}		    			 	
		    			}
		    			this.getAnnotationList = function(){
		    				return _annotationList;
		    			}
		    			this.setAnnotationList = function(annolist){
		    				_annotationList = annolist;
		    			}
		    			this.getAnnotation = function(acid){
		    				if(_annotationList){
		    					var annotation = anno_drawer.getAnnotationList().filter(function(anno) {
								
								return anno.getAcid()==acid;								
							});
		    					return annotation;
		    				}
		    				return null;
		    			}
		    			function _clearAnnos(){
		    				if(viewer === dv_viewer){
		    					_context.putImageData(dv_image_data, 0, 0);
		    				}else if(viewer === dv_viewer1){
		    					_context.putImageData(dv_image_data1, 0, 0);
		    				}else if(viewer === dv_viewer2){
		    					_context.putImageData(dv_image_data2, 0, 0);
		    				}else if(viewer === dv_viewer_page){
		    					_context.putImageData(dv_image_data_page, 0, 0);
		    				}else if(dv_brand==BRAND_VIDEO){

	    			 		}

		    			}
		    			this.updAnnoList = function(num,callback){
		    				num  = num || DVUtil.getNum();
		    				function _success(data){
		    					data = data?data:[];
		    					_that.initAnnoList(data);
		    					_that.draw();
		    					if(dv_brand==BRAND){
		    			 			dv_annotations = data;
		    			 		}else if(dv_brand==BRAND_COMPARE){
		    			 			num==0?dv_annotations1 = data:null;
		    			 			num==1?dv_annotations2 = data:null;
		    			 		}else if(dv_brand==BRAND_VIDEO){

		    			 		}
		    			 		DVTableList.TabNav.annolistUpdate();
		    					typeof callback == "function"?callback(data):null;
		    				}
		    				function _fail(data){
		    					typeof callback == "function"?callback({"error":data}):null;
		    				}
		    				DVUtil.callJSON("annotations.davinci",{
		    					"sessionid":PUBLIC_CONFIGS.session_id,
		    					"dataType":DATA_TYPE,
		    					"action":ANNO_ACTION_LOAD,
		    					"num":num
		    				},null,_success,_fail);
		    			}
		    			function _getAnnoList(){
		    				var annolist = [];
		    				if(dv_brand==BRAND){
	    			 			annolist = dv_annotations;
	    			 		}else if(dv_brand==BRAND_COMPARE){
	    			 			annolist = viewer === dv_viewer1?dv_annotations1:dv_annotations2;
	    			 		}else if(dv_brand==BRAND_VIDEO){

	    			 		}
	    			 		return annolist;
		    			}

		    			//setup
		    			this.initAnnoList();

		    		}

		    		DVAnnotationClass = function(viewer,anno){
		    			var _that = this,
		    			eu = DVEleUtil,
		    			_viewer = viewer,
	    			 	_drawer = _viewer.drawer,
	    			 	_canvas = _drawer.canvas,
	    			 	_context = _drawer.context,
	    			 	_viewport = _viewer.viewport,
	    			 	_anno = anno,
	    			 	_anno_bg_color = "#F2FAA7",
	    			 	_anno_border_color = "#EAECDF",
	    			 	_anno_font_color = "#000000",
	    			 	_anno_font_size = "10pt",
	    			 	_anno_font_style = "Calibri",	    			 	
	    			 	ANNO_FONT_ALPHA = 1,
	    			 	ANNO_FONT_WIDTH = 2,
	    			 	ANNO_FONT_HEIGHT = 3,
	    			 	_acid = _anno.acid,
	    			 	_showAnnoView = false,
	    			 	_jq_anno_view,_jq_anno_text,_jq_anno_save,_jq_anno_cancel,
	    			 	_jq_anno,
	    			 	_vpoint,
	    			 	_dvCanvas,_page,
	    			 	anno_drawer,
	    			 	_num;
	    			 	this.annoShapeImagedata = null;
	    			 	
	    			 	



	    			 	this.getShapeData = function(){
	    			 		var lData = _anno.shape.type.split(" "),
	    			 		_pShape = {};
			
							_pShape.type = lData[0];
							_pShape.scale = lData[1];
							_pShape.x = lData[2];
							_pShape.y = lData[3];
							_pShape.width = lData[4];
							_pShape.height = lData[5];
							
							if(lData.length > 6)
							{
								_pShape.data = lData.splice(6);
							}
							_pShape.color =  _anno.shape.color;
							return _pShape;
	    			 	}
	    			 	this.getAcid = function(){
	    			 		return _acid;
	    			 	}
		    			this.draw = function(){
		    				if(viewer==dv_viewer){
								anno_drawer = dv_annos_drawer;
							}else if(viewer==dv_viewer1){
								anno_drawer = dv_annos_drawer1;
							}else if(viewer==dv_viewer2){
								anno_drawer = dv_annos_drawer2;
							}else if(viewer==dv_viewer_page){
								anno_drawer = dv_annos_drawer_page;
							}

		    				//clear annotations in canvas
		    				// DVUtil.log("dv_page.page1="+dv_page+" anno.page="+anno.page);
		    				DVUtil.log(["dv_page.page1",dv_page,"anno.page",anno.page]);
		    				if(_viewer==dv_viewer){
		    					_dvCanvas = dv_jq_canvas;
		    					_num = 0;
		    					if(parseInt(dv_page.page1)!=parseInt(anno.page)){
		    						return;
		    					}		    					
		    				}else if(_viewer==dv_viewer1){
		    					_dvCanvas = dv_jq_canvas1;
		    					_num = 0;
		    					if(parseInt(dv_page1.page1)!=parseInt(anno.page)){
		    						return;
		    					}
		    				}else if(_viewer==dv_viewer2){
		    					_dvCanvas = dv_jq_canvas2;
		    					_num = 1;
		    					if(parseInt(dv_page2.page1)!=parseInt(anno.page)){
		    						return;
		    					}
		    				}else if(_viewer==dv_viewer_page){
		    					_dvCanvas = dv_jq_canvas_page;
		    					_num = DVUtil.getNum();
		    					var _relativeViewer = _viewer.relativeViewer;
		    					if(_relativeViewer==dv_viewer){
			    					if(parseInt(dv_page.page2)!=parseInt(anno.page)){
			    						return;
			    					}		    					
			    				}else if(_relativeViewer==dv_viewer1){
			    					if(parseInt(dv_page1.page2)!=parseInt(anno.page)){
			    						return;
			    					}
			    				}else if(_relativeViewer==dv_viewer2){
			    					if(parseInt(dv_page2.page2)!=parseInt(anno.page)){
			    						return;
			    					}
			    				}
		    				}

		    				_that.drawAnnoShape();
		    				_that.drawAnno();
		    				_that.createAnnoElement();
		    			}

		    			this.drawAnno = function(){
		    				var point = DVDrawerUtil.dvToViewportCor(_anno.sceneX,_anno.sceneY),
	    			 		opoint = new OpenSeadragon.Point(point.x,point.y),
					        vpoint = _vpoint = _viewport.imageToViewerElementCoordinates( opoint ),	    			 		
	    			 		text = _context.measureText(_anno.progressiveId);
	    			 		
		    			 	


		    			 	if(!_jq_anno){
		    					_jq_anno = eu.div("dv-annotation")
		    					_dvCanvas.append(_jq_anno);
		    					_jq_anno.bind("click",{},_jqAnnoClickEvent)
		    				}
		    				_jq_anno.css({
		    					"background-color":_anno_bg_color,
		    					"border":"1px solid "+_anno_border_color,
		    					"left":_vpoint.x-10+"px",
		    					"top":_vpoint.y-12+"px",
		    					"opacity":0.7
		    				}).text(_anno.progressiveId);
		    				DVUtil.log(["_num",_num,"_dvCanvas",_dvCanvas]);
		    			}

		    			this.createAnnoElement = function(){
		    				if(!_jq_anno_view){
		    					_jq_anno_view = eu.div("dv-annotation-view");
		    					_jq_anno_save = eu.img("dv-annotation-view-btn",{"src":ICON_ACCEPT});
		    					_jq_anno_cancel = eu.img("dv-annotation-view-btn",{"src":ICON_DELETE});
		    					_jq_anno_text = eu.textarea("dv-annotation-text");

		    					var jq_anno_left_layout = eu.div("dv-annotation-view-layout-left"),
		    					jq_anno_right_layout = eu.div("dv-annotation-view-layout-right"),
		    					jq_anno_bottom_layout = eu.div("dv-annotation-view-layout-bottom");
		    					_dvCanvas.append(_jq_anno_view);
		    					_jq_anno_view
		    					.append(jq_anno_left_layout)
		    					.append(jq_anno_right_layout)
		    					.append(jq_anno_bottom_layout);

		    					jq_anno_right_layout.append(_jq_anno_text);
		    					jq_anno_bottom_layout.append(_jq_anno_save)
		    					.append(_jq_anno_cancel);

		    					_jq_anno_save.bind("click",{"anno_drawer":anno_drawer},_jqAnnoSaveClickEvent);
		    					_jq_anno_cancel.bind("click",{},_jqAnnoCancelClickEvent);
		    					_jq_anno_text.bind("focus",{},_jqAnnoTextFocusEvent)
		    				}

		    				// _jq_anno_view.empty();
		    				_jq_anno_text.val(decodeString(_anno.content));
		    				
		    				_jq_anno_view.css({
		    					"left":_vpoint.x+"px",
		    					"top":_vpoint.y+"px"
		    				});

		    				if(_anno.progressiveId=="new"){
		    					
		    					_jq_anno_cancel.attr({"src":ICON_CLOSE})
		    					_that.open();
		    				}
		    			}

		    			this.getAnnoViewPoint = function(){
		    				return _vpoint;
		    			}

		    			this.drawAnnoShape = function(){}
		    			this.clearAnno = function(){
		    				_jq_anno_view?_jq_anno_view.remove():null;
		    				_jq_anno?_jq_anno.remove():null;

		    				_jq_anno_view = null;
		    				_jq_anno = null;
		    				if(anno_drawer&&anno_drawer.getAnnotationList()){

      							var w = anno_drawer.getAnnotationList().filter(function(index) {
									
									return index!==_that;								
								});
								anno_drawer.setAnnotationList(w);
      						}
		    				_that.annoShapeImagedata?_context.putImageData(_that.annoShapeImagedata,0,0):null;
		    			}
		    			this.save = function(){
		    				if(_anno.progressiveId=="new"){
		    					function _success(data){
								// dv_config_bean = data;
								anno_drawer.updAnnoList(_num);
							}
							function _fail(data){
								throw Error(data);
							}
							var annoText = _jq_anno_text.val();
							
							DVUtil.callJSON("annotations.davinci",{
								"sessionid":PUBLIC_CONFIGS.session_id,
								"dataType":DATA_TYPE,
								"action":ANNO_ACTION_ADD,
								"num":DVUtil.getNum(),
								"dependentId":"0",
								"content":base64encode(annoText),
								"fcontent":base64encode(annoText),
								"page":_anno.page,
								"x":_anno.sceneX,
								"y":_anno.sceneY,
								"tid":"",
								"c":_anno.color,
								"b64":"",
								"playheadtime":"",
								"type":_anno.shape.type,
								"sc":_anno.shape.color
							},null,_success,_fail);
		    				}else{
		    					function _success(data){
								// dv_config_bean = data;
								anno_drawer.updAnnoList(_num);
							}
							function _fail(data){
								throw Error(data);
							}
							var annoText = _jq_anno_text.val();
							
							DVUtil.callJSON("annotations.davinci",{
								"sessionid":PUBLIC_CONFIGS.session_id,
								"dataType":DATA_TYPE,
								"action":ANNO_ACTION_EDIT,
								"num":DVUtil.getNum(),
								"noid":_anno.acid,
								"dependentId":"0",
								"content":base64encode(annoText),
								"fcontent":base64encode(annoText),
								"page":_anno.page,
								"x":_anno.sceneX,
								"y":_anno.sceneY,
								"tid":"",
								"c":_anno.color,
								"b64":"",
								"playheadtime":"",
								"type":_anno.shape.type,
								"sc":_anno.shape.color
							},null,_success,_fail);
		    				}
		    			}
		    			this.move = function(){}
		    			this.open = function(){
		    				_showAnnoView = true;
		    				_jq_anno_view?_jq_anno_view.show():null;
		    				_jq_anno_text?_jq_anno_text.focus():null;
		    			}
		    			this.close = function(){
		    				_showAnnoView = false;
		    				_jq_anno_view?_jq_anno_view.hide():null;
		    			}
		    			function _jqAnnoClickEvent(){
		    				if(_showAnnoView){
		    					_jq_anno_view?_jq_anno_view.hide():null;
		    				}else{
		    					_jq_anno_view?_jq_anno_view.show():null;
		    				}
		    				_showAnnoView = !_showAnnoView;
		    			}
		    			/**
		    			 * [annotation save button click event]
		    			 * @return {[type]} [description]
		    			 */
		    			function _jqAnnoSaveClickEvent(e){
		    				
		    				_that.save();
		    			}
		    			function _jqAnnoTextFocusEvent(e){
		    				_dvCanvas.find(".dv-annotation-view").removeClass("selected");
		    				_jq_anno_view.addClass("selected");
		    			}
		    			function _jqAnnoCancelClickEvent(){
		    				
						if(_anno.progressiveId=="new"){
		    					_that.clearAnno();
		    					
		    				}else{
		    					function _success(data){
								// dv_config_bean = data;
								anno_drawer.updAnnoList(_num);
							}
							function _fail(data){
								throw Error(data);
							}
		    					DVUtil.callJSON("annotations.davinci",{
									"sessionid":PUBLIC_CONFIGS.session_id,
									"dataType":DATA_TYPE,
									"action":ANNO_ACTION_DEL,
									"num":DVUtil.getNum(),
									"noid":_anno.acid
								},null,_success,_fail);
		    				}

	
		    			}
		    		}

			    	DVNormalAnnoClass = function(viewer,anno){
		    			DVAnnotationClass.prototype.constructor.call(this,viewer,anno);
		    			var _that = this,
		    			_viewer = viewer,
	    			 	_drawer = _viewer.drawer,
	    			 	_canvas = _drawer.canvas,
	    			 	_context = _drawer.context,
	    			 	_viewport = _viewer.viewport,
	    			 	_anno = anno;
		    			this.drawAnnoShape = function(){
		    				
		    			}
		    		}

			    	DVRectangleAnnoClass = function(viewer,anno){
		    			DVAnnotationClass.prototype.constructor.call(this,viewer,anno);
		    			var _that = this,
		    			_viewer = viewer,
	    			 	_drawer = _viewer.drawer,
	    			 	_canvas = _drawer.canvas,
	    			 	_context = _drawer.context,
	    			 	_viewport = _viewer.viewport,
		    			_anno = anno,
		    			_shape;
		    			this.drawAnnoShape = function(){
		    				_that.annoShapeImagedata =  _context.getImageData(0, 0,_canvas.width,_canvas.height);
		    				_shape = _that.getShapeData();
		    				var shape_point = DVDrawerUtil.dvToViewportCor(_shape.x,_shape.y),
		    				shape_point2 = DVDrawerUtil.dvToViewportCor(parseFloat(_shape.x)+parseFloat(_shape.width*_shape.scale),
		    					parseFloat(_shape.y)+parseFloat(_shape.height*_shape.scale)),
		    				shape_vpoint = _viewport.imageToViewerElementCoordinates( shape_point ),
		    				shape_vpoint2 = _viewport.imageToViewerElementCoordinates( shape_point2 ),
		    				color = DVDrawerUtil.toColor(_shape.color),
		    				startX = shape_vpoint.x>shape_vpoint2.x?shape_vpoint2.x:shape_vpoint.x,
		    				startY = shape_vpoint.y>shape_vpoint2.y?shape_vpoint2.y:shape_vpoint.y;
		    				

		    				DVDrawerUtil.drawRect(_context,startX,
		    					startY,
		    					Math.abs(shape_vpoint.x-shape_vpoint2.x),
		    					Math.abs(shape_vpoint.y-shape_vpoint2.y),
		    					color);
		    				
		    				// 
		    				// DVUtil.log(color);
		    			}
		    		}

			    	DVCircleAnnoClass = function(viewer,anno){
		    			DVAnnotationClass.prototype.constructor.call(this,viewer,anno);
		    			var _that = this,
		    			_viewer = viewer,
	    			 	_drawer = _viewer.drawer,
	    			 	_canvas = _drawer.canvas,
	    			 	_context = _drawer.context,
	    			 	_viewport = _viewer.viewport,
		    			_anno = anno,
		    			_shape;
		    			this.drawAnnoShape = function(){
		    				_that.annoShapeImagedata =  _context.getImageData(0, 0,_canvas.width,_canvas.height);
		    				_shape = _that.getShapeData();
		    				var shape_point = DVDrawerUtil.dvToViewportCor(_shape.x,_shape.y),
		    				shape_point2 = DVDrawerUtil.dvToViewportCor(Math.abs(parseFloat(_shape.x)+parseFloat(_shape.width*_shape.scale)/2),
		    					Math.abs(parseFloat(_shape.y)+parseFloat(_shape.height*_shape.scale)/2)),
		    				shape_vpoint = _viewport.imageToViewerElementCoordinates( shape_point ),
		    				shape_vpoint2 = _viewport.imageToViewerElementCoordinates( shape_point2 ),
		    				color = DVDrawerUtil.toColor(_shape.color),
		    				ch = Math.abs(shape_vpoint.y-shape_vpoint2.y),
		    				cw = Math.abs(shape_vpoint.x-shape_vpoint2.x);

		    				// DVDrawerUtil.drawRect(_context,shape_vpoint.x,shape_vpoint.y,100,100,color);
		    				DVDrawerUtil.drawEllipse(_context,shape_vpoint2.x,shape_vpoint2.y,cw,ch,color);

		    				/*DVUtil.log(shape_vpoint);
		    				DVUtil.log(shape_vwh);*/
		    			}


		    		}

			    	DVFreehandAnnoClass = function(viewer,anno){
		    			DVAnnotationClass.prototype.constructor.call(this,viewer,anno);
		    			var _that = this,
		    			_viewer = viewer,
	    			 	_drawer = _viewer.drawer,
	    			 	_canvas = _drawer.canvas,
	    			 	_context = _drawer.context,
	    			 	_viewport = _viewer.viewport,
		    			_anno = anno,
		    			_shape;
		    			this.drawAnnoShape = function(){
		    				_that.annoShapeImagedata =  _context.getImageData(0, 0,_canvas.width,_canvas.height);
		    				_shape = _that.getShapeData();
		    				var shape_point = DVDrawerUtil.dvToViewportCor(_shape.x,_shape.y),
		    				shape_point2 = DVDrawerUtil.dvToViewportCor(
		    					Math.abs(parseFloat(_shape.x)+parseFloat(_shape.width*_shape.scale)),
		    					Math.abs(parseFloat(_shape.y)+parseFloat(_shape.height*_shape.scale))
		    					),
		    				shape_vpoint = _viewport.imageToViewerElementCoordinates( shape_point ),
		    				shape_vpoint2 = _viewport.imageToViewerElementCoordinates( shape_point2 ),
		    				shapeData = _shape.data,
		    				shapeDataLength = _shape.data.length,
		    				lX = shapeData[shapeDataLength-4],
		    				lY = shapeData[shapeDataLength-3],
		    				Par = 10.0*_shape.scale,
							slopy = Math.atan2((-lY),(-lX)),
							cosy = Math.cos(slopy),
							siny = Math.sin(slopy),
		    				color = DVDrawerUtil.toColor(_shape.color),
		    				shape_point3 = DVDrawerUtil.dvToViewportCor(
		    					Math.abs(parseFloat(_shape.x)+parseFloat(lX)),
		    					Math.abs(parseFloat(_shape.y)+parseFloat(lY))
		    				);
		    				
		    				DVDrawerUtil.drawFreehand(_viewport,_context,_shape);

		    			}


		    		}

			    	DVArrowAnnoClass = function(viewer,anno){
		    			DVAnnotationClass.prototype.constructor.call(this,viewer,anno);
		    			var _that = this,
		    			_viewer = viewer,
	    			 	_drawer = _viewer.drawer,
	    			 	_canvas = _drawer.canvas,
	    			 	_context = _drawer.context,
	    			 	_viewport = _viewer.viewport,
		    			_anno = anno,
		    			_shape;
		    			this.drawAnnoShape = function(){
		    				_that.annoShapeImagedata =  _context.getImageData(0, 0,_canvas.width,_canvas.height);
		    				_shape = _that.getShapeData();		    				
		    				
		    				DVDrawerUtil.drawArrow(_viewport,_context,_shape);

		    			}
		    		}


		    		// Inherit DVAnnotationClass
					DVUtil.extend(DVAnnotationClass,DVNormalAnnoClass);
					DVUtil.extend(DVAnnotationClass,DVRectangleAnnoClass);
					DVUtil.extend(DVAnnotationClass,DVCircleAnnoClass);
					DVUtil.extend(DVAnnotationClass,DVFreehandAnnoClass);
					DVUtil.extend(DVAnnotationClass,DVArrowAnnoClass);

		    	})(DVAnnotation);
		    	/**
		    	 * 该内包封装的是界面左边tab list的控件，包括了annotation table，approval table，checklist
		    	 * @param  {[DVTableList]} tablist [description]
		    	 * @param  {[DVEleUtil]} eu      [基本控件的封装]
		    	 * @return {[none]}         [description]
		    	 */
		    	(function(tablist,eu){
		    		/**
		    		 * [DVTabNavClass tab nav类，对应tab控件的ui生成，切换事件等操作]
		    		 */
		    		DVTabNavClass = function(){
		    			var _ul,_liAnnotation,_liApproval,_liChecklist,
		    			_tab,_annoTab,_appTab,_chklistTab,
		    			_annoTable,_appTable2,_annoTable2,_appTable,_chklistTable,
		    			_that = this;
		    			/*
		    			 * Private begin
		    			 */
		    			/**
		    			 * Private
		    			 * [_createElement 生成UI]
		    			 * @return {[type]} [description]
		    			 */
		    			function _createElement(){
		    				_ul = eu.ul("nav nav-tabs",{"role":"tablist"},{"min-width":"500px"});
		    				_liAnnotation = eu.li("active",{"role":"presentation"})
		    								.append(
		    									eu.a(null,{"href":"#annoTab","role":"tab","data-toggle":"tab"})
		    									.text("{0_M_J_Annotaion}")
		    								);
		    								
		    				_liApproval = eu.li("",{"role":"presentation"})
		    								.append(
		    									eu.a(null,{"href":"#appTab","role":"tab","data-toggle":"tab"})
		    									.text("{0_M_J_Approval}")
		    								);

		    				_liChecklist = eu.li("",{"role":"presentation"})
		    								.append(
		    									eu.a(null,{"href":"#chklistTab","role":"tab","data-toggle":"tab"})
		    									.text("{0_M_J_Checklist}")
		    								);

		    				_ul.append(_liAnnotation).append(_liApproval).append(_liChecklist);

		    				_tab = eu.div("tab-content");
		    				_annoTab = eu.div("tab-pane fade in active",{"role":"tabpanel","id":"annoTab"});
		    				_appTab = eu.div("tab-pane fade",{"role":"tabpanel","id":"appTab"});
		    				_chklistTab = eu.div("tab-pane fade",{"role":"tabpanel","id":"chklistTab"});
		    				_tab.append(_annoTab).append(_appTab).append(_chklistTab);
		    			}

		    			function _initEvents(){
		    				_liAnnotation?_liAnnotation.bind("click",{},_annoClickEvent):null;
		    				_liApproval?_liApproval.bind("click",{},_approvalClickEvent):null;
		    				_liChecklist?_liChecklist.bind("click",{},_checklistClickEvent):null;
		    			}

		    			function _annoClickEvent (e) {
		    				// body...
		    			}

		    			function _approvalClickEvent (e) {
		    				// body...
		    			}

		    			function _checklistClickEvent (e) {
		    				// body...
		    			}

		    			/*
		    			 * Private end
		    			 */
		    			
		    			/**
		    			 * Public
		    			 */

		    			this.getElement = function(){
		    				return _ul;
		    			}

		    			this.getTabElement = function(){
		    				return _tab;
		    			}

		    			this.getAnnoTable = function(){
		    				return _annoTable;
		    			}

		    			this.getAnnoTable2 = function(){
		    				return _annoTable2;
		    			}	
		    			this.getAppTable = function(){
		    				return _appTable;
		    			}
					this.getAppTable = function(){
		    				return _appTable2;
		    			}

		    			this.getChklistTable = function(){
		    				return _chklistTable;
		    			}

		    			this.annolistUpdate = function(){


		    				if(dv_brand==BRAND){
		    					_annoTable.setData(dv_annotations);
		    					_annoTable2.setData(dv_annotations);
		    					if(!DVPageNavigate.pageNav||DVPageNavigate.pageNav.getPanel().isSinglePreview() == true){
			    					_annoTable2.listHide();
			    					_annoTable.updData();
		    			 		}else {
		    			 			_annoTable.updData(dv_page.page1);
		    			 			_annoTable2.updData(dv_page.page2);
		    			 			_annoTable2.listShow();
		    			 		}
		    					
		    					_appTable.setData(dv_approvals);
		    					_appTable.updData();
		    					
		    				}else if(dv_brand==BRAND_COMPARE){
		    					if(dv_current_num&&dv_current_num.length==1&&dv_current_num[0]==1){
								_annoTable.setData(dv_annotations1);
								_annoTable2.setData(dv_annotations1);
								_annoTable2.listHide();
								if(!DVPageNavigate.pageNav||DVPageNavigate.pageNav.getPanel()[0].isSinglePreview() == true){
				    				_annoTable2.listHide();
				    				_annoTable.updData();
			    			 	}else {
			    			 		_annoTable.updData(dv_page1.page1);
			    			 		_annoTable2.updData(dv_page1.page2);
			    			 		_annoTable2.listShow();
			    			 	}
								
								_appTable.setData(dv_approvals1);
								_appTable2.setData(dv_approvals2);
								_appTable2.listHide();
								if(!DVPageNavigate.pageNav||DVPageNavigate.pageNav.getPanel()[0].isSinglePreview() == true){
									_appTable2.listHide();
									_appTable.updData();
			    			 	}else {
			    			 		_appTable.updData(dv_page1.page1);
			    			 		_appTable2.updData(dv_page1.page2);
			    			 		_appTable2.listShow();
			    			 	}
							}else if(dv_current_num&&dv_current_num.length==1&&dv_current_num[0]==2){
								_annoTable.setData(dv_annotations2);
								_annoTable2.setData(dv_annotations2);
								_annoTable2.listHide();
								if(!DVPageNavigate.pageNav||DVPageNavigate.pageNav.getPanel()[1].isSinglePreview() == true){
				    					_annoTable2.listHide();
				    					_annoTable.updData();
			    			 		}else {
			    			 			_annoTable.updData(dv_page2.page1);
			    			 			_annoTable2.updData(dv_page2.page2);
			    			 			_annoTable2.listShow();
			    			 		}								
							}else if(dv_current_num&&dv_current_num.length==3){
								_annoTable.setData(dv_annotations1);
								_annoTable2.setData(dv_annotations2);
								_annoTable.updData();
								_annoTable2.updData();
								_annoTable2.listShow();
							}

		    					// _annoTable.getData().update();
		    					// _annoTable2.getData().update();
		    				}
		    				
		    			}
		    			this.update = function(){

		    			}
		    			
		    			this.init = function(){
		    				_createElement();
		    				_initEvents();
		    				_dvListTab.append(_ul).append(_tab);
		    				//_ul.find('a:last').tab('show');
		    				if(dv_brand==BRAND){
		    					_annoTable = new DVAnnotationListClass();
			    				_annoTable2 = new DVAnnotationListClass();
			    				
			    				_appTable = new DVApprovalListClass();
		    				}else if(dv_brand==BRAND_COMPARE){
		    					_annoTable = new DVAnnotationListClass(true);
			    				_annoTable2 = new DVAnnotationListClass(false);
			    				
			    				_appTable = new DVApprovalListClass(true);
			    				_appTable2 = new DVApprovalListClass(false);
		    				}
		    				_annoTab.append(_annoTable.getElement());
		    				_annoTab.append(_annoTable2.getElement());
		    				_annoTable2.listHide();

		    				_appTab.append(_appTable.getElement());
		    				if(_appTable2 != null){
		    					_appTab.append(_appTable2.getElement());
		    				}

		    				_chklistTable = new DVChecklistClass();
		    				_chklistTab.html(_chklistTable.getElement());
		    			}

		    			this.init();

		    		}
		    		/**
		    		 * 
		    		 * [DVTableListClass table 父类，公用的方法可在此处实现]
		    		 */
		    		DVTableListClass = function(){
		    			var _that = this;
		    			this.init = function(){
		    				_that.createElement();
		    				_that.initData();
		    			}

		    			this.getElement = function(){}
		    			this.updData = function(){}
		    			this.initData = function(){}
		    			this.sortDate = function(){}
		    			this.listHide = function(){_that.getElement().hide();}
		    	    		this.listShow = function(){_that.getElement().show();}
		    		}
		    		/**
		    		 * [DVAnnotationListClass 实现annotation table类]
		    		 */
		    		DVAnnotationListClass = function(isCompTop){
		    			DVTableListClass.prototype.constructor.call(this);
		    			var _element,_that = this,_annotations,
		    			_fileName,_table,_thead,_tbody,
		    			_listWidth = _dvMain_layout.width()*0.2 > 400 ? _dvMain_layout.width()*0.2 : 400 ,	
		    			_sort = true ,_sortIndex = -1 ,_isCompTop = isCompTop;

		    			this.sortDate = function(sortIndex,sort){
		    				_sortIndex = sortIndex ;
		    				_sort = sort ;
		    				var trs = _that.getTbody().find("tr");
		    				var rowArr = new Array(trs.length);
		    				trs.each(function(i){
		    					rowArr[i] = trs.eq(i);
		    				})
	    					if(sort == true){
	    						rowArr.sort(function(row1,row2){
	    							var value1 = row1.find("td").eq(sortIndex).text();
	    							var value2 = row2.find("td").eq(sortIndex).text();
	    							return _compare(value1, value2);
	    						})
	    					}else{
	    						rowArr.reverse();
	    					}
		    				_that.getTbody().empty();
		    				for(var i = 0 ; i < rowArr.length ; i++ ){
		    					_that.getTbody().append(rowArr[i]);
		    				}
		    			}
		    			
		    			 //ㄤsort姣旇瀛楃涓
		    			function _compare(str1, str2) {
		    				if(str1 == null || str1.length == 0){
		    					return -1 ;
		    				}
		    				if(str2 == null || str2.length == 0){
		    					return 1 ;
		    				}
		    				var len = str1.length > str2.length ? str1.length : str2.length ;
		    				for(var i = 0 ; i < len ; i++){
		    					if (str1[i] < str2[i]) {
				    				return -1;
				    			} else if (str1[i] > str2[i]) {
				    				return 1;
				    			} 
		    				}
		    				
		    			};
		    			
		    			this.createElement = function(){
		    				// dv_annotations叡傛暟峰annotation list data
		    				_fileName = eu.div("fileName")
		    				_table = eu.table("table table-bordered table-hover table-striped",null,{"background-color":"#FFFFFF"});
		    				_thead = eu.thead();
		    				_tbody = eu.tbody();
		    				_thead.append(
		    					eu.tr().append(
		    						eu.th().append(eu.div().width(_listWidth*0.2).append("{0_M_J_ID}")).css({"padding":"0px"}).click(function(){
		    							var sortIndex = _that.getTable().find("th").index($(this)) ;
		    							$(this).parent().find("span").remove();
		    							var sort = _that.getSort() ;
		    							if(_that.getSortIndex() == sortIndex){
		    								if(sort != true){
		    									$(this).append(eu.span("glyphicon glyphicon-arrow-up").attr("aria-hidden","true"))
		    									_that.sortDate(sortIndex,true);
		    								}else{
		    									$(this).append(eu.span("glyphicon glyphicon-arrow-down").attr("aria-hidden","true"))
		    									_that.sortDate(sortIndex,false);
		    								}
		    							}else{
		    								$(this).append(eu.span("glyphicon glyphicon-arrow-up").attr("aria-hidden","true"))
		    								_that.sortDate(sortIndex,true);
		    							}
		    						})	
			    				).append(
			    					eu.th().append(eu.div().width(_listWidth*0.1).html("&nbsp;")).css({"padding":"0px"})	
			    				).append(
			    					eu.th().append(eu.div().width(_listWidth*0.1).text("{0_M_J_Page}")).css({"padding":"0px"}).click(function(){
			    						var sortIndex = _that.getTable().find("th").index($(this)) ;
		    							$(this).parent().find("span").remove();
		    							var sort = _that.getSort() ;
		    							if(_that.getSortIndex() == sortIndex){
		    								if(sort != true){
		    									$(this).append(eu.span("glyphicon glyphicon-arrow-up").attr("aria-hidden","true"))
		    									_that.sortDate(sortIndex,true);
		    								}else{
		    									$(this).append(eu.span("glyphicon glyphicon-arrow-down").attr("aria-hidden","true"))
		    									_that.sortDate(sortIndex,false);
		    								}
		    							}else{
		    								$(this).append(eu.span("glyphicon glyphicon-arrow-up").attr("aria-hidden","true"))
		    								_that.sortDate(sortIndex,true);
		    							}
		    						})	
			    				).append(
			    					eu.th().append(eu.div().width(_listWidth*0.2).text("{0_M_J_Firstname}")).css({"padding":"0px"}).click(function(){
			    						var sortIndex = _that.getTable().find("th").index($(this)) ;
		    							$(this).parent().find("span").remove();
		    							var sort = _that.getSort() ;
		    							if(_that.getSortIndex() == sortIndex){
		    								if(sort != true){
		    									$(this).append(eu.span("glyphicon glyphicon-arrow-up").attr("aria-hidden","true"))
		    									_that.sortDate(sortIndex,true);
		    								}else{
		    									$(this).append(eu.span("glyphicon glyphicon-arrow-down").attr("aria-hidden","true"))
		    									_that.sortDate(sortIndex,false);
		    								}
		    							}else{
		    								$(this).append(eu.span("glyphicon glyphicon-arrow-up").attr("aria-hidden","true"))
		    								_that.sortDate(sortIndex,true);
		    							}
		    						})		
			    				).append(
			    					eu.th().append(eu.div().width(_listWidth*0.2).text("{0_M_J_Lastname}")).css({"padding":"0px"}).click(function(){
			    						var sortIndex = _that.getTable().find("th").index($(this)) ;
		    							$(this).parent().find("span").remove();
		    							var sort = _that.getSort() ;
		    							if(_that.getSortIndex() == sortIndex){
		    								if(sort != true){
		    									$(this).append(eu.span("glyphicon glyphicon-arrow-up").attr("aria-hidden","true"))
		    									_that.sortDate(sortIndex,true);
		    								}else{
		    									$(this).append(eu.span("glyphicon glyphicon-arrow-down").attr("aria-hidden","true"))
		    									_that.sortDate(sortIndex,false);
		    								}
		    							}else{
		    								$(this).append(eu.span("glyphicon glyphicon-arrow-up").attr("aria-hidden","true"))
		    								_that.sortDate(sortIndex,true);
		    							}
		    						})	
			    				).append(
			    					eu.th().append(eu.div().width(_listWidth*0.2).text("{0_M_J_Content}")).css({"padding":"0px"}).click(function(){
			    						var sortIndex = _that.getTable().find("th").index($(this)) ;
		    							$(this).parent().find("span").remove();
		    							var sort = _that.getSort() ;
		    							if(_that.getSortIndex() == sortIndex){
		    								if(sort != true){
		    									$(this).append(eu.span("glyphicon glyphicon-arrow-up").attr("aria-hidden","true"))
		    									_that.sortDate(sortIndex,true);
		    								}else{
		    									$(this).append(eu.span("glyphicon glyphicon-arrow-down").attr("aria-hidden","true"))
		    									_that.sortDate(sortIndex,false);
		    								}
		    							}else{
		    								$(this).append(eu.span("glyphicon glyphicon-arrow-up").attr("aria-hidden","true"))
		    								_that.sortDate(sortIndex,true);
		    							}
		    						})	
			    				)
		    				)
		    				_table.append(_thead)
		    				.append(_tbody);
		    				_element = eu.div();
		    				_element.append(_fileName).append(eu.div().append(_table));
		    				return _element;
		    			}
		    			/**
		    			 * [updData ]
		    			 * @return {[type]} [description]
		    			 */
		    			this.updData = function(page){

		    				_fileName.empty();
		    				_tbody.empty();
		    				if(_annotations == null) return ;
							for(var i=0 ; i < _annotations.length ; i++){
								if(page == null || page == _annotations[i].page){
									var anno_content = decodeString(_annotations[i].content),
									tr = eu.tr()
										.append(
											eu.td().append(eu.div().width(_listWidth*0.2).text(_annotations[i].progressiveId)).attr("title",_annotations[i].progressiveId)
										).append(
											eu.td().append(eu.span("glyphicon glyphicon-paperclip").attr("aria-hidden","true"))
										).append(
											eu.td().append(eu.div().width(_listWidth*0.1).text(_annotations[i].page)).attr("title",_annotations[i].page)
										).append(
											eu.td().append(eu.div().width(_listWidth*0.1).text(_annotations[i].user.firstName)).attr("title",_annotations[i].user.firstName)
										).append(
											eu.td().append(eu.div().width(_listWidth*0.2).text(_annotations[i].user.lastName)).attr("title",_annotations[i].user.lastName)
										).append(
											eu.td().append(eu.div().width(_listWidth*0.2).text(anno_content)).attr("title",anno_content)
										);
									_tbody.append(tr);
									tr.bind("click",{"anno":_annotations[i]},_showannotation);
								}
							}
							
		    			}

		    			function _showannotation (e) {
		    				// body...
		    				var annobean = e.data.anno,
		    				annoClass = annobean?dv_anno_class_list[annobean.acid]:null;
		    				if(annoClass){
		    					annoClass.open();
		    				}
		    				
		    			}
		    			/**
		    			 * [highlightData 楂樹寒琛ㄦ牸涓変腑刟nnotation锛岀敱浜庡浘囩annotation変腑庯琛ㄦ牸涔熼瑕佸姝ラ浜搴旂annotation琛岋互愪姝ゅ叕辨柟娉昡
		    			 * @param  {[type]} acid [annotaion勫敮涓d]
		    			 * @return {[type]}      [description]
		    			 */
		    			this.highlightData = function(acid){

		    			}
		    			this.initData = function(){
		    				_getData();
		    				_that.updData();
		    			}
		    			this.getElement = function(){
		    				return _element;
		    			}
		    			this.getTable = function(){
		    				return _table ;
		    			}
		    			this.getTbody = function(){
		    				return _tbody ;
		    			}
		    			this.getSortIndex = function(){
		    				return _sortIndex ;
		    			}
		    			this.setSortIndex = function(index){
		    				_sortIndex = index ;
		    			}
		    			this.setSort = function(sort){
		    				_sort =  sort ;
		    			}
		    			this.getSort = function() {
		    				return _sort ;
		    			}
		    			this.getSortKey = function(){
		    				return _sortKey ;
		    			}
		    			this.getData = function(){
		    				_getData() ;
		    				return this ;
		    			}
		    			this.setData = function(annolist){
		    				_annotations = annolist;
		    			}
		    			function _getData(){
		    				//DVUtil.callJSON(url,param);
		    				
		    				if(dv_brand==BRAND){
	    			 			_annotations = dv_annotations;
	    			 		}else if(dv_brand==BRAND_COMPARE){
	    			 			_annotations = _isCompTop?dv_annotations1:dv_annotations2;
	    			 		}else if(dv_brand==BRAND_VIDEO){

	    			 		}
							
		    			}
		    			this.init();
		    		}

			    	DVApprovalListClass = function(isCompTop){
			    		DVTableListClass.prototype.constructor.call(this);
			    		var _that = this,_element ,_table,_thead,_tbody,_listWidth = _dvMain_layout.width()*0.2 > 400 ? _dvMain_layout.width()*0.2 : 400 ,	
				    	_sort = true ,_sortIndex = -1 ,_isCompTop = isCompTop,_approvals;
			    		
		    			this.createElement = function(){
		    				// dv_approvals公共参数获取approval list data
		    				_table = eu.table("table table-bordered table-hover table-striped",null,{"background-color":"#FFFFFF"});
		    				_thead = eu.thead();
		    				_tbody = eu.tbody();
		    				_thead.append(
		    					eu.tr().append(
		    						eu.th().append(eu.div().width(_listWidth*0.2).append("{0_M_J_Approval_Date}")).css({"padding":"0px"}).click(function(){
		    							var sortIndex = _that.getTable().find("th").index($(this)) ;
		    							$(this).parent().find("span").remove();
		    							var sort = _that.getSort() ;
		    							if(_that.getSortIndex() == sortIndex){
		    								if(sort != true){
		    									$(this).append(eu.span("glyphicon glyphicon-arrow-up").attr("aria-hidden","true"))
		    									_that.sortDate(sortIndex,true);
		    								}else{
		    									$(this).append(eu.span("glyphicon glyphicon-arrow-down").attr("aria-hidden","true"))
		    									_that.sortDate(sortIndex,false);
		    								}
		    							}else{
		    								$(this).append(eu.span("glyphicon glyphicon-arrow-up").attr("aria-hidden","true"))
		    								_that.sortDate(sortIndex,true);
		    							}
		    						})	
			    				).append(
			    					eu.th().append(eu.div().width(_listWidth*0.1).text("{0_M_J_Approval_Type}")).css({"padding":"0px"}).click(function(){
			    						var sortIndex = _that.getTable().find("th").index($(this)) ;
		    							$(this).parent().find("span").remove();
		    							var sort = _that.getSort() ;
		    							if(_that.getSortIndex() == sortIndex){
		    								if(sort != true){
		    									$(this).append(eu.span("glyphicon glyphicon-arrow-up").attr("aria-hidden","true"))
		    									_that.sortDate(sortIndex,true);
		    								}else{
		    									$(this).append(eu.span("glyphicon glyphicon-arrow-down").attr("aria-hidden","true"))
		    									_that.sortDate(sortIndex,false);
		    								}
		    							}else{
		    								$(this).append(eu.span("glyphicon glyphicon-arrow-up").attr("aria-hidden","true"))
		    								_that.sortDate(sortIndex,true);
		    							}
		    						})	
			    				).append(
			    					eu.th().append(eu.div().width(_listWidth*0.2).text("{0_M_J_Firstname}")).css({"padding":"0px"}).click(function(){
			    						var sortIndex = _that.getTable().find("th").index($(this)) ;
		    							$(this).parent().find("span").remove();
		    							var sort = _that.getSort() ;
		    							if(_that.getSortIndex() == sortIndex){
		    								if(sort != true){
		    									$(this).append(eu.span("glyphicon glyphicon-arrow-up").attr("aria-hidden","true"))
		    									_that.sortDate(sortIndex,true);
		    								}else{
		    									$(this).append(eu.span("glyphicon glyphicon-arrow-down").attr("aria-hidden","true"))
		    									_that.sortDate(sortIndex,false);
		    								}
		    							}else{
		    								$(this).append(eu.span("glyphicon glyphicon-arrow-up").attr("aria-hidden","true"))
		    								_that.sortDate(sortIndex,true);
		    							}
		    						})		
			    				).append(
			    					eu.th().append(eu.div().width(_listWidth*0.2).text("{0_M_J_Lastname}")).css({"padding":"0px"}).click(function(){
			    						var sortIndex = _that.getTable().find("th").index($(this)) ;
		    							$(this).parent().find("span").remove();
		    							var sort = _that.getSort() ;
		    							if(_that.getSortIndex() == sortIndex){
		    								if(sort != true){
		    									$(this).append(eu.span("glyphicon glyphicon-arrow-up").attr("aria-hidden","true"))
		    									_that.sortDate(sortIndex,true);
		    								}else{
		    									$(this).append(eu.span("glyphicon glyphicon-arrow-down").attr("aria-hidden","true"))
		    									_that.sortDate(sortIndex,false);
		    								}
		    							}else{
		    								$(this).append(eu.span("glyphicon glyphicon-arrow-up").attr("aria-hidden","true"))
		    								_that.sortDate(sortIndex,true);
		    							}
		    						})
			    				).append(
			    					eu.th().append(eu.div().width(_listWidth*0.2).text("{0_M_J_Approval_Comment}")).css({"padding":"0px"}).click(function(){
			    						var sortIndex = _that.getTable().find("th").index($(this)) ;
		    							$(this).parent().find("span").remove();
		    							var sort = _that.getSort() ;
		    							if(_that.getSortIndex() == sortIndex){
		    								if(sort != true){
		    									$(this).append(eu.span("glyphicon glyphicon-arrow-up").attr("aria-hidden","true"))
		    									_that.sortDate(sortIndex,true);
		    								}else{
		    									$(this).append(eu.span("glyphicon glyphicon-arrow-down").attr("aria-hidden","true"))
		    									_that.sortDate(sortIndex,false);
		    								}
		    							}else{
		    								$(this).append(eu.span("glyphicon glyphicon-arrow-up").attr("aria-hidden","true"))
		    								_that.sortDate(sortIndex,true);
		    							}
		    						})	
			    				)
		    				)
		    				_table.append(_thead).append(_tbody);
		    				_element = eu.div();
		    				_element.append(_table);
		    				return _element;
		    				
		    			}
		    			this.initData = function(){
		    				_getData();
		    				_that.updData();
		    			}
		    			this.getElement = function(){
		    				return _element;
		    			}
		    			this.getTable = function(){
		    				return _table ;
		    			}
		    			this.getTbody = function(){
		    				return _tbody ;
		    			}
		    			this.getSortIndex = function(){
		    				return _sortIndex ;
		    			}
		    			this.setSortIndex = function(index){
		    				_sortIndex = index ;
		    			}
		    			this.setSort = function(sort){
		    				_sort =  sort ;
		    			}
		    			this.getSort = function() {
		    				return _sort ;
		    			}
		    			this.getSortKey = function(){
		    				return _sortKey ;
		    			}
		    			
		    			this.sortDate = function(sortIndex,sort){
		    				_sortIndex = sortIndex ;
		    				_sort = sort ;
		    				var trs = _that.getTbody().find("tr");
		    				var rowArr = new Array(trs.length);
		    				trs.each(function(i){
		    					rowArr[i] = trs.eq(i);
		    				})
	    					if(sort == true){
	    						rowArr.sort(function(row1,row2){
	    							var value1 = row1.find("td").eq(sortIndex).text();
	    							var value2 = row2.find("td").eq(sortIndex).text();
	    							return _compare(value1, value2);
	    						})
	    					}else{
	    						rowArr.reverse();
	    					}
		    				_that.getTbody().empty();
		    				for(var i = 0 ; i < rowArr.length ; i++ ){
		    					_that.getTbody().append(rowArr[i]);
		    				}
		    			}
		    			
		    			this.initData = function(){
		    				_that.updData();
		    			}
		    			
		    			this.setData = function(annolist){
		    				_approvals = annolist;
		    			}
		    			
		    			this.updData = function(page){
		    				_tbody.empty();
		    				if(_approvals == null) return ;
							for(var i=0 ; i < _approvals.length ; i++){
								if(page == null || page == _approvals[i].page){
									var anno_content = decodeString(_approvals[i].message),
									tr = eu.tr()
										.append(
											eu.td().append(eu.div().width(_listWidth*0.2).text(_approvals[i].timestamp)).attr("title",_approvals[i].timestamp)
										).append(
											eu.td().append(eu.div().width(_listWidth*0.1).text(_approvals[i].type)).attr("title",_approvals[i].type)
										).append(
											eu.td().append(eu.div().width(_listWidth*0.1).text(_approvals[i].user.firstName)).attr("title",_approvals[i].user.firstName)
										).append(
											eu.td().append(eu.div().width(_listWidth*0.2).text(_approvals[i].user.lastName)).attr("title",_approvals[i].user.lastName)
										).append(
											eu.td().append(eu.div().width(_listWidth*0.2).text(anno_content)).attr("title",anno_content)
										);
									_tbody.append(tr);
									tr.bind("click",{"anno":_approvals[i]},_showannotation);
								}
							}
		    			}
		    			function _showannotation(){
		    				//
		    			}
		    			this.init();
		    		}

			    	DVChecklistClass = function(){
			    		DVTableListClass.prototype.constructor.call(this);
			    		var _element;
		    			this.createElement = function(){

		    				_element = "checklist table";
		    				return _element;
		    			}
		    			this.getElement = function(){
		    				return _element;
		    			}

		    			this.init();
		    		}

		    		DVUtil.extend(DVTableListClass,DVAnnotationListClass);
					DVUtil.extend(DVTableListClass,DVApprovalListClass);
					DVUtil.extend(DVTableListClass,DVChecklistClass);

		    	})(DVTableList,DVEleUtil);

		    	(function(toolbar,eu){
		    		var _toolbarBtnlist = [],
		    		_navbar_header_div,
		    		_navbar_brand_a,
		    		_navbar_nav_ul,
		    		_navbar_nav_version,
		    		SEP_MIN_W = 105,
		    		ANNO_MIN_W = 105,
		    		COMPARE_MIN_W = 235;

		    		DVToolbarClass = function(){
		    			//private
		    			var _DVBackClass,
		    				_DVCompareTabClass,
			    			_DVSeparateClass,
			    			_DVZoomClass,
			    			_DVZoom100Class,
			    			_DVFitWinClass,
			    			_DVFullScreenClass,
			    			_DVToggleAnnoClass,
			    			_DVToolAnnoClass,
			    			_DVMeasureClass,
			    			_DVDensitometerClass,
			    			_DVPrintClass,
			    			_DVRotateClass,
			    			_DVApprovalClass,
			    			_that = this;

		    			function _setButtonList(){
		    				_toolbarBtnlist = [];

		    				if(DVUtil.chkAction("Back Tool")){
		    					_DVBackClass = new DVBackClass();
		    					_toolbarBtnlist.push(_DVBackClass);
		    				}
		    				

		    				if(DVUtil.chkAction("Compare Mode")){
		    					_DVCompareTabClass = new DVCompareTabClass();
		    					_toolbarBtnlist.push(_DVCompareTabClass);
		    				}


		    				if(DVUtil.chkAction("Color Separation")){
		    					_DVSeparateClass = new DVSeparateClass();
		    					_toolbarBtnlist.push(_DVSeparateClass);
		    				}
		    				
		    				_DVRotateClass = new DVRotateClass();
		    				_toolbarBtnlist.push(_DVRotateClass);

		    				if(DVUtil.chkAction("Zoom in (rectangle)")){
		    					_DVZoomClass = new DVZoomClass();  			
		    					_toolbarBtnlist.push(_DVZoomClass);

		    					if(dv_brand==BRAND){
		    						_DVZoom100Class = new DVZoom100Class();
		    						_toolbarBtnlist.push(_DVZoom100Class);
		    					}
		    					
		    				}

		    				if(DVUtil.chkAction("Fit to Screen")){
		    					_DVFitWinClass = new DVFitWinClass();
		    					_toolbarBtnlist.push(_DVFitWinClass);
		    				}

		    				if(DVUtil.chkAction("Full Screen")){
		    					_DVFullScreenClass = new DVFullScreenClass();
		    					_toolbarBtnlist.push(_DVFullScreenClass);
		    				}

		    				if(DVUtil.chkAction("Toggle Annotation")){
		    					_DVToggleAnnoClass = new DVToggleAnnoClass();
		    					_toolbarBtnlist.push(_DVToggleAnnoClass);
		    				}

		    				if(DVUtil.chkAction("Post it Note")){
		    					_DVToolAnnoClass = new DVToolAnnoClass();
		    					_toolbarBtnlist.push(_DVToolAnnoClass);
		    				}

		    				if(DVUtil.chkAction("Measurement")){
		    					_DVMeasureClass = new DVMeasureClass()
		    					_toolbarBtnlist.push(_DVMeasureClass);
		    				}

		    				if(DVUtil.chkAction("Color densitometer")){
		    					_DVDensitometerClass = new DVDensitometerClass()
		    					_toolbarBtnlist.push(_DVDensitometerClass);
		    				}

		    				if(DVUtil.chkAction("Print")){
		    					_DVPrintClass = new DVPrintClass()
		    					_toolbarBtnlist.push(_DVPrintClass);
		    				}

		    				if(DVUtil.chkAction("Approval")){
		    					_DVApprovalClass = new DVToolApprovalClass()
		    					_toolbarBtnlist.push(_DVApprovalClass);
		    				}
		    				
		    			}




		    			//public
		    			this.refresh = function(){
		    				for(var i=0;i<_toolbarBtnlist.length;i++){
		    					_toolbarBtnlist[i].refresh();
		    				}
		    			}

		    			this.init = function(){
		    				_setButtonList();

		    				_dvToolbar.empty();
		    				//brand
		    				_navbar_header_div = eu.div("navbar-header");
		    				_navbar_brand_a = eu.a("navbar-brand").text(dv_brand);
		    				_navbar_header_div.append(_navbar_brand_a);
		    				_dvToolbar.append(_navbar_header_div);


		    				//buttons
		    				_navbar_nav_ul = eu.ul("nav navbar-nav");		    				
		    				for(var i=0;i<_toolbarBtnlist.length;i++){
		    					_toolbarBtnlist[i].init();
		    				}
		    				_dvToolbar.append(_navbar_nav_ul);

		    				//version
		    				_navbar_nav_version = eu.div("navbar-right navbar-brand",null);
		    				_navbar_nav_version.text(VERSION);
		    				_dvToolbar.append(_navbar_nav_version);
		    				// _that.updLayout();
		    			}

		    			this.updLayout = function(){
		    				var w = _dvToolbar.width(),
		    				bw = _navbar_header_div.width()+20,
		    				vw = _navbar_nav_version.width()+30,
		    				btn_len = _toolbarBtnlist.length,
		    				w1 = w - bw - vw,
		    				fit_w_eles = _dvToolbar.find("li[fit-width=true]"),
		    				btnw = w1 / btn_len;
		    				if(fit_w_eles.length>0){
		    					var eles_w = 0;
		    					for(var i=0;i<fit_w_eles.length;i++){
		    						eles_w += fit_w_eles[i].clientWidth;
		    					}
		    					btnw = (w1-eles_w) / (btn_len-fit_w_eles.length);

		    				}

		    				for(var i=0;i<_toolbarBtnlist.length;i++){
		    					if(_DVSeparateClass&&_DVSeparateClass==_toolbarBtnlist[i]){

		    					}else if(_DVCompareTabClass&&_DVCompareTabClass==_toolbarBtnlist[i]){

		    					}else{
		    						_toolbarBtnlist[i].getElement().css({"width":btnw+"px","text-align":"center"});
		    					}
		    					
		    				}

		    			}

		    			this.removeAllBtnsActive = function(){
		    				for(var i=0;i<_toolbarBtnlist.length;i++){
		    					_toolbarBtnlist[i].isActive = false;
		    					_toolbarBtnlist[i].getElement().removeClass("active");
		    				}
		    			}

		    			this.removeAllBtnsActiveExcept = function(exceptBtn){
		    				for(var i=0;i<_toolbarBtnlist.length;i++){
		    					if(exceptBtn!=_toolbarBtnlist[i]){
		    						_toolbarBtnlist[i].isActive = false;
		    						_toolbarBtnlist[i].getElement().removeClass("active");
		    					}
		    					
		    				}
		    			}

		    			this.getToolbarBtnClass = function(classConstructor){
		    				for(var i=0;i<_toolbarBtnlist.length;i++){
		    					if(classConstructor==_toolbarBtnlist[i]){
		    						return _toolbarBtnlist[i];
		    					}
		    				}
		    				return null;
		    			}

		    			this.getNavbar = function(){
		    				return _dvToolbar;
		    			}

		    			this.getNavBrand = function(){
		    				return _navbar_header_div;
		    			}

		    			this.getNavVersion = function(){
		    				return _navbar_nav_version;
		    			}

		    			this.getButtonList = function(){
		    				return _toolbarBtnlist;
		    			}

		    			this.getDVBack = function(){
		    				return _DVBackClass;
		    			}

		    			this.getDVSeparate = function(){
		    				return _DVSeparateClass;
		    			}

		    			this.getDVZoom = function(){
		    				return _DVZoomClass;
		    			}

		    			this.getDVZoom100 = function(){
		    				return _DVZoom100Class;
		    			}

		    			this.getDVFitWin = function(){
		    				return _DVFitWinClass;
		    			}

		    			this.getDVFullScreen = function(){
		    				return _DVFullScreenClass;
		    			}

		    			this.getDVToggleAnno = function(){
		    				return _DVToggleAnnoClass;
		    			}

		    			this.getDVToolAnno = function(){
		    				return _DVToolAnnoClass;
		    			}

		    			this.getDVMeasure = function(){
		    				return _DVMeasureClass;
		    			}

		    			this.getDVDensitometer = function(){
		    				return _DVDensitometerClass;
		    			}

		    			this.getDVPrint = function(){
		    				return _DVPrintClass;
		    			}

		    			this.getDVRotate = function(){
		    				return _DVRotateClass;
		    			}
		    			this.getDVCompareTab = function(){
		    				return _DVCompareTabClass;
		    			}

		    			this.init();
		    		}

		    		DVToolBtnClass = function(){
		    			var _that = this,
		    			_element,
		    			_a,_img;

		    			this.btnICON = "";
		    			this.isActive = false;

		    			this.init = function(){
		    				_element = _that.createElement();
		    				_navbar_nav_ul.append(_element);
		    				_that.initEvents();
		    			}

		    			this.getElement = function(){
		    				return _element;
		    			}
		    			this.setElement = function(ele){
		    				_element = ele;
		    			}

		    			this.refresh = function(){

		    			}

		    			this.hide = function(){
		    				_element.hide();
		    				DVToolbar.Toolbar.updLayout();
		    			}

		    			this.show = function(){
		    				_element.show();
		    				DVToolbar.Toolbar.updLayout();
		    			}

		    			this.createElement = function(){
			    			_element = eu.li();
			    			_a = eu.a();
			    			_img = eu.img(null,{"src":this.btnICON});
			    			_a.append(_img);
			    			_element.append(_a);
			    			return _element;
			    		}

		    			this.initEvents = function(){}
		    			
		    		}

		    		DVCompareTabClass = function(){
		    			DVToolBtnClass.prototype.constructor.call(this);
		    			var _that = this,
		    			_compareView = dv_user_preference.compare_view==1?true:false,_element,_toolBtnLink,_toolBtnImg,
		    			_radioBtn1,_radioBtn2,_radioBen3,_btnLabel1,_btnLabel2,_label1,_label2,_label3,
		    			_compare1,
		    			_compare2,
		    			_compare3,
		    			_compare1_parent,
		    			_compare2_parent,
		    			_compare3_parent,
		    			_pageNav;
		    			
		    			this.initElement = function(compare1,compare2,compare3){
		    				_compare1 = compare1;
			    			_compare2 = compare2;
			    			_compare3 = compare3;
			    			_compare1_parent = compare1.parent();
			    			_compare2_parent = compare2.parent();
			    			_compare3_parent = compare3.parent();
			    			_pageNav = DVPageNavigate.pageNav;
			    			_drawElement(_element);
			    			_initEvents();
		    			}

		    			this.createElement = function(){
			    			_element = _compareView?eu.li(null,{"fit-width":"true"},{"width":COMPARE_MIN_W+"px"}):eu.li();
			    			
			    			return _element;
			    		}

			    		function _drawElement(element){
			    			element.empty();
			    			_toolBtnLink = eu.a();
			    			dv_compare_mode = _compareView?1:0,
			    			_compareClassName_add = !_compareView?"dvCanvasStadCompare":"dvCanvasTabCompare",
			    			_compareClassName_remove = _compareView?"dvCanvasStadCompare":"dvCanvasTabCompare";

			    			_compare1_parent.addClass(_compareClassName_add).removeClass(_compareClassName_remove);
		    				_compare2_parent.addClass(_compareClassName_add).removeClass(_compareClassName_remove);
		    				_compare3_parent.addClass(_compareClassName_add).removeClass(_compareClassName_remove);

			    			if(_compareView){
			    				_that.btnICON = ICON_COMPARE_STD;
			    				_element.attr({"fit-width":"true"}).css({"width":COMPARE_MIN_W+"px"});

			    				_compare1_parent.css({"z-index":1});
			    				_compare2_parent.css({"z-index":0});
			    				_compare3_parent.css({"z-index":0});
			    				dv_current_num = [1];
			    				_pageNav.showSinglePanel(1);
			    			}else{
			    				_that.btnICON = ICON_COMPARE_TAB;
			    				_element.attr({"fit-width":"false"}).css({"width":"{0_M_J_Dialog_Auto}"});

			    				_compare1.show();
			    				_compare2.show();
			    				_compare3.show();
			    				dv_current_num = [1,2,3];
			    				_pageNav.showDoublePanels();			    				
			    			}
			    			DVPageNavigate.pageNav.fitSize();
			    			_toolBtnImg = eu.img(null,{"src":_that.btnICON});
			    			_toolBtnLink.append(_toolBtnImg);
			    			element.append(_toolBtnLink);
			    			if(_compareView){
				    			var _btnGroup;
				    			_btnGroup = eu.div("btn-group",{"data-toggle":"buttons"},{"margin-left":"5px"});
				    			_label1 = eu.label("btn btn-default active",null,{"padding":"1px 12px"});
				    			_radioBtn1 = eu.input(null,{"type":"radio","name":"tabModeBtns","id":"dvtab1","autocomplete":"off","checked":"checked"});
				    			_btnLabel1 = eu.div().text("c 1");
				    			_label2 = eu.label("btn btn-default",null,{"padding":"1px 12px"});
				    			_radioBtn2 = eu.input(null,{"type":"radio","name":"tabModeBtns","id":"dvtab2","autocomplete":"off"});
				    			_btnLabel2 = eu.div().text("c 2");
				    			_label3 = eu.label("btn btn-default",null,{"padding":"1px 12px"});
				    			_radioBen3 = eu.input(null,{"type":"radio","name":"tabModeBtns","id":"dvtab3","autocomplete":"off"});
				    			_label1.append(_radioBtn1).append(_btnLabel1);
				    			_label2.append(_radioBtn2).append(_btnLabel2);
				    			_label3.append(_radioBen3).append(eu.img(null,{"src":ICON_COMPARE_BTN},{"max-width":"18px","max-height":"18px"}));			    			
				    			_btnGroup.append(_label1).append(_label2).append(_label3);
				    			_toolBtnLink.append(_btnGroup);
				    		}
			    		}

			    		function _initEvents(){
			    			var _bounds;
			    			_toolBtnImg.bind("click",{},_toolBtnImgClickEvent);		 			
			    			if(_compareView){
			    				_label1.bind("click",{},_radioBtn1ClickEvent);
				    			_label2.bind("click",{},_radioBtn2ClickEvent);
				    			_label3.bind("click",{},_radioBtn3ClickEvent);
			    			}

			    			function _toolBtnImgClickEvent(e){
			    				// _element.append("aaa");
			    				// _element.remove()
			    				DVUtil.log("compare");
			    				_compareView = !_compareView;
			    				_drawElement(_element);
			    				// _that.initEvents();
			    				_initEvents();
			    				DVToolbar.Toolbar.updLayout();
			    				
			    				DVAnnotation.update();
			    			}
			    			function _getFitBounds(){
			    				if(_compare1.css("display")!="none"){
			    					return (dv_viewer1&&dv_viewer1.viewport)?dv_viewer1.viewport.getBounds():null;
			    				}else{
			    					return (dv_viewer2&&dv_viewer2.viewport)?dv_viewer2.viewport.getBounds():null;
			    				}
			    			}

			    			function _radioBtn1ClickEvent(e){
			    				_bounds = _getFitBounds();			    								
			    				_compare1_parent.css({"z-index":"1"});			    				
			    				_compare2_parent.css({"z-index":"0"});
			    				_compare3_parent.css({"z-index":"0"});
			    				dv_current_num = [1];
			    				_pageNav.showSinglePanel(1);
			    				(dv_viewer1.viewport&&_bounds)?dv_viewer1.viewport.fitBounds(_bounds,true):null;
			    				DVUtil.log("radio 1");
			    				DVAnnotation.update();
			    			}
			    			function _radioBtn2ClickEvent(e){
			    				_bounds = _getFitBounds();			    				
			    				_compare1_parent.css({"z-index":"0"});
			    				_compare2_parent.css({"z-index":"1"});		    				
			    				_compare3_parent.css({"z-index":"0"});
			    				dv_current_num = [2];
			    				_pageNav.showSinglePanel(2);
			    				(dv_viewer2.viewport&&_bounds)?dv_viewer2.viewport.fitBounds(_bounds,true):null;
			    				DVUtil.log("radio 2");
			    				DVAnnotation.update();
			    			}
			    			function _radioBtn3ClickEvent(e){
			    				_compare1_parent.css({"z-index":"0"});
			    				_compare2_parent.css({"z-index":"0"});
			    				_compare3_parent.css({"z-index":"1"});
			    				dv_current_num = [3];
			    				_pageNav.showSinglePanel(3);
			    			}
			    		}
		    		}

			    	DVSeparateClass = function(){
			    		DVToolBtnClass.prototype.constructor.call(this);
			    		var _that = this,
			    		_dropUL,
			    		_dropdownChoice,
			    		_selBean;
			    		// this.btnICON = ICON_DENSTIOMETER;
			    		this.createElement = function(){
			    			_toolbtn = eu.li("dropdown",{"fit-width":"true"},{"min-width":SEP_MIN_W+"px"});
			    			_a = eu.a("dropdown-toggle",{"data-toggle":"dropdown"});
			    			_span = eu.span("caret");	
			    			_dropdownChoice = eu.span(null,null,{"margin":"0 15px"}).text("All");    			
			    			_a.append(_dropdownChoice).append(_span);
			    			_toolbtn.append(_a);
			    			_dropUL = eu.ul("dropdown-menu",{"role":"menu"});
			    			
			    			
			    			_toolbtn.append(_dropUL);
			    			_that.updDropdown();
			    			return _toolbtn;
			    		}

			    		this.updDropdown = function(){
			    			var seprationArray = [{"label":"All","data":"All"},
			    								{"label":"Cyan","data":"Cyan"},
			    								{"label":"Yellow","data":"Yellow"},
			    								{"label":"Magenta","data":"Magenta"},
			    								{"label":"Black","data":"Black"}],
			    				page = 1;
			    			if(dv_brand==BRAND){
			    				page = dv_page.page1;
			    			}else if(dv_brand==BRAND_COMPARE){
			    				page = dv_page2.page1;
			    			}
			    			function _success(data){
			    				var extendSepration = data,//dv_brand==BRAND ? dv_page_info.separation : dv_page_info2.separation,
				    			extendSeprationArray = extendSepration?extendSepration.split(","):null;
				    			if(extendSeprationArray){
				    				for(var i=0;i<extendSeprationArray.length;i++){
					    				if(extendSeprationArray[i]!="cmyk"){
					    					seprationArray.push({"label":extendSeprationArray[i],"data":"s"+(i-1)})
					    				}
					    			}
				    			}
				    			_upd();
				    			
								
			    			}
			    			function _fail(){
			    				_upd();
			    			}
			    			function _upd(){
			    				_dropUL.empty();
				    			for(var i=0;i<seprationArray.length;i++){
				    				var _link = eu.a().text(seprationArray[i].label);
				    				_dropUL.append(
					    				eu.li().append(
							    				_link
							    			)
					    			);
					    			_link.bind("click",{"bean":seprationArray[i]},_linkClickEvent);
				    			}
				    			
				    			function _linkClickEvent(e){
				    				var bean = _selBean = e.data.bean;
				    				_dropdownChoice.text(bean.label);
				    				DVToolbar.Toolbar.updLayout();
				    				_openView();
				    			}
			    			}
			    			DVUtil.callJSON("separation.davinci",{"sessionid":PUBLIC_CONFIGS.session_id,"dataType":DATA_TYPE,"page":page},null,_success,_fail);
			    			

			    			
			    		}

			    		this.getSelectedBean = function(){
			    			return _selBean;
			    		}

			    		function _openView(){
			    			var bean = _selBean,
			    				_url,_url_comp;
			    			if(dv_brand==BRAND){		    					
		    					dv_canvas.openViewer();
		    				}else{
		    					dv_canvas_compare.openViewer1();
		    					dv_canvas_compare.openViewer2();
		    					dv_canvas_compare.resetCanvasURL();
		    				}
			    		}
		    		}

			    	DVRotateClass = function(){
			    		DVToolBtnClass.prototype.constructor.call(this);
			    		var _that = this;
			    		this.btnICON = ICON_ROTATE,
			    		ROTATION = 90;
			    		function _clickEvent(e){
			    			
			    			/*if(dv_brand==BRAND){
			    				var _viewport = dv_viewer.viewport,
			    				_rotation = _viewport.getRotation();
			    				dv_viewer.viewport.setRotation(_rotation+ROTATION);
			    				dv_viewer_page.viewport?dv_viewer_page.viewport.setRotation(_rotation+ROTATION):"";
			    			}else if(dv_brand==BRAND_COMPARE){
			    				var _viewport1 = dv_viewer1.viewport,
			    				_rotation1 = _viewport1.getRotation(),
			    				_viewport2 = dv_viewer2.viewport,
			    				_rotation2 = _viewport2.getRotation();

			    				dv_viewer1.viewport.setRotation(_rotation1+ROTATION);
			    				dv_viewer2.viewport.setRotation(_rotation2+ROTATION);
			    				dv_viewer_page.viewport.setRotation(_rotation+ROTATION);
			    			}*/

			    		}

			    		this.initEvents = function(){
			    			_that.getElement().bind("click",{},_clickEvent)
			    		}
		    		}

			    	DVZoomClass = function(){
			    		DVToolBtnClass.prototype.constructor.call(this);
			    		var _that = this;
			    		_that.isActive = false;
			    		this.btnICON = ICON_ZOOM;
			    		function _clickEvent(e){
			    			_that.isActive = !_that.isActive;
			    			if(_that.isActive){
			    				DVToolbar.Toolbar.removeAllBtnsActiveExcept(_that);
			    				_that.getElement().addClass("active");
			    				dv_toolbar_action = TOOL_ZOOM;
			    			}else{
			    				_that.cancel();
			    			}    			

			    		}

			    		this.cancel = function(){
			    			_that.isActive = false;
			    			_that.getElement().removeClass("active");
			    			dv_toolbar_action = TOOL_NONE;
			    		}

			    		this.initEvents = function(){
			    			_that.getElement().bind("click",{},_clickEvent)
			    		}
		    		}

			    	DVZoom100Class = function(){
			    		DVToolBtnClass.prototype.constructor.call(this);
			    		var _that = this;
			    		_that.isActive = false;
			    		this.btnICON = ICON_ZOOM100;
			    		function _clickEvent(e){
			    			_that.isActive = !_that.isActive;
			    			if(_that.isActive){
			    				var ow,oh,w,h,
			    				pagePanel,zoom=1;
			    				// DVToolbar.Toolbar.removeAllBtnsActive();
			    				_that.getElement().addClass("active");
			    				if(dv_brand==BRAND){
			    					pagePanel = DVPageNavigate.pageNav.getPanel();
			    					if(pagePanel.isSinglePreview()){
			    						ow = dv_page_info.originalWidthPx;
			    						oh = dv_page_info.originalHeightPx;
			    						w = dv_viewer.drawer.canvas.width;
			    						h = dv_viewer.drawer.canvas.height;
			    						if(ow>oh){
			    							zoom = oh/h;
			    						}else{
			    							zoom = ow/w;
			    						}
			    						dv_viewer.viewport.zoomTo(zoom);
			    						// dv_viewer.setMouseNavEnabled(false);
			    						// dv_toolbar_action = TOOL_ZOOM100;
			    						dv_viewer.viewport.maxZoomLevel=zoom;
			    						dv_viewer.viewport.minZoomLevel=zoom;
			    						dv_viewer.viewport.defaultZoomLevel = zoom;
    
			    					}
				    				
				    			}
			    			}else{
			    				_that.getElement().removeClass("active");
			    				// dv_viewer.setMouseNavEnabled(true);
			    				dv_toolbar_action = TOOL_NONE;
			    				dv_viewer.viewport.maxZoomLevel=13;
	    						dv_viewer.viewport.minZoomLevel=1;
	    						dv_viewer.viewport.defaultZoomLevel = 0;
			    			}
			    			

			    		}

			    		this.initEvents = function(){
			    			_that.getElement().bind("click",{},_clickEvent)
			    		}
		    		}
			    	
			    	DVFitWinClass = function(){
			    		DVToolBtnClass.prototype.constructor.call(this);
			    		var _that = this;
			    		this.btnICON = ICON_FITTO_WINDOW;
			    		function _clickEvent(e){
			    			
			    			if(dv_brand==BRAND){
			    				dv_viewer.viewport.goHome();
			    			}else if(dv_brand==BRAND_COMPARE){
			    				dv_viewer1.viewport.goHome();
			    				dv_viewer2.viewport.goHome();
			    			}

			    		}

			    		this.initEvents = function(){
			    			_that.getElement().bind("click",{},_clickEvent)
			    		}

		    		}

			    	DVFullScreenClass = function(){
			    		DVToolBtnClass.prototype.constructor.call(this);
			    		var _that = this;
			    		this.btnICON = ICON_FULLSCREEN;
			    		var isFullScreen = false;
			    		function _clickEvent(e){
			    			isFullScreen = !isFullScreen;
			    			if(dv_brand==BRAND){
			    				// dv_viewer.setFullPage(isFullScreen);
			    				// dv_viewer.setMouseNavEnabled(isFullScreen);
			    				dv_viewer.drawer.context.putImageData(dv_image_data, 0, 0);
			    			}

			    		}

			    		this.initEvents = function(){
			    			_that.getElement().bind("click",{},_clickEvent)
			    		}
		    		}

			    	DVToggleAnnoClass = function(){
			    		DVToolBtnClass.prototype.constructor.call(this);
			    		var _that = this;
			    		this.btnICON = ICON_TOGGLEANNO,
			    		_isshow = false;
			    		function _clickEvent(e){
			    			var annolist = [];
			    			if(dv_brand==BRAND){
			    				annolist = dv_annotations;
			    			}else if(dv_brand==BRAND_COMPARE){
							if(dv_current_num.length==1){
								if(dv_current_num[0]==1){
									annolist = dv_annotations1;
								}else if(dv_current_num[0]==2){
									annolist = dv_annotations2;
								}
							}else{
								annolist = $.merge( dv_annotations1, dv_annotations2 );
							}
						}

			    			if(_isshow){
							for(var i=0;i<annolist.length;i++){
								dv_anno_class_list[annolist[i].acid].close();
							}
			    			}else{

							for(var i=0;i<annolist.length;i++){
								dv_anno_class_list[annolist[i].acid].open();
							}
			    			}
			    			_isshow = !_isshow;

			    		}

			    		this.initEvents = function(){
			    			_that.getElement().bind("click",{},_clickEvent)
			    		}
		    		}

			    	DVToolAnnoClass = function(){
			    		DVToolBtnClass.prototype.constructor.call(this);
			    		var _that = this,
			    		_toolbtn,_dropdownDiv,_dropdownValBtn,_dropdownCaretBtn,_dropdownCaret,_dropdownSelImg,
			    		_a,_imgSpan,_img,_span,_dropUL;
			    		_that.isActive = false,
			    		_selFromDropdown = false,
			    		_selectedAnno = TOOL_ANNO;

			    		// this.btnICON = ICON_ZOOM;

			    

			    		_that.normalAnno,
			    		_that._circleAnno,
			    		_that._squareAnno,
			    		_that._freedhandAnno,
			    		_that._arrowAnno;
			    		

			    		this.createElement = function(){
			    			_toolbtn = eu.li(null,{"fit-width":"true"},{"min-width":ANNO_MIN_W+"px"});

			    			_dropdownDiv = eu.div("btn-group");
			    			_dropdownValBtn = eu.button("btn btn-default",{"type":"button"},{"height":"40px"});
			    			_dropdownCaretBtn = eu.button("btn btn-default dropdown-toggle",{
			    				"type":"button",
			    				"data-toggle":"dropdown",
			    				"aria-expanded":"false"
			    			},{"height":"40px"});
			    			_dropdownCaret = eu.span("caret");
			    			_dropdownSelImg = eu.img(null,{"src":ICON_ANNOTATION});
			    			_dropdownDiv.append(_dropdownValBtn).append(_dropdownCaretBtn);
			    			_dropdownCaretBtn.append(_dropdownCaret);
			    			_dropdownValBtn.append(_dropdownSelImg);
			    			_toolbtn.append(_dropdownDiv);
			    			_dropUL = eu.ul("dropdown-menu",{"role":"menu"});

			    		
			    			
			    			function _addAnno2Dropdown(icon){
			    				var annoEle = eu.li()
				    			.append(
				    				eu.a().append(
				    					eu.img(null,{"src":icon})
				    				)
				    			);
				    			_dropUL.append(annoEle);
				    			return annoEle;
			    			}

			    			_that.normalAnno = _addAnno2Dropdown(ICON_ANNOTATION);


			    			if(DVUtil.chkAction("Circle Note")){
			    				_that.circleAnno = _addAnno2Dropdown(ICON_CIRCLE);
			    			}

			    			if(DVUtil.chkAction("Square Note")){
			    				_that.squareAnno = _addAnno2Dropdown(ICON_RECTANGLE);
			    			}

			    			if(DVUtil.chkAction("Freehand Note")){
			    				_that.freedhandAnno = _addAnno2Dropdown(ICON_FREEHAND);
			    			}

			    			if(DVUtil.chkAction("Arrow Note")){
			    				_that.arrowAnno = _addAnno2Dropdown(ICON_ARROW);
			    			}
			    			_dropdownDiv.append(_dropUL);
			    			this.setElement(_toolbtn);
			    			return _toolbtn;
			    		}

			    		this.initEvents = function(){
			    			_that.getElement().bind("click",{},_dropdownClickEvent);
			    			_that.normalAnno?_that.normalAnno.bind("click",{},_normalAnnoClickEvent):null;
			    			_that.circleAnno?_that.circleAnno.bind("click",{},_circleAnnoClickEvent):null;
			    			_that.squareAnno?_that.squareAnno.bind("click",{},_squareAnnoClickEvent):null;
			    			_that.freedhandAnno?_that.freedhandAnno.bind("click",{},_freedhandAnnoClickEvent):null;
			    			_that.arrowAnno?_that.arrowAnno.bind("click",{},_arrowAnnoClickEvent):null;
			    		}

			    		this.cancel = function(){
			    			_that.isActive = false;
			    			_dropdownValBtn.removeClass("active");
			    			dv_toolbar_action = TOOL_NONE;
			    		}

			    		function _dropdownClickEvent(e){
			    			
			    			DVUtil.log("Annotation Click Event.");
			    			_that.isActive = !_that.isActive;
			    			if(_that.isActive||_selFromDropdown){
			    				// DVToolbar.Toolbar.removeAllBtnsActiveExcept(_that);
			    				_that.isActive = true;
			    				_dropdownValBtn.addClass("active");
			    				_selFromDropdown = false;
			    				dv_toolbar_action = _selectedAnno;
			    				DVUtil.log(dv_toolbar_action);
			    				switch(_selectedAnno){
			    					case TOOL_ANNO:
			    						
			    					break;
			    					case TOOL_ANNO_ECLIPSE:
			    						
			    					break;
			    					case TOOL_ANNO_RECT:
			    						
			    					break;
			    					case TOOL_ANNO_FREEHAND:
			    						
			    					break;
			    					case TOOL_ANNO_ARROW:
			    						
			    					break;
			    				}
			    				// dv_toolbar_action = TOOL_ZOOM;
			    			}else{
			    				_that.cancel();
			    			} 
			    		}

			    		function _normalAnnoClickEvent(e){
			    			
			    			DVUtil.log("Normal Annotation Click Event.");
			    			_dropdownValBtn.html(eu.img(null,{"src":ICON_ANNOTATION}));
			    			_selFromDropdown = true;
			    			_selectedAnno = TOOL_ANNO;
			    		}

			    		function _circleAnnoClickEvent(e){
			    			
			    			DVUtil.log("Circle Annotation Click Event.");
			    			_dropdownValBtn.html(eu.img(null,{"src":ICON_CIRCLE}));
			    			_selFromDropdown = true;
			    			_selectedAnno = TOOL_ANNO_ECLIPSE;
			    		}

			    		function _squareAnnoClickEvent(e){
			    			
			    			DVUtil.log("Square Annotation Click Event.");
			    			_dropdownValBtn.html(eu.img(null,{"src":ICON_RECTANGLE}));
			    			_selFromDropdown = true;
			    			_selectedAnno = TOOL_ANNO_RECT;
			    		}

			    		function _freedhandAnnoClickEvent(e){
			    			
			    			DVUtil.log("Freehand Annotation Click Event.");
			    			_dropdownValBtn.html(eu.img(null,{"src":ICON_FREEHAND}));
			    			_selFromDropdown = true;
			    			_selectedAnno = TOOL_ANNO_FREEHAND;
			    		}

			    		function _arrowAnnoClickEvent(e){
			    			
			    			DVUtil.log("Arrow Annotation Click Event.");
			    			_dropdownValBtn.html(eu.img(null,{"src":ICON_ARROW}));
			    			_selFromDropdown = true;
			    			_selectedAnno = TOOL_ANNO_ARROW;
			    		}

		    		}

			    	DVMeasureClass = function(){
			    		DVToolBtnClass.prototype.constructor.call(this);
			    		var _that = this;
			    		this.btnICON = ICON_RULER;
			    		function _clickEvent(e){
			    			var dialog = eu.openDialog("","content","buttons");
			    			dialog.open();
			    		}

			    		this.initEvents = function(){
			    			_that.getElement().bind("click",{},_clickEvent)
			    		}

		    		}

			    	DVDensitometerClass = function(){
			    		DVToolBtnClass.prototype.constructor.call(this);
			    		var _that = this,
			    		_dialog,
			    		$tablelist,
			    		$mouseX,
			    		$mouseY,
			    		$currX,
			    		$currY,
			    		_lan = dvLan.densitometer;

			    		this.btnICON = ICON_DENSTIOMETER;
			    		this.updateDetail = function(x,y){

			    		}
			    		this.updateCor = function(x,y){
							if((_dialog&&_dialog.element)){
								$mouseX.text(Math.round(x>0?x:0));
								$mouseY.text(Math.round(y>0?y:0));
							}
			    		}
			    		function _createBody(){			    			
			    			$mouseX = eu.div("col-sm-3");
			    			$mouseY = eu.div("col-sm-3");
			    			$currX = eu.div("col-sm-3");
			    			$currY = eu.div("col-sm-3");
			    			$tablelist = eu.tbody();
			    			var $body = eu.div("form-horizontal"),
			    			$mouseCorRow = eu.div("form-group").append(
								eu.div("col-sm-4").text(_lan.mouse_coord)
			    			).append(
								eu.div("col-sm-1").text("X")
			    			).append(
								$mouseX
			    			).append(
								eu.div("col-sm-1").text("Y")
			    			).append(
								$mouseY
			    			),
			    			$currentCorRow = eu.div("form-group").append(
								eu.div("col-sm-4").text(_lan.curr_coord)
			    			).append(
								eu.div("col-sm-1").text("X")
			    			).append(
								$currX
			    			).append(
								eu.div("col-sm-1").text("Y")
			    			).append(
								$currY
			    			),
			    			$tableRow = eu.div("form-group").append(
								eu.div("col-sm-12").html(
									eu.table("table table-bordered table-striped").append(
										eu.thead().append(
											eu.th().text(_lan.color)
										).append(
											eu.th().text(_lan.value)
										)
									).append(
										$tablelist
									)
								)
			    			);

			    			$body
			    			.append($mouseCorRow)
			    			.append($currentCorRow)
			    			.append($tableRow);

			    			return $body;
			    			
			    		}
			    		function _clickEvent(e){
			    			//var dialog = eu.openDialog("","content","buttons");
			    			//dialog.open();
			    			if(dv_toolbar_action!=TOOL_DENSITOMETER){
			    				DVToolbar.Toolbar.removeAllBtnsActiveExcept(_that);
			    				_that.getElement().addClass("active");
								dv_toolbar_action = TOOL_DENSITOMETER;
								if(!(_dialog&&_dialog.element)){
									$tablelist = null;
									$mouseX = null;
									$mouseY = null;
									$currX = null;
									$currY = null;
									_dialog = new eu.Dialog({
										id:"DVDensitometer",
										title:"Densitometer",
										width:400,
										height:500,
										body:_createBody(),
										footer:""
									});
									_dialog.init();
									_dialog.element.bind("dialog-close",function(e){										
										_that.getElement().removeClass("active");
			    						dv_toolbar_action = TOOL_NONE;
									})
								}
			    			}else{
			    				_dialog.destroy();
			    				_that.getElement().removeClass("active");
			    				dv_toolbar_action = TOOL_NONE;
			    			}
			    			
			    			
			    			
			    		}
			    		this.initEvents = function(){
			    			_that.getElement().bind("click",{},_clickEvent)
			    		}
		    		}

			    	DVPreferenceClass = function(){
			    		DVToolBtnClass.prototype.constructor.call(this);
			    		var _that = this;
			    		this.btnICON = ICON_PREFERENCES;
			    		
			    		this.initEvents = function(){
			    			_that.getElement().bind("click",{},_clickEvent);
			    		}
			    		
			    		function _clickEvent(e){
			    			var dialog,jq_content = eu.div("dvPreference"),jq_footer = eu.div();dialog = eu.openDialog("preference",jq_content,jq_footer)
			    			var measurement_units_mm,measurementUnits_inches,show_points,annotation_color,draw_color,open_annotation,atCursorHover,zoom_enable,def_anno_font_size,
			    			def_anno_tab_show,disable_spell_check,spell_check_type,compare_view,disable_sync_pages_check,disable_anno_hover_popup,sens_value;
			    			
			    			function _saveBtnClickEvent(e){
			    				$(this).attr("disabled","true");
//error:For input string: "English"			    				
var	action = "w";		    				
var disable_anno_hover_popup = 0;			    				
var sens_value = 0 ;			    				
var user_id = "" ;
var measurement_units = measurementUnits_inches.is(':checked') ? 1 : 0 ;
var annotation_color = "";
var draw_color = "" ;
var compare_view = null;
var user_first_name = "";
			    				DVUtil.callJSON("userpreference.davinci",{
			    					"sessionid":PUBLIC_CONFIGS.session_id,"dataType":DATA_TYPE,"action":action,
			    					"disable_anno_hover_popup":disable_anno_hover_popup,"sens_value":sens_value,"user_id":user_id,
			    					"measurement_units":measurement_units,"annotation_color":annotation_color,"draw_color":draw_color,
			    					"open_annotation":open_annotation.is(':checked') ? 1:0 ,"zoom_enable":zoom_enable.is(':checked') ? 1:0,"def_anno_font_size":def_anno_font_size.val(),
			    					"disable_spell_check":disable_spell_check.is(':checked') ? 1:0,"show_points":show_points.is(':checked') ? 1:0,"spell_check_type":spell_check_type.val(),
			    					"compare_view":compare_view,"def_anno_tab_show":def_anno_tab_show.is(':checked') ? 1:0,"user_first_name":user_first_name
			    				},null,_success,_fail);
		    					function _success(data){
		    						alert(data);
		    						if(data){

		    						}
		    					}
		    					function _fail(data){
		    						alert(data)	
		    					}
		    					
			    			}
			    			
			    			function _cancelBtnClickEvent(e){
			    				dialog.close();
			    			}
			    			function _init(){
			    				measurement_units_mm = eu.input(null,{"type":"radio","name":"units"});
			    				measurementUnits_inches = eu.input(null,{"type":"radio","name":"units"}); 
			    				show_points = eu.input(null,{"type":"checkbox"});
			    				//annotation_color 
			    				//draw_color
			    				open_annotation = eu.input(null,{"type":"checkbox"});
			    				atCursorHover = eu.input(null,{"type":"checkbox"});
			    				def_anno_font_size = eu.select() ;
			    				var def_anno_font_size_small = eu.option("",null,null,"10","{0_M_J_Dialog_Op_Lable_Small}");
			    				var def_anno_font_size_medium = eu.option("",null,null,"13.5","{0_M_J_Dialog_Op_Lable_Medium}");
			    				var def_anno_font_size_large = eu.option("",null,null,"18","{0_M_J_Dialog_Op_Lable_Large}");
			    				def_anno_font_size.append(def_anno_font_size_small).append(def_anno_font_size_medium).append(def_anno_font_size_large);
			    				zoom_enable = eu.input(null,{"type":"checkbox"}) ;
			    				def_anno_tab_show = eu.input(null,{"type":"checkbox"});
			    				disable_spell_check = eu.input(null,{"type":"checkbox"});
			    				spell_check_type = eu.select();
			    				var spell_check_type_english  = eu.option("",null,null,"English","{0_M_J_Dialog_Op_Lable_English}");
			    				var spell_check_type_french  = eu.option("",null,null,"French","{0_M_J_Dialog_Op_Lable_French}");
			    				spell_check_type.append(spell_check_type_english).append(spell_check_type_french);
				    			compare_view = eu.select();
				    			var compare_view_standard  = eu.option("",null,null,"standard","{0_M_J_Dialog_Op_Lable_Standard}");
			    				var compare_view_tab  = eu.option("",null,null,"single","{0_M_J_Dialog_Op_Lable_Tab}");
			    				compare_view.append(compare_view_standard).append(compare_view_tab);
				    			disable_sync_pages_check = eu.input(null,{"type":"checkbox"});
				    			//set check
				    			//dv_user_preference.annotation_color
				    			//dv_user_preference.draw_color
				    			//dv_user_preference.def_anno_font_size
				    			//dv_user_preference.compare_view
				    			//dv_user_preference.spell_check_type
				    			//dv_user_preference.sens_value
				    			//dv_user_preference.disable_anno_hover_popup
				    			if(dv_user_preference.measurement_units==1){measurementUnits_inches.attr("checked","true")};
				    			if(dv_user_preference.open_annotation ==1){open_annotation.attr("checked","true")};
				    			if(dv_user_preference.show_points ==1){show_points.attr("checked","true")};
				    			if(dv_user_preference.zoom_enable ==1){zoom_enable.attr("checked","true")};
				    			if(dv_user_preference.def_anno_tab_show ==1){def_anno_tab_show.attr("checked","true")};
				    			if(dv_user_preference.disable_spell_check ==1){disable_spell_check.attr("checked","true")};
				    			if(dv_user_preference.disable_sync_pages_check ==1){disable_sync_pages_check.attr("checked","true")};
				    			
				    			jq_content.append(
					    			eu.div().append(eu.label().append("{0_M_J_Dialog_Measurement_Units}")).append(measurement_units_mm).append("{0_M_J_Dialog_Measurement_Units_MM}").append(measurementUnits_inches).append("{0_M_J_Dialog_Measurement_Units_Inches}")
					    		)
					    		jq_content.append(
					    			eu.div().append(eu.label().append("{0_M_J_Dialog_Measurement_Show_Points}")).append(show_points)
					    		)
					    		jq_content.append(
					    			eu.div().append(eu.label().append("{0_M_J_Dialog_Annotation_Color}")).append(annotation_color)
					    		)
					    		jq_content.append(
					   				eu.div().append(eu.label().append("{0_M_J_Dialog_Draw_Color}")).append(draw_color)
					   			)
					   			jq_content.append(
				    				eu.div().append(eu.label().append("{0_M_J_Dialog_Open_Annotation}")).append(open_annotation)
				    			)
				    			jq_content.append(
				    				eu.div().append(eu.label().append("{0_M_J_Dialog_AtCursorHover}")).append(atCursorHover)
				    			)
				    			jq_content.append(
				    				eu.div().append(eu.label().append("{0_M_J_Dialog_Def_Anno_Font_Size}")).append(def_anno_font_size)
				    			)
				    			jq_content.append(
				    				eu.div().append(eu.label().append("{0_M_J_Dialog_Zoom_Enable}")).append(zoom_enable)
				    			)
				    			jq_content.append(
				    				eu.div().append(eu.label().append("{0_M_J_Dialog_Def_Anno_Tab_Show}")).append(def_anno_tab_show)
				    			)
				    			jq_content.append(
				    				eu.div().append(eu.label().append("{0_M_J_Dialog_Disable_Spell_Check}")).append(disable_spell_check)
				    			)
				    			jq_content.append(
				    				eu.div().append(eu.label().append("{0_M_J_Dialog_Spell_Check_Type}")).append(spell_check_type)
				    			)
				    			if(dv_brand==BRAND_COMPARE){
					    			jq_content.append(
					    				eu.div().append(eu.label().append("{0_M_J_Dialog_Compare_View}")).append(compare_view)
					    			)
					    			jq_content.append(
					    				eu.div().append(eu.label().append("{0_M_J_Dialog_Disable_Sync_Pages_Check}")).append(disable_sync_pages_check)
					    			)
					    			jq_content.append(
					    				eu.div().append(eu.label().append("{0_M_J_Dialog_Sens_Value}")).append(sens_value)
					    			)
				    			}
				    			var jq_btn_div = eu.div("",{},{"text-align":"center","padding-top":"10px"});
			    				var save_btn = eu.button("btn btn-primary",{},{"margin-left":"10px","margin-right":"10px"}).text("{0_M_J_Dialog_Save}").bind("click",{},_saveBtnClickEvent) ;
			    				var cancel_btn = eu.button("btn btn-primary",{},{"margin-left":"10px","margin-right":"10px"}).text("{0_M_J_Dialog_Cancel_2}").bind("click",{},_cancelBtnClickEvent);
			    				jq_btn_div.append(save_btn).append(cancel_btn);
			    				jq_content.append(jq_btn_div);
				    			dialog.open();
			    			}
			    			
							_init();
			    		}
		    		}

			    	DVPrintClass = function(){
			    		DVToolBtnClass.prototype.constructor.call(this);
			    		var _that = this;
			    		this.btnICON = ICON_PRINT;
			    		
			    		this.initEvents = function(){
			    			_that.getElement().bind("click",{},_clickEvent);
			    		}
			    		
			    		function _clickEvent(e){
			    			var dialog,
			    			jq_content = eu.div("dvPrint"),
			    			jq_footer = eu.div(),
			    			jq_artwork,jq_annotations,jq_summarySheet,jq_numberSize,jq_LineSize ;
			    			
			    			function _init(){
			    				jq_artwork = eu.input(null,{"type":"checkbox"}).attr("checked","true");
				    			jq_annotations = eu.input(null,{"type":"checkbox"}).attr("checked","true");
				    			jq_summarySheet = eu.input(null,{"type":"checkbox"}).attr("checked","true");
				    			jq_numberSize = eu.select();
				    			for(var i =8 ; i<=33;i++){
				    				var op = eu.option("",{},{},i,i);
				    				if(i==12){
				    					op.attr("selected","true");
				    				}
				    				jq_numberSize.append(op);
				    			}
				    			jq_LineSize = eu.select();
				    			jq_LineSize.append(eu.option("",{},{},"","auto"));
				    			for(var i = 1; i<=20;i++){
				    				var op = eu.option("",{},{},i,i);
				    				jq_LineSize.append(op);
				    			}
				    			
				    			var title_div = eu.div("title").append("{0_M_J_Print_Dialog_Title}");
				    			var content_div = eu.div("content");
				    			content_div.append(eu.div().append(eu.label().append("{0_M_J_Print_Artwork}")).append(jq_artwork));
				    			content_div.append(eu.div().append(eu.label().append("{0_M_J_Print_Annotations}")).append(jq_annotations));
				    			content_div.append(eu.div().append(eu.label().append("{0_M_J_Print_SummarySheet}")).append(jq_summarySheet));
				    			content_div.append(eu.div().append(eu.label().append("{0_M_J_Print_AnnotationNumberSize}")).append(jq_numberSize));
				    			content_div.append(eu.div().append(eu.label().append("{0_M_J_Print_AnnotationLineSize}")).append(jq_LineSize));
				    			
				    			var jq_btn_div = eu.div("",{},{"text-align":"center","padding-top":"10px"});
		    					var confirm_btn = eu.button("btn btn-primary",{},{"margin-left":"10px","margin-right":"10px"}).text("{0_M_J_Dialog_Confirm}").bind("click",{},_confirmBtnClickEvent) ;
		    					var cancel_btn = eu.button("btn btn-primary",{},{"margin-left":"10px","margin-right":"10px"}).text("{0_M_J_Dialog_Cancel}").bind("click",{},_cancelBtnClickEvent);
		    					jq_btn_div.append(confirm_btn).append(cancel_btn);
		    					content_div.append(jq_btn_div);
		    					
				    			jq_content.append(title_div).append(content_div);
				    			dialog = eu.openDialog("print",jq_content,jq_footer);
				    			dialog.open();
			    			}
			    			
			    			function _confirmBtnClickEvent(e){
			    				$(this).attr("disabled","true");
//Error: success_jsonpCallback_JSON_337305054305 was not called			    				
var printSel = [jq_artwork.is(':checked'),jq_annotations.is(':checked'),jq_summarySheet.is(':checked')];
var timezoneOffset = 0 ;
var numSize = jq_numberSize.val() ;
var lineSize = jq_LineSize.val();
								DVUtil.callJSON("createpdf.davinci",{"sessionid":PUBLIC_CONFIGS.session_id,"printSel":printSel,"timezoneOffset":timezoneOffset,"numSize":numSize,"lineSize":lineSize},null,_success,_fail);
		    					function _success(data){
		    						alert(data);
		    						if(data){

		    						}
		    					}
		    					function _fail(data){
		    						alert(data)	
		    					}
			    			}
			    			
			    			function _cancelBtnClickEvent(e){
			    				dialog.close();
			    			}
			    			
			    			_init();
			    		}
		    		}

			    	DVBackClass = function(){
			    		DVToolBtnClass.prototype.constructor.call(this);
			    		var _that = this;
			    		this.btnICON = ICON_BACK;
		    		}

			    	DVToolApprovalClass = function(){
			    		DVToolBtnClass.prototype.constructor.call(this);
			    		var _that = this;
			    		this.btnICON = ICON_APPROVAL;
			    		function _clickEvent(e){
			    			var dialog,
			    			jq_content = eu.div(),
			    			jq_footer = eu.div(),
			    			jq_doc_div = eu.div().css({"padding-left":"8px"}),
			    			jq_textarea,jq_rejection_sel;
			    			
			    			function _reset(){
			    				jq_doc_div.empty();
			    				jq_rejection_sel = null ;
			    				jq_textarea = null ;
			    			}
			    			
			    			function _confirmBtnClickEvent(e){
			    				$(this).attr("disabled","true");
//error:can not find the systemid=0 in application when sessionkey=192.168.1.201 Please check the sessionkey is valid and the status is success to define.
var action = "approve";
var apptype = 0 ;			    				
var num = 1 ;
			    				DVUtil.callJSON("approvals.davinci",{"sessionid":PUBLIC_CONFIGS.session_id,"dataType":DATA_TYPE,"action":action,"apptype":apptype,"num":num,"comment":jq_textarea.val(),"rejection":jq_textarea.val()},null,_success,_fail);
		    					function _success(data){
		    						alert(data);
		    						if(data){

		    						}
		    					}
		    					function _fail(data){
		    						alert(data)

		    					}
			    			}
			    			
			    			function _cancelBtnClickEvent(e){
			    				dialog.close();
			    			}
			    			
			    			function _btnClickEvent(e){
			    				_reset();
			    				var comment = e.data.comment ;
			    				var rejection = e.data.rejection ;
			    				var rejectionReasons = e.data.rejectionReasons ;
			    				if(comment == "true"){
			    					var jq_doc_title = eu.div().append("{0_M_J_Approval_Dialog_Enter_Commnet}").css({"text-align":"left","font-weight":"bold","padding-top":"10px","padding-bottom":"20px"});
			    					jq_textarea = eu.textarea().css({"text-align":"left","width":"100%","height":"100px"});
			    					jq_doc_div.append(jq_doc_title);
			    					jq_doc_div.append(jq_textarea);
			    				}
			    				if(rejection == "true"){
			    					var jq_rejection_title_div = eu.div().append("{0_M_J_Approval_Dialog_Rejection_Title}").css({"text-align":"left","font-weight":"bold","padding-top":"10px","padding-bottom":"20px"});
			    					jq_rejection_sel = eu.select("",{},{"width":"500px"}).val("") ;
			    					var jq_rejectionReasons = eu.div().append();
			    					jq_rejection_sel.append(eu.option("",{},{},"","-"));
			    					for(var i = 0 ; i < rejectionReasons.length ; i++){
			    						var description = rejectionReasons[i].description;
			    						var rejId = rejectionReasons[i].rejId ;
			    						var option = eu.option("",{},{},rejId,description);
			    						jq_rejection_sel.append(option);
			    					}
			    					var jq_rejection_sel_div = eu.div().append(jq_rejection_sel).css({"text-align":"left","padding-bottom":"20px"});;
			    					jq_doc_div.append(jq_rejection_title_div).append(jq_rejection_sel_div);
			    				}
			    				if(comment == "true" || rejection == "true"){
			    					var jq_doc_btn_div = eu.div("jq_doc_btn_div",{},{"text-align":"center","padding-top":"10px"});
			    					var confirm_btn = eu.button("btn btn-primary",{},{"margin-left":"10px","margin-right":"10px"}).text("{0_M_J_Dialog_Confirm}").bind("click",{},_confirmBtnClickEvent) ;
			    					var cancel_btn = eu.button("btn btn-primary",{},{"margin-left":"10px","margin-right":"10px"}).text("{0_M_J_Dialog_Cancel}").bind("click",{},_cancelBtnClickEvent);
			    					jq_doc_btn_div.append(confirm_btn).append(cancel_btn);
			    					jq_doc_div.append(jq_doc_btn_div);
			    				}
			    			}
			    			
			    			jq_content.append(eu.div().append("{0_M_J_Approval_Dialog_Doc_Title}").css({"text-align":"center","font-weight":"bold","padding-top":"20px","padding-bottom":"20px"}));	
			    			if(dv_config_bean&&dv_config_bean.statuses){
			    				for(var i=0;i<dv_config_bean.statuses.length;i++){
			    					jq_content.append(
			    						eu.button("btn btn-default",{
			    							"id":"btn_"+dv_config_bean.statuses[i].name
			    						},{
			    							"margin":" 3px 5px",
			    							"background-color":dv_config_bean.statuses[i].color?dv_config_bean.statuses[i].color:"#FFFFFF"
			    						})
			    						.text(dv_config_bean.statuses[i].name)
			    						.bind("click",{"comment":dv_config_bean.statuses[i].comment,"rejection":dv_config_bean.statuses[i].rejection,"rejectionReasons":dv_config_bean.rejectionReasons},_btnClickEvent)
			    					);
			    				}
			    			}
			    			jq_content.append(jq_doc_div) ;
			    			dialog = eu.openDialog("approval",jq_content,jq_footer);
			    			dialog.open();
			    		}

			    		this.initEvents = function(){
			    			_that.getElement().bind("click",{},_clickEvent);
			    		}
			    		
			    		
		    		}

		    		// Inherit DVToolBtnClass
		    		
		    		DVUtil.extend(DVToolBtnClass,DVCompareTabClass);
				DVUtil.extend(DVToolBtnClass,DVSeparateClass);
				DVUtil.extend(DVToolBtnClass,DVRotateClass);
				DVUtil.extend(DVToolBtnClass,DVZoomClass);
				DVUtil.extend(DVToolBtnClass,DVZoom100Class);
				DVUtil.extend(DVToolBtnClass,DVFitWinClass);
				DVUtil.extend(DVToolBtnClass,DVFullScreenClass);
				DVUtil.extend(DVToolBtnClass,DVToggleAnnoClass);
				DVUtil.extend(DVToolBtnClass,DVToolAnnoClass);
				DVUtil.extend(DVToolBtnClass,DVMeasureClass);
				DVUtil.extend(DVToolBtnClass,DVDensitometerClass);
				DVUtil.extend(DVToolBtnClass,DVPreferenceClass);
				DVUtil.extend(DVToolBtnClass,DVPrintClass);
				DVUtil.extend(DVToolBtnClass,DVBackClass);
				DVUtil.extend(DVToolBtnClass,DVToolApprovalClass);

		    	})(DVToolbar,DVEleUtil);

		    	(function(btb,eu){
		    		var _hideShowDiv,
		    		_hideShowSpan,
		    		_toolbarDiv,
		    		_tabListActived,
		    		_pagenavActived,
		    		BUTTON_WIDTH = 32,
		    		BUTTON_MARGIN_LR = 30,
		    		TOOLBAR_HEIGHT = 50,
		    		TOOLBAR_HIDE_HEIGHT = 10;
		    		DVBottomToolbarClass = function(){
		    			var _ListTableBtn,
		    			_PageNavBtn;
		    			function _initElement(){
		    				_hideShowDiv = eu.div("gicon",null,{"margin":"auto","width":"100%","height":"10px","text-align":"center","cursor":"pointer"});
		    				_hideShowSpan = eu.span("glyphicon glyphicon-chevron-down",
		    					{"aria-hidden":"true"},
		    					{"top":"-15px","cursor":"pointer"}
		    				).html("&nbsp;");
		    				_hideShowDiv.append(_hideShowSpan);
		    				_dvBottomToolbar_layout.append(_hideShowDiv);

		    				_toolbarDiv = eu.div(null,null,{"width":"100%","height":(TOOLBAR_HEIGHT-10)+"px"});
		    				
		    				_ListTableBtn = new DVBottomListTableClass("left");
		    				_PageNavBtn = new DVBottomPageNavClass("right");
		    				_toolbarDiv
		    				.append(_ListTableBtn.getElement())
		    				.append(_PageNavBtn.getElement());
		    				_dvBottomToolbar_layout.append(_toolbarDiv);
		    			}

		    			function _attachEvents(){
		    				_hideShowDiv.bind("click",{},_showHideSpanClickEvent);
		    			}

		    			function _showHideSpanClickEvent(e){
		    				var target = _hideShowSpan,
		    				h=TOOLBAR_HEIGHT,
		    				top = -15,
		    				isToggle = false;
		    				if(target.hasClass("glyphicon-chevron-down")){
		    					target.removeClass("glyphicon-chevron-down");
		    					target.addClass("glyphicon-chevron-up");
		    					h=TOOLBAR_HIDE_HEIGHT;
		    					top = 0;
		    					isToggle = true;
		    					_toolbarDiv.hide();
		    				}else if(target.hasClass("glyphicon-chevron-up")){		    					
		    					target.removeClass("glyphicon-chevron-up");
		    					target.addClass("glyphicon-chevron-down");

		    				}
		    				_hideShowSpan.hide();
		    				_dvBottomToolbar_layout.animate({
								height: h+'px',
								"line-height":h+"px"
							}, 100, function() {
								// Animation complete.
								var h;
								_hideShowSpan.css({"top":top+"px"})
								_hideShowSpan.show();
								!isToggle?_toolbarDiv.show():"";
								!isToggle?h = _dvMain_layout.height()-_dvToolbar_layout.height()-_dvBottomToolbar_layout.height():h = _dvMain_layout.height()-_dvToolbar_layout.height()-10;
								_tabListActived==true?_dvListTab_layout.height(h):"";
								_pagenavActived==true?_dvPageNav_layout.height(h):"";
								

							});
		    			}

		    			//setup
		    			(function(){
		    				_initElement();
		    				_attachEvents();

		    			})()

		    			this.getToolbar = function(){
		    				return _toolbarDiv;
		    			}

		    			this.getListTableBtn = function(){
		    				return _ListTableBtn;
		    			}

		    			this.getPageNavBtn = function(){
		    				return _PageNavBtn;
		    			}
		    		}

			    	DVBottomToolBtnClass = function(floatArg){
			    		var _element,
			    		_that = this;

			    		this.spanCSS = {"font-size":"30px","cursor":"pointer","width":BUTTON_WIDTH+"px"};
			    		this.divCSS = {
		    					"width":BUTTON_WIDTH+"px",
		    					"height":(TOOLBAR_HEIGHT-15)+"px",
		    					"float":floatArg,
		    					"margin":"0 "+BUTTON_MARGIN_LR+"px"
		    				}
		    			this.createElement = function(floatArg){}
		    			this.getElement = function(){
		    				return _element;
		    			};
		    			this.attachEvents = function(){}
		    			
		    			this.init = function(){
		    				_element = _that.createElement(floatArg);
		    				_that.attachEvents();
		    			}
		    		}

			    	DVBottomListTableClass = function(floatArg){
		    			DVBottomToolBtnClass.prototype.constructor.call(this,floatArg);
		    			var _ele,_that = this;
		    			this.createElement = function(floatArg){
		    				_ele = eu.div("gicon",null,_that.divCSS).append(
		    					eu.span("glyphicon glyphicon-list-alt",null,_that.spanCSS).html("&nbsp;")
		    				);

		    				return _ele;
		    			}
		    			this.attachEvents = function(){
		    				_ele.bind("click",{},_eleClickEvent);
		    			}
		    			function _eleClickEvent(e){
		    				var target = $(this);
		    				if(_tabListActived!=true){		    					
		    					_dvListTab_layout.width(0).height(_dvMain_layout.height()-_dvToolbar_layout.height()-_dvBottomToolbar_layout.height()).show();
			    				 _dvListTab_layout.animate({
								"width":  _dvMain_layout.width()*0.2 > 500 ? _dvMain_layout.width()*0.2 : 500 +'px'
							}, 100, function() {
								// Animation complete.
								
							});
			    				  _tabListActived = true;
		    				}else{
		    					// _dvListTab_layout.css({"width":"0px"});
			    				 _dvListTab_layout.animate({
								"width": '0px'
							}, 100, function() {
								// Animation complete.
								_dvListTab_layout.hide();
							});
			    				_tabListActived = false;
		    				}
		    				

		    			}
		    			//setup
		    			this.init();
		    		}

			    	DVBottomPageNavClass = function(floatArg){
		    			DVBottomToolBtnClass.prototype.constructor.call(this,floatArg);
		    			var _ele,_that = this;
		    			this.createElement = function(floatArg){
		    				_ele = eu.div("gicon",null,_that.divCSS).append(
		    					eu.span("glyphicon glyphicon-th-list",null,_that.spanCSS).html("&nbsp;")
		    				);

		    				return _ele;
		    			}
		    			this.attachEvents = function(){
		    				_ele.bind("click",{},_eleClickEvent);
		    			}
		    			function _eleClickEvent(e){
		    				var target = $(this);
		    				if(_pagenavActived!=true){		    					
		    					_dvPageNav_layout.width(0).height(_dvMain_layout.height()-_dvToolbar_layout.height()-_dvBottomToolbar_layout.height()).show();
			    				_dvPageNav_layout.animate({
									"width": _dvMain_layout.width()*0.2+'px'
								}, 100, function() {
									// Animation complete.
									
								});
			    				  _pagenavActived = true;
		    				}else{
		    					// _dvPageNav_layout.css({"width":"0px"});
			    				_dvPageNav_layout.animate({
									"width": '0px'
								}, 100, function() {
									// Animation complete.
									_dvPageNav_layout.hide();
								});
				    				_pagenavActived = false;
			    				}
		    				

		    			}
		    			this.init();
		    		}

		    		DVUtil.extend(DVBottomToolBtnClass,DVBottomListTableClass);
				DVUtil.extend(DVBottomToolBtnClass,DVBottomPageNavClass);

		    	})(DVBottomToolbar,DVEleUtil);

		    	(function(page,eu){
















		    		DVPageNavigateClass = function(){
		    			var _pageLayout,_pageLayout1,_pageLayout2,
		    			_isIP = true,
		    			panel,panel1,panel2;
		    			this.init = function(){
		    				_createElements();
		    			}

		    			this.getPanel = function(){
		    				if(dv_brand==BRAND){
			    				return panel;
			    			}else if(dv_brand==BRAND_COMPARE){
			    				return [panel1,panel2];
			    			}
		    			}

		    			this.showSinglePanel = function(num){
		    				if(num==1){
		    					panel1.changeCompare2Sigile();
		    					_pageLayout1.show();
		    					_pageLayout2.hide();
		    				}else if(num==2){
		    					panel2.changeCompare2Sigile();
		    					_pageLayout2.show();
		    					_pageLayout1.hide();
		    				}else if(num==3){
		    					panel2.changeCompare2Sigile();
		    					_pageLayout2.hide();
		    					_pageLayout1.hide();
		    				}
		    			}

		    			this.showDoublePanels = function(){
		    				panel1.changeSigile2Compare();
		    				panel2.changeSigile2Compare();
		    				_pageLayout1.show();
		    				_pageLayout2.show();
		    			}

		    			this.fitSize = function(h){
		    				if(!h || typeof h != "number"){
								h = _dvPageNav_layout.height();
							}
		    				if(dv_brand==BRAND){
			    				panel.fitSize(h);
			    			}else if(dv_brand==BRAND_COMPARE){
			    				panel1.fitSize(h);
			    				panel2.fitSize(h);
			    			}
		    			}

			    		function _createElements(){
			    			_dvPageNav_layout.empty();
			    			if(dv_brand==BRAND){
			    				_pageLayout = eu.div();
			    				_dvPageNav_layout.append(_pageLayout);
			    				panel = new _thumbPanel(dv_image_info,0);
			    				panel.init();
			    				_pageLayout.html(panel.getElement());
			    			}else if(dv_brand==BRAND_COMPARE){
			    				_pageLayout1 = eu.div();
			    				_pageLayout2 = eu.div();
			    				_dvPageNav_layout.append(_pageLayout1).append(_pageLayout2);
			    				panel1 = new _thumbPanel(dv_image_info1,1);
			    				panel1.init();
			    				_pageLayout1.html(panel1.getElement());

			    				panel2 = new _thumbPanel(dv_image_info2,2);
			    				panel2.init();
			    				_pageLayout2.html(panel2.getElement());
			    			}
			    		}

			    		function _thumbPanel(imageInfo,dvnum){
			    			var _that = this,
			    				_pageLabels = imageInfo.docObject.pageLabels?imageInfo.docObject.pageLabels.split(","):[],
								_acid = imageInfo.docObject.acid,
								_fileName = imageInfo.docObject.originalFileName,
								_imgUrls = (_isIP ? imageInfo.imgurl.split(",")[0] : imageInfo.imgurl.split(",")[1]),
								_isSinglePreview = true,_totalPage = parseInt(imageInfo.docObject.pages),
								_curPage = 1,_curPage2 = 1,_lastPage = 1,
								_singleIcon,_compareIcon,_pageMainPanel,_pagePanel,_pageNavPanel,_filenameDiv,_pageNumPanel,_preIcon,_nextIcon,_curPageInput,_pagePreview,_curPageSpan,
								_2PAGES_SELED_OP = 1,_2PAGES_UNSELED_OP = 0.3,
								FIT_H = 15;
								if(_pageLabels.length==0){
									for(var p=1;p<(_totalPage+1);p++){
										_pageLabels.push(p);
									}
								}
								this.init = function(){
									_createElements();
									_initEvents();
								}
								this.getElement = function(){
									return _pageMainPanel;
								}
								this.fitSize = function(h){

				    				if(dv_brand==BRAND){
				    					_pagePreview.height(h-_pageNavPanel.height()-_pageNumPanel.height()-FIT_H);
				    				}else if(dv_brand==BRAND_COMPARE){
				    					if(dv_current_num.length==1){
				    						_pagePreview.height(h-_pageNavPanel.height()-_pageNumPanel.height()-FIT_H);
				    					}else{
				    						_pagePreview.height(h/2-_pageNavPanel.height()-_pageNumPanel.height()-FIT_H);
				    					}
				    				}
									

								}
								this.getCurrentPage = function(){
									return _curPage;
								}
								this.getCurrentPage2 = function(){
									return _curPage2;
								}
								this.isSinglePreview = function(){
									return _isSinglePreview;
								}
								this.changeSigile2Compare = function(){
									_filenameDiv.show();
									_singleIcon.hide();
									_compareIcon.hide();
								}
								this.changeCompare2Sigile = function(){
									_filenameDiv.hide();
									if(_totalPage>1){
										_singleIcon.show();
										_compareIcon.show();
									}
									
								}
								this.getSelectedThumb = function(){
									return _pagePreview.find(".select");
								}
								this.setPage = function(page){
									var lastpage = _curPage;
									if(page && typeof page == "number"){
										_curPage = page;
									}
									if(_curPage<1){
										_curPage = lastpage<1?1:lastpage;
									}else if(_curPage>_totalPage){
										_curPage = lastpage>_totalPage?_totalPage:lastpage;
									}
									
									if(_isSinglePreview){
										var _previewImgs = _pagePreview.find(".previewImgDiv"),
										_previewDiv = _pagePreview.find(".previewDiv:eq("+(_curPage-1)+")"),
										_previewImg = _previewDiv.find(".previewImgDiv");
										_previewImgs.removeClass("selected");
										_previewImg.addClass("selected");
										_curPageInput.val(_previewDiv.attr("title"));
										_curPageSpan.text(_curPage);
										_curPage2 = _curPage;

										_dvCanvas2pages.hide();
										if(imageInfo==dv_image_info){	    					
					    					_dvCanvasSingle.removeClass("dvCanvas2pages");
					    				}else if(imageInfo==dv_image_info1){	
					    					_dvCanvasStadCompare3.show();	
					    					_dvCanvasStadCompare2.show();    					
					    					_dvCanvasStadCompare1.removeClass("dvCanvas2pages");
					    					// if(dv_current_num.length==3){
					    						if(_curPage!=panel2.getCurrentPage()){
					    							panel2.setPage(_curPage);
					    						}
					    					// }
					    				}else if(imageInfo==dv_image_info2){	
					    					_dvCanvasStadCompare3.show();
					    					_dvCanvasStadCompare1.show();
					    					_dvCanvasStadCompare2.removeClass("dvCanvas2pages");
					    					// if(dv_current_num.length==3){
					    						if(_curPage!=panel1.getCurrentPage()){
					    							panel1.setPage(_curPage);
					    						}
					    					// }
					    				}
									}else{										
										_curPage2 = _lastPage;
										if(_curPage==_curPage2){
											if(_curPage>=1&&_curPage<_totalPage){
												_curPage2 = _curPage + 1;
											}else{
												_curPage2 = 1;
											}
										}
										var _previewImgs = _pagePreview.find(".previewImgDiv"),
										_previewDiv = _pagePreview.find(".previewDiv:eq("+(_curPage-1)+")"),
										_previewImg = _previewDiv.find(".previewImgDiv"),
										_previewDiv2 = _pagePreview.find(".previewDiv:eq("+(_curPage2-1)+")"),
										_previewImg2 = _previewDiv2.find(".previewImgDiv");
										_previewImgs.removeClass("selected");
										_previewImg.addClass("selected");
										_previewImg2.addClass("selected");
										_curPageInput.val(_previewDiv.attr("title"));
										_curPageSpan.text(_curPage);

										dv_davinci.get2PageInfo(_curPage2,function(){
											if(imageInfo==dv_image_info){	    
												_dvCanvasSingle.addClass("dvCanvas2pages");
											}else if(imageInfo==dv_image_info1){	
												_dvCanvasStadCompare3.hide();
												_dvCanvasStadCompare2.hide();
												_dvCanvasStadCompare1.addClass("dvCanvas2pages");
											}else if(imageInfo==dv_image_info2){			
												_dvCanvasStadCompare3.hide();		
												_dvCanvasStadCompare1.hide();	    					
												_dvCanvasStadCompare2.addClass("dvCanvas2pages");
											}
											_dvCanvas2pages.show();
											dv_canvas_page.openViewer();
										});
										

									}
									if(dvnum==0){
										dv_page.page1 = _curPage;
										dv_page.page2 = _curPage2;
									}else if(dvnum==1){
										dv_page1.page1 = _curPage;
										dv_page1.page2 = _curPage2;
									}else if(dvnum==2){
										dv_page2.page1 = _curPage;
										dv_page2.page2 = _curPage2;
									}
									
									if(imageInfo==dv_image_info){	
										dv_davinci.getPageInfo(_curPage);											    					
				    					dv_canvas.openViewer();
				    				}else if(imageInfo==dv_image_info1){	
				    					dv_davinci.getPageInfo1(_curPage);	    					
				    					dv_canvas_compare.openViewer1();
				    				}else if(imageInfo==dv_image_info2){	
				    					dv_davinci.getPageInfo2(_curPage);
				    					dv_canvas_compare.openViewer2();
				    				}
									_lastPage = _curPage;
									DVTableList.TabNav.annolistUpdate();
									
								}
								_createElements = function(){
									_pageMainPanel = eu.div();
									_singleIcon = eu.a().append(eu.img("singleIcon",{"src":ICON_PAGE_SINGLE},{"margin-right":"10px"}));
									_compareIcon = eu.a().append(eu.img("compareIcon",{"src":ICON_PAGE_COMPARE}));
									_filenameDiv = eu.div().text(_fileName).hide();
									_singleIcon.css({"opacity":_2PAGES_SELED_OP});
									_compareIcon.css({"opacity":_2PAGES_UNSELED_OP});
									if(_totalPage==1){
										_singleIcon.hide();
										_compareIcon.hide();
									}
									_pageNavPanel = eu.div("pageNavPanel",null,{"height":"30px","line-height":"30px"}) ; 
									_pageNavPanel.append(_singleIcon).append(_compareIcon).append(_filenameDiv);
									// _pagePanel = _initPagePanel(_pagePanel,_pageLabels1,_imgUrls1,_acid1);
									// _dvPageNav_layout.append(_pageNavPanel).append(_pagePanel);		

									// var totalPage = _pageLabels == null ? 0 : _pageLabels.length ;
									_pagePanel = eu.div("pagePanel");
									_pageNumPanel = eu.div("pageNumPanel",null,{"height":"30px"});
									_preIcon = eu.a().append(eu.img("preIcon",{"src":ICON_PAGE_PREPAGE}));
									_nextIcon = eu.a().append(eu.img("nextIcon",{"src":ICON_PAGE_NEXTPAGE}));
									_curPageInput = eu.input("curPageInput").val(1);
									_curPageSpan = eu.span("curPageSpan").text(1);
									_pageNumPanel.append(_preIcon).append(_curPageInput).append("(").append(_curPageSpan).append(" {0_M_J_Page_NAV_Of} " + _totalPage + ")").append(_nextIcon),
									pagePreviewLayout = eu.div("page_preview_layout");
									_pagePreview = eu.div("pagePreview")
									for(var i = 1; i <= _totalPage ; i++){
										var previewDiv = eu.div("previewDiv",{"title":_pageLabels[i-1],"sort": i},{"width": "100px","height":"120px"});
										var previewImgDiv = eu.div("previewImgDiv").append(eu.img("previewImg",{"src":_imgUrls + "/thumbnail/" + _acid + "_thumb_" + i + ".jpg"}));
										var previewSpanDiv = eu.div("previewSpanDiv").append(eu.span("previewSpan").text(_pageLabels[i-1]));
										previewDiv.append(previewImgDiv);
										previewImgDiv.append(previewSpanDiv).bind("click",{page:i},function(e){
											_that.setPage(e.data.page);
										});
										_pagePreview.append(previewDiv);
										if(i==1){
											previewImgDiv.addClass("selected");
											// previewDiv.click();
										}
									};
									_pagePreview.height( (95 + 10 ) * _totalPage + 10);
									pagePreviewLayout.append(_pagePreview);
									// pagePreviewLayout.height(_dvPageNav_layout.height());
									_pagePanel.append(_pageNumPanel).append(pagePreviewLayout);
									
									// _pageNavPanel = _pageNavPanel.after(_pagePanel);
									_pageMainPanel.append(_pageNavPanel).append(_pagePanel);
								}

								function _initEvents(){
									_singleIcon.bind("click",{},_singleIconClickEvent);
									_compareIcon.bind("click",{},_compareIconClickEvent);
									_preIcon.bind("click",{},_preIconClickEvent);
									_nextIcon.bind("click",{},_nextIconClickEvent);
									_curPageInput.bind("keydown",{},_curPageInputKeydownEvent);

									function _singleIconClickEvent(e){
										var _zoom = DVToolbar.Toolbar.getDVZoom(),
										_zoom100 = DVToolbar.Toolbar.getDVZoom100();
										_singleIcon.css({"opacity":_2PAGES_SELED_OP});
										_compareIcon.css({"opacity":_2PAGES_UNSELED_OP});
										_isSinglePreview = true ;
										_pagePanel.find(".preIcon").show();
										_pagePanel.find(".nextIcon").show();
										_pagePanel.find(".curPageInput").removeAttr("disabled");
										if(_zoom&&_zoom100){
											_zoom100.show();
										}
										_that.setPage();
									}

									function _compareIconClickEvent(e){
										var _zoom100 = DVToolbar.Toolbar.getDVZoom100();
										_compareIcon.css({"opacity":_2PAGES_SELED_OP});
										_singleIcon.css({"opacity":_2PAGES_UNSELED_OP});										

										_isSinglePreview = false ;
										_pagePanel.find(".preIcon").hide();
										_pagePanel.find(".nextIcon").hide();
										_pagePanel.find(".curPageInput").attr("disabled","true");
										if(_zoom100){
											_zoom100.hide();
										}
										_that.setPage();
										
									}

									function _preIconClickEvent(e){
										if(_curPage > 1){
											_curPage--;							
										}else{
											_curPage = 1;
										}
										_that.setPage();
									}

									function _nextIconClickEvent(e){
										if(_curPage < _totalPage){
											_curPage++;							
										}else{
											_curPage = _totalPage;
										}
										_that.setPage();
									}

									function _curPageInputKeydownEvent(e){										
										if(e.keyCode==13){
											var $target = $(this),
											value = $target.val(),
											idx  = $.inArray(value, _pageLabels);
											if(idx > 0 ){
												// _selectImg(pagePanel,idx)
												_curPage = idx+1;
												_that.setPage();
											}else if(typeof value == "number"&&value<_totalPage&&value>0){
												_curPage = value;
												_that.setPage();
											}else{
												$target.val("");
											}
										}
									}
								}

			    		}

			    		this.init();





		    		}
		    	})(DVPageNavigate,DVEleUtil);

		    	(function(canvas,u){

		    		DVCanvaClass = function(){
		    			var _that = this,
		    			_orgImgdata,
		    			_mousedownOffsetX,
		    			_mousedownOffsetY,
		    			_mousedownClientX,
		    			_mousedownClientY,
		    			_touchEndClientX,
		    			_touchEndClientY,
		    			_vpoint_mousedown,
		    			_dragging = false,
		    			_freehand_path = [],
		    			_freehand_cpath = [],
		    			_canvas,
					_context,
					_viewport,
					STATUS_PEDDING_TEXT = "Pedding",
					STATUS_PROCE_FILE_TEXT = "Processing File",
					STATUS_PROCE_SLICE_TEXT = "Processed Slices",
					STATUS_PROCESSED_TEXT = "Processed File",
					STATUS_PEDDING = "pedding",
					STATUS_PROCE_FILE = "processing",
					STATUS_PROCE_SLICE = "processedslices",
					STATUS_PROCESSED = "processed",
					pending
					EXSTATUS_PROCESSED = "separatedprocessed";			
		    			this.init = function(){
		    				_that.initElement();
		    				
		    			}
		    			this.initViewer = function(){
		    				_that.createViewer();
		    				_that.initEvents();
		    			}
		    			this.createViewer = function(){}
		    			this.initElement = function(){}
		    			this.initEvents = function(){}
		    			this.initProgress = function(progress,num,callback){
		    				var percent = 0,
		    				status = STATUS_PEDDING,
		    				status_text = STATUS_PEDDING_TEXT,
		    				exStatus = "",interval,
		    				interval_updProgress,
		    				interval_callImageStatus;
		    				function callImageStauts(cb){
		    					DVUtil.callJSON("imagestatus.davinci",{"sessionid":PUBLIC_CONFIGS.session_id,"dataType":DATA_TYPE,"num":num},null,_success,_fail);
		    					function _success(data){
		    						if(data){
		    							status = data.status;
		    							exStatus = data.extendedStatus;

		    						}
		    					}
		    					function _fail(data){

		    					}
		    				}
		    				
		    				function updProgress(){

		    					switch(status){
		    						case STATUS_PEDDING:
		    							if(percent<51){
		    								percent++;
		    							}
		    							status_text = STATUS_PEDDING_TEXT
		    						break;
		    						case STATUS_PROCE_FILE:
		    							if(percent<51){
		    								percent = 51;
		    							}else if(percent<91){
		    								percent++;
		    							}
		    							status_text = STATUS_PROCE_FILE_TEXT
		    						break;
		    						case STATUS_PROCE_SLICE:
		    							if(percent<91){
		    								percent = 91;
		    							}else if(percent<100){
		    								percent++;
		    							}
		    							status_text = STATUS_PROCE_SLICE_TEXT
		    						break;
		    						case STATUS_PROCESSED:
		    							percent = 100;
		    							window.clearInterval(interval_updProgress);
		    							window.clearInterval(interval_callImageStatus);
		    							status_text = STATUS_PROCESSED_TEXT
		    							
		    						break;		    						
		    					}

		    					progress.setProgressPercent(percent,status+"...");
		    					if(status==STATUS_PROCESSED){
		    						setTimeout(function(){
		    							callback();
		    						}, 1000);
		    					}

		    				}
		    				callImageStauts();
		    				interval_updProgress = window.setInterval(updProgress,500);
		    				interval_callImageStatus = window.setInterval(callImageStauts,3000);
		    				
		    			}

		    			this.canvasMousedown = function(e,viewer){
		    				
		    				DVUtil.stopEvent(e);
   								
		    				var x = e.x || e.offsetX,
      						y = e.y || e.offsetY,
      						_canvas = viewer.drawer.canvas,
      						_context = viewer.drawer.context,
      						_viewport = viewer.viewport;
      						_freehand_path = [];
      						_freehand_cpath = [];

      						if(e.targetTouches){
      							x = e.targetTouches[0].clientX;
	      						y = e.targetTouches[0].clientY-_dvToolbar_layout.height();
      						}
      						if(!x||!y){
      							x = e.clientX;
	      						y = e.clientY-_dvToolbar_layout.height();
      						}

	    			 		if(dv_toolbar_action!=TOOL_NONE){
	    			 			_orgImgdata = _context.getImageData(0, 0,_canvas.width,_canvas.height);
	    			 			_mousedownOffsetX = x;
	    			 			_mousedownOffsetY = y;
	    			 			_mousedownClientX = e.clientX || e.targetTouches[0].clientX;
	    			 			_mousedownClientY = e.clientY || e.targetTouches[0].clientY;
	    			 			_vpoint_mousedown = _viewport.windowToImageCoordinates( new OpenSeadragon.Point(_mousedownClientX,_mousedownClientY) )
	    			 			_dragging = true;
	    			 			viewer.setMouseNavEnabled(false);
	    			 		}else{	    			 			
	    			 			viewer.setMouseNavEnabled(true);
	    			 		}
	    			 		e.preventDefault();
		    			}
		    			this.canvasMousemove = function(e,viewer){
		    				DVUtil.stopEvent(e);
		    				var targetTouches = e.targetTouches,
		    				x = e.x || e.offsetX,
      						y = e.y || e.offsetY,
      						cx = _touchEndClientX = e.clientX,
      						cy = _touchEndClientY = e.clientY,
      						_canvas = viewer.drawer.canvas,
      						_context = viewer.drawer.context,
      						_viewport = viewer.viewport,
      						vpoint_mouseup = _viewport.windowToImageCoordinates( new OpenSeadragon.Point(cx,cy) ),
      						page_info = _getPageInfo(viewer),
      						ERROR_COLOR_STROKE = "#D21E22",
      						ERROR_COLOR_FILL = "#EF7F79",
      						W_S = 5,H_S = 5,
      						anno_drawer;

      						// DVUtil.log(x+","+y);
      						if(viewer==dv_viewer){
      							anno_drawer = dv_annos_drawer;
      						}else if(viewer==dv_viewer1){
      							anno_drawer = dv_annos_drawer1;
      						}else if(viewer==dv_viewer2){
      							anno_drawer = dv_annos_drawer2;
      						}else if(viewer==dv_viewer_page){
      							anno_drawer = dv_annos_drawer_page;
      						}
      						
      						
      						if(e.targetTouches){
      							x = e.targetTouches[0].clientX;
	      						y = e.targetTouches[0].clientY-_dvToolbar_layout.height();
	      						cx = _touchEndClientX = e.targetTouches[0].clientX;
	      						cy = _touchEndClientY = e.targetTouches[0].clientY;
      						}
      						if(!x||!y){
      							x = e.clientX;
	      						y = e.clientY-_dvToolbar_layout.height();
      						}
      						e.preventDefault(),
      						opoint = new OpenSeadragon.Point(e.clientX,e.clientY);


		    				if(dv_toolbar_action!=TOOL_NONE){
		    					if(dv_toolbar_action==TOOL_DENSITOMETER){
		    						var sencePoint = DVDrawerUtil.dvToImageCor(vpoint_mouseup.x,vpoint_mouseup.y);
		    						DVToolbar.Toolbar.getDVDensitometer()?DVToolbar.Toolbar.getDVDensitometer().updateCor(sencePoint.x,sencePoint.y):null;
	    			 			}else if(dv_toolbar_action==TOOL_ZOOM&&_dragging){
		    			 			var w = Math.abs(x - _mousedownOffsetX),
		    			 			h = Math.abs(y - _mousedownOffsetY),
		    			 			_x = _mousedownOffsetX>x ? x :_mousedownOffsetX,
		    			 			_y = _mousedownOffsetY>y ? y :_mousedownOffsetY;
		    			 			_context.putImageData(_orgImgdata,0,0);
		    			 			_context.save();
		    			 			_context.globalAlpha=0.5;
		    			 			if(!_chkOverBounds(_vpoint_mousedown,vpoint_mouseup,page_info)){
		    			 				_context.strokeStyle=ERROR_COLOR_STROKE;
		    			 				_context.fillStyle=ERROR_COLOR_FILL;
		    			 			}else{
		    			 				_context.strokeStyle="#101B9A";
		    			 				_context.fillStyle="#5E95D5";
		    			 			}
		    			 			
								_context.beginPath();
								_context.rect(_x, _y, w, h);
								_context.stroke();
								_context.fill();
		    			 			_context.restore();
		    			 		}else if(_dragging){
		    			 			var draw_color = dv_user_preference.draw_color.replace("0x","#");
		    			 			if(dv_toolbar_action==TOOL_ANNO_RECT){
			    			 			var w = Math.abs(x - _mousedownOffsetX),
			    			 			h = Math.abs(y - _mousedownOffsetY),
			    			 			_x = _mousedownOffsetX>x ? x :_mousedownOffsetX,
			    			 			_y = _mousedownOffsetY>y ? y :_mousedownOffsetY;
			    			 			_context.putImageData(_orgImgdata,0,0);
			    			 			_context.save();
			    			 			_context.globalAlpha=1;
			    			 			if(!_chkOverBounds(_vpoint_mousedown,vpoint_mouseup,page_info)){
			    			 				_context.strokeStyle=ERROR_COLOR_STROKE;
			    			 			}else{
			    			 				_context.strokeStyle=draw_color;
			    			 			}
			    			 			
										_context.beginPath();
										_context.rect(_x, _y, w, h);
										_context.stroke();
										// _context.fill();
			    			 			_context.restore();
			    			 		}else if(dv_toolbar_action==TOOL_ANNO_ECLIPSE){
			    			 			var mdx = _mousedownOffsetX,
			    			 			mdy = _mousedownOffsetY,
			    			 			w = Math.abs(x - mdx),
			    			 			h = Math.abs(y - mdy),
			    			 			_x = mdx>x ? x :mdx,
			    			 			_y = mdy>y ? y :mdy;

			    			 			
 										_context.putImageData(_orgImgdata,0,0);
			    			 			DVDrawerUtil.drawEllipse(_context,
			    			 				mdx+(x - mdx)/2,
			    			 				mdy+(y - mdy)/2,
			    			 				w/2,h/2,draw_color);
 										
			    			 		}else if(dv_toolbar_action==TOOL_ANNO_FREEHAND){
			    			 			var w = Math.abs(x - _mousedownOffsetX),
			    			 			h = Math.abs(y - _mousedownOffsetY),
			    			 			_x = _mousedownOffsetX>x ? x :_mousedownOffsetX,
			    			 			_y = _mousedownOffsetY>y ? y :_mousedownOffsetY;

			    			 			_freehand_path.push([x,y]);
			    			 			_freehand_cpath.push([cx,cy]);
			    			 			_context.putImageData(_orgImgdata,0,0);
			    			 			_context.save();
			    			 			if(!_chkOverBounds(_vpoint_mousedown,vpoint_mouseup,page_info)){
			    			 				_context.strokeStyle=ERROR_COLOR_STROKE;
			    			 			}else{
			    			 				_context.strokeStyle=draw_color;
			    			 			}
			    			 			
										_context.beginPath();
										_context.moveTo(_mousedownOffsetX,_mousedownOffsetY);
										for(var i=0;i<_freehand_path.length;i++){
											_context.lineTo(_freehand_path[i][0], _freehand_path[i][1]);
										}
										
										_context.stroke();
			    			 			_context.restore();
			    			 		}else if(dv_toolbar_action==TOOL_ANNO_ARROW){
			    			 			var w = Math.abs(x - _mousedownOffsetX),
			    			 			h = Math.abs(y - _mousedownOffsetY),
			    			 			_x = _mousedownOffsetX,//>x ? x :_mousedownOffsetX,
			    			 			_y = _mousedownOffsetY,//>y ? y :_mousedownOffsetY;
			    			 			Par = 10.0,
			    			 			lX = x-_x,
			    			 			lY = y-_y,
										slopy = Math.atan2(-lY,-lX),
										cosy = Math.cos(slopy),
										siny = Math.sin(slopy);
					    				// color = d.toColor(shape.color),
			    			 			_context.putImageData(_orgImgdata,0,0);
			    			 			_context.save();			    			 			

					    				_context.beginPath();
					    				if(!_chkOverBounds(_vpoint_mousedown,vpoint_mouseup,page_info)){
			    			 				_context.strokeStyle=ERROR_COLOR_STROKE;
			    			 				_context.fillStyle=ERROR_COLOR_STROKE;
			    			 			}else{
			    			 				_context.strokeStyle=draw_color;
			    			 				_context.fillStyle=draw_color;
			    			 			}
										_context.moveTo(_x,_y);
										_context.lineTo(x,y);
										_context.lineTo(parseFloat(x + ( Par * cosy - ( Par / 2.0 * siny ))),parseFloat(y + ( Par * siny + ( Par / 2.0 * cosy ))));
										// _context.lineTo(shape_vpoint4.x,shape_vpoint4.y);
										_context.lineTo(parseFloat(x + ( Par * cosy + Par / 2.0 * siny )),parseFloat(y - ( Par / 2.0 * cosy - Par * siny )));
										_context.lineTo(x,y);
										_context.closePath();
										_context.fill();
										_context.stroke();
			    			 		}
		    			 		}
	    			 		} 
	    			 		
		    			}
		    			this.canvasMouseup = function(e,viewer){
		    				DVUtil.stopEvent(e);
		    				var x = e.clientX || _touchEndClientX,
      						y = e.clientY || _touchEndClientY,
      						_canvas = viewer.drawer.canvas,
      						_context = viewer.drawer.context,
      						_viewport = viewer.viewport;
		    				e.preventDefault();
		    				if(dv_toolbar_action!=TOOL_NONE){
	    			 			if(dv_toolbar_action==TOOL_ZOOM){
		    			 			var w = Math.abs(x - _mousedownClientX),
		    			 			h = Math.abs(y - _mousedownClientY),
		    			 			_x = _mousedownClientX>x ? x :_mousedownClientX,
		    			 			_y = _mousedownClientY>y ? y :_mousedownClientY,
		    			 			opoint = new OpenSeadragon.Point(_x,_y),
		    			 			vpoint = _viewport.windowToImageCoordinates( opoint ),		    			 			
		    			 			vpoint_mouseup = _viewport.windowToImageCoordinates( new OpenSeadragon.Point(x,y) ),
		    			 			vpoint_wh = {w:(Math.abs(vpoint_mouseup.x - _vpoint_mousedown.x)),h:(Math.abs(vpoint_mouseup.y - _vpoint_mousedown.y))},
		    			 			page_info = _getPageInfo(viewer),
		    			 			pw = page_info.originalWidthPx,
		    			 			ph = page_info.originalHeightPx,
		    			 			b_x = vpoint.x/pw,
		    			 			b_y = vpoint.y/pw,
		    			 			b_w = Math.abs(vpoint_wh.w)/pw,
		    			 			b_h = b_w / _viewport.getAspectRatio(),
		    			 			bounds = new OpenSeadragon.Rect(b_x,b_y,b_w,b_h);

		    			 			_context.putImageData(_orgImgdata,0,0);
		    			 			if(!_chkOverBounds(_vpoint_mousedown,vpoint_mouseup,page_info)){
		    			 				_dragging = false;
		    			 				return;
		    			 			}
									_viewport.fitBounds(bounds);
									DVToolbar.Toolbar.getDVZoom().cancel();
									viewer.setMouseNavEnabled(true);
		    			 		}else{
		    			 			var _page = 1;
		    			 			if(viewer==dv_viewer){
		    			 				_page = dv_page.page1;
		    			 			}else if(viewer==dv_viewer1){
		    			 				_page = dv_page1.page1;
		    			 			}else if(viewer==dv_viewer2){
		    			 				_page = dv_page2.page1;
		    			 			}else if(viewer==dv_viewer_page){
		    			 				if(dv_brand==BRAND){								
											_page = dv_page.page2;								
										}else if(dv_brand==BRAND_COMPARE){
											if(dv_current_num.length==1&&dv_current_num[0]==1){
												_page = dv_page1.page2;
											}else if(dv_current_num.length==1&&dv_current_num[0]==2){
												_page = dv_page2.page2;
											}
										}
		    			 			}
				    				var w = Math.abs(x - _mousedownClientX),
		    			 			h = Math.abs(y - _mousedownClientY),
		    			 			_x = _mousedownClientX>x ? x :_mousedownClientX,
		    			 			_y = _mousedownClientY>y ? y :_mousedownClientY,
		    			 			opoint = new OpenSeadragon.Point(_x,_y),
		    			 			vpoint = _viewport.windowToImageCoordinates( opoint ),		    			 			
		    			 			vpoint_mouseup = _viewport.windowToImageCoordinates( new OpenSeadragon.Point(x,y) ),
		    			 			sencePoint = DVDrawerUtil.dvToImageCor(vpoint_mouseup.x,vpoint_mouseup.y),
		    			 			page_info = _getPageInfo(viewer),
		    			 			annotaion = {
								            "acid": "new",
								            "action": false,
								            "base64Enabled": null,
								            "checkstatus": 0,
								            "color": "15595649,13",
								            "content": "",
								            "dependentId": 0,
								            "formattedContent": "",
								            "ignore": false,
								            "lock": false,
								            "page": _page,
								            "pageLabel": null,
								            "playheadtime": null,
								            "progressiveId": "new",
								            "sceneX": sencePoint.x,
								            "sceneY": sencePoint.y,
								            "shape": {
								                "color": "1",
								                "type": ""
								            },
								            "taskId": "-1",
								            "timestamp": new Date(),
								            "type": null,
								            "user": {
								                "firstName": "shinelen",
								                "id": "112",
								                "lastName": "Brüning",
								                "loginName": null,
								                "password": null
								            }
								        },_anno,
				    				_image_data_temp = _context.getImageData(0, 0,_canvas.width,_canvas.height),
				    				draw_color = dv_user_preference.draw_color.replace("0x","#"),
				    				draw_color16 = dv_user_preference.draw_color.replace("0x",""),
				    				draw_color10 = parseInt(draw_color16,16);
				    				// _context.putImageData(_image_data_temp, 0, 0);
				    				if(!_chkOverBounds(_vpoint_mousedown,vpoint_mouseup,page_info)){
				    					_context.putImageData(_orgImgdata,0,0);
		    			 				_dragging = false;
		    			 				return;
		    			 			}
		    			 			if(dv_toolbar_action==TOOL_ANNO){
			    			 													
									_anno = new DVNormalAnnoClass(viewer,annotaion);
									_anno.draw();
			    			 		}else if(dv_toolbar_action==TOOL_ANNO_RECT){

					    				var start_vpoint = _viewport.windowToImageCoordinates( new OpenSeadragon.Point(_mousedownClientX,_mousedownClientY) ),
					    				start_point = DVDrawerUtil.dvToImageCor(start_vpoint.x,start_vpoint.y),
					    				end_point = sencePoint,
					    				w = end_point.x-start_point.x,
					    				h = end_point.y-start_point.y;


					    				annotaion.shape.color = draw_color10;
					    				annotaion.shape.type = ANNO_RECT+" 1 "+start_point.x+" "+start_point.y+" "+w+" "+h;

					    				_context.putImageData(_orgImgdata,0,0);
					    				

			    			 			_anno = new DVRectangleAnnoClass(viewer,annotaion);
			    			 			_anno.draw();
			    			 		}else if(dv_toolbar_action==TOOL_ANNO_ECLIPSE){

			    			 			var start_vpoint = _viewport.windowToImageCoordinates( new OpenSeadragon.Point(_mousedownClientX,_mousedownClientY) ),
					    				start_point = DVDrawerUtil.dvToImageCor(start_vpoint.x,start_vpoint.y),
					    				end_point = sencePoint,
					    				w = end_point.x-start_point.x,
					    				h = end_point.y-start_point.y;

					    				annotaion.shape.color = draw_color10;
					    				annotaion.shape.type = ANNO_ECLIPSE+" 1 "+start_point.x+" "+start_point.y+" "+w+" "+h;
					    				annotaion.sceneX = start_point.x + w/2;
					    				_context.putImageData(_orgImgdata,0,0);

			    			 			_anno = new DVCircleAnnoClass(viewer,annotaion);
			    			 			_anno.draw();
			    			 		}else if(dv_toolbar_action==TOOL_ANNO_FREEHAND){
			    			 			_anno = new DVFreehandAnnoClass(viewer,annotaion);
			    			 			var start_vpoint = _viewport.windowToImageCoordinates( new OpenSeadragon.Point(_mousedownClientX,_mousedownClientY) ),
					    				start_point = DVDrawerUtil.dvToImageCor(start_vpoint.x,start_vpoint.y),
					    				end_point = sencePoint,
					    				w = end_point.x-start_point.x,
					    				h = end_point.y-start_point.y,
					    				path = "M 0 0 ";
					    				for(var i=0;i<_freehand_cpath.length;i++){
					    					var pathVCor = _viewport.windowToImageCoordinates( new OpenSeadragon.Point(_freehand_cpath[i][0],_freehand_cpath[i][1]) ),
					    					pathCor = DVDrawerUtil.dvToImageCor(pathVCor.x,pathVCor.y);
					    					path +="L "+(parseFloat(pathCor.x) - parseFloat(start_point.x))+" "+(parseFloat(pathCor.y) - parseFloat(start_point.y))+" ";
					    				}
					    				annotaion.sceneX = start_point.x;
					    				annotaion.sceneY = start_point.y;
					    				annotaion.shape.color = draw_color10;
					    				annotaion.shape.type = ANNO_FREEHAND+" 1 "+start_point.x+" "+start_point.y+" 0 0 "+path;

					    				_context.putImageData(_orgImgdata,0,0);
					    									    				
			    			 			_anno = new DVFreehandAnnoClass(viewer,annotaion);
			    			 			_anno.draw();
			    			 			
			    			 		}else if(dv_toolbar_action==TOOL_ANNO_ARROW){
			    			 			_anno = new DVArrowAnnoClass(viewer,annotaion);
			    			 			var start_vpoint = _viewport.windowToImageCoordinates( new OpenSeadragon.Point(_mousedownClientX,_mousedownClientY) ),
					    				start_point = DVDrawerUtil.dvToImageCor(start_vpoint.x,start_vpoint.y),
					    				end_point = sencePoint,
					    				w = end_point.x-start_point.x,
					    				h = end_point.y-start_point.y;

					    				annotaion.sceneX = start_point.x;
					    				annotaion.sceneY = start_point.y;
					    				annotaion.shape.color = draw_color10;
					    				annotaion.shape.type = ANNO_ARROW+" 1 "+start_point.x+" "+start_point.y+" "+w+" "+h+" 0 0 0 0";

					    				_context.putImageData(_orgImgdata,0,0);
					    				

			    			 			_anno = new DVArrowAnnoClass(viewer,annotaion);
			    			 			_anno.draw();  			
			    			 		}
			    			 		// _annotationList.push(_anno);
			    			 		if(viewer==dv_viewer){
		      							anno_drawer = dv_annos_drawer;
		      						}else if(viewer==dv_viewer1){
		      							anno_drawer = dv_annos_drawer1;
		      						}else if(viewer==dv_viewer2){
		      							anno_drawer = dv_annos_drawer2;
		      						}else if(viewer==dv_viewer_page){
		      							anno_drawer = dv_annos_drawer_page;
		      						}
		      						if(anno_drawer&&anno_drawer.getAnnotationList()){
		      							anno_drawer.getAnnotationList().push(_anno);
		      						}
		    			 		}
		    			 		_dragging = false;
	    			 		} 
		    			}

		    			//private
		    			function _chkOverBounds(point_mousedown,point_mouseup,page_info){
		    				if((dv_toolbar_action!=TOOL_ANNO)&&point_mousedown.equals(point_mouseup)){    			 				
    			 				return false;
    			 			}else{
    			 				var point_wh = {w:(Math.abs(point_mouseup.x - point_mousedown.x)),h:(Math.abs(point_mouseup.y - point_mousedown.y))},
    			 				x = Math.min(point_mouseup.x , point_mousedown.x),
    			 				y = Math.min(point_mouseup.y , point_mousedown.y);
    			 				if((x+point_wh.w)>page_info.originalWidthPx||x<0){
    			 					return false;
    			 				}else if((y+point_wh.h)>page_info.originalHeightPx||y<0){
    			 					return false;
    			 				}
    			 			}
    			 			return true;
		    			}
		    			function _getPageInfo(viewer){
		    				var page_info;
		    				if(viewer==dv_viewer){    	
		    					page_info = dv_page_info;
    			 			}else if(viewer==dv_viewer1){
    			 				page_info = dv_page_info1;
    			 			}else if(viewer==dv_viewer2){
    			 				page_info = dv_page_info2;
    			 			}
    			 			return page_info;
		    			}
		    		}



			    	DVNormalCanvaClass = function(){
			    		DVCanvaClass.prototype.constructor.call(this);
			    		var eu = DVEleUtil,_that = this,
						_dvCanvas,_viewer;
			    		this.initElement = function(){						
						
						_dvCanvasSingle = eu.div("dvCanvasSingle");
						_dvCanvas = dv_jq_canvas = eu.div("dvCanvas");
						_dvCanvasSingle.append(_dvCanvas);
						_dvCanvasContaiiner_layout.append(_dvCanvasSingle);
						_that.openViewer();
					}
					this.storeImagedata = function(){
		    				(_context&&_canvas)?_orgImgdata = _context.getImageData(0, 0,_canvas.width,_canvas.height):null;
		    			}
	    			this.setImagedata = function(imagedata){
	    				imagedata = !imagedata?_orgImgdata:imagedata;
	    				_context?_context.putImageData(imagedata,0,0):null;
	    			}
					this.getCanvasElement = function(){
						return _dvCanvas;
					}
					this.openViewer = function(){
						var progress = eu.progress(),
							num = 0;
							DVUtil.log(["remove",_dvCanvas]);
						_dvCanvas.find(".dv-annotation").remove();
						_dvCanvas.find(".dv-annotation-view").remove();
						_dvCanvas.find(".openseadragon-container").hide();
						_dvCanvas.append(progress.getElement());	

						if(_viewer){
							var dvsep = DVToolbar.Toolbar.getDVSeparate(),
							bean = dvsep?dvsep.getSelectedBean():null,_url,
							dvpage = DVPageNavigate.pageNav?DVPageNavigate.pageNav.getPanel():null,
							page = dvpage?dvpage.getCurrentPage():1;
												

							if((!bean)||bean.data=="All"){
		    						_url = dv_page_info.sliceurl+"/"+dv_image_info.docObject.acid+"_"+page+".xml";
		    					}else{
		    						_url = dv_page_info.sliceurl+"/separations/"+dv_image_info.docObject.acid+"_"+page+"."+bean.data+".xml";
		    					}
		    					_that.initProgress(progress,num,function(){
		    						_dvCanvas.find(".openseadragon-container").show();								
								_viewer.open(_url);
								progress.destory();
							});
		    				}else{
		    					var page = 1;
		    					
		    					_that.initProgress(progress,num,function(){	
		    						progress.destory();
		    						dv_davinci.initImageInfo(function(data){
		    							dv_davinci.getPageInfo(page,function(){
		    								_that.initViewer();						    					   	
					    					DVPageNavigate.pageNav = new DVPageNavigateClass();
		    							});
		    						});
			    									
							});
		    				}
	    												
					}
			    		this.createViewer = function(){
			    			DVUtil.log("this.createViewer")
			    			var _drawer,
		    			 	_canvas,
		    			 	_context,
		    			 	_viewport,
		    			 	_acid = dv_image_info.docObject.acid,
		    			 	_tilepath = dv_page_info.sliceurl+"/"+_acid+"_"+dv_page.page1+".xml";

			    			 dv_viewer = _viewer = OpenSeadragon({
						        id: "dvviewer",
						        element:_dvCanvas.get(0),
						        prefixUrl: "images/",
						        tileSources: _tilepath,
						        minZoomImageRatio:"1",
						        maxZoomLevel:"13",
						        showNavigationControl:false,
						        crossOriginPolicy:true
						    });
			    			    	

			    			 // return _viewer;
			    		}

			    		this.initEvents = function(){
			    			var isinitanno = true,
			    			isDrawAnnoING = false;
			    			 _viewer.addHandler("open",_openEvent);
			    			 _viewer.addHandler("animation-finish",_animationFinshEvent,{"test":"animation"});
			    			 _viewer.addHandler("animation",_animationEvent,{"test":"animation"});
			    			
			    			 

			    			 function _openEvent(e){
			    			 	_viewer = e.eventSource,
			    			 	_drawer = _viewer.drawer,
			    			 	_canvas = _drawer.canvas,
			    			 	_context = _drawer.context,
			    			 	_viewport = _viewer.viewport,
			    			 	$canvas = $(_canvas);
			    			 	dv_annos_drawer = new DVAnnotationsClass(_viewer);


								$canvas.bind("mousedown",{},_canvasMousedownEvent);
								$canvas.bind("mousemove",{},_canvasMousemoveEvent);
								$canvas.bind("mouseup",{},_canvasMouseupEvent);
								// $canvas.bind("mouseout",{},_canvasMouseupEvent);

								if(_canvas.addEventListener){DVUtil.log("addEventListener")
									_canvas.addEventListener("touchstart",_canvasMousedownEvent);
									_canvas.addEventListener("touchmove",_canvasMousemoveEvent);
									_canvas.addEventListener("touchend",_canvasMouseupEvent);
								}
								



								function _canvasMousedownEvent(e){
									_that.canvasMousedown(e,_viewer);
								}
								function _canvasMousemoveEvent(e){
									_that.canvasMousemove(e,_viewer);
								}
								function _canvasMouseupEvent(e){
									_that.canvasMouseup(e,_viewer);
								}

			    			 	u.log("open");
			    			 	setTimeout(function(){

				    			 		dv_image_data = _context.getImageData(0, 0,_canvas.width,_canvas.height);
				    			 		dv_annos_drawer.draw();
				    			 		u.log("3")
				    			 	}, 1000);   
			    			 }

			    			 function _animationFinshEvent(e){
			    			 	var userData = e.userData;
			    			 	if(isinitanno){
				    			 	setTimeout(function(){
				    			 		dv_image_data = _context.getImageData(0, 0,_canvas.width,_canvas.height);
				    			 		dv_annos_drawer.draw();
				    			 	}, 1000);   
				    			 	isinitanno = false; 			 	
			    			 	}else{
			    			 		setTimeout(function(){
				    			 		dv_annos_drawer.draw();
				    			 	}, 1000); 
			    			 	}
			    			 }

			    			 function _animationEvent(e){
			    			 	var userData = e.userData;
			    			 	dv_image_data = _context.getImageData(0, 0,_canvas.width,_canvas.height);
			    			 	dv_annos_drawer.draw();
			    			 	u.log(1)
			    			 	
						    	// u.log(e);
						    	// viewer.setFullScreen(true);
			    			 }
			    		}
			    		this.init();
		    		}

			    	DVCompareCanvaClass = function(){
			    		DVCanvaClass.prototype.constructor.call(this);
			    		var eu = DVEleUtil,_that = this,
			    		_viewer1,_viewer2,
						_dvCanvas1,
						_dvCanvas2,
						_dvCanvas3,
						
						_differentLabel,
						_toggleLabel,
						_diffCanvas,
						_canvasURL1,
						_canvasURL2,
						_isResetURL1 = false,
						_isResetURL2 = false;
						this.resetCanvasURL = function(){
							_isResetURL1 = true;	
							_isResetURL2 = true;					
						}
						this.getCompareEle1 = function(){
							return _dvCanvasStadCompare1;
						}
						this.getCompareEle2 = function(){
							return _dvCanvasStadCompare2;
						}
						this.getCompareEle3 = function(){
							return _dvCanvasStadCompare3;
						}
						this.getCanvasElement1 = function(){
							return _dvCanvas1;
						}
						this.getCanvasElement2 = function(){
							return _dvCanvas2;
						}
						this.getCanvasElement3 = function(){
							return _dvCanvas3;
						}
			    			this.initElement = function(){						
							var _className = dv_user_preference.compare_view==0?"dvCanvasStadCompare":"dvCanvasTabCompare",
							_firstCSS = dv_user_preference.compare_view==0?null:{"display":""},
							_btnGroup;

							_dvCanvasStadCompare1 = eu.div(_className,{"num":0},_firstCSS);
							_dvCanvas1 = dv_jq_canvas1 = eu.div("dvCanvas");
							_dvCanvasStadCompare1.append(_dvCanvas1);

							_dvCanvasStadCompare2 = eu.div(_className,{"num":1});
							_dvCanvas2 = dv_jq_canvas2 = eu.div("dvCanvas");
							_dvCanvasStadCompare2.append(_dvCanvas2);

							_dvCanvasStadCompare3 = eu.div(_className,{"num":"c"},{"position":"relative"});
							_dvCanvas3 = eu.div("dvCanvas");
							_diffCanvas = eu.canvas();
							_dvCanvas3.append(_diffCanvas);
							_dvCanvasStadCompare3.append(_dvCanvas3);

				    			_btnGroup = eu.div("btn-group",{"data-toggle":"buttons"},{"margin-left":"5px","position":"absolute","top":"0px","left":"0px"});
				    			_differentLabel = eu.label("btn btn-default active",null,{"padding":"1px 12px"});
				    			_radioBtn1 = eu.input(null,{"type":"radio","name":"tabModeBtns","id":"dvtab1","autocomplete":"off","checked":"checked"});
				    			_toggleLabel = eu.label("btn btn-default",null,{"padding":"1px 12px"});
				    			_radioBtn2 = eu.input(null,{"type":"radio","name":"tabModeBtns","id":"dvtab2","autocomplete":"off"});
				    			_differentLabel.append(_radioBtn1).append(eu.img(null,{"src":ICON_DIFFERENT}));
				    			_toggleLabel.append(_radioBtn2).append(eu.img(null,{"src":ICON_TOGGLE}));
				    			// _label3.append(_radioBen3).append(eu.img(null,{"src":ICON_COMPARE_BTN},{"max-width":"18px","max-height":"18px"}));			    			
				    			_btnGroup.append(_differentLabel).append(_toggleLabel);
				    			_dvCanvasStadCompare3.append(_btnGroup);

							_dvCanvasContaiiner_layout
							.append(_dvCanvasStadCompare1)
							.append(_dvCanvasStadCompare2)
							.append(_dvCanvasStadCompare3);
							_that.initEvents();
							dv_davinci.initImageInfo(function(data){
								!DVPageNavigate.pageNav?DVPageNavigate.pageNav = new DVPageNavigateClass():null;
								DVToolbar.Toolbar.getDVCompareTab().initElement(_dvCanvas1,_dvCanvas2,_dvCanvas3);

								_that.openViewer1();
								_that.openViewer2();
							});
							
						}
						
						this.openViewer1 = function(){
							var progress = eu.progress(),
								num = 0;
								DVUtil.log(["remove",_dvCanvas1]);
							_dvCanvas1.find(".dv-annotation").remove();
							_dvCanvas1.find(".dv-annotation-view").remove();
							_dvCanvas1.find(".openseadragon-container").hide();
							_dvCanvas1.append(progress.getElement());	
							if(_viewer1){
								var dvsep = DVToolbar.Toolbar.getDVSeparate(),
								bean = dvsep?dvsep.getSelectedBean():null,_url,
								dvpage = DVPageNavigate.pageNav?DVPageNavigate.pageNav.getPanel()[0]:null,
								page = dvpage?dvpage.getCurrentPage():1;
								if((!bean)||bean.data=="All"){
			    						_url = dv_page_info1.sliceurl+"/"+dv_image_info1.docObject.acid+"_"+page+".xml";
			    					}else{
			    						_url = dv_page_info1.sliceurl+"/separations/"+dv_image_info1.docObject.acid+"_"+page+"."+bean.data+".xml";
			    					}
								
			    					new _that.initProgress(progress,num,function(){
			    						_dvCanvas1.find(".openseadragon-container").show();								
									_viewer1.open(_url);
									progress.destory();
								});
									
							}else{
			    					
			    					var page = 1;
		    					
			    					new _that.initProgress(progress,num,function(){
			    						progress.destory();
			    						dv_davinci.initImageInfo(function(data){
			    							dv_davinci.getPageInfo1(page,function(){
			    								
			    								_that.createViewer1();						    					   	
						    					!DVPageNavigate.pageNav?DVPageNavigate.pageNav = new DVPageNavigateClass():null;
			    							});
			    						});
				    									
								});
			    				}						
						}

						this.openViewer2 = function(){
							var progress = eu.progress(),
								num = 1;
								DVUtil.log(["remove",_dvCanvas2]);
							_dvCanvas2.find(".dv-annotation").remove();
							_dvCanvas2.find(".dv-annotation-view").remove();
							_dvCanvas2.find(".openseadragon-container").hide();
							_dvCanvas2.append(progress.getElement());
							if(_viewer2){
								var dvsep = DVToolbar.Toolbar.getDVSeparate(),
								bean = dvsep?dvsep.getSelectedBean():null,_url,
								dvpage = DVPageNavigate.pageNav?DVPageNavigate.pageNav.getPanel()[1]:null,
								page = dvpage?dvpage.getCurrentPage():1;
								if((!bean)||bean.data=="All"){
			    						_url = dv_page_info2.sliceurl+"/"+dv_image_info2.docObject.acid+"_"+page+".xml";
			    					}else{
			    						_url = dv_page_info2.sliceurl+"/separations/"+dv_image_info2.docObject.acid+"_"+page+"."+bean.data+".xml";
			    					}
								
								new _that.initProgress(progress,num,function(){
			    						_dvCanvas2.find(".openseadragon-container").show();								
									_viewer2.open(_url);
									progress.destory();
								});
							}else{
			    					var page = 1;
			    					new _that.initProgress(progress,num,function(data){
			    						DVUtil.log(["open view2",data])
			    						progress.destory();
			    						dv_davinci.initImageInfo(function(data){
			    							dv_davinci.getPageInfo2(page,function(){
			    								
			    								_that.createViewer2();						    					   	
						    					!DVPageNavigate.pageNav?DVPageNavigate.pageNav = new DVPageNavigateClass():null;
			    							});
			    						});
				    									
								});
			    				}						
						}
						var snycAnimation1 = false,
						snycAnimation2 = false;
						this.createViewer1 = function(){
							var _viewer,		    			 	
			    			 	_drawer,
			    			 	_canvas,
			    			 	_context,
			    			 	_viewport,
			    			 	_acid = dv_image_info1.docObject.acid,
			    			 	_tilepath = dv_page_info1.sliceurl+"/"+_acid+"_"+dv_page1.page1+".xml",
			    			 	isinitanno = true;

			    			 	dv_viewer1 = _viewer = _viewer1 = OpenSeadragon({
							        id: "dvviewer1",
							        element:_dvCanvas1.get(0),
							        prefixUrl: "images/",
							        tileSources: _tilepath,
							        minZoomImageRatio:"1",
							        maxZoomLevel:"13",
							        // defaultZoomLevel: 1,
							        // minZoomLevel:0.1,								
							        showNavigationControl:false,
							        crossOriginPolicy:true
							    });
				    			 
				    			 _viewer.addHandler("open",_openEvent);
				    			 _viewer.addHandler("animation-start",_animationStartEvent);
				    			 _viewer.addHandler("animation-finish",_animationFinshEvent,{"test":"animation"});
				    			 _viewer.addHandler("animation",_animationEvent,{"test":"animation"});

				    			

				    			 function _openEvent(e){
				    			 	_viewer = e.eventSource,
				    			 	_drawer = _viewer.drawer,
				    			 	_canvas = _drawer.canvas,
				    			 	_context = _drawer.context,
				    			 	_viewport = _viewer.viewport,
				    			 	$canvas = $(_canvas);
				    			 	dv_annos_drawer1 = new DVAnnotationsClass(_viewer);

				    			 	$canvas.bind("mousedown",{},_canvasMousedownEvent);
									$canvas.bind("mousemove",{},_canvasMousemoveEvent);
									$canvas.bind("mouseup",{},_canvasMouseupEvent);

									if(_canvas.addEventListener){
										_canvas.addEventListener("touchstart",_canvasMousedownEvent);
										_canvas.addEventListener("touchmove",_canvasMousemoveEvent);
										_canvas.addEventListener("touchend",_canvasMouseupEvent);
									}
									function _canvasMousedownEvent(e){
										_that.canvasMousedown(e,_viewer);
									}
									function _canvasMousemoveEvent(e){
										_that.canvasMousemove(e,_viewer);
									}
									function _canvasMouseupEvent(e){
										_that.canvasMouseup(e,_viewer);
									}

									setTimeout(function(){
				    			 		if(_isResetURL1){
					    			 		_canvasURL1 = _canvas.toDataURL();
					    			 		_isResetURL1 = false;
					    			 	}
				    			 	}, 1000); 
									setTimeout(function(){
					    			 		dv_image_data1 = _context.getImageData(0, 0,_canvas.width,_canvas.height);
					    			 		_canvasURL1 = _canvas.toDataURL();
					    			 		dv_annos_drawer1.draw();
					    			 	}, 1000);   
				    			 	u.log("open1");
				    			 	

				    			 }

				    			 function _animationStartEvent(e){
				    			 	if(!snycAnimation2&&dv_viewer2){
				    			 		snycAnimation1 = true;
				    			 		dv_viewer2.setMouseNavEnabled(false);
				    			 	}
				    			 }

				    			 function _animationFinshEvent(e){
				    			 	var userData = e.userData;
				    			 	if(isinitanno){
					    			 	setTimeout(function(){
					    			 		dv_image_data1 = _context.getImageData(0, 0,_canvas.width,_canvas.height);
					    			 		_canvasURL1 = _canvas.toDataURL();
					    			 		dv_annos_drawer1.draw();
					    			 	}, 1000);   
					    			 	isinitanno = false; 			 	
				    			 	}else{
				    			 		setTimeout(function(){
					    			 		dv_annos_drawer1.draw();
					    			 	}, 1000);   
				    			 	}
				    			 	if(snycAnimation1){
				    			 		(dv_viewer2&&dv_viewer2.viewport)?dv_viewer2.viewport.fitBounds(_viewport.getBounds(),true):null;
				    			 	}
				    			 	snycAnimation1 = false;
				    			 	dv_viewer2?dv_viewer2.setMouseNavEnabled(true):null;
				    			 	
							    	// viewer.setFullScreen(true);
				    			 }

				    			 function _animationEvent(e){
				    			 	var userData = e.userData;
				    			 	dv_image_data1 = _context.getImageData(0, 0,_canvas.width,_canvas.height);
				    			 	_canvasURL1 = _canvas.toDataURL();
				    			 	dv_annos_drawer1.draw();
				    			 	if(snycAnimation1){
				    			 		(dv_viewer2&&dv_viewer2.viewport)?dv_viewer2.viewport.fitBounds(_viewport.getBounds()):null;
				    			 	}
				    			 }
						}
						this.createViewer2 = function(){
				    			var _viewer,		    			 	
			    			 	_drawer,
			    			 	_canvas,
			    			 	_context,
			    			 	_viewport,
			    			 	_acid = dv_image_info2.docObject.acid,
			    			 	_tilepath = dv_page_info2.sliceurl+"/"+_acid+"_"+dv_page2.page1+".xml",
			    			 	isinitanno = true;

			    			 	dv_viewer2 = _viewer = _viewer2 = OpenSeadragon({
							        id: "dvviewer2",
							        element:_dvCanvas2.get(0),
							        prefixUrl: "images/",
							        tileSources: _tilepath,
							        minZoomImageRatio:"1",
							        maxZoomLevel:"13",
							        showNavigationControl:false,
							        crossOriginPolicy:true
							    });

				    			 _viewer.addHandler("open",_openEvent);
				    			 _viewer.addHandler("animation-start",_animationStartEvent);
				    			 _viewer.addHandler("animation-finish",_animationFinshEvent,{"test":"animation"});
				    			 _viewer.addHandler("animation",_animationEvent,{"test":"animation"});

				    			 function _openEvent(e){
				    			 	_viewer = e.eventSource,
				    			 	_drawer = _viewer.drawer,
				    			 	_canvas = _drawer.canvas,
				    			 	_context = _drawer.context,
				    			 	_viewport = _viewer.viewport,
				    			 	$canvas = $(_canvas);
				    			 	dv_annos_drawer2 = new DVAnnotationsClass(_viewer);

				    			 
				    			 	$canvas.bind("mousedown",{},_canvasMousedownEvent);
									$canvas.bind("mousemove",{},_canvasMousemoveEvent);
									$canvas.bind("mouseup",{},_canvasMouseupEvent);

									if(_canvas.addEventListener){
										_canvas.addEventListener("touchstart",_canvasMousedownEvent);
										_canvas.addEventListener("touchmove",_canvasMousemoveEvent);
										_canvas.addEventListener("touchend",_canvasMouseupEvent);
									}

									function _canvasMousedownEvent(e){
										_that.canvasMousedown(e,_viewer);
									}
									function _canvasMousemoveEvent(e){
										_that.canvasMousemove(e,_viewer);
									}
									function _canvasMouseupEvent(e){
										_that.canvasMouseup(e,_viewer);
									}

				    			 	setTimeout(function(){
				    			 		if(_isResetURL2){
					    			 		_canvasURL2 = _canvas.toDataURL();
					    			 		_isResetURL2 = false;
					    			 	}
					    			 	dv_image_data2 = _context.getImageData(0, 0,_canvas.width,_canvas.height);
				    			 		_canvasURL2 = _canvas.toDataURL();
				    			 		dv_annos_drawer2.draw();
				    			 	}, 1000);   
				    			 	
				    			 	u.log("open2");
				    			 	
				    			 }

				    			 function _animationStartEvent(e){
				    			 	if(!snycAnimation1){
				    			 		snycAnimation2 = true;
				    			 		dv_viewer1?dv_viewer1.setMouseNavEnabled(false):null;
				    			 	}

				    			 }

				    			 function _animationFinshEvent(e){
				    			 	var userData = e.userData;
				    			 	if(isinitanno){
					    			 	setTimeout(function(){
					    			 		dv_image_data2 = _context.getImageData(0, 0,_canvas.width,_canvas.height);
					    			 		_canvasURL2 = _canvas.toDataURL();
					    			 		dv_annos_drawer2.draw();
					    			 	}, 1000);   
					    			 	isinitanno = false; 			 	
				    			 	}else{
				    			 		setTimeout(function(){
					    			 		dv_annos_drawer2.draw();
					    			 	}, 1000);   
				    			 	}
				    			 	// u.log(_viewport.getBounds())
				    			 	if(snycAnimation2){
				    			 		(dv_viewer1&&dv_viewer1.viewport)?dv_viewer1.viewport.fitBounds(_viewport.getBounds(),true):null;
				    			 	}
				    			 	snycAnimation2 = false;
				    			 	dv_viewer1?dv_viewer1.setMouseNavEnabled(true):null;
				    			 	
				    			 }

				    			 function _animationEvent(e){
				    			 	var userData = e.userData;
				    			 	dv_image_data2 = _context.getImageData(0, 0,_canvas.width,_canvas.height);
				    			 	_canvasURL2 = _canvas.toDataURL();
				    			 	dv_annos_drawer2.draw();
				    			 	if(snycAnimation2){
				    			 		(dv_viewer1&&dv_viewer1.viewport)?dv_viewer1.viewport.fitBounds(_viewport.getBounds()):null;
				    			 	}
				    			 	
				    			 }

			    			}
						this.createViewer = function(){}

				    		this.initEvents = function(){
				    			var _toggleInterval;

				    			_differentLabel.bind("click",{},_differentLabelClickEvent);
				    			_toggleLabel.bind("click",{},_toggleLabelClickEvent);

				    			function _differentLabelClickEvent(e){
				    				if(_toggleInterval){
				    					window.clearInterval(_toggleInterval);
				    					_dvCanvas3.empty();
				    				}
				    			}

				    			function _toggleLabelClickEvent(e){
				    				var _toggle = true;
				    				function _interval(){
				    					if(_toggle){			    						
				    						_dvCanvas3.html(eu.img(null,{"src":_canvasURL2}));
				    					}else{
				    						_dvCanvas3.html(eu.img(null,{"src":_canvasURL1}));
				    					}
				    					_toggle = !_toggle;
				    					
				    				}
				    				if(_toggleInterval){
				    					window.clearInterval(_toggleInterval);
				    				}
				    				_toggleInterval = window.setInterval(_interval,1000);
				    			}
				    		}

						this.init();
			    	}
			    		
			    	DVPageCanvaClass = function(){
			    		DVCanvaClass.prototype.constructor.call(this);
			    		var eu = DVEleUtil,_that = this,
						_dvCanvas,_viewer,_pageinfo,_imageinfo,_dvpagePanel;
						function _initData(){
							_pageinfo = dv_page_info_page;
							if(dv_brand==BRAND){								
								_imageinfo = dv_image_info;
								_dvpagePanel = DVPageNavigate.pageNav.getPanel();								
							}else if(dv_brand==BRAND_COMPARE){
								if(dv_current_num.length==1){
									if(dv_current_num[0]==1){
										_imageinfo = dv_image_info1;
										_dvpagePanel = DVPageNavigate.pageNav.getPanel()[0];
									}else if(dv_current_num[0]==2){
										_imageinfo = dv_image_info2;
										_dvpagePanel = DVPageNavigate.pageNav.getPanel()[1];
									}
								}
							}
						}
						this.getCanvasElement = function(){
							return _dvCanvas;
						}
			    		this.initElement = function(){						
						
							_dvCanvas2pages = eu.div("dvCanvas2pages");
							_dvCanvas = dv_jq_canvas_page = eu.div("dvCanvas");
							_dvCanvas2pages.append(_dvCanvas);
							_dvCanvasContaiiner_layout.append(_dvCanvas2pages);
							_dvCanvas2pages.hide();
						}
						this.openViewer = function(){
							var dvsep = DVToolbar.Toolbar.getDVSeparate(),
							bean = dvsep?dvsep.getSelectedBean():null,_url,
							_page;
							_initData();
							_page = _dvpagePanel.getCurrentPage2()
							if((!bean)||bean.data=="All"){
	    						_url = _pageinfo.sliceurl+"/"+_imageinfo.docObject.acid+"_"+_page+".xml";
	    					}else{
	    						_url = _pageinfo.sliceurl+"/separations/"+_imageinfo.docObject.acid+"_"+_page+"."+bean.data+".xml";
	    					}
							_viewer?_viewer.open(_url):_that.createViewer(_url);							
						}
			    		this.createViewer = function(url){
			    			var _drawer,
		    			 	_canvas,
		    			 	_context,
		    			 	_viewport,
		    			 	_acid,
							_page,
		    			 	_tilepath=url?url:"";

		    			 	_initData();
		    			 	_acid = _imageinfo.docObject.acid;
		    			 	_page = _dvpagePanel.getCurrentPage2();
		    			 	// _tilepath = _pageinfo.sliceurl+"/"+_acid+"_"+_page+".xml"

			    			 dv_viewer_page = _viewer = OpenSeadragon({
						        id: "dvpageviewer",
						        element:_dvCanvas.get(0),
						        prefixUrl: "images/",
						        tileSources: _tilepath,
						        minZoomImageRatio:"1",
						        maxZoomLevel:"13",
						        showNavigationControl:false
						    });
			    			    
			    			
			    		}

			    		this.initEvents = function(){
			    			var isinitanno = true
			    			 _viewer.addHandler("open",_openEvent);
			    			 _viewer.addHandler("animation-finish",_animationFinshEvent,{"test":"animation"});
			    			 _viewer.addHandler("animation",_animationEvent,{"test":"animation"});

			    			 function _openEvent(e){
			    			 	_viewer = e.eventSource,
			    			 	_drawer = _viewer.drawer,
			    			 	_canvas = _drawer.canvas,
			    			 	_context = _drawer.context,
			    			 	_viewport = _viewer.viewport,
			    			 	$canvas = $(_canvas);
			    			 	dv_annos_drawer_page = new DVAnnotationsClass(_viewer);
			    			 

								$canvas.bind("mousedown",{},_canvasMousedownEvent);
								$canvas.bind("mousemove",{},_canvasMousemoveEvent);
								$canvas.bind("mouseup",{},_canvasMouseupEvent);

								if(_canvas.addEventListener){
									_canvas.addEventListener("touchstart",_canvasMousedownEvent);
									_canvas.addEventListener("touchmove",_canvasMousemoveEvent);
									_canvas.addEventListener("touchend",_canvasMouseupEvent);
								}

								function _canvasMousedownEvent(e){
									_that.canvasMousedown(e,_viewer);
								}
								function _canvasMousemoveEvent(e){
									_that.canvasMousemove(e,_viewer);
								}
								function _canvasMouseupEvent(e){
									_that.canvasMouseup(e,_viewer);
								}
								setTimeout(function(){
				    			 		dv_image_data_page = _context.getImageData(0, 0,_canvas.width,_canvas.height);
				    			 		dv_annos_drawer_page.draw();
				    			 		// viewport.setRotation(viewport.getRotation()+90)
				    			 	}, 1000);   
			    			 	u.log("open");
			    			 }

			    			 function _animationFinshEvent(e){
			    			 	var userData = e.userData;
			    			 	if(isinitanno){
				    			 	setTimeout(function(){
				    			 		dv_image_data_page = _context.getImageData(0, 0,_canvas.width,_canvas.height);
				    			 		dv_annos_drawer_page.draw();
				    			 	}, 1000);   
				    			 	isinitanno = false; 			 	
			    			 	}else{
			    			 		setTimeout(function(){
				    			 		dv_annos_drawer_page.draw();
				    			 	}, 1000);   
			    			 	}
						    	u.log(e);
						    	u.log(_viewport.getZoom());
			    			 }

			    			 function _animationEvent(e){
			    			 	var userData = e.userData;
			    			 	dv_image_data_page = _context.getImageData(0, 0,_canvas.width,_canvas.height);
			    			 	dv_annos_drawer_page.draw();
			    			 	
			    			 }
			    		}
			    		this.init();
		    		}
	    		
		    		// Inherit DVCanvaClass
					DVUtil.extend(DVCanvaClass,DVNormalCanvaClass);
					DVUtil.extend(DVCanvaClass,DVCompareCanvaClass);
					DVUtil.extend(DVCanvaClass,DVPageCanvaClass);

		    	})(DVCanva,DVUtil);

		    	(function(main){
		    		DVClass = function(){
					//private
					var events = {},
					_that = this;
					function _attachEvents(){
						/*$(function(){
							_dvSliderIcon.draggable({ 
					    		axis: "x",
					    		containment: [_dvMain_layout.width()*0.1,0,_dvMain_layout.width()*0.8,0],
					    		cursor: "col-resize",
					    		drag: events.sliderDragEvent
					    	});
						})*/
						
						// window.addEventListener("onresize",events.initDVSize,false);
						// window.addEventListener("onload",events.initDVSize,false);
						_window.bind("resize",{},events.initDVSize);
						_window.bind("load",{},events.initDVSize);

					}
					(function(es){
						es.sliderDragEvent = function( event, ui ) {
				    			
				    		} 
				    		es.initDVSize = function(){
				    			var w = _dvMain_layout.width(),
						    	h = _dvMain_layout.height(),
						    	topToolH = _dvToolbar_layout.height(),
						    	bottomToolH = _dvBottomToolbar_layout.height()+5,
						    	RLTabH = h-topToolH-bottomToolH;

						    	
						    	_dvListTab_layout.width(w*0.2).height(RLTabH);
						    	_dvPageNav_layout.width(w*0.2).height(RLTabH);
						    	DVToolbar.Toolbar?DVToolbar.Toolbar.updLayout():null;
						    	
						    	_dvCanvas_layout
						    	.height(h-_dvToolbar_layout.height());
						    	(DVPageNavigate&&DVPageNavigate.pageNav)?DVPageNavigate.pageNav.fitSize(RLTabH):null;
						    	
				    		}
					})(events);
					

					//public					
					this.initDavinci = function(){
						_that.initLayoutElement();
						_attachEvents();
					}
					this.initLayoutElement = function(){
						var eu = DVEleUtil,u=DVUtil;
						
						if(u.isJQ(_dvMain_layout)){
							_dvMain_layout.remove();
						}
						_dvMain_layout = eu.div("dvMain_layout",{"serial_number":SERIAL_NUMBER});
						_dvToolbar_layout = eu.div("dvToolbar_layout");
						_dvToolbar = eu.nav("navbar navbar-default",{"role":"navigation"},{"margin-bottom":"0","z-index":"999"});
						_dvListTab_layout = eu.div("dvListTab_layout");
						_dvListTab = eu.div("dvListTab");

						
						_dvPageNav_layout = eu.div("dvPageNav_layout");

						// _dvSliderIcon = eu.img("dvSliderIcon",{"src":ICON_SLIDER});
						_dvCanvas_layout = eu.div("dvCanvas_layout");
						_dvCanvasContaiiner_layout = eu.div("dvCanvasContaiiner_layout");
						_dvBottomToolbar_layout = eu.div("dvBottomToolbar_layout");
						
						//toolbar
						_dvToolbar_layout.append(_dvToolbar);
						//annotation/approval list
						// _dvListTab.append(_dvSliderIcon);
						_dvListTab_layout.append(_dvListTab);
						//dv canvas
						_dvCanvas_layout.append(_dvCanvasContaiiner_layout);

						_dvMain_layout
						.append(_dvToolbar_layout)
						.append(_dvListTab_layout)
						.append(_dvPageNav_layout)
						.append(_dvCanvas_layout)
						.append(_dvBottomToolbar_layout);

						PUBLIC_CONFIGS.containerElement.append(_dvMain_layout);
					}
					this.initConfigData = function(callback){
						var sessionType = 1,
						clenable = 1,
						enabledActions = "",
						status = "1,2,3",
						session;

						DVUtil.callJSON("clientConfig.davinci",{"sessionKey":PUBLIC_CONFIGS.session_key,"dataType":DATA_TYPE},null,_success,_fail)
						function _success(data){
							dv_config_bean = data;
							if(dv_config_bean&&dv_config_bean.sessionType){
								session = dv_config_bean.sessionType.filter(function(index) {
									if(index.accessLevels==PUBLIC_CONFIGS.access_level){
										return true;
									}
									return false;								
								});
								DVUtil.log(session);
								if(session&&session.length>0){
									dv_session = session[0];
									dv_action_list = session[0].enabledActions.split(",");
								}else{								
									DVUtil.error("No found session type, check the 'PUBLIC_CONFIGS.access_level' or clientConfig.davinci 's callback.");
									//throw Error("");
								}
							}
							callback(data);
						}
						function _fail(data){
							callback(data);
							throw Error(data);
						}
						
						
						
					}

					this.setDVInContainer = function(container){
						container.append(_dvMain_layout);
					}
					this.getDVType = function(){
						return _dvClientType;
					}
					this.initElement = function(){}
					this.initPageInfo = function(){}
					this.get2PageInfo = function(page,successCallback,errorCallback){
						
						DVUtil.callJSON("pageinfo.davinci",{"sessionid":PUBLIC_CONFIGS.session_id,"num":DVUtil.getNum(),"dataType":DATA_TYPE,"page":page},null,_success,_fail);
						function _success(data){
							dv_page_info_page = data;
							typeof successCallback=="function"?successCallback(data):"";				
						}
						function _fail(data){
							typeof errorCallback=="function"?errorCallback(data):"";
							throw Error(data);
						}
					}
					this.initUserPreference = function(callback){
						DVUtil.callJSON("userpreference.davinci",{"sessionid":PUBLIC_CONFIGS.session_id,"action":"r","dataType":DATA_TYPE},null,_success,_fail);
						function _success(data){
							dv_user_preference = data;		
							callback(data);
						}
						function _fail(data){
							callback({"error":data});
							// throw Error(data);
						}
					}
					this.init = function(){
						_that.initConfigData(function(){
							_that.initUserPreference(function(data){
								if(data&&data.error){
									_that.initDavinci();
									// DVToolbar.Toolbar = new DVToolbarClass();	
									DVEleUtil.openDialog("alert",data.error,"").open();
								}else{
									_that.initDavinci();
									DVToolbar.Toolbar = new DVToolbarClass();	
									DVTableList.TabNav = new DVTabNavClass();						
									DVBottomToolbar.BToolbar = new DVBottomToolbarClass();		
									dv_canvas_page = new DVPageCanvaClass();	
									//_that.initPageInfo(function(){
										//_that.initImageInfo(function(){
											
											_that.createCanvas();
											//DVPageNavigate.pageNav = new DVPageNavigateClass();
											
										//});
									//});
								}
								


							});
						});
						
					}
					
				}

				DVClientClass = function(){
					DVClass.prototype.constructor.call(this);
					var _that = dv_davinci = this;
					
					this.createCanvas = function(){
						dv_canvas =  new DVNormalCanvaClass();						
					}
					this.getCanvasEle = function(){
						return _dvCanvas;
					}
					
					this.initImageInfo = function(callback){
						function _fail(data){
							callback(data);
							throw Error(data);
						}
						
						DVUtil.callJSON("imageinfo.davinci",{"sessionid":PUBLIC_CONFIGS.session_id,"num":0,"dataType":DATA_TYPE},null,_success,_fail);
						function _success(data){
							DVUtil.log("imageinfo.davinci");
							dv_image_info = data;
							if(dv_image_info){
								dv_annotations = dv_image_info.docObject.annotations;
								dv_approvals = dv_image_info.docObject.approvals;
								DVTableList.TabNav.annolistUpdate();
							}
							callback(data);
						}
					}
					this.initPageInfo = function(callback){
						
						DVUtil.callJSON("pageinfo.davinci",{"sessionid":PUBLIC_CONFIGS.session_id,"num":0,"dataType":DATA_TYPE,"page":1},null,_success,_fail);
						function _success(data){
							dv_page_info = data;	
							callback(data);						
						}
						function _fail(data){
							callback(data);
							throw Error(data);
						}
					}

					this.getPageInfo = function(page,successCallback,errorCallback){
						DVUtil.callJSON("pageinfo.davinci",{"sessionid":PUBLIC_CONFIGS.session_id,"num":0,"dataType":DATA_TYPE,"page":page},null,_success,_fail);
						function _success(data){
							dv_page_info = data;
							typeof successCallback=="function"?successCallback(data):"";			
						}
						function _fail(data){
							typeof errorCallback=="function"?errorCallback(data):"";
							throw Error(data);
						}
					}
					dv_brand = BRAND;
					_dvClientType = "NomalClient";
					_that.init ();
				}

				DVCompareClass = function(){
					DVClass.prototype.constructor.call(this);
					var _that = dv_davinci = this;
					DVUtil.log(["dv_davinci",dv_davinci])
					this.createCanvas = function(){
						dv_canvas_compare =  new DVCompareCanvaClass();
					}
					this.initImageInfo = function(callback){

						
						function _fail(data){
							callback(data);
							throw Error(data);
						}
						

						(function(){
							
							DVUtil.callJSON("compareimagesinfo.davinci",{"sessionid":PUBLIC_CONFIGS.session_id,"dataType":DATA_TYPE},null,_success,_fail)
							function _success(data){
								if(data){
									dv_image_info1 = DVUtil.convertBean(data,{
										"firstName":"firstName",
										"lastName":"lastName",
										"docPath":"docPath1",
										"upLoadPath":"upLoadPath1",
										"clientIP":"clientIP",
										"userId":"userId",
										"imgurl":"imgurl1",
										"docObject":"docObject1",
										"timeout":"timeout"});
									dv_image_info2 = DVUtil.convertBean(data,{
										"firstName":"firstName",
										"lastName":"lastName",
										"docPath":"docPath2",
										"upLoadPath":"upLoadPath2",
										"clientIP":"clientIP2",
										"userId":"userId",
										"imgurl":"imgurl2",
										"docObject":"docObject2",
										"timeout":"timeout"});
								}
								if(dv_image_info1){
									dv_annotations1 = dv_image_info1.docObject.annotations;
									dv_approvals1 = dv_image_info1.docObject.approvals;
								}
								if(dv_image_info2){
									dv_annotations2 = dv_image_info2.docObject.annotations;
									dv_approvals2 = dv_image_info2.docObject.approvals;
								}
								DVTableList.TabNav.annolistUpdate();
								callback(data);
							}
						})();
						
					}

					this.initPageInfo = function(callback){
						function _fail(data){
							callback(data);
							throw Error(data);
						}
						(function(){
							DVUtil.callJSON("pageinfo.davinci",{"sessionid":PUBLIC_CONFIGS.session_id,"num":0,"dataType":DATA_TYPE,"page":dv_page1.page1},null,_success,_fail);
							function _success(data){
								dv_page_info1 = data;							
								callback(data);
							}
						})();

						(function(){
							DVUtil.callJSON("pageinfo.davinci",{"sessionid":PUBLIC_CONFIGS.session_id,"num":1,"dataType":DATA_TYPE,"page":dv_page2.page1},null,_success,_fail);
							function _success(data){
								dv_page_info2 = data;	
								callback(data);						
							}
						})();
						
					}
					this.getPageInfo1 = function(page,callback){
						DVUtil.callJSON("pageinfo.davinci",{"sessionid":PUBLIC_CONFIGS.session_id,"num":0,"dataType":DATA_TYPE,"page":page},null,_success,_fail);
						function _success(data){
							dv_page_info1 = data;
							typeof callback=="function"?callback(data):null;			
						}
						function _fail(data){
							typeof callback=="function"?callback({"error":data}):null;
							throw Error(data);
						}
					}
					this.getPageInfo2 = function(page,callback){
						DVUtil.callJSON("pageinfo.davinci",{"sessionid":PUBLIC_CONFIGS.session_id,"num":1,"dataType":DATA_TYPE,"page":page},null,_success,_fail);
						function _success(data){
							dv_page_info2 = data;
							typeof callback=="function"?callback(data):null;				
						}
						function _fail(data){
							typeof callback=="function"?callback({"error":data}):null;
							throw Error(data);
						}
					}
					dv_brand = BRAND_COMPARE;
					_dvClientType = "CompareClient";
					_that.init();
				}

				DVVideoClass = function(){
					DVClass.prototype.constructor.call(this);

					dv_brand = BRAND_VIDEO;
				}
				// Inherit DVClass
				DVUtil.extend(DVClass,DVClientClass);
				DVUtil.extend(DVClass,DVCompareClass);
				DVUtil.extend(DVClass,DVVideoClass);

		    	})(DVMain);
			


		    	//DavinciClass public
			this.init = function(){
				switch(DVTYPE){
					case DVTYPES.NORMAL:
						dv_davinci = new DVClientClass();						
					break;
					case DVTYPES.COMPARE:
						dv_davinci = new DVCompareClass();
					break;
					case DVTYPES.VIDEO:
						dv_davinci = new DVVideoClass();
					break;
				}
			}

			this.init();

			return dv_davinci;

		}
		
		$.fn.davinciClient = function(configArguments){
			configArguments?configArguments.containerElement = this:DVUtil.error("configArguments is undefined.");
			davinci = new DavinciClass(DVTYPES.NORMAL,configArguments);
			// davinci.setDVInContainer(this);
			return davinci;
		}
		$.fn.davinciCompare = function(configArguments){
			configArguments?configArguments.containerElement = this:DVUtil.error("configArguments is undefined.");
			davinci = new DavinciClass(DVTYPES.COMPARE,configArguments);
			// davinci.setDVInContainer(this);
			return davinci;
		}
		$.fn.davinciVideo = function(configArguments){
			configArguments?configArguments.containerElement = this:DVUtil.error("configArguments is undefined.");
			davinci = new DavinciClass(DVTYPES.VIDEO,configArguments);
			// davinci.setDVInContainer(this);
			return davinci;
		}

		// DVTestData = testdata?testdata:{};
	
    })(jQuery);