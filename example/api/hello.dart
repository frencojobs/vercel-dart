import 'dart:io' show Platform;
import 'package:shelf/shelf.dart';

Response handler(Request req) {
  return Response.ok('Hello, from Dart v${Platform.version.split(" ").first}!');
}
