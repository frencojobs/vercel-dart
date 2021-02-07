# Vercel-Dart

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
    "api/**/*.dart": { "runtime": "vercel-dart@1.0.2" }
  }
}
```

Check out a hosted version of this demo at [vercel-dart.vercel.app/api/hello](https://vercel-dart.vercel.app/api/hello). More examples available in the repository's `example` folder.

## FAQ

### Why does it use shelf?

Because shelf is arguably the most famous server-side dart library available.

### Can I use `pubspec.yaml`?

Yes, just make sure it is at the same directory level as the function. The runtime will automatically run `pub get` before building the binary file.

### Do I need to import the `vercel_dart` library in `pubspec.yaml`?

No. The runtime will automatically install that library before compiling. No need to import it yourself.

### Is it fast?

Idk, I don't know how to benchmark. Please help if you know.

## Acknowledgement

While I was trying to build this, because I didn't any prior experience with things, a lot of open-source libraries/projects were very useful to me. The prominent ones of them are [now-rust](https://github.com/mike-engel/now-rust), [vercel-bash](https://github.com/importpw/vercel-bash), [vercel-deno](https://github.com/TooTallNate/vercel-deno) and [aws-lambda-dart-runtime](https://github.com/awslabs/aws-lambda-dart-runtime).

## License

MIT © Frenco
