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

Admin/Students/tutors can retrieve a subject in a category (by Id) using http://tutory.com/api/v1/category/<>
