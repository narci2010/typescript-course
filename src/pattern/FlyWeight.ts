// 享元模式 FlyWeight
// 特点：通过缓存来实现大量细粒度的对象的复用，从而提升性能。
// 用处：当有很多类似的对象要频繁创建、销毁时可以考虑享元模式，如线程池。
// 注意：对象的内部状态和外部状态。
// 下面用TypeScript简单实现一下享元模式：

// 假设一个画图场景，里面有很多图元，如圆，矩形等，由于量非常多，且经常刷新，每次刷新new出一批图元，浪费内存是小事，临时小对象太多导致频繁GC才是麻烦事，UI会表现出卡顿。
// 现在用享元模式来解决这个问题，先定义一个图形接口，可以画图，可以被删掉，同时有个isHidden状态来控制该图元是否显示，删除也就是把isHidden设为true，并不真的删除。
// name是个标记，方便看记录信息。
namespace FlyWeight {
  interface Element {
    isHidden: boolean
    name: string
    draw()
    remove()
  }
  // 实现两个图元：圆和矩形，draw只会画不是hidden的，remove则是把isHidden设为true

  class Circle implements Element {
    isHidden: boolean = false

    constructor(public name: string) {
      console.log('真实地创建Circle对象。')
    }

    draw() {
      if (!this.isHidden) {
        console.log(`draw circle: ${this.name}`)
      }
    }

    remove() {
      this.isHidden = true
      console.log(`remove circle: ${this.name}`)
    }
  }

  class Rectangle implements Element {
    isHidden: boolean = false

    constructor(public name: string) {
      console.log('真实地创建Rectangle对象。')
    }

    draw() {
      if (!this.isHidden) {
        console.log(`draw rectangle: ${this.name}`)
      }
    }

    remove() {
      this.isHidden = true
      console.log(`remove rectangle: ${this.name}`)
    }
  }
  // 下面建个图元工厂来创建、维护图元，工厂里维护了一个图元池，包括圆和矩形，工厂除了创建图元外，还可以删掉所有图元，得到图元的数量（可见或不可见的）
  class GraphFactory {
    static readonly instance: GraphFactory = new GraphFactory()

    private graphPool: { [key: string]: Array<Element> } = {} // 图元池

    getCircle(newName: string): Circle {
      return <Circle>this.getElement(newName, Circle)
    }

    getRectangle(newName: string): Rectangle {
      return <Rectangle>this.getElement(newName, Rectangle)
    }

    getCount(isHidden: boolean) {
      // 图元数据
      let count = 0
      for (let item in this.graphPool) {
        count += this.graphPool[item].filter(o => o.isHidden == isHidden).length
      }
      return count
    }

    removeAll() {
      //删除所有
      console.log('remove all')
      for (let item in this.graphPool) {
        this.graphPool[item].forEach(o => (o.isHidden = true))
      }
    }

    //获取图元，如果池子里有hidden的图元，就拿出来复用，没有就new一个并Push到池子里
    private getElement(
      newName: string,
      eleConstructor: typeof Circle | typeof Rectangle
    ): Element {
      if (this.graphPool[eleConstructor.name]) {
        let element = this.graphPool[eleConstructor.name].find(o => o.isHidden)
        if (element) {
          element.isHidden = false
          element.name = newName
          return element
        }
      }
      console.log('private getElement:' + eleConstructor.name + ':' + newName)
      let element = new eleConstructor(newName)
      this.graphPool[eleConstructor.name] =
        this.graphPool[eleConstructor.name] || []
      this.graphPool[eleConstructor.name].push(element)
      return element
    }
  }
  // 代码写完了，分别拿5个圆和5个矩形测试：

  // 先从工厂里分别创建出来并调用draw
  // 打印出当前可见图元数量
  // 移除所有
  // 分别打印可见和不可见图元数量
  // 从工厂里再次分别创建出5个并调用draw
  // 再次分别打印可见和不可见图元数量
  const num = 5
  console.log('create elements')

  for (let i = 1; i <= num; i++) {
    let circle = GraphFactory.instance.getCircle(`circle ${i}`)
    let rectangle = GraphFactory.instance.getRectangle(`rectangle ${i}`)

    circle.draw()
    rectangle.draw()
    //加入下面语句，则内存中只要一个图即可
    //   circle.remove()
    //   rectangle.remove()
  }

  console.log(`element count: ${GraphFactory.instance.getCount(false)}`)

  GraphFactory.instance.removeAll()

  console.log(`visible element count: ${GraphFactory.instance.getCount(false)}`)
  console.log(`hidden element count: ${GraphFactory.instance.getCount(true)}`)

  console.log('create elements again')

  for (let i = 1; i <= num; i++) {
    let circle = GraphFactory.instance.getCircle(`new circle ${i}`)
    let rectangle = GraphFactory.instance.getRectangle(`new rectangle ${i}`)

    circle.draw()
    rectangle.draw()
    //加入下面语句，则内存中只要一个图即可
    //   circle.remove()
    //   rectangle.remove()
  }

  console.log(`visible element count: ${GraphFactory.instance.getCount(false)}`)
  console.log(`hidden element count: ${GraphFactory.instance.getCount(true)}`)
  // 结果：

  // create elements

  // draw rectangle: circle 1
  // draw rectangle: rectangle 1
  // draw rectangle: circle 2
  // draw rectangle: rectangle 2
  // draw rectangle: circle 3
  // draw rectangle: rectangle 3
  // draw rectangle: circle 4
  // draw rectangle: rectangle 4
  // draw rectangle: circle 5
  // draw rectangle: rectangle 5

  // element count: 10

  // remove all

  // visible element count: 0
  // hidden element count: 10

  // create elements again

  // draw rectangle: new circle 1
  // draw rectangle: new rectangle 1
  // draw rectangle: new circle 2
  // draw rectangle: new rectangle 2
  // draw rectangle: new circle 3
  // draw rectangle: new rectangle 3
  // draw rectangle: new circle 4
  // draw rectangle: new rectangle 4
  // draw rectangle: new circle 5
  // draw rectangle: new rectangle 5

  // visible element count: 10
  // hidden element count: 0
  // 可以看到remove all后图元全部hidden，再次创建时并不new出新的，而是从池子里拿出hidden的来复用，也就是利用享元模式，
  // 小对象的数量就可以限制在单次显示最多的那次的数量，少于这个数量的都会从池子里拿，小对象也没有频繁创建销毁，对内存，对GC都是有利的。
}
