## es_api: A short API for searching indices in Elasticsearch.


The app can be installed by running `npm install` inside the root directory and started by running `npm run serve`. Tests can be run with `npm test`, but require the app to be shutdown to work correctly.

SQLite and Elasticsearch are required, with Elasticsearch running on `localhost:9200`.

The populate endpoints (`/populate/sql`, `/populate/es`) should be visited after installing and running the app. This can be done from the corresponding buttons on `/`. These will delete and repopulate the databases. Be aware `/populate/es` **will delete all indices**, not just the four created for this app. Running tests will also call both populate endpoints, to the same effect.

Users all own an index that they can access. Advanced users may access their index, and others that are not owned by another advanced user.

The search assumes a user 'foo' is logged in.

---

The following indices exist in Elasticsearch:

* foo_index: characters with first names start with 'f'
* bar_index: real people
* baz_index: fictional people
* buzz_index: all characters, real and fictional

Each Elasticseach document is in this format:
* _index
* _type: "docs"
* _source
  * first_name
  * last_name
  * location

User/Index metadata is stored in `./db/sqlite.db`:
* Users
  * id
  * username
  * is_advanced
* Indices
  * id
  * name
  * owner
  * description

---

The following endpoints exist:

* `/`
  * display all app functionality and results
* `/users`
  * return 200 with list of users
* `/users/<username>`
  * return 200 with indices username has access to
  * return 404 if user does not exist
* `/populate`
  * return 200 with description of other populate endpoints
* `/populate/sql`
  * return 201 and delete and recreate sqlite db
  * return 500 on error
* `/populate/es`
  * return 201 and delete and recreate _all_ es indices
  * return 500 on error
* `/_search/<index>/q="<parameter>:<search term>"`
  * return 200 with document results
  * return 403 if no access to index

---

Here are sample commands to create and update Elasticsearch records:

The basic structure of the url is: `localhost:9200/<index_name>/<document_type>/<document_id>`

POST (new document) to Elasticsearch:
`curl -XPOST localhost:9200/baz_index/docs -H 'Content-Type: application/json' -d '{ "first_name": "frodo","last_name": "baggins","location": "shire"}'`

PUT (update document) to Elasticseach:
`curl -XPUT localhost:9200/baz_index/docs/p_j7xGgB3H2p1QhDcjDJ -H 'Content-Type: application/json' -d '{ "first_name": "samwise","last_name": "gamgee","location": "shire"}'`
