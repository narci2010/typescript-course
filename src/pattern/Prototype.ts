// 原型模式 Prototype
// 特点：不需要知道对象构建的细节，直接从对象上克隆出来。
// 用处：当对象的构建比较复杂时或者想得到目标对象相同内容的对象时可以考虑原型模式。
// 注意：深拷贝和浅拷贝。
// JavaScript对这个应该是太了解了，天生就有Prototype，通过Object.create就可以根据对象原型创建一个新的对象。
class Origin {
  name: string
}
let origin = new Origin()
origin.name = 'brook'
let cloneObj = Object.create(origin)
console.log(cloneObj.name) // brook
cloneObj.name = 'brook2'
console.log(origin.name, cloneObj.name) // brook

// 不过还是用代码简单实现一下原型模式
interface Clonable<T> {
  clone(): T
}
class Origin2 implements Clonable<Origin2> {
  name: string
  clone(): Origin2 {
    let target = new Origin2()
    target.name = this.name
    return target
  }
}
let origin2 = new Origin2()
origin2.name = 'brook'
let cloneObj2 = origin2.clone()
console.log(cloneObj2.name) // brook
cloneObj2.name = 'brook2'
console.log(origin2.name, cloneObj2.name) // brook
// 实现Clonable接口的都具有Clone功能，通过Clone功能就可以实现对象的快速复制，如果属性很多，想另外创建属性值也差不多相同的对象，原型就可以派上用场。
// 当然，还是要注意深拷贝和浅拷贝的问题，上面的代码只有string，所以浅拷贝没有问题，如果有对象就需要注意浅拷贝是否能满足要求。
class B {
  isAdmin: boolean = true
}
class A {
  i = 100
  j = 25
  b = new B()
}
class Origin3 {
  name: string
  a: A
}
// 注释代码是把对象扁平化后才实现了深复制，就是嵌套对象不存在了。
// let extend = function(obj: object, objs: object, deep: boolean) {
//   deep = deep || false // true深copy false 浅copy
//   for (let pro in objs) {
//     if (!deep) {
//       obj[pro] = objs[pro]
//     } else {
//       if (typeof objs[pro] == 'object') {
//         if (Object.prototype.toString.call(objs[pro]) == '[object Object]') {
//           for (let key in objs[pro]) {
//             obj[key] = objs[pro][key]
//           }
//         }
//       } else {
//         obj[pro] = objs[pro]
//       }
//     }
//   }
//   return obj
// }
// let o3: Origin3 = new Origin3()
// o3.name = 'name1'
// o3.a = new A()
// let o31: Origin3 = new Origin3()
// o31 = extend(o31, o3, true) as Origin3
// console.log(o31)

//js要实现对象深度复制，只要把对象字符串json化即可
class Origin5 implements Clonable<Origin5> {
  name: string
  a: A
  clone(): Origin5 {
    let target = new Origin5()
    target = JSON.parse(JSON.stringify(this))
    return target
  }
}
let o5: Origin5 = new Origin5()
o5.name = 'name5'
o5.a = new A()
let o51 = o5.clone()
o51.name = 'name51'
o51.a.i = 101
o51.a.j = 251
o51.a.b.isAdmin = false
console.log(o5)
console.log(o51)
