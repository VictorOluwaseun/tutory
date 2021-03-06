# [tutory](https://tutory-sn.herokuapp.com)

## A tutoring app built using Node, Express, MongoDB and other technologies

This app has three categories of users: Admin, tutors and students. Every user needs an email, first name, surname and password to sign up.

To sign in as an admin:

```JSON
{
  email: admin@tutory.io
  password: test1234
}
```

### `Table of Contents`

1. [Authetication](#authentication-)
2. [Users](#users-)
3. [Categories](#categories-)
4. [Subjects](#subjects-)
5. [Lessons](#lessons-)
6. [Registers](#registers-)
   `

Admin/Students/tutors can retrieve a subject in a category (by Id) using:

```curl
 https://tutory-sn.herokuapp.com/api/v1/categories/{categoryID}/subjects/{subjectsID}
```

e.g

```https
https://tutory-sn.herokuapp.com/api/v1/categories/5eb993f20cd35b2c3461cc43/subjects/5ebd2f2f44b7db3a54497d63

```

Admin/Students /tutors can retrieve all subjects, by category

```curl
 https://tutory-sn.herokuapp.com/api/v1/categories/{categoryID}/subjects
```

e.g.

```https
https://tutory-sn.herokuapp.com/api/v1/categories/5eb993f20cd35b2c3461cc43/subjects
```

Admin/Students /tutors can search for subjects by name, sorted alphabetically in ascending order.

multiple query

```https
https://tutory-sn.herokuapp.com/api/v1/subjects?name=mathematics&sort=name
```

| Key  | Value                        | Description    |
| ---- | ---------------------------- | -------------- |
| name | {any value} e.g. Mathematics | Search by name |
| sort | {any value} e.g. name        | sort by name   |

## **`Authentication`** [^](#table-of-contents)

**`Headers`**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON TYPE   |

Admin/Students/tutors sign in:

Submit a `POST` request to https://tutory-sn.herokuapp.com/api/v1/users/login

```JSON
{
  email: adejohn@tutory.io,
  password: test1234
}
```

Student signs up:

Submit a `POST` request to https://tutory-sn.herokuapp.com/api/v1/users/signup

```JSON
{
  surname: "John",
  fistName: "Ade",
  email: adejohn@tutory.io,
  password: test1234
}
```

Tutor signs up:

Submit a `POST` request to https://tutory-sn.herokuapp.com/api/v1/users/signup/tutor

**`Body`**

```JSON
{
  surname: "John",
  fistName: "Seun",
  email: seunjohn@tutory.io,
  password: test1234
}
```

Admin/Students/tutors gets user details:

Submit a `GET` request to https://tutory-sn.herokuapp.com/api/v1/users/me

Admin/Students/tutors can use forgotPassword route:

Make a POST request to https://tutory-sn.herokuapp.com/api/v1/users/forgotPassword

Admin/Students/tutors can use resetPassword route:

Make a PATCH to https://tutory-sn.herokuapp.com/api/v1/users/resetPassword/4ad8b43a5f75d031acc6d20ae3d24f062a361d46

Admin/Students/tutors can use update user details route:

Make a PATCH to https://tutory-sn.herokuapp.com/api/v1/users/updateMe

Admin/Students/tutors can use updatePassword route:

Make a POST to https://tutory-sn.herokuapp.com/api/v1/users/updatePassword

Admin/Students/tutors can use logout route:

Make a GET to https://tutory-sn.herokuapp.com/api/v1/users/logout

GET:: Admin/Students can search for tutors by first name https://tutory-sn.herokuapp.com/api/v1/users/search/tutors?firstName[regex]=leo&firstName[options]=i

query string :

firstName[regex]=tutor's firstname |

firstName[options]=i | meaning case insensitve

<!-- ```JSON
{
    "email": "nagiatzi@gmail.com",
    "password": "123456"
}
``` -->

| Request | Endpoints                                                         | Description                                                                  |
| ------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| POST    | https://tutory-sn.herokuapp.com/api/v1/users/login                | User Login                                                                   |
| POST    | https://tutory-sn.herokuapp.com/api/v1/users/signup               | User Sign up for Student                                                     |
| GET     | https://tutory-sn.herokuapp.com/api/v1/users/me                   | Get Logged in User                                                           |
| POST    | https://tutory-sn.herokuapp.com/api/v1/users/forgotPassword       | Forgot Password (Send an email token for forogoten password)                 |
| PATCH   | https://tutory-sn.herokuapp.com/api/v1/users/resetPassword/:token | Reset Password (Reset a password for a user with a tokken from the database) |
| PATCH   | https://tutory-sn.herokuapp.com/api/v1/users/updateMe             | Update User Details (Patch method to update user details)                    |
| PATCH   | https://tutory-sn.herokuapp.com/api/v1/users/updatePassword       | Change users password with 2 fields from req.body: new and current password  |
|         |
| GET     | https://tutory-sn.herokuapp.com/api/v1/users/logout               | Logout User (Logout user and clean cookies)                                  |

## **`Users`** [^](#table-of-contents)

**`Headers`**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON TYPE   |

**`Endpoints`**

| Request | Endpoints                                                                                            | Description                                           |
| ------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| POST    | https://tutory-sn.herokuapp.com/api/v1/users                                                         | Admin can create user                                 |
| PATCH   | https://tutory-sn.herokuapp.com/api/v1/users/:id                                                     | Admin can update any user by id                       |
| DELETE  | https://tutory-sn.herokuapp.com/api/v1/users/:id                                                     | Admin can delete user by id                           |
| GET     | https://tutory-sn.herokuapp.com/api/v1/users                                                         | Admin can get all users                               |
| GET     | https://tutory-sn.herokuapp.com/api/v1/users/:id                                                     | Admin can get a user by id                            |
| PATCH   | https://tutory-sn.herokuapp.com/api/v1/users/updateMyPassword                                        | User can update his/her password                      |
| GET     | https://tutory-sn.herokuapp.com/api/v1/users/me                                                      | User can get his/her profile                          |
| PATCH   | https://tutory-sn.herokuapp.com/api/v1/users/updateMe                                                | User can update his/her profile except password       |
| DELETE  | https://tutory-sn.herokuapp.com/api/v1/users/deleteMe                                                | User can delete his/her account                       |
| GET     | https://tutory-sn.herokuapp.com/api/v1/users/search/tutors?firstName[regex]=leo&firstName[options]=i | Admin and Student can search for tutors by first name |

**_Get all registers_**

GET:: https://tutory-sn.herokuapp.com/api/v1/registers

**_Get a registered subject_**

GET:: https://tutory-sn.herokuapp.com/api/v1/registers/5ebd2f2f44b7db3a54497d63

**_Create a register_**

POST:: https://tutory-sn.herokuapp.com/api/v1/categories/5eb99279a86d8830d46b5a7e/subjects/5ebd2f2f44b7db3a54497d63/registers

```JSON
{
  "qualifications":["BEng"]
}
```

Other fields get filled from routes.

OR

POST:: https://tutory-sn.herokuapp.com/api/v1/categories/5eb99279a86d8830d46b5a7e/subjects/5ebd2f2f44b7db3a54497d63/registers

```JSON
{
"qualifications":["BEng"],
"subject": "5ebd2f2f44b7db3a54497d63",
"category": "5eb99279a86d8830d46b5a7e"
}
```

**_Update a register_**

PATCH:: https://tutory-sn.herokuapp.com/api/v1/registers/5ebd2f2f44b7db3a54497d63

```JSON
{
"qualifications":["MEng","BEng"],
"subject": "5ebd2f2f44b7db3a54497d63",
"category": "5eb99279a86d8830d46b5a7e"
}
```

**_Delete a register_**

DELETE:: https://tutory-sn.herokuapp.com/api/v1/registers/5ebd2f2f44b7db3a54497d63

## **`Categories`** [^](#table-of-contents)

Categories has three 3 categories which are primary, JSS or SSS

**`Headers`**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON TYPE   |

**`Endpoints`**

| Request | Endpoints                                                    | Description                                  |
| ------- | ------------------------------------------------------------ | -------------------------------------------- |
| POST    | https://tutory-sn.herokuapp.com/api/v1/categories            | Admin can create category                    |
| PATCH   | https://tutory-sn.herokuapp.com/api/v1/categories/categoryId | Admin can update category                    |
| DELETE  | https://tutory-sn.herokuapp.com/api/v1/categories/categoryId | Admin can delete category                    |
| GET     | https://tutory-sn.herokuapp.com/api/v1/categories            | Admin/tutor/student can get all categories   |
| GET     | https://tutory-sn.herokuapp.com/api/v1/categories/categoryId | Admin/tutor/student can get a category by Id |

**_Create a category_**

```JSON
{
	"name":"primary",
	"value": 6
}
```

Be mindful of the case. i.e. JSS not jss, but primary is lower case

```JSON
{
	"name":"JSS",
	"value": 1
}
```

**_Get a category_**

https://tutory-sn.herokuapp.com/api/v1/categories/5eb99279a86d8830d46b5a7e

categoryId = 5eb99279a86d8830d46b5a7e

**_Get all categories_**

https://tutory-sn.herokuapp.com/api/v1/categories

**_Delete a category_**

https://tutory-sn.herokuapp.com/api/v1/categories/5eb99279a86d8830d46b5a7e

categoryId = 5eb99279a86d8830d46b5a7e

**_Update a category_**

https://tutory-sn.herokuapp.com/api/v1/categories/5eb99279a86d8830d46b5a7e

categoryId = 5eb99279a86d8830d46b5a7e

## **`Subjects`** [^](#table-of-contents)

**`Headers`**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON TYPE   |

**`Endpoints`**

| Request | Endpoints                                                                               | Description                                                |
| ------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| POST    | https://tutory-sn.herokuapp.com/api/v1/categories/categoryId/subjects                   | Admin can create subject under the three categories        |
| PATCH   | https://tutory-sn.herokuapp.com/api/v1/categories/categoryId/subjects/subjectId         | Admin can update subject in a category                     |
| DELETE  | https://tutory-sn.herokuapp.com/api/v1/categories/categoryId/subjects/subjectId         | Admin can delete subject in a category                     |
| GET     | https://tutory-sn.herokuapp.com/api/v1/categories/categoryId/subjects                   | Admin/tutor/student can get all categories                 |
| GET     | https://tutory-sn.herokuapp.com/api/v1/subjects/subjectId                               | Admin/tutor/student can get a subject by Id                |
| GET     | https://tutory-sn.herokuapp.com/api/v1/subjects?name[regex]=subjectName&name[options]=i | Admin/tutor/student can search for subject. sorted by name |

**_Get all subjects in a category_**

GET:: https://tutory-sn.herokuapp.com/api/v1/categories/5ebfdfa01bd34a0017d9d82b/subjects

categoryId = 5ebfdfa01bd34a0017d9d82b

**_Get a subject in a category_**

https://tutory-sn.herokuapp.com/api/v1/categories/5ebfdfa01bd34a0017d9d82b/subjects/5ec0eee7011c5a00170987c2

categoryId = 5ebfdfa01bd34a0017d9d82b

subjectId = 5ec0eee7011c5a00170987c2

**_Get all subjects_**

GET:: https://tutory-sn.herokuapp.com/api/v1/subjects

**_Get a subject_**

GET:: https://tutory-sn.herokuapp.com/api/v1/subjects/5ebd2f2f44b7db3a54497d63

**_Search for subject. Sorted by name by default._**

GET:: https://tutory-sn.herokuapp.com/api/v1/subjects?name[regex]=economics&name[options]=i

query string = name _name is lower case_ |
subjectName=economics _subjectName is case insensitive_

name[regex]= subjectName | regex means regular expression

name[options] = i | meaning in lowercase

**_Create a subject_**

POST:: https://tutory-sn.herokuapp.com/api/v1/categories/5eb993f20cd35b2c3461cc43/subjects

```JSON
{
"name":"Basic Science"
}
```

OR

POST:: https://tutory-sn.herokuapp.com/api/v1/subjects

```JSON
{
"name":"Basic Science",
"category": "5eb993f20cd35b2c3461cc43"
}
```

**_Update a subject_**

PATCH:: https://tutory-sn.herokuapp.com/api/v1/categories/5ebfdfa01bd34a0017d9d82b/subjects/5ec0eee7011c5a00170987c2

```JSON
{
"name":"Basic Technology"
}
```

**_Update a subject and its category_**

PATCH:: https://tutory-sn.herokuapp.com/api/v1/subjects/5ec0eee7011c5a00170987c2

```JSON
{
"name":"Basic Technology",
"category": "5eb993f20cd35b2c3461cc42"
}
```

**_Delete a subject in category_**

DELETE:: https://tutory-sn.herokuapp.com/api/v1/categories/5ebfdfa01bd34a0017d9d82b/subjects/5ec0eee7011c5a00170987c2

## **`Lessons`** [^](#table-of-contents)

**`Headers`**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON TYPE   |

**`Endpoints`**

| Request | Endpoints                                          | Description                         |
| ------- | -------------------------------------------------- | ----------------------------------- |
| POST    | https://tutory-sn.herokuapp.com/api/v1/lessons     | Admin and student can book a lesson |
| PATCH   | https://tutory-sn.herokuapp.com/api/v1/lessons/:id | Admin can update a lesson           |
| DELETE  | https://tutory-sn.herokuapp.com/api/v1/lessons/:id | Admin can delete a lesson           |
| GET     | https://tutory-sn.herokuapp.com/api/v1/lessons     | Admin can get all lessons           |
| GET     | https://tutory-sn.herokuapp.com/api/v1/lessons/:id | Admin can get a lesson by Id        |

**_Get all lessons_**

GET:: https://tutory-sn.herokuapp.com/api/v1/lessons

**_Get all lessons in subject_**

GET:: https://tutory-sn.herokuapp.com/api/v1/subjects/5ec0eee7011c5a00170987c2/lessons

subjectId = 5ec0eee7011c5a00170987c2

**_Get a lesson_**

GET:: https://tutory-sn.herokuapp.com/api/v1/lessons/5ebd2f2f44b7db3a54497d63

**_Book a lesson_**

POST:: https://tutory-sn.herokuapp.com/api/v1/lessons

```JSON
{
"name":"Supply",
"body": "What is a supply" <==OPTIONAL,
"subject":  "5ec0eee7011c5a00170987c2"
}
```

OR

POST:: https://tutory-sn.herokuapp.com/api/v1/subjects/5eb993f20cd35b2c3461cc43/lessons

```JSON
{
"name":"Supply",
"body": "What is a supply" <==OPTIONAL,
}
```

**_Update a lesson_**

PATCH:: https://tutory-sn.herokuapp.com/api/v1/lessons/5ebd2f2f44b7db3a54497d63

```JSON
{
"name":"Demand",
"body": "What is a demand" <==OPTIONAL,
}
```

**_Delete a lesson_**

DELETE:: https://tutory-sn.herokuapp.com/api/v1/lessons/5ebd2f2f44b7db3a54497d63

## **`Registers`** [^](#table-of-contents)

**`Headers`**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON TYPE   |

**`Endpoints`**

| Request | Endpoints                                                                                 | Description                                        |
| ------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------- |
| POST    | https://tutory-sn.herokuapp.com/api/v1/categories/categoryId/subjects/subjestId/registers | Tutor can register to take a subject in a category |
| PATCH   | https://tutory-sn.herokuapp.com/api/v1/registers/:id                                      | Tutor can update the correspond registered subject |
| DELETE  | https://tutory-sn.herokuapp.com/api/v1/registers/:id                                      | Tutor can delete the correspond registered subject |
| GET     | https://tutory-sn.herokuapp.com/api/v1/registers                                          | Tutor can get all the registered subjects          |
| GET     | https://tutory-sn.herokuapp.com/api/v1/registers/:id                                      | Tutor can get the registered subject by Id         |

**_Get all registers_**

GET:: https://tutory-sn.herokuapp.com/api/v1/registers

**_Get a registered subject_**

GET:: https://tutory-sn.herokuapp.com/api/v1/registers/5ebd2f2f44b7db3a54497d63

**_Create a register_**

POST:: https://tutory-sn.herokuapp.com/api/v1/categories/5eb99279a86d8830d46b5a7e/subjects/5ebd2f2f44b7db3a54497d63/registers

```JSON
{
  "qualifications":["BEng"]
}
```

Other fields get filled from routes.

OR

POST:: https://tutory-sn.herokuapp.com/api/v1/categories/5eb99279a86d8830d46b5a7e/subjects/5ebd2f2f44b7db3a54497d63/registers

```JSON
{
"qualifications":["BEng"],
"subject": "5ebd2f2f44b7db3a54497d63",
"category": "5eb99279a86d8830d46b5a7e"
}
```

**_Update a register_**

PATCH:: https://tutory-sn.herokuapp.com/api/v1/registers/5ebd2f2f44b7db3a54497d63

```JSON
{
"qualifications":["MEng","BEng"],
"subject": "5ebd2f2f44b7db3a54497d63",
"category": "5eb99279a86d8830d46b5a7e"
}
```

**_Delete a register_**

DELETE:: https://tutory-sn.herokuapp.com/api/v1/registers/5ebd2f2f44b7db3a54497d63
