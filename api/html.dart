import 'dart:io';
import 'package:shelf/shelf.dart';

Response handler(Request req) {
  final data = '''
    <h1>Hello, World</h1>
  ''';

  return Response.ok(
    data,
    headers: {
      'content-type': ContentType.html.toString(),
    },
  );
}
