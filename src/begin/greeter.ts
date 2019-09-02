import * as _ from 'lodash'

export default class Greeter {
  greeting: string
  constructor(message: string) {
    this.greeting = message
  }
  greet() {
    return _.join(['Hello,', ' ', this.greeting], '')
  }
}
