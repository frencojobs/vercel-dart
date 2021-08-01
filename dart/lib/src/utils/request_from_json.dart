import 'dart:convert' show Encoding, jsonDecode;

import 'package:shelf/shelf.dart' show Request;

Request requestFromJson(String input) {
  final map = jsonDecode(input) as Map<String, dynamic>;

  final method = map['method'] as String;
  final host = map['host'] as String;
  final path = map['path'] as String;
  final headers = map['headers'] as Map<String, Object>;
  final body = map['body'];
  final encoding = map['encoding'] as String? ?? '';

  return Request(
    method,
    Uri.parse(
        (host.startsWith('localhost:') ? 'http://' : 'https://') + host + path),
    headers: headers,
    body: body,
    encoding: Encoding.getByName(encoding),
  );
}
