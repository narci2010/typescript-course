// 实现
// 思路：用一个变量来标识当前是否已经为某个类创建过对象，如果是，则在下一次获取该类的实例时，直接返回之前创建的对象，否则返回新对象。

// 饿汉模式
// 特点：类加载时就初始化。
class Singleton {
  private static instance = new Singleton()

  // 将 constructor 设为私有属性，防止 new 调用
  private constructor() {}

  static getInstance(): Singleton {
    return Singleton.instance
  }
}

const singleton1 = Singleton.getInstance()
const singleton2 = Singleton.getInstance()
console.log(singleton1 === singleton2) // true

// 懒汉模式
// 特点：需要时才创建对象实例。
class Singleton2 {
  private static instance: Singleton2
  private constructor() {}
  static getInstance(): Singleton2 {
    if (!Singleton2.instance) {
      Singleton2.instance = new Singleton2()
    }
    return this.instance
  }
}
const singleton3 = Singleton.getInstance()
const singleton4 = Singleton.getInstance()
console.log(singleton3 === singleton4) // true
