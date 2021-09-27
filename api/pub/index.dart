import 'dart:convert';
import 'dart:io';

import 'package:pub_api_client/pub_api_client.dart';
import 'package:shelf/shelf.dart';

Future<Response> handler(Request req) async {
  final client = PubClient();

  final package = req.requestedUri.queryParameters['package'];
  final score = await client.packageScore(package!);

  final data = {
    'likes': score.likeCount,
    'points': score.grantedPoints,
    'popularity': score.popularityScore
  };

  return Response.ok(
    jsonEncode(data),
    headers: {
      'content-type': ContentType.json.toString(),
    },
  );
}
