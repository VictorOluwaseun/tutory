# tutory

## A tutoring app built with Node, Express, MongoDB and other technologies

This app has three categories of users: Admin, tutors and students. Every user needs an email, first name, surname and password to sign up.

To sign in as an admin:

```JSON
{
  email: admin@tutory.io
  password: test1234
}
```

Admin/Students/tutors can retrieve a subject in a category (by Id) using:

```curl
 https://tutory.io/api/v1/categories/{categoryID}/subjects/{subjectsID}
```

e.g

```https
https://tutory.io/api/v1/categories/5eb993f20cd35b2c3461cc43/subjects/5ebd2f2f44b7db3a54497d63

```

Admin/Students /tutors can retrieve all subjects, by category

```curl
 https://tutory.io/api/v1/categories/{categoryID}/subjects
```

e.g.

```https
https://tutory.io/api/v1/categories/5eb993f20cd35b2c3461cc43/subjects
```

Admin/Students /tutors can search for subjects by name, sorted alphabetically in ascending order.

multiple query

```https
https://tutory.io/api/v1/subjects?name=mathematics&sort=name
```

| Key  | Value                        | Description    |
| ---- | ---------------------------- | -------------- |
| name | {any value} e.g. Mathematics | Search by name |
| sort | {any value} e.g. name        | sort by name   |

## **`Authentication`**

Admin/Students /tutors can sign in:

Submit a `POST` request to https://tutory.io/api/v1/users

| Request | Endpoint                             | Description  |
| ------- | ------------------------------------ | ------------ |
| POST    | https://tutory.io/api/v1/users/login | User Login   |
| POST    | https://tutory.io/api/v1/users       | User Sign in |
