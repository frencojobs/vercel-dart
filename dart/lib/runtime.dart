import 'package:aws_lambda_dart_runtime/aws_lambda_dart_runtime.dart' as aws;
import 'package:shelf/shelf.dart' as shelf;

import 'package:vercel_dart/src/models/event.dart';
import 'package:vercel_dart/src/utils/response_to_object.dart';

void handle(shelf.Handler handler, {String name = 'bootstrap'}) {
  // ignore: prefer_function_declarations_over_variables
  final aws.Handler<Event> _handler = (context, event) async {
    final res = await handler(event.body);
    return aws.InvocationResult(context.requestId, await responseToObject(res));
  };

  aws.Runtime()
    ..registerEvent<Event>((Map<String, dynamic> json) => Event.fromJson(json))
    ..registerHandler<Event>(name, _handler)
    ..invoke();
}
