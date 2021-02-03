import 'package:aws_lambda_dart_runtime/aws_lambda_dart_runtime.dart'
    show Runtime, InvocationResult, Handler;

import 'package:shelf/shelf.dart' show Request, Response;

import 'package:vercel_dart/src/models/event.dart';
import 'package:vercel_dart/src/utils/response_to_object.dart';

typedef Lambda = Future<Response> Function(Request);

void handle(Lambda handler, {String name = 'bootstrap'}) {
  // ignore: prefer_function_declarations_over_variables
  final Handler<Event> _handler = (context, event) async {
    final res = await handler(event.body);
    return InvocationResult(context.requestId, await responseToObject(res));
  };

  Runtime()
    ..registerEvent<Event>((Map<String, dynamic> json) => Event.fromJson(json))
    ..registerHandler<Event>(name, _handler)
    ..invoke();
}
