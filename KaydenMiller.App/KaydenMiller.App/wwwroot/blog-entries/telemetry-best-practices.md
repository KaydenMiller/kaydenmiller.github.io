## Goal

I would like to teach about how to read telemetry data as well as how to create it. Including some best practices. I would like to show a system that actually has telemetry configured so that people can see what it can be used for.

- **Observable**: An observable system is one that enables you to understand its behavior from outside it.
- **Instrumented**: An instrumented system is one that emits all the data developers need to troubleshoot an issue.
- **OpenTelemetry** is an observability framework and toolkit that you can use in your app to create, process, and emit telemetry data. It emits data in forms that common observability tools like Jaeger and Prometheus can use and analyze.

<aside> 💡

`git checkout PD-1087/update-logger-for-otel-winston` contains some experimental examples and logic around setting up the winston logging library for us to use. If you want to see how some of this MIGHT work feel free to pull it down and run it. I would recommend viewing it in `SEQ` typically at [`http://localhost:9000/`](http://localhost:9000/) (more on this later in the topic).

This branch is not intended to be used on production in its current state. It doesn’t support. Temporal and it doesn’t remove sensitive data, amongst a handful of other small things.

If you want to see how this tool might work I have the `public-api` `/access-token` endpoint instrumented a little bit. Try deleting a required field from the request and looking in the SEQ log stream. Also all `{ createLogger }` instances now create `winston` loggers but they are not all formatted with structured logs. I have also created a `logger` middleware for `koa` but that doesn’t quite fully work the way I would like yet.

</aside>

### Pillars of observability

The three pillars of observability are three different types of records that store the behavior of software components for later analysis:

- **Log**: a timestamped text record of what happened during the processing of a request.
- **Metric**: a measurement of a service captured at runtime. Metric values can be aggregated into statistics about a process, including:
    - Runtime statistics such as the memory used, or the number of garbage collections that occurred.
    - NPM package statistics such as the number of completed requests, request durations, or error counts.
    - Custom statistics that are specific to your app, such as the number of tasks created during a period of time.
- **Distributed Trace**: a record of all the units of work, often referred to as **Spans**, needed to handle an individual request. In a cloud-native app, many microservices and backing services may be involved in a single request and a distributed trace would show all of them as they collaborate to prepare the response.

> NOTE: In OpenTelemetry, any data that is not part of a distributed trace or a metric is considered to be a log, for example, events.

## Tracing

### How to make traces useful

- Descriptive Name
    - If you are in an endpoint don't just call the endpoint `POST` or `"token-get"`
    - lets say you have an api in public api for creating an access token a name could be:
        - `public-api-access-token-get` or `GET /access-token` the first gives you a bit more to search in the name but doesn't tell you the specific path where the latter tell you the path but you would likely need to look at the meta data properties for the rest of the information.
            - Another way of naming would be `service-name/method-name`
        - In our case most of our endpoints are instrumented automatically by the open-telemetery node-js instrumentation module in a manner similiar to the the 2nd option
- a Low-Cardinality Name
    - This means that the name should not be unique every time it is called (don't use a GUID)
    - You want to be able to recognize the function that was called each time
- attached attributes (tags)
    - Make sure these are organized consistently and can be filtered
    - Tags should be used to help either group, filter, or analyze an event
        - grouping and filtering is more for narrowing down what events your work with
        - analyzing is a little more open ended, ideally these tags should be meaningful
        - tags should not be undefined, you can't search for is "property_x: undefined" that would give you back every log that was undefined which isn't helpful, as well as some systems don't even support it since most languages don't have "undefined" as a value the dev can actually work with
            - instead it is better to use null or some other placeholder value that can be searched for specifically (i'm sure there are reasons when this would be false too)

### Low-Cardinality

When you work with logs you should make sure that your logs are named the same when they do the same thing. For example, if you are logging that we retrieved data from a payroll provider you would want your connector to log the same way and same format as all other connectors for getting data from a payroll provider. See example:

do this:

```tsx
tracing.startActiveSpan("Retrieving {DataType} from {PayrollProviderSlug}", {
  DataType: "w2s",
  PayrollProviderSlug: ctx.connector.slug
})
tracing.startActiveSpan("Retrieving {DataType} from {PayrollProviderSlug}", {
  DataType: "hire-date",
  PayrollProviderSlug: ctx.connector.slug
})

```

instead of:

```tsx
tracing.startActiveSpan("Retrieving w2s from ADP")
tracing.startActiveSpan("Retrieving hire-date from ADP")
```

<aside> 💡

NOTE: they `{PayrollProviderSlug}` template string syntax is supported specifically by structured log consumers. For example SEQ supports it I believe DataDog also supports it as well as Grafana. However, `winston` the logger I use for many of my examples does not support it in any of its native transports. So either you would have to build one or find one. It shouldn’t be too hard but its something to keep in mind. There could also be other loggers that do support the format natively. Or you might find that outputting to the console in JSON format is fine.

Oddly enough `winston` does support `splat` syntax, which is `%s` `%d` (and others) for interpolation. However, most structured log consumers don’t support that at least not without configuration. So check your log consumer.

</aside>

This allows the use of templated or "structured" logs which can be filtered both on the value of the template variables as well as the content of the log itself. In addition the logs in the first section are considered the same event and so can be grouped automatically together by most structured log processors like SEQ and DataDog. The bottom section both logs are considered separate events and so cannot be grouped automatically and you will need to write a query for, this also means dashboards cannot trigger off of the event and rather will need a custom query to be built.

### Modern Language Features

When you are in modern JS or TS you can use some language features such as Disposables to make working with Tracing easier.

For example:

```tsx
module.exports = (ctx) => {
	return tracing.startActiveSpan({
		name: 'testing',
		fn: (span) => {
			// ... your fn code here
		}
	})
}

```

will become:

```tsx
export function FunctionNameHere(ctx: unknown) {
	using span = new AtomicSpan("testing");

	// ... your fn code here
}

```

### Span Kinds

There are five span kinds that are used by open telemetry and those are `client`, `server`, `internal`, `producer`, and `consumer`. The `span.kind` tells a tracing backend how to assemble the trace.

The open telemetry specification states that, the parent of a `server` span often is a remote `client` span, which means that the child of a `client` span is usually a `server` span.

Similarly the parent of a `consumer` span is always a `producer` span and the child of a `producer` is always a `consumer`.

If a `span.kind` is not provided then the type is assumed to be `internal`. Obviously, this is also the case if it set to `internal` directly.

What do these actually mean?

- A `client` span represents a synchronous **outgoing** remote call such as an HTTP request or Database call.

<aside> 💡

In the context of `span.kind` the term `synchronuos` does **NOT** refer to `async/await` but rather that the process is not queued for later.

For example: putting an `atomic task` or `atomic task` workflow into the task queue is an asynchronous task in this context but calling a 3rd party payroll provider api is not. This is because the `atomic task` will be picked up and processed later by another service.

We actually lose our context a lot of the time in this case do to a lack of context propagation between our tasks being queued and the `jobs` service.

</aside>

- A `server` span represents a synchronous **incoming** remote call such as an HTTP request or remote procedure call (RPC).
    - An example of this would be every time public api is called from transact or any other service. The call of that endpoint should be a `server` span.
- An `internal` span represents operations which do not cross a server boundary. Things like instrumenting a function or method call or an koa.js middleware.
    - Examples of this are our

# Logging

## Efficient logging

Logging helps to make your microservice observable. When the app is tested, staged, and deployed to production, a thorough log code may enable rapid diagnosis of faults or bottlenecks. It's therefore tempting to log everything. However, although logging is rapid it doesn't have zero cost and you should be careful to log efficiently.

Vendors commonly bill Application Performance Management (APMs) systems based on the volume of data they ingest. Selecting the appropriate log level for your messages and the default collection levels can have a big effect on the monthly bill. Log collection levels can be set on per-provider basis, we could do this based on our `package: 'package-name-here'` tag that we use for our loggers.

While our system doesn't currently support it a great way of handling logs is to have logs out put based on a dynamic log level. Meaning for a given package (for example: `public-api.handlers`) we might only log anything of a level of `warn` or higher. However, if this log level filter is set based on a database or config that can be rapidly changed (like a feature flag) then you can have a lower volume of logs being exported until an error is detected then, automatically (or manually) increase the amount of logs that are output by changing the allowed log level to be more generic like `info` or `trace`.

### Template Strings

<aside> 💡

Some tools use these but don’t provide transports to use them in the console. They are pretty common in what are called `structured loggers` however, to know for sure if your logger support it you would just have to do some research. Like for example `winston` doesn’t natively support this but the observability frontends generally do.

You may find that while this might be a good idea in practice for your application it might be a little to difficult to switch to right of the bat.

</aside>

Generally tools like `seq` (i believe `pino` does this as well but I haven't tested it) use what are called `log template strings` rather than using string interpolation. While since the log is a string so it does support interpolation, that isn't why they recommend template strings instead.

What is a template string? A template string is a string that provides context to the logger as to where to insert values into the string. For example here is a logger call with a template string that could be used with `winston`.

```
logger.warn("The user {userId} exploded {explosionTimes} times", {
  userId: ctx.user._id.toString(), // the .toString() is needed because this is a mongo guid which for some reason doesn't convert to a string nicely by default *shrug*
  explosionTimes: 8,
  otherData: 'anything serializable here'
})

```

This log statement will out put something like the following (subject to the used logger): `WARN[10:08:2024T00:15:30Z]: The user 84184684846318 exploded 8 times` What is important to notice here is that `winston` replaced the template values with the named keys from the `metadata` object provided (note that some loggers do it based on parameter order rather than key name).

This is important because this is what it the "MESSAGE" looks like but not what the logger sees and not what tools like `datadog`, `seq`, or `grafana` see. They see a message closer to:

```json
{
  "level": "warn",
  "message": "The user {userId} exploded {explosionTimes} times",
  "data": {
	  "userId": "84184684846318",
	  "explosionTimes": 8,
	  "otherData": "anything serializable here"
  },
  "timestamp": "10:08:2024T00:15:30Z"
}

```

This allows tools like `datadog` to provide a clean message that is Low-Cardinality (assuming you provided one that way) while also still providing all of the data in a message format that is human readable. As the message above is still output to the `datadog` console as `WARN[10:08:2024T00:15:30Z]: The user 84184684846318 exploded 8 times` but you can search for a `{userId}` field which is embedded in the string and is called userId rather than searching for a userId value.

Now you might ask what is the difference between providing the template string and and interpolating. Good question, that comes down to the `Low-Cardinality` that I mentioned. The strings: `User bob is cool` and `User joe is cool` are not the same string and so you would have to create a custom query to find either of them or search off of a different term. Where as the string template `User {username} is cool` can be provided the values of `bob` and `joe` which will output to the message in a way that we still see the previous messages but allow us to find all messages that are this type of message. This is why it is important **NOT** to use string interpolation when using a structured logger.

Will you break a logger if you use interpolation? No, but you won't be able to use it effectively. So instead of doing:

```tsx
function foo(username: string) {
	logger.warn(`My username is ${username}`);
}

```

use template strings instead:

```tsx
function foo(username: string) {
	logger.warn(`My username is {username}`, {
		username,
	});
}

```

### Log Tracking

Sometimes it can be worth it to provided an `eventId` or `log identifier` to logs, so that you can identify particular logs. The need for this is mitigated when you use `string templates` as they should be Low-Cardinality already. This however can be used to create artificial low-cardinality.

Another place this can be used is when you think this log message might get updated over the course of time a bit more frequently than normal. This way you can always find any log that was used for this logs purpose.

I personally haven't had very many situations where I have really needed this but its helpful to know about.

### Observability Frontend

An observability frontend is a tool for visualizing telemetry data. Some examples of observability frontends are: `datadog`, `sentry`, `seq`, `aspire dashboard`, `jaeger`, `grafana`, `splunk`, `honeycomb`, and `dynatrace` . There are a million other ones so don’t feel like this a complete list by any means. Each of these tools generally has a specialization in what kind of telemetry data they process the best. For example, `datadog` is known for having some of the best log processing in the industry. Where `grafana` is really good all around and has tools to link all of your telemetry togeather, where you can view a trace/span and then click on it and be given all related traces and spans and any logs or metrics that have been produced in between those spans. My favorite tool to use is `grafana` but they all do a really good job.

# Metrics

A metric is a numeric measurement over time. Typically used to monitor the health of the application and generate alerts. They can be used for debugging but they are more commonly used for alerting and letting you know that something is wrong so that you can look into it. The more metrics you an alert on the faster you can identify that something went wrong.

### Naming Metrics

There are some general guidelines that OTEL provides for naming your metrics [**here**](https://github.com/open-telemetry/semantic-conventions/blob/main/docs/general/metrics.md#general-guidelines). Basically it boils down to, new metrics should not use an existing metric name, even if the old metric isn’t used anymore. Metrics should be namespaced, using [**attribute naming format**](https://github.com/open-telemetry/semantic-conventions/blob/main/docs/general/attribute-naming.md), should be lower case, namespaced, dot separated, don’t use namespaces as names.

What does it mean to not use a namespace as a name. If you have a metric named [`services.task.id`](http://services.task.id) then you would not be allowed to have `services.task` as another name as the `.task` portion of `services` is already a namespace and not a name.

Something you wouldn’t do is `services.task.adp.completion` where `.adp` is now a namespace of the metrics. ADP is something we might monitor but is not a metric in and of itself. As connector performance would be the metrics we are tracking not the specifics of adp. Now that doesn’t mean we wouldn’t be able to narrow down the metrics to stuff related to ADP, just that the `"meter"` that is providing the metrics is not scoped to a particular connector. Instead that `meter` would be `services.task.completion` where this is the count of task completions over a given period of time. You would then create a query on the metrics for all `services.task.completion` events that occurred in a time frame that have the metadata of ADP’s task id. This metadata is typically done by adding attributes to the meter via the otel library.

### What should you track with metrics

Think of metrics as tracking software KPIs (key performance indicators), if you know of a thing in the code that can be tracked over time with a number and if that number changes than something went or is going wrong then that should be a metric.

### Example Metrics to Track

- service metrics
    - active service requests - http requests to the server that have not yet resolved
    - request duration
    - database connections
    - error counts
    - cpu time - the cpu time used by the node process
    - request status codes `40x, 50x, 20x`
    - request methods `post, get, put`
- general metrics
    - task / task workflow creations
    - task status changed
    - currently queued tasks
    - how long does a task take to complete or fail
    - how often does a particular error occur
    - how many times do we run a query to mongo
    - how often do we rate limit requests to our server
    - webhooks, how often and which ones, did we even send one
    - task completions
- verify
    - was a fields populated or not
    - was an api or browser method is used to get data
- deposit
    - html page load times

# Open Telemetry

Like stated earlier OpenTelemetry is an observability framework and toolkit that you can use in your app to create, process, and emit telemetry data.

Open Telemetry’s (OTEL) main job is to standardize how telemetry data is emitted from various services. This means that any service that implements telemetry using the OTEL format can communicate in the same way regardless of language or framework.

For example, Atomic `services` is written in `JavaScript` on `Node` and `Koa.js` this means that when we export telemetry data we can import it into the `open telemetry collector` (I will talk about this as a tool in a minute). We also have some tools for ML written in `Python` as well as one in `C#` for Alkami. If each of these tools use OTEL as their telemetry protocol then they can all tall to the same tools using the same format. This also means that our terminology is the same (or similar) across every service which reduces cognitive complexity. On a more concrete note we can import otel data into the `OTEL Collector` i mentioned earlier (you can have more than one) where it will handle processing and batching of data and then route it to any or all of our telemetry frontends.

### Open Telemetry Collector

The OTEL Collector is a telemetry data aggregation and processing tool. You send any and all of your telemetry data to an otel collector and it will process it. What does it mean to process your telemetry data? Well that depends on what you want, there are a bunch of extensions that can be added to the otel collector and a handful of default ones. An example of some processing that could be done on incoming and outgoing telemetry data would be to batch all incoming telemetry data, sample 1 in every 10 events received, append an `x-api-key` header to any data going to honeycomb, and remove any data that matches the regex `\\mark-is-weird\\` . The telemetry data after processing gets sent to the exporters, where it determines what kind of data it is and where it should go.

This is one of the coolest parts of the collector in my opinion. When you recieve telemetry data you can mark that data to go to one or more other observability frontends. This means that all of your logs could be sent to datadog, seq, and grafana where your traces are sent to jaeger and grafana (loki technically) and all metrics go only to grafana. This means that the engineers can then use the observability tool that best represents the data, and that if you ever want to stop using a service or start using a new one all you do is change the collector config file and your done (not counting anything you need to do in the observability frontends own configuration). You don’t need to reconfigure your services as they are all already pointing to the otel collector that is closest to them.

In addition you don’t need to use only one otel collector, if you have a system that warrants the collectors being closer to the service itself you can have the collector be a sidecar to each pod in k8s and then still talk to the services you need. This approach requires a bit more configuration but allows more flexibility and scaling per service that is being instrumented.

Another important note is that the `open telemetry collector` has two versions the contributor and standard versions. They are very similar but the contrib version has 3rd party extensions and tools in it depending on the image you use. This allows you to setup receivers that are in non-otel protocol format as well as some custom processors and exporters. An example of this would be lets say you don’t use otel for your metrics you instead use prometheus’s format then you could use the contrib version to allow your collector to read the prometheus protocol for any metric data that comes in on a specific port.

### Open Telemetry on the Frontend

This is sort of an experimental field, and you can read more about it here ([https://opentelemetry.io/docs/languages/js/getting-started/browser/](https://opentelemetry.io/docs/languages/js/getting-started/browser/)). Basically the intent of this is to allow you to instrument your frontend with the same tools that you do your backend and to have a standard protocol for tracking user sessions and events. This is very similar to what tools like `mixpanel` and `Heap` however, because this is still experimental most companies don’t support it fully or at all just yet. It think this will likely be the way the industry eventually moves as far as frontend user event tracking but right now it is not there and probably wont be for some time yet. But its good to know it exists so that one day if you need it maybe it will be ready by then.

# Observability Frontends

We have several observability frontends that are setup in the project. Those are `seq`, `jaeger`, `aspire dashboard` for our local environment. For production depending on which part of the application we have `honeycomb` , `datadog`, and `grafana` . I would be nice to locally be able to use the same tools that we use in production in order to help increase familiarity, but that isn’t always possible or easy, in the case of `honeycomb` and `datadog` particularly as they are cloud only tools and don’t have containers you can use for local development. So due to this we use `seq` as a local version of `datadog` and `jaeger` as a local version of `honeycomb`. Eventually we could switch everything to `grafana` and its sibling tools and then everywhere would work the same as you can host `grafana` locally or in the cloud, which is one of the reasons I really like it as a tool.

## Seq

Seq is a tool that is designed for viewing and searching structured logs. Currently most of our logs in `services` are not considered structured logs as they don’t use string templates (see above) and instead use interpolation.

Seq supports viewing logs in relation to traces and spans but this is a newer feature and is still fairly limited in its capabilities. Especially given seq is intended for viewing logs and not traces, but it does support it and it can be quite useful at times.

Their doc on how to do logging are great: [https://docs.datalust.co/docs/using-nodejs](https://docs.datalust.co/docs/using-nodejs)

### Setup

You can enable `seq` by running `docker compose up -f ./.local/docker-compose.otel.yaml` from the root of the `services` project. This will startup seq as well as the other observability frontends and the otel collector that is used locally.

Once it starts you can access seq at: [`http://localhost:9000/`](http://localhost:9000/)

### Overview

Currently `seq` is used just for viewing logs directly related to our traces, specifically the span and trace information in log format. This works but does leave the logs a bit cluttered, there are some filters that you can use to help clean this up but this will likely be something they clean up in a later version of seq.

Here is an example of what the logs might look like the highlighted text in a log, for example the first line has the highlighted element of `shared` . Is a structured log where the `{customerId}` field was set to shared.

[//]: # (![image.png]&#40;https://prod-files-secure.s3.us-west-2.amazonaws.com/64af4ef3-181d-433a-9860-ce50187d9423/e11cee72-e2bc-49c5-8dfe-1388ae62abf9/image.png&#41;)

You can also see shortly after that `--> {verb} {endpoint} {status} {time} {size}` this is a work in progress log that I am trying to fix for the koa logger. Each of these should return the value for their related part of the request, you can ignore them for now as they aren’t working but that is the idea.

You might also notice the colored indicators to the left of the logs. These change colors based on the type of log `yellow: warn` `red: critical/error` `grey: debug/info` . There are several colors but they are used to help you identify issues quickly.

On the far right of a log is the `span time` indicator. This **ONLY** appears if the log is was created by open telemetry instrumentation. It provides information for how much time was spent in the span that the log is associated with. If you click on this `span time` indicator you will open the following window:

[//]: # (![image.png]&#40;https://prod-files-secure.s3.us-west-2.amazonaws.com/64af4ef3-181d-433a-9860-ce50187d9423/239f749b-a7b6-4d15-8240-33f0a6ebd36a/image.png&#41;)

This is the trace and span viewer for SEQ, it is a newer feature and still very much a work in progress, but it gets the job done. This generally just gives you high level information on the span or trace that you are looking at. If you want to narrow your viewed scope down to a particular span then just click on the span time bar on the right. This will give you a popout ment where you can click `find` and that will filter your logs to that span.

There is also the `set as root` command from that same dropdown menu. This command allow you to see all spans under a given span but not above.

Another thing to note about logs that are tied to spans, they have the associated telemetry information associated with them in their log details. You can get to this menu by clicking and expanding any log in the log stream.

[//]: # (![image.png]&#40;https://prod-files-secure.s3.us-west-2.amazonaws.com/64af4ef3-181d-433a-9860-ce50187d9423/cdde3952-78cb-435b-829b-ef5304f73b51/image.png&#41;)

Inside of a log (when you expand the log) there are log meta properties. These are the data values you send up with the log to seq. This includes the values from the message that were replaced in the template.

The little `checkmark` and `x` mark on the left hand side are used to filter by that property automatically. This can also be done inside of JSON object if the object was sent up using object notation and not just a string, this can cause some weird behaviors though if you aren’t expecting them so double check it did what you want it to do.

[//]: # (![image.png]&#40;https://prod-files-secure.s3.us-west-2.amazonaws.com/64af4ef3-181d-433a-9860-ce50187d9423/34d01611-dd26-4422-b62f-045a7fb07934/image.png&#41;)

Amongst all of this SEQ also supports dashboarding and alerting. Including sending alerts to slack or email. While I personally haven’t dug much into this they have pretty good docs on it on the SEQ website. [https://docs.datalust.co/docs/dashboards](https://docs.datalust.co/docs/dashboards)

However probably the most powerful tool of seq is the search query and indexes. It is similar to datadog in what it can do but its syntax is quite different. I would recommend reading their docs on it as they will be better than what I can explain here.

[//]: # (![image.png]&#40;https://prod-files-secure.s3.us-west-2.amazonaws.com/64af4ef3-181d-433a-9860-ce50187d9423/83b3a150-4dde-4466-b619-1e5f061bd96d/image.png&#41;)

## Jaeger

Jaeger is a tool for viewing and searching distributed traces. We primarily use this as our trace viewer locally due to `honeycomb` not being available for local use.

### Setup

You can enable `jaeger` by running `docker compose up -f ./.local/docker-compose.otel.yaml` from the root of the `services` project. This will startup jaeger as well as the other observability frontends and the otel collector that is used locally.

Once it starts you can access seq at: [`http://localhost:16686/`](http://localhost:16686/)

### Overview

The jaeger search screen allows you to find operations or traces that have been performed in your application. Once you have found one select it by clicking on the span object in the list.

[//]: # (![image.png]&#40;https://prod-files-secure.s3.us-west-2.amazonaws.com/64af4ef3-181d-433a-9860-ce50187d9423/0ad3044c-c24d-4998-a0a3-24e500fb1016/image.png&#41;)

In the trace viewer you are able to see all of the associated spans and details for those spans such as events, errors and arguments. You can expand a span for more information about it. You might notice that on the left side of the span name there can be an error indicator. That means that either that span or a child span was set to `error: true` in during execution. This typically means that an error that couldn’t be handled gracefully occurred.

[//]: # (![image.png]&#40;https://prod-files-secure.s3.us-west-2.amazonaws.com/64af4ef3-181d-433a-9860-ce50187d9423/d450abc0-a779-400c-ab10-d23cdb2778d2/image.png&#41;)

You can also use the trace graph to help visualize what occurred in the course of execution. This is mostly useful if you have another similar trace that you want to compare it too using the build it trace compare tool. I however do not have any traces that would make for a good example of that at the moment.

[//]: # (![image.png]&#40;https://prod-files-secure.s3.us-west-2.amazonaws.com/64af4ef3-181d-433a-9860-ce50187d9423/31fa2e96-8b10-4488-928d-fbd30299a0a1/image.png&#41;)

## Aspire Dashboard

Aspire Dashboard is a tool for visualizing telemetry data from a distributed system. It provides visualization tools for `logs`, `traces`, and `metrics` all in one. It also has the ability to filter and find logs associated with traces and vise versa directly in the one tool without needing to go between `seq` and `jaeger` for details. The downside of the tool is it is not as fully featured in either of those areas as the tools that are dedicated to just logs or just traces are. It is a great tool for quick visualization of what is happening in our system. It also supports metrics (which our tooling does not yet do) so it could be used for that once we do support it.

<aside> 💡

NOTE: I will keep calling this the `aspire dashboard` specifically because `aspire` is a separate product that uses this dashboard. `aspire` is a product by microsoft that allows for cloud deployments to be built as a part of your project. We don’t use or need `aspire`, but the `aspire dashboard` which is a part of the `aspire` tool is able to be deployed separately and provide an fully featured observability frontend for all 3 major kinds of telemetry.

So if you are looking for information on the `aspire dashboard` make sure you are looking at the right tool.

</aside>

### Setup

You can enable `aspire dashboard` by running `docker compose up -f ./.local/docker-compose.otel.yaml` from the root of the `services` project. This will startup the aspire dashboard as well as the other observability frontends and the otel collector that is used locally.

Once it starts you can access the aspire dashboard at: [`http://localhost:18888/`](http://localhost:18888/)

### Overview

This is the trace view where you can see all of the traces that the aspire dashboard has received.

[//]: # (![image.png]&#40;https://prod-files-secure.s3.us-west-2.amazonaws.com/64af4ef3-181d-433a-9860-ce50187d9423/10026847-53d9-44c8-90e2-294ea6f9308f/image.png&#41;)

This is the trace viewer that shows all of the spans associated with a selected trace. You can also see on the right hand side there is a `view logs` button. That will take you to any logs that are associated with this trace.

[//]: # (![image.png]&#40;https://prod-files-secure.s3.us-west-2.amazonaws.com/64af4ef3-181d-433a-9860-ce50187d9423/480512b9-e55b-4e81-b208-7e7c5e6a506a/image.png&#41;)

When you press the `details` button for a given span, you will be given a panel similar to the following (though it could be across the bottom of the screen depending on your settings). This contains the details of that span and all attributes tied to it, including trace baggage.

[//]: # (![image.png]&#40;https://prod-files-secure.s3.us-west-2.amazonaws.com/64af4ef3-181d-433a-9860-ce50187d9423/9c001a8c-76c2-48a2-9d48-035972556449/image.png&#41;)

This is the log view that shows all of the logs that the dashboard has received. Like the trace viewer there is a button on the right hand side that is the `traceId` that will take you to the associated trace and spans for the given log. Our system can use this but not to its full extent just yet due to a lack of trace context propagation in our system.

[//]: # (![image.png]&#40;https://prod-files-secure.s3.us-west-2.amazonaws.com/64af4ef3-181d-433a-9860-ce50187d9423/b2e10a91-9171-4189-b13a-35ca9e65ceec/image.png&#41;)

When you choose the `details` button on the right. You are given the following details view. Which similar to that of the trace detials view provides you with the attributes and metadata that was sent up with a given log.

[//]: # (![image.png]&#40;https://prod-files-secure.s3.us-west-2.amazonaws.com/64af4ef3-181d-433a-9860-ce50187d9423/8cbe0f84-1f02-4bea-a8c9-8986482c580b/image.png&#41;)

<aside> 💡

I would add screenshots of the metrics viewer but we don’t currently publish any metrics so there is nothing to see

</aside>