$(function(){
	var canvas = $('#container')[0];
	var ctx = canvas.getContext('2d');

	var canvas_back = $('#container_back')[0];
	var ctx_back = canvas_back.getContext('2d');

	//右手
	var rightHandImg = new Image();
	rightHandImg.src = './images/right_hand.png';

	rightHandImg.onload = function(){
		ctx.drawImage(rightHandImg, 650-323+20, 100);
	};

	var w = 381, h = 496, offsetL = 250, offsetT = 200, plus_flag = true;
	redrawPencil();


	var st = setInterval(function(){
		redrawPencil(true);
	}, 5);

	function redrawPencil(flag){
		if(flag){//画布清空
			canvas_back = $('<canvas id="container_back" width="650" height="800"></canvas>')[0];
			$('#container_back').replaceWith($(canvas_back));
			ctx_back = canvas_back.getContext('2d');
		}
		if(plus_flag && offsetT >= 300){
			plus_flag = false;
		}
		if(!plus_flag && offsetT <= 200){
			plus_flag = true;
		}
		if(plus_flag){
			offsetT++;
		}else{
			offsetT--;
		}
		//左手
		var leftHandImg = new Image();
		leftHandImg.src = './images/left_hand.png';

		leftHandImg.onload = function(){
			ctx_back.drawImage(leftHandImg, -offsetL, offsetT);
		};
		//铅笔芯
		ctx_back.strokeStyle = 'black';
		ctx_back.lineWidth = 2;
		ctx_back.beginPath();
		ctx_back.moveTo(w - offsetL - 2, 104 + offsetT);
		ctx_back.lineTo(w - offsetL - 2 + 96, 104 + offsetT - 32);
		ctx_back.stroke();
	}

	$('body').delegate('#container_back', 'mousedown', function(e) {
		clearInterval(st);
		st = null;

	});



});