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
