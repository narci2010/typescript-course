//   可以对导入内容重命名
import { ZipCodeValidator as ZCV } from './ZipCodeValidator'
// 将整个模块导入到一个变量，并通过它来访问模块的导出部分
import * as validator from './ZipCodeValidator'
// 具有副作用的导入模块
// 尽管不推荐这么做，一些模块会设置一些全局状态供其它模块使用。 这些模块可能没有任何的导出或用户根本就不关注它的导出。 使用下面的方法来导入这类模块：
import './sideeffect'
export default function modules() {
  // 关于术语的一点说明: 请务必注意一点，TypeScript 1.5里术语名已经发生了变化。 “内部模块”现在称做“命名空间”。
  //  “外部模块”现在则简称为“模块”，这是为了与 ECMAScript 2015里的术语保持一致，(也就是说 module X { 相当于现在推荐的写法 namespace X {)。
  //   从ECMAScript 2015开始，JavaScript引入了模块的概念。TypeScript也沿用这个概念。
  // 模块在其自身的作用域里执行，而不是在全局作用域里；这意味着定义在一个模块里的变量，函数，类等等在模块外部是不可见的，除非你明确地使用export形式之一导出它们。
  //  相反，如果想使用其它模块导出的变量，函数，类，接口等的时候，你必须要导入它们，可以使用 import形式之一。
  //   模块是自声明的；两个模块之间的关系是通过在文件级别上使用imports和exports建立的。
  // 模块使用模块加载器去导入其它的模块。 在运行时，模块加载器的作用是在执行此模块代码前去查找并执行这个模块的所有依赖。
  // 大家最熟知的JavaScript模块加载器是服务于Node.js的 CommonJS和服务于Web应用的Require.js。
  // TypeScript与ECMAScript 2015一样，任何包含顶级import或者export的文件都被当成一个模块。相反地，如果一个文件不带有顶级的import或者export声明，
  // 那么它的内容被视为全局可见的（因此对模块也是可见的）。

  let myValidator = new ZCV()
  let myValidator2 = new validator.ZipCodeValidator()

  //   可选的模块加载和其它高级加载场景
  // 有时候，你只想在某种条件下才加载某个模块。 在TypeScript里，使用下面的方式来实现它和其它的高级加载场景，我们可以直接调用模块加载器并且可以保证类型完全。
  // 编译器会检测是否每个模块都会在生成的JavaScript中用到。 如果一个模块标识符只在类型注解部分使用，并且完全没有在表达式中使用时，就不会生成 require这个模块的代码。
  // 省略掉没有用到的引用对性能提升是很有益的，并同时提供了选择性加载模块的能力。
  // 这种模式的核心是import id = require("...")语句可以让我们访问模块导出的类型。 模块加载器会被动态调用（通过 require），就像下面if代码块里那样。
  //  它利用了省略引用的优化，所以模块只在被需要时加载。 为了让这个模块工作，一定要注意 import定义的标识符只能在表示类型处使用（不能在会转换成JavaScript的地方）。
  // 为了确保类型安全性，我们可以使用typeof关键字。 typeof关键字，当在表示类型的地方使用时，会得出一个类型值，这里就表示模块的类型。
}
