// 建造者模式 Builder
// 特点：一步一步来构建一个复杂对象，可以用不同组合或顺序建造出不同意义的对象，通常使用者并不需要知道建造的细节，通常使用链式调用来构建对象。
// 用处：当对象像积木一样灵活，并且需要使用者来自己组装时可以采用此模式，好处是不需要知道细节，调用方法即可，常用来构建如Http请求、生成器等。
// 注意：和工厂模式的区别，工厂是生产产品，谁生产，怎样生产无所谓，而建造者重在组装产品，层级不一样。
// 下面用TypeScript写一个Http的RequestBuilder来看看建造者模式：
const { log } = console
enum HttpMethod {
  GET,
  POST
}

class HttpRequest {} //假设这是最终要发送的request

class RequestBuilder {
  private _method: HttpMethod
  private _request: HttpRequest

  private _headers: { [key: string]: string } = {}

  private _querys: { [key: string]: string } = {}

  private _body: string

  setMethod(method: HttpMethod): RequestBuilder {
    this._request = new HttpRequest()
    this._method = method
    return this
  }

  setHeader(key: string, value: string): RequestBuilder {
    this._headers[key] = value
    return this
  }

  setQuery(key: string, value: string): RequestBuilder {
    this._querys[key] = value
    return this
  }

  setBody(body: string): RequestBuilder {
    this._body = body
    return this
  }

  build(): HttpRequest {
    // 根据上面信息生成HttpRequest
    this._request['headers'] = this._headers
    this._request['body'] = this._body
    this._request['querys'] = this._querys
    this._request['method'] = this._method
    return this._request
  }
}

let getRequest = new RequestBuilder()
  .setMethod(HttpMethod.GET)
  .setQuery('name', 'brook')
  .build()

let postRequest = new RequestBuilder()
  .setMethod(HttpMethod.POST)
  .setHeader('ContentType', 'application/json')
  .setBody('body')
  .build()
log(getRequest)
log(postRequest)
// 上面RequestBuilder可以根据传进来的参数不同来构建出不同的HttpReqeust对象，这样使用者就可以按照自己需求来生成想要的对象。
// 这里有个问题是RequestBuilder需不需要抽象出来，个人觉得要看情况而定。
// 首先是保持简单，不去套UML，只是一个简单的构造功能给内部使用也没必要抽象来增加代码复杂度，但如果业务上这个Builder是封装在一个库里面并且要对外提供服务，
// 那还是需要一个抽象来隐藏细节，消除对实现的依赖。
// 并且如果业务上还需要不同的RequestBuilder，比如说XmlRequestBuilder JsonRequestBuilder之类，那就更需要一个抽象了。
