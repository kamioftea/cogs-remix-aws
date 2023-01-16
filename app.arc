@app
cogs-kings-of-war

@aws
region eu-west-2
runtime nodejs18.x

@http
/*
  method any
  src server

@static

@tables
user
  pk *String

password
  pk *String # userId

note
  pk *String  # userId
  sk **String # noteId
