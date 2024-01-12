import Realm from 'realm';

export class Todos extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  body!: String;
  isAlertProvided!: Boolean;
  isCompleted!: Boolean;
  isSelected!: Boolean;
  alertTime!: {
    month: Number;
    year: Number;
    day: Number;
    hour: Number;
    minute: Number;
  };
  createdAt!: Date;

  static schema = {
    name: 'Todos',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      body: 'string',
      isCompleted: {type: 'bool', default: false},
      isAlertProvided: {type: 'bool', default: false},
      alertTime: 'int{}',
      isSelected: {type: 'bool', default: false},
      createdAt: 'date',
    },
  };
}
