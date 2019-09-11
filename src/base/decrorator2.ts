// JS 的装饰器可以用来“装饰”三种类型的对象：类的属性/方法、访问器、类本身
// 1 针对属性/方法的装饰器
// decorator 外部可以包装一个函数，函数可以带参数
export default function decrorator2() {
  function Decorator(type) {
    /**
     * 这里是真正的 decorator
     * @target 装饰的属性所述的类的原型，注意，不是实例后的类。如果装饰的是 Car 的某个属性，这个 target 的值就是 Car.prototype
     * @name 装饰的属性的 key
     * @descriptor 装饰的对象的描述对象
     */
    return function(target, name, descriptor) {
      // 以此可以获取实例化的时候此属性的默认值
      let v = descriptor.initializer && descriptor.initializer.call(target)
      // 返回一个新的描述对象，或者直接修改 descriptor 也可以
      return {
        enumerable: true,
        configurable: true,
        get: function() {
          return v
        },
        set: function(c) {
          v = c
        }
      }
    }
  }
  //例子：
  //    如果我们想让 bark 这个方法成为一个只读的属性，那么可以定义一个readonly 的 decorator：
  // 注意这里的 `target` 是 `Dog.prototype`
  function readonly(target, key, descriptor) {
    descriptor.writable = false
    return descriptor
  }
  //    可以看到，decorator 就是一个普通函数，只不过它接收 3 个参数，与Object.defineProperty 一致。
  //    具体在这里，我们就是把 descriptor 的writable 字段设为 false。
  //       然后把 readonly 作用到 bark 方法上：
  class Dog {
    @readonly
    bark() {
      return 'wang!wang!'
    }
  }
  let dog = new Dog()
  // 运行时错误
  //   dog.bark = function() {
  //     return 'abc'
  //   }
  // Cannot assign to read only property 'bark' of [object Object]

  //  2  针对 访问操作符的装饰
  // 与属性方法类似，就不详述了。
  class Person {
    children: string = 'aaa'
    @nonenumerable
    get kidCount() {
      return this.children.length
    }
  }
  function nonenumerable(target, name, descriptor) {
    descriptor.enumerable = false
    return descriptor
  }
  // 应用在方法上的工厂函数
  function enumerable(isEnumerable) {
    return function(target, key, descriptor) {
      descriptor.enumerable = isEnumerable
    }
  }
  class Dog8 {
    @enumerable(false)
    eat() {}
    @enumerable(true)
    eat2() {}
  }
  for (let i in new Dog8()) {
    console.log(i) //eat2
  }

  //3 针对类的装饰
  // 例如 mobx 中 @observer 的用法
  /**
   * 包装 react 组件
   * @param target
   */
  function observer(target) {
    target.prototype.componentWillMount = function() {
      target && target.call(this)
    }
  }
  // 其中的 target 就是类本身（而不是其 prototype）
  // 这里的 `target` 是类本身
  function doge(target) {
    target.isDoge = true
  }
  @doge
  class Dog3 {}
  //@ts-ignore
  console.log(Dog3.isDoge)
  // true
  //   decorator 也可以是 factory function
  // 如果我们想对不同的目标对象应用同一个 decorator，但同时又需要有一些差别，怎么办？很简单：
  function doge2(isDoge) {
    return function(target) {
      target.isDoge = isDoge
    }
  }
  @doge2(true)
  class Dog5 {}
  //@ts-ignore
  console.log(Dog5.isDoge)
  // true
  @doge2(false)
  class Human {}
  //@ts-ignore
  console.log(Human.isDoge)
  // false

  // 高级点的装饰器
  const memory = someClass => {
    const cache = Object.create(null) // 利用闭包的特性，保留一个Object用于缓存函数返回值
    return (target, name, descriptor) => {
      // console.log(A) //undefined
      //method缓存真实的函数
      const method = descriptor.value
      descriptor.value = function(...args) {
        // console.log('mehtod2:' + method)
        const key = args.join('')
        //console.log('key:' + key)
        if (cache[key]) {
          return cache[key]
        }
        //    const ret = method.call(target, ...args)
        //    const obj = Reflect.construct(target)
        //    const ret = method.apply(target, args)
        const ret = method.apply(this, args)
        cache[key] = ret
        //缓存中间计算结果
        //    console.log('cache[key]:' + cache[key])
        return ret
      }
      return descriptor
    }
  }
  class A {
    i = 100
    get [Symbol.toStringTag]() {
      return 'A'
    }
    //     constructor(i) {
    //       this.i = i
    //     }
    //     @autobind
    // 在类A自己内无法访问A，这个跟Java不一样，故此处A是undefined
    @memory(A) // 实际上是memory函数的返回值作为装饰器
    fib(n) {
      // console.log('go:' + this.i++)
      if (n === 1) return 1
      if (n === 2) return 1
      return this.fib(n - 1) + this.fib(n - 2)
    }
  }
  //   console.log(A) 能够打印A
  const a = new A()
  //   console.log(a)
  let before: Date = new Date()
  console.log('开始执行：a.fib(2000)')
  console.log(a.fib(2000)) // 算的飞快！
  let after: Date = new Date()
  //毫秒
  console.log(after.getMilliseconds() - before.getMilliseconds() + '毫秒')
}
