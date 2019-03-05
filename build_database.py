# -*- coding: utf-8 -*-
import os
from config import db
from models import Person

# Data to initialize database with
PEOPLE = [
    {"fio": "Иванов И.И", "birthday": "11.01.11", "office": "Инженер"},
    {"fio": "Петров П.П", "birthday": "12.02.12", "office": "Уборщик"},
    {"fio": "Сидоров С.С", "birthday": "13.03.13", "office": "Главбух"},
]

# Delete database file if it exists currently
if os.path.exists("people.db"):
    os.remove("people.db")

# Create the database
db.create_all()

# iterate over the PEOPLE structure and populate the database
for person in PEOPLE:
    p = Person(fio=person.get("fio"), birthday=person.get("birthday"), office=person.get("office"))
    db.session.add(p)

db.session.commit()
