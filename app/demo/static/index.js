
var orderID = getOrderID();
var version = '0.1';
var content = $('.dialog-contaier');
var conDom = document.getElementById('mainCon');
var timer = false;
var userSend = '';


var tpl = {
	answerTpl: '<p class="des left"><img src="images/logo.png"><span>{{data}}</span></p>',
	recomendTpl : '' +
		'<div class="dd-nav">' +
            '<div class="nav-wrap">' +
            	'<div id="nav-bar" class="wrap">' +
            		'{{#data}}' +
                	'<a href="{{detail_url}}" target="_blank" class="item">' +
                        '<img src="{{img_url}}" alt="">' +
                        '<span class="title text_ellipsis_2">{{name}}</span>' +
                    '</a>' +
	                '{{/data}}' +
	            '</div>' +
            '</div>' +
        '</div>',
    askTpl: '<p class="des"><img src="images/male.png"><span>{{data}}</span></p><p class="des left loading"><img src="images/logo.png"><span><img class="load-image" src="images/loading.gif" alt="" /></span></p>',
}

$(document).on('touchstart', '#btn', function(e) {

	clearTimeout(timer);
	userSend = $('#text').val();
	if(userSend == ''){
		alert('不能发送空消息'); 
		return;
	}

	content.append(Mustache.render(tpl.askTpl, {
        data : userSend,
        isLeft : 0
    }));
	$('#text').val('');

	setTimeout("getRequest()", 200); 

});



$(document).on('touchstart', '.clear-btn', function(e) {

	clearTimeout(timer);
	content.html('');
	orderID = getOrderID();
})

function getRequest(type){

	var data = {
		"session_id" : orderID,
	    "chat_info_raw" : type == 'auto'? '' : userSend,
	    "version" : version
	}

	$.ajax({
	     url : 'http://39.106.31.89:8080/MedOnline/chat',
	     data : data,
	     dataType : "jsonp",
	     success : function(data){
	        if(data && data.code == 200 && data.response){

	        	$('.loading').remove();
	        	content.append(Mustache.render(tpl.answerTpl, {
			        data : data.response,
			        isLeft : 1
			    }));
			    if(data.meds && data.meds.length > 0){
			    	content.append(Mustache.render(tpl.recomendTpl, {
				        data : data.meds,
				    }));
			    }

			    conDom.scrollTop = conDom.scrollHeight;  

	        }else{
	        	$('.loading').remove();
	        }

	        // 开始轮训
			timer = setTimeout("getRequest('auto')", 2000); 
	     }
	});
}

function getOrderID(){
	var date = new Date;
 	var year = date.getFullYear(); 
 	var month = date.getMonth()+1;
 	var sed = date.getTime();
 	return year + '/' + month + '/' + sed;
}

$(function () {
	//微信内置浏览器浏览H5页面弹出的键盘遮盖文本框的解决办法 
	window.addEventListener("resize", function () {
		if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA" || document.activeElement.tagName == "BUTTON") {
			window.setTimeout(function () {
				document.activeElement.scrollIntoViewIfNeeded();
			}, 0);
		}
	})
})

$('input,button').on('touchstart', function () {
	var target = this;
	setTimeout(function(){
		target.scrollIntoView(true);
	},100);
});

timer = setTimeout("getRequest('auto')", 1000); 

