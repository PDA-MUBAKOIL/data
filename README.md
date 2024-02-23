# data
collecting and preproccessing data

## proc

### 0. init

```
$ npm i
```

### 1. run crawler

```
$ node crawler.js
```

### 2. run gpt preproc.

`.env`

```
GPT_API_KEY='OPEN_AI_API_KEY'
```

```
$ node gpt_preprocessor.js
```

check gpt_failuer_log and manually modify data

### 3. modify data

```
$ node preprocessor.js
```

### 4. define model

`./models.js`

### 5. insert into db

`.env`

```
MONGO_HOST_URL='MONGO_DB_ENTRYPOINT'
```

```
$ npm insert_db.js
```