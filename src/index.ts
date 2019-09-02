import Greeter from '@/begin/greeter'
import basetypes from '@/base/basetypes'
import variants from '@/base/variants'
import deconstruct from '@/base/deconstruct'
import interfaces from '@/base/interfaces'

const { log } = console
let greeter = new Greeter('world')
log(greeter.greet())

basetypes()
variants()
deconstruct()
interfaces()
