export default function typecompatible() {
  const { log } = console
  // TypeScript里的类型兼容性是基于结构子类型的。 结构类型是一种只使用其成员来描述类型的方式。 它正好与名义（nominal）类型形成对比。
  // （译者注：在基于名义类型的类型系统中，数据类型的兼容性或等价性是通过明确的声明和/或类型的名称来决定的。
  // 这与结构性类型系统不同，它是基于类型的组成结构，且不要求明确地声明。） 看下面的例子：
  interface Named {
    name: string
  }
  class Person {
    name: string
  }
  let p: Named
  // OK, because of structural typing
  p = new Person()
  // 在使用基于名义类型的语言，比如C#或Java中，这段代码会报错，因为Person类没有明确说明其实现了Named接口。
  // TypeScript的结构性子类型是根据JavaScript代码的典型写法来设计的。 因为JavaScript里广泛地使用匿名对象，
  // 例如函数表达式和对象字面量，所以使用结构类型系统来描述这些类型比使用名义类型系统更好。
  log(p)

  //   关于可靠性的注意事项
  // TypeScript的类型系统允许某些在编译阶段无法确认其安全性的操作。当一个类型系统具此属性时，被当做是“不可靠”的。TypeScript允许这种不可靠行为的发生是经过仔细考虑的。
  // 通过这篇文章，我们会解释什么时候会发生这种情况和其有利的一面。
  // 开始
  // TypeScript结构化类型系统的基本规则是，如果x要兼容y，那么y至少具有与x相同的属性。比如：
  interface Named {
    name: string
  }
  let x: Named
  // y's inferred type is { name: string; location: string; }
  let y = { name: 'Alice', location: 'Seattle' }
  x = y
  //   y = x//Property 'location' is missing in type 'Named' but required in type '{ name: string; location: string; }'
  log(x)
  // 这里要检查y是否能赋值给x，编译器检查x中的每个属性，看是否能在y中也找到对应属性。 在这个例子中，y必须包含名字是name的string类型成员。y满足条件，因此赋值正确。
  //   检查函数参数时使用相同的规则：
  // function greet(n: Named) {
  //     console.log('Hello, ' + n.name);
  // }
  // greet(y); // OK
  // 注意，y有个额外的location属性，但这不会引发错误。 只有目标类型（这里是Named）的成员会被一一检查是否兼容。
  // 这个比较过程是递归进行的，检查每个成员及子成员。

  //   比较两个函数
  // 相对来讲，在比较原始类型和对象类型的时候是比较容易理解的，问题是如何判断两个函数是兼容的。 下面我们从两个简单的函数入手，它们仅是参数列表略有不同：
  let x2 = (a: number) => 0
  let y2 = (b: number, s: string) => 0
  y2 = x2 // OK
  //   x2 = y2 // Error
  // 要查看x是否能赋值给y，首先看它们的参数列表。 x的每个参数必须能在y里找到对应类型的参数。
  //  注意的是参数的名字相同与否无所谓，只看它们的类型。 这里，x的每个参数在y中都能找到对应的参数，所以允许赋值。
  // 第二个赋值错误，因为y有个必需的第二个参数，但是x并没有，所以不允许赋值。

  //   你可能会疑惑为什么允许忽略参数，像例子y = x中那样。 原因是忽略额外的参数在JavaScript里是很常见的。
  //   例如，Array#forEach给回调函数传3个参数：数组元素，索引和整个数组。 尽管如此，传入一个只使用第一个参数的回调函数也是很有用的：
  let items = [1, 2, 3]
  // Don't force these extra arguments
  items.forEach((item, index, array) => console.log(item, index, array))
  // Should be OK!
  items.forEach(item => console.log(item))

  // 下面来看看如何处理返回值类型，创建两个仅是返回值类型不同的函数：
  // 返回值类型：给变量类型兼容一致
  let x3 = () => ({ name: 'Alice' })
  let y3 = () => ({ name: 'Alice', location: 'Seattle' })
  x3 = y3 // OK
  log(x3())
  //   y3 = x3 // Error, because x() lacks a location property
  // 类型系统强制源函数的返回值类型必须是目标函数返回值类型的子类型。

  //   函数参数双向协变
  // 当比较函数参数类型时，只有当源函数参数能够赋值给目标函数或者反过来时才能赋值成功。
  // 这是不稳定的，因为调用者可能传入了一个具有更精确类型信息的函数，但是调用这个传入的函数的时候却使用了不是那么精确的类型信息。
  //  实际上，这极少会发生错误，并且能够实现很多JavaScript里的常见模式。例如：
  enum EventType {
    Mouse,
    Keyboard
  }
  interface Event {
    timestamp: number
  }
  interface MouseEvent extends Event {
    x: number
    y: number
  }
  interface KeyEvent extends Event {
    keyCode: number
  }
  //handler: (n: Event) => void) 一个参数类型为Event，返回值为void的函数
  function listenEvent(eventType: EventType, handler: (n: Event) => void) {
    /* ... */
    let ke: KeyEvent = { keyCode: 0, timestamp: 2019 }
    handler(ke)
  }
  // Unsound（不妥当）, but useful and common
  listenEvent(EventType.Mouse, (e: MouseEvent) => console.log(e.x + ',' + e.y))
  // Undesirable alternatives in presence of soundness
  listenEvent(EventType.Mouse, (e: Event) =>
    console.log((<MouseEvent>e).x + ',' + (<MouseEvent>e).y)
  )
  listenEvent(EventType.Mouse, <(e: Event) => void>(
    ((e: MouseEvent) => console.log(e.x + ',' + e.y))
  ))
  listenEvent(EventType.Keyboard, (e: KeyEvent) =>
    console.log(e.keyCode + ',' + e.timestamp)
  )
  // Still disallowed (clear error). Type safety enforced for wholly incompatible types
  //   listenEvent(EventType.Mouse, (e: number) => console.log(e))

  //   可选参数及剩余参数
  // 比较函数兼容性的时候，可选参数与必须参数是可互换的。 源类型上有额外的可选参数不是错误，目标类型的可选参数在源类型里没有对应的参数也不是错误。
  // 当一个函数有剩余参数时，它被当做无限个可选参数。
  // 这对于类型系统来说是不稳定的，但从运行时的角度来看，可选参数一般来说是不强制的，因为对于大多数函数来说相当于传递了一些undefinded。
  // 有一个好的例子，常见的函数接收一个回调函数并用对于程序员来说是可预知的参数但对类型系统来说是不确定的参数来调用：
  function invokeLater(args: any[], callback: (...args: any[]) => void) {
    /* ... Invoke callback with 'args' ... */
    log(args)
    callback(['a', 'b', 'c'])
  }
  // Unsound - invokeLater "might" provide any number of arguments
  invokeLater([1, 2], (x, y) => {
    log(x) //x=[a,b,c]
    log(y) //y=undefined
    console.log(x + ', ' + y)
  })
  // Confusing (x and y are actually required) and undiscoverable
  invokeLater([1, 2], (x?, y?) => console.log(x + ', ' + y))

  //   函数重载
  // 对于有重载的函数，源函数的每个重载都要在目标函数上找到对应的函数签名。 这确保了目标函数可以在所有源函数可调用的地方调用。
  //   在JS中本身不支持重载的，而在TS中使用可以"变通"的支持重载：
  // 1.先申明所有方法重载的定义，不包含方法的实现；
  // 2.再声明一个参数为any类型的重载方法；
  // 3.实现any类型的方法并通过参数类型（和返回类型）不同来实现重载；
  //a、声明需要重载的函数
  function add(a: number, b: number): number
  function add(a: string, b: string): string
  //b、定义any类型重载定义
  function add(a: any, b: any): any {
    let result = null
    if (typeof a === 'number' && typeof b === 'number') {
      return a + b
    } else if (typeof a === 'string' && typeof b === 'string') {
      return a + b
    } else {
      return 'null'
    }
  }
  log(add(1, 2))
  log(add('12', '34'))
  //   log(add(true,false)) //error:没有声明这种类型的函数

  //   枚举
  // 枚举类型与数字类型兼容，并且数字类型与枚举类型兼容。不同枚举类型之间是不兼容的。比如，
  // enum Status { Ready, Waiting };
  // enum Color { Red, Blue, Green };
  // let status = Status.Ready;
  // status = Color.Green;  // Error

  //   类
  // 类与对象字面量和接口差不多，但有一点不同：类有静态部分和实例部分的类型。 比较两个类类型的对象时，只有实例的成员会被比较。
  // 静态成员和构造函数不在比较的范围内。
  class Animal {
    feet: number
    constructor(name: string, numFeet: number) {}
  }
  class Size {
    //     feet: number
    constructor(readonly feet: number) {}
  }
  let a: Animal
  let s: Size = new Size(100)
  a = s // OK
  s = a // OK
  log(a, s)

  //   类的私有成员和受保护成员
  // 类的私有成员和受保护成员会影响兼容性。 当检查类实例的兼容时，如果目标类型包含一个私有成员，那么源类型必须包含来自同一个类的这个私有成员。
  //  同样地，这条规则也适用于包含受保护成员实例的类型检查。 这允许子类赋值给父类，但是不能赋值给其它有同样类型的类。
  class A1 {
    private a: number
    protected b: string
  }
  class B1 {
    private a: number
    protected b: string
  }
  class A2 extends A1 {}
  class A3 extends A1 {}
  class B2 extends B1 {}
  let b2: B2
  let a2: A2
  let a3: A2 = new A2()
  //   a2=b2  //error
  a2 = a3

  //   泛型
  // 因为TypeScript是结构性的类型系统，类型参数只影响使用其做为类型一部分的结果类型。比如，
  interface Empty<T> {}
  let x13: Empty<number>
  let y13: Empty<string>
  //   在赋值前使用了变量“y13”。
  //   x13 = y13 // OK, because y matches structure of x
  // 上面代码里，x和y是兼容的，因为它们的结构使用类型参数时并没有什么不同。 把这个例子改变一下，增加一个成员，就能看出是如何工作的了：
  interface NotEmpty<T> {
    data: T
  }
  let x15: NotEmpty<number>
  let y15: NotEmpty<string>
  // x15 = y15;  // Error, because x and y are not compatible
  // 在这里，泛型类型在使用时就好比不是一个泛型类型。
  // 对于没指定泛型类型的泛型参数时，会把所有泛型参数当成any比较。 然后用结果类型进行比较，就像上面第一个例子。
  // 比如，
  let identity = function<T>(x: T): T {
    // ...
    return x
  }
  let reverse = function<U>(y: U): U {
    // ...
    return y
  }
  identity = reverse // OK, because (x: any) => any matches (y: any) => any

  //   高级主题
  // 子类型与赋值
  // 目前为止，我们使用了“兼容性”，它在语言规范里没有定义。 在TypeScript里，有两种兼容性：子类型和赋值。
  // 它们的不同点在于，赋值扩展了子类型兼容性，增加了一些规则，允许和any来回赋值，以及enum和对应数字值之间的来回赋值。
  // 语言里的不同地方分别使用了它们之中的机制。 实际上，类型兼容性是由赋值兼容性来控制的，即使在implements和extends语句也不例外。
}
