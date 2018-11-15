/**** 绘制棋盘 start*/
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
/**** 绘制棋盘 end*/

/**** 初始化棋盘数据 start*/
//设置棋子颜色
let chessElement = true
//初始化棋盘点
let chessBoard = []
for (let i = 0; i < 15; i++) {
    chessBoard[i] = []
    for (let j = 0; j < 15; j++) {
        chessBoard[i][j] = 0
    }
}
//定义一个赢法数组
let wins = []
for (let i = 0; i < 15; i++) {
    wins[i] = []
    for (let j = 0; j < 15; j++) {
        wins[i][j] = []
    }
}
//填充赢法数组
let count = 0   //总的赢法多少种
//1.所有竖可以赢得赢法
for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 11; j++) {
        //一个起始点 五个连起来就是一种赢法
        for (let k = 0; k < 5; k++) {
            wins[i][j + k][count] = true
        }
        count++
    }
}
//2.所有横可以赢得赢法
for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 11; j++) {
        for (let k = 0; k < 5; k++) {
            wins[j + k][i][count] = true
        }
        count++
    }
}
//3.正斜可以赢得赢法
for (let i = 0; i < 11; i++) {
    for (let j = 0; j < 11; j++) {
        for (let k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true
        }
        count++
    }
}
//4.反斜可以赢得赢法
for (let i = 0; i < 11; i++) {
    for (let j = 14; j > 3; j--) {
        for (let k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true
        }
        count++
    }
}
// console.log(`总共赢法有:${count}种`)
//初始化我的赢法数组和电脑赢法数组
let myWin = []
let computerWin = []
for (let i = 0; i < count; i++) {
    myWin[i] = 0
    computerWin[i] = 0
}
//初始化我的
/**** 初始化棋盘数据 end*/
let gameOver = true

/**** 内部函数方法 */
//给棋盘绑定点击事件
chess.onclick = function (e) {
    if (!gameOver) { //游戏结束return出去
        return
    }
    if (!chessElement) { //电脑下return出去
        return
    }
    let x = e.offsetX
    let y = e.offsetY
    let i = Math.floor(x / 30)
    let j = Math.floor(y / 30)
    if (chessBoard[i][j] == 0) { //没有占用可以落子
        chessPieces(i, j, chessElement)
        chessBoard[i][j] = 1    //黑子
        //落子后赢法处理
        for (let k = 0; k < count; k++) {
            if (wins[i][j][k]) {
                myWin[k]++  //如果这里占用了一个字，则对手就不可能在这种情况下赢
                computerWin[k] = 10 //设置一个异常数，表示不可能赢
                if (myWin[k] == 5) {
                    window.alert('你赢了')
                    gameOver = false
                }
            }
        }
        //如果没有结束 调用AI
        if (gameOver) {
            chessElement = !chessElement   //切换到电脑下
            computerAI()
        }
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
//人工智能
function computerAI() {
    //本示例使用 积分来驱动
    let myScore = []                //我的积分
    let computerScore = []          //计算机积分
    let max = 0                     //最高分
    let u = 0, v = 0                    //计算机落子点
    for (let i = 0; i < 15; i++) {
        myScore[i] = []
        computerScore[i] = []
        for (let j = 0; j < 15; j++) {
            myScore[i][j] = 0
            computerScore[i][j] = 0
        }
    }
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            if (chessBoard[i][j] == 0) {    //如果没有落子地方
                for (let k = 0; k < count; k++) {
                    if (wins[i][j][k]) {
                        if (myWin[k] == 1) {
                            myScore[i][j] += 200
                        } else if (myWin[k] == 2) {
                            myScore[i][j] += 400
                        } else if (myWin[k] == 3) {
                            myScore[i][j] += 2000
                        } else if (myWin[k] == 4) {
                            myScore[i][j] += 10000
                        }
                        if (computerWin[k] == 1) {
                            computerScore[i][j] += 220
                        } else if (computerWin[k] == 2) {
                            computerScore[i][j] += 420
                        } else if (computerWin[k] == 3) {
                            computerScore[i][j] += 2100
                        } else if (computerWin[k] == 4) {
                            computerScore[i][j] += 20000
                        }
                    }
                }
                if (myScore[i][j] > max) {
                    max = myScore[i][j]
                    u = i
                    v = j
                } else if (myScore[i][j] == max) {
                    if (computerScore[i][j] > computerScore[u][v]) {
                        u = i
                        v = j
                    }
                }
                if (computerScore[i][j] > max) {
                    max = computerScore[i][j]
                    u = i
                    v = j
                } else if (computerScore[i][j] == max) {
                    if (myScore[i][j] > myScore[u][v]) {
                        u = i
                        v = j
                    }
                }
            }
        }
    }
    //落子
    chessPieces(u, v, chessElement)
    chessBoard[u][v] = 2    //白子
    //落子后赢法处理
    for (let k = 0; k < count; k++) {
        if (wins[u][v][k]) {
            computerWin[k]++
            myWin[k] = 10
            if (computerWin[k] == 5) {
                window.alert('计算机赢了')
                gameOver = false
            }
        }
    }
    //如果没有结束,切换到玩家
    if (gameOver) {
        chessElement = !chessElement   
    }
}
