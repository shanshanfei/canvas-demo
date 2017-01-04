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


	ctx.beginPath();//开始路径 或者重置当前路径
	ctx.lineWidth = 2;
	ctx.strokeStyle = 'red';
	//这样画出来的直线是2px，具体解释见：http://www.cnblogs.com/q460021417/p/5122524.html
	//ctx.moveTo(50, 100);
	//ctx.lineTo(250, 100);
	ctx.moveTo(50, 230.5);
	ctx.lineTo(350, 230.5);
	ctx.stroke();//真正开始绘制线条

	ctx.beginPath();
	ctx.strokeStyle = 'blue';

	//插播：
	//screenX screenY是相对于屏幕左上角的位置，与滚动无关
	//clientX clientY是相对于浏览器可视区域的位置，随滚动而改变
	//pageX pageY是相对于文档左上角的位置，不随滚动而改变
	//此处按下鼠标绘制竖直线条 用clientX clientY即可

	var startX, startY = 0, need_clear_canvas = false;
	//绘制新线条
	$('#container_back').mousedown(function(e) {
		if(need_clear_canvas){
			ctx_back.beginPath();
			ctx_back.fillStyle = '#fff';
			ctx_back.fillRect(0, 0, 400, 400);
		}
		ctx_back.beginPath();
		ctx_back.lineWidth = 2;
		ctx_back.strokeStyle = 'blue';
		startX = e.clientX - offsetLeft + 0.5, startY = e.clientY - offsetTop;
		ctx_back.moveTo(startX, startY);
	});
	$('#container_back').mousemove(function(e) {
		if(startY){
			ctx_back.lineTo(startX, e.clientY - offsetTop);
			ctx_back.stroke();
		}
	});
	$('#container_back').mouseup(function(e) {
		ctx_back.lineTo(startX, e.clientY - offsetTop);
		ctx_back.stroke();
		ctx_back.beginPath();
		startY = 0;
		need_clear_canvas = true;
		//将竖直线调至水平，并给出对比结果
		//交叉点 (startX, 230.5)
	});
});











/*************************************************************************/

/*
 * 功能说明：预画一条宽300px的线，然后用户画一条竖直的线，长度与预置线相差在2%以内的则算成功
 */
$(function(){
	//初始化
	var canvas = $('#container')[0];
	var ctx = canvas.getContext('2d');

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

	drawBasic();


	//插播：
	//screenX screenY是相对于屏幕左上角的位置，与滚动无关
	//clientX clientY是相对于浏览器可视区域的位置，随滚动而改变
	//pageX pageY是相对于文档左上角的位置，不随滚动而改变
	//此处按下鼠标绘制竖直线条 用clientX clientY即可

	var startX, startY = 0, endY, need_clear_canvas = false, st, width_draw;
	//绘制新线条
	$('#container').mousedown(function(e) {
		if(!st){
			if(need_clear_canvas){
				ctx.rotate(90*Math.PI/180);
				clearCanvas();
			}
			startX = e.clientX - offsetLeft + 0.5, startY = e.clientY - offsetTop;
			ctx.moveTo(startX, startY);
		}
	});
	$('#container').mousemove(function(e) {
		if(!st && startY){
			ctx.lineTo(startX, e.clientY - offsetTop);
			ctx.stroke();
		}
	});
	$('#container').mouseup(function(e) {
		if(!st){
			endY = e.clientY - offsetTop;
			width_draw = endY - startY;
			ctx.lineTo(startX, endY);
			ctx.stroke();
			startY = 0;
			need_clear_canvas = true;
			//将竖直线调至水平，并给出对比结果
			//交叉点 (startX, 230.5)
			redraw();
		}
	});

	function clearCanvas(){
		//以一个空白的矩形覆盖之前的绘制
		ctx.beginPath();
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, 400, 400);

		drawBasic();
	}

	function drawBasic(){
		ctx.beginPath();//开始路径 或者重置当前路径
		ctx.strokeStyle = 'red';
		//这样画出来的直线是2px，具体解释见：http://www.cnblogs.com/q460021417/p/5122524.html
		//ctx.moveTo(50, 100);
		//ctx.lineTo(250, 100);
		ctx.moveTo(50, 230.5);
		ctx.lineTo(350, 230.5);
		ctx.stroke();//真正开始绘制线条

		ctx.beginPath();
		ctx.strokeStyle = 'blue';
	}

	var angle = 0;
	function redraw(){

		st = setInterval(function(){
			console.log('st');
			if(angle > 90){
				clearInterval(st);
				st = null;
			}else{
				//旋转恢复、画布原点恢复
				//ctx.translate(-startX, -(startY + width_draw / 2));
				ctx.rotate(angle*Math.PI/180);
				clearCanvas();
				angle++;
				//ctx.translate(startX, startY + width_draw / 2);
				ctx.rotate(-angle*Math.PI/180);
				ctx.beginPath();
				ctx.strokeStyle = 'blue';
				ctx.moveTo(startX, startY);
				ctx.lineTo(startX, endY);
				ctx.stroke();
			}
		}, 500);
	}
});