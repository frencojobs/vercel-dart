import 'dart:io' show Platform;
import 'package:shelf/shelf.dart';

Response handler(Request req) {
  final version = Platform.version.split(" ").first;
  return Response.ok('Hello, from Dart v$version!');
}
