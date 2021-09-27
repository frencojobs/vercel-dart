import 'package:aws_lambda_dart_runtime/aws_lambda_dart_runtime.dart' as aws;
import 'package:json_annotation/json_annotation.dart';
import 'package:shelf/shelf.dart' show Request;

import '../utils/request_from_json.dart';

part 'event.g.dart';

@JsonSerializable(createToJson: false)
class Event extends aws.Event {
  @JsonKey(name: 'Action')
  final String action;

  @JsonKey(fromJson: requestFromJson)
  final Request body;

  Event({
    required this.action,
    required this.body,
  });

  factory Event.fromJson(Map<String, dynamic> json) => _$EventFromJson(json);
}
