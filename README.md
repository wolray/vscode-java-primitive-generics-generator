# Java Primitive Generics Generator

Java is a powerful language, but unfortunately cannot support primitive generics. This extension helps to generate java `int`/`double`/`long` primitive classes from source class with generic type `<N>`.

So why not just use something like `<N extends Number>` or `<Interger>`? Actually, in many computation-intensive scenarios, a boxed `Integer` or `Double` is too much slower than a primitive one. If you wanna build some computational util and hope it can support both `integer`, `double` and `long`, then you will need this extension.

## Usage

First, generate a `int` class with `Int`-based functional interfaces from the source class, which must have one and only one generic type `<N>`.

Check the generated `int` class. Fix some possibly erros such as `null` predicates. Then, generate `double` and `long` classes from the `int` class as the new template.

Specifically, when it comes to a for-loop with an `int` index and you don't want it to be changed to `double` or `long`. Then you should set the variable name as a single-char name such as `i`, `j` and `k`.

## Examples

Here a some examples about how generic interfaces are transformed to primitive ones.

```
Example<N> => IntExample => DoubleExample, LongExample
Function<T, N> => ToIntFunction<T> => ToDoubleFunction<T>, ToLongFunction<T>
UnaryOperator<N> => IntUnaryOperator => DoubleUnaryOperator, LongUnaryOperator
(Supplier) s.get() => s.getAsInt() => s.getAsDouble(), s.getAsLong()
```

Hope you like it!
