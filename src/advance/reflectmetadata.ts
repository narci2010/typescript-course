// 关于 reflect-metadata
// 它可通过反射机制， 获取参数类型列表

// 类型元数据使用元数据键"design:type"

// 参数类型元数据使用元数据键"design:paramtypes"

// 返回值类型元数据使用元数据键"design:returntype"

// 实现的依赖注入
import 'reflect-metadata'
console.log('meta')
let targetLists: Map<any, any[]> = new Map() //  @Injectable 装饰器作用的所有目标列表
let instanceLists: Map<any, any> = new Map() // 实例列表
export function Injectable(_constructor: Function) {
  // 通过反射机制，获取参数类型列表
  //@ts-ignore
  let paramsTypes: Array<Function> = Reflect.getMetadata(
    'design:paramtypes',
    _constructor
  )
  console.log(paramsTypes)
  targetLists.set(_constructor, paramsTypes)
}
// 这个实例用来获取依赖注入的实例
export function Ioc(injet: any) {
  return getIocInstance(injet)
}
function getIocInstance(inject: any) {
  // 存在这个实例
  if (instanceLists.has(inject)) {
    return instanceLists.get(inject)
  } else {
    // 不存在
    let relies = targetLists.get(inject) || []
    let instance = new inject(
      ...relies.map(rely => {
        return getIocInstance(rely)
      })
    )
    instanceLists.set(inject, instance)
    return instance
  }
}
@Injectable
export class Person {
  i = 100
  constructor() {}
  speak() {}
}
@Injectable
class Person8 {
  ii = 100
  constructor(private name: string) {}
}
let p: Person = Ioc(Person)
let p2: Person = Ioc(Person)
let p3: Person8 = Ioc(Person8)
console.log(p)
console.log(p2)
console.log(p3)
// @Injectable 把 Person类已经存到 targetLists 里了
// Ioc 是 先看一下 instanceLists 里面有没有 Peroson的实例， 有的话 直接拿出来
// 没有的话 实例化，并存到 instanceLists （方便下次ioc 直接从 instanceLists拿） 再拿出来
// 每一个类再实例化的时候， 它的constructor里面的依赖参数类 也会有和Person类一样的初始化过程
