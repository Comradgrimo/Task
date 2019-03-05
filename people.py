# -*- coding: utf-8 -*-
"""
This is the people module and supports all the REST actions for the
people data
"""

from flask import make_response, abort
from config import db
from models import Person, PersonSchema


def read_all():
    """
    This function responds to a request for /api/people
    with the complete lists of people

    :return:        json string of list of people
    """
    # Create the list of people from our data
    people = Person.query.order_by(Person.fio).all()                    # сортировка.отображение

    # Serialize the data for the response
    person_schema = PersonSchema(many=True)
    data = person_schema.dump(people).data
    return data


def read_one(office):
    """
    This function responds to a request for /api/people/{office}
    with one matching person from people

    :param office:   office of person to find
    :return:            person matching id
    """
    # Get the person requested
    person = Person.query.filter(Person.office == office).all() #################################

    # Did we find a person?
    if person is not None:

        # Serialize the data for the response
        person_schema = PersonSchema()
        data = person_schema.dump(person).data
        return data

    # Otherwise, nope, didn't find that person
    else:
        abort(
            404,
            "Person not found for Id: {office}".format(office=office),
        )


def create(person):
    """
    This function creates a new person in the people structure
    based on the passed in person data

    :param person:  person to create in people structure
    :return:        201 on success, 406 on person exists
    """
    fio = person.get("fio")
    birthday = person.get("birthday")
    office = person.get("office")   #______________#______________

    existing_person = (
        Person.query.filter(Person.fio == fio)
        .filter(Person.birthday == birthday)
        .filter(Person.office == office) #______________#______________
        .one_or_none()
    )

    # Can we insert this person?
    if existing_person is None:

        # Create a person instance using the schema and the passed in person
        schema = PersonSchema()
        new_person = schema.load(person, session=db.session).data

        # Add the person to the database
        db.session.add(new_person)
        db.session.commit()

        # Serialize and return the newly created person in the response
        data = schema.dump(new_person).data

        return data, 201

    # Otherwise, nope, person exists already
    else:
        abort(
            409,
            "Person {fio} {birthday} {office} exists already".format(
                fio=fio, birthday=birthday, office=office
            ),
        )


def update(office, person):
    """
    This function updates an existing person in the people structure

    :param office:   Id of the person to update in the people structure
    :param person:      person to update
    :return:            updated person structure
    """
    # Get the person requested from the db into session
    update_person = Person.query.filter(
        Person.office == office
    ).one_or_none()

    # Did we find a person?
    if update_person is not None:

        # turn the passed in person into a db object
        schema = PersonSchema()
        update = schema.load(person, session=db.session).data

        # Set the id to the person we want to update
        update.id = update_person.office

        # merge the new object into the old and commit it to the db
        db.session.merge(update)
        db.session.commit()

        # return updated person in the response
        data = schema.dump(update_person).data

        return data, 200

    # Otherwise, nope, didn't find that person
    else:
        abort(
            404,
            "Person not found for Id: {office}".format(office=office),
        )


def delete(office):
    """
    This function deletes a person from the people structure

    :param office:   Id of the person to delete
    :return:            200 on successful delete, 404 if not found
    """
    # Get the person requested
    person = Person.query.filter(Person.office == office).one_or_none()

    # Did we find a person?
    if person is not None:
        db.session.delete(person)
        db.session.commit()
        return make_response(
            "Person {office} deleted".format(office=office), 200
        )

    # Otherwise, nope, didn't find that person
    else:
        abort(
            404,
            "Person not found for Id: {office}".format(office=office),
        )
