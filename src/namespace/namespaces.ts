// 命名空间：命名空间，您可以简单粗暴地等同与java中包的
// 随着更多验证器的加入，我们需要一种手段来组织代码，以便于在记录它们类型的同时还不用担心与其它对象产生命名冲突。
// 因此，我们把验证器包裹到一个命名空间内，而不是把它们放在全局命名空间下。
// 下面的例子里，把所有与验证器相关的类型都放到一个叫做Validation的命名空间里。 因为我们想让这些接口和类在命名空间之外也是可访问的，所以需要使用 export。
//  相反的，变量 lettersRegexp和numberRegexp是实现的细节，不需要导出，因此它们在命名空间外是不能访问的。
//  在文件末尾的测试代码里，由于是在命名空间之外访问，因此需要限定类型的名称，比如 Validation.LettersOnlyValidator。
// 使用命名空间的验证器
namespace Validation2 {
  export interface StringValidator {
    isAcceptable(s: string): boolean
  }

  const lettersRegexp = /^[A-Za-z]+$/
  const numberRegexp = /^[0-9]+$/

  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s)
    }
  }

  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s)
    }
  }
}

// Some samples to try
let strings2 = ['Hello', '98052', '101']

// Validators to use
let validators2: { [s: string]: Validation.StringValidator } = {}
validators2['ZIP code'] = new Validation.ZipCodeValidator()
validators2['Letters only'] = new Validation.LettersOnlyValidator()

// Show whether each string passed each validator
for (let s of strings2) {
  for (let name in validators2) {
    console.log(
      `"${s}" - ${
        validators2[name].isAcceptable(s) ? 'matches' : 'does not match'
      } ${name}`
    )
  }
}
// 分离到多文件
// 当应用变得越来越大时，我们需要将代码分离到不同的文件中以便于维护。

// 多文件中的命名空间
// 现在，我们把Validation命名空间分割成多个文件。 尽管是不同的文件，它们仍是同一个命名空间，并且在使用的时候就如同它们在一个文件中定义的一样。
// 因为不同文件之间存在依赖关系，所以我们加入了引用标签来告诉编译器文件之间的关联。 我们的测试代码保持不变。
