## JavaScript
### Explicit, Implicit, and Quantum Undefined

So, you may have heard of the language JavaScript, either in a good way or a bad way. It always seems to evoke feelings
that never seem to land in the middle only on the extremes. JavaScript has this reputation of being inconsistent and
behaving strangely in situations where you might think it would be obvious what it should do.

Now, I personally have my own opinions about javascript, mostly that it is a language and it gets the job done but I
would prefer to write in something else if given the choice. Even TypeScript I like but would still prefer a language
like C# or Rust (now if someone made a language where it has the syntactic sugar of C# but the type system of Rust and
the overall syntax of Typescript/C# now that would be a language that I would use, maybe I'll try to make it one day).

This all leads to an issue I ran into today at work. I was experimenting with how to check for the specific typeof a
variable, basically, I just wanted to know if given a specific variable was it of type function. Simple enough right,
well yes you are correct, normally it would just be a simple `if (typeof variableName === 'function')`, simple as that.
And while yes that is correct, and it will work, it wont work in all situations. Specifically not if the value is what
I like to call a "Quantum Undefined" state. I am sure there is an actual name for what I am about to explain but at the
time of writing, I don't know what this is called.

Basically, while I was testing I decided to write something like this:

```js
const systemConfig = {
    foo: "some value",
    bar: "some value",
    executeIf: () => true
}

function setupService(config) {
    if (typeof config.executeIf === 'function') {
        if (!config.executeIf()) {
            return;
        }
    }
    
    // ... do some other stuff
}

setupService(systemConfig);
```

Now, this should work as expected right now, however, the part that I have not written here is that the systemConfig 
has some values that can be overloaded from several other locations. And one of those locations happens to set the 
`executeIf` property to a value of undefined but not actually undefined. Basically if i'm understanding the behavior 
correctly the key of `executeIf` is being set in the objects context but it is not being assigned a value. I would
then consider `executeIf` to be `undefined`.

```js
const systemConfig = {
    foo: "some value",
    bar: "some value",
    executeIf
}
```

This is still somehow valid syntax. In fact it will mark `executeIf` as `undefined`. Now normally that would not be a
problem. Typically if something is `undefined` if you say `typeof thatThing` then you will get the result `"undefined"`
and my `if`, mentioned above, should still handle that. If you thought that, then you would have been in the same camp
as I am and you would also be wrong.

What this will actually do is throw an error that says something like "`ReferenceError: executeIf is not defined`" and 
that is correct, it is `undefined` so why doesn't JS say that `typeof systemConfig.executeIf` is `"undefined"` instead of
throwing an error. Well I figured maybe it was because I was accessing it like `systemConfig.executeIf` and that was
causing the error so I switched it to `systemConfig?.executeIf` however that will still throw an error and tell you that
the value of `executeIf` is `undefined`. This issue threw me for a loop for a good long while.

Well it turns out that if you instead of stating the above config as it is now you change it to:

```js
const systemConfig = {
    foo: "some value",
    bar: "some value",
    executeIf: undefined
}
```

This will actually behave as expected. You can also completely remove the property either via `unset` or just not having
it exist in the first place like so:

```js
const systemConfig = {
    foo: "some value",
    bar: "some value"
}
```

This will also behave as expected. So the only time when `executeIf` has this problem is when the value is neither
explicitly or implicitly marked as `undefined`. And thus "Quantum Undefined" was born as from what I can tell JS doesn't
know if it is defined or undefined and then fails to behave as expected. At this point in time I don't know why this is
the case or what this situation is actually called but I wanted to document it for future posterity.

#### EDIT: 3/25/24 - Update for new website and add addendum
After having spent some time working around LLVM and messing around with building my own languages. I think
I now understand why this problem exists, though I still don't know what it is specifically called in the context of JS.

Basically, when creating a scope context in many languages the context is a form of dictionary with a key value pair. This
means that depending on how the language syntax works you could define the key but not define the value associated with the 
key. This also explains why the code works when you use `unset` as it would be removing the key from the dictionary.

Thus when stating `typeof systemConfig.executeIf` the key does exist in the dictionary but there is no value and so JS doesn't 
know how to handle this and so it fails. I don't know why this particular behavior exists within JS but this I believe is the 
underlying reason for the behavior.