export default function generic() {
  // 软件工程中，我们不仅要创建一致的定义良好的API，同时也要考虑可重用性。 组件不仅能够支持当前的数据类型，同时也能支持未来的数据类型，这在创建大型系统时为你提供了十分灵活的功能。
  // 在像C#和Java这样的语言中，可以使用泛型来创建可重用的组件，一个组件可以支持多种类型的数据。 这样用户就可以以自己的数据类型来使用组件。
  const { log } = console
  //   因此，我们需要一种方法使返回值的类型与传入参数的类型是相同的。 这里，我们使用了 类型变量，它是一种特殊的变量，只用于表示类型而不是值。
  function identity<T>(arg: T): T {
    return arg
  }
  //   我们给identity添加了类型变量T。 T帮助我们捕获用户传入的类型（比如：number），之后我们就可以使用这个类型。 之后我们再次使用了 T当做返回值类型。
  //   现在我们可以知道参数类型与返回值类型是相同的了。 这允许我们跟踪函数里使用的类型的信息。
  //     我们把这个版本的identity函数叫做泛型，因为它可以适用于多个类型。 不同于使用 any，它不会丢失信息，像第一个例子那像保持准确性，传入数值类型并返回数值类型。
  //     我们定义了泛型函数后，可以用两种方法使用。 第一种是，传入所有的参数，包含类型参数：
  let output = identity<string>('myString') // type of output will be 'string'
  log(output)
  //   这里我们明确的指定了T是string类型，并做为一个参数传给函数，使用了<>括起来而不是()。
  //     第二种方法更普遍。利用了类型推论 -- 即编译器会根据传入的参数自动地帮助我们确定T的类型：
  let output2 = identity('myString') // type of output will be 'string'
  log(output2)
  //   注意我们没必要使用尖括号（<>）来明确地传入类型；编译器可以查看myString的值，然后把T设置为它的类型。
  //   类型推论帮助我们保持代码精简和高可读性。如果编译器不能够自动地推断出类型的话，只能像上面那样明确的传入T的类型，在一些复杂的情况下，这是可能出现的。

  //   泛型函数的类型与非泛型函数的类型没什么不同，只是有一个类型参数在最前面，像函数声明一样：
  let myIdentity1: <T>(arg: T) => T = identity
  // 我们也可以使用不同的泛型参数名，只要在数量上和使用方式上能对应上就可以。
  let myIdentity2: <U>(arg: U) => U = identity
  // 我们还可以使用带有调用签名的对象字面量来定义泛型函数：
  let myIdentity3: { <T>(arg: T): T } = identity
  //   这引导我们去写第一个泛型接口了。 我们把上面例子里的对象字面量拿出来做为一个接口：
  interface GenericIdentityFn {
    <T>(arg: T): T
  }
  let myIdentity4: GenericIdentityFn = identity
  //   一个相似的例子，我们可能想把泛型参数当作整个接口的一个参数。 这样我们就能清楚的知道使用的具体是哪个泛型类型（比如： Dictionary<string>而不只是Dictionary）。
  //    这样接口里的其它成员也能知道这个参数的类型了。
  interface GenericIdentityFn2<T> {
    (arg: T): T
  }
  let myIdentity5: GenericIdentityFn2<number> = identity
  log(
    myIdentity1('i1'),
    myIdentity2('i2'),
    myIdentity3('i3'),
    myIdentity4('i4'),
    myIdentity5(5)
  )

  //   泛型类
  // 泛型类看上去与泛型接口差不多。 泛型类使用（ <>）括起泛型类型，跟在类名后面。
  class GenericNumber<T> {
    zeroValue: T
    add: (x: T, y: T) => T
  }
  let myGenericNumber = new GenericNumber<number>()
  myGenericNumber.zeroValue = 0
  myGenericNumber.add = function(x, y) {
    return x + y
  }
  // GenericNumber类的使用是十分直观的，并且你可能已经注意到了，没有什么去限制它只能使用number类型。 也可以使用字符串或其它更复杂的类型。
  let stringNumeric = new GenericNumber<string>()
  stringNumeric.zeroValue = ''
  stringNumeric.add = function(x, y) {
    return x + y
  }
  console.log(stringNumeric.add(stringNumeric.zeroValue, 'test'))
  // 与接口一样，直接把泛型类型放在类后面，可以帮助我们确认类的所有属性都在使用相同的类型。

  //   泛型约束
  // 你应该会记得之前的一个例子，我们有时候想操作某类型的一组值，并且我们知道这组值具有什么样的属性。
  // 在 loggingIdentity例子中，我们想访问arg的length属性，但是编译器并不能证明每种类型都有length属性，所以就报错了。
  // function loggingIdentity<T>(arg: T): T {
  //     console.log(arg.length);  // Error: T doesn't have .length
  //     return arg;
  // }
  // 相比于操作any所有类型，我们想要限制函数去处理任意带有.length属性的所有类型。
  // 只要传入的类型有这个属性，我们就允许，就是说至少包含这一属性。 为此，我们需要列出对于T的约束要求。
  //   为此，我们定义一个接口来描述约束条件。 创建一个包含 .length属性的接口，使用这个接口和extends关键字来实现约束：
  interface Lengthwise {
    length: number
  }
  function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length) // Now we know it has a .length property, so no more error
    return arg
  }
  // 现在这个泛型函数被定义了约束，因此它不再是适用于任意类型：
  // loggingIdentity(3);  // Error, number doesn't have a .length property
  // 我们需要传入符合约束类型的值，必须包含必须的属性：
  log(loggingIdentity({ length: 10, value: 3 }))

  //   在泛型里使用类类型
  //   在TypeScript使用泛型创建工厂函数时，需要引用构造函数的类类型。比如，
  function create<T>(c: { new (): T }): T {
    return new c()
  }
  //   一个更高级的例子，使用原型属性推断并约束构造函数与类实例的关系。
  class BeeKeeper {
    hasMask: boolean = false
  }
  class ZooKeeper {
    nametag: string = 'default nametag'
  }
  class Animal {
    numLegs: number = 100
  }
  class Bee extends Animal {
    keeper: BeeKeeper = new BeeKeeper()
  }
  class Lion extends Animal {
    keeper: ZooKeeper = new ZooKeeper()
  }
  function createInstance<A extends Animal>(c: new () => A): A {
    return new c()
  }
  let beeKeeper: BeeKeeper = create<BeeKeeper>(BeeKeeper)
  log(beeKeeper)
  log(createInstance(Lion).keeper.nametag) // typechecks!
  log(createInstance(Bee).keeper.hasMask) // typechecks!
}
