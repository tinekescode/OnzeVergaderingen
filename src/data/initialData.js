export default {
    "Medewerkers": [
        {
            "id": 1,
            "name": "Jan Jansen",
            "email": "j.jansen@mail.nl",
            "functie": "Voorzitter",
            "taken": {
                "1": "Voorzitten",
                "2": "Notuleren"
            },
            "checkedTasks": {}
        },
        {
            "id": 2,
            "name": "Piet Pietersen",
            "email": "p.pietersen@mail.nl",
            "functie": "Secretaris",
            "taken": {
                "1": "Verslag maken",
                "2": "Agenda opstellen"
            },
            "checkedTasks": {}
        },
        {
            "id": 3,
            "name": "Klaas Klaassen",
            "email": "k.klaassen@mail.nl",
            "functie": "Penningmeester",
            "taken": {
                "1": "Financiën beheren",
                "2": "Budget opstellen"
            },
            "checkedTasks": {}
        },
        {
            "id": 4,
            "name": "Marie Maries",
            "email": "m.maries@mail.nl",
            "functie": "Lid",
            "taken": {
                "1": "Deelnemen aan vergaderingen",
                "2": "Stemmen"
            },
            "checkedTasks": {}
        },
        {
            "id": 5,
            "name": "Anna Annas",
            "email": "a.annas@mail.nl",
            "functie": "Lid",
            "taken": {
                "1": "Deelnemen aan vergaderingen",
                "2": "Stemmen"
            },
            "checkedTasks": {}
        }
    ],
    "Gepland": [
        {
            "id": 1,
            "title": "Vergadering 1",
            "date": "2021-05-01",
            "agenda": {
                "1": "Opening",
                "2": "Bespreking",
                "3": "Rondvraag",
                "4": "Sluiting"
            },
            "attendees": [1, 2, 3] // Voorzitter, Secretaris, Penningmeester
        },
        {
            "id": 2,
            "title": "Vergadering 2",
            "date": "2021-06-01",
            "agenda": {
                "1": "Opening",
                "2": "Bespreking",
                "3": "Rondvraag",
                "4": "Sluiting"
            },
            "attendees": [1, 2, 4, 5] // Voorzitter, Secretaris, and both Leden
        },
        {
            "id": 3,
            "title": "Vergadering 3",
            "date": "2021-07-01",
            "agenda": {
                "1": "Opening",
                "2": "Bespreking",
                "3": "Rondvraag",
                "4": "Sluiting"
            },
            "attendees": [1, 3, 4] // Voorzitter, Penningmeester, and one Lid
        },
        {
            "id": 4,
            "title": "Vergadering 4",
            "date": "2021-08-01",
            "agenda": {
                "1": "Opening",
                "2": "Bespreking",
                "3": "Rondvraag",
                "4": "Sluiting"
            },
            "attendees": [2, 3, 5] // Secretaris, Penningmeester, and one Lid
        },
        {
            "id": 5,
            "title": "Vergadering 5",
            "date": "2021-09-01",
            "agenda": {
                "1": "Opening",
                "2": "Bespreking",
                "3": "Rondvraag",
                "4": "Sluiting"
            },
            "attendees": [1, 2, 3, 4, 5] // All members
        }
    ]
};