// 外观模式 Facade
// 特点：给子系统定义一个统一的接口来方便外面调用，并且可以减少对子系统的直接依赖。
// 用处：当系统实现一个功能需要调用其他库或第三方库的很多功能时，需要有个统一调用维护的地方，这时可以考虑外观模式。
// 注意：和适配器的区别。
// 外观模式的目的主要在于简化调用，只需要一个简单的接口就可以解除对其他类的依赖。
// 下面用TypeScript简单实现一下外观模式：
// 假定现在项目的需求是实现一个简单图表的功能来画出近年来收入曲线图和收入来源配比图，引入一个第三方绘图库。

//第三方绘图库
class Axis {
  draw() {
    console.log('画坐标轴')
  } // 画坐标轴
}
class Line {
  draw() {
    console.log('画曲线')
  } // 画曲线
}
class FanShape {
  draw(angle: number) {
    console.log('画扇形:' + angle)
  } // 画扇形
}
// 项目没必要和第三方的库紧耦合，所以按需求抽象出一个接口Graph：
// 项目接口
interface Graph5 {
  // 只需要两种图表， 线图和饼图
  drawLineChart()
  drawPieChart()
}
// 再用第三方库里的画图功能实现这个接口：
class Chart implements Graph5 {
  // 实现接口
  drawLineChart() {
    new Axis().draw()
    new Line().draw()
  }
  drawPieChart() {
    new FanShape().draw(90)
    new FanShape().draw(180)
    new FanShape().draw(90)
  }
}
let chart = new Chart()
chart.drawLineChart()
chart.drawPieChart()
// 这样项目只需要通过Graph接口来画图表就好了，而不用知道具体的细节。
// 与适配器相同的点是同样是一种封装处理，不同的是适配器已有一个接口，而用这个接口不能使用另外一个系统，这时需要把那个系统做个适配来匹配现有接口，重点在于兼容接口,解决冲突。
// 而外观则是封装现有系统来对外提供一种简单的使用方式，重点在于简化调用。
