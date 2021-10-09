import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:shelf/shelf.dart' as shelf;

part 'src/aws.dart';

/// AWS Lambda Runtime
///
/// Based on the lambda runtime implementation of
/// https://github.com/vercel-community/deno.
Future<void> handle(shelf.Handler handler) async {
  while (true) {
    final next = await Invocation.next();
    shelf.Response? result;

    try {
      final data = jsonDecode(next.event['body'] as String);
      final req = _requestFromJson(data as Map<String, dynamic>);
      final res = await handler(req);

      result = res;
    } catch (e, stacktrace) {
      final err = e is! Exception ? Exception(e) : e;
      stderr.writeln(err);
      await Invocation.postError(next.awsRequestId, err, stacktrace);
      continue;
    }
    await Invocation.respond(result, next.awsRequestId);
  }
}

shelf.Request _requestFromJson(Map<String, dynamic> map) {
  final host = map['host'] as String;
  final path = map['path'] as String;

  return shelf.Request(
    map['method'] as String,
    Uri.parse('http${host.startsWith('localhost') ? '' : 's'}://$host$path'),
    headers: map['headers'] as Map<String, Object>,
    body: map['body'],
  );
}
