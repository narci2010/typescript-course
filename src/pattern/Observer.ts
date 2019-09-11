// 观察者模式 Observer
// 特点：定义了对象间的一对多关系，当对象状态改变时，其他订阅了这个对象的对象就会收到通知。
// 用处：当一个对象状态的改变时需要其他对象也做出响应时可以考虑观察者模式，如网络聊天里的群。
// 注意：与中介者的区别。
// 下面用TypeScript简单实现一下观察者模式：
// 就以上面说的群聊天为例，群里的每个人都是注册到群里的对象，任何一个人发了信息其他人都能收到。

// 先定义群和群用户的接口：
// 群需要知道有哪些用户注册进来了，并且在有人发消息时去通知所有注册的人。
// 用户则需要发送消息和接收消息。

interface Observer {
  name: string

  sendMsg(msg: string)
  receiveMsg(sender: Observer, msg: string)
}

interface Subject {
  register(observer: Observer)
  unregister(observer: Observer)
  sendMsg(sender: Observer, msg: string)
}
// 实现用户和群，用户在发消息时需要往群里发，群收到消息后通知所有注册的人

class User8 implements Observer {
  constructor(public name: string, private subject: Subject) {
    this.subject.register(this)
  }

  sendMsg(msg: string) {
    console.log(`${this.name} 发送 ${msg}`)
    this.subject.sendMsg(this, msg)
  }

  receiveMsg(sender: Observer, msg: string) {
    console.log(`${this.name} 收到来自${sender.name}的消息： ${msg} `)
  }
}

class Group implements Subject {
  private userList: Array<Observer> = []

  register(observer: Observer) {
    this.userList.push(observer)
  }

  unregister(observer: Observer) {
    var index = this.userList.indexOf(observer)
    if (index > -1) {
      this.userList.splice(index, 1)
    }
  }

  sendMsg(sender: Observer, msg: string) {
    console.log(`群收到${sender.name}发信息：${msg}，通知所有人`)
    this.notify(sender, msg)
  }

  private notify(sender: Observer, msg: string) {
    this.userList.forEach(user => user.receiveMsg(sender, msg))
  }
}
// 写段代码测试一下：

let group = new Group()
let jim = new User8('jim', group)
let brook = new User8('brook', group)
let lucy = new User8('lucy', group)

jim.sendMsg('hello')
lucy.sendMsg('well done!')
//结果：
// jim 发送 hello
// 群收到jim发信息：hello，通知所有人
// jim 收到来自jim的消息： hello
// brook 收到来自jim的消息： hello
// lucy 收到来自jim的消息： hello

// lucy 发送 well done!
// 群收到lucy发信息：well done!，通知所有人
// jim 收到来自lucy的消息： well done!
// brook 收到来自lucy的消息： well done!
// lucy 收到来自lucy的消息： well done!
// 只有要人发消息，所有注册的人都会收到，跟广播一样。
// 其实观察者模式可以做得更通用，类似一个消息中心，所有注册的对象按照一定协议实现匹配事件的方法来获取通知，
// 消息中心不需要知道是什么类型的对象注册了，只要实现这个方法，那相关事件有通知时这个方法就会被调到，这样基本没有耦合度，
// 有兴趣的朋友可以参考我之前写的一个win10开源库：LLQNotify，就是用这种方式实现的。

// 另外，与中介者模式的区别在于：虽然都是注册回复，但观察者是分发性的，注册的人都能收到，而且中介者则是单一的，使用者发个请求，中介者回一个，
// 使用者不需要知道到底是谁回的，中介隐藏了对象之间的交互。
