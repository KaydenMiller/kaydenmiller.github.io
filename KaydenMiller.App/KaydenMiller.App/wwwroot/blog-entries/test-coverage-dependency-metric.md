## Test Coverage - As a metric bringing on a dependency 
### The problem as I hear it
Many people when talking about test coverage are quick to cite that it is a waste of time and not a great metric to use. When determining a framework to work with or in the case of your own projects that is time better spent building new tools or features. Another thing that I hear a lot is that test coverage isn't trustworthy.

Personally, I think too many people focus on the actual coverage number than on what the coverage means. So, I want to talk about test coverage from a different perspective. The perspective of understanding your own code rather than the number of lines "covered" by tests.

#### Definitions
Let us quickly define what I mean by test coverage for those who might not be as familiar. Test coverage in the context that I am referring to is the method or value associated with the number of lines being "covered" or called by a given test. For example, suppose you have the following function:
```csharp
public string HelloWorld(string name, bool shouldUseLongHello)
{
    if (shouldUseLongHello)
        return $"Hello, {name}. How are you doing today?";
    else
        return $"Hello, {name}.";
}
```
This is a rather simple example but let's assume this was something more complicated. If I were to write some unit tests for this the main thing I care about testing is whether or not I get different results when I pass the boolean `shouldUseLongHello`. I may or may not care about the actual return value that would depend on the actual situation let's assume for simplicity that it doesn't really matter in this case.

A test coverage value would explain to you or someone else how much of this function has at least one unit test that calls that line of code. So if I wrote a test that only checked for the `true` value of `shouldUseLongHello` then I would get a test coverage value for this function of ~50% as we are only calling the first portion of the `if` statement thus only calling 2 of the 4 lines of the function. Technically the value might be a little different depending on if the coverage tool you use counts the function signature as a part of the percentage, however in this case I'm not.

So, to quickly reiterate test coverage represents the overall percentage of lines hit by some or all of your tests.

#### Ok, so what do I mean?
Let's think about a medium to large application that has an API surface that is consumed by some set of 3rd party companies. Many companies have requirements on the kind of 3rd party dependencies they can take on. Let's quickly list some of those possible requirements:
* Proven Track Record of Maintainance
  * More than one maintainer
  * Has been around for some X period of time
* Does it fit the needs in the first place
* Documentation, that is up-to-date
* Does it add additional requirements
  * Does it make our system more complicated or add new problems we have to solve in order to work with it?
* Is there a good community around the dependency
* Does it have any existing/known vulnerabilities,
  * have the past ones been fixed in a reasonable amount of time?
* Is it a part of our core domain so should we instead make this ourselves?

Those are just a small set of things a company might consider when bringing on a dependency. I want to look at what test coverage means to someone who is looking to bring on a dependency.

#### A dependency added, a problem made worse

Any time a company brings on a dependency they are accepting that they will not be writing that code themselves. They are saying that the dependency will handle the problem, but more importantly, they are saying "We will conform to the standards of that dependency". In contrast to writing the functionality of that dependency yourself internally which would allow you to make the tool in a way that specifically conforms to your needs.

The benefit of taking on a dependency is the time saved, and in a lot of cases, the time saved is more than worth the cost of not having something be a perfect fit for your application. This trade-off between the ability to control the dependency versus the time saved is important because when you take on the dependency eventually you won't be able to easily pull it out (depending on size and complexity of course).

If you can't pull the dependency out then you can't change it if it stops working for your needs or in a worst-case scenario stops being maintained. You now have to stop what you are doing and fix that problem at the cost of everything else that was being worked on. This means that features aren't being worked on or that other problems aren't being fixed.

#### Why tests to begin with?

Why are we even writing the tests to begin with? I will only cover this briefly as many more people talk about this topic and do a better job than I. But suffice it to say that tests act as a way to prevent regressions, and confirm the behavior as well as in my opinion most importantly a form of documentation for the code that is in general more reliable than the random comment that was added 6 months ago but a guy who isn't even at the company anymore that no one knows if they should delete or not.

The tests allow us to write code that defines what the application should be doing. Which, if we're being honest you have to test anyway, or risk releasing broken code, now you just don't have to do as much by hand.

#### Get to the point, what does this have to do with test coverage?

What does all of this have to do with test coverage? Think about what you are doing when you write a test. First, you have to look at the code you want to test, read it, and have a general understanding of what it should do and how it should affect the things around it. The process of having to understand the code that was written to me is the most important part of test coverage. I don't care about the lines of code you have covered specifically, but rather the fact that you have looked at some portion of code that will be affected by the code you wrote.

Many people when writing code especially when you work in a very fast-paced environment like a startup care more about getting a feature out than about making sure the code will not have any issues. This is not to say that that is a bad thing or that they shouldn't get code out as fast as they can as we all know code that doesn't reach production doesn't provide any value so you shouldn't spend so much time testing that the code never goes out but you should have an understanding of what that code will affect.

Having a high test coverage value doesn't tell me you have written good tests it doesn't even tell me that you understand the code. What it tells me is that you care to at least spend some time attempting to understand what you wrote and that you want to make something that can be relyed on. Sure, it might end up having bugs but at least you are saying that you want to reduce how often that happens. It shows me that you care even if just a little bit about what you wrote and what you are putting into the ecosystem.

#### In conclusion

As engineers, we all must rely on the tools that are available to us. If I'm going to rely on a tool that my company must then use until the "great refactor in the sky" occurs then I am going use a tool that I have more confidence in and the fact that Bob's tool has coverage and Joe's tool doesn't means that if I have to pick between those two tools assuming no other problems I am going to choose Bob's tool because he took the time to try and make his tool more reliable. 
