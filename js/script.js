
let chessColor = true   //默认黑子
let chessBoard = []       //初始化一个棋盘点
for (let i = 0; i < 15; i++) {
    chessBoard[i] = []
    for (let j = 0; j < 15; j++) {
        chessBoard[i][j] = 0
    }
}
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
    // context.drawImage(logo, 0, 0, 450, 450)  //水印图 目前注释掉 没有合适的图
    lineation()
}
//给棋盘绑定事件
chess.onclick = function (e) {
    let x = e.offsetX
    let y = e.offsetY
    let i = Math.floor(x / 30)
    let j = Math.floor(y / 30)
    if (chessBoard[i][j] == 0) { //没有占用可以落子
        chessPieces(i, j, chessColor)
        if (chessColor) {
            chessBoard[i][j] = 1
        } else {
            chessBoard[i][j] = 2
        }
        chessColor = !chessColor   //交叉改变
    }
}
//创建棋子
function chessPieces(i, j, color) {
    //画棋子（圆）
    context.beginPath()  //开始
    context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI) //圆心坐标，半径，起始幅度
    context.closePath()  //结束
    let gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0) //生成渐变对象
    if (color) {  //黑子
        gradient.addColorStop(0, '#0a0a0a')
        gradient.addColorStop(1, '#636766')
    } else {  //白子
        gradient.addColorStop(0, '#d1d1d1')
        gradient.addColorStop(1, '#f9f9f9')
    }
    context.fillStyle = gradient  //设置颜色
    context.fill() //绘制圆并填充
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
