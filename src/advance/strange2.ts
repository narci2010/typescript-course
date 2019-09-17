// & 和 | 操作符
// 虽然在写法上，这两个操作符与位运算逻辑操作符相同。但在语义上，它们与位运算刚好相反。

// 位运算的表现：

console.log(1001 | 1010) // = 1011    // 合并1
console.log(1001 & 1010) // = 1000    // 只保留共有1

// 在TypeScript中的表现：
interface IA {
  a: string
  b: number
}
type TB = {
  b: number
  c: number[]
}
type TC = IA | TB // TC类型的变量的键只需包含ab或bc即可，当然也可以abc都有
type TD = IA & TB // TD类型的变量的键必需包含abc
// 对于这种表现，可以这样理解：&表示必须同时满足多个契约，|表示满足任意一个契约即可。

// interface 和 type 关键字
// interface 和 type 两个关键字因为其功能比较接近，常常引起新手的疑问：应该在什么时候用type，什么时候用interface？
// interface 的特点如下：
// 同名interface自动聚合，也可以和已有的同名class聚合，适合做polyfill
// 自身只能表示object/class/function的类型
// 建议库的开发者所提供的公共api应该尽量用interface/class，方便使用者自行扩展。举个例子，我之前在给腾讯云 Cloud Studio 在线编辑器开发插件时，
// 因为查阅到的 monaco 文档是0.15.5版本（当时的最新版本）的，而 Cloud Studio 使用的monaco版本为0.14.3，缺失了一些我需要的API，所以需要手动polyfill一下。
// poly fill 多边形填充
// 与interface相比，type的特点如下：
// 表达功能更强大，不局限于object/class/function
// 要扩展已有type需要创建新type，不可以重名
// 支持更复杂的类型操作
type Tuple = [number, string]
const a: Tuple = [2, 'sir']
type Size = 'small' | 'default' | 'big' | number
const b: Size = 24
// 基本上所有用interface表达的类型都有其等价的type表达。
// 但我在实践的过程中，也发现了一种类型只能用interface表达，无法用type表达，那就是往函数上挂载属性。
interface FuncWithAttachment {
  (param: string): boolean
  someProperty: number
}
const testFunc: FuncWithAttachment = function(param: string) {
  return false
}
const result = testFunc('mike') // 有类型提醒
testFunc.someProperty = 3 // 有类型提醒

// extends 关键字
// extends本意为“拓展”，也有人称其为“继承”。在TypeScript中，extends既可当作一个动词来扩展已有类型；
// 也可当作一个形容词来对类型进行条件限定（例如用在泛型中）。在扩展已有类型时，不可以进行类型冲突的覆盖操作。
// 例如，基类型中键a为string，在扩展出的类型中无法将其改为number。
type A11 = {
  a: number
}
interface AB extends A11 {
  b: string
}
// 与上一种等价
type TAB = A11 & {
  b: string
}

// 基本类型
// 基本类型，也可以理解为原子类型。包括number、boolean、string、null、undefined、function、array、字面量（true，false，1，2，‘a’）等。它们无法再细分。
// 复合类型
// TypeScript的复合类型可以分为两类：set 和 map。set是指一个无序的、无重复元素的集合。而map则和JS中的对象一样，是一些没有重复键的键值对。
// set
type Size10 = 'small' | 'default' | 'big' | 'large'
// map
interface IA {
  a: string
  b: number
}
// 复合类型间的转换
// map => set
type IAKeys = keyof IA // 'a' | 'b'
type IAValues = IA[keyof IA] // string | number
// set => map
type SizeMap1 = {
  [k in Size10]: number
}
// 等价于
type SizeMap2 = {
  small: number
  default: number
  big: number
  large: number
}
// map上的操作
// 索引取值
type SubA = IA['a'] // string
// 属性修饰符
type Person10 = {
  age: number
  readonly name: string // 只读属性，初始化时必须赋值
  nickname?: string // 可选属性，相当于 | undefined
}
// 映射类型和同态变换
// 在TypeScript中，有以下几种常见的映射类型。它们的共同点是只接受一个传入类型，生成的类型中key都来自于keyof传入的类型，value都是传入类型的value的变种。
type Partial2<T> = { [P in keyof T]?: T[P] } // 将一个map所有属性变为可选的
type Required2<T> = { [P in keyof T]-?: T[P] } // 将一个map所有属性变为必选的
type Readonly3<T> = { readonly [P in keyof T]: T[P] } // 将一个map所有属性变为只读的
type Mutable2<T> = { -readonly [P in keyof T]: T[P] } // ts标准库未包含，将一个map所有属性变为可写的
// 此类变换，在TS中被称为同态变换。在进行同态变换时，TS会先复制一遍传入参数的属性修饰符，再应用定义的变换。
interface Fruit {
  readonly name: string
  size: number
}
type PF = Partial2<Fruit> // PF.name既只读又可选，PF.size只可选
// 其他常用工具类型
// 由set生成map

type Record2<K extends keyof any, T> = { [P in K]: T }
type Size20 = 'small' | 'default' | 'big'
/*
{
    small: number
    default: number
    big: number
}
 */
type SizeMap = Record2<Size20, number>
// 保留map的一部分
type Pick2<T, K extends keyof T> = { [P in K]: T[P] }
/*
{
    default: number
    big: number
}
 */
type BiggerSizeMap = Pick2<SizeMap, 'default' | 'big'>
// 删除map的一部分
type Omit2<T, K> = Pick<T, Exclude<keyof T, K>>
/*
{
    default: number
}
 */
type DefaultSizeMap = Omit<BiggerSizeMap, 'big'>
// 保留set的一部分
type Extract2<T, U> = T extends U ? T : never
type Result = 1 | 2 | 3 | 'error' | 'success'
type StringResult = Extract<Result, string> // 'error' | 'success
// 删除set的一部分
type Exclude2<T, U> = T extends U ? never : T
type NumericResult = Exclude<Result, string> // 1 | 2 | 3
// 获取函数返回值的类型。但要注意不要滥用这个工具类型，应该尽量多手动标注函数返回值类型。理由开篇时提过，契约高于实现。用ReturnType是由实现反推契约，
// 而实现往往容易变且容易出错，契约则相对稳定。另一方面，ReturnType过多也会降低代码可读性。
type ReturnType2<T> = T extends (...args: any[]) => infer R ? R : any
function f() {
  return { a: 3, b: 2 }
}
/*
{
    a: number
    b: number
}
 */
type FReturn = ReturnType<typeof f>
// 以上这些工具类型都已经包含在了TS标准库中，在应用中直接输入名字进行使用即可。另外，在这些工具类型的实现中，出现了infer、never、typeof等关键字，
// 在后文我会详细解释它们的作用。

// 类型的递归
// TS原生的Readonly只会限制一层写入操作，我们可以利用递归来实现深层次的Readonly。但要注意，TS对最大递归层数做了限制，最多递归5层。
// type DeepReadony<T> = {
//     readonly [P in keyof T]: DeepReadony<T[P]>
// }
// interface SomeObject {
//   a: {
//     b: {
//       c: number;
//     };
//   };
// }
// const obj: Readonly<SomeObject> = { a: { b: { c: 2 } } };
// obj.a.b.c = 3;    // TS不会报错

// const obj2: DeepReadony<SomeObject> = { a: { b: { c: 2 } } };
// obj2.a.b.c = 3;    // Cannot assign to 'c' because it is a read-only property.

// never infer typeof 关键字
// infer 的作用是让TypeScript自己推断，并将推断的结果存储到一个临时名字中，并且只能用于extends语句中。
// 它与泛型的区别在于，泛型是声明一个“参数”，而infer是声明一个“中间变量”。infer我用得比较少，这里借用一下官方的示例。
type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T
type T0 = Unpacked<string> // string
type T1 = Unpacked<string[]> // string
type T2 = Unpacked<() => string> // string
type T3 = Unpacked<Promise<string>> // string
type T4 = Unpacked<Promise<string>[]> // Promise<string>
type T5 = Unpacked<Unpacked<Promise<string>[]>> // string
// typeof 用于获取一个“常量”的类型，这里的“常量”是指任何可以在编译期确定的东西，例如const、function、class等。
// 它是从 实际运行代码 通向 类型系统 的单行道。理论上，任何运行时的符号名想要为类型系统所用，都要加上 typeof。
// 但是class 比较特殊不需要加，因为 ts 的 class 出现得比 js 早，现有的为兼容性解决方案。

// 在使用class时，class名表示实例类型，typeof class表示 class本身类型。没错，这个关键字和 js 的 typeof 关键字重名了 :)。
const config = { width: 2, height: 2 }
function getLength(str: string) {
  return str.length
}
type TConfig = typeof config // { width: number, height: number }
type TGetLength = typeof getLength // (str: string) => number

// 实战演练
// 我在项目中遇到这样一种场景，需要获取一个类型中所有value为指定类型的key。例如，已知某个React组件的props类型，
// 我需要“知道”（编程意义上）哪些参数是function类型。
interface MouseEvent {}
interface TouchEvent {}
interface SomeProps {
  a: string
  b: number
  c: (e: MouseEvent) => void
  d: (e: TouchEvent) => void
}
// 如何得到 'c' | 'd' ？
// 分析一下这里的思路，我们需要从一个map得到一个set，而这个set是map的key的子集，筛选子集的条件是value的类型。
// 要构造set的子集，需要用到never；要实现条件判断，需要用到extends；而要实现key到value的访问，则需要索引取值。经过一些尝试后，解决方案如下。
type GetKeyByValueType<T, Condition> = {
  [K in keyof T]: T[K] extends Condition ? K : never
}[keyof T]
type FunctionPropNames = GetKeyByValueType<SomeProps, Function> // 'c' | 'd'
let fp1: FunctionPropNames
fp1 = 'c'
console.log(fp1)
// 这里的运算过程如下：
// // 开始
// {
//     a: string
//     b: number
//     c: (e: MouseEvent) => void
//     d: (e: TouchEvent) => void
// }
// // 第一步，条件映射
// {
//     a: never
//     b: never
//     c: 'c'
//     d: 'd'
// }
// // 第二步，索引取值
// never | never | 'c' | 'd'
// // never的性质
// 'c' | 'd'

// 编译提示 Compiler Hints
// TypeScript只发生在编译期，因此我们可以在代码中加入一些符号，来给予编译器一些提示，使其按我们要求的方式运行。

// 类型转换
// 类型转换的语法为 <类型名> xxx 或 xxx as 类型名。推荐始终用as语法，因为第一种语法无法在tsx文件使用，而且容易和泛型混淆。
// 一般只有这几种场景需要使用类型转换：自动推断不准；TS报错，想不出更好的类型编写方法，手动抄近路；临时“放飞自我”。

// 在使用类型转换时，应该遵守几个原则：

// 若要放松限制，只可放松到能运行的最严格类型上
// 如果不知道一个变量的精确类型，只标注到大概类型（例如any[]）也比any好
// 任何一段“放飞自我”（完全没有类型覆盖）区代码不应超过2行，应在出现第一个可以确定类型的变量时就补上标注
// 在编写TS程序时，我们的目标是让类型覆盖率无限接近 100%。

// ! 断言
// !的作用是断言某个变量不会是null / undefined，告诉编译器停止报错。这里由用户确保断言的正确。
// 它和刚刚进入EcmaScript语法提案stage 3的Optional Chaining特性不同。Optional Chaining特性可以保证访问的安全性，即使在undefined上访问某个键也不会抛出异常。
// 而!只是消除编译器报错，不会对运行时行为造成任何影响。
// // TypeScript
// mightBeUndefined!.a = 2
// // 编译为
// mightBeUndefined.a = 2
// @ts-ignore
// 用于忽略下一行的报错，尽量少用。
// 其他
// 我为什么不提enum
// enum在TS中出现的比较早，它引入了JavaScript没有的数据结构（编译成一个双向map），入侵了运行时，与TypeScript宗旨不符。
// 用 string literal union（'small' | 'big' | 'large'）可以做到相同的事，且在debug时可读性更好。如果很在意条件比较的性能，应该用二进制flag加位运算。
// // TypeScript
// enum Size {
//     small = 3,
//     big,
//     large
// }
// const a:Size = Size.large;    // 5
// // 编译为
// var Size;
// (function (Size) {
//     Size[Size["small"] = 3] = "small";
//     Size[Size["big"] = 4] = "big";
//     Size[Size["large"] = 5] = "large";
// })(Size || (Size = {}));
// const a = Size.large; // 5
