@app
cogs-kings-of-war

@aws
region eu-west-2
runtime nodejs18.x
policies
  arn:aws:iam::296681679694:policy/SESSendOnly
  architect-default-policies

@http
/*
  method any
  src server

@static

@tables
user
  email *String
  encrypt true

password
  email *String
  encrypt true

session
  sessionId *String
  ttl **Number

attendee
  eventSlug *String
  email **String
  encrypt true
