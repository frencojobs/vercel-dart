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

Check out a hosted version of this demo at [vercel-dart.vercel.app/api/hello](https://vercel-dart.vercel.app/api/hello). More examples available in the repository's `api` folder.

## Configuration

Here are the [build environment
variables](https://vercel.com/docs/configuration#project/build-env) that you
may configure for your serverless functions.

| Name           | Description                                           | Default  |
|----------------|-------------------------------------------------------|----------|
| `DART_CHANNEL` | The `dart` channel that serverless function will use. | `stable` |
| `DART_VERSION` | The `dart` version that serverless function will use. | `2.10.5` |

> Note that you need to use the dart version `>= 2.6` for `dart2native` compiler to work. 

## FAQ

### Why does it use shelf?

Two reasons. First is because shelf is arguably the most famous server-side dart library available. Second is because I'm thinking about implementing the local server for better performance during the development. I haven't done that, but it's definitely a way to go.

### Can I use `pubspec.yaml`?

Yes, just make sure it is at the same directory level as the function. The runtime will automatically run `pub get` before building the binary file.

### Is it fast?

Idk, I don't know how to benchmark. But according to my experience, it feels like it's really fast except for the cold starts. Help me benchmark it if you know how to.

### Can I run it with `vercel dev` locally?

Yes, but it might be a little bit slower than on the server because I haven't implement a performance-wise development server yet. Because it won't install `dart` during development, make sure your machine have a working version of `dart >= 2.6` installed properly.

## Acknowledgement

While I was trying to build this, because I didn't any prior experience with things, a lot of open-source libraries/projects were very useful to me. The prominent ones of them are [now-rust](https://github.com/mike-engel/now-rust), [vercel-bash](https://github.com/importpw/vercel-bash), [vercel-deno](https://github.com/TooTallNate/vercel-deno) and [aws-lambda-dart-runtime](https://github.com/awslabs/aws-lambda-dart-runtime).

## License

MIT © Frenco
