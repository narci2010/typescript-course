// 定义

// 将抽象部分与他的实现部分分离，使他们都可以独立地变化。

// 结构
// 桥接模式包含以下角色：

// Abstraction（抽象类）：用于定义抽象类的接口，它一般是抽象类而不是接口，其中定义了一个Implementor（实现类接口）类型的对象并可以维护该对象，
// 它与Implementor之间具有关联关系，它既可以包含抽象业务方法，也可以包含具体业务方法。
// RefinedAbstraction（扩充抽象类）：扩充由Abstraction定义的接口，通常情况下它不再是抽象类而是具体类，它实现了在Abstraction中声明的抽象业务方法，
// 在RefinedAbstraction中可以调用在Implementor中定义的业务方法。
// Implementor（实现类接口）：定义实现类的接口，这个接口不一定要与Abstraction的接口完全一致，事实上这两个接口可以完全不同，一般而言，Implementor接口仅提供基本操作，
// 而Abstraction定义的接口可能会做更多更复杂的操作。Implementor接口对这些基本操作进行了声明，而具体实现交给其子类。通过关联关系，在Abstraction中不仅拥有自己的方法，
// 还可以调用到Implementor中定义的方法，使用关联关系来替代继承关系。
// ConcreteImplementor（具体实现类）：具体实现Implementor接口，在不同的ConcreteImplementor中提供基本操作的不同实现，在程序运行时，ConcreteImplementor对象将替换其父类对象，
// 提供给抽象类具体的业务操作方法。

// 汽车是一个维度，有多种不同的车型
abstract class AbstractCar {
  abstract run(): void
}

// 路是一个维度，有多种不同的路
abstract class AbstractRoad {
  car: AbstractCar
  abstract snapshot(): void
}

/**
 * 汽车和路两个维度
 * 桥接就是一个维度的类中引用了另一个维度的对象，但只关心接口不关心是哪个具体的类
 * 从而实现两个维度独立变化
 */
class SpeedRoad extends AbstractRoad {
  constructor(car: AbstractCar) {
    super()
    this.car = car
  }
  snapshot(): void {
    console.log('在高速公路上')
    this.car.run()
  }
}

class Street extends AbstractRoad {
  constructor(car: AbstractCar) {
    super()
    this.car = car
  }
  snapshot(): void {
    console.log('在市区街道上')
    this.car.run()
  }
}

class Car2 extends AbstractCar {
  run(): void {
    console.log('开着小汽车')
  }
}

class Bus extends AbstractCar {
  run(): void {
    console.log('开着公共汽车')
  }
}

function carRunOnRoadDemo(): void {
  // 在高速公路上，开着小汽车
  const car = new Car2()
  const speedRoad = new SpeedRoad(car)
  speedRoad.snapshot()

  // 在市区街道上，开着公共汽车
  const bus = new Bus()
  const street = new Street(bus)
  street.snapshot()
}
carRunOnRoadDemo()

/**
 * 人，汽车和路三个维度
 */
abstract class Person {
  road: AbstractRoad
  abstract see(): void
}

class Man extends Person {
  constructor(road: AbstractRoad) {
    super()
    this.road = road
  }
  see(): void {
    console.log('男人看到')
    this.road.snapshot()
  }
}

class Woman extends Person {
  constructor(road: AbstractRoad) {
    super()
    this.road = road
  }
  see(): void {
    console.log('女人看到')
    this.road.snapshot()
  }
}

function personSeeCarOnRoadDemo() {
  // 男人看到 在市区街道上 开着小汽车
  const car = new Car2()
  const street = new Street(car)
  const man = new Man(street)
  man.see()
}
personSeeCarOnRoadDemo()
//    复制代码适用场景

//    如果一个系统需要在抽象化和具体化之间增加更多的灵活性，避免在两个层次之间建立静态的继承关系，通过桥接模式可以使它们在抽象层建立一个关联关系；
//    “抽象部分”和“实现部分”可以以继承的方式独立扩展而互不影响，在程序运行时可以动态将一个抽象化子类的对象和一个实现化子类的对象进行组合，
//    即系统需要对抽象化角色和实现化角色进行动态耦合；
//    一个类存在两个（或多个）独立变化的维度，且这两个（或多个）维度都需要独立进行扩展；

//    优点

//    分离接口及其实现部分；
//    提高可扩充性；
//    实现细节对客户透明；

//    缺点

//    桥接模式的使用会增加系统的理解与设计难度，由于关联关系建立在抽象层，要求开发者一开始就针对抽象层进行设计与编程；
//    桥接模式要求正确识别出系统中两个独立变化的维度，因此其使用范围具有一定的局限性，如何正确识别两个独立维度也需要一定的经验积累；

//    相关模式

//    抽象工厂模式可以用来创建和配置一个特定的桥接模式。即一个维度的产品都由抽象工厂生成。
//    和适配器模式的区别：适配器模式用来帮助无关的类协同工作，他通常在系统设计完成后才会被使用；桥接模式是在系统开始时就被使用，
//    他使得抽象接口和实现部分可以独立进行改变。
