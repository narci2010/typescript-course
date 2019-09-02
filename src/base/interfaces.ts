export default function interfaces() {
  const { log } = console
  // TypeScript的核心原则之一是对值所具有的结构进行类型检查。 它有时被称做“鸭式辨型法”或“结构性子类型化”。
  // 在TypeScript里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。
  // 接口初探
  // 下面通过一个简单示例来观察接口是如何工作的：
  function printLabel(labelledObj: { label: string }) {
    console.log(labelledObj.label)
  }

  let myObj = { size: 10, label: 'Size 10 Object' }
  printLabel(myObj)
  // 类型检查器会查看printLabel的调用。 printLabel有一个参数，并要求这个对象参数有一个名为label类型为string的属性。
  //  需要注意的是，我们传入的对象参数实际上会包含很多属性，但是编译器只会检查那些必需的属性是否存在，并且其类型是否匹配。
  //  然而，有些时候TypeScript却并不会这么宽松，我们下面会稍做讲解。
  //   下面我们重写上面的例子，这次使用接口来描述：必须包含一个label属性且类型为string：
  interface LabelledValue {
    label: string
  }
  function printLabel2(labelledObj: LabelledValue) {
    console.log(labelledObj.label)
  }
  printLabel2(myObj)
  // LabelledValue接口就好比一个名字，用来描述上面例子里的要求。 它代表了有一个 label属性且类型为string的对象。
  //  需要注意的是，我们在这里并不能像在其它语言里一样，说传给 printLabel的对象实现了这个接口。我们只会去关注值的外形。
  //  只要传入的对象满足上面提到的必要条件，那么它就是被允许的。
  // 还有一点值得提的是，类型检查器不会去检查属性的顺序，只要相应的属性存在并且类型也是对的就可以。

  //   可选属性
  // 接口里的属性不全都是必需的。 有些是只在某些条件下存在，或者根本不存在。 可选属性在应用“option bags”模式时很常用，即给函数传入的参数对象中只有部分属性赋值了。
  // 下面是应用了“option bags”的例子：
  interface SquareConfig {
    color?: string
    width?: number
  }
  function createSquare(
    config: SquareConfig = {}
  ): { color: string; area: number } {
    let newSquare = { color: 'white', area: 100 }
    if (config.color) {
      newSquare.color = config.color
    }
    if (config.width) {
      newSquare.area = config.width * config.width
    }
    return newSquare
  }
  let mySquare = createSquare({ color: 'black' })
  log(createSquare())
  log(createSquare({}))
  log(mySquare)
  // 带有可选属性的接口与普通的接口定义差不多，只是在可选属性名字定义的后面加一个?符号。
  //可选属性的好处之一是可以对可能存在的属性进行预定义，好处之二是可以捕获引用了不存在的属性时的错误。

  //   只读属性
  // 一些对象属性只能在对象刚刚创建的时候修改其值。 你可以在属性名前用 readonly来指定只读属性:
  interface Point {
    readonly x: number
    readonly y: number
  }
  // 你可以通过赋值一个对象字面量来构造一个Point。 赋值后， x和y再也不能被改变了。
  let p1: Point = { x: 10, y: 20 }
  log(p1)
  //   p1.x = 5 // error!

  //   TypeScript具有ReadonlyArray<T>类型，它与Array<T>相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改：
  let a: number[] = [1, 2, 3, 4]
  let ro: ReadonlyArray<number> = a
  log(ro)
  // ro[0] = 12; // error!
  // ro.push(5); // error!
  // ro.length = 100; // error!
  // a = ro; // error!
  // 上面代码的最后一行，可以看到就算把整个ReadonlyArray赋值到一个普通数组也是不可以的。 但是你可以用类型断言重写：
  let b: number[]
  b = ro as number[]
  // ro[0]=5 // error!
  log(b)

  //   readonly vs const
  // 最简单判断该用readonly还是const的方法是看要把它做为变量使用还是做为一个属性。 做为变量使用的话用 const，若做为属性则使用readonly。

  //   额外的属性检查
  // 我们在第一个例子里使用了接口，TypeScript让我们传入{ size: number; label: string; }到仅期望得到{ label: string; }的函数里。
  // 我们已经学过了可选属性，并且知道他们在“option bags”模式里很有用。
  // 然而，天真地将这两者结合的话就会像在JavaScript里那样搬起石头砸自己的脚。 比如，拿 createSquare例子来说：
  // error: 'colour' not expected in type 'SquareConfig'
  //   let mySquare2 = createSquare({ colour: "red", width: 100 });
  //   log(mySquare2)
  // 注意传入createSquare的参数拼写为colour而不是color。 在JavaScript里，这会默默地失败。
  // 你可能会争辩这个程序已经正确地类型化了，因为width属性是兼容的，不存在color属性，而且额外的colour属性是无意义的。
  // 然而，TypeScript会认为这段代码可能存在bug。 对象字面量会被特殊对待而且会经过 额外属性检查，当将它们赋值给变量或作为参数传递的时候。
  //  如果一个对象字面量存在任何“目标类型”不包含的属性时，你会得到一个错误。

  // 让接口或类允许存在任意属性名的属性：使用字符串索引签名
  //   然而，最佳的方式是能够添加一个字符串索引签名，前提是你能够确定这个对象可能具有某些做为特殊用途使用的额外属性。
  //   如果 SquareConfig带有上面定义的类型的color和width属性，并且还会带有任意数量的其它属性，那么我们可以这样定义它：
  interface SquareConfig2 {
    color?: string
    width?: number
    [propName: string]: any //SquareConfig2可以有任意数量的属性
  }
  // 我们稍后会讲到索引签名，但在这我们要表示的是SquareConfig可以有任意数量的属性，并且只要它们不是color和width，那么就无所谓它们的类型是什么。
  // 还有最后一种跳过这些检查的方式，这可能会让你感到惊讶，它就是将这个对象赋值给一个另一个变量： 因为 squareOptions不会经过额外属性检查，所以编译器不会报错。
  function createSquare2(
    config: SquareConfig2 = {}
  ): { color: string; area: number } {
    let newSquare = { color: 'white', area: 100 }
    if (config.color) {
      newSquare.color = config.color
    }
    if (config.width) {
      newSquare.area = config.width * config.width
    }
    return newSquare
  }
  let mySquare3 = createSquare2({ colour: 'red', width: 100 })
  log(mySquare3)
}
