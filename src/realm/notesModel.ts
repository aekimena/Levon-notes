import Realm from 'realm';

export class Notes extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  title!: String;
  body!: String;
  isSelected!: Boolean;
  time!: String;
  createdAt!: Date;

  static schema = {
    name: 'Notes',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      title: 'string',
      body: 'string',
      isSelected: {type: 'bool', default: false},
      time: 'string',
      createdAt: 'date',
    },
  };
}
