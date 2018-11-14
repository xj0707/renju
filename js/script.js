//绘制棋盘
let chess = document.getElementById('chess')
//获取上下文
let context = chess.getContext('2d')
//设置线的颜色颜色
context.strokeStyle = '#bfbfbf'
//增加水印图
let logo = new Image()
logo.src = 'image/muye.png'
logo.onload = function () {
    context.drawImage(logo, 0, 0, 450, 450)
    lineation()
}
//划线
function lineation() {
    for (let i = 0; i < 15; i++) {
        //绘制竖线
        context.moveTo(15 + i * 30, 15) //起点
        context.lineTo(15 + i * 30, 435) //终点
        context.stroke()                  //开始绘制
        //绘制横线
        context.moveTo(15, 15 + i * 30) //起点
        context.lineTo(435, 15 + i * 30) //终点
        context.stroke()                  //开始绘制
    }
}
