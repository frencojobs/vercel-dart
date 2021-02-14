<img align="center" src="https://raw.githubusercontent.com/frencojobs/vercel-dart/main/.github/cover.png" />

A Vercel Runtime to write serverless functions in Dart.

## Usage

A serverless function file should contain a [shelf](https://pub.dev/packages/shelf) handler named `handler`. Behind the scenes, the runtime will combine the handler with an AWS runtime and compile it into a binary file using `dart2native`.

**Example**

Create a file called `api/hello.dart` with the following contents.

```dart
import 'dart:io' show Platform;
import 'package:shelf/shelf.dart';

Response handler(Request req) {
  final version = Platform.version.split(" ").first;
  return Response.ok('Hello, from Dart v$version!');
}
```

Next, select the `vercel-dart` runtime to handle serverless dart functions in your `vercel.json` file.

```json
{
  "functions": {
    "api/**/*.dart": { "runtime": "vercel-dart@1.1.0" }
  }
}
```

Check out a hosted version of this demo at [vercel-dart.vercel.app/api/hello](https://vercel-dart.vercel.app/api/hello). 

## Examples

> Check out the repository's `api` folder for more examples.

**Reading Queries from the Request**

```dart
import 'package:shelf/shelf.dart';

Response handler(Request req) {
  return Response.ok('Query is: ${req.requestedUri.query}');
}
```

**Changing the Response's Status Code**

```dart
import 'package:shelf/shelf.dart';

Response handler(Request req) =>
    Response.movedPermanently('https://youtu.be/dQw4w9WgXcQ');
```

**Using JSON Content Type**

```dart
import 'dart:convert';
import 'dart:io';
import 'package:shelf/shelf.dart';

Response handler(Request req) {
  final data = {
    'host': req.requestedUri.host,
    'path': req.requestedUri.path,
    'query': req.requestedUri.queryParameters
  };

  return Response.ok(
    jsonEncode(data),
    headers: {
      'content-type': ContentType.json.toString(),
    },
  );
}
```

**Using HTML Content Type**

```dart
import 'dart:io';
import 'package:shelf/shelf.dart';

Response handler(Request req) {
  final html = '''
    <h1>Hello, World</h1>
  ''';

  return Response.ok(
    html,
    headers: {
      'content-type': ContentType.html.toString(),
    },
  );
}
```

## Configuration

Here are the [build environment
variables](https://vercel.com/docs/configuration#project/build-env) that you
may configure for your serverless functions.

| Name           | Description                                           | Default  |
|----------------|-------------------------------------------------------|----------|
| `DART_CHANNEL` | The `dart` channel that serverless function will use. | `stable` |
| `DART_VERSION` | The `dart` version that serverless function will use. | `2.10.5` |

> Note that you need to use dart version `>= 2.6` for `dart2native` to work.

Learn more about dart channels and versions [here](https://dart.dev/tools/sdk/archive).

## FAQ

### Can I use `pubspec.yaml`?

Yes, just make sure it is at the same directory level as the function. The runtime will automatically run `pub get` before building the binary file.

### Is it fast?

I'm not sure because I don't know how to benchmark. But according to my experience, it feels like it's really fast. I may be biased so help me benchmark it if you know how to.

### Can I run it with `vercel dev` locally?

Yes, but because it won't install `dart` during development, make sure your machine has a working version of `dart >= 2.6` installed properly.

## Acknowledgement

While I was trying to build this, because I didn't any prior experience with things, a lot of open-source libraries/projects were very useful to me. The prominent ones of them are [now-rust](https://github.com/mike-engel/now-rust), [vercel-bash](https://github.com/importpw/vercel-bash), [vercel-deno](https://github.com/TooTallNate/vercel-deno) and [aws-lambda-dart-runtime](https://github.com/awslabs/aws-lambda-dart-runtime).

## License

MIT © Frenco
