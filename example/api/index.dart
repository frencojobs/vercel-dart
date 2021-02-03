import 'package:shelf/shelf.dart';

Future<Response> handler(Request req) async {
  return Response.ok('Hey from Serverless Dart');
}
