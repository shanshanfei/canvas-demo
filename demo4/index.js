/* 思路：当canvas_back的top值为242时按下，按照轨迹y = 1/3 * x ，最终会正确插入铅笔内
 * 否则会失败
 * 当top > 256 or top < 226时按下，肯定会失败，且铅笔芯不会折断，可以插入深一些
 * 否则插入浅一些
 * 不足：铅笔芯折断的动画 铅笔芯可以正确插入时，笔头盖住笔芯等细节
 */

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

	var st_normal, st_go;
	var w = 381, h = 496, speed = 2, plus_flag = true;
	drawBack();

	$('.box').mousedown(function(e) {
		if(st_normal){
			clearInterval(st_normal);
			st_normal = null;
			var topNum_click = parseInt($('#container_back').css('top')),
				leftNum_click = parseInt($('#container_back').css('left'));
			var boundLeft = -112;
			if(topNum_click > 256 || topNum_click < 226){//注定失败 可以插入深一些
				boundLeft = -22;
			}else if(topNum_click !== 242){
				boundLeft = -100;
			}
			st_go = setInterval(function(){
				console.log('st_go')
				var topNum = parseInt($('#container_back').css('top')),
					leftNum = parseInt($('#container_back').css('left'));
				if(leftNum >= boundLeft){
					clearInterval(st_go);
					st_go = null;
					plus_flag = true;
					var resultImg = new Image();
					if(topNum_click === 242 && topNum === 216){
						resultImg.src = './images/success.png';
					}else{
						resultImg.src = './images/fail.png';
					}
					resultImg.onload = function(){
						ctx_back.drawImage(resultImg, 400, 200);
					};
					setTimeout(function(){
						$('#container_back').replaceWith('<canvas id="container_back" width="650" height="800"></canvas>');
						canvas_back = $('#container_back')[0];
						ctx_back = canvas_back.getContext('2d');
						drawBack();
					}, 500);
					return false;
				}

				//y = 1/3 * x 横轴按3的倍数递增 y轴每次增1
				$('#container_back').css({
					'top': --topNum,
					'left': leftNum + 3
				});
			}, 15);
		}
	});

	function upAndDown(){
		st_normal = setInterval(function(){
			console.log('st_normal')
			//画布移动
			var topNum = parseInt($('#container_back').css('top'));
			if(topNum > 280 && plus_flag){
				plus_flag = false;
			}
			if(topNum < 180 && !plus_flag){
				plus_flag = true;
			}
			if(plus_flag){
				topNum += speed;
			}else{
				topNum -= speed;
			}
			$('#container_back').css('top', topNum);
		}, 20);
	}
	function drawBack(){
		//左手
		var leftHandImg = new Image();
		leftHandImg.src = './images/left_hand.png';

		leftHandImg.onload = function(){
			ctx_back.drawImage(leftHandImg, 0, 0);
		};

		//铅笔芯
		ctx_back.strokeStyle = 'black';
		ctx_back.lineWidth = 2;
		ctx_back.beginPath();
		ctx_back.moveTo(w - 2, 105);
		ctx_back.lineTo(w - 2 + 96, 104 - 32);
		ctx_back.stroke();
		upAndDown();
	}
});