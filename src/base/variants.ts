// declare let b: number
export default function variants() {
  const { log } = console
  //  变量声明
  //   let和const是JavaScript里相对较新的变量声明方式。 像我们之前提到过的， let在很多方面与var是相似的，但是可以帮助大家避免在JavaScript里常见一些问题。
  //    const是对let的一个增强，它能阻止对一个变量再次赋值。
  //     因为TypeScript是JavaScript的超集，所以它本身就支持let和const。 下面我们会详细说明这些新的声明方式以及为什么推荐使用它们来代替 var。
  //   作用域规则
  // 对于熟悉其它语言的人来说，var声明有些奇怪的作用域规则。 看下面的例子：
  function f(shouldInitialize: boolean) {
    if (shouldInitialize) {
      var x = 10
    }
    //在赋值前使用了变量“x”
    x = 100
    return x
  }
  log(f(true)) // returns '10'
  log(f(false)) // returns 'undefined'
  // 有些读者可能要多看几遍这个例子。 变量 x是定义在*if语句里面*，但是我们却可以在语句的外面访问它。
  //  这是因为 var声明可以在包含它的函数，模块，命名空间或全局作用域内部任何位置被访问（我们后面会详细介绍），
  //  包含它的代码块对此没有什么影响。 有些人称此为* var作用域或函数作用域*。 函数参数也使用函数作用域。

  //   这些作用域规则可能会引发一些错误。 其中之一就是，多次声明同一个变量并不会报错：
  function sumMatrix(matrix: number[][]) {
    var sum = 0
    for (var i = 0; i < matrix.length; i++) {
      var currentRow = matrix[i]
      for (var i = 0; i < currentRow.length; i++) {
        sum += currentRow[i]
      }
    }
    //     这个版本的循环能得到正确的结果，因为内层循环的i可以屏蔽掉外层循环的i。
    //     通常来讲应该避免使用屏蔽，因为我们需要写出清晰的代码。 同时也有些场景适合利用它，你需要好好打算一下。
    return sum
  }
  let matrix: number[][] = [[1, 2, 3], [4, 5, 6]]
  log(sumMatrix(matrix)) //6
  // 这里很容易看出一些问题，里层的for循环会覆盖变量i，因为所有i都引用相同的函数作用域内的变量。
  // 有经验的开发者们很清楚，这些问题可能在代码审查时漏掉，引发无穷的麻烦。
  function sumMatrix2(matrix: number[][]) {
    var sum = 0
    for (let i = 0; i < matrix.length; i++) {
      var currentRow = matrix[i]
      for (let i = 0; i < currentRow.length; i++) {
        sum += currentRow[i]
      }
    }

    return sum
  }
  log(sumMatrix2(matrix)) //21

  //   捕获变量怪异之处
  // 快速的猜一下下面的代码会返回什么：
  //   for (var i = 0; i < 10; i++) {
  //     setTimeout(function() {
  //       console.log(i)
  //     }, 100 * i)
  //   }
  // 介绍一下，setTimeout会在若干毫秒的延时后执行一个函数（等待其它代码执行完毕）。
  // 好吧，看一下结果：
  // 10
  // 10
  // 10
  // 10
  // 10
  // 10
  // 10
  // 10
  // 10
  // 10
  // 很多JavaScript程序员对这种行为已经很熟悉了，但如果你很不解，你并不是一个人。 大多数人期望输出结果是这样：
  // 0
  // 1
  // 2
  // 3
  // 4
  // 5
  // 6
  // 7
  // 8
  // 9
  // 还记得我们上面提到的捕获变量吗？
  // 我们传给setTimeout的每一个函数表达式实际上都引用了相同作用域里的同一个i。
  // 让我们花点时间思考一下这是为什么。 setTimeout在若干毫秒后执行一个函数，并且是在for循环结束后。
  //  for循环结束后，i的值为10。 所以当函数被调用的时候，它会打印出 10！

  //   一个通常的解决方法是使用立即执行的函数表达式（IIFE）来捕获每次迭代时i的值：
  //   for (var i = 0; i < 10; i++) {
  //     // capture the current state of 'i'
  //     // by invoking a function with its current value
  //     ;(function(i) {
  //       setTimeout(function() {
  //         console.log(i)
  //       }, 100 * i)
  //     })(i)
  //   }
  // 这种奇怪的形式我们已经司空见惯了。 参数 i会覆盖for循环里的i，但是因为我们起了同样的名字，所以我们不用怎么改for循环体里的代码。

  //   当let声明出现在循环体里时拥有完全不同的行为。 不仅是在循环里引入了一个新的变量环境，而是针对 每次迭代都会创建这样一个新作用域。
  //   这就是我们在使用立即执行的函数表达式时做的事，所以在 setTimeout例子里我们仅使用let声明就可以了。
  for (let i = 0; i < 10; i++) {
    setTimeout(function() {
      console.log(i)
    }, 100 * i)
  }
  // 会输出与预料一致的结果：
  // 0
  // 1
  // 2
  // 3
  // 4
  // 5
  // 6
  // 7
  // 8
  // 9

  //   块作用域
  // 当用let声明一个变量，它使用的是词法作用域或块作用域。 不同于使用 var声明的变量那样可以在包含它们的函数外访问，块作用域变量在包含它们的块或for循环之外是不能访问的。
  function f2(input: boolean) {
    let a = 100
    if (input) {
      // Still okay to reference 'a'
      let b = a + 1
      return b
    }
    // Error: 'b' doesn't exist here
    //     return b
  }
  // 这里我们定义了2个变量a和b。 a的作用域是f函数体内，而b的作用域是if语句块里。

  //   在catch语句里声明的变量也具有同样的作用域规则。
  try {
    throw 'oh no!'
  } catch (e) {
    console.log('Oh well.')
  }
  // Error: 'e' doesn't exist here
  // console.log(e);
  // 拥有块级作用域的变量的另一个特点是，它们不能在被声明之前读或写。 虽然这些变量始终“存在”于它们的作用域里，
  // 但在直到声明它的代码之前的区域都属于 暂时性死区。 它只是用来说明我们不能在 let语句之前访问它们，幸运的是TypeScript可以告诉我们这些信息。
  // a++; // illegal to use 'a' before it's declared;
  // let a;

  //   注意一点，我们仍然可以在一个拥有块作用域变量被声明前获取它。 只是我们不能在变量声明前去调用那个函数。
  //   如果生成代码目标为ES2015，现代的运行时会抛出一个错误；然而，现今TypeScript是不会报错的。
  function foo() {
    // okay to capture 'a'
    return a
  }
  // 不能在'a'被声明前调用'foo'
  // 运行时应该抛出错误
  log(foo())
  let a: number = 101
  log(foo())

  //   重定义及屏蔽
  // 我们提过使用var声明时，它不在乎你声明多少次；你只会得到1个。
  function f3(x) {
    var x
    var x
    if (true) {
      var x
    }
    x = 100
    return x
  }
  log(f3(55))

  //   在上面的例子里，所有x的声明实际上都引用一个相同的x，并且这是完全有效的代码。 这经常会成为bug的来源。 好的是， let声明就不会这么宽松了。
  let xy = 10
  // let xy = 20; // 错误，不能在1个作用域里多次声明`x`
  // 并不是要求两个均是块级作用域的声明TypeScript才会给出一个错误的警告。
  function f4(x) {
    //     let x = 100; // error: interferes with parameter declaration
  }
  function g() {
    let x2 = 100
    //     var x2 = 100; // error: can't have both declarations of 'x'
  }

  //   并不是说块级作用域变量不能用函数作用域变量来声明。 而是块级作用域变量需要在明显不同的块里声明。
  function f5(condition, x) {
    if (condition) {
      let x = 100
      return x
    }
    return x
  }
  log(f5(false, 0)) // returns 0
  log(f5(true, 0)) // returns 100

  //   块级作用域变量的获取
  // 在我们最初谈及获取用var声明的变量时，我们简略地探究了一下在获取到了变量之后它的行为是怎样的。
  // 直观地讲，每次进入一个作用域时，它创建了一个变量的 环境。 就算作用域内代码已经执行完毕，这个环境与其捕获的变量依然存在。
  function theCityThatAlwaysSleeps() {
    let getCity

    if (true) {
      let city = 'Seattle'
      getCity = function() {
        return city
      }
    }
    return getCity()
  }
  // 因为我们已经在city的环境里获取到了city，所以就算if语句执行结束后我们仍然可以访问它。
  log(theCityThatAlwaysSleeps())

  //   const 声明
  // const 声明是声明变量的另一种方式。
  const numLivesForCat = 9
  // 它们与let声明相似，但是就像它的名字所表达的，它们被赋值后不能再改变。 换句话说，它们拥有与 let相同的作用域规则，但是不能对它们重新赋值。
  // 这很好理解，它们引用的值是不可变的。
  log(numLivesForCat)
  //   除非你使用特殊的方法去避免，实际上const变量的内部状态是可修改的。 幸运的是，TypeScript允许你将对象的成员设置成只读的。 接口一章有详细说明。

  //   let vs. const
  // 现在我们有两种作用域相似的声明方式，我们自然会问到底应该使用哪个。 与大多数泛泛的问题一样，答案是：依情况而定。
  // 使用最小特权原则，所有变量除了你计划去修改的都应该使用const。 基本原则就是如果一个变量不需要对它写入，那么其它使用这些代码的人也不能够写入它们，
  // 并且要思考为什么会需要对这些变量重新赋值。 使用 const也可以让我们更容易的推测数据的流动。
}
