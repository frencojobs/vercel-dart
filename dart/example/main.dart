import 'package:shelf/shelf.dart';
import 'package:vercel_dart/vercel_dart.dart' show handle;

void main() => handle((Request req) async {
      return Response.ok(req.url);
    });
