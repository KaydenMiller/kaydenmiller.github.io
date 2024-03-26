## A Conversation about Typing
### Strong Static - Dynamic Loose Typing
I once had someone say this to me: 

> Implicit typing can be fixed with writing comments and types in variable names. No matter what language this project is in we will need a style guide for consistency between developers. Code needs to be readable, I agree. But compared to C# in my opinion Python is easier to read

Let me break this into parts:

> Implicit typing can be fixed with writing comments and types in variable names

Let's clarify here, python is a Dynamic and Strongly-Typed language. This means that Python allows you to change a variable to any other type and will not check it during a compile time type checking step, instead it will check this during runtime. This means that in both situations the type check will still happen as it must happen in order for the code to run. It just happens in a different way.

The strong typing portion of Python just means that you cannot do a conversion from one type to another implicitly, for example:

#### JavaScript
```js
let foo = 21;
let bar = foo + "dot";
console.log(bar);
// will print: ""21dot""
```

#### Python
```py
var = 21; # type assigned as int at runtime
var = var + "dot"; # type-error, string and int cannot concatenate
print(var);
```

Notice that JavaScript is a Dynamic and Loosly-Typed language meaning that the types will be checked at runtime but if they don't match they will be coerced into another type that does match and then if that finally still doesn't work it will throw an error. Compare this to a Static and Strongly-Typed language like C# or Java where you won't be able to run the application but it will also show you a syntax error before you get to that point.

#### C#
```csharp
// C#
var foo = 21;
var bar = foo / "dot"; // Cannot apply operator '/' to operands of type 'int' and 'string'
Console.WriteLine(bar);
```
[See comments at the bottom for a minor note about the change to / from +](#other-notes)

There is nothing inherently wrong with Python's style of typing, it can work for in many scenarios. The largest argument against it in particular from my perspective is that you must still do the same checks that a compiler would do to prevent an error like above from occurring. Whereas in a language like C/C++/C#/Java, you would have already told the compiler what the type is and the compiler will enforce it. This reduces the feedback loop to the engineer.

High-Level View of the Development Feedback Loop (Compiled Language):

1. Write Code
2. Debug Syntax Errors
3. Compile Code (only exists in compiled languages)
4. Run Application
5. Interpret Code
6. Debug Logic Errors

Normally in this feedback loop you would start at 1 and go to 6 then jump back up to 1 until the feature is considered complete. In a strictly typed language (typically compiled ones) in the compile code step you would also check for a specific classification of errors generally known as Type Errors (If you want the specific details of the kind of error they check for they ""typically"" the errors that are found using the `Hindly-Milner type system` which defines what a ""type error"" is).

When you get type errors if you are in a strict type system those errors occur in step 3 rather than step 5/6 (step 4/5 in a non-compiled language). It is generally agreed that the longest amount of time spent debugging is done during the Logical Error step (step 5/6). This is because that is the point in the application where the developer must manually read code and interact with behavior in order to determine why specific behaviors are occurring. Anything that is manually done by a human is prone to error and takes more time, and debugging code is no exception. Over someone's career, someone will tend to spend about 50% of their time debugging/reading code[1].

When you use a type system you turn the classification of errors known as type errors from a Logic Error into a Syntax Error. This means that they can be mathematically calculated with 100% accuracy by the compiler. This means that it becomes a matter of understanding your specific problem and language specifics rather than being good at debugging logic (especially someone else's logic).

In the end, the main thing to take into account here is how familiar a team is with a given language. If you are incredibly experienced in Python you will move faster in Python. However, once you understand typing and how to properly do it. It will add context to your code without needing comments as the types become a form of comment for your code.

To get somewhat back to the point of the argument that was made about variable names. If I have to name every object with a prefix or postfix denoting the type then why not just write a type in the first place. At least then there is a specific standard for it and everyone has to follow it. Whereas a name could have been a number and then became something else later and didn't get renamed. If you have to write a comment for everything then at that point you are doing even more work than just writing the type in the first place as well as potentially making the code harder to read and in the worst case writing the wrong comment or leaving a comment in that doesn't work anymore and just making the code more confusing.

Having comments in your code just means requiring people to do their jobs with an extra step. You now need to enforce a comment saying ""Hey this thing has 3 properties and they do this and are these types"". When you could just have the language require a type, which says the same thing. Now having a language that enforces types means that you MUST have types (comments) that say what the thing does. And these ""comments"" can't be wrong, without also causing other issues, meaning that you will have an error that you can go fix rather than not knowing there is an error to begin with.



> No matter what language this project is in we will need a style guide for consistency between developers.

Generally true, though some languages enforce style within the language itself. C# has a community standard for how most of it should be written (there are exceptions). Python and JS do not have general community standards at that level at least as far as I am aware though I could be wrong here.

The main point of this is it will be easier to on-board someone who has experience in C# than in JS/Python because most C# projects all follow similar conventions. Whereas Python and JS have so many frameworks and tools that use conflicting standards that you now have to specialize in a tool rather than the ecosystem. And while yes you can still do that in C#/.NET all .NET Foundation projects will follow a similar system to each other. Allowing you to focus on getting a job done rather than on learning a tool.

However, this is much more opinion-based than the last section. There are a lot of arguments here.



> Code needs to be readable, I agree. But compared to C# in my opinion Python is easier to read

This is purely an opinion and will depend entirely on experience. Personally, I dislike that a space and a tab cause problems with scope in Python. I also dislike that I am ""REQUIRED"" to indent for scope as it doesn't ALWAYS make sense. Also, I find it hard to determine where files are from due to Python not having true namespaces or fully qualified object names. But again this is all an opinion and depends on what you personally like. I'm not a Python person so I would rather avoid writing in it where I can, but like any engineer just because you like or dislike something doesn't mean you shouldn't be willing to work in it should your job require it for some reason or another.



#### References and Notes
1. [(PDF) Reversible Debugging Software ""Quantify the time and cost saved using reversible debuggers"" (researchgate.net)](https://www.researchgate.net/publication/345843594_Reversible_Debugging_Software_Quantify_the_time_and_cost_saved_using_reversible_debuggers)
2. In C# when you do the + operator with a string or any other object, every object has a built-in `toString()` method and so will return a value that can be concatenated. So the error I was using an example for wouldn't work directly. However, if you told the compiler not to do that it would still have the error I mentioned just appropriately changed for the + symbol.