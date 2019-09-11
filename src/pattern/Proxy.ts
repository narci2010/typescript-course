// 代理模式 Proxy
// 特点：在对象前面加了一层，外部需要通过这层代理来操作原对象，代理可以加一些控制来过滤或简化操作。
// 用处：当对象不希望被外部直接访问时可以考虑代理模式，典型的有远程代理、保护代理、透明代理、虚拟代理等。
// 注意：与外观、装饰器模式的区别。
// 远程代理：在Visual Studio里很容易用到，Web Reference，直接把web service当本地引用使用。
// 保护代理：通常用来对一个对象做权限控制。
// 虚拟代理：做web页面时对图像经常使用虚拟代理，看不到的图像先用个统一的图像替代，页面滑到哪就加载到哪，省资源。

// 下面用TypeScript简单实现一下远程代理模式：
// 数据接口：

interface DataService {
  getData(): string | Promise<string>
}
// 在server端的远程服务：

class RemoteService implements DataService {
  getData(): string {
    return 'get remote data'
  }
}
// 假设一个Reqeuster类，可以取server端数据：

class Requester {
  Request(): Promise<string> {
    return Promise.resolve(new RemoteService().getData()) //这里本来应该从网络取，现在只是演示一下
  }
}
// 本地代理：

class DataProxy implements DataService {
  async getData(): Promise<string> {
    return await new Requester().Request()
  }
}

function isPromise(p: string | Promise<string>): p is Promise<string> {
  //用来判断是否是promise
  return (<Promise<string>>p).then !== undefined
}

let dataService: DataService = new DataProxy()
let data = dataService.getData()

if (isPromise(data)) {
  data.then(o => console.log(o))
} else {
  console.log(data)
}

//输出
// get remote data
// DataProxy和远程的RemoteService使用同样的接口，client像调用本地功能一样通过DataProxy使用远程功能。

// 代理模式与外观模式的差别在于：
// 代理和被代理使用同一抽象，并且代理着重于访问控制。
// 外观则着重于简化原本复杂的操作，并在此基础上提取新抽象。

// 代理模式与装饰器模式的差别在于：
// 代理的目的一般不是为了增加新功能而在于访问控制，同时代理通常是自己来创建被代理对象。
// 装饰器则着重于增加新功能，且被装饰对象通常是作为引用传给装饰器的。
