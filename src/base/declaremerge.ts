export default function declaremerge() {
  const { log } = console
  //      合并接口
  // 最简单也最常见的声明合并类型是接口合并。 从根本上说，合并的机制是把双方的成员放到一个同名的接口里。
  interface Box {
    height: number
    width: number
  }
  interface Box {
    scale: number
  }
  let box: Box = { height: 5, width: 6, scale: 10 }
  //   let box2: Box = { height: 5, width: 6 } //error
  log(box)
}
