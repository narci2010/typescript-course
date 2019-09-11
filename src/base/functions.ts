export default function functions() {
  const { log } = console
  // 函数是JavaScript应用程序的基础。 它帮助你实现抽象层，模拟类，信息隐藏和模块。 在TypeScript里，虽然已经支持类，命名空间和模块，但函数仍然是主要的定义 行为的地方。
  // TypeScript为JavaScript函数添加了额外的功能，让我们可以更容易地使用。
  // 和JavaScript一样，TypeScript函数可以创建有名字的函数和匿名函数。 你可以随意选择适合应用程序的方式，不论是定义一系列API函数还是只使用一次的函数。
  // 通过下面的例子可以迅速回想起这两种JavaScript中的函数：
  // Named function
  function add(x, y) {
    return x + y
  }
  // Anonymous function
  let myAdd = function(x, y) {
    return x + y
  }
  log(add(1, 2), myAdd(3, 4))

  //   在JavaScript里，函数可以使用函数体外部的变量。 当函数这么做时，我们说它‘捕获’了这些变量。 至于为什么可以这样做以及其中的利弊超出了本文的范围，
  //   但是深刻理解这个机制对学习JavaScript和TypeScript会很有帮助。
  let z = 100
  function addToZ(x, y) {
    return x + y + z
  }
  log(addToZ(1, 2))

  //   函数类型
  // 为函数定义类型
  // 让我们为上面那个函数添加类型：
  function add2(x: number, y: number): number {
    return x + y
  }
  let myAdd2 = function(x: number, y: number): number {
    return x + y
  }
  // 我们可以给每个参数添加类型之后再为函数本身添加返回值类型。 TypeScript能够根据返回语句自动推断出返回值类型，因此我们通常省略它。
  log(add2(1, 2), myAdd2(3, 4))

  //   书写完整函数类型
  // 现在我们已经为函数指定了类型，下面让我们写出函数的完整类型。
  let myAdd3: (x: number, y: number) => number = function(
    x: number,
    y: number
  ): number {
    return x + y
  }
  // 函数类型包含两部分：参数类型和返回值类型。 当写出完整函数类型的时候，这两部分都是需要的。 我们以参数列表的形式写出参数类型，为每个参数指定一个名字和类型。
  //  这个名字只是为了增加可读性。 我们也可以这么写：
  let myAdd4: (baseValue: number, increment: number) => number = function(
    x: number,
    y: number
  ): number {
    return x + y
  }
  // 只要参数类型是匹配的，那么就认为它是有效的函数类型，而不在乎参数名是否正确。
  // 第二部分是返回值类型。 对于返回值，我们在函数和返回值类型之前使用( =>)符号，使之清晰明了。
  //  如之前提到的，返回值类型是函数类型的必要部分，如果函数没有返回任何值，你也必须指定返回值类型为 void而不能留空。
  // 函数的类型只是由参数类型和返回值组成的。 函数中使用的捕获变量不会体现在类型里。 实际上，这些变量是函数的隐藏状态并不是组成API的一部分。
  log(myAdd3(1, 2), myAdd4(3, 4))

  //   推断类型
  // 尝试这个例子的时候，你会发现如果你在赋值语句的一边指定了类型但是另一边没有类型的话，TypeScript编译器会自动识别出类型：
  // myAdd has the full function type
  let myAdd5 = function(x: number, y: number): number {
    return x + y
  }
  // The parameters `x` and `y` have the type number
  let myAdd6: (baseValue: number, increment: number) => number = function(
    x,
    y
  ) {
    return x + y
  }
  // 这叫做“按上下文归类”，是类型推论的一种。 它帮助我们更好地为程序指定类型。
  log(myAdd5(1, 2), myAdd6(3, 4))

  //   可选参数和默认参数
  // TypeScript里的每个函数参数都是必须的。 这不是指不能传递 null或undefined作为参数，而是说编译器检查用户是否为每个参数都传入了值。
  //  编译器还会假设只有这些参数会被传递进函数。 简短地说，传递给一个函数的参数个数必须与函数期望的参数个数一致。
  function buildName(firstName: string, lastName: string) {
    return firstName + ' ' + lastName
  }
  // let result1 = buildName("Bob");                  // error, too few parameters
  // let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
  let result3 = buildName('Bob', 'Adams') // ah, just right
  // JavaScript里，每个参数都是可选的，可传可不传。 没传参的时候，它的值就是undefined。
  // 在TypeScript里我们可以在参数名旁使用 ?实现可选参数的功能。 比如，我们想让last name是可选的：
  function buildName2(firstName: string, lastName?: string) {
    if (lastName) return firstName + ' ' + lastName
    else return firstName
  }
  let result21 = buildName2('Bob') // works correctly now
  // let result22 = buildName2("Bob", "Adams", "Sr.");  // error, too many parameters
  let result23 = buildName2('Bob', 'Adams') // ah, just right
  // 可选参数必须跟在必须参数后面。 如果上例我们想让first name是可选的，那么就必须调整它们的位置，把first name放在后面。
  log(result3, result21, result23)

  //   可选参数和默认参数
  // TypeScript里的每个函数参数都是必须的。 这不是指不能传递 null或undefined作为参数，而是说编译器检查用户是否为每个参数都传入了值。
  //  编译器还会假设只有这些参数会被传递进函数。 简短地说，传递给一个函数的参数个数必须与函数期望的参数个数一致。
  function buildName3(firstName: string, lastName: string) {
    return firstName + ' ' + lastName
  }
  // let result31 = buildName3("Bob");                  // error, too few parameters
  // let result32 = buildName3("Bob", "Adams", "Sr.");  // error, too many parameters
  let result33 = buildName3('Bob', 'Adams') // ah, just right
  log(result33)
  // JavaScript里，每个参数都是可选的，可传可不传。 没传参的时候，它的值就是undefined。
  // 在TypeScript里我们可以在参数名旁使用 ?实现可选参数的功能。 比如，我们想让last name是可选的：
  function buildName4(firstName: string, lastName?: string) {
    if (lastName) return firstName + ' ' + lastName
    else return firstName
  }
  let result41 = buildName4('Bob') // works correctly now
  // let result42 = buildName4("Bob", "Adams", "Sr.");  // error, too many parameters
  let result43 = buildName4('Bob', 'Adams') // ah, just right
  // 可选参数必须跟在必须参数后面。 如果上例我们想让first name是可选的，那么就必须调整它们的位置，把first name放在后面。
  // 在TypeScript里，我们也可以为参数提供一个默认值当用户没有传递这个参数或传递的值是undefined时。 它们叫做有默认初始化值的参数。
  //  让我们修改上例，把last name的默认值设置为"Smith"。
  log(result41, result43)
  function buildName5(firstName: string, lastName = 'Smith') {
    return firstName + ' ' + lastName
  }
  let result51 = buildName5('Bob') // works correctly now, returns "Bob Smith"
  let result52 = buildName5('Bob', undefined) // still works, also returns "Bob Smith"
  // let result53 = buildName5("Bob", "Adams", "Sr.");  // error, too many parameters
  let result54 = buildName5('Bob', 'Adams') // ah, just right
  log(result51, result52, result54)
  // 在所有必须参数后面的带默认初始化的参数都是可选的，与可选参数一样，在调用函数的时候可以省略。 也就是说可选参数与末尾的默认参数共享参数类型。
  // function buildName(firstName: string, lastName?: string) {
  //     // ...
  // }
  // 和
  // function buildName(firstName: string, lastName = "Smith") {
  //     // ...
  // }
  // 共享同样的类型(firstName: string, lastName?: string) => string。 默认参数的默认值消失了，只保留了它是一个可选参数的信息。
  // 与普通可选参数不同的是，带默认值的参数不需要放在必须参数的后面。 如果带默认值的参数出现在必须参数前面，用户必须明确的传入 undefined值来获得默认值。
  // 例如，我们重写最后一个例子，让 firstName是带默认值的参数：
  function buildName6(firstName = 'Will', lastName: string) {
    return firstName + ' ' + lastName
  }
  // let result61 = buildName6("Bob");                  // error, too few parameters
  // let result62 = buildName6("Bob", "Adams", "Sr.");  // error, too many parameters
  let result63 = buildName6('Bob', 'Adams') // okay and returns "Bob Adams"
  let result64 = buildName6(undefined, 'Adams') // okay and returns "Will Adams"
  log(result63, result64)

  //   剩余参数
  // 必要参数，默认参数和可选参数有个共同点：它们表示某一个参数。 有时，你想同时操作多个参数，或者你并不知道会有多少参数传递进来。
  // 在JavaScript里，你可以使用 arguments来访问所有传入的参数。
  // 在TypeScript里，你可以把所有参数收集到一个变量里：
  function buildName7(firstName: string, ...restOfName: string[]) {
    return firstName + ' ' + restOfName.join(' ')
  }
  let employeeName = buildName7('Joseph', 'Samuel', 'Lucas', 'MacKinzie')
  log(employeeName)
  // 剩余参数会被当做个数不限的可选参数。 可以一个都没有，同样也可以有任意个。
  //  编译器创建参数数组，名字是你在省略号（ ...）后面给定的名字，你可以在函数体内使用这个数组。
  // 这个省略号也会在带有剩余参数的函数类型定义上使用到：
  function buildName8(firstName: string, ...restOfName: string[]) {
    return firstName + ' ' + restOfName.join(' ')
  }
  let buildNameFun: (fname: string, ...rest: string[]) => string = buildName
  let employeeName1 = buildName8('Joseph', 'Samuel', 'Lucas', 'MacKinzie')
  let employeeName2 = buildNameFun('Joseph', 'Samuel', 'Lucas', 'MacKinzie')
  log(employeeName1, employeeName2)

  //   this
  // 学习如何在JavaScript里正确使用this就好比一场成年礼。 由于TypeScript是JavaScript的超集，TypeScript程序员也需要弄清 this工作机制并且当有bug的时候能够找出错误所在。
  //  幸运的是，TypeScript能通知你错误地使用了 this的地方。
  //   this和箭头函数
  // JavaScript里，this的值在函数被调用的时候才会指定。 这是个既强大又灵活的特点，但是你需要花点时间弄清楚函数调用的上下文是什么。
  // 但众所周知，这不是一件很简单的事，尤其是在返回一个函数或将函数当做参数传递的时候。
  // 下面看一个例子：
  let deck = {
    suits: ['hearts', 'spades', 'clubs', 'diamonds'],
    cards: Array(52),
    createCardPicker: function() {
      let that = this
      return function() {
        let pickedCard = Math.floor(Math.random() * 52)
        let pickedSuit = Math.floor(pickedCard / 13)
        //"this" 隐式具有类型 "any"，因为它没有类型注释。
        return { suit: that.suits[pickedSuit], card: pickedCard % 13 }
      }
    }
  }
  let cardPicker = deck.createCardPicker()
  let pickedCard = cardPicker()
  log('card: ' + pickedCard.card + ' of ' + pickedCard.suit)
  // that=this 方法，下面的代码调用同样会出错
  //   const { createCardPicker } = deck
  //   let cardPicker3 = createCardPicker()
  //   let pickedCard3 = cardPicker3()
  //   log('card: ' + pickedCard3.card + ' of ' + pickedCard3.suit)
  //   可以看到createCardPicker是个函数，并且它又返回了一个函数。 如果我们尝试运行这个程序，会发现它并没有弹出对话框而是报错了。
  //    因为 createCardPicker返回的函数里的this被设置成了window而不是deck对象。 因为我们只是独立的调用了 cardPicker()。
  //    顶级的非方法式调用会将 this视为window。 （注意：在严格模式下， this为undefined而不是window）。

  //   为了解决这个问题，我们可以在函数被返回时就绑好正确的this。 这样的话，无论之后怎么使用它，都会引用绑定的‘deck’对象。
  //   我们需要改变函数表达式来使用ECMAScript 6箭头语法。 箭头函数能保存函数创建时的 this值，而不是调用时的值：
  let deck2 = {
    suits: ['hearts', 'spades', 'clubs', 'diamonds'],
    cards: Array(52),
    createCardPicker: function() {
      // NOTE: the line below is now an arrow function, allowing us to capture 'this' right here
      return () => {
        let pickedCard = Math.floor(Math.random() * 52)
        let pickedSuit = Math.floor(pickedCard / 13)

        return { suit: this.suits[pickedSuit], card: pickedCard % 13 }
      }
    }
  }
  let cardPicker2 = deck2.createCardPicker()
  let pickedCard2 = cardPicker2()
  log('card: ' + pickedCard2.card + ' of ' + pickedCard2.suit)
  //箭头表达式情况下，下面方式调用还是会出错，本质上 _this=this 跟that=this是一样的，只是箭头表达式方式自动生成这种代码
  //   const { createCardPicker } = deck2
  //   let cardPicker3 = createCardPicker()
  //   let pickedCard3 = cardPicker3()
  //   log('card: ' + pickedCard3.card + ' of ' + pickedCard3.suit)
  // 更好事情是，TypeScript会警告你犯了一个错误，如果你给编译器设置了--noImplicitThis标记。 它会指出 this.suits[pickedSuit]里的this的类型为any。
}
