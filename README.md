# Java Primitive Generics Generator

Java is unable to support primitive generics. This extension helps to generate java `int`/`double`/`long` primitive classes from source class with generic type `<N>`.

## Usage

First, generate a `int` class with `Int`-based functional interfaces from souce class. The source class must have one and only one generic type `<N>`.

Check the `int` class. Fix some possibly erros such as `null` predicates. Then, generate `double` and `long` classes from the `int` class as their s source.

Hope you like it!
