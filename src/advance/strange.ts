// undefined的含义是：一个变量没有初始化。
// null的含义是：一个变量的值是空。

// undefined 和 null 的最佳实践
// 核心思想: 避免null pointer错误。
// null is bad。
// 要避免这个问题，我们需要做到：

// 用undefined，不要用null。
// 根据Code guidelines from Microsoft。

// Enable "strict" 或者 "strictNullChecks" 编译选项
// 在tsconfig.js中:

// {
//     "compilerOptions": {
//         "strict": true,
//         //...
//     }
// }
// 对于不可能是null的变量：
// 声明不能为 null 和 undefined。
// 提示编译错误：当使用一个没有初始化的变量，而这个变量不能为undefined的时候。
// 提示编译错误：当给一个不能为 null 和 undefined 的变量，赋值 null 和 undefined 的时候。
// 如果使用了"strictNullChecks" 编译选项，TypeScript编译器默认任何变量都不能为 undefined 和 null。除非显式声明。
// var name: string;   // cannot be null and undefined.
// name = undefined;    // Error: [ts] Type 'undefined' is not assignable to type 'string'.
// name = null;         // Error: [ts] Type 'null' is not assignable to type 'string'.
// console.log(name);   // Error: [ts] Variable 'address' is used before being assigned.
// 对于可能是undefined的变量:
// 使用显式声明
// 提示编译错误：当使用一个可能为null的变量的时候。
// 使用前，需要确定不是undefined.
// var address: string | undefined // can be undefined
// class Person5 {
//   name: string // cannot be null and undefined
//   address?: string // can be undefined
// }
// var person: Person5 = { name: 'Joe' }
// console.log(person.address.toString()) // Error: [ts] Object is possibly 'undefined'.
// if (person.address != undefined) {
//   console.log(person.address.toString()) //Ok. as we checked the type
// }

// keyof 定义了一个Type, 这个Type的值来自于指定的类。

class Person18 {
  id: number
  name: string
  birthday: Date
}
type personPropKeys = keyof Person18 // same as: type personPropKeys = "id" | "name" | "birthday"
var propKey: personPropKeys
propKey = 'id' // OK
propKey = 'name' // OK
// propKey = "age";    // Error: [ts] Type '"age"' is not assignable to type '"id" | "name" | "birthday"'.

// 用途 - 生成类的映射类型 - Mapped Types
// keyof的用途是很有趣的。比如：我们希望一个ReadOnlyPerson类，这个类和类Person的属性相同，不过其中每个属性都是只读的。
// TypeScript使用了keyof提供了下面的类:
// Keep types the same, but make each property to be read-only.
type Readonly2<T> = {
  readonly [P in keyof T]: T[P]
}
// Same property names, but make the value a promise instead of a concrete one
type Deferred<T> = {
  [P in keyof T]: Promise<T[P]>
}
// Wrap proxies around properties of T
type Proxify<T> = {
  [P in keyof T]: { get(): T[P]; set(v: T[P]): void }
}

// 类的参数属性 - parameter properties
class Person15 {
  // same as to define instance fields: id, name, age
  constructor(private id: number, public name: string, readonly age: number) {}
  get Id(): number {
    return this.id
  }
}
var person = new Person15(1, 'Mary', 14)
console.log(person.name)

// Type: {new(): T}
// {new(): T} 的主要功能是让通用方法可以创建通用类型的对象。

// 但是，这个故事有点长。

// 实现方法1：通过一个方法。
// This is a generic method to create an object
function createObject<T>(name: string, creator: (arg: string) => T): T {
  return creator(name)
}
// now we have a class Person, we want to create it via function createObject
class Person16 {
  public constructor(name: string) {
    this.name = name
  }
  name: string
}
// we have to define a creator function
function createPerson(name: string): Person16 {
  return new Person16(name)
}
// at end, we can create a person
var person2 = createObject<Person16>('Kate', createPerson)
console.log(person2)

// {new(): T}的类型是一个 Type，因此可以用于定义变量和参数。
// new()是描述构造函数的签名。所以在new()中，也定义参数。比如：{new(name: string): T}。
// {new(): T}定义了一个返回类型为 T 的构造函数的Type。

type NewObject<T> = { new (name: string): T } // type NewPersonType = new (name: string) => Person
var newPersonType: NewObject<Person16> = Person16
var person3 = new newPersonType('Joe')
console.log(person3)
// we also can write like this, as {} is the root class of object type.
type ObjectEmpty = { new (): {} } // type ObjectEmpty = new () => {}
class Test {
  i = 100
  //constructor(private b: number) {}
}
//Type 'typeof Test' is not assignable to type 'ObjectEmpty'.
let oe: ObjectEmpty = Test
console.log(oe)
let oei = new oe()
console.log(oei)

// 交叉类型(&)与联合类型(|)字面的意思所带来的坑
class A18 {
  i = 100
  j = 5
}
class B18 {
  name = 'tocean'
  color = 'blue'
}

// 对象只要有A18和B18中的两个类的全部属性才行
type abj = A18 & B18
let abji: abj = { i: 100, j: 5, name: 'tocean', color: 'yellow' }
// abji = { name: 'tocean', color: 'yellow' } //error
console.log(abji)

// 对象只要有A18或B18中的其中一个的全部属性即可
type abh = A18 | B18
let abhi: abh = { i: 100, j: 5, name: 'tocean', color: 'yellow' }
abhi = { i: 100, j: 5 }
abhi = { name: 'tocean', color: 'yellow' }
// abhi = { i: 100 } //error
console.log(abhi)

// 类型保护的特殊点
// 类型保护，顾名思义，即当前类型为保护类型，(假设)确定的类型。
// 那么，在某个作用域内，到底从何时开始，对应变量开始成为保护类型了呢？
// 首先类型会出出现类型保护的三种情况：
// (1) 类型断言
// let str
// let val: number = (str as string).length
// let val2: number = (<string>str).length
// (2) 使用类型谓词进行自定义类型保护
// let str2
// function checkString(str2: any): str2 is string {
//   return str2
// }
// (3) 使用typeof 和 instanceof

// keyof（索引类型操作符）与泛型混合的多种写法
// 首先 ，keyof 意为 某一数据类型的key的数组集合，既适用于数组，也适用于对象。下文会做验证：

interface testInter {
  name: string
  age: number
}
let testArr: string[] = ['tate', 'pomelott']
let testObj: testInter = { name: 'tate', age: 26 }
// 先来验证数组：

function showKey<K extends keyof T, T>(key: K, obj: Array<string>) {
  return key
}
showKey<number, Array<string>>(1, testArr)
// 再来验证对象：

function showKey2<K extends keyof T, T>(keyItem: K, obj: T): K {
  return keyItem
}
let val18 = showKey2('name', testObj)
console.log(val18)
// 此处有个需要特别注意的点：使用泛型如何表示某个特定key组成的数组：

function showKey3<K extends keyof T, T>(items: K[], obj: T): T[K][] {
  return items.map(item => obj[item])
}
// 上例中的  T[K][] 意为K类型的数组，而且需要满足，K为T的key

// 真正理解了上面这句话，自然就会明白下面四种写法其实是等价的：

function showKey4<K extends keyof T, T>(items: K[], obj: T): T[K][] {
  return items.map(item => obj[item])
}

function showKey5<K extends keyof T, T>(items: K[], obj: T): Array<T[K]> {
  return items.map(item => obj[item])
}

function showKey6<K extends keyof T, T>(
  items: K[],
  obj: { [K in keyof T]: any }
): K[] {
  return items.map(item => obj[item])
}

function showKey7<K extends keyof T, T>(
  items: K[],
  obj: { [K in keyof T]: any }
): Array<K> {
  return items.map(item => obj[item])
}

let obj = showKey3(['name'], testObj)
console.log(obj)
