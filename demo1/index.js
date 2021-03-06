/*
 * 功能说明：预画一条宽300px的线，然后用户画一条竖直的线，长度与预置线相差在2%以内的则算成功
 */
$(function(){
	//初始化
	var canvas = $('#container')[0];
	var ctx = canvas.getContext('2d');

	var canvas_back = $('#container_back')[0];
	var ctx_back = canvas_back.getContext('2d');

	//这种方式 不会 拉伸画布
	//canvas.width = 900;
	//canvas.height = 900;

	//这种方式 会 拉伸画布
	// canvas.style.width = '400px';
	// canvas.style.height = '400px';

	//绘制新钱时，需要减掉相应的偏移量
	var offsetLeft = $('#container').offset().left;
	var offsetTop = $('#container').offset().top;

	ctx.lineWidth = 2;
	ctx_back.lineWidth = 2;

	ctx.beginPath();//开始路径 或者重置当前路径
	ctx.strokeStyle = 'red';
	//这样画出来的直线是2px，具体解释见：http://www.cnblogs.com/q460021417/p/5122524.html
	//ctx.moveTo(50, 100);
	//ctx.lineTo(250, 100);
	ctx.moveTo(50, 230.5);
	ctx.lineTo(350, 230.5);
	ctx.stroke();//真正开始绘制线条

	//插播：
	//screenX screenY是相对于屏幕左上角的位置，与滚动无关
	//clientX clientY是相对于浏览器可视区域的位置，随滚动而改变
	//pageX pageY是相对于文档左上角的位置，不随滚动而改变
	//此处按下鼠标绘制竖直线条 用clientX clientY即可

	var startX, startY = 0, endY, need_clear_canvas = false, st = null, w_draw, mX, mY, tX, tY;
	//绘制新线条
	$('body').delegate('#container_back', 'mousedown', function(e) {
		if(!st){
			if(need_clear_canvas){
				//以一个空白的矩形覆盖之前的绘制
				// ctx_back.translate(0, 0);
				// ctx_back.rotate(90*Math.PI/180);
				// ctx_back.beginPath();
				// ctx_back.fillStyle = '#fff';
				// ctx_back.fillRect(0, 0, 400, 400);

				canvas_back = $('<canvas width="400" height="400" style="border: 1px solid #ccc" id="container_back"></canvas>');
				ctx_back = canvas_back[0].getContext('2d');
				ctx_back.lineWidth = 2;
				$('body #container_back').replaceWith(canvas_back);
			}
			startX = mX = e.clientX - offsetLeft + 0.5, startY = e.clientY - offsetTop;
			ctx_back.strokeStyle = 'blue';
			ctx_back.moveTo(startX, startY);
		}
	});
	$('body').delegate('#container_back', 'mousemove', function(e) {
		if(!st && startY){
			ctx_back.lineTo(startX, e.clientY - offsetTop);
			ctx_back.stroke();
		}
	});
	$('body').delegate('#container_back', 'mouseup', function(e) {
		if(!st){
			endY = e.clientY - offsetTop;
			w_draw = endY - startY;
			if(w_draw % 2){
				endY++;
				w_draw++;
			}
			mY = startY + w_draw / 2;
			ctx_back.lineTo(startX, endY);
			ctx_back.stroke();
			//将竖直线调至水平，并给出对比结果
			//交叉点 (startX, 230.5)
			redraw();
		}
	});

	var angle = 0, speed = 3;
	function redraw(){
		var fX = 50 + w_draw / 2;
		var fY = 240.5;

		st = setInterval(function(){
			console.log('st '+angle);
			if(mX === fX && mY === fY && angle === -90){
				clearInterval(st);
				st = null;
				need_clear_canvas = true;
				startY = 0;
				angle = 0;
			}else{
				//以一个新的canvas替换之前的canvas 平移的同时 进行旋转 直至水平 旋转中心为竖直线的中间点
				canvas_back = $('<canvas width="400" height="400" style="border: 1px solid #ccc" id="container_back"></canvas>');
				ctx_back = canvas_back[0].getContext('2d');
				$('body #container_back').replaceWith(canvas_back);

				angle = (angle - speed > -90) ? (angle - speed) : -90;
				if(Math.abs(mX - fX) > speed ){
					if(fX > mX){
						mX += speed;
					}else{
						mX -= speed;
					}
				}else{
					mX = fX;
				}
				if(Math.abs(mY - fY) > speed ){
					if(fY > mY){
						mY += speed;
					}else{
						mY -= speed;
					}
				}else{
					mY = fY;
				}

				ctx_back.beginPath();
				ctx_back.lineWidth = 2;
				ctx_back.strokeStyle = 'blue';
				ctx_back.translate(mX, mY);
				ctx_back.rotate(angle * Math.PI / 180);
				ctx_back.moveTo(0, -w_draw/2);
				ctx_back.lineTo(0, w_draw/2);
				ctx_back.stroke();
			}
		}, 20);
	}
});