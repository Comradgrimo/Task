from datetime import datetime
from config import db, ma


class Person(db.Model):
    __tablename__ = 'person'
    person_id = db.Column(db.Integer, primary_key=True)
    fio = db.Column(db.String(32))
    birthday = db.Column(db.String(32))
    office = db.Column(db.String(32))
    timestamp = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )


class PersonSchema(ma.ModelSchema):
    class Meta:
        model = Person
        sqla_session = db.session
