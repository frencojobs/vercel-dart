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
