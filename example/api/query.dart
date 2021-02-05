import 'package:shelf/shelf.dart';

Response handler(Request req) {
  return Response.ok('Query is: ${req.requestedUri.query}');
}
