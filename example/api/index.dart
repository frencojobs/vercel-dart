import 'package:shelf/shelf.dart';

Future<Response> handler(Request req) async {
  return Response.ok('Hey from ${req.url} of Serverless Dart');
}
