// 组合模式 Composite
// 特点：以树的形式展示对象的组合，并且可以以类似的方式处理每个枝点。
// 用处：当对象组合以树状存在，有父有子，并且对象的行为差不多时可以考虑组合模式，如菜单，游戏里的技能树。
// 注意：遍历组合的性能要求。
// 下面用TypeScript简单实现一下组合模式：
// 技能树麻烦了点，技能激活要引入观察者模式，就以菜单为例吧。
// 菜单可以包括子菜单，点击菜单项时有子菜单则显示子菜单，没有时触发点击事件。

// 先声明一个抽象，包含菜单的名字，点击事件和添加Child，一般情况下Menu会维护一个childs集合，通过这个集合来添加子菜单，
// 不过这里没有用这种方式，采用的是继承一个集合来让本身拥有集合的能力，这样更方便，是父还是子可以通过字段来控制，也可以通过是否有child来表示。

abstract class MenuBase extends Array<MenuBase> {
  name: string

  abstract click()

  addChild(...childs: Array<MenuBase>) {
    childs.forEach(o => this.push(o))
  }
}
// 实现具体MenuItem类，一般情况下可以用两个类，一个代表菜单，一个代表菜单项，不过这里就不需要区别是枝还是叶了，简单一点，只用一个MenuItem代表所有。
// 可以传click处理事件进来，click时会触发click事件，另外如果有子则显示所有子。

class MenuItem extends MenuBase {
  constructor(
    public name: string,
    private clickFunc: () => string | undefined
  ) {
    super()
  }

  click() {
    console.log(`click ${this.name}`)

    if (this.clickFunc) {
      console.log(this.clickFunc())
    }

    if (this.length > 0) {
      let childs = this.reduce(
        (p, c) => <MenuBase>{ name: `${p.name},${c.name}` }
      ).name
      console.log(`${this.name}'s childs: ${childs}`)
    }
  }
}
// 现在来运行一下：

let root = new MenuItem('root', () => {
  return 'my name is root'
})

let A1 = new MenuItem('A1', () => {
  return 'my name is A1'
})
let A2 = new MenuItem('A2', () => {
  return 'my name is A2'
})

let B1 = new MenuItem('B1', () => {
  return 'my name is B1'
})
let B2 = new MenuItem('B2', () => {
  return 'my name is B2'
})
let B3 = new MenuItem('B3', () => {
  return 'my name is B3'
})

root.push(A1, A2)

A1.push(B1, B2, B3)

root.click()
A1.click()
A2.click()
B1.click()
// 结果：

// click root
// root's childs: A1,A2

// click A1
// A1's childs: B1,B2,B3

// click A2
// my name is A2

// click B1
// 符合预期行为，这种组合就是非常简单的，但如果组合得非常深且枝非常多时就需要考虑查找枝时的效率问题了，
// 通常的办法是采用缓存来把一些常用的查找结果缓存起来，避免频繁遍历。
