part of '../runtime.dart';

class Invocation {
  final Map<String, dynamic> event;
  final String awsRequestId;

  const Invocation({
    required this.event,
    required this.awsRequestId,
  });

  static final _client = http.Client();
  static Uri _url(String path) {
    const runtimePath = '2018-06-01/runtime';
    return Uri.parse('http://${Platform.environment['AWS_LAMBDA_RUNTIME_API']}/$runtimePath/$path');
  }

  static Future<Invocation> next() async {
    final res = await _client.get(_url('invocation/next'));

    if (res.statusCode != 200) {
      throw Exception('Unexpected "/invocation/next" response: $res');
    }

    final traceId = res.headers['lambda-runtime-trace-id'];
    const xAmznTraceId = '_X_AMZN_TRACE_ID';

    if (traceId != null) {
      Platform.environment[xAmznTraceId] = '';
    } else {
      Platform.environment.remove(xAmznTraceId);
    }

    final awsRequestId = res.headers['lambda-runtime-aws-request-id'];
    if (awsRequestId == null) {
      throw Exception('Did not receive "lambda-runtime-aws-request-id" header');
    }

    return Invocation(
      event: jsonDecode(res.body) as Map<String, dynamic>,
      awsRequestId: awsRequestId,
    );
  }

  static Future<void> postError(String awsRequestId, Exception error, StackTrace stacktrace) async {
    final invocationError = {
      'error': {
        'errorType': 'InvocationError',
        'errorMessage': error.toString(),
      },
      'stacktrace': stacktrace,
    };

    _client.post(
      _url('invocation/$awsRequestId/error'),
      body: jsonEncode(invocationError),
      headers: {'Content-Type': 'application/json'},
    );
  }

  static Future<void> respond(shelf.Response result, String awsRequestId) async {
    final res = await _client.post(
      _url('invocation/$awsRequestId/response'),
      body: jsonEncode(result),
      headers: {'Content-Type': 'application/json'},
    );

    if (res.statusCode != 202) {
      throw Exception('Unexcepted "/invocation/response" response: $res');
    }
  }
}
