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

```
$ node gpt_preprocessor.js
```

check gpt_failuer_log and manually modify data

`.env`

```
GPT_API_KEY='OPEN_AI_API_KEY'
```

### 3. modify data

```
$ node preprocessor.js
```