import 'package:json_annotation/json_annotation.dart';
import 'package:shelf/shelf.dart' show Request;

import 'package:vercel_dart/src/utils/request_from_json.dart';

part 'event.g.dart';

@JsonSerializable(createToJson: false)
class Event {
  @JsonKey(name: 'Action')
  final String action;

  @JsonKey(fromJson: requestFromJson)
  final Request body;

  const Event({
    required this.action,
    required this.body,
  });

  factory Event.fromJson(Map<String, dynamic> json) => _$EventFromJson(json);
}
